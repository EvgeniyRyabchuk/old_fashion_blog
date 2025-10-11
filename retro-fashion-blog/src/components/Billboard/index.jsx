import React from 'react';
import './index.scss';

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
                    <a className="category" href="/posts.html?categories=1">
                        Male
                    </a>
                    <a className="category">
                        Female
                    </a>
                    <a className="category" href="/posts.html?categories=1">
                        Classic
                    </a>
                    <a className="category" href="/posts.html?categories=2">
                        News
                    </a>
                </div>
                <div className="slider">
                    <a className="category" href="/posts.html?categories=1">
                        Male
                    </a>
                    <a className="category" href="/posts.html?categories=1">
                        Female
                    </a>
                    <a className="category" href="/posts.html?categories=1">
                        Classic
                    </a>
                    <a className="category" href="/posts.html?categories=2">
                        News
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Billboard;