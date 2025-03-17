import { useEffect, useState } from "react";
import "../styles/projects.css";
import { Form, Input, Row, Col, Button, Modal, Select, Dropdown, Menu } from 'antd';
import { Link } from "react-router-dom";
import ImageContainer from "../components/ImageContainer";
import { SearchOutlined } from "@mui/icons-material";
import { MoreOutlined, RobotOutlined } from "@ant-design/icons";
import { Collapse, Table, Typography } from "antd";
import { db } from "../Utils/dataStorege.ts";
const { Panel } = Collapse;
const { Title } = Typography;
interface LocationDetails {
    state: string;
    district: string;
    nearestTown: string;
    nearestAirport: string;
    nearestRailwayStation: string;
}

interface ContractualDetails {
    mineOwner: string;
    dateOfH1Bidder: string | null;
    cbdpaDate: string | null;
    vestingOrderDate: string | null;
    pbgAmount: string;
}

interface InitialStatus {
    forestclearence: string;
    shivam: string;
}

interface ProjectParameters {
    companyName: string;
    projectName: string;
    reserve: string;
    netGeologicalReserve: string;
    extractableReserve: string;
    stripRatio: string;
    peakCapacity: string;
    mineLife: string;
    totalCoalBlockArea: string;
    mineral: string;
    typeOfMine: string;
    grade: string;
    state: string;
    district: string;
    nearestTown: string;
    nearestAirport: string;
    nearestRailwayStation: string;
    mineOwner: string;
    dateOfH1Bidder: string | null;
    cbdpaDate: string | null;
    vestingOrderDate: string | null;
    pbgAmount: string;
    view?: boolean;
}

interface ProjectData {
    projectParameters: ProjectParameters;
    locations: LocationDetails;
    contractualDetails: ContractualDetails;
    initialStatus: InitialStatus;
}

