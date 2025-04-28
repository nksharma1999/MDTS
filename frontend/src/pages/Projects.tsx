import { useEffect, useState } from "react";
import "../styles/projects.css";
import { Input, Button, Modal, Select, Dropdown, Menu, message } from 'antd';
import { Link } from "react-router-dom";
import { SearchOutlined } from "@mui/icons-material";
import { MoreOutlined, RobotOutlined } from "@ant-design/icons";
import { db } from "../Utils/dataStorege.ts";
import { PushpinOutlined, StarOutlined, ShareAltOutlined, DeleteOutlined } from "@ant-design/icons";
import CAPEXPerformance from "./CAPEXPerformance.tsx";
import FDPP from "./FDPP.tsx";
import MineInfra from "./MineInfra.tsx";
import TimelinePerformance from "./TimelinePerformance.tsx";
import CSR from "./CSR.tsx";
import ProjectTimeline from "./ProjectTimeline.tsx";
import ProjectDocs from "./ProjectDocs";
import ProjectStatistics from "./ProjectStatistics.tsx";
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
    const [projectDetails, setProjectDetails] = useState<ProjectData | any>(null);
    const [selectedProjectName, setSelectedProjectName] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<string | null>(null);
    const [addedMembers, setAddedMembers] = useState<string[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<any>(null);

    const tabs = [
        { key: 'projectStatistics', label: 'Project Statistics' },
        { key: 'fdpp', label: 'FDPP' },
        { key: 'project-timeline', label: 'Project Timeline' },
        { key: 'capex', label: 'CAPEX-Performance' },
        { key: 'documents', label: 'Documents' },
        { key: 'csr', label: 'Corporate Social Responsibility' },
        { key: 'mineInfra', label: 'Mine Infra Updated' }
    ];

    const [activeTab, setActiveTab] = useState('fdpp');


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

    const handleProjectClick = (projectName: string) => {
        const selectedProject = allProjects.find(
            (project) => project.projectParameters.projectName === projectName
        );
        if (selectedProject) {
            setProjectDetails(selectedProject);
            setSelectedProjectName(selectedProject.projectParameters.projectName);
            setActiveTab('fdpp');
        }
    };

    const handleSearch = (_event: any) => {
        console.log("searching...");
    };

    const handleAddMember = () => {
        if (selectedMember && !addedMembers.includes(selectedMember)) {
            setAddedMembers([...addedMembers, selectedMember]);
        }
        setIsModalOpen(false);
        setSelectedMember(null);
    };

    const handleDeleteProject = async () => {
        if (!projectToDelete) return;

        try {
            await db.deleteProject(projectToDelete.id);
            const updatedProjects = await db.getProjects();
            setAllProjects(updatedProjects);
            setProjectDetails(updatedProjects.length > 0 ? updatedProjects[0] : null);
            setSelectedProjectName(updatedProjects.length > 0 ? updatedProjects[0]?.projectParameters?.projectName || "" : "");
            message.success("Project removed successfully");
        } catch (error: any) {
            message.error("Error deleting project:", error);
        } finally {
            setIsDeleteModalOpen(false);
        }
    };

    const closeDeleteModal = () => {
        setProjectToDelete(null);
        setIsDeleteModalOpen(false);
    };

    const showDeleteModal = (project: ProjectData) => {
        setProjectToDelete(project);
        setIsDeleteModalOpen(true);
    };

    const pinProject = (project: ProjectData) => {
        console.log("Pin project:", project);
    };

    const markAsFavorite = (project: ProjectData) => {
        console.log("Marked as favorite:", project);
    };

    const shareProject = (project: ProjectData) => {
        const shareableLink = `https://yourapp.com/project/${project}`;
        navigator.clipboard.writeText(shareableLink);
        message.success("Project link copied to clipboard!");
    };

    const menu = (project: ProjectData) => (
        <Menu>
            <Menu.Item key="pin" icon={<PushpinOutlined />} onClick={() => pinProject(project)}>
                Pin to Top
            </Menu.Item>
            <Menu.Item key="favorite" icon={<StarOutlined />} onClick={() => markAsFavorite(project)}>
                Mark as Favorite
            </Menu.Item>
            <Menu.Item key="share" icon={<ShareAltOutlined />} onClick={() => shareProject(project)}>
                Share Project
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="delete" icon={<DeleteOutlined />} danger onClick={() => showDeleteModal(project)}>
                Delete
            </Menu.Item>
        </Menu>
    );

    [
        {
            "key": "module-0",
            "SrNo": "TM",
            "Code": "TM",
            "keyActivity": "Test Module",
            "isModule": true,
            "children": [
                {
                    "key": "activity-0-0",
                    "SrNo": "TM",
                    "Code": "TM/10",
                    "keyActivity": "New Activity 21:42:14",
                    "duration": 1,
                    "preRequisite": "",
                    "slack": "0",
                    "plannedStart": "01-04-2025",
                    "plannedFinish": "02-04-2025",
                    "actualStart": "2025-04-01",
                    "actualFinish": null,
                    "expectedStart": "",
                    "expectedFinish": "",
                    "actualDuration": "",
                    "remarks": "",
                    "isModule": false,
                    "activityStatus": "inProgress",
                    "fin_status": "inProgress"
                },
                {
                    "key": "activity-0-1",
                    "SrNo": "TM",
                    "Code": "TM/20",
                    "keyActivity": "New Activity 21:42:14",
                    "duration": 1,
                    "preRequisite": "TM/10",
                    "slack": "0",
                    "plannedStart": "03-04-2025",
                    "plannedFinish": "04-04-2025",
                    "actualStart": null,
                    "actualFinish": null,
                    "expectedStart": "",
                    "expectedFinish": "",
                    "actualDuration": "",
                    "remarks": "",
                    "isModule": false,
                    "activityStatus": "yetToStart",
                    "fin_status": "yetToStart"
                },
                {
                    "key": "activity-0-2",
                    "SrNo": "TM",
                    "Code": "TM/30",
                    "keyActivity": "New Activity 21:42:14",
                    "duration": 1,
                    "preRequisite": "TM/20",
                    "slack": "0",
                    "plannedStart": "07-04-2025",
                    "plannedFinish": "08-04-2025",
                    "actualStart": null,
                    "actualFinish": null,
                    "expectedStart": "",
                    "expectedFinish": "",
                    "actualDuration": "",
                    "remarks": "",
                    "isModule": false,
                    "activityStatus": "yetToStart",
                    "fin_status": "yetToStart"
                },
                {
                    "key": "activity-0-3",
                    "SrNo": "TM",
                    "Code": "TM/40",
                    "keyActivity": "New Activity 21:42:14",
                    "duration": 1,
                    "preRequisite": "TM/30",
                    "slack": "0",
                    "plannedStart": "09-04-2025",
                    "plannedFinish": "10-04-2025",
                    "actualStart": null,
                    "actualFinish": null,
                    "expectedStart": "",
                    "expectedFinish": "",
                    "actualDuration": "",
                    "remarks": "",
                    "isModule": false,
                    "activityStatus": "yetToStart",
                    "fin_status": "yetToStart"
                },
                {
                    "key": "activity-0-4",
                    "SrNo": "TM",
                    "Code": "TM/50",
                    "keyActivity": "New Activity 21:42:14",
                    "duration": 1,
                    "preRequisite": "TM/40",
                    "slack": "0",
                    "plannedStart": "11-04-2025",
                    "plannedFinish": "14-04-2025",
                    "actualStart": null,
                    "actualFinish": null,
                    "expectedStart": "",
                    "expectedFinish": "",
                    "actualDuration": "",
                    "remarks": "",
                    "isModule": false,
                    "activityStatus": "yetToStart",
                    "fin_status": "yetToStart"
                },
                {
                    "key": "activity-0-5",
                    "SrNo": "TM",
                    "Code": "TM/60",
                    "keyActivity": "New Activity 21:42:14",
                    "duration": 1,
                    "preRequisite": "TM/50",
                    "slack": "0",
                    "plannedStart": "15-04-2025",
                    "plannedFinish": "16-04-2025",
                    "actualStart": null,
                    "actualFinish": null,
                    "expectedStart": "",
                    "expectedFinish": "",
                    "actualDuration": "",
                    "remarks": "",
                    "isModule": false,
                    "activityStatus": "yetToStart",
                    "fin_status": "yetToStart"
                },
                {
                    "key": "activity-0-6",
                    "SrNo": "TM",
                    "Code": "TM/70",
                    "keyActivity": "New Activity 21:42:15",
                    "duration": 1,
                    "preRequisite": "TM/60",
                    "slack": "0",
                    "plannedStart": "17-04-2025",
                    "plannedFinish": "18-04-2025",
                    "actualStart": null,
                    "actualFinish": null,
                    "expectedStart": "",
                    "expectedFinish": "",
                    "actualDuration": "",
                    "remarks": "",
                    "isModule": false,
                    "activityStatus": "yetToStart",
                    "fin_status": "yetToStart"
                },
                {
                    "key": "activity-0-7",
                    "SrNo": "TM",
                    "Code": "TM/80",
                    "keyActivity": "New Activity 21:42:15",
                    "duration": 1,
                    "preRequisite": "TM/70",
                    "slack": "0",
                    "plannedStart": "21-04-2025",
                    "plannedFinish": "22-04-2025",
                    "actualStart": null,
                    "actualFinish": null,
                    "expectedStart": "",
                    "expectedFinish": "",
                    "actualDuration": "",
                    "remarks": "",
                    "isModule": false,
                    "activityStatus": "yetToStart",
                    "fin_status": "yetToStart"
                }
            ]
        },
        {
            "key": "module-1",
            "SrNo": "T2",
            "Code": "T2",
            "keyActivity": "Test 2",
            "isModule": true,
            "children": [
                {
                    "key": "activity-1-0",
                    "SrNo": "T2",
                    "Code": "T2/10",
                    "keyActivity": "New Activity 21:42:37",
                    "duration": 1,
                    "preRequisite": "",
                    "slack": "0",
                    "plannedStart": "01-05-2025",
                    "plannedFinish": "02-05-2025",
                    "actualStart": "2025-04-01",
                    "actualFinish": "2025-04-30",
                    "expectedStart": "",
                    "expectedFinish": "",
                    "actualDuration": "",
                    "remarks": "",
                    "isModule": false,
                    "activityStatus": "completed",
                    "fin_status": "completed"
                },
                {
                    "key": "activity-1-1",
                    "SrNo": "T2",
                    "Code": "T2/20",
                    "keyActivity": "New Activity 21:42:37",
                    "duration": 1,
                    "preRequisite": "T2/10",
                    "slack": "0",
                    "plannedStart": "05-05-2025",
                    "plannedFinish": "06-05-2025",
                    "actualStart": null,
                    "actualFinish": null,
                    "expectedStart": "",
                    "expectedFinish": "",
                    "actualDuration": "",
                    "remarks": "",
                    "isModule": false,
                    "activityStatus": "yetToStart",
                    "fin_status": "yetToStart"
                },
                {
                    "key": "activity-1-2",
                    "SrNo": "T2",
                    "Code": "T2/30",
                    "keyActivity": "New Activity 21:42:37",
                    "duration": 1,
                    "preRequisite": "T2/20",
                    "slack": "0",
                    "plannedStart": "07-05-2025",
                    "plannedFinish": "08-05-2025",
                    "actualStart": null,
                    "actualFinish": null,
                    "expectedStart": "",
                    "expectedFinish": "",
                    "actualDuration": "",
                    "remarks": "",
                    "isModule": false,
                    "activityStatus": "yetToStart",
                    "fin_status": "yetToStart"
                },
                {
                    "key": "activity-1-3",
                    "SrNo": "T2",
                    "Code": "T2/40",
                    "keyActivity": "New Activity 21:42:38",
                    "duration": 1,
                    "preRequisite": "T2/30",
                    "slack": "0",
                    "plannedStart": "09-05-2025",
                    "plannedFinish": "12-05-2025",
                    "actualStart": null,
                    "actualFinish": null,
                    "expectedStart": "",
                    "expectedFinish": "",
                    "actualDuration": "",
                    "remarks": "",
                    "isModule": false,
                    "activityStatus": "yetToStart",
                    "fin_status": "yetToStart"
                },
                {
                    "key": "activity-1-4",
                    "SrNo": "T2",
                    "Code": "T2/50",
                    "keyActivity": "New Activity 21:42:38",
                    "duration": 1,
                    "preRequisite": "T2/40",
                    "slack": "0",
                    "plannedStart": "13-05-2025",
                    "plannedFinish": "14-05-2025",
                    "actualStart": null,
                    "actualFinish": null,
                    "expectedStart": "",
                    "expectedFinish": "",
                    "actualDuration": "",
                    "remarks": "",
                    "isModule": false,
                    "activityStatus": "yetToStart",
                    "fin_status": "yetToStart"
                },
                {
                    "key": "activity-1-5",
                    "SrNo": "T2",
                    "Code": "T2/60",
                    "keyActivity": "New Activity 21:42:38",
                    "duration": 1,
                    "preRequisite": "T2/50",
                    "slack": "0",
                    "plannedStart": "15-05-2025",
                    "plannedFinish": "16-05-2025",
                    "actualStart": null,
                    "actualFinish": null,
                    "expectedStart": "",
                    "expectedFinish": "",
                    "actualDuration": "",
                    "remarks": "",
                    "isModule": false,
                    "activityStatus": "yetToStart",
                    "fin_status": "yetToStart"
                },
                {
                    "key": "activity-1-6",
                    "SrNo": "T2",
                    "Code": "T2/70",
                    "keyActivity": "New Activity 21:42:38",
                    "duration": 1,
                    "preRequisite": "T2/60",
                    "slack": "0",
                    "plannedStart": "19-05-2025",
                    "plannedFinish": "20-05-2025",
                    "actualStart": null,
                    "actualFinish": null,
                    "expectedStart": "",
                    "expectedFinish": "",
                    "actualDuration": "",
                    "remarks": "",
                    "isModule": false,
                    "activityStatus": "yetToStart",
                    "fin_status": "yetToStart"
                }
            ]
        }
    ]

    const renderTabContent = () => {
        switch (activeTab) {
            case 'projectStatistics':
                return <ProjectStatistics code={projectDetails.id} />;
            case 'fdpp':
                return <FDPP code={projectDetails.id} />;
            case 'project-timeline':
                return <ProjectTimeline code={projectDetails.id} />;
            case 'timeline':
                return <TimelinePerformance />;
            case 'capex':
                return <CAPEXPerformance />;
            case 'documents':
                return <ProjectDocs />;
            case 'csr':
                return <CSR />;
            case 'mineInfra':
                return <MineInfra />;
            default:
                return <div>Select a tab to see content</div>;
        }
    };

    return (
        <>
            <div className="project-container">
                <div className="all-project-details">
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div className="heading">Projects</div>
                        <Button size="small" style={{ backgroundColor: '#44bd32', color: '#fff' }} icon={<RobotOutlined />}>
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
                            <div className="project-info-block">
                                <div className="project-title">{project.projectParameters.projectName}</div>
                                <div className="project-meta">
                                    <span className="desc">{project.projectParameters.description || "No description available."}</span>

                                    <div className="date-range">
                                        <span className="date-label">📅</span>
                                        <span className="date-value">
                                            {project.startDate || "2024-03-01"} → {project.endDate || "2024-09-30"}
                                        </span>
                                    </div>

                                    <div className="meta-row">
                                        <span className="meta-item">👥 {project.members?.length || 0} members</span>
                                        <span className={`status-badge ${project.status === "Active" ? "active" : "inactive"}`}>
                                            {project.status || "Unknown"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Dropdown overlay={menu(project)} trigger={["hover"]}>
                                <MoreOutlined className="three-dot-menu" />
                            </Dropdown>
                        </div>
                    ))}
                </div>
                <section className="project-info">
                    <div className="base-details">
                        <div className="">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    className={`tab-button ${activeTab === tab.key ? "active" : ""}`}
                                    onClick={() => setActiveTab(tab.key)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="details-paremeters">
                        <div className="info-item">
                            <div className="tab-container">
                                <div className="tab-content">
                                    {renderTabContent()}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <Modal
                title="Select Member"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
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
