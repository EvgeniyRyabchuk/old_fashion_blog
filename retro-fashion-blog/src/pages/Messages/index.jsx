import React, {useEffect, useMemo, useState} from 'react';
import './index.scss';
import Table from "@components/Table";
import {useFetching} from "@/hooks/useFetching";
import {useLang} from "@/context/LangContext";
import {fetchDataFirestore} from "@/services";
import {usePaginate} from "@/hooks/usePaginate";
import {defPage, defPerPage} from "@/constants/default";
import Pagination from "@components/Pagination";
import {StandardLoader} from "@components/Loader";
import Breadcrumb from "@components/Breadcrumb";
import {toast} from "react-toastify";
import Remove from "@components/Table/actions/Remove";
import {deleteContactMessageById} from "@/services/contact";
import useQueryParams from "@/hooks/useQueryParams";
import Modal from "@components/Modal";
import ModalMessage from "@pages/Messages/ModalMessage";

const colName = "contact_messages";

const Messages = () => {
    const { t } = useLang();
    const { updateSearchParams, setSearchParams, searchParams } = useQueryParams();

    const staticCols = [
        { name: t("messages-t-id") || "ID", key: "id", type: "text" },
        { name: t("messages-t-name") || "Name", key: "name" },
        { name: t("messages-t-email") || "Email", key: "email" },
        { name: t("messages-t-message") || "Message", key: "message", type: "largeText" },
        { name: t("messages-t-subject") || "Subject", key: "subject" },
        { name: t("messages-t-phone") || "Phone", key: "phone" },
        { name: t("messages-t-status") || "Status", key: "status", type: "html" },
        { name: t("messages-t-createdAt") || "Created At", key: "createdAt" },
        { name: t("messages-t-actions") || "Actions", key: "actions", type: "actions" },
    ];

    const [messages, setMessages] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);

    const [fetchMessagesData, isMessagesFetchLoading, error] = useFetching(async ({page, perPage, cursorHandler, options: restOptions }) => {
        const options = {
            sort: searchParams.get("sort") ?? "newest",
            t,
            ...restOptions
        };

        const res = await fetchDataFirestore(
            colName,
            page,
            perPage,
            cursorHandler,
            options
        );

        return res;
    });

    const {
        totalCount,
        totalPages,
        currentPage,
        perPage,
        goToPage,
        loadMore,
        reload,
        resetPagination,
        loading,
        setPerPage,
        setCurrentPage,
        pageForLoadMore
    } = usePaginate({
        colName,
        fetchData: fetchMessagesData,
        perPageDefault: parseInt(searchParams.get("perPage") ?? defPerPage),
        initialPage: parseInt(searchParams.get("page") ?? defPage),
        setItems: setMessages,
        items: messages,
        isScrollUp: false,
    });

    useEffect(() => {
        reload(currentPage);
    }, [searchParams.get("sort"), perPage]);

    useEffect(() => {
        updateSearchParams({ sort: searchParams.get("sort") ?? "newest", page: pageForLoadMore, perPage });
    }, [searchParams.get("sort"), perPage, pageForLoadMore]);


    const tableRows = useMemo(() => {
        if(!messages || messages.length === 0) return [];

        const actionSectionGenerate = (id) => (
            <Remove
                onDeleteClick={async () => {
                    try {
                        await deleteContactMessageById(id);
                        toast.success(t("message-delete-success") || "Message deleted successfully.");
                        // Reload the messages list after deletion
                        if(messages.length > 1) {
                            reload(currentPage);
                        } else {
                            reload(currentPage - 1);
                        }
                    } catch (err) {
                        console.error("Error deleting message:", err);
                        toast.error(err.message || (t("message-delete-failed") || "Failed to delete message"));
                    }
                }}
            />
        );

        const messageClickHandler = (message) => () => {
            setSelectedMessage(message);
            setIsModalOpen(true);
        };

        return messages.map(message => {
            // Create HTML string for status badge to work with 'html' type
            const status = message.status || 'pending';
            const statusText = t(`status-${status}`) || 
                              (status === 'in-work' ? 'In Work' : 
                               status.charAt(0).toUpperCase() + status.slice(1));
            
            // Set colors based on new status values
            let bgColor, textColor;
            switch(status) {
                case 'done':
                    bgColor = '#d4edda';
                    textColor = '#155724';
                    break;
                case 'in-work':
                    bgColor = '#cce5ff';
                    textColor = '#004085';
                    break;
                case 'pending':
                default:
                    bgColor = '#fff3cd';
                    textColor = '#856404';
                    break;
            }
            
            const statusHtml = `
                <span class="status-badge status-${status}" style="
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    font-weight: bold;
                    text-transform: uppercase;
                    background-color: ${bgColor};
                    color: ${textColor};
                ">
                    ${statusText}
                </span>
            `;

            return {
                id: message.id,
                name: message.name || "N/A",
                email: message.email || "N/A",
                message: message.message || "N/A",
                subject: message.subject || "N/A",
                phone: message.phone || "N/A",
                status: statusHtml,
                createdAt: message.createdAt?.toDate ? message.createdAt.toDate().toLocaleString() : "N/A",
                actions: actionSectionGenerate(message.id)
            };
        });
    }, [messages, reload, currentPage]);


    const onRowClick = ({ id }) => {
        const msg = messages.find((m => m.id === id));
        setSelectedMessage(msg);
        setIsModalOpen(true);
    }

    return (
        <>
            <Breadcrumb
                items={[
                    { to: "/", label: t("nav-home") || "Home" },
                    { label: t("title-messages") || "Messages" },
                ]}
            />

            <section className="content-section messages-table-section">
                <StandardLoader isActive={isMessagesFetchLoading || loading} />

                <Table cols={staticCols} rows={tableRows} onRowClick={onRowClick}  />

                <Pagination
                    colName={colName}
                    fetchData={fetchMessagesData}
                    perPageDefault={defPerPage}
                    initialPage={defPage}
                    items={messages}
                    setItems={setMessages}
                    totalPages={totalPages}
                    currentPage={currentPage}
                    perPage={perPage}
                    goToPage={goToPage}
                    loadMore={loadMore}
                    onPerPageChange={(e) => {
                        setPerPage(e.target.value);
                        setCurrentPage(1);
                        updateSearchParams({ sort: searchParams.get("sort") ?? "newest", page: 1, perPage: e.target.value });
                    }}
                    pageForLoadMore={pageForLoadMore}
                    isScrollUp={false}
                />
            </section>
            
            {selectedMessage && (
                <ModalMessage
                    selectedMessage={selectedMessage}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    onStatusChange={(messageId, newStatus) => {
                        // Update the message in the local state
                        setMessages(prev => 
                            prev.map(msg => 
                                msg.id === messageId 
                                    ? { ...msg, status: newStatus } 
                                    : msg
                            )
                        );
                        // Update the selected message as well
                        setSelectedMessage(prev => ({
                            ...prev,
                            status: newStatus
                        }));
                    }}
                />)}
        </>
    );
};

export default Messages;