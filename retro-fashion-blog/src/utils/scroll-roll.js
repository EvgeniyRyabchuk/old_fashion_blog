
const createScrollRow = (scrollAmount, section, leftBtn, rightBtn) => {
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

    return {
        toggleScrollButtons
    }
}

export default createScrollRow;