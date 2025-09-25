


let allPosts = []; 
let postToUpdateId = null; 
const postLoader = document.querySelector("#postLoader"); 
const paginationEnv = null;
const postContentSection = document.getElementById("postContentSection");





//TODO: after and before attached to context so that if it's table 


let postsPaginator = null;
try {
  
const getCurrentEnvForPagination = () => {
  //TODO: normalize with variables 
  const lastUrlPart = window.location.pathname.split("/").pop();
  switch (lastUrlPart) {
    case "posts.html":
      return {
        render: renderPostsForGrid, 
        filterHandler: postFilterQueryCreator, 
        container: document.querySelector("#posts-wrapper")
      };
    case "":
      return {
        render: renderPostsForGrid, 
        filterHandler: postFilterQueryCreator, 
        container: document.querySelector("#posts-wrapper")
      };
    case "index.html":
      return {
        render: renderPostsForGrid, 
        filterHandler: postFilterQueryCreator, 
        container: document.querySelector("#posts-wrapper")
      };
    case "create-edit-post.html":
      return {
        render: renderPostsForTable, 
        container: document.querySelector("#postTableBody")
      };
    default:
      return null;
  }
}

const currentPaginationEnv = getCurrentEnvForPagination();

const beforePostsLoaded = async (isLoadMore = false) => {  
  postLoader.style.display = "flex"; 
  if(!isLoadMore && currentPaginationEnv.render === renderPostsForGrid) 
    document.querySelector("body").scrollIntoView({ behavior: "smooth", block: "start" });
}; 
  // loadFromPostQueryStr(); 
// callback after posts loaded for attach addition info to posts 
const afterPostsLoaded = async (posts) => {
  await loadCategoriesToCollection(posts); 
  await loadTagsToCollection(posts);
  allPosts = posts;  
  postLoader.style.display = "none"; 
  document.querySelector(".pagination-wrapper").classList.add("is-open"); 
}

if (currentPaginationEnv) {
  postsPaginator = createPaginator({
    colName: "posts",
    container: currentPaginationEnv.container,
    perPageSelect: document.getElementById("perPageSelect"),
    prevBtn: document.getElementById("prevPage"),
    nextBtn: document.getElementById("nextPage"), 
    pageInfo: document.getElementById("pageInfo"),
    pageNumbersContainer: document.getElementById("pageNumbers"),
    loadMoreBtn: document.getElementById("loadMoreBtn"),
    fetchData: async ({page, perPage, cursorHandler, options}) => {
      return await fetchDataFirestore("posts", page, perPage, cursorHandler, {
        orderField: "createdAt", // must exist in your docs 
        filterHandler: currentPaginationEnv.filterHandler, 
        ...options
      }, beforePostsLoaded, afterPostsLoaded);
    },
    renderItem: post => currentPaginationEnv.render(post),
    loader: postLoader
  });
}

} catch(e) {
  console.log(e);
}


const clearUpTheForm = () => {
  document.getElementById("title").value = ""; 
  quill.setText("");
  // coverImg.input.value = ""; 
  coverImg.hidePreview(); 
  wideImg.hidePreview(); 

  // document.getElementById("preview").innerHTML = "";
  tagInput.value = "";
  tags = [];
  renderTags();
}

function buildSearchIndex(title, tags) {
  const text = title + " " + tags.join(" ");
  return text.toLowerCase(); // normalize for easier matching
}

const defaultCoverUrl = "/images/no-image.png"; 
const defaultWideImgUrl = "/images/default-wide-img.png"; 
// coverUrl = 'https://res.cloudinary.com/dpbmcoiru/image/upload/v1756029078/no-image_b3qvs2.png';

