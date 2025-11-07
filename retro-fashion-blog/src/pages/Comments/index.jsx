import React, {useEffect, useMemo, useState} from 'react';
import './index.scss';
import Table from "@components/Table";
import {useFetching} from "@/hooks/useFetching";
import {useLang} from "@/context/LangContext";
import {fetchDataFirestore} from "@/services";
import {usePaginate} from "@/hooks/usePaginate";
import {defPage, defPerPage} from "@/constants/default";
import Pagination from "@components/Pagination";
import {StandardLoader} from "@components/Loader";
import Breadcrumb from "@components/Breadcrumb";
import {toast} from "react-toastify";
import {removeComment} from "@/services/comments";
import {getAuthUserById} from "@/services/auth";
import useQueryParams from "@/hooks/useQueryParams";
import TableAction from "components/Table/TableActions";
import TableActions from "@/constants/table-actions";

const colName = "comments";

const Comments = () => {
    const { t } = useLang();
    const { updateSearchParams, setSearchParams, searchParams } = useQueryParams();

    const staticCols = [
        { name: t("comments-t-id") || "ID", key: "id" },
        { name: t("comments-t-postId") || "Post ID", key: "postId" },
        { name: t("comments-t-author") || "Author", key: "author" },
        {
            name: t("comments-t-content") || "Content",
            key: "content",
            type: "largeText",
            tdContentStyle: { maxWidth: "200px" }
        },
        { name: t("comments-t-createdAt") || "Created At", key: "createdAt" },
        {
            name: t("comments-t-TableActions") || "Actions",
            key: "actions",
            type: "actions",
            tdStyle: { maxWidth: "140px"}
        },
    ];

    const [comments, setComments] = useState([]);

    const [fetchCommentsData, isCommentsFetchLoading, error] = useFetching(async ({page, perPage, cursorHandler, options: restOptions }) => {
        const options = {
            sort: searchParams.get("sort") ?? "newest",
            t,
            ...restOptions
        };

        const res = await fetchDataFirestore(
            colName,
            page,
            perPage,
            cursorHandler,
            options
        );

        // Collect unique user IDs to fetch user data efficiently
        const uniqueUserIds = [...new Set(res.items.map(comment => comment.userId))];
        const userMap = new Map();

        // Fetch user data for all unique user IDs
        for (const userId of uniqueUserIds) {
            try {
                const user = await getAuthUserById(userId);
                userMap.set(userId, {
                    name: user.name || user.id || "N/A",
                    avatar: user.avatar || "/images/profile.png"
                });
            } catch (err) {
                console.error(`Error loading user ${userId}:`, err);
                userMap.set(userId, {
                    name: userId || "N/A",
                    avatar: "/images/profile.png"
                });
            }
        }

        // Enhance comments with user information
        const enhancedItems = res.items.map(comment => ({
            ...comment,
            user: userMap.get(comment.userId) || {
                name: comment.userId || "N/A",
                avatar: "/images/profile.png"
            }
        }));

        return {
            ...res,
            items: enhancedItems
        };
    });

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
        fetchData: fetchCommentsData,
        perPageDefault: parseInt(searchParams.get("perPage") ?? defPerPage),
        initialPage: parseInt(searchParams.get("page") ?? defPage),
        setItems: setComments,
        items: comments,
        isScrollUp: false,
    });

    useEffect(() => {
        reload(currentPage);
    }, [searchParams.get("sort"), perPage]);

    useEffect(() => {
        updateSearchParams({ sort: searchParams.get("sort") ?? "newest", page: pageForLoadMore, perPage });
    }, [searchParams.get("sort"), perPage, pageForLoadMore]);


    const tableRows = useMemo(() => {
        if(!comments || comments.length === 0) return [];

        const actionSectionGenerate = (comment) => (
            <TableAction
                actions={[TableActions.GO_TO, TableActions.DELETE]}
                navigateUrl={`/posts/${comment.postId}`}
                onDeleteClick={async () => {
                    try {
                        await removeComment(comment.id, true); // isAdmin = true
                        toast.success(t("comment-delete-success") || "Comment deleted successfully.");
                        // Reload the comments list after deletion
                        if(comments.length > 1) {
                            reload(currentPage);
                        } else {
                            reload(currentPage - 1);
                        }
                    } catch (err) {
                        console.error("Error deleting comment:", err);
                        toast.error(err.message || (t("comment-delete-failed") || "Failed to delete comment"));
                    }
                }}
            />
        );

        return comments.map(comment => {
            const user = comment.user || { name: "N/A", avatar: "/images/profile.png" };
            return {
                id: comment.id,
                postId: comment.postId,
                author: (
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <img 
                            src={user.avatar || "/images/profile.png"} 
                            alt={user.name || "User"} 
                            style={{ 
                                width: "30px", 
                                height: "30px", 
                                borderRadius: "50%", 
                                marginRight: "8px",
                                objectFit: "cover"
                            }}
                        />
                        <span>{user.name || comment.userId || "N/A"}</span>
                    </div>
                ),
                content: comment.content || "N/A",
                createdAt: comment.createdAt?.toDate ? comment.createdAt.toDate().toLocaleString() : "N/A",
                actions: actionSectionGenerate(comment)
            };
        });
    }, [comments]);




    return (
        <>
            <Breadcrumb
                items={[
                    { to: "/", label: t("nav-home") || "Home" },
                    { label: t("title-comments") || "Comments" },
                ]}
            />

            <section className="content-section comments-table-section">
                <StandardLoader isActive={isCommentsFetchLoading || loading} />

                <Table cols={staticCols} rows={tableRows} />

                <Pagination
                    colName={colName}
                    fetchData={fetchCommentsData}
                    perPageDefault={defPerPage}
                    initialPage={defPage}
                    items={comments}
                    setItems={setComments}
                    totalPages={totalPages}
                    currentPage={currentPage}
                    perPage={perPage}
                    goToPage={goToPage}
                    loadMore={loadMore}
                    onPerPageChange={(e) => {
                        setPerPage(e.target.value);
                        setCurrentPage(1);
                        updateSearchParams({ sort: searchParams.get("sort") ?? "newest", page: 1, perPage: e.target.value });
                    }}
                    pageForLoadMore={pageForLoadMore}
                    isScrollUp={false}
                />
            </section>
        </>
    );
};

export default Comments;