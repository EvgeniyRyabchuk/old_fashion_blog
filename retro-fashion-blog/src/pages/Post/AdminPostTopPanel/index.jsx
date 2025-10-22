import React from 'react';
import './index.scss';
import {useNavigate, useParams} from "react-router-dom";
import PATHS from "@/constants/paths";
import {removePostById} from "@/services/posts";
import post from "@pages/Post";
import {useAuth} from "@/context/AuthContext";

const AdminPostTopPanel = () => {

    const { postId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();


    const onPostDelete = async () => {
        if(user && !user.isAdmin) return;
        await removePostById(postId)
        navigate(-1);
    }

    return (
        <section className="admin-post-top-panel">
            <button
                onClick={() =>
                    navigate(`${PATHS.ADMIN_POSTS}?postId=${postId}`)
                }
                className="btn-warning"
                data-i18n="post-edit"
            >
                Edit
            </button>

            <button
                className="btn-danger"
                id="postDeleteBtn"
                data-i18n="post-delete"
                onClick={onPostDelete}
            >
                Delete
            </button>
        </section>
    );
};

export default AdminPostTopPanel;