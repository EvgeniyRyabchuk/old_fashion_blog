import React from 'react';
import {fetchPostsByIds} from "@/services";

import PostCard from "@components/PostCard";
import {PostCardSize} from "@/constants/sizes";
import {PostCardLg} from "@components/Loader";
import ScrollableRow from "@components/ScrollableRow";

const fetch = async () => {
    const historyStr = localStorage.getItem("postHistory");

    if (!historyStr) return [];

    let history = historyStr.split(",");

    // Fetch posts by ID
    const posts = await fetchPostsByIds(history);

    // if post is deleted then delete it from history as well
    history = history.filter(h => h === posts.find(p => p.id === h)?.id);
    localStorage.setItem("postHistory", history.join(","));
    return history;
};


const PostHistory = () => {

    return (
        <ScrollableRow
            callback={fetch}
            Card={PostCard}
            cardProps={{ size: PostCardSize.lg }}
            Placeholder={PostCardLg}
        />
    );
};

export default PostHistory;