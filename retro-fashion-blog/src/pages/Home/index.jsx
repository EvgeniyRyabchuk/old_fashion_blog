import React from 'react';
import './index.scss';
import Breadcrumb from "../../components/Breadcrumb";
import Billboard from "../../components/Billboard";

const Home = () => {
    return (
        <>
            <Breadcrumb/>
            <div style={{visibility: "hidden"}}>dsf</div>
            <Billboard/>


            <section className="content-section">
                <h3 className="main-content-title" data-i18n="section-last-posts">Last Posts</h3>
                <div className="post-row" id="lastPostsSection">
                    <button id="lastPostsLeftBtn" className="left-btn">◀</button>
                    <button id="lastPostsRightBtn" className="right-btn">▶</button>
                </div>
            </section>

            <section className="content-section tags-section">
                <h3 className="main-content-title" data-i18n="section-most-popular-tags">Most Popular Tags</h3>
                <div id="tagsRow" className="tags-row">
                </div>
            </section>

            <section className="content-section">
                <h3 className="main-content-title" data-i18n="section-view-history">View History</h3>
                <div className="post-row" id="postHistory">
                    <button id="postHistoryLeftBtn" className="left-btn">◀</button>
                    <button id="postHistoryRightBtn" className="right-btn">▶</button>
                </div>
            </section>
        </>
    );
};

export default Home;