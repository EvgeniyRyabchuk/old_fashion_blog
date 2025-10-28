import React, {useEffect, useMemo, useState} from 'react';
import './index.scss';
import {useFetching} from "@/hooks/useFetching";
import {fetchAllCategories} from "@/services/categories";
import {fetchAllTags} from "@/services/tags";
import {useLang} from "@/context/LangContext";
import Checkbox from "./UI/Checkbox";
import FilterChips from "./UI/FilterChips";
import {StandardLoader} from "@components/Loader";
import {defaultEndDate, defaultStartDate, defEndYear, defStartYear} from "@/constants/default";
import useQueryParams from "@/hooks/useQueryParams";

const FilterDrawer = ({
                          isOpen,
                          onClose,
                          onCommit,
                          searchParams,
                          isActive
                      }) => {
    console.log("filter drawer ")

    const { getLocCatName } = useLang();

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [dateRangeStart, setDateRangeStart] = useState(defStartYear);
    const [dateRangeEnd, setDateRangeEnd] = useState(defEndYear);

    const [chips, setChips] = useState([]);

    const addChipIfNotExist = (value, label, type) => {
        setChips((prev) => {
            // Check if chip already exists
            const exists = prev.some((c) => c.value === value && c.type === type);
            if (exists) return prev;

            // For date-range chips, replace existing ones of the same type
            if(type === "date-range-start" || type === "date-range-end") {
                const filtered = prev.filter(p => p.type !== type);
                return [...filtered, { label, value, type }];
            }

            // For regular chips, just add if not exists
            return [...prev, { label, value, type }];
        });
    }

    const removeChip = (value, type) => {
        setChips((prev) => prev.filter((c) => !(c.value === value && c.type === type)));
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
    }

    const resetDateRange = () => {
        setDateRangeStart(defaultStartDate);
        setDateRangeEnd(defaultEndDate);
        setChips(prev => prev.filter(c => c.type !== "date-range-start" && c.type !== "date-range-end"));
    }

    const handleCheckboxChange = (e) => {
        if(dateRangeStart !== defaultStartDate || dateRangeEnd !== defaultEndDate) {
            resetDateRange();
        }
        const { checked, value, dataset } = e.target;
        const type = dataset.type;

        // Get the proper label based on type and value
        let label = e.target.name || value; // fallback to value if name is not available

        if (type === "category") {
            const category = categories.find(cat => cat.id === value);
            if (category) {
                label = getLocCatName(category);
            }
        } else if (type === "tag") {
            const tag = tags.find(t => t.id === value);
            if (tag) {
                label = tag.name;
            }
        }

        if (checked) {
            // add chip if not exists
            addChipIfNotExist(value, label, type);
        } else {
            // remove chip
            removeChip(value, type);
        }
    };

    const handleDateChange = (e) => {
        const { value, dataset } = e.target;
        resetAllButDateRange();
        const type = dataset.type;

        if(type === "date-range-start") setDateRangeStart(value);
        if(type === "date-range-end") setDateRangeEnd(value);

        addChipIfNotExist(value, value, type);
    }

    const handleRemove = (chip) => {
        // uncheck or reset corresponding input
        const input = document.querySelector(
            `.filter-drawer input[data-type="${chip.type}"][value="${chip.value}"]`
        );
        if (input) {
            if (input.type === "checkbox") {
                input.checked = false;
                // Remove the chip since handleCheckboxChange will be triggered
                removeChip(chip.value, chip.type);
            }
            if (input.type === "date") {
                input.value = "";
                removeChip(chip.value, chip.type);
            }
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

    // Initialize chips and checkbox states from query params
    useEffect(() => {
        if (categories.length > 0 && tags.length > 0) {
            const urlParams = Object.fromEntries(new URLSearchParams(window.location.search));

            // Initialize chips state directly from URL params
            const initialChips = [];

            // Handle categories - get proper display names
            if (urlParams.categories) {
                const catIds = urlParams.categories.split(",");
                catIds.forEach(id => {
                    const category = categories.find(cat => cat.id === id);
                    if (category) {
                        initialChips.push({
                            label: getLocCatName(category),
                            value: category.id,
                            type: 'category'
                        });
                    }
                });
            }

            // Handle tags - get proper display names
            if (urlParams.tags) {
                const tagIds = urlParams.tags.split(",");
                tagIds.forEach(id => {
                    const tag = tags.find(t => t.id === id);
                    if (tag) {
                        initialChips.push({
                            label: tag.name,
                            value: tag.id,
                            type: 'tag'
                        });
                    }
                });
            }

            // Handle date ranges
            if (urlParams.startDate) {
                initialChips.push({
                    label: urlParams.startDate,
                    value: urlParams.startDate,
                    type: 'date-range-start'
                });
                setDateRangeStart(urlParams.startDate);
            }

            if (urlParams.endDate) {
                initialChips.push({
                    label: urlParams.endDate,
                    value: urlParams.endDate,
                    type: 'date-range-end'
                });
                setDateRangeEnd(urlParams.endDate);
            }

            // Set the initial chips state
            setChips(initialChips);
        }
    }, [categories, tags]); // Only run when categories and tags are loaded

    // Update DOM checkboxes based on initial chips state
    useEffect(() => {
        // Only run after categories and tags are loaded to avoid issues
        if (categories.length > 0 && tags.length > 0) {
            // Update category checkboxes based on chips
            chips
                .filter(chip => chip.type === 'category')
                .forEach(chip => {
                    const checkbox = document.querySelector(`[value="${chip.value}"][data-type="category"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                    }
                });

            // Update tag checkboxes based on chips
            chips
                .filter(chip => chip.type === 'tag')
                .forEach(chip => {
                    const checkbox = document.querySelector(`[value="${chip.value}"][data-type="tag"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                    }
                });
        }
    }, [categories, tags, chips]);

    const params = useMemo(() => Object.fromEntries(new URLSearchParams(window.location.search)), [])

    // 1. Search input
    useEffect(() => {
        const searchInput = document.querySelector('#searchInput');
        if (params.search && searchInput) searchInput.value = params.search;
    }, []);

    const onApply = () => {
        const params = {
            categories: chips.filter(c => c.type === 'category').map(c => c.value).join(','),
            tags: chips.filter(c => c.type === 'tag').map(c => c.value).join(','),
        };
        // Add date range if they exist
        const startDateChip = chips.find(c => c.type === 'date-range-start');
        const endDateChip = chips.find(c => c.type === 'date-range-end');

        if (startDateChip) params.startDate = startDateChip.value;
        if (endDateChip) params.endDate = endDateChip.value;

        onCommit(params);
    }

    const onReset = () => {
        resetAllButDateRange();
        resetDateRange();
        onCommit({}, true);
        // onClose();
    }

    return (
        <section
            id="filterDrawerWrapper"
            className={`filter-drawer-wrapper ${isOpen && "is-open"} ${!isActive && "disabled"}`}
            onClick={(e) => {
                if(e.currentTarget === e.target) {
                    onClose();
                }
            }}
            // style={{ position: isLoading ? "relative" : "fixed" }}
        >
            {isLoading && <StandardLoader />}

            <div
                className={`filter-drawer ${isOpen && "is-open"} ${!isActive && "disabled"}`}
                id="filterDrawer"
                style={{ height: isLoading ? "350px" : "100%"  }}
            >
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

                { !isLoading &&
                    <>
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
                    </>
                }

                {/*Actions*/}
                <div className="filter-drawer__actions">
                    <button id="applyFilterBtn"
                            type="button"
                            data-i18n="posts-apply"
                            onClick={onApply}
                    >Apply</button>
                    <button id="resetFilterBtn"
                            type="reset"
                            data-i18n="posts-reset"
                            onClick={onReset}
                    >Reset</button>
                </div>
            </div>
        </section>
    );
};

export default FilterDrawer;