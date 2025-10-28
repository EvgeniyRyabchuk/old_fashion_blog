import React, {useEffect, useMemo, useState} from 'react';
import './index.scss';
import useQueryParams from "@/hooks/useQueryParams";
import Table from "@components/Table";
import {useFetching} from "@/hooks/useFetching";
import {useLang} from "@/context/LangContext";
import {fetchDataFirestore} from "@/services";
import {usePaginate} from "@/hooks/usePaginate";
import {defPage, defPerPage} from "@/constants/default";
import Pagination from "@components/Pagination";
import {loadCategoriesToCollection} from "@/services/categories";
import {loadTagsToCollection} from "@/services/tags";
import {StandardLoader} from "@components/Loader";
import {getPostContentPreview} from "@utils/format";
import PostForm from "@pages/CreateEditPost/PostForm";
import {toggleBodyScroll} from "@utils/helper";

const colName = "posts";

const staticCols = [
    { dataI18n: "create-edit-t-id",         name: "ID",                 key: "id" },
    { dataI18n: "create-edit-t-title",      name: "Title",              key: "title" },
    { dataI18n: "create-edit-t-content",    name: "Content",            key: "content", type: "largeText" },
    { dataI18n: "create-edit-t-coverUrl",   name: "Cover URL",          key: "coverUrl", type: "img" },
    { dataI18n: "create-edit-t-category",   name: "Category",           key: "category" },
    { dataI18n: "create-edit-t-dateRange",  name: "Date Range",         key: "dateRange" },
    { dataI18n: "create-edit-t-userId",     name: "Creator User ID",    key: "userId" },
    { dataI18n: "create-edit-t-createdAt",  name: "Created At",         key: "createdAt" },
    { dataI18n: "create-edit-t-tags",       name: "Tags",               key: "tags" },
    { dataI18n: "create-edit-t-actions",    name: "Actions",            key: "actions", type: "actions" },
];

const EditRemove = ({ onDeleteClick, onEditClick}) => {
    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <button type="button" onClick={onEditClick}>Edit</button>
            <button type="button" onClick={onDeleteClick}>Remove</button>
        </div>
    )
}

const CreateEditPost = () => {

    const { t, getLocCatName } = useLang();
    const { updateSearchParams, postFilterQueryCreator, setSearchParams, searchParams } = useQueryParams();


    const [posts, setPosts] = useState([]);
    const [order, setOrder] = useState("asc");
    const [sort, setSort] = useState("newest");

    const [fetchPosts, isPostFetchLoading, error] = useFetching(async ({page, perPage, cursorHandler, options: restOptions }) => {
        // const { isLoadMore } = options || {};
        const options= {
            sort, // must exist in your docs
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

        await loadCategoriesToCollection(res.items);
        await loadTagsToCollection(res.items);

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
        loading,
        setPerPage,
        setCurrentPage,
        pageForLoadMore
    } = usePaginate({
        colName,
        fetchData: fetchPosts,
        perPageDefault: defPerPage,
        initialPage: defPage,
        setItems: setPosts,
        items: posts,
        isScrollUp: false,
    });

    useEffect(() => {
        updateSearchParams({ sort: sort, page: currentPage, perPage });
        reload(currentPage);
    }, [sort, perPage]);

    console.log(posts);

    const onEditTablePostClick = (id) => {
        console.log('post id edit ', id)
        updateSearchParams({ postId: id})
    }
    const onDeleteTablePostClick = (id) => {
        console.log('post id delete ', id);

    }

    const tableRows = useMemo(() => {
        if(!posts && posts.length === 0) return [];

        const actionSectionGenerate = (id) => (
            <EditRemove
                onEditClick={() => {
                    toggleBodyScroll(false, false, true);
                    onEditTablePostClick(id)
                }}
                onDeleteClick={() => onDeleteTablePostClick(id)}
            />
        );

        return posts.map(post => ({
            id: post.id,
            title: post.title,
            content: getPostContentPreview(post.content, 400),
            coverUrl: post.coverUrl,
            category: getLocCatName(post.category),
            dateRange: `${post.date_range_start}-${post.date_range_end}`,
            userId: post.userId,
            createdAt: post.createdAt.toDate().toLocaleDateString(),
            tags: post.tags.map(t => `#${t.name}`).join(', '),
            actions: actionSectionGenerate(post.id)
        }))

    }, [posts])

    console.log(tableRows)



    return (
        <>
            <section className="content-section">
                <PostForm onCommit={() => {
                    reload(1);
                }} />
            </section>

            <section className="content-section">
                <StandardLoader isActive={isPostFetchLoading || loading} />

                <Table cols={staticCols} rows={tableRows} />

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
                    isScrollUp={false}
                />
            </section>

        </>
    );
};

export default CreateEditPost;