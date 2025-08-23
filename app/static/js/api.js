async function getFolders(path) {
  try {
    const params = new URLSearchParams({
      location: path ?? "",
    });
    response = await fetch(`/folder?${params}`);
    if (response.status === 200) {
      const data = await response.json();
      return data;
    } else {
      newToast(response.statusText, "error");
    }
  } catch (e) {
    newToast(e, "error");
  }
}
