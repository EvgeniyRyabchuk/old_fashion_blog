import React, {useEffect, useRef, useState} from 'react';
import {Link} from "react-router-dom";
import './index.scss';
import PATHS from "@/constants/paths";
import {createSlider, SliderDirection} from "@utils/carousel";
import {useMediaQuery} from "@/hooks/useMediaQuery";
// import categories from "@components/Layout/StandardLayout/Header/data/common-nav/categories";
import MaxWBreakpoints from "@/constants/MaxWBreakpoints";
import {useFetching} from "@/hooks/useFetching";
import {fetchAllCategories} from "@/services/categories";


const VerticalStand = ({ interval = 6000, animationTime = 2}) => {
    const isMobile = useMediaQuery(MaxWBreakpoints.xl);
    const [sliderInstance, setSliderInstance] = useState(null);
    const slider = useRef(null);

    const [categories, setCategories] = useState([]);
    const [fetchCategories, isLoading, error] = useFetching(async () => {
        const cList = await fetchAllCategories();
        setCategories(cList)
    })
    useEffect(() => {
        fetchCategories();
    }, []);


    useEffect(() => {
        if(slider.current && categories.length > 0) {
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
                    <div className="category" key={item.id}>
                        <Link key={`mobile-${item.id}`}
                              className="category-img scaled-0"
                              to={`${PATHS.POSTS}?categories=${item.id}`}
                              style={{backgroundImage: `url(${item.imgUrl})`}}
                        >
                            <span>{item.name_en}</span>
                        </Link>
                    </div>

                ))}
            </div>
            <div className="slider" ref={slider}>
                {categories.map((item) => (
                    <div className="category" key={item.id}>
                        <Link key={`desktop-${item.id}`}
                              className="category-img scaled-in"
                              to={`${PATHS.POSTS}?categories=${item.id}`}
                              style={{backgroundImage: `url(${item.imgUrl})`}}
                        >
                            <span>{item.name_en}</span>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VerticalStand;