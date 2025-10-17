import React, {useEffect, useMemo, useState} from 'react';
import './index.scss';
import {useFetching} from "@/hooks/useFetching";
import {fetchAllCategories} from "@/services/categories";
import {fetchAllTags} from "@/services/tags";
import {useLang} from "@/context/LangContext";

const defStartYear = '1800';
const defEndYear = '2025';
const defStartDate = `${defStartYear}-01-01`;
const defEndDate = `${defEndYear}-01-01`;


const Checkbox = ({value, name, datasetType, onSelect}) => {
    return (
        <label>
            <input
                type="checkbox"
                value={value}
                data-type={datasetType}
                onChange={onSelect}
            />
                {name}
        </label>
    )
}

const FilterChips = ({ chips, setChips, onRemove }) => {
    const handleRemove = (chip) => {
        setChips((prev) => prev.filter((c) => c.value !== chip.value || c.type !== chip.type));

        // Call parent handler (to uncheck input or reset date)
        if (onRemove) onRemove(chip);
    };

    const renderLabel = (chip) => {
        switch (chip.type) {
            case "tag":
                return `#${chip.label}`;
            case "category":
                return `#${chip.label}`;
            case "date-start":
                return `From: ${chip.label}`;
            case "date-end":
                return `To: ${chip.label}`;
            default:
                return chip.label;
        }
    };

    return (
        <div className="selected-filters">
          <span className="selected-filters__label" data-i18n="posts-selected-filters">
            Selected Filters:
          </span>

         <div className="selected-filters__list">
            {chips.length > 0 ? (
                chips.map((chip) => (
                    <div
                        key={`${chip.type}-${chip.value}`}
                        className="filter-chip"
                        data-type={chip.type}
                        data-value={chip.value}
                    >
                        {renderLabel(chip)}
                        {/*{chip.type === "category" && `#${chip.label}`}*/}
                        {/*{chip.type === "tag" && `#${chip.label}`}*/}
                        {/*{chip.type === "date-start" && `From: ${chip.label}`}*/}
                        {/*{chip.type === "date-end" && `To: ${chip.label}`}*/}
                        {/*{!["tag", "date-start", "date-end", "category"].includes(chip.type) &&*/}
                        {/*    chip.label}*/}
                        <span
                            className="remove"
                            role="button"
                            aria-label="Remove filter"
                            onClick={() => handleRemove(chip)}>
                            &times;
                        </span>
                    </div>
                ))
            ) : (
                <span className="no-filters">No filters selected</span>
            )}
        </div>
        </div>
    );
};




