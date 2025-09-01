const quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: '#toolbar',
    imageResize: {} // enables resizing, drag & drop
  }
});

// Create hidden file input for Quill image uploads
const quillImgFile = document.getElementById("quillImageInput");


// Override default image handler
quill.getModule("toolbar").addHandler("image", () => {
  quillImgFile.click(); // open file picker
});


// append Image in Quill 
quillImgFile.addEventListener("change", async (event) => {
  console.log('change');
  const file = event.target.files[0];
  if (!file) {
    alert("Please select an image first.");
    return;
  }

  try {
    const uploadedImageUrl = await loadToCloudinary(file);
    const range = quill.getSelection();
    quill.insertEmbed(range.index, "image", uploadedImageUrl);
    console.log("Image uploaded & saved:", uploadedImageUrl);
  } catch (err) {
    console.error("Upload failed:", err);
    alert("Upload failed: " + err.message);
  }
});