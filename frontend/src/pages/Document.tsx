import React, { useEffect, useState } from "react";
import { Table, Button, Space, notification, Modal } from "antd";
import { DownloadOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import "../styles/documents.css";
import ImageContainer from "../components/ImageContainer";
import { getAllDocuments, deleteDocument } from "../Utils/moduleStorage";
interface Document {
    id: number;
    documentName: string;
    fileName: string;
    milestone: string;
    description: string;
    actions: string[];
}

const Document: React.FC = () => {
    const [documents, setDocuments] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);
    useEffect(() => {
        const savedDocuments = getAllDocuments();
        setDocuments(savedDocuments);
    }, []);

    const columns: any = [
        {
            title: "Id",
            dataIndex: "id",
            key: "id",
            width: "10%",
        },
        {
            title: "Document Name",
            dataIndex: "documentName",
            key: "documentName",
            width: "20%",
            align: "left",
        },
        {
            title: "Milestone",
            dataIndex: "milestone",
            key: "milestone",
            width: "10%",
            align: "left",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: "32%",
            align: "left",
        },
        {
            title: "Actions",
            key: "actions",
            width: "8%",
            render: (_: any, record: any) => (
                <Space size="middle" style={{ display: "flex", gap: "28px", justifyContent: "center" }}>
                    {record.files && record.files.length > 0 && (
                        <Button
                            className="download-btn"
                            icon={<DownloadOutlined />}
                            onClick={() => handleDownload(record.files[0])}
                            size="small"
                        />
                    )}
                    <Button
                        className="delete-btn"
                        icon={<DeleteOutlined />}
                        onClick={() => showDeleteModal(record.id)}
                        danger
                        size="small"
                    />
                </Space>
            ),
        },
    ];

    const handleDownload = (fileName: any) => {
        notification.info({
            message: "Downloading file",
            description: `Downloading the file: ${fileName}`,
        });
    };


    const showDeleteModal = (id: number) => {
        setSelectedDocumentId(id);
        setIsModalVisible(true);
    };

    const handleDelete = () => {
        if (selectedDocumentId !== null) {
            deleteDocument(selectedDocumentId);
            setDocuments(getAllDocuments());

            notification.success({
                message: "Document Deleted",
                description: "The document has been successfully deleted.",
            });

            setIsModalVisible(false);
            setSelectedDocumentId(null);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedDocumentId(null);
    };

    return (
        <>
            <div className="main-doc-container">
                <div className="document-table-container">
                    <h2 className="table-title">Documents</h2>
                    <Table
                        columns={columns}
                        dataSource={documents}
                        rowKey="id"
                        bordered
                        pagination={false}
                        className="custom-table"
                    />
                </div>
                <div className="right-images image-container">
                    <ImageContainer imageUrl="/images/auths/m8.jpg" />
                </div>
            </div>
            <Modal
                title="Confirm Delete"
                visible={isModalVisible}
                onOk={handleDelete}
                onCancel={handleCancel}
                okText="Delete"
                cancelText="Cancel"
                okType="danger"
            >
                <p>
                    <ExclamationCircleOutlined style={{ color: "red", marginRight: "8px" }} />
                    Are you sure you want to delete this document? This action cannot be undone.
                </p>
            </Modal>
        </>
    );
};

export default Document;
