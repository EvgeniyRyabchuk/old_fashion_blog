import React from "react";
import './index.scss';

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

export default FilterChips;