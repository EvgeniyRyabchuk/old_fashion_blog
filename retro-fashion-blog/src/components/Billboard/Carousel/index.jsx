import React, {useEffect, useRef, useState} from 'react';
import {createCarousel} from "@utils/carousel";
import './index.scss';

import img1 from '@assets/images/background_cover_1.png';
import img2 from '@assets/images/background_cover_2.png';
import img3 from '@assets/images/1960s-minidress4.jpg';

const imagesForCarousel = [
    {
        title: "Male",
        imgUrl: img1,
        postId: 1
    },
    {
        title: "Female",
        imgUrl: img2,
        postId: 2
    },
    {
        title: "Male",
        imgUrl: img3,
        postId: 3
    },
]

const Carousel = ({ carouselInterval = 10000 }) => {

    //TODO: fetch images dynamically
// 1. Define refs
    const carouselLeftBtn = useRef(null);
    const carouselRightBtn = useRef(null);
    const carouselBottomPanel = useRef(null);
    const displayCarouselElem = useRef(null);

    // 2. State to hold the carousel instance
    const [mainCarousel, setMainCarousel] = useState(null);

    // 3. useEffect runs AFTER the component has rendered and refs are attached to the DOM
    useEffect(() => {
        // Double-check refs are not null before creating the object
        if (displayCarouselElem.current) {
            const newCarousel = createCarousel(
                imagesForCarousel,
                displayCarouselElem.current,
                carouselLeftBtn.current,
                carouselRightBtn.current,
                carouselBottomPanel.current,
                carouselInterval
            );

            // Start the loop and save the instance to state
            newCarousel.startLoop();
            setMainCarousel(newCarousel);

            // Clean up the loop when the component unmounts
            return () => newCarousel.stopLoop();
        }
    }, [carouselInterval]); // Dependencies ensure it runs only if interval changes


    return (
        <div id="mainCarousel" className="carousel" ref={displayCarouselElem}>
            <button id="carouselLeftBtn" className="left-btn" ref={carouselLeftBtn}>◀</button>
            <button id="carouselRightBtn" className="right-btn" ref={carouselRightBtn}>▶</button>

            <div className="bottom-decorate"></div>
            <div id="bottomPanel" className="bottom-panel" ref={carouselBottomPanel}>
            </div>
        </div>
    );
};

export default Carousel;