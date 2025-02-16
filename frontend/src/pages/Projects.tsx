import { useEffect, useState } from "react";
import "../styles/projects.css";
import { Form, Input, Row, Col, Button, Modal, Select } from 'antd';
import { Link } from "react-router-dom";
import ImageContainer from "../components/ImageContainer";
import { SearchOutlined } from "@mui/icons-material";
import { RobotOutlined } from "@ant-design/icons";
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
    useEffect(() => {
        try {
            const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
            const userId = loggedInUser.id;
            const userProjectsKey = `projects_${userId}`;
            const storedData = JSON.parse(localStorage.getItem(userProjectsKey) || "[]");

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
    }, []);

    if (!projectDetails) {
        return <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>No projects available. Please add a project to get started.</div>;
    }

    const { projectParameters, locations, contractualDetails, initialStatus } = projectDetails;

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
    return (
        <>
            <div className="project-container">
                <div className="all-project-details">
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div className="heading">Projects</div>
                        <div>
                            <Button size="small" className="bg-secondary" icon={<RobotOutlined />}>
                                <Link style={{ color: "inherit", textDecoration: "none" }} to={"/create/register-new-project"}>New</Link>
                            </Button>
                        </div>
                    </div>
                    <div className="search">
                        <Input
                            size="small"
                            placeholder="Find the projects..."
                            onChange={handleSearch}
                            prefix={<SearchOutlined />}
                            style={{ height: "26px", fontSize: "12px" }}
                        />
                    </div>
                    {allProjects.map((project: any) => (
                        <p
                            className={selectedProjectName == project.projectParameters.projectName ? "selected-project" : ""}
                            key={project.id}
                            style={{ cursor: "pointer", marginBottom: "8px" }}
                            onClick={() => handleProjectClick(project.projectParameters.projectName)}
                        >
                            {project.projectParameters.projectName}
                        </p>
                    ))}
                </div>
                <section className="project-info">
                    <div className="base-details">
                        <p>{selectedProjectName}</p>
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
                            <Form colon={false} labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} layout="horizontal">
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item label="Forest Clearance">
                                            <Input value={initialStatus.forestclearence} disabled />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label="Shivam">
                                            <Input value={initialStatus.shivam} disabled />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
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

        </>
    );
};

export default Projects;
