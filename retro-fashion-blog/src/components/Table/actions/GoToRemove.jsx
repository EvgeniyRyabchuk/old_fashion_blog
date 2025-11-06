import {useLang} from "@/context/LangContext";
import {useFetching} from "@/hooks/useFetching";
import Spinner from "@components/Loader/Spinner";
import React from "react";
import {Link, useNavigate} from "react-router-dom";

const GoToRemove = ({ onDeleteClick, postId }) => {
    const { t } = useLang();
    const navigate = useNavigate();
    const [fetchDeleteRes, isLoading, error] = useFetching(onDeleteClick);

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <button type="button" onClick={() => navigate(`/posts/${postId}`)}>
                {t("go-to-post") || "Go to Post"}
            </button>
            <button type="button" onClick={() => fetchDeleteRes() }>
                {isLoading ? (<Spinner />) : (t("remove") || "Remove")}
            </button>
        </div>

    )
}

export default GoToRemove;