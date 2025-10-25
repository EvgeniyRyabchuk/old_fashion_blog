import {useEffect, useMemo, useState} from "react";


export default (inputRef, previewRef, placeholderRef, onFileChange, url, setUrl) => {

    const [isPreviewShow, setIsPreviewShow] = useState(false);

    const handleFile = async (file, dragAndDrop = false) => {
        if (!file || !file.type.startsWith("image/")) return;
        const fileUrl = URL.createObjectURL(file);
        if (dragAndDrop) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            inputRef.current.files = dataTransfer.files;
        }
        setIsPreviewShow(true);
        setUrl(fileUrl);

        onFileChange(file);
    };


    useEffect(() => {
        const input = inputRef.current;
        const preview = previewRef.current;
        const placeholder = placeholderRef.current;

        if (!input || !preview || !placeholder) return;

        const handleInputChange = (e) => handleFile(e.target.files[0]);
        const handlePlaceholderClick = () => input.click();

        const handleDragEnter = (e) => {
            e.preventDefault();
            e.stopPropagation();
            placeholder.classList.add("drag-over");
        };

        const handleDragOver = (e) => {
            e.preventDefault();
            e.stopPropagation();
            placeholder.classList.add("drag-over");
        };

        const handleDragLeave = (e) => {
            e.preventDefault();
            e.stopPropagation();
            placeholder.classList.remove("drag-over");
        };

        const handleDrop = (e) => {
            e.preventDefault();
            e.stopPropagation();
            placeholder.classList.remove("drag-over");
            const file = e.dataTransfer.files[0];
            handleFile(file, true);
        };

        // Attach events
        input.addEventListener("change", handleInputChange);
        placeholder.addEventListener("click", handlePlaceholderClick);
        placeholder.addEventListener("dragenter", handleDragEnter);
        placeholder.addEventListener("dragover", handleDragOver);
        placeholder.addEventListener("dragleave", handleDragLeave);
        placeholder.addEventListener("drop", handleDrop);

        // Cleanup
        return () => {
            input.removeEventListener("change", handleInputChange);
            placeholder.removeEventListener("click", handlePlaceholderClick);
            placeholder.removeEventListener("dragenter", handleDragEnter);
            placeholder.removeEventListener("dragover", handleDragOver);
            placeholder.removeEventListener("dragleave", handleDragLeave);
            placeholder.removeEventListener("drop", handleDrop);
        };
    }, [isPreviewShow]); // ref objects themselves are stable



    const showPreviewStyles = useMemo(() => ({
        display: "block",
        backgroundImage: `url(${url})`,
    }), [url]);

    const showPlaceholderStyles = {
        display: "none",
    }
    const hidePreviewStyles = {
        display: "none",
    }
    const hidePlaceholderStyles = {
        display: "flex",
    }

   const onImgDelete = () => {
        setIsPreviewShow(false);
    };

    return {
        isPreviewShow,
        onImgDelete,
        url,
        showPreviewStyles,
        showPlaceholderStyles,
        hidePreviewStyles,
        hidePlaceholderStyles,
        setIsPreviewShow
    }

}