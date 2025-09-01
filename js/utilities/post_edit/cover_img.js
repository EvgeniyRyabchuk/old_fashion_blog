
const coverImg = document.getElementById("coverImg");
const previewElem = document.getElementById("preview");
const postImgPlaceholder = document.getElementById("postImgPlaceholder");

// Cover Preview 
const createPostPreview = async (event) => {
  const file = event.target.files[0];
  const fileUrl = URL.createObjectURL(file);
  // Show preview

  previewElem.style.backgroundImage = `url(${fileUrl})`; 
  previewElem.style.display = "block";
  postImgPlaceholder.style.display = "none"
  console.log('change');
}

coverImg.addEventListener("change", createPostPreview);
document.getElementById("postImgPlaceholder").addEventListener("click", () => {
  coverImg.click();
});

document.getElementById("deletePostCoverImgBtn").addEventListener("click", () => {
  document.getElementById("coverImg").value = ""  
  coverImg.value = ""; 
  
  previewElem.style.display = "none";
  postImgPlaceholder.style.display = "flex"
})

// loading image to Cloudinary Service
const loadToCloudinary = async (file) => {
  // Prepare FormData for Cloudinary
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "fashion_images"); // unsigned preset from Cloudinary
  
  const res = await fetch("https://api.cloudinary.com/v1_1/dpbmcoiru/image/upload", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  console.log("Uploaded:", data); 
  return data.secure_url;
}