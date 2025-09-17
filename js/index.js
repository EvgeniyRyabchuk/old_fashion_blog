
const breakpoints = {
  xxl: 1400,
  xl: 1200,
  lg: 992,
  md: 768,
  sm: 576, 
  xs: 340,
}

const searchPostLoader = document.getElementById("searchPostLoader");

const headerSearch = document.getElementById("header-search");
const searchToggle = document.getElementById("searchToggle");
const searchClose = document.getElementById("searchClose");
const searchInput = document.getElementById("searchInput");
const searchControll = document.getElementById("searchControll")
const searchContent = document.getElementById("searchContent");


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


searchToggle.addEventListener("click", () => {
  headerSearch.classList.toggle("active");
  document.body.classList.toggle("no-scroll");
});
searchClose.addEventListener("click", () => {
  headerSearch.classList.toggle("active"); 
  if(window.innerWidth <= breakpoints.lg)
    document.body.classList.toggle("no-scroll"); 
  searchInput.value = ""

});
searchInput.addEventListener("click", () => {
    headerSearch.classList.add("active");
})

// Optional: close search when clicking outside
document.addEventListener("click", (e) => {
  if (!searchControll.contains(e.target) && headerSearch.classList.contains("active")) {
    headerSearch.classList.remove("active"); 
    // searchContent.style.display = "none"; 
    if(window.innerWidth <= breakpoints.lg)
        document.body.classList.toggle("no-scroll");
    // searchInput.value = ""
  }
});



///////////////////// dropdown
document.querySelectorAll(".dropdown.on-click").forEach(dropdown => {
  dropdown.addEventListener("click", e => {
    // only preventDefault if the first child <a> is clicked
    if (e.target.tagName === "A" && e.target.classList.contains("prevent")) {
      e.preventDefault();
      dropdown.classList.toggle("is-open");
    }
  });
});


const debound = createDebounce(500);
const queryStrHandler = QueryStringHandler();


/////////////////////////// fetchPostsBySearch
async function fetchPostsBySearch(term) {
  if(term === "" || !term) {
    console.log("No term → return all posts or skip");
    return []; 
  }
  const postsRef = db.collection("posts");
  // 1. Search posts by title
  const postsByTitleSnap = await postsRef
    .orderBy("searchIndex") 
    .orderBy("createdAt", "desc")
    .startAt(term.toLowerCase()) 
    .endAt(term.toLowerCase() + "\uf8ff")
    .limit(10)
    .get();

  const posts = postsByTitleSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  renderPostsForSearch(posts);
  return posts;
}

const searchSeeMoreLink = searchContent.querySelector("#searchSeeMore"); 
const showSeeMore = (text, length) => {
  const seeMoreTriggerCount = 3;
  const searchUrl = `/?${queryStrHandler.strQName.search}=${text}`;
  if (length > seeMoreTriggerCount) {
    searchSeeMoreLink.href = searchUrl;
    searchSeeMoreLink.classList.remove("d-none");
  }
}

let text = null;
// search input event handler 
searchInput.addEventListener("input", (e) => { 
  text = e.target.value; 
  searchPostList.innerHTML = ""; 
  searchContent.querySelector(".no-data-li").classList.add("d-none"); 
  searchContent.classList.remove("is-open"); 
  searchSeeMoreLink.classList.add("d-none"); 
  
  if(!text) {
      return;
  }
  
  debound.set(text, async (text) => {
      queryStrHandler.changePostsSearch(text); 
      
      searchPostLoader.style.display = "flex"; 
      searchContent.style.height = "300px"; 
      searchContent.classList.add("is-open"); 
      
      const items = await fetchPostsBySearch(text); 

      if (items.length > 0) {
        searchContent.querySelector(".no-data-li").classList.add("d-none");
        showSeeMore(text, items.length);
      } else {
        searchContent.querySelector(".no-data-li").classList.remove("d-none");
      }
      searchContent.style.height = "auto"; 
      searchPostLoader.style.display = "none"; 
  });


});


document.getElementById("searchBtn").addEventListener("click", (e) => {
   const searchUrl = `/?${queryStrHandler.strQName.search}=${text}`; 
   window.location.href = searchUrl; 
})


//TODO: when i change perPage to 5 and go from page 1 to 3 i see first page. Remove page btn event
//TODO: all fetch to fetch-folder 

//TODO: index page redirect to posts list page 
//TODO: loader index prioriry 
//TODO: rederect to login page if not auth and redirect to index.html if logged in and show login btn's if not auth 
//TODO: prifle: add avatar/change name in setting 


