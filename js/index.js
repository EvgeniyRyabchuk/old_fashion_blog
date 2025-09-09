




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

//   if (searchToggle) {
    searchToggle.addEventListener("click", () => {
      headerSearch.classList.toggle("active");
    });
    searchClose.addEventListener("click", () => {
      headerSearch.classList.toggle("active");
    });
//   }
  
  // Optional: close search when clicking outside
  document.addEventListener("click", (e) => {
    if (!headerSearch.contains(e.target)) {
      headerSearch.classList.remove("active");
    }
  });



  
//TODO: fix table loader appearance 



//TODO: search appearance 
//TODO: query request in particular for post view page, filter, search
//TODO: post cover Image only for grid, but for post view it's need wallpaper 



//TODO: index page redirect to posts list page 



