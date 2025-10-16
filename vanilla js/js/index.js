
const breakpoints = {
  xxl: 1400,
  xl: 1200,
  lg: 992,
  md: 768,
  sm: 576, 
  xs: 340,
}

const searchPostLoader = document.getElementById("searchPostLoader");


const headerSearch = document.getElementById("headerSearch");
const searchToggle = document.getElementById("searchToggle");
const searchClose = document.getElementById("searchClose");
const searchInput = document.getElementById("searchInput");
const searchControll = document.getElementById("searchControll")
const searchContent = document.getElementById("searchContent");
const searchSeeMoreLink = searchContent.querySelector("#searchSeeMore"); 

const authNavList =  document.getElementById("authNavList");
const asideAuthNavList = document.querySelector("#asideAuthNavList"); 


const profileBtnWrapper = document.getElementById("profileBtnWrapper")
const asideProfileBtnWrapper = document.getElementById("asideProfileBtnWrapper"); 

//TODO: change 
document.getElementById("profileBtnWrapper").addEventListener("mouseenter", (e) => {
    authNavList.classList.toggle("is-open");
})
document.getElementById("profileBtnWrapper").addEventListener("mouseleave", (e) => {
    authNavList.classList.toggle("is-open");
})

// open profile in aside menu 
document.getElementById("asideProfileBtnWrapper").addEventListener("click", (e) => {
    asideAuthNavList.classList.toggle("is-open");
    document.querySelector("#asideProfileBtn").classList.toggle("is-open"); 
})


const setAsideIsOpen = () => {
    document.querySelector("#sideMenu").classList.toggle("is-open");
    // document.querySelector("#burgerMenuBtn").classList.toggle("is-open");
    document.querySelector("#sideMenuWrapper").classList.toggle("is-open");
    document.body.classList.toggle("no-scroll"); 
}

// open aside menu 
document.getElementById("burgerMenuBtn").addEventListener("click", (e) => {
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



//======================================= search posts 
const noDataLi = searchContent.querySelector(".no-data-li")

//  ============================ search by posts title and tags vie searchIndex 

searchToggle.addEventListener("click", () => {
  headerSearch.classList.toggle("active");
  document.body.classList.toggle("no-scroll");
});
searchClose.addEventListener("click", () => { 
  headerSearch.classList.toggle("active"); 
  if(window.innerWidth <= breakpoints.lg)
    document.body.classList.toggle("no-scroll"); 
  searchInput.value = ""
  searchPostList.innerHTML = ""; 
  searchSeeMoreLink.classList.add("d-none"); 
  noDataLi.classList.add("d-none"); 
  searchContent.classList.remove("is-open");  
});

searchInput.addEventListener("click", () => {
    headerSearch.classList.add("active"); 
})

// Optional: close search when clicking outside
document.addEventListener("click", (e) => {
  if (!searchControll.contains(e.target) && headerSearch.classList.contains("active")) {
    headerSearch.classList.remove("active"); 
    if(window.innerWidth <= breakpoints.lg)
        document.body.classList.toggle("no-scroll");
  }
});



let debound = createDebounce(500);
const queryStrHandler = QueryStringHandler();



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

const showSeeMore = (text, length) => {
  const seeMoreTriggerCount = 3;
  const searchUrl = `/posts.html?${queryStrHandler.strQName.search}=${text}`;
  if (length >= seeMoreTriggerCount) {
    searchSeeMoreLink.href = searchUrl;
    searchSeeMoreLink.classList.remove("d-none");
  }
}

let text = null;
// search input event handler 
searchInput.addEventListener("input", (e) => { 
  text = e.target.value; 
  searchPostList.innerHTML = ""; 
  noDataLi.classList.add("d-none"); 
  searchContent.classList.remove("is-open"); 
  searchSeeMoreLink.classList.add("d-none"); 
  
  if(!text) return;
  
  debound.set(text, async (text) => {
      queryStrHandler.changePostsSearch(text); 
      
      searchPostLoader.style.display = "flex"; 
      searchContent.style.height = "300px"; 
      searchContent.classList.add("is-open"); 
      
      const items = await fetchPostsBySearch(text); 

      if (items.length > 0) {
        noDataLi.classList.add("d-none");
        showSeeMore(text, items.length);
      } else {
        noDataLi.classList.remove("d-none");
      }
      searchContent.style.height = "auto"; 
      searchPostLoader.style.display = "none"; 
  });
});

const searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", (e) => { 
  if(!text) return; 
   const searchUrl = `/posts.html?${queryStrHandler.strQName.search}=${text}`; 
   window.location.href = searchUrl; 
})
//=======================================  








//======================================= history 
const historyLimit = 10; 
const addPostToHistory = (postId) => {
  const historyStr = localStorage.getItem("postHistory");
  let history = historyStr ? historyStr.split(",") : []; 
  
  history.unshift(postId); 
  history = Array.from(new Set(history)); 
  
  if(history.length >= historyLimit) {
    history.pop();
  }
  localStorage.setItem("postHistory", history.join(","));
}
//=======================================



