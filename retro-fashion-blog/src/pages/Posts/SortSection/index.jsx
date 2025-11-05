import React from 'react';
import './index.scss';
import {useLang} from "@/context/LangContext";


const SortSection = ({ onFilterToggle, setValue, value, isActive }) => {
    const { t } = useLang();

    return (
        <div className="filter-sort">
            <div className="filter-sort__sort">
                <label htmlFor="sort">{t("posts-sort-by") || "Sort by:"}</label>
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
                    <option value="newest">{t("posts-sort-newest") || "Newest"}</option>
                    <option value="oldest">{t("posts-sort-oldest") || "Oldest"}</option>
                    <option value="popular">{t("posts-sort-popular") || "Most Popular"}</option>
                </select>
            </div>
        </div>
    );
};

export default SortSection;