const FilterDrawer = ({ isOpen, onClose }) => {

    const { getLocCatName } = useLang();

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [dateRangeStart, setDateRangeStart] = useState(defStartDate);
    const [dateRangeEnd, setDateRangeEnd] = useState(defEndDate);

    const [chips, setChips] = useState([]);

    const addChipIfNotExist = (value, label, type) => {
        if(type === "date-range-start" || type === "date-range-end") {
            setChips((prev) => {
                if(prev.find(p => p.type === type))
                    return prev.map(p => p.type === type ? { label, value, type } : p);
                else
                    return [...prev, { label, value, type }];
            });
        } else {
            setChips((prev) => {
                if (prev.some((c) => c.value === value && c.type === type)) return prev;
                return [...prev, { label, value, type }];
            });
        }
    }

    const resetAllButDateRange = () => {

        const allCategoriesCheckboxes = document.querySelectorAll(
            '[data-type="category"]'
        );
        const allTagsCheckboxes = document.querySelectorAll(
            '[data-type="tag"]'
        );
        allCategoriesCheckboxes.forEach(c => c.checked = false);
        allTagsCheckboxes.forEach(t => t.checked = false);

        const onlyDates = chips.filter(c => c.type === "date-range-start" || c.type === "date-range-end")
        setChips(onlyDates);

        // const listForRemove = selectedList.querySelectorAll(`*:not([data-type="date-range-start"])`)
        // listForRemove.forEach(i => i.remove());
    }

    const handleCheckboxChange = (e) => {
        const { checked, value, dataset } = e.target;
        const type = dataset.type;
        const label = e.target.name || value;
        console.log("check")
        if (checked) {
            // add chip if not exists
            addChipIfNotExist(value, label, type);
        } else {
            // remove chip
            setChips((prev) => prev.filter((c) => c.value !== value || c.type !== type));
        }
    };

    const handleDateChange = (e) => {
        const { value, dataset } = e.target;
        resetAllButDateRange();
        const type = dataset.type;
        const alreadyExist = chips.find((c) => c.type === type);

        if(type === "date-range-start") setDateRangeStart(value);
        if(type === "date-range-end") setDateRangeEnd(value);

        addChipIfNotExist(value, value, type);

        // } else {
        //
        //     if(type === "date-range-start" && new Date(value).getFullYear() === new Date(queryStrHandler.defaultStartDate).getFullYear())
        //         alreadyExist.remove();
        //     if(type === "date-range-end" && new Date(value).getFullYear() === new Date(queryStrHandler.defaultStartDate).getFullYear())
        //         alreadyExist.remove();
        //
        //     alreadyExist.innerHTML = getDateRangeWitToORFrom(input);
        // }
    }

    const handleRemove = (chip) => {
        // uncheck or reset corresponding input
        const input = document.querySelector(
            `.filter-drawer input[data-type="${chip.type}"][value="${chip.value}"]`
        );
        if (input) {
            if (input.type === "checkbox") input.checked = false;
            if (input.type === "date") input.value = "";
        }
    };

    const [fetchAllSelectable, isLoading, error] = useFetching(async () => {
        const categories = await fetchAllCategories();
        const tags = await fetchAllTags();

        setCategories(categories);
        setTags(tags);
        // loadFromPostQueryStr();
    })

    useEffect(() => {
        fetchAllSelectable();
    }, []);


    const params = useMemo(() => Object.fromEntries(new URLSearchParams(window.location.search)), [])
    // 1. Search input
    useEffect(() => {
        const searchInput = document.querySelector('#searchInput');
        if (params.search && searchInput) searchInput.value = params.search;
    }, []);

    // select chips after selectables loaded
    useEffect(() => {
        if (params.categories && categories.length > 0) {
            const catIds = params.categories.split(",");
            catIds.forEach(id => {
                const checkbox = document.querySelector(`[value="${id}"][data-type="category"]`);
                if (checkbox) {
                    checkbox.checked = true;
                    handleCheckboxChange({ target: { checked: true, value: id, dataset: {type: "category"} }});
                }
            });
        }
        if (params.tags && tags.length > 0) {
            const tagIds = params.tags.split(",");
            tagIds.forEach(id => {
                const checkbox = document.querySelector(`[value="${id}"][data-type="tag"]`);
                if (checkbox) {
                    checkbox.checked = true;
                    handleCheckboxChange({ target: { checked: true, value: id, dataset: {type: "tag"} }});
                }
            });
        }


    }, [categories, tags, dateRangeStart, dateRangeEnd])



    return (
        <section
            id="filterDrawerWrapper"
            className={`filter-drawer-wrapper ${isOpen && "is-open"}`}
            onClick={(e) => {
                if(e.currentTarget === e.target) {
                    onClose();
                }
            }}

        >
            <div className={`filter-drawer ${isOpen && "is-open"}`} id="filterDrawer">
                <div style={{ margin: "10px 0" }}>
                    <button
                        type="button"
                        className="filter-drawer__close"
                        id="filterCloseBtn"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>
                <form className="filter-drawer__container">
                     {/* Category */}
                    <div className="filter-drawer__group">
                        <label className="filter-drawer__label" data-i18n="posts-categories">Categories:</label>
                        <div id="categoriesContainer" className="filter-drawer__options categoriesContainer">
                            {categories.map(category => (
                                <Checkbox
                                    name={getLocCatName(category)}
                                    value={category.id}
                                    key={category.id}
                                    onSelect={(e) => handleCheckboxChange(e) }
                                    datasetType="category"
                                />
                            ))}
                            {/*<label><input datatype="category" type="checkbox" value="tech"/> Tech</label>*/}
                            {/*<label><input datatype="category" type="checkbox" value="design"/> Design</label>*/}
                            {/*<label><input datatype="category" type="checkbox" value="lifestyle"/> Lifestyle</label>*/}
                        </div>
                    </div>
                     {/*Tags */}
                    <div className="filter-drawer__group">
                        <label className="filter-drawer__label" data-i18n="posts-tags">Tags:</label>
                        <div id="tagsContainer" className="filter-drawer__tags">
                            {tags.map(tag => (
                                <Checkbox
                                    name={tag.name}
                                    value={tag.id}
                                    key={tag.id}
                                    onSelect={(e) => handleCheckboxChange(e)}
                                    datasetType="tag"
                                />
                            ))}

                            {/*<label><input datatype="tag" type="checkbox" value="js"/>*/}
                            {/*    <span className="tags-sign">#</span>JavaScript*/}
                            {/*</label>*/}
                            {/*<label><input datatype="tag" type="checkbox" value="css"/>*/}
                            {/*    <span className="tags-sign">#</span>CSS*/}
                            {/*</label>*/}
                            {/*<label><input datatype="tag" type="checkbox" value="html"/>*/}
                            {/*    <span className="tags-sign">#</span>HTML*/}
                            {/*</label>*/}

                        </div>
                    </div>
                     {/* Date Range */}
                    <div className="filter-drawer__group">
                        <label data-i18n="posts-date-range">Date Range:</label>
                        <div className="filter-drawer__date-range">
                            <input
                                data-type="date-range-start"
                                type="date"
                                name="start_date"
                                value={dateRangeStart}
                                onChange={handleDateChange}
                            />
                            <span>—</span>
                            <input
                                data-type="date-range-end"
                                type="date"
                                name="end_date"
                                value={dateRangeEnd}
                                onChange={handleDateChange}
                            />
                        </div>
                    </div>
                </form>

                <FilterChips chips={chips} setChips={setChips} onRemove={handleRemove} />
                 {/*Actions*/}
                <div className="filter-drawer__actions">
                    <button id="applyFilterBtn" type="button" data-i18n="posts-apply">Apply</button>
                    <button id="resetFilterBtn" type="reset" data-i18n="posts-reset">Reset</button>
                </div>
            </div>
        </section>
    );
};

export default FilterDrawer;