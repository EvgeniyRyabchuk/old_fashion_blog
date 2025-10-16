
const createScrollRow = (scrollAmount, sectionId, leftBtnId, rightBtnId) => {
  const section = document.getElementById(sectionId);
  const leftBtn = document.getElementById(leftBtnId);
  const rightBtn = document.getElementById(rightBtnId);

  leftBtn.addEventListener("click", () => {
    section.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });

  rightBtn.addEventListener("click", () => {
    section.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });

  function toggleScrollButtons() {
    const isOverflowed = section.scrollWidth > section.clientWidth;
    if (isOverflowed) {
      leftBtn.classList.add("is-open");
      rightBtn.classList.add("is-open");
    } else {
      leftBtn.classList.remove("is-open"); 
      rightBtn.classList.remove("is-open");
    }
  }

  window.addEventListener("resize", () => toggleScrollButtons());
  toggleScrollButtons(); 

  return {
    toggleScrollButtons
  }
}

const lastPostsRow = createScrollRow(
  300,
  "lastPostsSection", 
  "lastPostsLeftBtn", 
  "lastPostsRightBtn",
); 
// const postHistoryRow = createScrollRow(
//   300,
//   "postHistory", 
//   "postHistoryLeftBtn", 
//   "postHistoryRightBtn"
// ); 
