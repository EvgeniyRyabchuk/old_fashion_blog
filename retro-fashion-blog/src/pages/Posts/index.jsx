import React, {useEffect, useState} from 'react';
import './index.scss';

import SortSection from "@pages/Posts/SortSection";
import breakpoints from "@/constants/breakpoints";
import Pagination from "@components/Pagination";
import {PostCardXl} from "@components/Loader";
import {useFetching} from "@/hooks/useFetching";
import {useLang} from "@/context/LangContext";
import {fetchDataFirestore} from "@/services";
import PostCard from "@components/PostCard";
import {PostCardSize} from "@/constants/sizes";
import Breadcrumb from "@components/Breadcrumb";
import useQueryParams from "@/hooks/useQueryParams";
import {usePaginate} from "@/hooks/usePaginate";
import {defPage, defPerPage} from "@/constants/default";
import FilterDrawer from "@pages/Posts/FilterDrawer";


const colName = "posts";

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



    const { updateSearchParams, postFilterQueryCreator, setSearchParams, searchParams } = useQueryParams();

    const [order, setOrder] = useState("asc");
    const [orderField, setOrderField] = useState(searchParams.get("sort") ?? "newest");

    console.log(orderField);

    const [fetchPosts, isPostFetchLoading, error] = useFetching(async ({page, perPage, cursorHandler, options: restOptions }) => {
        // const { isLoadMore } = options || {};
        const options= {
            sort: orderField, // must exist in your docs
            filterHandler: postFilterQueryCreator,
            t,
            ...restOptions
        }

        const res = await fetchDataFirestore(
            colName,
            page,
            perPage,
            cursorHandler,
            options
        )

        return res;
    })

    const {
        totalCount,
        totalPages,
        currentPage,
        perPage,
        goToPage,
        loadMore,
        reload,
        resetPagination,
        loading: paginationLoading,
        setPerPage,
        setCurrentPage,
        pageForLoadMore
    } = usePaginate({
        colName,
        fetchData: fetchPosts,
        perPageDefault: parseInt(searchParams.get("perPage") ?? defPerPage),
        initialPage: parseInt(searchParams.get("page") ?? defPage),
        setItems: setPosts,
        items: posts,
        reloadDeps: [orderField],
        isScrollUp: true,
    });

    useEffect(() => {
        reload(currentPage);
    }, [orderField, perPage]);

    useEffect(() => {
        updateSearchParams({ sort: orderField, page: pageForLoadMore, perPage });
    }, [orderField, perPage, pageForLoadMore]);

    console.log('posts', posts);

    return (
        <>
            <Breadcrumb
                items={[
                    { to: "/", label: "Home" },
                    // { to: "/blog", label: "Blog" },
                    { label: "Posts" },
                ]}
            />

            <SortSection
                value={orderField}
                setValue={setOrderField}
                onFilterToggle={switchFilter}
                isActive={!isPostFetchLoading && !paginationLoading}
            />


            <FilterDrawer
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                reload={reload}
                onCommit={(params, isReset = false) => {
                    updateSearchParams({sort: orderField, ...params}, isReset);
                    reload(1);
                }}
                isActive={!isPostFetchLoading && !paginationLoading}
            />



            <section className="content-section">
                {/*<h2 className="main-content-title" id="mainContentTitle" data-i18n="posts-title">Posts</h2>*/}
                <h3 id="noPostsData" className="no-data switchable" data-i18n="posts-no-data">No data yet</h3>

                <div className="posts-wrapper" id="postsWrapper">
                    {(isPostFetchLoading || paginationLoading) &&
                        // <StandardLoader isActive={true} style={{height: "500px"}}/>
                        new Array(6).fill(null).map((_, index) => (
                            <PostCardXl key={index} />
                        ))
                    }
                    {!isPostFetchLoading &&
                        posts.map(post => (
                            <PostCard key={post.id} post={post} size={PostCardSize.xl} />
                        ))
                    }
                    { !isPostFetchLoading && !paginationLoading && posts.length === 0 && (
                        <p>No post</p>
                    ) }
                </div>

                <Pagination
                    colName="posts"
                    fetchData={fetchPosts}
                    perPageDefault={searchParams.get("perPage") || defPerPage}
                    initialPage={searchParams.get("page") || defPage}
                    items={posts}
                    setItems={setPosts}

                    totalPages={totalPages}
                    currentPage={currentPage}
                    perPage={perPage}
                    goToPage={goToPage}
                    loadMore={loadMore}
                    onPerPageChange={(e) => {
                        setPerPage(e.target.value);
                        setCurrentPage(1);
                    }}
                    pageForLoadMore={pageForLoadMore}
                    isScrollUp={true}
                />
            </section>

        </>
    );
};

export default Posts;