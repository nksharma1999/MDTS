import React, { useEffect, useState } from "react";
import { Table, Button, Space, notification, Modal, Form, Input, Select, List, message } from "antd";
import { DownloadOutlined, DeleteOutlined, ExclamationCircleOutlined, PlusOutlined, UploadOutlined, CloseCircleOutlined } from "@ant-design/icons";
import "../styles/documents.css";
import ImageContainer from "../components/ImageContainer";
import { getAllDocuments, deleteDocument, getModules, saveDocument, updateDocument } from "../Utils/moduleStorage";
import { useDropzone, Accept } from "react-dropzone";
import { useLocation } from "react-router-dom";
import { Typography } from "antd";
import "../styles/documents.css"
const { Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface Document {
    id: number;
    documentName: string;
    fileName: string;
    milestone: string;
    description: string;
    actions: string[];
}
interface Module {
    moduleName: string;
}

interface DocumentData {
    id: number;
    documentName: string;
    description: string;
    milestone: string;
    files: string[];
    uploadedAt: string;
}
const Document: React.FC = () => {
    const [documents, setDocuments] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);
    const location = useLocation();
    const documentToEdit = location.state?.documentToEdit as DocumentData | undefined;
    const [documentName, setDocumentName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [milestone, setMilestone] = useState<string>("");
    const [files, setFiles] = useState<File[]>([]);
    const [milestones, setMilestones] = useState<Module[]>([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);

    useEffect(() => {
        const savedDocuments = getAllDocuments();
        setDocuments(savedDocuments);
    }, []);

    useEffect(() => {
        const savedModules = getModules();
        if (Array.isArray(savedModules)) {
            setMilestones(savedModules);
        }
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
            width: "30%",
            align: "left",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: "30%",
            align: "left",
        },
        {
            title: "Actions",
            key: "actions",
            width: "10%",
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

    const onDrop = (acceptedFiles: File[]) => {
        setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*,application/pdf' as unknown as Accept,
        multiple: true,
    });

    const handleSave = () => {
        if (!documentName || !milestone || files.length === 0) {
            message.error("Please fill all fields and upload files.");
            return;
        }

        const newDocument: DocumentData = {
            id: Math.floor(Math.random() * (100 - 10 + 1) + 10),
            documentName,
            description,
            milestone,
            files: files.map((file) => file.name),
            uploadedAt: documentToEdit ? documentToEdit.uploadedAt : new Date().toISOString(),
        };

        if (documentToEdit) {
            updateDocument(documentToEdit.id, newDocument);
            message.success("Document updated successfully!");
        } else {
            const isSaved = saveDocument(newDocument);
            if (isSaved) {
                message.success("Document saved successfully!");
                setDocuments(getAllDocuments());
                setIsAddModalVisible(false);
            } else {
                message.error("Failed to save the document. Please try again.");
            }
        }
    };

    const handleCancelAddedDoc = () => {
        setDocumentName("");
        setDescription("");
        setMilestone("");
        setFiles([]);
        setIsAddModalVisible(false);
    };

    const handleRemoveFile = (indexToRemove: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
    };

    const handleAddDocument = () => {
        setIsAddModalVisible(true);
    };

    return (
        <>
            <div className="main-doc-container">
                <div className="document-table-container">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px" }}>
                        <p className="table-title">Documents</p>
                        <Button type="primary" className="bg-secondary" size="small" icon={<PlusOutlined />} onClick={handleAddDocument}>
                            Add Document
                        </Button>
                    </div>
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
                    <ImageContainer imageUrl={["/images/auths/m8.jpg", "/images/auths/m2.jpg"]} />
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

            <Modal title="Create Document" centered className="modal-container" width={"65%"} visible={isAddModalVisible} onCancel={handleCancelAddedDoc} onOk={handleSave} okText="Save" cancelText="Cancel" okButtonProps={{ className: "bg-secondary" }}>
                <Form layout="horizontal" onFinish={handleSave} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} requiredMark={false}>
                    <div className="main-doc-container" style={{ width: "99%" }}>
                        <div className="left-create-document">
                            <div className="main-create-doc-container">
                                <div className="left-create-document-item">
                                    <Form.Item
                                        label={<span style={{ textAlign: "left" }}> Document Name </span>}
                                        name="documentName"
                                        rules={[{ required: true, message: "Document Name is required" }]}
                                        labelAlign="left"
                                        colon={false}
                                    >
                                        <Input
                                            placeholder="Document Name"
                                            value={documentName}
                                            style={{ marginBottom: "15px" }}
                                            onChange={(e) => setDocumentName(e.target.value)}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label={<span style={{ textAlign: "left" }}> Description </span>}
                                        name="description"
                                        rules={[{ required: true, message: "Description is required" }]}
                                        labelAlign="left"
                                        colon={false}
                                    >
                                        <TextArea
                                            rows={4}
                                            placeholder="Description"
                                            value={description}
                                            style={{ marginBottom: "15px" }}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label={<span style={{ textAlign: "left" }}> Select Milestone </span>}
                                        name="milestone"
                                        rules={[{ required: true, message: "Milestone is required" }]}
                                        labelAlign="left"
                                        colon={false}
                                    >
                                        <Select
                                            placeholder="Select Milestone"
                                            value={milestone}
                                            onChange={setMilestone}
                                            style={{ marginBottom: "15px" }}
                                        >
                                            {milestones.map((option, index) => (
                                                <Option key={index} value={option.moduleName}>
                                                    {option.moduleName}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        label={<span style={{ textAlign: "left" }}> Upload Files </span>}
                                        name="files"
                                        // rules={[{ required: files.length === 0, message: "Please upload at least one file" }]}
                                        labelAlign="left"
                                        colon={false}
                                    >
                                        <div
                                            {...getRootProps()}
                                            style={{
                                                border: "2px dashed #d9d9d9",
                                                padding: 16,
                                                textAlign: "center",
                                                borderRadius: 8,
                                                cursor: "pointer",
                                                background: isDragActive ? "#f0f8ff" : "#fafafa",
                                            }}
                                        >
                                            <input {...getInputProps()} />
                                            <UploadOutlined style={{ fontSize: 32, color: "#1890ff" }} />
                                            <Text style={{ display: "block", marginTop: 8 }}>
                                                {isDragActive
                                                    ? "Drop the files here..."
                                                    : "Drag and drop files here, or click to select files"}
                                            </Text>
                                        </div>
                                    </Form.Item>

                                    {files.length > 0 && (
                                        <List
                                            dataSource={files}
                                            renderItem={(file, index) => (
                                                <List.Item
                                                    actions={[
                                                        <CloseCircleOutlined
                                                            key="remove"
                                                            onClick={() => handleRemoveFile(index)}
                                                            style={{ color: "#888" }}
                                                        />,
                                                    ]}
                                                >
                                                    <Text>{file.name}</Text>
                                                </List.Item>
                                            )}
                                        />
                                    )}

                                </div>
                            </div>

                        </div>
                    </div>
                </Form>
            </Modal>
        </>
    );
};

export default Document;
