const fileInput = document.getElementById("formFile");
const submitBtn = document.getElementById("submitBtn");
const clearBtn = document.getElementById("clearBtn");
const submitBtnProgress = document.getElementById("submitBtnProgress");
const uploadFolderList = document.getElementById("uploadFolderList");
const folderListEl = document.getElementById("folderList");
const folderButtonList = document.querySelectorAll(".folderButton");
const newFolderBtn = document.getElementById("newFolderBtn");
const newFolderInput = document.getElementById("newFolderName");

let folderList = [];
let newFolderList = [];

let isUploadingFiles = false;
const folderNameRegex = /^[a-zA-Z0-9_-]+$/;

const setIsLoading = (loading) => {
  isUploadingFiles = loading;
  submitBtnProgress.style.setProperty("--value", 0);
  submitBtnProgress.ariaValueNow = 0;
  submitBtnProgress.innerText = 0 + "%";
  if (loading) {
    submitBtn.classList.add("btn-loading");
  } else {
    submitBtn.classList.remove("btn-loading");
  }
};

const handleSubmitFiles = () => {
  if (fileInput.files.length > 0 && !isUploadingFiles) {
    isUploadingFiles = true;
    const data = new FormData();
    const selectedFiles = fileInput.files;

    let totalSize = 0;
    for (let i = 0; i < selectedFiles.length; i++) {
      file = selectedFiles[i];
      totalSize += file.size;
      data.append("files", file);
    }
    console.log({ totalSize });

    const xhr = new XMLHttpRequest();
    const params = new URLSearchParams({
      location: getUploadPath(),
    });
    xhr.open("POST", `/upload?${params}`);

    xhr.onload = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          const { success, failed } = response;
          success.forEach((filename) => newToast(`Success - ${filename}`));
          failed.forEach(([filename, reason]) =>
            newToast(`Failed - ${filename} - ${reason}`, "error")
          );
          handleClearInput();
        } else {
          newToast("Failed", "error");
        }
        setIsLoading(false);
      }
    };

    xhr.onerror = (e) => {
      newToast(e, "error");
    };

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const progressPct = (e.loaded / e.total) * 100;
        console.log(`Uploaded ${progressPct}%`);
        submitBtnProgress.style.setProperty("--value", progressPct);
        submitBtnProgress.ariaValueNow = progressPct;
        submitBtnProgress.innerText = Math.round(progressPct) + "%";
      }
    };

    if (totalSize > 1024 * 1024 * 10) setIsLoading(true);
    xhr.send(data);
  }
};

const handleClearInput = () => {
  fileInput.value = "";
};

const clearFolderList = () => {
  folderListEl.innerHTML = "";
};

const getUploadPath = () => {
  let path = "";
  for (const child of uploadFolderList.children) {
    path += child.textContent.trim() + "/";
  }
  return path.replace("root/", "");
};

const handleUploadFolderClick = async (e) => {
  const selectedFolder = e.currentTarget?.value ?? e.value;
  let currentFolder = uploadFolderList.lastElementChild.firstElementChild.value;
  if (selectedFolder !== currentFolder) {
    while (currentFolder !== selectedFolder && currentFolder !== "root") {
      uploadFolderList.lastChild.remove();
      currentFolder = uploadFolderList.lastElementChild.firstElementChild.value;
    }
    const uploadPath = getUploadPath();
    await getFolderBtnList(uploadPath);
  }
};

const handleFolderClick = async (e) => {
  const { value } = e.currentTarget;
  uploadFolderList.append(newBreadCrumb(value));
  const uploadPath = getUploadPath();
  await getFolderBtnList(uploadPath);
};

const renderFolderBtnList = () => {
  const allFolders = [...folderList, ...newFolderList];
  folderListEl.innerHTML = "";
  allFolders.sort();
  allFolders.forEach(addFolderBtn);
};

const getFolderBtnList = async (path) => {
  folderListEl.innerHTML = "";
  newFolderList = [];
  folderList = (await getFolders(path)) ?? [];
  renderFolderBtnList();
};

const addFolderBtn = (folderName) => {
  const folderBtn = newFolderButton(
    folderName,
    handleFolderClick,
    newFolderList.includes(folderName)
  );
  folderListEl.append(folderBtn);
};

const handleCreateFolder = async () => {
  const newFolderInputTxt = newFolderInput.value;
  if (newFolderInputTxt.length > 0 && folderNameRegex.test(newFolderInputTxt)) {
    const result = await createFolder(newFolderInputTxt, getUploadPath());
    if (result) {
      new_folder_modal.close();
      newToast("Success");
      newFolderList.push(newFolderInputTxt);
      renderFolderBtnList();
      newFolderInput.value = "";
    } else {
      newFolderInput.select();
    }
  }
};

const handleNewFolderCancel = () => {
  newFolderInput.value = "";
  folderNameHint.classList.remove("visible");
  new_folder_modal.close();
};

submitBtn.addEventListener("click", handleSubmitFiles);
clearBtn.addEventListener("click", handleClearInput);
newFolderBtn.addEventListener("click", handleCreateFolder);
newFolderInput.onkeydown = (e) => {
  if (e.code === "Enter") {
    handleCreateFolder();
  }
};
newFolderInput.addEventListener("input", (e) => {
  const folderNameHint = document.getElementById("folderNameHint");
  if (folderNameRegex.test(e.target.value)) {
    folderNameHint.classList.remove("visible");
  } else {
    folderNameHint.classList.add("visible");
  }
});
document
  .getElementById("closeNewFolderDialog")
  .addEventListener("click", handleNewFolderCancel);
document
  .getElementById("newFolderOpenBtn")
  .addEventListener("click", function () {
    const modalBodyTxt = document.getElementById("newFolderPath");
    modalBodyTxt.textContent = "/root/" + getUploadPath();
    new_folder_modal.showModal();
    newFolderInput.focus();
  });
document.addEventListener("DOMContentLoaded", async function () {
  await getFolderBtnList();
});
