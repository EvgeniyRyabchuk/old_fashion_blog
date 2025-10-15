import React from 'react';
import './index.scss';
import {Link} from "react-router-dom";

const Billboard = () => {
    return (
        <section className="content-section billboard">
            <div id="mainCarousel" className="carousel">
                <button id="carouselLeftBtn" className="left-btn">◀</button>
                <button id="carouselRightBtn" className="right-btn">▶</button>

                <div className="bottom-decorate"></div>
                <div id="bottomPanel" className="bottom-panel">
                </div>
            </div>
            <div className="vertical-stand">
                <div className="mobile-wrapper">
                    <Link className="category" to="/posts?categories=1">
                        Male
                    </Link>
                    <Link className="category" to="/posts?categories=1">
                        Female
                    </Link>
                    <Link className="category" to="/posts?categories=1">
                        Classic
                    </Link>
                    <Link className="category" to="/posts?categories=1">
                        News
                    </Link>
                </div>
                <div className="slider">
                    <Link className="category" to="/posts?categories=1">
                        Male
                    </Link>
                    <Link className="category" to="/posts?categories=1">
                        Female
                    </Link>
                    <Link className="category" to="/posts?categories=1">
                        Classic
                    </Link>
                    <Link className="category" to="/posts?categories=1">
                        News
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Billboard;