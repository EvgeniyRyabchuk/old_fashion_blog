import React from 'react';
import './index.scss';

import SortSection from "@pages/Posts/SortSection";
import FilterDrawer from "@pages/Posts/FilterDrawer";
import breakpoints from "@/constants/breakpoints";


const Posts = () => {

    const [isFilterOpen, setIsFilterOpen] = React.useState(false);

    const switchFilter = () => {
        setIsFilterOpen(!isFilterOpen);
        if (window.innerWidth <= breakpoints.lg) {
            document.body.classList.toggle("no-scroll");
        }
    }

    return (
        <>
            <SortSection
                onFilterChange={(e) => console.log(e.target.value) }
                onFilterToggle={switchFilter}
            />

            <FilterDrawer
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}

            />
        </>
    );
};

export default Posts;