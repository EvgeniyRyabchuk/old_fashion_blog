import React from 'react';
import './index.scss';
import Carousel from "@components/Billboard/Carousel";
import VerticalStand from "@components/Billboard/VerticalStand";



const Billboard = () => {

    return (
        <section className="content-section billboard">
            <Carousel />
            <VerticalStand />
        </section>
    );
};

export default Billboard;