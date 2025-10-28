import React from 'react';
import './index.scss';



const SortSection = ({ onFilterToggle, setValue, value, isActive }) => {



    return (
        <section id="filterSortSection"
                 className={`d-flex`}
                 style={{padding: "10px 30px" }}
        >
            <div className="d-flex"
                 style={{
                     width: "100%",
                     justifyContent: "space-between"
            }}>

                <div className="filter-sort">

                    <div className="filter-sort__sort">
                        <label htmlFor="sort" data-i18n="posts-sort-by">Sort by:</label>
                        <select
                            id="sort"
                            name="sort"
                            onChange={(e) => {
                                setValue(e.target.value)
                                console.log(e.target.value, "sdfhgdflkjhdfgkjhdfgjkh")
                            }
                        }

                            className={!isActive && "disabled"}
                            value={value}
                        >
                            <option value="newest" data-i18n="posts-sort-newest">Newest</option>
                            <option value="oldest" data-i18n="posts-sort-oldest">Oldest</option>
                            <option value="popular" data-i18n="posts-sort-popular">Most Popular</option>
                        </select>
                    </div>
                </div>

                <button id="filterToggle"
                        className="filter-toggle"
                        data-i18n="posts-filters"
                        onClick={onFilterToggle}
                >
                    Filters
                </button>
            </div>
        </section>
    );
};

export default SortSection;