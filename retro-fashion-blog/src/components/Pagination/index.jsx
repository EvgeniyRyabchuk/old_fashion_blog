import React from 'react';
import './index.scss';
import {usePaginate} from "@/hooks/usePaginate";

const Pagination = ({
                        fetchData,
                        perPageDefault = 5,
                        initialPage = 1,
                        colName,
                        items,
                        setItems
}) => {

    const {
        totalCount,
        totalPages,
        currentPage,
        perPage,
        setPerPage,
        goToPage,
        loadMore,
        reload,
        resetPagination,
        loading,
    } = usePaginate({
            colName,
            fetchData,
            perPageDefault,
            initialPage,
            setItems,
            items
    });

    console.log(currentPage)


    const getPageList = (total, current) => {
        const delta = 2;
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

        const range = [];
        const left = Math.max(2, current - delta);
        const right = Math.min(total - 1, current + delta);

        range.push(1);
        if (left > 2) range.push("...");
        for (let i = left; i <= right; i++) range.push(i);
        if (right < total - 1) range.push("...");
        range.push(total);

        return range;
    };

    const pages = getPageList(totalPages, currentPage);

    return (
        <div className={`pagination-wrapper ${items.length > 0 && "is-open"}`}>
            <div className="pagination-controls">

                <div className="pagination__per-page">
                    <label htmlFor="perPageSelect" data-i18n="posts-per-page">Posts per page:</label>
                    <select id="perPageSelect" value={perPage} onChange={(e) => setPerPage(e.target.value)} >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                    </select>
                </div>

                {/*page navigation */}
                <div className="pagination__nav">
                    <button
                        id="prevPage"
                        className="prev-page"
                        disabled data-i18n="posts-prev"
                        onClick={() => goToPage(currentPage - 1)}>
                        Prev
                    </button>

                    <div id="pageNumbers"
                         className="pagination__numbers"
                         onClick={goToPage}>
                        {pages.map((p, idx) =>
                            p === "..." ? (
                                <span key={`ellipsis-${idx}`} className="page-ellipsis px-2">...</span>
                            ) : (
                                <button
                                    key={p}
                                    className={`page-num px-3 py-1 rounded border ${
                                        p === currentPage ? "active bg-blue-600 text-white" : "bg-white"
                                    }`}
                                    type="button"
                                    aria-current={p === currentPage ? "page" : undefined}
                                    onClick={() => goToPage(p)}
                                >
                                    {p}
                                </button>
                            )
                        )}
                    </div>

                    <button
                        id="nextPage"
                        className="next-page"
                        data-i18n="posts-next"
                        onClick={() => goToPage(currentPage + 1)}>
                        Next
                    </button>

                    <span id="pageInfo" className="pagination__info">
                        Page {currentPage} of {totalPages}
                    </span>
                </div>
            </div>

             {/* load more */}
            <div className="pagination__load-more">
                <button id="loadMoreBtn"
                        data-i18n="posts-load-more"
                        onClick={loadMore}>
                    Load More
                </button>
            </div>
        </div>
    );
};

export default Pagination;