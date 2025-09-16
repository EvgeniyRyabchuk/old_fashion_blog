
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





////////////////////////  createDebounce
const createDebounce = (delay) => {
  let debounceTimeOutID = null;
  const set = (content, callback) => {
    if(debounceTimeOutID) 
        clearTimeout(debounceTimeOutID);
    debounceTimeOutID = setTimeout(() => {
      console.log(`${content} - approved`);
      callback(content);
    }, delay); 
  }
  return { 
    debounceTimeOutID,
    set
  }; 
}
////////////////////////  QueryStringHandler
const QueryStringHandler = () => {
  const strQName = Object.freeze({
    search: "search",
    sort: "sort", 
    categories: "categories",
    tags: "tags",
    startDate: "startDate",
    endDate: "endDate",
    page: "page",
    perPage: "perPage"
  });
  
  const defaultStartDate = "1800-09-04";
  const defaultEndDate = "2025-09-04";

  const addOrDeleteParams = (array) => {
    const params = new URLSearchParams(window.location.search);
    for (let param of array) {
      if (param.name === strQName.startDate && param.value === defaultStartDate
         || param.name === strQName.endDate && param.value === defaultEndDate) {
         params.delete(param.name); // remove when empty
      } else { 
        if (param.value) {
          params.set(param.name, param.value); // set query
        } else {
          params.delete(param.name); // remove when empty
        }
      }
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }

  //TODO: check and get if exist 
  
  const changePostsSearch = async (text) => {
    console.log(`sended - ${text}`); 
    addOrDeleteParams([{name: strQName.search, value: text}]); 
  }

  const changePostsFilter = ({ cIds, tIds, startDate, endDate }) => {
      addOrDeleteParams([
        {name: strQName.categories, value: cIds.join(",")},
        {name: strQName.tags, value: tIds.join(",")},
        {name: strQName.startDate, value: startDate}, 
        {name: strQName.endDate, value: endDate}
      ]); 
  }
  
  const changePostsSort = (sortValue) => { 
    addOrDeleteParams([{name: strQName.sort, value: sortValue}]); 
  }
  
  const changePostsCurrentPage = (currentPage, perPage) => { 
    addOrDeleteParams([
      {name: strQName.page, value: currentPage},
      {name: strQName.perPage, value: perPage} 
    ]); 
  }

  return {
    strQName, 
    defaultStartDate,
    defaultEndDate, 
    changePostsSearch,
    changePostsFilter,
    changePostsSort,
    changePostsCurrentPage
  }
}

const debound = createDebounce(500);
const searchPostLoader = document.getElementById("searchPostLoader");
const queryStrHandler = QueryStringHandler();

/////////////////////////// renderPostsForSearch 
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



//TODO: index page redirect to posts list page 
//TODO: loader index prioriry 
//TODO: rederect to login page if not auth and redirect to index.html if logged in and show login btn's if not auth 
//TODO: prifle: add avatar/change name in setting 
