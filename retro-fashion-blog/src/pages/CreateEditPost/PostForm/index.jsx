import React, {useEffect, useRef, useState} from 'react';
import Editor from "@components/Editor";
import './index.scss';
import DragDropImage from "@pages/CreateEditPost/PostForm/DrapDropImage";
import {defaultCoverUrl, defaultWideImgUrl, defEndYear, defStartYear} from "@/constants/default";
import {useFetching} from "@/hooks/useFetching";
import {useAuth} from "@/context/AuthContext";
import {createOrUpdatePost, fetchPostById} from "@/services/posts";
import {fetchAllCategories} from "@/services/categories";
import {useLang} from "@/context/LangContext";
import TagInput from "@pages/CreateEditPost/PostForm/TagInput";
import {loadToCloudinary} from "@/services/image";
import {useSearchParams} from "react-router-dom";
import {toggleBodyScroll, urlToFile} from "@utils/helper";
import useQueryParams from "@/hooks/useQueryParams";
import {StandardLoader} from "@components/Loader";
import Spinner from "@components/Loader/Spinner";

const PostForm = ({ onCommit  }) => {

    const { user, isAuth } = useAuth();
    const { getLocCatName } = useLang();

    // ================= FETCH POST ==================

    const [postToEdit, setPostToEdit] = useState(null);
    const [loadedPostId, setLoadedPostId] = useState(null); // Track which post ID was loaded
    const { updateSearchParams, postFilterQueryCreator, setSearchParams, searchParams } = useQueryParams();
    const postId = searchParams.get("postId");


    // ================= FETCH CATEGORIES ==================

    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const fetchCategories = async () => {
            const categories = await fetchAllCategories();
            setCategories(categories);
        }
        fetchCategories();
    }, [])


    // ================= CREATE FORM FIELDS ==================

    const [title, setTitle] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [dateRangeStart, setDateRangeStart] = useState(defStartYear);
    const [dateRangeEnd, setDateRangeEnd] = useState(defEndYear);


    const [coverImgFile, setCoverImgFile] = useState(null);
    const [coverImgUrl, setCoverImgUrl] = useState(null);

    const [wideImgFile, setWideImgFile] = useState(null);
    const [wideImgUrl, setWideImgUrl] = useState(null);

    const [tags, setTags] = useState([]);

    const [editorText, setEditorText] = useState("");


    const [fetchPost, isFetchPostLoading, fetchPostError] = useFetching(async () => {
        // Don't refetch if we already loaded the same post
        if (postId && loadedPostId === postId) return;
        
        const post = await fetchPostById(postId);

        setPostToEdit(post);
        setTitle(post.title);
        setCategoryId(post.categoryId);
        setDateRangeStart(post.date_range_start);
        setDateRangeEnd(post.date_range_end);

        setTags(post.tags);
        setEditorText(post.content);

        setCoverImgUrl(post.coverUrl ?? defaultCoverUrl);
        setWideImgUrl(post.wideImgUrl ?? defaultWideImgUrl);

        // setCoverImgFile(await urlToFile(post.coverUrl, "cover.jpg"))
        // setWideImgFile(await urlToFile(post.wideImgUrl, "wide.jpg"))

        setPostToEdit(post);
        setLoadedPostId(postId); // Mark that we've loaded this post
    })

    useEffect(() => {
        if (!postId) return;
        fetchPost();
    }, [postId])


    const [fetchPostManagement, isAddPostLoading, addPostError] = useFetching(async (data) => {
        await createOrUpdatePost(data, user);
    })

    const onSave = async () => {

        let coverUrl, wideImgUrl = null;

        if(!postToEdit) {
            // if post is new and cover img loaded then upload it to cloudinary
            if(coverImgFile) coverUrl = await loadToCloudinary(coverImgFile);
            // if post is new and no cover img load default
            else coverUrl = defaultCoverUrl;

            if(wideImgFile) wideImgUrl = await loadToCloudinary(wideImgFile);
            else wideImgUrl = defaultWideImgUrl;
        }

        if(postToEdit) {
            if(coverImgFile) coverUrl = await loadToCloudinary(coverImgFile);
            else if (coverImgUrl) coverUrl = postToEdit.coverUrl
            else coverUrl = defaultCoverUrl;

            if(wideImgFile) wideImgUrl = await loadToCloudinary(wideImgFile);
            else if (wideImgUrl) wideImgUrl = postToEdit.wideImgUrl
            else wideImgUrl = defaultWideImgUrl;
        }


        const startDate = new Date(dateRangeStart).getFullYear();
        const endDate = new Date(dateRangeEnd).getFullYear();

        if (!startDate || !endDate) {
            alert("Please select both dates.");
            return;
        }

        let postFormData = {
            title,
            categoryId,
            startDate,
            endDate,
            coverUrl,
            wideImgUrl,
            content: editorText,
            tags: tags.map((tag) => tag.name),
        }
        if(postToEdit)
            postFormData = {
            ...postToEdit,
            ...postFormData,
        }

        console.log(postFormData);

        await fetchPostManagement(postFormData);

        clearUpTheForm();

        onCommit();
    }

    const onCancel = () => {
        toggleBodyScroll(false, false, true)
        clearUpTheForm();
    }

    const clearUpTheForm = () => {
        setTitle("");
        setEditorText("");

        setCoverImgFile(null);
        setWideImgFile(null);
        setCoverImgUrl(null);
        setWideImgUrl(null);

        setTags([]);

        setDateRangeStart(defStartYear);
        setDateRangeEnd(defEndYear);
        
        setCategoryId(null);
        setPostToEdit(null);
        setLoadedPostId(null); // Reset loaded post ID when form is cleared

        updateSearchParams({ postId: null })
    }

    return (
        <>
            <div className={`upload_container ${isFetchPostLoading ? "disabled" : ""}`}>
                { isFetchPostLoading && <StandardLoader /> }
                <div className="wrapper d-flex-center d-flex-wrap">
                    <div className="post-create-form-wrapper">
                        <label htmlFor="title" data-i18n="post-title">Title</label>

                        <input
                            type="text"
                            id="title"
                            placeholder="Post title"
                            data-i18n-attr="placeholder:post-title-placeholder"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <br/>
                        <br/>

                        {/* category */}
                        <div>
                            <label htmlFor="category-select" data-i18n="post-category">Category</label>
                            <select
                                className="category-select"
                                name="category"
                                id="categorySelect"
                                value={categoryId || ""}
                                onChange={(e) => setCategoryId(e.target.value)}
                            >
                                <option value="" disabled>
                                    — Select category —
                                </option>
                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {getLocCatName(category)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/*date_range*/}
                        <div className="year-range">
                            <label htmlFor="startYear" data-i18n="from">From:</label>
                            <input
                                type="number"
                                id="startYear"
                                name="startYear"
                                min="1800"
                                max="2025"
                                step="1"
                                value={dateRangeStart}
                                onChange={(e) => setDateRangeStart(e.target.value)}
                            />

                            <label htmlFor="endYear" data-i18n="to">To:</label>
                            <input
                                type="number"
                                id="endYear"
                                name="endYear"
                                min="1800"
                                max="2025"
                                step="1"
                                value={dateRangeEnd}
                                onChange={(e) => setDateRangeEnd(e.target.value)}
                            />

                        </div>

                        {/*tags*/}
                        <TagInput tags={tags} setTags={setTags} />

                    </div>

                    <input type="file" id="quillImageInput" style={{display: "none"}}/>

                    {/*wide*/}
                    <DragDropImage
                        file={wideImgFile}
                        setFile={setWideImgFile}
                        url={wideImgUrl}
                        setUrl={setWideImgUrl}
                        wrapperClassName="post-wide-img-wrapper"
                    />
                    {/*Cover Img*/}
                    <DragDropImage
                        file={coverImgFile}
                        setFile={setCoverImgFile}
                        url={coverImgUrl}
                        setUrl={setCoverImgUrl}
                        wrapperClassName="post-cover-img-wrapper"
                    />

                </div>

                <Editor value={editorText} setValue={setEditorText} />

                <button className="btn-primary"
                        id="savePost"
                        onClick={onSave}
                        data-i18n="save-post"
                        style={{ marginRight: "10px" }}
                >
                    Save Post
                    {isAddPostLoading && <Spinner style={{ marginLeft: "5px" }} />}
                </button>

                <button
                    className="btn-secondary"
                    id="reset"
                    onClick={onCancel}
                    data-i18n="cancel">
                    Cancel
                </button>

            </div>
        </>

    );
};

export default PostForm;