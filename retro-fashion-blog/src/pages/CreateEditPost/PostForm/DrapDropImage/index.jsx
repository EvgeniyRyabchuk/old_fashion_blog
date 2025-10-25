import React, {useEffect, useRef} from 'react';
import useImgDrapDrop from "@/hooks/useImgDrapDrop";

const DragDropImage = ({ setFile, file, url, setUrl, defImage, wrapperClassName}) => {

    const coverImgInputRef = useRef(null);
    const coverImgPreviewRef = useRef(null);
    const coverImgPlaceholderRef = useRef(null);

    const {
        onImgDelete,
        isPreviewShow,
        showPlaceholderStyles,
        showPreviewStyles,
        hidePreviewStyles,
        hidePlaceholderStyles,
        setIsPreviewShow
    } = useImgDrapDrop(
        coverImgInputRef,
        coverImgPreviewRef,
        coverImgPlaceholderRef,
        setFile,
        url,
        setUrl
    )

    const onDeleteImageBtnClick = () => setFile(null)

    useEffect(() => {
        if(!file || !url) onImgDelete();

        if(url) setIsPreviewShow(true);
    }, [file, url]);

    return (
        <div id="postCoverImgWrapper" className={wrapperClassName}>
            <div
                className="preview cover-preview"
                id="coverPreview"
                ref={coverImgPreviewRef}
                style={isPreviewShow ? showPreviewStyles : hidePreviewStyles}
            >
                <button id="deletePostCoverImgBtn"
                        className="btn-danger"
                        onClick={onDeleteImageBtnClick}
                >
                    X
                </button>
            </div>

            <div id="postImgPlaceholder"
                 className="image-placeholder post-img-placeholder"
                 onClick={() => {}}
                 style={isPreviewShow ? showPlaceholderStyles : hidePlaceholderStyles}
                 ref={coverImgPlaceholderRef}
            >
                <input
                    type="file"
                    id="coverImg"
                    accept="image/*"
                    className="hidden-input"
                    ref={coverImgInputRef}
                />

                <div className="placeholder-content" >
                    <span data-i18n="click-add-cover-image">
                        Click to add Cover image
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DragDropImage;