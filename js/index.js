


const CreateBlockSwitcher = (arr, defaultState = false) => {
    let state = defaultState; 
    const switchSate = () => {    
        for(let item of arr) {
            const changebleTarget = document.querySelector(item.changebleSel);
            changebleTarget.classList.remove(state ? item.state1 : item.state2 );
            changebleTarget.classList.add(state ?  item.state2 : item.state1);
        }
        state = !state; 
    }

    return {
        state,
        switchSate
    }
}

const profileBtnSwitcher = CreateBlockSwitcher([{changebleSel: "#profile-btn-wrapper > .authNavList",
     state1: "d-block", state2: "d-none" }]);
const asideSwitcher = CreateBlockSwitcher([
     {changebleSel: "#side-menu", state1: "w-auto", state2: "w-0" }, 
     {changebleSel: "#burger-menu-btn", state1: "close-aside-btn", state2: "open-aside-btn"},
     {changebleSel: "#side-menu-wrapper", state1: "d-block", state2: "d-none"}
]); 

const asideProfileBtn = CreateBlockSwitcher([
    {changebleSel: "#aside-profile-btn-wrapper > .authNavList", 
    state1: "h-max-1000", state2: "h-0" } 
]);

document.getElementById("profile-btn-wrapper").addEventListener("mouseenter", (e) => {
    profileBtnSwitcher.switchSate(); 
})
document.getElementById("profile-btn-wrapper").addEventListener("mouseleave", (e) => {
     profileBtnSwitcher.switchSate();
})

// open profile in aside menu 
document.getElementById("aside-profile-btn-wrapper").addEventListener("click", (e) => {
    asideProfileBtn.switchSate(); 
})
// open aside menu 
document.getElementById("burger-menu-btn").addEventListener("click", (e) => {
    asideSwitcher.switchSate();
})

document.getElementById("side-menu-wrapper").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) {
        asideSwitcher.switchSate();
    }
}); 


/*

classList has methods like:

.add("className") → adds a class

.remove("className") → removes a class

.contains("className") → checks if class exists

.toggle("className") → adds it if missing, removes it if present

*/

//TODO: animation for mobile menu to disappear over alpha channel and animate like filter one 
//TODL: disanle scroll if modal window called  
//TODO: post loading with pagination 
//TODO: filter btn click to left call quit 
//TODO: date range selection not adding to filter selected constantly but only if confirmed 
//TODO: remake switcher for classList.toogle 
//TODO:hide filter if user want to in disktop mode 
//TODO: post cover Image only for grid, but for post view it's need wallpaper 



