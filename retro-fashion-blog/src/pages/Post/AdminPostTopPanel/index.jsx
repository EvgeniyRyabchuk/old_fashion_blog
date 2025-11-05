import React from 'react';
import './index.scss';
import {useNavigate, useParams} from "react-router-dom";
import PATHS from "@/constants/paths";
import {removePostById} from "@/services/posts";
import post from "@pages/Post";
import {useAuth} from "@/context/AuthContext";
import {toast} from "react-toastify";
import Spinner from "@components/Loader/Spinner";
import {useFetching} from "@/hooks/useFetching";
import {useLang} from "@/context/LangContext";

const AdminPostTopPanel = () => {

    const { postId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useLang();

    const [remove, isRemoveLoading, removeError ] = useFetching(async () => {
        await removePostById(postId)
    })

    const onPostDelete = async () => {
        if(user && !user.isAdmin) return;
        remove();
        toast.success("Post deleted successfully.");
        navigate(-1);
    }

    return (
        <section className="admin-post-top-panel">
            <button
                onClick={() =>
                    navigate(`${PATHS.ADMIN_POSTS}?postId=${postId}`)
                }
                className="btn-warning"
            >
                {t("post-edit") || "Edit"}
            </button>

            <button
                className="btn-danger"
                id="postDeleteBtn"
                onClick={onPostDelete}
            >
                {t("post-delete") || "Delete"}
                { isRemoveLoading && <Spinner style={{marginLeft: "10px"}}/>}
            </button>
        </section>
    );
};

export default AdminPostTopPanel;