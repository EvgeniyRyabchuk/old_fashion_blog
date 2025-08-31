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