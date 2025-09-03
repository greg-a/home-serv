const newToast = (message, type) => {
  const toaster = document.getElementById("toaster");
  const container = document.createElement("div");
  container.classList.add("toast");

  const innerContainer = document.createElement("div");
  innerContainer.classList.add("alert", "alert-info");
  if (type === "error") {
    innerContainer.classList.add("bg-error", "border-error");
  }

  const content = document.createElement("span");
  innerContainer.appendChild(content);

  container.appendChild(innerContainer);
  content.textContent = message;

  toaster.appendChild(container);

  setTimeout(() => container.classList.add("fade-out"), 5000);
  setTimeout(() => container.remove(), 6000);
};

const newBreadCrumb = (text) => {
  const breadCrumb = document.createElement("li");
  const button = document.createElement("button");
  button.classList.add("btn", "btn-link", "btn-lg", "p-0");
  button.value = getUploadPath() + text;
  button.onclick = handleUploadFolderClick;
  const img = document.createElement("img");
  img.classList.add("size-5", "inline-block", "text-success");
  img.src = "./images/folder-icon.svg";
  button.append(img, text);
  breadCrumb.append(button);
  return breadCrumb;
};

const newFolderButton = (text, onclick, newFolder = false) => {
  const button = document.createElement("button");
  button.classList.add("btn", "btn-outline", "w-50", "justify-start");
  button.setAttribute("title", text);
  button.value = text;
  button.onclick = onclick;
  if (newFolder) {
    const indicator = document.createElement("span");
    indicator.classList.add("indicator-item", "status", "status-success");
    button.classList.add("indicator");
    button.append(indicator);
  }
  const folderImg = document.createElement("img");
  folderImg.classList.add("size-6", "me-2", "inline-block", "text-success");
  folderImg.src = "./images/folder-icon.svg";
  const textEl = document.createElement("span");
  textEl.textContent = text;
  textEl.classList.add("truncate");
  button.append(folderImg, textEl);
  return button;
};
