import React from 'react';
import './index.scss';

const PostCardLg = () => {
    return (
        <article className="post-card-lg loader">
            <div className="post-cover skeleton"></div>
            <div className="post-title-wrapper">
                <div className="post-title skeleton skeleton-text"></div>
            </div>
            <div className="post-short-content">
                <div className="skeleton skeleton-text short"></div>
                <div className="skeleton skeleton-text short"></div>
                <div className="skeleton skeleton-text shorter"></div>
            </div>
            <div className="more-wrapper">
                <div className="skeleton skeleton-button"></div>
            </div>
        </article>
    );
};

export default PostCardLg;