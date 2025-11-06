import {useLang} from "@/context/LangContext";
import {useFetching} from "@/hooks/useFetching";
import Spinner from "@components/Loader/Spinner";
import React from "react";

const Remove = ({ onDeleteClick, onEditClick}) => {
    const { t } = useLang();
    const [fetchDeleteRes, isLoading,  error] = useFetching(onDeleteClick);
    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <button type="button" onClick={() => fetchDeleteRes() }>
                {isLoading ? (<Spinner />) : (t("remove") || "Remove")}
            </button>
        </div>
    )
}

export default Remove;