import React from 'react';
import './index.scss';



const SortSection = ({ onFilterToggle, setValue, value, isActive }) => {



    return (
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

                    className={isActive ? "" : "disabled"}
                    value={value}
                >
                    <option value="newest" data-i18n="posts-sort-newest">Newest</option>
                    <option value="oldest" data-i18n="posts-sort-oldest">Oldest</option>
                    <option value="popular" data-i18n="posts-sort-popular">Most Popular</option>
                </select>
            </div>
        </div>
    );
};

export default SortSection;