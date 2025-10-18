import { useState, useEffect, useCallback } from "react";
import { db } from "@/firebase/config";

// Cursor handler
function createCursorHandler(colName) {
    let lastDocCache = {};
    const cursorName = `lastDocCache_${colName}`;

    const restoreLastDocCache = async () => {
        const raw = localStorage.getItem(cursorName);
        if (!raw) return {};

        const cache = JSON.parse(raw);
        const rebuilt = {};

        for (const [page, docId] of Object.entries(cache)) {
            const snap = await db.collection(colName).doc(docId).get();
            if (snap.exists) rebuilt[page] = snap;
        }
        lastDocCache = rebuilt;
        return rebuilt;
    };

    const saveCursor = (lastDoc, page) => {
        lastDocCache[page] = lastDoc;
        const cacheToSave = JSON.parse(localStorage.getItem(cursorName) || "{}");
        cacheToSave[page] = lastDoc.id;
        localStorage.setItem(cursorName, JSON.stringify(cacheToSave));
    };

    const deleteCursor = () => {
        lastDocCache = {};
        localStorage.removeItem(cursorName);
    };

    return {
        get lastDocCache() {
            return lastDocCache;
        },
        cursorName,
        saveCursor,
        restoreLastDocCache,
        deleteCursor,
    };
}

// 🔹 Main React Hook
export function usePaginate({
    colName,
    fetchData,   // async ({ page, perPage, cursorHandler, options }) => { items, totalCount }
    perPageDefault = 10,
    initialPage = 1,
    items,
    setItems
}) {

    // const [items, setItems] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [perPage, setPerPage] = useState(perPageDefault);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const cursorHandler = createCursorHandler(colName);

    // Restore cursor cache only once
    useEffect(() => {
        cursorHandler.restoreLastDocCache();
    }, []);

    const renderPosts = useCallback(async () => {
        setLoading(true);

        const { items, totalCount: newTotal } = await fetchData({
            page: currentPage,
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
    };

    // Fetch data when page/perPage changes
    useEffect(() => {
        renderPosts();
    }, [currentPage, perPage]);

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
        perPage,
        setPerPage,
        goToPage,
        loadMore,
        reload: renderPosts,
        resetPagination,
        loading,
    };
}
