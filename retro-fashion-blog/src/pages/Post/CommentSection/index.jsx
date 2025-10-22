import React, {useEffect, useState} from 'react';
import './index.scss';
import {useAuth} from "@/context/AuthContext";
import {Link, useParams} from "react-router-dom";
import PATHS from "@/constants/paths";
import defAvatar from "@assets/images/profile.png";
import {useFetching} from "@/hooks/useFetching";
import {addCommentToPost, getCommentsByPostId, removeComment} from "@/services/comments";
import {getDateTimeFormat} from "@utils/format";
import {StandardLoader} from "@components/Loader";


const CommentSection = () => {
    console.log('comment-section');

    const { user, loading: isAuthLoading, isAuth } = useAuth();

    const { postId } = useParams();

    const [userCommentText, setUserCommentText] = useState('');
    const [comments, setComments] = useState([]);

    const [fetchComments, isLoading, error] = useFetching(async () => {
        const comments = await getCommentsByPostId(postId);
        setComments(comments);
    });

    const onCommentSend = async () => {
        if(!user || !isAuth) return;
        const newComment =
            await addCommentToPost(postId, userCommentText, user);
        setComments([{...newComment, user}, ...comments]);
        setUserCommentText('');
    }

    const onCommentRemove = async (commentId) => {
        if(!user || !isAuth) return;
        await removeComment(commentId, user.isAdmin);
        setComments(comments.filter(
            (comment) => comment.id !== commentId)
        );
    }

    useEffect(() => {
        fetchComments();
    }, []);


    return (
        <div className="comment-container">
            <div id="authCommentProtection" className="auth-protection">
                <div className="form-row d-flex-center" style={{margin: "20px 0", gap: "5px"}}>
                    <p data-i18n="post-auth-required">
                        To write your comment you need to be authenticated
                    </p>
                    <Link className="login-btn" to={PATHS.LOGIN}>Login</Link>
                    <Link className="sign-up-btn" to={PATHS.SIGN_UP}>Sign Up</Link>
                </div>
            </div>

            {!isAuthLoading && isAuth &&
                <div id="curUserWriteSection" className={`write-comment-container is-open`}>
                    <div className="form-row">
                        <div className="user-card-small">
                            <img width="45" height="45" src={user.avatar || defAvatar} alt=""/>
                            <div className="user-name">{user.name}</div>
                        </div>
                        <div className="comment-row">
                            <textarea
                                className="comment-content"
                                id="commentContent"
                                value={userCommentText}
                                onChange={(e) => setUserCommentText(e.target.value)}
                            >
                            </textarea>
                            <button
                                className="btn-primary"
                                type="button"
                                id="sendCommentBtn"
                                onClick={onCommentSend}
                                data-i18n="post-send">
                                    Send
                            </button>
                        </div>
                    </div>
                    <hr/>
                </div>
            }

            <ul className="list-comment-container"
                id="listCommentContainer"
                style={{ height: isLoading ? "300px" : "auto" }}
            >
                { isLoading && <StandardLoader isActive={true} /> }

                {comments.map(comment =>
                    <li key={comment.id}>
                        <div className="user-card-small">
                            <img width="45" height="45" src={comment.user.avatar || defAvatar} alt=""/>
                            <div className="user-name">{comment.user.name}.</div>
                            <div className="created-at">{getDateTimeFormat(comment.createdAt)} </div>
                        </div>

                        <div className="comment-row">
                            {comment.content}
                        </div>

                        { (user.isAdmin || user.id === comment.user.id) &&
                                <button
                                    className="btn-danger"
                                    type="button"
                                    id="deleteCommentBtn"
                                    onClick={() => onCommentRemove(comment.id)}
                                    data-i18n="post-remove"
                                    style={{ marginLeft: "auto", display: 'block' }}
                                >
                                    Remove
                                </button>
                        }

                        <hr/>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default CommentSection;