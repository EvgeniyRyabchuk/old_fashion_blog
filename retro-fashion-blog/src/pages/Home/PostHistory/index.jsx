import React from 'react';
import {fetchPostsByIds} from "@/services";

import PostCard from "@components/PostCard";
import {PostCardSize} from "@/constants/sizes";
import {PostCardLg} from "@components/Loader";
import ScrollableRow from "@components/ScrollableRow";
import {useLang} from "@/context/LangContext";

const fetch = async () => {
    const historyStr = localStorage.getItem("postHistory");

    if (!historyStr) return [];

    let history = historyStr.split(",");

    // Fetch posts by ID
    const posts = await fetchPostsByIds(history);

    // if post is deleted then delete it from history as well
    history = history.filter(h => h === posts.find(p => p.id === h)?.id);
    localStorage.setItem("postHistory", history.join(","));

    const orderedPosts = history.map(h => {
        return posts.find(p => p.id === h);
    })

    return orderedPosts;
};


const PostHistory = () => {
    const { t } = useLang();
    return (
        <ScrollableRow
            callback={fetch}
            Card={PostCard}
            cardProps={{ size: PostCardSize.lg }}
            Placeholder={PostCardLg}
            title={t("section-view-history")}
        />
    );
};

export default PostHistory;