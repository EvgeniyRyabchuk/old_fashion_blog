



// toolbar.addHandler('image', () => {
//   console.log('Image button clicked');
  
//   fileInput.click(); // trigger file select dialog
// });


let uploadedImageUrl = "";

  document.getElementById("imageInput").addEventListener("change", async (event) => {
    console.log('change');
    
    const file = event.target.files[0];

    if (!file) {
      alert("Please select an image first.");
      return;
    }

    // Prepare FormData for Cloudinary
    const formData = new FormData(); 
    formData.append("file", file);
    formData.append("upload_preset", "fashion_images"); // unsigned preset from Cloudinary

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dpbmcoiru/image/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      console.log("Uploaded:", data);
      uploadedImageUrl = data.secure_url;

      // Show preview
      document.getElementById("preview").innerHTML = 
        `<img src="${uploadedImageUrl}" width="150">`;

    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed: " + err.message);
    }
  });

 