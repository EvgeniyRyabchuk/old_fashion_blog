import React, {useEffect, useState} from 'react';
import './index.scss';
import {useParams} from "react-router-dom";
import {useFetching} from "@/hooks/useFetching";
import {fetchPostById} from "@/services/posts";
import {StandardLoader} from "@components/Loader";
import {HtmlContent} from "@utils/helper";
import {useLang} from "@/context/LangContext";
import Breadcrumb from "@components/Breadcrumb";
import CommentSection from "@pages/Post/CommentSection";
import AdminPostTopPanel from "@pages/Post/AdminPostTopPanel";
import StandardWrapperLoader from "@components/Loader/StandardWrapperLoader";
import {useAuth} from "@/context/AuthContext";


const Post = () => {
    console.log('post')
    const { isAuth, user } = useAuth();
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    console.log(post || null);
    const [fetchPost, isLoading, error] = useFetching(async () => {
        const post = await fetchPostById(postId);
        setPost(post);
    })

    useEffect(() => {
        fetchPost();
    }, [postId]);

    const { getLocCatName } = useLang();

    return (
        <>
            { isLoading && <StandardWrapperLoader /> }

            { !isLoading &&
                <Breadcrumb
                    items={[
                        { to: "/", label: "Home" },
                        { to: "/posts", label: "Posts" },
                        { label: postId }
                    ]}
                />
            }

            {!isLoading && post &&
                <>
                    { isAuth && user.isAdmin &&
                        <AdminPostTopPanel />
                    }

                    <section
                        id="postContentSection"
                        className="content-section post-content-section is-open"
                    >
                        <div className="post-container">
                            {/* Cover */}
                            <div className="post-cover">
                                <img
                                    id={"coverImg"}
                                    alt={"Cover image"}
                                    src={post.coverUrl}
                                />
                            </div>

                            {/* Content */}
                            <div className="post-content">
                                <h1 className="post-title" id="postTitle">{post.title}</h1>

                                {/* Meta */}
                                <div className="post-meta">
                                <span className="post-date" id="postDate">
                                    {post.createdAt.toDate().toLocaleDateString()}
                                </span>
                                    <span className="post-category" id="postCategory">
                                    {getLocCatName(post.category)}
                                </span>
                                    <span className="post-date-range" id="postDataRange">
                                    {post.date_range_start}-{post.date_range_end}
                                </span>
                                </div>

                                {/* Tags */}
                                <div className="post-tags" id="postTags">
                                    {post.tags.map(tag => (
                                        <span key={tag.id} className="tag">#{tag.name}</span>
                                    ))}
                                </div>

                                {/* Quill Content */}
                                <div className="post-body" id="postBody">
                                    <HtmlContent html={post.content} />
                                </div>
                            </div>
                        </div>

                        <CommentSection/>

                    </section>
                </>

            }


        </>
    );
};

export default Post;