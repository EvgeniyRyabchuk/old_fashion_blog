
// Initialize Quill
const quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: '#toolbar',
    imageResize: {} // enables resizing, drag & drop
  }
});

// Create hidden file input for Quill image uploads
const quillImgFile = document.getElementById("quillImageInput");
const coverImg = document.getElementById("coverImg");

// Override default image handler
quill.getModule("toolbar").addHandler("image", () => {
  quillImgFile.click(); // open file picker
});


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

coverImg.addEventListener("change", async (event) => {
   const file = event.target.files[0];
   const fileUrl = URL.createObjectURL(file);
  // Show preview
      document.getElementById("preview").innerHTML = 
        `<img src="${fileUrl}" width="150">`;

  console.log('change');
});

document.getElementById("filterPosts").addEventListener("click", async () => {


});




  // Save post to Firestore
document.getElementById("savePost").addEventListener("click", async () => {
    const title = document.getElementById("title").value;
    const content = quill.root.innerHTML; 
    const coverUrl = await loadToCloudinary(coverImg.files[0]);
  
  
    const startDate = new Date(document.getElementById("startYear").value);
    const endDate = new Date(document.getElementById("endYear").value);
    if (!startDate || !endDate) {
      alert("Please select both dates.");
      return;
    }
    console.log(startDate, endDate); 
  


    console.log(content);
 
    if (!coverUrl) {
      alert("Please upload an image first.");
      return;
    }

    try {
      await db.collection("posts").add({
        title: title,
        content: content,
        coverUrl: coverUrl, 
        date_range: '80-90s',
        categoryId: "123", 
        userId: auth.currentUser.uid, 
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      //TODO: image adding to db  

      console.log("Post created!"); 
      ("Post created!");
    } catch (err) {
      console.error("Error adding document:", err);
      alert("Error: " + err.message);
    }
});













 async function createPostDoc() {
  //  const title = document.getElementById("title").value;
  //  const content = quill.root.innerHTML; // HTML from Quill editor
  //   console.log(content);
  
  //  if (!title || !content) {
  //    alert("Please enter title and content");
  //    return;
  //  }

  //  try {
  //    await db.collection("posts").add({
  //      title: title,
  //      content: content,
  //      imageUrl: uploadedImageUrl || "", 
  //      authorId: auth.currentUser.uid,
  //      createdAt: firebase.firestore.FieldValue.serverTimestamp()
  //    });
  //    alert("Post created!");
  //  } catch (err) {
  //    console.error("Error adding post:", err);
  //    alert("Error: " + err.message);
  //  }
 }


 function readPostDocs() {
   const postsList = document.getElementById("postsList");
   db.collection("posts").get().then((querySnapshot) => {
     querySnapshot.forEach((doc) => {
       console.log(`${doc.id} => `, doc.data());

       const data = doc.data();
       // Only use title + content
       const li = document.createElement("li");
       li.innerHTML = `
               ${data.title || "Untitled"}: ${data.content || ""}
                `;
       postsList.appendChild(li);

     });
   });
 }


 function updatePostDoc(id) {
   db.collection("posts").doc(id).update({
       title: "Updated Title 🚀"
     })
     .then(() => {
       console.log("Document successfully updated!");
     })
     .catch((error) => {
       console.error("Error updating document: ", error);
     });
 }


 function deletePostDoc(id) {
   db.collection("posts").doc(id).delete()
     .then(() => {
       console.log("Document successfully deleted!");
     })
     .catch((error) => {
       console.error("Error deleting document: ", error);
     });
 }



 // readPostDocs();