const fileInput = document.getElementById("formFile");
const submitBtn = document.getElementById("submitBtn");
const clearBtn = document.getElementById("clearBtn");
const submitBtnProgress = document.getElementById("submitBtnProgress");
const uploadFolderList = document.getElementById("uploadFolderList");
const folderList = document.getElementById("folderList");
const folderButtonList = document.querySelectorAll(".folderButton");

let isUploadingFiles = false;

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

    // todo: get network speed and on set loading if upload will take more than a few seconds
    if (totalSize > 1024 * 1024 * 10) setIsLoading(true);
    xhr.send(data);
  }
};

const handleClearInput = () => {
  fileInput.value = "";
};

const clearFolderList = () => {
  folderList.innerHTML = "";
};

const getUploadPath = () => {
  let path = "";
  for (const child of uploadFolderList.children) {
    path += child.textContent.trim() + "/";
  }
  return path.replace("Home/", "");
};

const handleFolderClick = async (e) => {
  const { value } = e.currentTarget;
  uploadFolderList.append(newBreadCrumb(value));
  const uploadPath = getUploadPath();
  await getFolderBtnList(uploadPath);
};

const getFolderBtnList = async (path) => {
  folderList.innerHTML = "";
  const folders = await getFolders(path);
  folders.forEach((folder) => {
    const folderBtn = newFolderButton(folder);
    folderBtn.onclick = handleFolderClick;
    folderList.append(folderBtn);
  });
};

submitBtn.addEventListener("click", handleSubmitFiles);
clearBtn.addEventListener("click", handleClearInput);
document.addEventListener("DOMContentLoaded", async function () {
  await getFolderBtnList();
});
