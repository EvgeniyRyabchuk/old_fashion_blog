
const images = [
    {
        title: "Male",
        imgUrl: '../../images/background_cover_1.png'
    },
    {
        title: "Female",
        imgUrl: '../../images/background_cover_2.png'
    },
    {
        title: "Male",
        imgUrl: '../../images/1960s-minidress4.jpg'
    },
]

const createCarousel = (images, displayElem, carouselLeftBtn, carouselRightBtn, bottomPanel, interval) => {

    let index = 0; 
    let intervalId = null;

    if(images.length > 0) 
        displayElem.style.backgroundImage = `url(${images[0].imgUrl})`;

    const changeImg = (index) => {
        displayElem.style.backgroundImage = `url(${images[index].imgUrl})`;
        changeActiveDot(index); 
        if(intervalId) {
            clearInterval(intervalId);
            startLoop(interval); 
        }
  
    }

    const onDotClick = (index) => {
        changeImg(index);
        changeActiveDot(index); 
    }

    const createDots = () => {
        bottomPanel.innerHTML = images
    .map(
      (img, i) => `
        <div data-img-index="${i}" 
             class="dot ${i === 0 ? "active" : ""}">
        </div>`
    )
    .join("");
    
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
        if(images.length <= 1)
            return;
        if(direction === "right") {
            index++;
            if(index > images.length - 1) {
                index = 0;
            } 
        }
        if(direction === "left") {
            index--;
            if(index < 0) {
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

    const startLoop = () => {
        intervalId = setInterval(() => {
            moveOverBgUrl("right");
        }, interval)
    }

    return {
        startLoop
    }

}

const carouselLeftBtn = document.getElementById("carouselLeftBtn");
const carouselRightBtn = document.getElementById("carouselRightBtn");
const carouselBottomPanel = document.getElementById("bottomPanel"); 
const displayElem = document.getElementById("mainCarousel")

const mainCarousel = createCarousel(
    images, 
    displayElem, 
    carouselLeftBtn, 
    carouselRightBtn, 
    carouselBottomPanel,
    1000
);

// mainCarousel.startLoop();

