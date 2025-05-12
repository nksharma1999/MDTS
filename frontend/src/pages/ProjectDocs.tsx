import { Table, Input, Select, Card, Typography } from "antd";
import "../styles/ProjectDocs.css";
const { Option } = Select;
const { Text } = Typography;
const ProjectDocs = () => {
    const dataSummary = [
        { count: 15, label: "Notification" },
        { count: 8, label: "Letters" },
        { count: 12, label: "Review Meeting MoM" },
        { count: 25, label: "Approved NFAs" },
    ];

    const columns = [
        {
            title: "Doc. Name",
            dataIndex: "docName",
            filterDropdown: () => <Input />,
        },
        {
            title: "Date Of Issuance",
            dataIndex: "dateOfIssuance",
            filterDropdown: () => <Input type="date" />,
        },
        {
            title: "Type",
            dataIndex: "type",
            filterDropdown: () => (
                <Select>
                    <Option value="notification">Notification</Option>
                    <Option value="letter">Letter</Option>
                    <Option value="review">Review MoM</Option>
                    <Option value="nfa">NFA</Option>
                </Select>
            ),
        },
        {
            title: "Linked Activity",
            dataIndex: "linkedActivity",
            filterDropdown: () => <Input />,
        },
        {
            title: "Doc.",
            dataIndex: "doc",
            filterDropdown: () => <Input />,
        },
        {
            title: "Uploading Details",
            dataIndex: "uploadingDetails",
            filterDropdown: () => <Input />,
        },
    ];

    const dataSource: any = [];

    return (
        <div className="">
            <div className="project-document-cont table-and-not">
                <div style={{ width: '70%' }}>
                    <div className="summary-cards-flex">
                        {dataSummary.map((item, index) => (
                            <div className="summary-card-wrapper" key={index}>
                                <Card className="summary-card">
                                    <Text className="count">{item.count}</Text>
                                    {item.label && (
                                        <>
                                            <br />
                                            <Text className="label">{item.label}</Text>
                                        </>
                                    )}
                                </Card>
                            </div>
                        ))}
                    </div>
                    <div className="table-data">
                        <Table
                            columns={columns}
                            dataSource={dataSource}
                            pagination={false}
                            className="document-table"
                        />
                    </div>
                </div>
                <div className="whats-new-box">
                    <div className="title">What's New</div>
                    <div className="content">
                        BH review meeting MoM dated 17-05-2024 has been uploaded !!
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDocs;
