import React, {useState} from 'react';
import './index.scss';

import SortSection from "@pages/Posts/SortSection";
import FilterDrawer from "@pages/Posts/FilterDrawer";
import breakpoints from "@/constants/breakpoints";
import Pagination from "@components/Pagination";
import {StandardLoader} from "@components/Loader";
import {useFetching} from "@/hooks/useFetching";
import {db} from "@/firebase/config";
import {useLang} from "@/context/LangContext";
import {fetchDataFirestore} from "@/services";
import postFilterQueryCreator from "@utils/post-filter-query-creator";
import PostCard from "@components/PostCard";
import {PostCardSize} from "@/constants/sizes";


const Posts = () => {

    const [isFilterOpen, setIsFilterOpen] = React.useState(false);

    const switchFilter = () => {
        setIsFilterOpen(!isFilterOpen);
        if (window.innerWidth <= breakpoints.lg) {
            document.body.classList.toggle("no-scroll");
        }
    }

    const { t } = useLang();

    const [posts, setPosts] = useState([]);

    const [fetchPosts, isLoading, error] = useFetching(async ({page, perPage, cursorHandler, options}) => {
         const res = await fetchDataFirestore(
            "posts", page, perPage, cursorHandler, {
            orderField: "createdAt", // must exist in your docs
            filterHandler: postFilterQueryCreator,
            options: {t, ...options}
        })
        setPosts(res.items)
        return res;
    })



    return (
        <>
            <SortSection
                onFilterChange={(e) => console.log(e.target.value)}
                onFilterToggle={switchFilter}
            />

            <FilterDrawer
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}

            />

            <section className="content-section">
                <h2 className="main-content-title" id="mainContentTitle" data-i18n="posts-title">Posts</h2>
                <h3 id="noPostsData" className="no-data switchable" data-i18n="posts-no-data">No data yet</h3>
                <div id="postLoader" className="loader-wrapper abs bg-transparent" style={{height: "500px"}}>
                    {isLoading && <StandardLoader isActive={true}/>}
                </div>
                <div className="posts-wrapper" id="postsWrapper">
                    {posts.map(post => (
                        <PostCard key={post.id} post={post} size={PostCardSize.xl} />
                    ))}
                </div>

                <Pagination
                    colName="posts"
                    fetchData={fetchPosts}
                    perPageDefault={5}
                    initialPage={1}
                    items={posts}
                    setItems={setPosts}
                />
            </section>

        </>
    );
};

export default Posts;