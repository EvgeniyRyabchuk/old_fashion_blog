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



export {
    loadToCloudinary
}