

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

// createPostPreview

const createImageDragDrop = (
  inputId, 
  previewElemId,
  imgPlaceholderId,
  deleteImgBtnId
) => {
  const input = document.getElementById(inputId);
  const previewElem = document.getElementById(previewElemId);
  const imgPlaceholder = document.getElementById(imgPlaceholderId);
  const deleteImgBtn = document.getElementById(deleteImgBtnId);
  
  // Cover Preview 
  const handleFile = async (file, dragAndDrop = false) => {
    if (!file || !file.type.startsWith("image/")) return;
    const fileUrl = URL.createObjectURL(file);
    if(dragAndDrop) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
    }
    showPreview(fileUrl); 
  }
  
  input.addEventListener("change", (e) => handleFile(e.target.files[0]));
  imgPlaceholder.addEventListener("click", () => {
    input.click();
  });

  const showPreview = (url) => {
    // previewElem.innerHTML =`<img src="${url}" width="150">`;
    previewElem.style.backgroundImage = `url(${url})`;  
    previewElem.style.display = "block"; 
    imgPlaceholder.style.display = "none";

  }
  const hidePreview = () => {
    const dataTransfer = new DataTransfer();
    input.files = dataTransfer.files; 
    previewElem.style.display = "none";
    imgPlaceholder.style.display = "flex"
  }
  
  deleteImgBtn.addEventListener("click", () => {
    hidePreview();
  });


    // Drag & Drop events
  ["dragenter", "dragover"].forEach(evtName => {
    imgPlaceholder.addEventListener(evtName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      imgPlaceholder.classList.add("drag-over");
    });
  });

  ["dragleave", "drop"].forEach(evtName => {
    imgPlaceholder.addEventListener(evtName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      imgPlaceholder.classList.remove("drag-over");
    });
  });

  // Handle drop
  imgPlaceholder.addEventListener("drop", (e) => {
    const file = e.dataTransfer.files[0];
    handleFile(file, true);
   
  });
  

  return {
    input,
    previewElem,
    imgPlaceholder,
    deleteImgBtn,
    showPreview,
    hidePreview
  }
}






