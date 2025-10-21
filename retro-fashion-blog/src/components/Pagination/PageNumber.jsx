import React, {useMemo} from "react";

export default function PageNumbers({ pageList, currentPage, goToPage, isOnlyCurrentPage }) {



    const list = useMemo( () => {
        const render = (list) =>
            list.map((p, idx) =>
                p === "..." ? (
                    <span key={`ellipsis-${idx}`}
                          className="page-ellipsis px-2 select-none">
                            ...
                        </span>
                ) :
                 (<button
                    key={p}
                    className={`page-num px-3 py-1 rounded border transition-colors ${
                        p === currentPage
                            ? "active bg-blue-600 text-white border-blue-600"
                            : "bg-white hover:bg-gray-100 border-gray-300"
                    }`}
                    type="button"
                    aria-current={p === currentPage ? "page" : undefined}
                    onClick={() => goToPage(p)}
                >
                    {p}
                </button>)
            )

        if(isOnlyCurrentPage) {
            const curP = pageList.find(p => p === currentPage);
            return render([curP]);
        }
        return  render(pageList)

    }, [isOnlyCurrentPage, pageList, currentPage])

    return (
        <div className="pagination__numbers flex flex-wrap gap-2 justify-center">
            {list.map(p =>
                p
            )}
        </div>
    );
}