
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
const tagInput = document.getElementById("tagInput");
const tagsContainer = document.getElementById("tagsContainer");
let tags = [];


// Override default image handler
quill.getModule("toolbar").addHandler("image", () => {
  quillImgFile.click(); // open file picker
});

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

// Cover Preview 
coverImg.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  const fileUrl = URL.createObjectURL(file);
  // Show preview
  document.getElementById("preview").innerHTML =
    `<img src="${fileUrl}" width="150">`;

  console.log('change');
});



// Add tag on Enter
tagInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && tagInput.value.trim() !== "") {
    e.preventDefault();
    const newTag = tagInput.value.trim();

    if (!tags.includes(newTag)) {
      tags.push(newTag);
      renderTags(); 
    }

    tagInput.value = "";
  }
});

// Render tags
function renderTags() {
  tagsContainer.innerHTML = "";
  tags.forEach((tag, index) => {
    const tagEl = document.createElement("div");
    tagEl.classList.add("tag");
    tagEl.innerHTML = `${tag} <span onclick="removeTag(${index})">×</span>`;
    tagsContainer.appendChild(tagEl);
  });
}

// Remove tag
function removeTag(index) {
  tags.splice(index, 1);
  renderTags();
}

async function addTagsIfNotExist(post) {
   const batch = db.batch();
   let existTags = []; 

  for (const tag of tags) {
    const tagRef = db.collection("tags");
    let existing = await tagRef.where("name", "==", tag).limit(1).get(); 

    if (existing.empty) {
      const newTagRef = db.collection("tags").doc();
      batch.set(newTagRef, {
        name: tag, 
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      existTags.push(newTagRef.id);  
    } else {
      existTags.push(existing.docs[0].id); 
    }
    
    batch.set(db.collection("post_tag").doc(),{
        tagId: existTags[existTags.length - 1], 
        postId: post.id, 
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });   
  }
  // Commit all new tags in one batch
  await batch.commit();

}

const clearUpTheForm = () => {
  document.getElementById("title").value = ""; 
  quill.setText("");
  coverImg.value = "";
  document.getElementById("preview").innerHTML = "";
  tagInput.value = "";
  tags = [];
  renderTags();
}

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
    const createdPost = await db.collection("posts").add({
      title: title,
      content: content,
      coverUrl: coverUrl,
      date_range: '80-90s',
      categoryId: "123",
      userId: auth.currentUser.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    addTagsIfNotExist(createdPost);

    console.log("Post created!");
    ("Post created!");
  } catch (err) {
    console.error("Error adding document:", err);
    alert("Error: " + err.message);
  }
  clearUpTheForm();
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