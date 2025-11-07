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
import Spoiler from "@components/Spoiler";
import {removePostById} from "@/services/posts";
import {useAuth} from "@/context/AuthContext";
import Spinner from "@components/Loader/Spinner";
import {toast} from "react-toastify";
import Breadcrumb from "@components/Breadcrumb";
import TableAction from "components/Table/TableActions";
import TableActions from "@/constants/table-actions";

const colName = "posts";




const CreateEditPost = () => {

    const [isSpoilerPostCreateOpen, setIsSpoilerPostCreateOpen] = useState(false);
    const { user, isAuth } = useAuth();
    const { t, getLocCatName } = useLang();
    const { updateSearchParams, postFilterQueryCreator, setSearchParams, searchParams } = useQueryParams();

    const staticCols = [
        { name: t("create-edit-t-id") || "ID",         key: "id" },
        { name: t("create-edit-t-title") || "Title",      key: "title" },
        { name: t("create-edit-t-content") || "Content",    key: "content", type: "largeText" },
        { name: t("create-edit-t-coverUrl") || "Cover URL",          key: "coverUrl", type: "img" },
        { name: t("create-edit-t-category") || "Category",           key: "category" },
        { name: t("create-edit-t-dateRange") || "Date Range",         key: "dateRange" },
        { name: t("create-edit-t-userId") || "Creator User ID",    key: "userId" },
        { name: t("create-edit-t-createdAt") || "Created At",         key: "createdAt" },
        { name: t("create-edit-t-tags") || "Tags",               key: "tags" },
        { name: t("create-edit-t-TableActions") || "Actions",            key: "actions", type: "actions" },
    ];

    const [posts, setPosts] = useState([]);
    const [order, setOrder] = useState("asc");
    const [orderField, setOrderField] = useState("newest");

    const [fetchPosts, isPostFetchLoading, error] =
        useFetching(async ({page, perPage, cursorHandler, options: restOptions }) => {
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
        reload(currentPage);
    }, [orderField, perPage]);

    useEffect(() => {
        updateSearchParams({ sort: orderField, page: pageForLoadMore, perPage });
    }, [orderField, perPage, pageForLoadMore]);



    console.log(posts);

    const tableRows = useMemo(() => {
        if(!posts && posts.length === 0) return [];

        const actionSectionGenerate = (id) => (
            <TableAction
                actions={[TableActions.EDIT, TableActions.DELETE]}
                onEditClick={() => {
                    toggleBodyScroll(false, false, true);
                    setIsSpoilerPostCreateOpen(true);
                    updateSearchParams({ postId: id})
                }}
                onDeleteClick={async () => {
                    //TODO: test
                    if(!isAuth || !user.isAdmin) return;
                    await removePostById(id);
                    toast.success("Post is deleted successfully.");
                    if(posts.length > 1)
                        reload(currentPage);
                    else
                        reload(currentPage - 1);
                    //TODO: clear from if there is postId in url
                }}
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


    // ================= FETCH POST ==================
    const [postToEdit, setPostToEdit] = useState(null);
    const postId = searchParams.get("postId");

    const formTitle = useMemo(() =>
        `${postId ? t("update-post") || "Update" : t("create-post") || "Create"}`,
        [postId, t]);
    const saveBtnTitle = useMemo(() =>
        `${postId ? t("update-post") || "Update" : t("save-post") || "Save"}`,
        [postId, t])

    useEffect(() => {
        if(postId) setIsSpoilerPostCreateOpen(true);
    }, []);

    return (
        <>
            <Breadcrumb
                items={[
                    { to: "/", label: t("nav-home") || "Home" },
                    { label: t("title-create-edit-post") || "Create or Edit Posts" },
                ]}
            />

            <section className="content-section post-form-section">
                <Spoiler
                    title={formTitle}
                    setIsOpen={setIsSpoilerPostCreateOpen}
                    isOpen={isSpoilerPostCreateOpen}
                >
                    <PostForm
                        onCommit={() => reload(1) }
                        saveBtnTitle={saveBtnTitle}
                        postId={postId}
                        postToEdit={postToEdit}
                        setPostToEdit={setPostToEdit}
                    />
                </Spoiler>
            </section>

            <section className="content-section post-table-section">
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