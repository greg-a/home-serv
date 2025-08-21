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
