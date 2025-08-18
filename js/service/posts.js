
// Initialize Quill
const quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: '#toolbar',
    imageResize: {} // enables resizing, drag & drop
  }
});

// Reference hidden file input
const fileInput = document.getElementById("imageInput");
// Override default image handler
const toolbar = quill.getModule('toolbar');


  // Save post to Firestore
  document.getElementById("savePost").addEventListener("click", async () => {
    const title = document.getElementById("title").value;
    const content = quill.root.innerHTML;

    console.log(content);
 
    if (!uploadedImageUrl) {
      alert("Please upload an image first.");
      return;
    }

    try {
      await db.collection("posts").add({
        title: title,
        content: content,
        date_range: '80-90s',
        categoryId: "123", 
        userId: auth.currentUser.uid, 
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      //TODO: image adding to db  

      alert("Post created!");
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