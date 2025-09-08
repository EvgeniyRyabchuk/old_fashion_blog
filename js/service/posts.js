


let allPosts = []; 
let postToUpdateId = null; 
const postLoader = document.querySelector("#postLoader"); 
const paginationEnv = null;

const renderPostsForTable = (post) => {
 // создаём строку
    const tr = document.createElement("tr");
    const tdId = document.createElement("td");
    const tdTitle = document.createElement("td");
    const tdContent = document.createElement("td");
    const contentWrapper = document.createElement("div");
    const tdImage = document.createElement("td");
    const tdCategory = document.createElement("td");
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

    tdCategory.innerHTML = post.category?.name || 'null';
    // tdImageCategoryID.id = "categorySelect";
    tdDateRange.innerHTML = `${post.date_range_start}-${post.date_range_end}`;
    tdUserId.innerHTML = post.userId;
    tdUserCreatedAt.innerHTML = post.createdAt.toDate().toLocaleString();
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
    tr.appendChild(tdCategory);
    tr.appendChild(tdDateRange);
    tr.appendChild(tdUserId);
    tr.appendChild(tdUserCreatedAt);
    tr.appendChild(tdTags);
    tr.appendChild(tdAction);
    
    return tr;
}
const renderPostsForGrid = (post) => {
  // { href, imgSrc, imgAlt, title, content } 
  const imgAlt = "Post Image";
    //TODO: fix - adding post id 
  const href = "/post.html"
   const article = document.createElement("article");
  article.className = "post-card";

  const link = document.createElement("a");

  link.href = href;

  // cover image
  const coverDiv = document.createElement("div");
  coverDiv.className = "post-cover";
  const img = document.createElement("img");
  img.src = post.coverUrl;
  img.alt = imgAlt || "Post Image";
  coverDiv.appendChild(img);

  // title
  const titleWrapper = document.createElement("div");
  titleWrapper.className = "post-title-wrapper";
  const spanTitle = document.createElement("span");
  spanTitle.className = "post-title";
  spanTitle.textContent = post.title;
  titleWrapper.appendChild(spanTitle);

  // short content
  const shortContent = document.createElement("div");
  shortContent.className = "post-short-content";
  shortContent.textContent = post.content;

  // assemble inside link
  link.appendChild(coverDiv);
  link.appendChild(titleWrapper);
  link.appendChild(shortContent);

  // more wrapper
  const moreWrapper = document.createElement("div");
  moreWrapper.className = "more-wrapper";
  const readMore = document.createElement("a");
  readMore.href = href;
  readMore.className = "read-more";
  readMore.textContent = "Read More >>";
  moreWrapper.appendChild(readMore);

  // build article
  article.appendChild(link);
  article.appendChild(moreWrapper);

  return article;
}

const getCurrentEnvForPagination = () => {
  //TODO: normalize with variables 
  const lastUrlPart = window.location.pathname.split("/").pop();
  switch(lastUrlPart) {
    case "posts.html": 
      return { render: renderPostsForGrid, filterHandler: postFilterQueryCreator, container: document.querySelector("#posts-wrapper")}; 
    case "": 
     return { render: renderPostsForGrid, filterHandler: postFilterQueryCreator, container: document.querySelector("#posts-wrapper")}; 
    case "index.html": 
      return { render: renderPostsForGrid, filterHandler: postFilterQueryCreator, container: document.querySelector("#posts-wrapper")}; 
    case "create-edit-post.html":
        return { render: renderPostsForTable, container: document.querySelector("#postTableBody")};  
    default: return null;
  }
}

const currentPaginationEnv = getCurrentEnvForPagination(); 

// callback after posts loaded for attach addition info to posts 
const afterPostsLoaded = async (posts) => {
  await loadCategoriesToCollection(posts);
  await loadTagsToCollection(posts); 
  allPosts = posts; 
  postLoader.style.display = "none"; 
  document.querySelector(".pagination-wrapper").classList.add("is-open"); 
}

const beforePostsLoaded = async () => {  
  postLoader.style.display = "flex"; 
  document.querySelector("body").scrollIntoView({ behavior: "smooth", block: "start" });
}; 

const postsPaginator = createPaginator({
  container: currentPaginationEnv.container,  
  perPageSelect: document.getElementById("perPageSelect"),
  prevBtn: document.getElementById("prevPage"), 
  nextBtn: document.getElementById("nextPage"), 
  pageInfo: document.getElementById("pageInfo"),
  pageNumbersContainer: document.getElementById("pageNumbers"),
  loadMoreBtn: document.getElementById("loadMoreBtn"), 
  fetchData: async (page, perPage) => {
    return await fetchDataFirestore("posts", page, perPage, {
      orderField: "createdAt", // must exist in your docs 
      filterHandler: currentPaginationEnv.filterHandler 
    }, beforePostsLoaded, afterPostsLoaded); 
  }, 
  renderItem: post => currentPaginationEnv.render(post),
  loader: postLoader
});

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
  

  try {
    let createdOrUpdatedPost = null; 
    if(!postId) {
       createdOrUpdatedPost= await db.collection("posts").add({
        title: title,
        content: content, 
        coverUrl: coverUrl,
        date_range_start: startDate.getFullYear(), 
        date_range_end: endDate.getFullYear(), 
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
        date_range_start: startDate.getFullYear(), 
        date_range_end: endDate.getFullYear(), 
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
const savePost = async (e) => { 
  await createOrUpdatePost(postToUpdateId);
  await clearUpTheForm();  
  await postsPaginator.reload(); 
  postToUpdateId = null; 
};

async function readPost(postId) {
  const postSnap = await db.collection('posts').doc(postId).get();
  const post = {
    id: postSnap.id,
    ...postSnap.data()
  }
  await loadCategoriesToCollection([post]);
  await loadTagsToCollection([post]);

  // Fill DOM
  document.getElementById("coverImg").src = post.coverUrl;
  document.getElementById("postTitle").textContent = post.title;
  document.getElementById("postDate").textContent = post.createdAt.toDate().toLocaleDateString();
  document.getElementById("postDataRange").textContent = `${post.date_range_start}-${post.date_range_end}`;
  document.getElementById("postCategory").textContent = post.category?.name ?? "";

  // Tags
  const tagsContainer = document.getElementById("postTags");
  tagsContainer.innerHTML = "";
  if (post.tags && post.tags.length > 0) {
    post.tags.forEach(tag => {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = `#${tag.name}`;
      tagsContainer.appendChild(span);
    });
  }
  // Content (Quill HTML)
  document.getElementById("postBody").innerHTML = post.content;
}

const onUpdatePostClick = async (e) => {

  const pId = e.target.closest("tr").dataset.postId; 
  const post = allPosts.find(p => p.id === pId); 
  postToUpdateId = pId;
  
  document.getElementById("title").value = post.title;
  quill.root.innerHTML = post.content;

  coverImg.value = ""; 

    // Show preview
  document.getElementById("preview").innerHTML =`<img src="${post.coverUrl}" width="150">`;

  document.getElementById("startYear").value =  post.date_range_start;   
  document.getElementById("endYear").value = post.date_range_end; 
  
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
    await postsPaginator.reload();
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



