import React, {useMemo} from 'react';
import './index.scss';
import {PostCardSize} from '@/constants/sizes';
import {Link} from "react-router-dom";


const PostCard = ({ post, size }) => {

    const containerClass = useMemo(() => {
        const base = 'post-card';
        if(size === PostCardSize.xl) return `${base}-xl`;
        else if(size === PostCardSize.lg) return `${base}-lg`;
        else return base;
    }, [size])

    return (
        <article className={containerClass}>
            <Link to={`/post.html?id=${post.id}`}>
                <div className="post-cover">
                    <img src={post.coverUrl}
                         alt={post.title}
                    />
                </div>
                <div className="post-title-wrapper">
                    <span className="post-title">
                        {post.title}
                    </span>
                </div>
                <div className="post-short-content">
                    {post.content}
                </div>
            </Link>
            <div className="more-wrapper">
                <a href="/post.html?id=2Sm03CgjZYY4txkRwS14"
                   className="read-more">
                    Read More &gt;&gt;
            </a>
            </div>
        </article>
    );
};

export default PostCard;