const membersList = ["Alice", "Bob", "Charlie", "David", "Emma"];
const Projects = () => {
    const [allProjects, setAllProjects] = useState<any[]>([]);
    const [projectDetails, setProjectDetails] = useState<ProjectData | null>(null);
    const [selectedProjectName, setSelectedProjectName] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<string | null>(null);
    const [addedMembers, setAddedMembers] = useState<string[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<any>(null);
    
    const getAllProjects = async () => {
        try {
            const storedData = await db.getProjects();
            if (!Array.isArray(storedData) || storedData.length === 0) {
                console.warn("No projects found.");
                setAllProjects([]);
                setProjectDetails(null);
                return;
            }

            setAllProjects(storedData);
            setProjectDetails(storedData[0]);
            setSelectedProjectName(storedData[0].projectParameters.projectName);
        } catch (error) {
            console.error("An unexpected error occurred while fetching projects:", error);
        }
    }
    useEffect(() => {
        getAllProjects();
    }, []);

    if (!projectDetails) {
        return <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            No projects available. Please add a project to get started.
            <div style={{ marginLeft: "30px" }}>
                <Button size="small" className="bg-secondary" icon={<RobotOutlined />}>
                    <Link style={{ color: "inherit", textDecoration: "none" }} to={"/create/register-new-project"}>New</Link>
                </Button>
            </div>
        </div>;
    }


    const { projectParameters, locations, contractualDetails, initialStatus }: any = projectDetails;

    const handleProjectClick = (projectName: string) => {
        const selectedProject = allProjects.find(
            (project) => project.projectParameters.projectName === projectName
        );
        if (selectedProject) {
            setProjectDetails(selectedProject);
            setSelectedProjectName(selectedProject.projectParameters.projectName)
        }
    };

    const handleSearch = (_event: any) => {
        console.log("searching...");
    };

    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => setIsModalOpen(false);

    const handleAddMember = () => {
        if (selectedMember && !addedMembers.includes(selectedMember)) {
            setAddedMembers([...addedMembers, selectedMember]);
        }
        setIsModalOpen(false);
        setSelectedMember(null);
    };

    const handleDeleteProject = () => {
        if (!projectToDelete) return;

        const updatedProjects = allProjects.filter(
            (project) => project.id !== projectToDelete.id
        );

        const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = loggedInUser.id;
        const userProjectsKey = `projects_${userId}`;

        localStorage.setItem(userProjectsKey, JSON.stringify(updatedProjects));
        setAllProjects(updatedProjects);
        setProjectDetails(updatedProjects.length > 0 ? updatedProjects[0] : null);
        setSelectedProjectName(updatedProjects.length > 0 ? updatedProjects[0].projectParameters.projectName : "");
        setIsDeleteModalOpen(false);
    };

    const closeDeleteModal = () => {
        setProjectToDelete(null);
        setIsDeleteModalOpen(false);
    };

    const showDeleteModal = (project: ProjectData) => {
        setProjectToDelete(project);
        setIsDeleteModalOpen(true);
    };

    const menu = (project: ProjectData) => (
        <Menu>
            <Menu.Item key="delete" onClick={() => showDeleteModal(project)}>
                Delete
            </Menu.Item>
        </Menu>
    );

    return (
        <>
            <div className="project-container">
                <div className="all-project-details">
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div className="heading">Projects</div>
                        <Button size="small" className="bg-secondary" icon={<RobotOutlined />}>
                            <Link style={{ color: "inherit", textDecoration: "none" }} to={"/create/register-new-project"}>New</Link>
                        </Button>
                    </div>
                    <div className="search">
                        <Input
                            size="small"
                            placeholder="Find the projects..."
                            onChange={handleSearch}
                            prefix={<SearchOutlined style={{ fontSize: "18px", color: "#ddd" }} />}
                            style={{ height: "26px", fontSize: "12px" }}
                        />
                    </div>
                    {allProjects.map((project) => (
                        <div
                            key={project.projectParameters.projectName}
                            className={`project-item ${selectedProjectName === project.projectParameters.projectName ? "selected-project" : ""}`}
                            onClick={() => handleProjectClick(project.projectParameters.projectName)}
                        >
                            <span>{project.projectParameters.projectName}</span>
                            <Dropdown overlay={menu(project)} trigger={["hover"]}>
                                <MoreOutlined className="three-dot-menu" />
                            </Dropdown>
                        </div>
                    ))}
                </div>
                <section className="project-info">
                    <div className="base-details">
                        <div>
                            <p>{selectedProjectName}</p>
                            <div style={{ fontSize: "12px", color: "#c5c5c5" }}>{projectParameters.companyName}</div>
                        </div>
                        <div>
                            <Button className="bg-secondary" onClick={showModal}>
                                Add Member
                            </Button>
                        </div>
                    </div>
                    <div className="details-paremeters">
                        <div className="info-item">
                            <p>Project Parameters</p>
                            <hr style={{ margin: "0px 0px 10px 0px" }} />
                            <Form colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} layout="horizontal">
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item label="Reserve">
                                            <Input value={projectParameters.reserve} disabled />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label="Net Geological Reserve">
                                            <Input value={projectParameters.netGeologicalReserve} disabled />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label="Extractable Reserve">
                                            <Input value={projectParameters.extractableReserve} disabled />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label="Strip Ratio">
                                            <Input value={projectParameters.stripRatio} disabled />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label="Peak Capacity">
                                            <Input value={projectParameters.peakCapacity} disabled />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label="Mine Life">
                                            <Input value={projectParameters.mineLife} disabled />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label="Total Coal Block Area">
                                            <Input value={projectParameters.totalCoalBlockArea} disabled />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label="Mineral">
                                            <Input value={projectParameters.mineral} disabled />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label="Type of Mine">
                                            <Input value={projectParameters.typeOfMine} disabled />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label="Grade">
                                            <Input value={projectParameters.grade} disabled />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </div>

                        <div className="info-item">
                            <p>Location Details</p>
                            <hr style={{ margin: "0px 0px 10px 0px" }} />
                            <Form colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} layout="horizontal">
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item label="State">
                                            <Input value={locations.state} disabled />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label="District">
                                            <Input value={locations.district} disabled />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label="Nearest Town">
                                            <Input value={locations.nearestTown} disabled />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label="Nearest Airport">
                                            <Input value={locations.nearestAirport} disabled />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label="Nearest Railway Station">
                                            <Input value={locations.nearestRailwayStation} disabled />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </div>

                        <div className="info-item">
                            <p>Contractual Details</p>
                            <hr style={{ margin: "0px 0px 10px 0px", height: "1.5px" }} />
                            <Form colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} layout="horizontal">
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item label="Mine Owner">
                                            <Input value={contractualDetails.mineOwner ?? ''} disabled />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label="Date of H1 Bidder">
                                            <Input value={contractualDetails.dateOfH1Bidder ?? ''} disabled />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label="CBDPA Date">
                                            <Input value={contractualDetails.cbdpaDate ?? ''} disabled />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label="Vesting Order Date">
                                            <Input value={contractualDetails.vestingOrderDate ?? ''} disabled />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label="PBG Amount">
                                            <Input value={contractualDetails.pbgAmount ?? ''} disabled />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </div>

                        <div className="info-item">
                            <p>Initial Status</p>
                            <hr style={{ margin: "0px 0px 10px 0px", height: "1.5px" }} />
                            <div style={{ padding: 5, maxWidth: "900px" }}>
                                <Title level={4} style={{ margin: "0px 0px 10px 10px" }}>
                                    {initialStatus.library}
                                </Title>
                                <Collapse accordion>
                                    {initialStatus.items.map((module: any) => (
                                        <Panel
                                            key={module.parentModuleCode}
                                            header={<b style={{ fontSize: "14px" }}>{module.moduleName}</b>}
                                            extra={<span style={{ fontSize: "12px" }}>Mine Type: {module.mineType}</span>}
                                        >
                                            <Table
                                                dataSource={module.activities}
                                                columns={[
                                                    {
                                                        title: "Activity Name",
                                                        dataIndex: "activityName",
                                                        key: "activityName",
                                                        width: "50%",
                                                    },
                                                    {
                                                        title: "Duration (days)",
                                                        dataIndex: "duration",
                                                        key: "duration",
                                                        align: "center",
                                                    },
                                                    {
                                                        title: "Prerequisite",
                                                        dataIndex: "prerequisite",
                                                        key: "prerequisite",
                                                        align: "center",
                                                    },
                                                ]}
                                                rowKey="code"
                                                pagination={false}
                                                bordered
                                            />
                                        </Panel>
                                    ))}
                                </Collapse>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="image-container">
                    <ImageContainer imageUrl="/images/auths/m5.jpg" />
                </div>
            </div>

            <Modal
                title="Select Member"
                open={isModalOpen}
                onCancel={handleCancel}
                onOk={handleAddMember}
                okButtonProps={{ className: "bg-secondary text-white" }}
                cancelButtonProps={{ className: "bg-tertiary text-white" }}
            >
                <Select
                    placeholder="Select a member"
                    style={{ width: "100%" }}
                    value={selectedMember}
                    onChange={setSelectedMember}
                >
                    {membersList.map((member) => (
                        <Select.Option key={member} value={member}>
                            {member}
                        </Select.Option>
                    ))}
                </Select>
            </Modal>

            <Modal
                title="Confirm Deletion"
                open={isDeleteModalOpen}
                onOk={handleDeleteProject}
                onCancel={closeDeleteModal}
                okText="Delete"
                okButtonProps={{ danger: true }}
            >
                <p>Are you sure you want to delete this project?</p>
            </Modal>

        </>
    );
};

export default Projects;
