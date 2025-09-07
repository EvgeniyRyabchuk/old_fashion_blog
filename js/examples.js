// function BlockSwitcher (defaultState = false) {
//     this.switchState = defaultState; 
    
//     // const mobileProfileMenuOpen: false,
//     // const asideMenuOpen: false 

//     this.openCloseSwitcher = (arr, toogleVar) => {    
//         for(let item of arr) {
//             const changebleTarget = document.querySelector(item.changebleSel);
//             changebleTarget.classList.remove(this.switchState ? item.state1 : item.state2 );
//             changebleTarget.classList.add(this.switchState ?  item.state2 : item.state1);
//         }
//         this.switchState = !this.switchState;
//     }
// }




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