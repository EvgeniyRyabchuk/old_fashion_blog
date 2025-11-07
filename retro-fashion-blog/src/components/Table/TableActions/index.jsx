import React from 'react';
import {useLang} from "@/context/LangContext";
import {useFetching} from "@/hooks/useFetching";
import Spinner from "@components/Loader/Spinner";
import {useNavigate} from "react-router-dom";
import ACTIONS from "@/constants/table-actions";

const EditBtn = ({ onEditClick }) => {
    const { t } = useLang();
    return (
        <button type="button" onClick={onEditClick}>{t("edit") || "Edit"}</button>
    )
}

// `/posts/${postId}`
const GoToBtn = ({ navigateUrl }) => {
    const { t } = useLang();
    const navigate = useNavigate();

    return (
        <button type="button" onClick={() => navigate(navigateUrl)}>
            {t("go-to-post") || "Go to Post"}
        </button>
    )
}

const RemoveBtn = ({ onDeleteClick }) => {
    const { t } = useLang();
    const [fetchDeleteRes, isLoading,  error] = useFetching(onDeleteClick);

    return (
        <button type="button" onClick={() => fetchDeleteRes() }>
            {isLoading ? (<Spinner />) : (t("remove") || "Remove")}
        </button>
    )
}




const TableAction = ({ actions, ...props }) => {


    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            {actions.map((action) => (
                action === ACTIONS.GO_TO ? (
                    <GoToBtn key={action} {...props} />
                ) : action === ACTIONS.EDIT ? (
                    <EditBtn key={action} {...props} />
                ) : action === ACTIONS.DELETE ? (
                    <RemoveBtn key={action} {...props} />
                ) : null
            ))}
        </div>
    );
};

export default TableAction;