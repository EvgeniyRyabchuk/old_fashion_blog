

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

  // --- DELETE chip and uncheck/reset input ---
  chip.querySelector(".remove").addEventListener("click", () => {
    let input;

    if (type.startsWith("date")) {
      // date fields don’t have [value] in HTML → match only by type
      input = document.querySelector(`.filter-drawer input[data-type="${type}"]`); 
    } else {
      // for checkboxes match by both type + value
      input = document.querySelector(`.filter-drawer input[data-type="${type}"][value="${value}"]`);
    }

    if (input) {
      if (input.type === "checkbox") {
        input.checked = false; // uncheck
      }
      if (input.type === "date") {
        if (input.dataset.type === "date-range-start") input.value = queryStrHandler.defaultStartDate; 
        if (input.dataset.type === "date-range-end") input.value = queryStrHandler.defaultEndDate;
      }
    }

    chip.remove();
  });

  selectedList.appendChild(chip);
}


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

    await postsPaginator.reload();
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


const renderCheckboxes = (value, name, container, datasetType) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = value; 
    input.dataset.type = datasetType; 
    
    label.appendChild(input); 
    label.append(" " + name);
    addEventListenerToInput(input);
    
    container.appendChild(label);
}
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

//not loaded tags yet 


// --- Sort change ---
document.getElementById("sort").addEventListener("change", () => {
    postsPaginator.reload(); 
}); 
document.getElementById("applyFilterBtn").addEventListener("click", () => {
  if (window.innerWidth <= 992) 
     switchFilter(false);
    postsPaginator.reload();  
}); 

document.getElementById("resetFilterBtn").addEventListener("click", reset);

// loadPostQueryStr();