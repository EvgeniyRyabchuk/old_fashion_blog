import React, {useState} from 'react';
import Modal from "@components/Modal";
import {useLang} from "@/context/LangContext";
import {toast} from "react-toastify";
import {updateContactMessageStatus} from "@/services/contact";
import { MESSAGE_STATUS_OPTIONS } from "@/constants/MessageStatuses";

export default ({ selectedMessage, isModalOpen, setIsModalOpen, onStatusChange }) => {
    const { t } = useLang();
    const [currentStatus, setCurrentStatus] = useState(selectedMessage.status || 'pending');

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        try {
            await updateContactMessageStatus(selectedMessage.id, newStatus);
            setCurrentStatus(newStatus);
            if (onStatusChange) {
                onStatusChange(selectedMessage.id, newStatus);
            }
            toast.success(t("status-update-success") || "Status updated successfully");
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error(t("status-update-error") || "Failed to update status");
        }
    };

    return (
        <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={t("message-details") || "Message Details"}
            size="large"
        >
            <div className="message-details-content">
                <div className="message-field">
                    <strong>{t("messages-t-name") || "Name"}:</strong>
                    <span>{selectedMessage.name || "N/A"}</span>
                </div>
                <div className="message-field">
                    <strong>{t("messages-t-email") || "Email"}:</strong>
                    <span>{selectedMessage.email || "N/A"}</span>
                </div>
                <div className="message-field">
                    <strong>{t("messages-t-phone") || "Phone"}:</strong>
                    <span>{selectedMessage.phone || "N/A"}</span>
                </div>
                <div className="message-field">
                    <strong>{t("messages-t-subject") || "Subject"}:</strong>
                    <span>{selectedMessage.subject || "N/A"}</span>
                </div>
                <div className="message-field status-field">
                    <strong>{t("messages-t-status") || "Status"}:</strong>
                    <select 
                        value={currentStatus} 
                        onChange={handleStatusChange}
                    >
                        {MESSAGE_STATUS_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                                {t(option.labelKey) || option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="message-field">
                    <strong>{t("messages-t-createdAt") || "Created At"}:</strong>
                    <span>
                        {selectedMessage.createdAt?.toDate ?
                            selectedMessage.createdAt.toDate().toLocaleString()
                            : "N/A"}
                    </span>
                </div>
                <div className="message-field full-width">
                    <strong>{t("messages-t-message") || "Message"}:</strong>
                    <p className="message-content">{selectedMessage.message || "N/A"}</p>
                </div>
            </div>
        </Modal>
    );
};

