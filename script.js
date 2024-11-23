document.getElementById("uploadForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const fileInput = document.getElementById("apkFile");
  const file = fileInput.files[0];
  const resultDiv = document.getElementById("result");

  // Clear previous results
  resultDiv.innerHTML = "";

  if (!file) {
    alert("Please select a file to upload.");
    return;
  }

  const formData = new FormData();
  formData.append("apkFile", file);

  try {
    // Display a loading message
    resultDiv.innerHTML = "Converting... Please wait.";

    // Full URL for fetch (replace localhost with your server's address or IP)
    const response = await fetch("https://itsrealm12c.github.io/apktoipkconverter/cgi-bin/convert.cgi", {
      method: "POST",
      body: formData,
    });

    // Check if the response is okay (status 200-299)
    if (!response.ok) {
      throw new Error(`Failed to fetch: HTTP status ${response.status}`);
    }

    // Get the converted file as a Blob
    const blob = await response.blob();

    // Create a temporary download link
    const url = window.URL.createObjectURL(blob);
    const downloadButton = document.createElement("button");
    downloadButton.textContent = "Download .ipk";
    downloadButton.style.marginTop = "20px";

    // When clicked, download the IPK file
    downloadButton.addEventListener("click", () => {
      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.ipk"; // Default name for the file
      a.click();
      window.URL.revokeObjectURL(url); // Clean up the URL object
    });

    // Update the result message and append the download button
    resultDiv.innerHTML = "Conversion successful!";
    resultDiv.appendChild(downloadButton);

  } catch (error) {
    // Log the error and show an error message
    console.error("Error occurred:", error);
    resultDiv.innerHTML = `Error: ${error.message}. Please try again later.`;
    alert("An error occurred. Check the console for more details.");
  }
});
