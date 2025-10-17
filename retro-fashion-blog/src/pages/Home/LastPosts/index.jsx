import React from 'react';
import PostCard from "@components/PostCard";
import {PostCardSize} from "@/constants/sizes";
import {fetchLastPosts} from "@/services";
import {PostCardLg} from "@components/Loader";
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
    );
};

export default LastPosts;