import React from "react";
import {useLang} from "@/context/LangContext";
import "./index.scss";

const Modal = ({ isOpen, onClose, title, children, size = "medium" }) => {
    const { t } = useLang();

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const sizeClasses = {
        small: "modal-content--small",
        medium: "modal-content--medium",
        large: "modal-content--large",
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className={`modal-content ${sizeClasses[size] || sizeClasses.medium}`}>
                <div className="modal-header">
                    <h3 className="modal-title">{title}</h3>
                    <button className="modal-close-btn" onClick={onClose} aria-label={t("modal-close") || "Close"}>
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;