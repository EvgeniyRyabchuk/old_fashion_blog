

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


let allPosts = []; 
let postToUpdateId = null; 

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
const createPostPreview = async (event) => {
  const file = event.target.files[0];
  const fileUrl = URL.createObjectURL(file);
  // Show preview
  document.getElementById("preview").innerHTML =
    `<img src="${fileUrl}" width="150">`; 

  console.log('change');
}

coverImg.addEventListener("change", createPostPreview);

//////////////////////////////////////////////////////////////////////////////

const clearUpTheForm = () => {
  document.getElementById("title").value = ""; 
  quill.setText("");
  coverImg.value = "";
  document.getElementById("preview").innerHTML = "";
  tagInput.value = "";
  tags = [];
  renderTags();
}

const createOrUpdatePost = async (postId = null) => {
  const title = document.getElementById("title").value;
  const content = quill.root.innerHTML;
  let coverUrl = null;
  // if post is new and cover img loaded then upload it to cloudinary
  if(coverImg.files[0]) 
    coverUrl = await loadToCloudinary(coverImg.files[0]); 
  // if post is new and no cover img load default 
  else if (!coverUrl && !postId)  
     coverUrl = 'https://res.cloudinary.com/dpbmcoiru/image/upload/v1756029078/no-image_b3qvs2.png';

  const startDate = new Date(document.getElementById("startYear").value); 
  const endDate = new Date(document.getElementById("endYear").value);
  if (!startDate || !endDate) {
    alert("Please select both dates.");
    return;
  }
  console.log(startDate, endDate);
  console.log(content);

  // if (!coverUrl) {
  //   if(!postId) { 
  //     coverUrl = 'https://res.cloudinary.com/dpbmcoiru/image/upload/v1756029078/no-image_b3qvs2.png';
  //   } else { 
  //       alert("Load old cover image");
  //   } 
  // }
  
  //TODO: add categoryId 
  //TODO: add loader 
  //TODO: refactor 
  
  try {
    let createdOrUpdatedPost = null; 
    if(!postId) {
       createdOrUpdatedPost= await db.collection("posts").add({
        title: title,
        content: content, 
        coverUrl: coverUrl,
        date_range: `${startDate.getFullYear()}-${endDate.getFullYear()}`, 
        categoryId: selectedCategoryId,
        userId: auth.currentUser.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } else {
      const post = allPosts.find(p => p.id === postId); 
      console.log('founded' + post.id);
      
      await db.collection("posts").doc(postId).update({ 
        title: title,
        content: content, 
        coverUrl: coverUrl ?? post.coverUrl,  
        date_range: `${startDate.getFullYear()}-${endDate.getFullYear()}`,
        categoryId: selectedCategoryId,  
        // updateAt: firebase.firestore.FieldValue.serverTimestamp()
      }); 
      const updatedSnap = await db.collection("posts").doc(postId).get();
      createdOrUpdatedPost = { id: updatedSnap.id, ...updatedSnap.data() };
    }
    
    await addTagsIfNotExist(createdOrUpdatedPost); 

    console.log("Post created!");
    ("Post created!");
  } catch (err) {
    console.error("Error adding document:", err);
    alert("Error: " + err.message);
  }

}

// Save post to Firestore
document.getElementById("savePost").addEventListener("click", async () => {
  await createOrUpdatePost(postToUpdateId);
  await clearUpTheForm(); 
  await readPostDocs();
  postToUpdateId = null; 
});

async function readPostDocs() {
  // TODO: separate func 
  const postsSnap = await db.collection("posts").orderBy("createdAt", "desc").limit(5).get(); 
  const posts = postsSnap.docs.map(doc => ({
    id: doc.id, 
    ...doc.data()
  }));
  
  // Loading relationships 
  await loadCategoriesToCollection(posts);
  await loadTagsToCollection(posts); 
  allPosts = posts; 
  console.log(posts);
  
  const tbody = document.querySelector("#postsTable > tbody");
  tbody.innerHTML = ''; // очищаем tbody перед добавлением новых строк

  for (const post of posts) {

    // создаём строку
    const tr = document.createElement("tr");
    const tdId = document.createElement("td");
    const tdTitle = document.createElement("td");
    const tdContent = document.createElement("td");
    const contentWrapper = document.createElement("div");
    const tdImage = document.createElement("td");
    const tdImageCategoryID = document.createElement("td");
    const tdDateRange = document.createElement("td");
    const tdUserId = document.createElement("td");
    const tdUserCreatedAt = document.createElement("td");
    const tdTags = document.createElement("td");
    
    const actionWrapper = document.createElement("div");
    const tdAction = document.createElement("td");
    const editButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    // добавляем колонки

    tr.dataset.postId = post.id; 
    tdId.innerHTML = post.id || "Untitled";
    tdTitle.innerHTML = post.title || "Untitled";
    
    tdTags.innerHTML = post.tags.map(tag => tag.name).join(', '); 
    tdTags.style.whiteSpace = "nowrap"; 
    tdTags.style.maxWidth = "160px"; 
    tdTags.style.maxHeight = "100px"; 

    const documentHtml = document.createElement('div');
    documentHtml.innerHTML = post.content;

    documentHtml.querySelectorAll('img').forEach(img => {
      img.width = 100;
      img.height = 100;
    });

    // create new page with this content 
    contentWrapper.innerHTML = documentHtml.innerHTML || "";
    contentWrapper.classList.add("td-content");
    tdContent.appendChild(contentWrapper);  

    if (post.coverUrl) {
      tdImage.innerHTML = `<img src="${post.coverUrl}" width="100" height="100">`;
    }

    tdImageCategoryID.innerHTML = post.category?.id || 'null';
    // tdImageCategoryID.id = "categorySelect";
    tdDateRange.innerHTML = post.date_range;
    tdUserId.innerHTML = post.userId;
    tdUserCreatedAt.innerHTML = post.createdAt.toDate().toLocaleString();;
    tdUserCreatedAt.classList.add("td-date");

    editButton.innerText = 'Edit';
    editButton.type = 'button';
    editButton.onclick = onUpdatePostClick; 

    deleteButton.innerHTML = 'Remove';
    deleteButton.type = "button"; 
    deleteButton.onclick = onDeletePostClick; 
   
    actionWrapper.style.display = 'flex';    
    actionWrapper.appendChild(editButton);
    actionWrapper.appendChild(deleteButton);
    tdAction.appendChild(actionWrapper);

    // добавляем колонки в строку
    tr.appendChild(tdId);
    tr.appendChild(tdTitle);
    tr.appendChild(tdContent);
    tr.appendChild(tdImage);
    tr.appendChild(tdImageCategoryID);
    tr.appendChild(tdDateRange);
    tr.appendChild(tdUserId);
    tr.appendChild(tdUserCreatedAt);
    tr.appendChild(tdTags);
    tr.appendChild(tdAction);


    // добавляем строку в tbody
    tbody.appendChild(tr);
  };

}

  //TODO: cancel button 


const onUpdatePostClick = async (e) => {

  const pId = e.target.closest("tr").dataset.postId; 
  const post = allPosts.find(p => p.id === pId); 
  postToUpdateId = pId;
  
  document.getElementById("title").value = post.title;
  quill.root.innerHTML = post.content;

  coverImg.value = ""; 

    // Show preview
  document.getElementById("preview").innerHTML =`<img src="${post.coverUrl}" width="150">`;

  document.getElementById("startYear").value = post.date_range.split('-')[0];   
  document.getElementById("endYear").value = post.date_range.split('-')[1]; 
  
  tags = post.tags.map(t => t.name); 
  console.log(tags);
  renderTags();
  
  const selectCat = document.getElementById("category-select");
  selectCat.value = post.categoryId; 

}

const onDeletePostClick = async (e) => {
  const pId = e.target.closest("tr").dataset.postId;
  console.log(pId); 

  try {
    await db.collection("posts").doc(pId).delete(); 
    await readPostDocs();
    console.log("Document successfully updated!");
  } catch (err) {
    console.error("Error deleting document: ", error);
  }
  
}

const onResetPostClick = (e) => {
  postToUpdateId = null;
  
  document.getElementById("title").value = '';
  quill.root.innerHTML = '';
  coverImg.value = ""; 

    // Show preview
  document.getElementById("preview").innerHTML =``;

  document.getElementById("startYear").value = '';
  document.getElementById("endYear").value = '';
  
  tags = [];
  renderTags();
  
  selectedCategoryId = null; 
  const selectCat = document.getElementById("category-select");
  selectCat.value = ''; 
  
}

readPostDocs();




