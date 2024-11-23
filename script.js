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

    // Update the fetch URL if required
    const response = await fetch("https://itsrealm12c.github.io/apktoipkconverter/cgi-bin/convert.cgi", {
      method: "POST",
      body: formData,
    });

    // Check if the response was successful (HTTP status 200)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Check if the response body is a Blob (which should be the file)
    const blob = await response.blob();
    if (!blob) {
      throw new Error("No content received from the server.");
    }

    // Create a temporary download link
    const url = window.URL.createObjectURL(blob);
    const downloadButton = document.createElement("button");
    downloadButton.textContent = "Download .ipk";
    downloadButton.style.marginTop = "20px";

    downloadButton.addEventListener("click", () => {
      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.ipk"; // Default name for the file
      a.click();
      window.URL.revokeObjectURL(url); // Cleanup the object URL after download
    });

    resultDiv.innerHTML = "Conversion successful!";
    resultDiv.appendChild(downloadButton);

  } catch (error) {
    // Handle different types of errors
    console.error("Error occurred:", error);
    if (error instanceof TypeError) {
      resultDiv.innerHTML = "Network error occurred. Please check your connection or try again later.";
    } else if (error instanceof Error && error.message.includes('HTTP error')) {
      resultDiv.innerHTML = `Error: Unable to reach the backend server (HTTP Status: ${error.message})`;
    } else {
      resultDiv.innerHTML = `An unexpected error occurred: ${error.message}`;
    }
    alert("An error occurred. Check the console for more details.");
  }
});
