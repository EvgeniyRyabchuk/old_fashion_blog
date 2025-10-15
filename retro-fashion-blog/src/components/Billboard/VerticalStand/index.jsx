import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Link} from "react-router-dom";
import './index.scss';
import PATHS from "@/constants/paths";
import {createSlider, SliderDirection} from "@utils/carousel";
import {useMediaQuery} from "@/hooks/useMediaQuery";
import breakpoints from "@/constants/breakpoints";
import MaxWBreakpoints from "@/constants/MaxWBreakpoints";

const categories = [
    {
        id: 1,
        name: 'Male',
    },
    {
        id: 2,
        name: 'Female',
    },
    {
        id: 3,
        name: 'Classic',
    },
    {
        id: 4,
        name: 'News',
    }
];

const VerticalStand = ({ interval = 6000, animationTime = 2}) => {
    const isMobile = useMediaQuery(MaxWBreakpoints.xl);
    const [sliderInstance, setSliderInstance] = useState(null);
    const slider = useRef(null);

    useEffect(() => {
        if(slider.current) {
            const categoriesVSlider = createSlider(slider.current);
            setSliderInstance(categoriesVSlider);
            return () => { categoriesVSlider.stop(); };
        }
    }, [categories, interval, animationTime])

    //  Control the Slider based on Screen Size
    useEffect(() => {
        if (sliderInstance) {
            if (isMobile) {
                // If screen size is mobile, STOP the slider
                console.log("Mobile detected. Stopping slider.");
                sliderInstance.stop();
            } else {
                // If screen size is desktop, START the slider
                console.log("Desktop detected. Starting slider.");
                sliderInstance.start(SliderDirection.vertical, interval, animationTime);
            }
        }
    }, [isMobile, sliderInstance, interval, animationTime]); // Runs whenever isMobile changes

    return (
        <div className="vertical-stand">
            <div className="mobile-wrapper">
                {categories.map((item) => (
                    <Link key={`mobile-${item.id}`}
                          className="category"
                          to={`${PATHS.POSTS}?categories=${item.id}`}
                    >
                        {item.name}
                    </Link>
                ))}
            </div>
            <div className="slider" ref={slider}>
                {categories.map((item) => (
                    <Link key={`desktop-${item.id}`}
                          className="category"
                          to={`${PATHS.POSTS}?categories=${item.id}`}
                    >
                        {item.name}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default VerticalStand;