import { useEffect, useState } from "react";
import "../styles/projects.css";
import { Form, Input, Row, Col } from 'antd';
import { useLocation } from "react-router-dom";
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

const Projects = () => {
    const location = useLocation();
    const projectData: any = location.state as ProjectData | undefined;
    const [projectDetails, setProjectDetails] = useState<ProjectData | null>(null);

    useEffect(() => {
        if (!projectData?.view) return;
        try {
            const projectNameToFind = projectData.projectName;
            const storedData = localStorage.getItem("projects");
            if (!storedData) {
                console.warn("No data found in localStorage.");
                return;
            }

            let parsedData: ProjectData[];
            try {
                parsedData = JSON.parse(storedData);
            } catch (error) {
                console.error("Error parsing localStorage data:", error);
                return;
            }

            if (!Array.isArray(parsedData)) {
                console.error("Invalid data format: Expected an array.");
                return;
            }

            const filteredProject = parsedData.find(
                (project) => project.projectParameters.projectName === projectNameToFind
            );

            if (!filteredProject) {
                console.warn(`Project with name "${projectNameToFind}" not found.`);
                return;
            }

            setProjectDetails(filteredProject);
        } catch (error) {
            console.error("An unexpected error occurred:", error);
        }
    }, [projectData]);


    if (!projectDetails) {
        return <div>Loading...</div>;
    }

    const { projectParameters, locations, contractualDetails, initialStatus } = projectDetails;

    return (
        <>
            <div className="project-header">
                <span className="project-title">{projectParameters.projectName}</span>
                <span className="project-sub-title">{projectParameters.companyName}</span>
            </div>

            <div className="project-container">
                <section className="project-info">
                    <div className="info-item">
                        <h4>Project Parameters</h4>
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
                        <h4>Location Details</h4>
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
                        <h4>Contractual Details</h4>
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
                        <h4>Initial Status</h4>
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
                </section>
            </div>
        </>
    );
};

export default Projects;
