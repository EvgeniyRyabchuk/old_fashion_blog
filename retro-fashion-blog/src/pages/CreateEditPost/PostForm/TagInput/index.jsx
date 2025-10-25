import React, { useState } from "react";
import "./index.scss";

const TagInput = ({ tags, setTags }) => {

    const [inputValue, setInputValue] = useState("");

    // Handle Enter press
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            e.preventDefault();
            const newTag = inputValue.trim();

            if (!tags.includes(newTag)) {
                setTags((prev) => [...prev, newTag]);
            }

            setInputValue("");
        }
    };

    // Handle remove
    const removeTag = (indexToRemove) => {
        setTags((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="tag-manager">
            <label htmlFor="tagInput" data-i18n="post-tags-label">
                Tags:
            </label>

            <input
                type="text"
                id="tagInput"
                placeholder="Type a tag and press Enter"
                data-i18n-attr="placeholder:tag-input-placeholder"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
            />

            <div className="tags tags-container" id="tagsContainer">
                {tags.map((tag, index) => (
                    <div className="tag" key={tag.id}>
                        <span className="tag-text">{tag.name}</span>
                        <button
                            type="button"
                            className="tag-remove"
                            onClick={() => removeTag(tag.id)}
                            aria-label={`Remove tag ${tag.name}`}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TagInput;
