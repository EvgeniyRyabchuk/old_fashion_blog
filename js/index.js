
const breakpoints = {
  xxl: 1400,
  xl: 1200,
  lg: 992,
  md: 768,
  sm: 576, 
  xs: 340,
}

document.getElementById("profile-btn-wrapper").addEventListener("mouseenter", (e) => {
    document.getElementById("authNavList").classList.toggle("is-open");
 
})
document.getElementById("profile-btn-wrapper").addEventListener("mouseleave", (e) => {
    document.getElementById("authNavList").classList.toggle("is-open");
})

// open profile in aside menu 
document.getElementById("asideProfileBtnWrapper").addEventListener("click", (e) => {
    document.querySelector("#asideAuthNavList").classList.toggle("is-open");
    document.querySelector("#asideProfileBtn").classList.toggle("is-open"); 
})


const setAsideIsOpen = () => {
    document.querySelector("#side-menu").classList.toggle("is-open");
    // document.querySelector("#burger-menu-btn").classList.toggle("is-open");
    document.querySelector("#sideMenuWrapper").classList.toggle("is-open");
    document.body.classList.toggle("no-scroll"); 
}

// open aside menu 
document.getElementById("burger-menu-btn").addEventListener("click", (e) => {
    setAsideIsOpen();
})
document.querySelector("#closeAside").addEventListener("click", (e) => {
    setAsideIsOpen();
})
document.getElementById("sideMenuWrapper").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) {
        setAsideIsOpen();
    }
});


const headerSearch = document.getElementById("header-search");
const searchToggle = document.getElementById("searchToggle");
const searchClose = document.getElementById("searchClose");
const searchInput = document.getElementById("searchInput");
const searchControll = document.getElementById("searchControll")
const searchContent = document.getElementById("searchContent");

searchToggle.addEventListener("click", () => {
  headerSearch.classList.toggle("active");
  document.body.classList.toggle("no-scroll");
});
searchClose.addEventListener("click", () => {
  headerSearch.classList.toggle("active"); 
  document.body.classList.toggle("no-scroll");
  searchInput.value = ""

});
searchInput.addEventListener("click", () => {
    headerSearch.classList.add("active");
})

// Optional: close search when clicking outside
document.addEventListener("mousedown", (e) => {
  if (!searchControll.contains(e.target) && headerSearch.classList.contains("active")) {
    headerSearch.classList.remove("active");
    // searchContent.style.display = "none"; 
    if(window.innerWidth <= breakpoints.lg)
        document.body.classList.toggle("no-scroll");
    // searchInput.value = ""
  }
});





document.querySelectorAll(".dropdown.on-click").forEach(dropdown => {
  dropdown.addEventListener("click", e => {
    // only preventDefault if the first child <a> is clicked
    if (e.target.tagName === "A" && e.target.classList.contains("prevent")) {
      e.preventDefault();
      dropdown.classList.toggle("is-open");
    }
  });
});







const createDebounce = (delay) => {
  let debounceTimeOutID = null;
  const set = (text, callback) => {
    if(debounceTimeOutID) 
        clearTimeout(debounceTimeOutID);
    debounceTimeOutID = setTimeout(() => {
      console.log(`${text} - approved`);
      callback(text);
    }, delay); 
  }
  return { 
    debounceTimeOutID,
    set
  }; 
}




const searchQueryName = "search"; 
const debound = createDebounce(500);
const searchPostLoader = document.getElementById("searchPostLoader");


function renderPostsForSearch(posts) { 
  const container = document.getElementById("searchPostList");
  container.innerHTML = ""; // clear previous results
  if (!posts.length) {
    // container.innerHTML = "<li>No results found</li>";
    return;
  }
  posts.forEach(post => {
    const li = document.createElement("li");
    li.innerHTML = `
      <a href="/post.html?id=${post.id}">
        <div class="post-cover d-flex-v-center">
          <img src="${post.coverUrl || './images/default.jpg'}" alt="Post Img">
        </div>
        <div class="post-title-wrapper">
          <span class="post-title">
            ${post.title || "Untitled post"}
          </span>
        </div>
      </a>
    `;
    container.appendChild(li);
  });
}

async function fetchPostsBySearch(term) {
  
  if(term === "" || !term) {
    console.log("No term → return all posts or skip");
    return []; 
  }

  const postsRef = db.collection("posts");
  const tagsRef = db.collection("tags");
  const postTagRef = db.collection("post_tag");
  
  // 1. Search posts by title
  const postsByTitleSnap = await postsRef
    .orderBy("title")
    .startAt(term)
    .endAt(term + "\uf8ff")
    .limit(10)
    .get();

  let posts = postsByTitleSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // 2. Search tags by name
  const tagsSnap = await tagsRef
    .orderBy("name")
    .startAt(term)
    .endAt(term + "\uf8ff")
    .get();

  const tagIds = tagsSnap.docs.map(doc => doc.id);

  if (tagIds.length > 0) {
    // 3. Find posts related to those tags
    const postTagSnap = await postTagRef
      .where("tagId", "in", tagIds.slice(0, 10)) // Firestore allows max 10 values in "in"
      .get();

    const postIds = [...new Set(postTagSnap.docs.map(doc => doc.data().postId))];

    if (postIds.length > 0) {
      // 4. Fetch posts by IDs
      const postSnaps = await Promise.all(
        postIds.map(id => postsRef.doc(id).get())
      );

      const postsByTags = postSnaps
        // .filter(snap => snap.exists)
        .map(snap => ({ id: snap.id, ...snap.data() }));
      // 5. Merge results (title + tag matches)
      posts = [...posts, ...postsByTags];
    }
  }

  // Remove duplicates
  const unique = {};
  posts.forEach(p => (unique[p.id] = p));
  const res = Object.values(unique).slice(0, 10); // enforce limit
  console.log(res);
  renderPostsForSearch(res);
  return res;
}


const searchQuery = async (text) => {
  const searchPostList = document.getElementById("searchPostList");
  
 console.log(`sended - ${text}`);
  // ✅ Update query string
  const params = new URLSearchParams(window.location.search);
  if (text) {
    params.set(searchQueryName, text); // set query
  } else {
    params.delete(searchQueryName); // remove when empty
  }
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, "", newUrl);

  searchPostLoader.style.display = "flex";
  searchContent.style.height = "300px"; 
  // searchContent.style.display = "block"; 
  searchContent.classList.add("is-open"); 
  const items = await fetchPostsBySearch(text); 

  if(items.length > 0) {
      searchContent.querySelector(".no-data-li").classList.add("d-none"); 
    } else { 
      searchContent.querySelector(".no-data-li").classList.remove("d-none"); 
    }
  searchContent.style.height = "auto"; 
  searchPostLoader.style.display = "none"; 
}

searchInput.addEventListener("input", (e) => {
  const text = e.target.value;
  searchPostList.innerHTML = ""; 
  searchContent.querySelector(".no-data-li").classList.add("d-none"); 
  searchContent.classList.remove("is-open"); 
  if(!text) {
      
      return;
  }


  debound.set(text, searchQuery);
  debounceTimeOutID = createDebounce(text, searchQuery);
})


//TODO: search appearance 
//TODO: query request in particular for post view page, filter, search
//TODO: post cover Image only for grid, but for post view it's need wallpaper 
//TODO: index page redirect to posts list page 
//TODO: loader index prioriry 


