import React from "react";

/**
 * PageNumbers Component
 *
 * Props:
 * - totalPages (number)
 * - currentPage (number)
 * - onChange (function) => called with the clicked page number
 */


export default function PageNumbers({ totalPages, currentPage, onChange }) {
    // same logic as original getPageList()
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

    const list = getPageList(totalPages, currentPage);

    return (
        <div className="page-numbers-container flex gap-2 justify-center items-center">
            {list.map((item, index) => {
                if (item === "...") {
                    return (
                        <span key={`ellipsis-${index}`} className="page-ellipsis select-none">
              ...
            </span>
                    );
                }

                return (
                    <button
                        key={item}
                        type="button"
                        className={`page-num rounded-md px-3 py-1 border transition-all ${
                            item === currentPage
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-transparent border-gray-400 hover:bg-gray-200"
                        }`}
                        aria-current={item === currentPage ? "page" : undefined}
                        onClick={() => onChange(item)}
                    >
                        {item}
                    </button>
                );
            })}
        </div>
    );
}
