import React, {useEffect, useRef, useState} from 'react';
import {createCarousel} from "@utils/carousel";
import './index.scss';

import img1 from '@assets/images/carousel/background_cover_1.png';
import img2 from '@assets/images/carousel/bg3.png';
import img3 from '@assets/images/carousel/bg4.png';
import img4 from '@assets/images/carousel/bg5.png';
import {useFetching} from "@/hooks/useFetching";
import {fetchAllCategories} from "@/services/categories";
import PATHS from "@/constants/paths";
import {fetchCarouselContent} from "@/services/posts";

// const imagesForCarousel = [
//     {
//         title: "Male",
//         imgUrl: img1,
//         postId: 1
//     },
//     {
//         title: "Female",
//         imgUrl: img2,
//         postId: 2
//     },
//     {
//         title: "Male",
//         imgUrl: img3,
//         postId: 3
//     },
//     {
//         title: "Male",
//         imgUrl: img4,
//         postId: 4
//     },
// ]

const Carousel = ({ carouselInterval = 10000 }) => {
    console.log("Carousel")
// 1. Define refs
    const carouselLeftBtn = useRef(null);
    const carouselRightBtn = useRef(null);
    const carouselBottomPanel = useRef(null);
    const displayCarouselElem = useRef(null);

    // 2. State to hold the carousel instance
    const [mainCarousel, setMainCarousel] = useState(null);

    const [content, setContent] = useState([]);
    const [fetchContent, isLoading, error] = useFetching(async () => {
        const data = await fetchCarouselContent();
        setContent(data);
    })
    console.log(content)
    useEffect(() => {
        fetchContent();
    }, []);

    // 3. useEffect runs AFTER the component has rendered and refs are attached to the DOM
    useEffect(() => {
        // Double-check refs are not null before creating the object
        if (displayCarouselElem.current && content.length > 0) {
            const newCarousel = createCarousel(
                content,
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
            return () => newCarousel.stop();
        }
    }, [carouselInterval, content]); // Dependencies ensure it runs only if interval changes


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