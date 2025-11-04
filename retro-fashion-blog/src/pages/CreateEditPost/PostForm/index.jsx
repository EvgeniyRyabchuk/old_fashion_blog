import React, {useEffect, useMemo, useRef, useState} from 'react';
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
import {toggleBodyScroll, urlToFile} from "@utils/helper";
import useQueryParams from "@/hooks/useQueryParams";
import {StandardLoader} from "@components/Loader";
import Spinner from "@components/Loader/Spinner";
import validationSchema from './validationSchema'
import { Formik, Form, Field, ErrorMessage} from "formik";
import {toast} from "react-toastify";


const PostForm = ({ onCommit, saveBtnTitle, postId, postToEdit, setPostToEdit  }) => {

    const { user, isAuth } = useAuth();
    const { getLocCatName } = useLang();

    const { updateSearchParams, postFilterQueryCreator, setSearchParams, searchParams } = useQueryParams();


    // ================= FETCH CATEGORIES ==================
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const fetchCategories = async () => {
            const categories = await fetchAllCategories();
            setCategories(categories);
        }
        fetchCategories();
    }, [])


    const [coverImgFile, setCoverImgFile] = useState(null);
    const [coverImgUrl, setCoverImgUrl] = useState(null);

    const [wideImgFile, setWideImgFile] = useState(null);
    const [wideImgUrl, setWideImgUrl] = useState(null);

    const [tags, setTags] = useState([]);

    const [fetchPost, isFetchPostLoading, fetchPostError] = useFetching(async () => {
        // Don't refetch if we already loaded the same post
        if (!postId) return;

        const post = await fetchPostById(postId);

        setPostToEdit(post);

        // Update non-Formik state values
        setCoverImgUrl(post.coverUrl ?? defaultCoverUrl);
        setWideImgUrl(post.wideImgUrl ?? defaultWideImgUrl);
        setTags(post.tags);
    })
    console.log(isFetchPostLoading, "123")
    useEffect(() => {
        if (!postId) return;
        fetchPost();
    }, [postId])


    const [changePost, isAddUpdatePostLoading, addPostError, setIsAddUpdatePostLoading] = useFetching(async (data) => {
        const newPost = await createOrUpdatePost(data, user);
        if(postToEdit)
            toast.info(`Post #${newPost.id} updated" successfully}`);
        else
            toast.success(`Post #${newPost.id} added successfully`);

    })

    // onSubmit
    const onSave = async (values) => {
        setIsAddUpdatePostLoading(true);
        let coverUrl, wideImgUrl = null;

        // if post is new
        if(!postToEdit) {
            // and cover img loaded then upload it to cloudinary
            if(coverImgFile) coverUrl = await loadToCloudinary(coverImgFile);
            // if post is new and no cover img load default
            else coverUrl = defaultCoverUrl;

            if(wideImgFile) wideImgUrl = await loadToCloudinary(wideImgFile);
            else wideImgUrl = defaultWideImgUrl;
        }

        // if post already existed
        if(postToEdit) {
            if(coverImgFile) coverUrl = await loadToCloudinary(coverImgFile);
            else if (coverImgUrl) coverUrl = postToEdit.coverUrl
            else coverUrl = defaultCoverUrl;

            if(wideImgFile) wideImgUrl = await loadToCloudinary(wideImgFile);
            else if (wideImgUrl) wideImgUrl = postToEdit.wideImgUrl
            else wideImgUrl = defaultWideImgUrl;
        }

        const startDate = new Date(values.dateRangeStart).getFullYear();
        const endDate = new Date(values.dateRangeEnd).getFullYear();

        if (!startDate || !endDate) {
            alert("Please select both dates.");
            setIsAddUpdatePostLoading(false);
            return;
        }

        let postFormData = {
            title: values.title,
            categoryId: values.categoryId,
            startDate,
            endDate,
            coverUrl,
            wideImgUrl,
            content: values.editor,
            tags: tags.map((tag) => tag?.name || tag),
        }

        // if this is post editing then overwrite old date with new
        if(postToEdit)
            postFormData = {
            ...postToEdit,
            ...postFormData,
        }

        console.log(postFormData);

        await changePost(postFormData);

        onCommit();
    }

    const baseOnCancel = (resetForm) => {
        toggleBodyScroll(false, false, true)
        clearUpTheForm(resetForm);
    }

    const clearUpTheForm = (resetForm = null) => {
        setCoverImgFile(null);
        setWideImgFile(null);
        setCoverImgUrl(null);
        setWideImgUrl(null);

        setTags([]);

        setPostToEdit(null);

        updateSearchParams({ postId: null });
        
        // Reset Formik form if resetForm is provided
        if (resetForm) {
            resetForm({
                values: {
                    title: "",
                    categoryId: "",
                    dateRangeStart: defStartYear,
                    dateRangeEnd: defEndYear,
                    editor: "",
                }
            });
        }
    }

    // Set initial values based on whether we're editing or creating
    const getInitialValues = () => {
        if (postId && postToEdit) {
            return {
                title: postToEdit.title,
                categoryId: postToEdit.categoryId,
                dateRangeStart: postToEdit.date_range_start,
                dateRangeEnd: postToEdit.date_range_end,
                editor: postToEdit.content,
            };
        }
        return {
            title: "",
            categoryId: "",
            dateRangeStart: defStartYear,
            dateRangeEnd: defEndYear,
            editor: "",
        };
    };


    return (
            <div className={`upload_container ${isFetchPostLoading || isAddUpdatePostLoading ? "disabled" : ""}`}>
                { isFetchPostLoading && <StandardLoader /> }
                <Formik
                    initialValues={getInitialValues()}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { resetForm }) => {
                        await onSave(values);
                        clearUpTheForm(resetForm); // ✅ resets to initialValues
                    }}
                    enableReinitialize={true} // This allows form to reinitialize when initialValues change
                    validateOnMount={false} 
                    validateOnChange={true}
                    validateOnBlur={true}
                >
                    {({ errors,
                          touched,
                          values,
                          handleChange,
                          setFieldValue,
                          isSubmitting,
                          submitCount,
                          resetForm,
                      }) => {
                        // Update form values when postToEdit changes
                        useEffect(() => {
                            if (postId && postToEdit) {
                                setFieldValue('title', postToEdit.title);
                                setFieldValue('categoryId', postToEdit.categoryId);
                                setFieldValue('dateRangeStart', postToEdit.date_range_start);
                                setFieldValue('dateRangeEnd', postToEdit.date_range_end);
                                setFieldValue('editor', postToEdit.content);
                            }
                        }, [postToEdit, postId, setFieldValue]);



                        return (
                            <Form>
                                <div className="wrapper d-flex-center d-flex-wrap">
                                    <div className="post-create-form-wrapper">

                                        <label htmlFor="title" data-i18n="post-title">
                                            Title
                                        </label>
                                        <Field
                                            type="text"
                                            id="title"
                                            name="title"
                                            placeholder="Post title"
                                            data-i18n-attr="placeholder:post-title-placeholder"
                                        />
                                        { errors.title && touched.title ? (
                                            <div className="error-message">{errors.title}</div>
                                        ) : null}

                                        {/* category */}
                                        <div style={{ margin: "10px 0"}}>
                                            <label htmlFor="categoryId" data-i18n="post-category">Category</label>
                                            <Field
                                                as="select"
                                                className="category-select"
                                                name="categoryId"
                                                id="categoryId"
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
                                            </Field>
                                            { errors.categoryId && touched.categoryId ? (
                                                <div className="error-message">{errors.categoryId}</div>
                                            ) : null}
                                        </div>

                                        {/*date_range*/}
                                        <div className="year-range">
                                            <label htmlFor="dateRangeStart" data-i18n="from">From:</label>
                                            <Field
                                                type="number"
                                                id="dateRangeStart"
                                                name="dateRangeStart"
                                                min="1800"
                                                max="2025"
                                                step="1"
                                            />

                                            <label htmlFor="dateRangeEnd" data-i18n="to">To:</label>
                                            <Field
                                                type="number"
                                                id="dateRangeEnd"
                                                name="dateRangeEnd"
                                                min="1800"
                                                max="2025"
                                                step="1"
                                            />
                                        </div>
                                        {/*tags*/}
                                        <TagInput tags={tags} setTags={setTags} />
                                    </div>
                                    <input type="file" id="quillImageInput" style={{ display: "none" }}/>

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

                                <Editor name="editor" />

                                {/* General form error display - only show after submission attempt with errors */}
                                {Object.keys(errors).length > 0 && submitCount > 0 && (
                                    <div className="form-error-message">
                                        <strong>Please fix the following errors:</strong>
                                        <ul style={{margin: 0, paddingLeft: '20px'}}>
                                            {Object.entries(errors).map(([field, message]) => (
                                                <li key={field}>
                                                    <strong>{field}:</strong> {message}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <button className="btn-primary"
                                        id="savePost"
                                        type="submit"
                                        data-i18n="save-post"
                                        style={{ marginRight: "10px" }}
                                >
                                    {saveBtnTitle}
                                    {isSubmitting && <Spinner style={{ marginLeft: "5px" }} />}
                                </button>

                                <button
                                    className="btn-secondary"
                                    id="reset"
                                    onClick={() => baseOnCancel(resetForm)}
                                    data-i18n="cancel"
                                    type='button'
                                >
                                    Cancel
                                </button>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
    );
};

export default PostForm;