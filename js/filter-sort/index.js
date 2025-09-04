

const filterToggle = document.getElementById("filterToggle");
const filterDrawer = document.getElementById("filterDrawer");

const drawer = document.getElementById("filterDrawer");;
const closeBtn = document.getElementById("filterCloseBtn");

const inputs = document.querySelectorAll(".filter-drawer input");
const selectedList = document.querySelector(".selected-filters__list");

const defaultStartDate = "1800-09-04";
const defaultEndDate = "2025-09-04";

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
        if (input.dataset.type === "date-range-start") input.value = defaultStartDate; 
        if (input.dataset.type === "date-range-end") input.value = defaultEndDate;
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
    dateStart.value = defaultStartDate;
    dateEnd.value = defaultEndDate;
    selectedList.innerHTML = "";

    await postsPaginator.reload();
}



const addEventListenerToInput = (input) => {
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
}
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
}


renderSelectableElements(); 

// --- Initial load ---
// document.addEventListener("DOMContentLoaded", reloadPosts);

// --- Sort change ---
document.getElementById("sort").addEventListener("change", () => {
    postsPaginator.reload(); 
}); 
document.getElementById("applyFilterBtn").addEventListener("click", () => {
    postsPaginator.reload(); 
}); 

document.getElementById("resetFilterBtn").addEventListener("click", reset);

