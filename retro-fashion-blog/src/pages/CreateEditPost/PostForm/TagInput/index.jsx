import React, { useState, forwardRef, useImperativeHandle } from "react";
import "./index.scss";
import {useLang} from "@/context/LangContext";

const TagInput = ({ tags, setTags} ) => {
    const { t } = useLang();
    const [inputValue, setInputValueLocal] = useState("");


    const setInputValue = setInputValueLocal;

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
            <label htmlFor="tagInput">
                {t("post-tags-label") || "Tags:"}
            </label>

            <input
                type="text"
                id="tagInput"
                placeholder={t("tag-input-placeholder") || "Type a tag and press Enter"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
            />

            <div className="tags tags-container" id="tagsContainer">
                {tags.map((tag, index) => (
                    <div className="tag" key={index}>
                        <span className="tag-text">{tag?.name || tag}</span>
                        <button
                            type="button"
                            className="tag-remove"
                            onClick={() => removeTag(index)}
                            aria-label={`Remove tag ${tag?.name || tag}`}
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
