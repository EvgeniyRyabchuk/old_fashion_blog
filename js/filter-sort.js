

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