//======================================= auth rerender  
const getHeaderNavContent = async (additionUserInfo, isAdmin ) => { 
  const adminHeaderNav = `
    <li><a data-i18n="profile-nav-my-posts" href="/posts.html">My posts</a></li>
    <li><a data-i18n="profile-nav-post-editor" href="/profile/admin/create-edit-post.html">Post Editor / Table </a></li>
  `;

  const userHeaderNav= `
    <li><a data-i18n="profile-nav-favorites" href="/profile/admin/create-edit-post.html">Favorites</a></li>
  `;

  const commonHeaderNav = ` 
    <li><a data-i18n="profile-nav-settings" href="/profile/setting.html">Settings</a></li> 
    <li><a data-i18n="profile-nav-comments" href="/profile/comments.html">Comments</a></li>
    <li style="padding: 0;">
    <button class="btn-danger" data-i18n="profile-nav-logout-btn"
     type="button" onclick="logout()">Logout</button></li>
    `;

    if(auth.currentUser) {
      if(isAdmin) {
        authNavList.innerHTML = `${adminHeaderNav}${commonHeaderNav}`
        asideAuthNavList.innerHTML = `${adminHeaderNav}${commonHeaderNav}`; 
      } else {
        authNavList.innerHTML = `${userHeaderNav}${commonHeaderNav}`
        asideAuthNavList.innerHTML = `${userHeaderNav}${commonHeaderNav}`; 
      }
    } else {
        authNavList.innerHTML = ``
        asideAuthNavList.innerHTML = ``; 
    }
}

const displayUserRoleBaseHtml = (additionUserInfo, isAdmin ) => {
    getHeaderNavContent(additionUserInfo, isAdmin ); 
    const headerNavLoginBtnForm = document.getElementById("headerNavLoginBtnForm");
    
    if(auth.currentUser) { 
      headerNavLoginBtnForm.style.display = "none"; 
      profileBtnWrapper.classList.add("is-open"); 
      asideProfileBtnWrapper.classList.add("is-open"); 

      document.getElementById("authUserName").innerText = `: ${additionUserInfo.name}`;
    } else {
      headerNavLoginBtnForm.style.display = "flex"; 
      profileBtnWrapper.classList.remove("is-open"); 
      asideProfileBtnWrapper.classList.remove("is-open"); 
    }
}

firebase.auth().onAuthStateChanged(async function(user) {
  if(user) {
    const {data: additionUserInfo, isAdmin } = await getUserAddition(auth.currentUser?.uid);
    displayUserRoleBaseHtml(additionUserInfo, isAdmin); 
  }
})
//=======================================  



//======================================= theme  
const themeSelector = document.getElementById('themeSelector');
const root = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'default';
root.setAttribute('data-theme', savedTheme);
themeSelector.value = savedTheme;

themeSelector.addEventListener('change', () => {
  const theme = themeSelector.value;
  root.setAttribute('data-theme', theme); 
  localStorage.setItem('theme', theme);
});
//=======================================  



//======================================= lang
// Load saved language or default
const languageSelect = document.getElementById("languageSelect"); 
const createLocalizer = (languageSelect) => {
  const defaultLang = localStorage.getItem('lang') || 'en';
  let translations = null;

  async function setLanguage(lang) {
    const response = await fetch(`/lang/${lang}.json`);
    translations = await response.json();

    localStorage.setItem('lang', lang);
    document.documentElement.setAttribute('lang', lang); 
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = translations[key] || key;
    });

    // Translate attributes like placeholder, title, etc.
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const attrData = el.getAttribute('data-i18n-attr'); 
      // Example: placeholder:search-placeholder
      const [attr, key] = attrData.split(':');
      if (translations[key]) el.setAttribute(attr, translations[key]);
    });
  }

  // Handle dropdown change
  languageSelect.addEventListener('change', e => {
    setLanguage(e.target.value);
  });

  // Init on page load
  languageSelect.value = defaultLang;
  setLanguage(defaultLang);

  const translate = (key) => {
    return translations ? translations[key] : 'no translation'; 
  }

  return {
    setLanguage,
    translate

  }
}
const i18n = createLocalizer(languageSelect);
const getLocCatName = (category) => {
  return category[`name_${languageSelect.value}` || category.name_en]; 
}


//=======================================   

//TODO: move data to constants 
//TODO: routing:   exact: true,
//TODO: main page: carousel, roll, last posts 
//TODO: category load dynamicly 

//TODO: check Loadable loader screen work 
//TODO: rework lang change for react 
//TODO: change red 

//TODO: notification 
//TODO: breadcrubm translation 
//TODO: text localize 
//TODO: category dynamic loading with localize 
//TODO: when i change perPage to 5 and go from page 1 to 3 i see first page. Remove page btn event 


