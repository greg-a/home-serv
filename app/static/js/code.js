const fileInput = document.getElementById("formFile");
const submitBtn = document.getElementById("submitBtn");
const clearBtn = document.getElementById("clearBtn");

async function handleSubmitFiles() {
  const selectedFiles = fileInput.files;

  if (selectedFiles.length > 0) {
    const data = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      console.log(
        `File Name: ${file.name}, Size: ${file.size} bytes, Type: ${file.type}`
      );
      data.append("files", file);
    }
    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: data,
      });
      console.log({ response });
      if (response.status === 200) {
        alert("Success");
        handleClearInput();
      } else {
        alert("Failed");
      }
    } catch (e) {
      alert(e);
    }
  }
}

const handleClearInput = () => {
  fileInput.value = ""
}

submitBtn.addEventListener("click", handleSubmitFiles);
clearBtn.addEventListener("click", handleClearInput)
