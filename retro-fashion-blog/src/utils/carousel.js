import PATHS from "@/constants/paths";


const createCarousel = (images, displayElem, carouselLeftBtn, carouselRightBtn, bottomPanel, interval) => {
    let index = 0;
    let intervalId = null;

    if (images.length > 0) {
        displayElem.style.backgroundImage = `url(${images[0].imgUrl})`;
        const span = document.createElement("span");
        span.innerText = images[0].title;
        span.classList.add("carousel-text"); // so you can style it in CSS
        displayElem.appendChild(span);
    }

    const changeImg = (index) => {
        displayElem.style.backgroundImage = `url(${images[index].imgUrl})`;
        const span = displayElem.querySelector("span");
        if (span) span.innerText = images[index].title;

        changeActiveDot(index);

        if (intervalId) {
            clearInterval(intervalId);
            startLoop(interval);
        }
    }

    const onDotClick = (idx) => {
        changeImg(idx);
        changeActiveDot(idx);
        index = idx; 
    }

    const createDots = () => {
        bottomPanel.innerHTML = images
            .map((img, i) => `
                <div data-img-index="${i}" 
                    class="dot ${i === 0 ? "active" : ""}">
                </div>`
            ).join("");

        // add listeners after dots exist
        bottomPanel.querySelectorAll(".dot").forEach(dot => {
            dot.addEventListener("click", () => {
                const index = parseInt(dot.dataset.imgIndex, 10);
                onDotClick(index);
            });
        });
    }

    const changeActiveDot = (index) => {
        const prev = bottomPanel.querySelector(".active");
        prev.classList.remove("active");
        const current = bottomPanel.querySelector(`[data-img-index="${index}"]`);
        current.classList.add("active");
    }

    createDots();

    const moveOverBgUrl = (direction) => {
        if (images.length <= 1)
            return;
        if (direction === "right") {
            index++;
            if (index > images.length - 1) {
                index = 0;
            }
        }
        if (direction === "left") {
            index--;
            if (index < 0) {
                index = images.length - 1;
            }
        }
        changeImg(index);
    }

    carouselLeftBtn.addEventListener("click", (e) => {
        moveOverBgUrl("left")
    });
    carouselRightBtn.addEventListener("click", (e) => {
        moveOverBgUrl("right")
    });

    displayElem.addEventListener("click", (e) => {
        if(e.target === e.currentTarget)
            window.location.href = PATHS.POST(images[0].postId);
    })

    const startLoop = () => {
        intervalId = setInterval(() => {
            moveOverBgUrl("right");
        }, interval)
    }


    return {
        get index() { return index; },
        startLoop,
        stop: () => {
            clearInterval(intervalId);
        }
    }
}


const SliderDirection = {
    vertical: "vertical",
    horizontal: "horizontal",
}

const createSlider = (slider) => {
    let items = Array.from(slider.children);
    let intervalId = null;
    let index = 0;
    const itemHeight = items[0].offsetHeight; 
    const itemWidth = items[0].offsetWidth; 
    
    // Clone all items and append for seamless loop
    items.forEach(cat => {
        const clone = cat.cloneNode(true);
        slider.appendChild(clone);
    });
    
    const start = (direction, interval, animationTime) => {
        if(!animationTime)
            animationTime = (interval/1000)/2;
        
        intervalId = setInterval(() => {
            index++;
            slider.style.transition = `transform ${animationTime}s ease-in-out`;
            if(direction === SliderDirection.vertical) 
                slider.style.transform = `translateY(-${itemHeight * index}px)`;
            else if(direction === SliderDirection.horizontal) {
                slider.style.transform = `translateX(-${itemWidth * index}px)`;
            }
            
            // When we've scrolled through all original items,
            if (index === items.length) {
                setTimeout(() => {
                    slider.style.transition = "none";
                    if (direction ===SliderDirection.vertical)
                        slider.style.transform = "translateY(0)";
                    else if (direction === SliderDirection.horizontal) {
                        slider.style.transform = "translateX(0)";
                    }
                    index = 0;
                }, animationTime * 1000);
            }
        }, interval);
    }

    return {
        start,
        stop: () => {
            clearInterval(intervalId); 
        }
    }

}




export {
    createCarousel,
    createSlider,
    SliderDirection

}
