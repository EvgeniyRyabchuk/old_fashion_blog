

const loaderCircleGenerate = (parentContainer = document.body) => {
    
    // Create the loader wrapper
    const loaderWrapper = document.createElement('div');
    loaderWrapper.classList.add('loader-wrapper'); 
    // loaderWrapper.classList.add('full-screen');
        loaderWrapper.classList.add('full-parrent');
    // Create the loader container
    const loader = document.createElement('div');
    loader.className = 'loader';

    // Generate 6 circle wrappers and circles
    for (let i = 1; i <= 6; i++) {
        const circleWrapper = document.createElement('div');
        circleWrapper.className = `circle-wrapper-${i}`;

        const circle = document.createElement('div');
        circle.className = `circle-${i}`;

        circleWrapper.appendChild(circle);
        loader.appendChild(circleWrapper);
    }
    
    // Append loader to wrapper
    loaderWrapper.appendChild(loader);

    // Finally, add it to the body or any other container
    parentContainer.appendChild(loaderWrapper);

    return loaderWrapper; 
}

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






const filterToggle = document.getElementById("filterToggle");
const filterDrawer = document.getElementById("filterDrawer");

const drawer = document.getElementById("filterDrawer");;
const closeBtn = document.getElementById("filterCloseBtn");

const inputs = document.querySelectorAll(".filter-drawer input");
const selectedList = document.querySelector(".selected-filters__list");

filterToggle.addEventListener("click", () => {
// If the class is-open exists, toggle removes it → the drawer closes.
// If the class is-open does NOT exist, toggle adds it → the drawer opens.
    filterDrawer.classList.toggle("is-open");
});
closeBtn.addEventListener("click", () => {
    drawer.classList.remove("is-open");
});

function createChip(label, value, type) {
    // avoid duplicates
    if (selectedList.querySelector(`[data-value="${value}"][data-type="${type}"]`)) return;

    const chip = document.createElement("div");
    chip.classList.add("filter-chip");
    chip.dataset.value = value;
    chip.dataset.type = type;

    // Add # for tags, From/To for dates
    if (type === "tag") {
        chip.innerHTML = `#${label} <span class="remove">&times;</span>`;
    } else if (type === "date-start") {
        chip.innerHTML = `From: ${label} <span class="remove">&times;</span>`;
    } else if (type === "date-end") {
        chip.innerHTML = `To: ${label} <span class="remove">&times;</span>`;
    } else {
        chip.innerHTML = `${label} <span class="remove">&times;</span>`;
    }

    // Delete chip → uncheck / clear input
    chip.querySelector(".remove").addEventListener("click", () => {
        const input = document.querySelector(`[value="${value}"][data-type="${type}"]`) ||
            document.querySelector(`[data-type="${type}"]`);
        if (input) {
            if (input.type === "checkbox") input.checked = false;
            if (input.type === "date") input.value = "";
        }
        chip.remove();
    });

    selectedList.appendChild(chip);
}
 inputs.forEach(input => {
    input.addEventListener("change", () => {
      const type = input.dataset.type;
      const value = input.value;

      if (input.type === "checkbox") {
        if (input.checked) createChip(input.parentNode.textContent.trim(), value, type);
        else selectedList.querySelector(`[data-value="${value}"][data-type="${type}"]`)?.remove();
      }

      if (input.type === "date") {
        if (input.value) createChip(input.value, value || input.value, type);
        else selectedList.querySelector(`[data-type="${type}"]`)?.remove();
      }
    });
});



//TODO: animation for mobile menu to disappear over alpha channel 




