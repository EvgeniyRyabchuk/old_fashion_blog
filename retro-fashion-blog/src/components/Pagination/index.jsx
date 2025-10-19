import React, {useMemo} from 'react';
import './index.scss';
import {usePaginate} from "@/hooks/usePaginate";
import PageNumbers from "@components/Pagination/PageNumber";




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
        setCurrentPage,
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

    //TODO: replace to component
    const pageList = useMemo(() => {
        const delta = 2;
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

        const range = [];
        const left = Math.max(2, currentPage - delta);
        const right = Math.min(totalPages - 1, totalPages + delta);

        range.push(1);
        if (left > 2) range.push("...");
        for (let i = left; i <= right; i++) range.push(i);
        if (right < totalPages - 1) range.push("...");
        range.push(totalPages);

        return range;
    }, [totalPages, currentPage])

    // const pages = getPageList(totalPages, currentPage);

    return (
        <div className={`pagination-wrapper ${items.length > 0 && "is-open"}`}>
            <div className="pagination-controls">

                <div className="pagination__per-page">
                    <label htmlFor="perPageSelect" data-i18n="posts-per-page">Posts per page:</label>
                    <select id="perPageSelect"
                            value={perPage}
                            onChange={(e) => {
                                setCurrentPage(1);
                                setPerPage(e.target.value)}
                            }
                            >
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
                        disabled={currentPage === 1}
                        data-i18n="posts-prev"
                        onClick={() => goToPage(currentPage - 1)}
                    >
                        Prev
                    </button>

                    <PageNumbers
                        pageList={pageList}
                        currentPage={currentPage}
                        goToPage={goToPage}
                    />


                    <button
                        id="nextPage"
                        className="next-page"
                        data-i18n="posts-next"
                        disabled={currentPage >= totalPages}
                        onClick={() => goToPage(currentPage + 1)}
                    >
                        Next
                    </button>

                    <span id="pageInfo" className="pagination__info">
                        Page {currentPage} of {totalPages}
                    </span>
                </div>
            </div>

             {/* load more */}
            { currentPage < totalPages &&
                <div className="pagination__load-more">
                    <button id="loadMoreBtn"
                            data-i18n="posts-load-more"
                            onClick={loadMore}>
                        Load More
                    </button>
                </div>
            }

        </div>
    );
};

export default Pagination;