const createOrUpdatePost = async (postId = null) => {
  const title = document.getElementById("title").value;
  const content = quill.root.innerHTML; 
  const categorySelect = document.getElementById("category-select"); 
  
  let coverUrl, wideImgUrl = null;
  // if post is new and cover img loaded then upload it to cloudinary
  if(coverImg.input.files[0]) 
    coverUrl = await loadToCloudinary(coverImg.input.files[0]); 
  // if post is new and no cover img load default 
  else if (!coverUrl && !postId)  
     coverUrl = defaultCoverUrl;

  if(wideImg.input.files[0]) 
    wideImgUrl = await loadToCloudinary(wideImg.input.files[0]); 
  else if (!wideImgUrl && !postId)  
     wideImgUrl = defaultWideImgUrl;


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
        wideImgUrl: wideImgUrl, 
        date_range_start: startDate.getFullYear(), 
        date_range_end: endDate.getFullYear(), 
        searchIndex: buildSearchIndex(title, tags),  
        categoryId: categorySelect.value,
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
        wideImgUrl: wideImgUrl ?? post.wideImgUrl, 
        searchIndex: buildSearchIndex(title, tags), 
        date_range_start: startDate.getFullYear(), 
        date_range_end: endDate.getFullYear(), 
        categoryId: categorySelect.value,  
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
  addPostToHIstory(post.id); 
  console.log("read post");
  
  console.log(post.createdAt);
  
  // Fill DOM
  document.getElementById("coverImg").src = post.wideImgUrl; 
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
  postContentSection.classList.toggle("is-open"); 
}


const setPostToUpdate = (post) => {
  postToUpdateId = post.id;
  document.getElementById("title").value = post.title;
  quill.root.innerHTML = post.content;

  // coverImg.input.value = ""; 
  coverImg.hidePreview(); 
  coverImg.showPreview(post.coverUrl); 
  wideImg.hidePreview();  
  wideImg.showPreview(post.wideImgUrl); 

  
  document.getElementById("startYear").value =  post.date_range_start;   
  document.getElementById("endYear").value = post.date_range_end; 
  
  tags = post.tags.map(t => t.name); 
  console.log(tags);
  renderTags();
  
  const selectCat = document.getElementById("category-select");
  selectCat.value = post.categoryId; 
}
const onUpdatePostClick = async (e) => {
  const pId = e.target.closest("tr").dataset.postId; 
  const post = allPosts.find(p => p.id === pId); 
  setPostToUpdate(post); 
  queryStrHandler.changeCurrentPost(pId); 
  document.querySelector(".upload_container").scrollIntoView({ behavior: "smooth", block: "start" });
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
  // coverImg.input.value = ""; 

    // Show preview
  // document.querySelector(".preview").innerHTML = ``;
  
  document.getElementById("startYear").value = parseInt(queryStrHandler.defaultStartDate);
  document.getElementById("endYear").value = parseInt(queryStrHandler.defaultEndDate);
  
  tags = [];
  renderTags();
  
  selectedCategoryId = null; 
  const selectCat = document.getElementById("category-select");
  selectCat.value = ''; 

  coverImg.hidePreview(); 
  wideImg.hidePreview(); 
  
  queryStrHandler.changeCurrentPost(null); 
  document.querySelector("#postsTable").scrollIntoView({ behavior: "smooth", block: "start" });
  // postsPaginator.setPage(1);
}


const getLastPosts = async (count) => {
  const snap = await db.collection("posts").limit(count).get();
  const posts = snap.docs.map(p => ({ id: p.id, ...p.data() }) )
  console.log(posts);
  const lastPostsSection = document.getElementById("lastPostsSection");

  posts.forEach(p => {
    const article = renderPostsForGrid(p); 
    lastPostsSection.appendChild(article);
  })

  if(posts.length >= 10) {
    const link = document.createElement("a");
    link.href = "/posts.html";
    link.className = "see-more";
    link.innerHTML = "See <br/> More... <br/>";
    
    lastPostsSection.appendChild(link);
  }
}


const renderPostHistory = async () => {
  const historyStr = localStorage.getItem("postHistory");
  if (!historyStr) return;
  
  const history = historyStr.split(",");

  // Fetch posts by ID
  const postsSnap = await db.collection("posts")
    .where(firebase.firestore.FieldPath.documentId(), "in", history)
    .get();

  const posts = postsSnap.docs.map(p => ({
    id: p.id,
    ...p.data()
  }));

  const postHistorySection = document.getElementById("postHistory");
  history.forEach(h => {
    const post = posts.find(p => p.id === h);
    const article = renderPostsForGrid(post); 
    postHistorySection.appendChild(article);
  })

}
