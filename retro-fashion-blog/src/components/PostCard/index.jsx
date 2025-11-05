import React, {useMemo} from 'react';
import './index.scss';
import {PostCardSize} from '@/constants/sizes';
import {Link} from "react-router-dom";
import PATHS from '@/constants/paths';
import {getPostContentPreview} from "@utils/format";
import {useLang} from "@/context/LangContext";

const PostCard = ({ post, size }) => {
    const { t } = useLang();
    const containerClass = useMemo(() => {
        const base = 'post-card';
        if(size === PostCardSize.xl) return `${base}-xl`;
        else if(size === PostCardSize.lg) return `${base}-lg`;
        else return base;
    }, [size])

    return (
        <article className={containerClass}>
            <Link to={PATHS.POST(post.id)}>
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
                    {size === PostCardSize.lg && post.content}
                    {size === PostCardSize.xl && getPostContentPreview(post.content) }
                </div>
            </Link>
            <div className="more-wrapper">
                <Link to={PATHS.POST(post.id)}
                   className="read-more">
                    {t("read-more")} &gt;&gt;
                </Link>
            </div>
        </article>
    );
};

export default PostCard;