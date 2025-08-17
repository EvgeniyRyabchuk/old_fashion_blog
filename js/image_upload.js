 let uploadedImageUrl = "";

  document.getElementById("uploadBtn").addEventListener("click", async () => {
    const file = document.getElementById("imageInput").files[0];
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

  // Save post to Firestore
  document.getElementById("savePost").addEventListener("click", async () => {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    if (!uploadedImageUrl) {
      alert("Please upload an image first.");
      return;
    }

    try {
      await db.collection("posts").add({
        title: title,
        content: content,
        imageUrl: uploadedImageUrl,
        authorId: auth.currentUser.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      alert("Post created!");
    } catch (err) {
      console.error("Error adding document:", err);
      alert("Error: " + err.message);
    }
  });