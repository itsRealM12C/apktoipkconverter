document.getElementById("uploadForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const fileInput = document.getElementById("apkFile");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a file.");
    return;
  }

  const formData = new FormData();
  formData.append("apkFile", file);

  try {
    const response = await fetch("/convert", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Conversion failed");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.ipk";
    a.click();
    a.remove();

    document.getElementById("result").innerText = "Conversion successful!";
  } catch (error) {
    document.getElementById("result").innerText = "Error: " + error.message;
  }
});
