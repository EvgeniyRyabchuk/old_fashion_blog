import {useCallback, useEffect, useMemo, useState} from "react";
import {db} from "@/firebase/config";
import createCursorHandler from "@utils/cursor-handler";



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
        // Restore cursor cache only once
        if(isFirstCall) {
            await cursorHandler.restoreLastDocCache();
            setIsFirstCall(false);
        }

        setLoading(true);

        const { items, totalCount: newTotal } = await fetchData({
            page: newCurrentPage,
            perPage,
            cursorHandler,
        });

        setItems(items);
        setTotalCount(newTotal);
        setTotalPages(Math.max(1, Math.ceil(newTotal / perPage)));
        setLoading(false);


    }, [colName, currentPage, perPage]);

    const loadMore = useCallback(async () => {
        if (currentPage >= totalPages) return;

        const nextPage = currentPage + 1;
        setLoading(true);

        const { items: newItems } = await fetchData({
            page: nextPage,
            perPage,
            cursorHandler,
            options: { isLoadMore: true },
        });

        setItems((prev) => [...prev, ...newItems]);
        setCurrentPage(nextPage);
        setLoading(false);
    }, [currentPage, totalPages, perPage]);

    const goToPage = (page) => {
        setCurrentPage(page);
        renderPosts(page);
    };

    // Fetch data when page/perPage changes
    useEffect(() => {
        renderPosts(1);
    }, [perPage]);

    const resetPagination = () => {
        cursorHandler.deleteCursor();
        setCurrentPage(1);
        setItems([]);
        setTotalCount(0);
        setTotalPages(1);
    };

    return {
        items,
        totalCount,
        totalPages,
        currentPage,
        setCurrentPage,
        perPage,
        setPerPage,
        goToPage,
        loadMore,
        reload: renderPosts,
        resetPagination,
        loading,
    };
}
