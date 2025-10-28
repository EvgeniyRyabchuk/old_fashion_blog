import React, {useMemo, useRef, useState} from "react";

import './index.scss';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {loadToCloudinary} from "@/services/image";

// Custom toolbar component
const CustomToolbar = () => (
    <div id="toolbar">
        {/* Basic formatting */}
        <span className="ql-formats">
      <button className="ql-bold"></button>
      <button className="ql-italic"></button>
      <button className="ql-underline"></button>
      <button className="ql-strike"></button>
    </span>

        {/* Headers */}
        <span className="ql-formats">
      <select className="ql-header">
        <option value="1"></option>
        <option value="2"></option>
        <option value="3"></option>

      </select>
    </span>

        {/* Lists */}
        <span className="ql-formats">
      <button className="ql-list" value="ordered"></button>
      <button className="ql-list" value="bullet"></button>
      <button className="ql-indent" value="-1"></button>
      <button className="ql-indent" value="+1"></button>
    </span>

        {/* Links, Images, Videos */}
        <span className="ql-formats">
      <button className="ql-link"></button>
      <button className="ql-image"></button>
      <button className="ql-video"></button>
    </span>

        {/* Colors & Alignment */}
        <span className="ql-formats">
      <select className="ql-color"></select>
      <select className="ql-background"></select>
      <select className="ql-align"></select>
    </span>

        {/* Clean formatting */}
        <span className="ql-formats">
      <button className="ql-clean"></button>
    </span>
    </div>
);

const Editor = ({ value, setValue}) => {

    const quillRef = useRef(null);
    const fileInputRef = useRef(null);

    // Custom image insert handler
    const handleImageInsert = () => {
        fileInputRef.current?.click();
    };

    // File input change
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const quill = quillRef.current.getEditor();
        const range = quill.getSelection(true);

        try {
            // Example local URL (or upload to Cloudinary here)
            const fileUrl = await loadToCloudinary(file);

            quill.insertEmbed(range.index, "image", fileUrl);
            quill.setSelection(range.index + 1);
        } catch (error) {
            console.error("Image upload failed:", error);
        }

        event.target.value = ""; // reset input
    };

    const modules = useMemo(() => ({
            toolbar: {
                container: "#toolbar",
                handlers: {
                    image: handleImageInsert,
                },
            },
        }), []);

    const formats = [
        "header",
        "bold", "italic", "underline", "strike",
        "list", "bullet", "indent",
        "link", "image", "video",
        "color", "background", "align",
        "clean"
    ];

    return (
        <div className="editor-wrapper">
            <CustomToolbar />

            <ReactQuill
                theme="snow"
                value={value}
                onChange={setValue}
                modules={modules}
                formats={formats}
                // placeholder="Write something awesome..."
                style={{ height: "500px", marginBottom: "50px" }}
                ref={quillRef}

            />
            {/*<hr />*/}
            {/*<h4>Preview (HTML):</h4>*/}
            {/*<pre>{value}</pre>*/}

            {/* hidden file input for image upload */}
            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
        </div>
    );
};

export default Editor;
