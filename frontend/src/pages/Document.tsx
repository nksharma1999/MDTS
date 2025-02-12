import React from "react";
import { Table, Button, Space, notification } from "antd";
import { DownloadOutlined, DeleteOutlined } from "@ant-design/icons";
import "../styles/documents.css";
import ImageContainer from "../components/ImageContainer";

interface Document {
    id: number;
    documentName: string;
    fileName: string;
    milestone: string;
    description: string;
    actions: string[];
}

const Document: React.FC = () => {
    const data: Document[] = [
        {
            id: 1,
            documentName: "Geological Survey Report",
            fileName: "geological_survey_2024.pdf",
            milestone: "Site Exploration",
            description: "Detailed survey of mineral deposits and terrain analysis.",
            actions: ["download", "delete"],
        },
        {
            id: 2,
            documentName: "Environmental Impact Assessment",
            fileName: "environmental_impact.pdf",
            milestone: "Regulatory Compliance",
            description: "Assessment of potential environmental risks and mitigation measures.",
            actions: ["download", "delete"],
        },
        {
            id: 3,
            documentName: "Mining Safety Guidelines",
            fileName: "safety_guidelines.pdf",
            milestone: "Operational Safety",
            description: "Comprehensive safety protocols for mining operations.",
            actions: ["download", "delete"],
        },
        {
            id: 4,
            documentName: "Extraction Plan",
            fileName: "extraction_plan.pdf",
            milestone: "Resource Extraction",
            description: "Strategy for resource extraction, including equipment and timelines.",
            actions: ["download", "delete"],
        },
        {
            id: 5,
            documentName: "Equipment Maintenance Log",
            fileName: "maintenance_log.pdf",
            milestone: "Ongoing Operations",
            description: "Record of scheduled maintenance for mining machinery.",
            actions: ["download", "delete"],
        },
        {
            id: 6,
            documentName: "Worker Safety Training Manual",
            fileName: "safety_training_manual.pdf",
            milestone: "Employee Training",
            description: "Mandatory safety training for mining site workers.",
            actions: ["download", "delete"],
        },
        {
            id: 7,
            documentName: "Government Compliance Report",
            fileName: "compliance_report.pdf",
            milestone: "Legal Compliance",
            description: "Report detailing adherence to mining regulations and permits.",
            actions: ["download", "delete"],
        },
        {
            id: 8,
            documentName: "Financial Report - Q1 2024",
            fileName: "financial_report_q1.pdf",
            milestone: "Financial Management",
            description: "Quarterly financial summary including expenses and revenue.",
            actions: ["download", "delete"],
        },
        {
            id: 9,
            documentName: "Stakeholder Meeting Minutes",
            fileName: "stakeholder_meeting.pdf",
            milestone: "Corporate Governance",
            description: "Minutes of recent meetings with stakeholders and investors.",
            actions: ["download", "delete"],
        },
        {
            id: 10,
            documentName: "Site Closure Plan",
            fileName: "site_closure_plan.pdf",
            milestone: "Project Closure",
            description: "Guidelines and strategies for responsible site closure and reclamation.",
            actions: ["download", "delete"],
        }
    ];

    const columns = [
        {
            title: "Id",
            dataIndex: "id",
            key: "id",
            width: "10%"
        },
        {
            title: "Document Name",
            dataIndex: "documentName",
            key: "documentName",
            width: "20%"
        },
        {
            title: "Milestone",
            dataIndex: "milestone",
            key: "milestone",
            width: "10%"
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: "32%"
        },
        {
            title: "Actions",
            key: "actions",
            width: "8%",
            render: (_: any, record: Document) => (
                <Space size="middle" style={{ display: "flex", gap: "28px", justifyContent: "center" }}>
                    {record.actions.includes("download") && (
                        <Button
                            className="download-btn"
                            icon={<DownloadOutlined />}
                            onClick={() => handleDownload(record.fileName)}
                            size="small"
                        >
                        </Button>
                    )}
                    {record.actions.includes("delete") && (
                        <Button
                            className="delete-btn"
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record.id)}
                            danger
                            size="small"
                        >
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    const handleDownload = (fileName: string) => {
        notification.info({
            message: "Downloading file",
            description: `Downloading the file: ${fileName}`,
        });
    };

    const handleDelete = (id: number) => {
        notification.warning({
            message: "File Deleted",
            description: `File with ID ${id} has been deleted.`,
        });
    };

    return (
        <>
            <div className="main-doc-container">
                <div className="document-table-container">
                    <h2 className="table-title">Documents</h2>
                    <Table
                        columns={columns}
                        dataSource={data}
                        rowKey="id"
                        bordered
                        pagination={false}
                        className="custom-table"
                        scroll={{ y: "calc(100vh - 260px)", x: "hidden" }}
                    />
                </div>
                <div className="right-images">
                    <ImageContainer imageUrl="/images/auths/m8.jpg" />
                </div>
            </div>
        </>
    );
};

export default Document;
