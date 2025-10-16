import React, {useEffect, useRef, useState} from 'react';
import PostCard from "@components/PostCard";
import {PostCardSize} from "@/constants/sizes";
import createScrollRow from "@utils/scroll-roll";
import {fetchLastPosts} from "@/services";
import {useFetching} from "@/hooks/useFetching";
import { PostCardLg } from "@components/Loader";
import ScrollableRow from "@components/ScrollableRow";

const fetch = async () => {
    console.log("Fetching last posts...");
    return await fetchLastPosts();
}

const LastPosts = () => {


    return (
        <ScrollableRow
            callback={fetch}
            Card={PostCard}
            cardProps={{ size: PostCardSize.lg }}
            Placeholder={PostCardLg}
        />
        // <section className="content-section">
        //     <h3 className="main-content-title" data-i18n="section-last-posts">Last Posts</h3>
        //     <div className="post-row-h-scrollable" id="lastPostsSection" ref={lastPostsSection}>
        //         <button id="lastPostsLeftBtn" className="left-btn" ref={lastPostsLeftBtn}>◀</button>
        //         <button id="lastPostsRightBtn" className="right-btn" ref={lastPostsRightBtn}>▶</button>
        //         {isLoading && new Array(5).fill(<PostCardLg />)}
        //         {lastPosts.map((post) => (
        //             <PostCard key={post.id} post={post} size={PostCardSize.lg} />
        //         ))}
        //     </div>
        // </section>
    );
};

export default LastPosts;