

const filterToggle = document.getElementById("filterToggle");
const filterDrawer = document.getElementById("filterDrawer");

const drawer = document.getElementById("filterDrawer");;
const closeBtn = document.getElementById("filterCloseBtn");
const filterDraweWrapper =  document.getElementById("filterDraweWrapper"); 

const inputs = document.querySelectorAll(".filter-drawer input");
const selectedList = document.querySelector(".selected-filters__list");


const switchFilter = (isOpening = true) => {
  filterDraweWrapper.classList.toggle("is-open"); 
    filterDrawer.classList.toggle("is-open"); 
  // Check if the screen is 992px or less
  if (window.innerWidth <= breakpoints.lg) {
    document.body.classList.toggle("no-scroll");
  } 
  // document.body.classList.toggle("no-scroll");
}

filterToggle.addEventListener("click", () => {
// If the class is-open exists, toggle removes it → the drawer closes.
// If the class is-open does NOT exist, toggle adds it → the drawer opens.
  switchFilter();
});
closeBtn.addEventListener("click", () => {
   switchFilter(false) 
});

filterDraweWrapper.addEventListener("click", (e) => {
  if(e.currentTarget == e.target) {
     switchFilter(false); 
  }
})


const reset = async () => {
    const allCategoriesCheckboxes = document.querySelectorAll(
        '.filter-drawer input:checked[data-type="category"]'
    );
    const allTagsCheckboxes = document.querySelectorAll(
        '.filter-drawer input:checked[data-type="tag"]'
    );

    const dateStart = document.querySelector(`.filter-drawer input[data-type="date-range-start"]`);
    const dateEnd = document.querySelector(`.filter-drawer input[data-type="date-range-end"]`);

    allCategoriesCheckboxes.forEach(c => c.checked = false);
    allTagsCheckboxes.forEach(t => t.checked = false);
    dateStart.value = queryStrHandler.defaultStartDate;
    dateEnd.value = queryStrHandler.defaultEndDate;
    selectedList.innerHTML = "";

    await postsPaginator.setPage(1); 
}

const resetAllButDateRange = () => {
    const allCategoriesCheckboxes = document.querySelectorAll(
        '.filter-drawer input:checked[data-type="category"]'
    );
    const allTagsCheckboxes = document.querySelectorAll(
        '.filter-drawer input:checked[data-type="tag"]'
    );
    allCategoriesCheckboxes.forEach(c => c.checked = false);
    allTagsCheckboxes.forEach(t => t.checked = false);
    const listForRemove = selectedList.querySelectorAll(`*:not([data-type="date-range-start"])`)
    listForRemove.forEach(i => i.remove());
}
const resetDateRange = () => {
    const dateStart = document.querySelector(`.filter-drawer input[data-type="date-range-start"]`);
    const dateEnd = document.querySelector(`.filter-drawer input[data-type="date-range-end"]`);
    dateStart.value = queryStrHandler.defaultStartDate; 
    dateEnd.value = queryStrHandler.defaultEndDate;

    const listForRemove = selectedList.querySelectorAll(`[data-type="date-range-start"]`)
    listForRemove.forEach(i => i.remove()); 
}

const getDateRangeWitToORFrom = (input) => input.type == "date-range-start" ? `from ${input.value}` : `to ${input.value}`; 

const addEventListenerToInput = (input) => {
    input.addEventListener("change", () => {
        const type = input.dataset.type; 
        const value = input.value;

        if (input.type === "checkbox") {
            resetDateRange(); 
            
            if (input.checked) createChip(input.parentNode.textContent.trim(), value, type);
            else selectedList.querySelector(`[data-value="${value}"][data-type="${type}"]`)?.remove();
        }
        
        if (input.type === "date") {
          resetAllButDateRange(); 

          const alreadyExist = selectedList.querySelector(`[data-type="${type}"]`)

          if(!alreadyExist) {
             createChip(getDateRangeWitToORFrom(input), value || input.value, type);
          } else {

          if(type == "date-range-start" && new Date(value).getFullYear() == new Date(queryStrHandler.defaultStartDate).getFullYear()) 
            alreadyExist.remove();
          if(type == "date-range-end" && new Date(value).getFullYear() == new Date(queryStrHandler.defaultStartDate).getFullYear()) 
            alreadyExist.remove();

            alreadyExist.innerHTML = getDateRangeWitToORFrom(input);
          }
        }

          
    });
}

const loadFromPostQueryStr = () => {
  // const getQueryParams = () => {
  //   return Object.fromEntries(new URLSearchParams(window.location.search));
  // };
  const params = Object.fromEntries(new URLSearchParams(window.location.search));
  
  // 1. Search input
  const searchInput = document.querySelector('searchInput'); 
  if (params.search && searchInput) searchInput.value = params.search;
  
  // 2. Category checkboxes
  if (params.categories) {
    const catIds = params.categories.split(",");
    catIds.forEach(id => {
      const checkbox = document.querySelector(`[value="${id}"][data-type="category"]`);
      if (checkbox) { 
        checkbox.checked = true;
        createChip(checkbox.parentNode.textContent.trim(), checkbox.value, "category");
      }
    });
  }

  // 3. Tag checkboxes
  if (params.tags) {
    const tagIds = params.tags.split(",");
    tagIds.forEach(id => {
      console.log(id);
      
    const checkbox = document.querySelector(`[value="${id}"][data-type="tag"]`);
      if (checkbox) { 
        checkbox.checked = true; 
        createChip(checkbox.parentNode.textContent.trim(), checkbox.value, "tag"); 
      }
    });
  }

  // 4. Date range
  const startInput = document.querySelector('input[data-type="date-range-start"]');
  const endInput = document.querySelector('input[data-type="date-range-end"]');
  
  if (params.startDate && startInput) {
    startInput.value = params.startDate;
    createChip(getDateRangeWitToORFrom(startInput), params.startDate, "date-range-start");
  }

  if (params.endDate && endInput) {
    endInput.value = params.endDate;
    createChip(getDateRangeWitToORFrom(endInput), params.endDate, "date-range-end");
  }
};


const renderCategoriesToFilter = async () => {
    const categories = await readAllCategoires(); 
    const categoryContainer = document.getElementById("categoriesContainer");
    categoryContainer.innerHTML = "";
    categories.forEach(c => { 
      renderCheckboxes(c.id, c.name, categoryContainer, "category"); 
    });
}
const renderTagsToFilter = async () => {
    const tags = await readAllTags(); 
    const tagsContainer = document.getElementById("tagsContainer");
    tagsContainer.innerHTML = ""; 
    tags.forEach(t => { 
      renderCheckboxes(t.id, t.name, tagsContainer, "tag"); 
    });
}
async function renderSelectableElements() {
    await renderCategoriesToFilter();
    await renderTagsToFilter(); 
    addEventListenerToInput(document.querySelector(`[data-type="date-range-start"]`)) 
    addEventListenerToInput(document.querySelector(`[data-type="date-range-end"]`))
    loadFromPostQueryStr(); 
}
renderSelectableElements(); 

// --- Sort change ---
document.getElementById("sort").addEventListener("change", () => {
    postsPaginator.setPage(1);
}); 
document.getElementById("applyFilterBtn").addEventListener("click", () => {
  if (window.innerWidth <= 992) 
     switchFilter(false);

    postsPaginator.setPage(1); 
}); 

document.getElementById("resetFilterBtn").addEventListener("click", reset);

