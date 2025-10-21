import {useCallback, useEffect, useMemo, useState} from "react";
import createCursorHandler from "@utils/cursor-handler";
import {toggleBodyScroll} from "@utils/helper";


// 🔹 Main React Hook
export function usePaginate({
    colName,
    fetchData,   // async ({ page, perPage, cursorHandler, options }) => { items, totalCount }
    perPageDefault = 10,
    initialPage = 1,
    items,
    setItems
}) {

    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [perPage, setPerPage] = useState(perPageDefault);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const cursorHandler = useMemo(() => createCursorHandler(colName), []);
    const [isFirstCall, setIsFirstCall] = useState(true);

    const renderPosts = useCallback(async (newCurrentPage) => {
        setLoading(true);
        toggleBodyScroll(true, false);
        setCurrentPage(newCurrentPage);
        // Restore cursor cache only once
        if(isFirstCall) {
            await cursorHandler.restoreLastDocCache();
            setIsFirstCall(false);
        }

        const { items, totalCount: newTotal } = await fetchData({
            page: newCurrentPage,
            perPage,
            cursorHandler,
        });

        setItems(items);
        setTotalCount(newTotal);
        setTotalPages(Math.max(1, Math.ceil(newTotal / perPage)));
        setLoading(false);


    }, [colName, perPage]);

    const [pageForLoadMore, setPageForLoadMore] = useState(currentPage);

    const loadMore = useCallback(async () => {
        if (pageForLoadMore >= totalPages) return;

        const nextPage = pageForLoadMore + 1;
        setLoading(true);

        const { items: newItems } = await fetchData({
            page: nextPage,
            perPage,
            cursorHandler,
            options: { isLoadMore: true },
        });
        console.log(newItems, pageForLoadMore);

        setItems((prev) => [...prev, ...newItems]);
        setPageForLoadMore(nextPage);
        setLoading(false);
    }, [currentPage, totalPages, perPage, pageForLoadMore]);

    useEffect(() => {
        setPageForLoadMore(currentPage);
    }, [currentPage]);

    // useEffect(() => {
    //     setCurrentPage(1);
    // }, [perPage]);


    const goToPage = async (page) => {
        // updateSearchParams({ page });

        await renderPosts(page);
    };

    // Fetch data when page/perPage changes
    // useEffect(() => {
    //     renderPosts(1);
    // }, [perPage]);

    const resetPagination = () => {
        cursorHandler.deleteCursor();
        // updateSearchParams({page: 1, perPage });
        setCurrentPage(initialPage);
        setPerPage(perPageDefault);

        setItems([]);
        setTotalCount(0);
        setTotalPages(1);
    };

    return {
        items,
        totalCount,
        totalPages,
        currentPage,
        perPage,
        goToPage,
        loadMore,
        reload: renderPosts,
        resetPagination,
        loading,
        setPerPage,
        setCurrentPage,
        pageForLoadMore
    };
}
