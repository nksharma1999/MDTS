import { useEffect, useState } from "react";
import "../styles/status-update.css";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { FolderOpenOutlined } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Button, Select, Modal, Input, message, Table } from "antd";
import { DownloadOutlined, EditOutlined, ShareAltOutlined } from "@ant-design/icons";
import eventBus from "../Utils/EventEmitter";
interface Activity {
  code: string;
  activityName: string;
  prerequisite: string;
  slack: string;
  level: string;
  duration: number;
  start: string | null;
  end: string | null;
  activityStatus: string | null;
}

interface Module {
  parentModuleCode: string;
  moduleName: string;
  activities: Activity[];
}

const { Option } = Select;

export const StatusUpdate = () => {
  const [expandedKeys, setExpandedKeys] = useState<any>([]);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [sequencedModules, setSequencedModules] = useState<Module[]>([]);
  const [dataSource, setDataSource] = useState<any>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEmail("");
  };

  useEffect(() => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = loggedInUser?.id;
      if (!userId) return;

      const userProjectsKey = `projects_${userId}`;
      const storedData = JSON.parse(localStorage.getItem(userProjectsKey) || "[]").filter((item: any) => item.projectTimeline != undefined);

      if (!Array.isArray(storedData) || storedData.length === 0) {
        setAllProjects([]);
        return;
      }

      setAllProjects(storedData);

      if (storedData.length === 1) {
        const firstProject = storedData[0];

        if (firstProject?.id) {
          setSelectedProjectId(firstProject.id);
          setSelectedProject(firstProject);

          if (firstProject?.projectTimeline && Array.isArray(firstProject.projectTimeline)) {
            handleLibraryChange(firstProject.projectTimeline);
          } else if (firstProject?.initialStatus?.items && Array.isArray(firstProject.initialStatus.items)) {
            handleLibraryChange(firstProject.initialStatus.items.filter(
              (item: any) => item?.status?.toLowerCase() !== "completed"
            ));
          } else {
            handleLibraryChange([]);
          }
        }
      }
    } catch (error) {
      console.error("An unexpected error occurred while fetching projects:", error);
    }
  }, []);

  useEffect(() => {
    if (location.state && location.state.currentProject) {
      const selectedActiveProject = location.state.currentProject;
      if (selectedActiveProject?.id) {
        setSelectedProjectId(selectedActiveProject.id);
        setSelectedProject(selectedActiveProject);
        if (selectedActiveProject?.projectTimeline && Array.isArray(selectedActiveProject.projectTimeline)) {
          handleLibraryChange(selectedActiveProject.projectTimeline);
        } else if (selectedActiveProject?.initialStatus?.items && Array.isArray(selectedActiveProject.initialStatus.items)) {
          handleLibraryChange(selectedActiveProject.initialStatus.items.filter(
            (item: any) => item?.status?.toLowerCase() !== "completed"
          ));
        }
      }
      setTimeout(() => navigate(".", { replace: true }), 0);
    }
  }, [location.state]);

  const handleProjectChange = (projectId: any) => {
    setSelectedProjectId(projectId);
    const project = allProjects.find((p) => p.id === projectId);
    setSelectedProject(project);

    if (project?.projectTimeline) {
      handleLibraryChange(project?.projectTimeline);
    } else {
      handleLibraryChange([]);
    }
  };

  const handleLibraryChange = (libraryItems: any) => {
    if (libraryItems) {
      setSequencedModules(libraryItems);
      const finDataSource = libraryItems.map((module: any, moduleIndex: number) => {
        return {
          key: `module-${moduleIndex}`,
          SrNo: module.parentModuleCode,
          Code: module.parentModuleCode,
          keyActivity: module.moduleName,
          isModule: true,
          children: (module.activities || []).map((activity: any, actIndex: number) => ({
            key: `activity-${moduleIndex}-${actIndex}`,
            SrNo: module.parentModuleCode,
            Code: activity.code,
            keyActivity: activity.activityName,
            duration: activity.duration ?? "",
            preRequisite: activity.prerequisite ?? "-",
            slack: activity.slack ?? "0",
            plannedStart: activity.start ? dayjs(activity.start).format("DD-MM-YYYY") : "-",
            plannedFinish: activity.end ? dayjs(activity.end).format("DD-MM-YYYY") : "-",
            actualStart: "",
            actualFinish: "",
            actualDuration: "",
            remarks: "",
            expectedStart: "",
            expectedFinish: "",
            isModule: false,
            activityStatus: activity.activityStatus || "Pending",
          })),
        };
      });

      setDataSource(finDataSource);
      setExpandedKeys(finDataSource.map((_: any, index: any) => `module-${index}`));
    } else {
      setSequencedModules([]);
      setDataSource([]);
    }
  };

  const finalColumns: ColumnsType = [
    { title: "Sr No", dataIndex: "Code", key: "Code", width: 100, align: "center" },
    { title: "Key Activity", dataIndex: "keyActivity", key: "keyActivity", width: 250, align: "left" },
    { title: "Duration", dataIndex: "duration", key: "duration", width: 80, align: "center" },
    { title: "Pre-Requisite", dataIndex: "preRequisite", key: "preRequisite", width: 120, align: "center" },
    { title: "Slack", dataIndex: "slack", key: "slack", width: 80, align: "center" },
    { title: "Planned Start", dataIndex: "plannedStart", key: "plannedStart", width: 120, align: "center" },
    { title: "Planned Finish", dataIndex: "plannedFinish", key: "plannedFinish", width: 120, align: "center" }
  ];

  const handleDownload = async () => {
    const workbook: any = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Activities");

    const globalHeader = [
      "Sr No.",
      "Key Activity",
      "Duration",
      "Pre-Requisite",
      "Slack",
      "Planned Start",
      "Planned Finish"
    ];
    const headerRow = worksheet.addRow(globalHeader);

    headerRow.eachCell((cell: any) => {
      cell.font = { bold: true, size: 14, color: { argb: "FFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "258790" },
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
      };
    });

    worksheet.getRow(1).height = 30;

    const moduleHeaderStyle = {
      font: { bold: true, size: 14, color: { argb: "000000" } },
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "DDDDDD" },
      },
      alignment: { horizontal: "left", vertical: "middle" },
    };

    const activityRowStyle = {
      font: { size: 11 },
      alignment: { horizontal: "left", vertical: "middle" },
    };

    sequencedModules.forEach((module) => {
      const moduleHeaderRow = worksheet.addRow([
        module.parentModuleCode,
        module.moduleName,
        "",
        "",
        "",
        "",
        "",
        "",
      ]);

      moduleHeaderRow.eachCell((cell: any) => {
        cell.font = moduleHeaderStyle.font;
        cell.fill = moduleHeaderStyle.fill;
        cell.alignment = moduleHeaderStyle.alignment;
      });

      module.activities.forEach((activity) => {
        const row = worksheet.addRow([
          activity.code,
          activity.activityName,
          activity.duration || 0,
          activity.prerequisite,
          activity.slack || 0,
          activity.start ? dayjs(activity.start).format("DD-MM-YYYY") : "-",
          activity.end ? dayjs(activity.end).format("DD-MM-YYYY") : "-",
        ]);

        row.eachCell((cell: any) => {
          cell.font = activityRowStyle.font;
          cell.alignment = activityRowStyle.alignment;
        });
      });

      worksheet.addRow([]);
    });

    worksheet.columns = [
      { width: 20 },
      { width: 30 },
      { width: 15 },
      { width: 30 },
      { width: 15 },
      { width: 25 },
      { width: 25 },
      { width: 30 },
    ];

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${selectedProject?.projectParameters.projectName}.xlsx`);
    message.success("Download started!");
  };

  const editTimeBuilder = () => {
    eventBus.emit("updateTab", "/create/timeline-builder");
    navigate("/create/timeline-builder", { state: { selectedProject: selectedProject } });
  };

  const handleShare = () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      message.error("Please enter a valid email address.");
      return;
    }
    message.success(`Shared to ${email}`);
    setIsModalOpen(false);
    setEmail("");
  };

  return (
    <>
      <div className="status-heading">
        <p>Project Timeline</p>
      </div>

      <div className="main-status-update">
        <div className="status-toolbar">
          <div className="filters">
            <label htmlFor="" style={{ fontWeight: "bold", marginTop: "3px", width: "100%" }}>Select Project</label>
            <Select
              placeholder="Select Project"
              value={selectedProjectId}
              onChange={handleProjectChange}
              dropdownMatchSelectWidth={false}
              style={{ width: "100%" }}
            >
              {allProjects.map((project) => (
                <Option key={project.id} value={project.id}>
                  {project.projectParameters.projectName}
                </Option>
              ))}
            </Select>
          </div>
          <div className="actions">
            <Button
              type="primary"
              disabled={!selectedProjectId}
              icon={<DownloadOutlined />}
              onClick={handleDownload}
              style={{ marginLeft: "15px", backgroundColor: "grey", borderColor: "#4CAF50" }}
            >
              Download Timeline
            </Button>
            <Button
              type="primary"
              disabled={!selectedProjectId}
              icon={<EditOutlined />}
              onClick={editTimeBuilder}
              style={{ marginLeft: "15px", backgroundColor: "#D35400", borderColor: "#FF9800" }}
            >
              Edit Timeline
            </Button>
            <Button
              type="primary"
              className="bg-secondary"
              disabled={!selectedProjectId}
              icon={<ShareAltOutlined />}
              onClick={showModal}
              style={{ marginLeft: "15px", backgroundColor: "#4169E1", borderColor: "#007BFF" }}
            >
              Share
            </Button>
          </div>
        </div>
        <hr />
        {selectedProject != null ? (
          <div className="status-update-items">
            <div style={{ overflowX: "hidden" }}>
              <Table
                columns={finalColumns}
                dataSource={dataSource}
                className="project-timeline-table"
                pagination={false}
                expandable={{
                  expandedRowRender: () => null,
                  rowExpandable: (record) => record.children && record.children.length > 0,
                  expandedRowKeys: expandedKeys,
                  onExpand: (expanded, record) => {
                    setExpandedKeys(
                      expanded
                        ? [...expandedKeys, record.key]
                        : expandedKeys.filter((key: any) => key !== record.key)
                    );
                  },
                }}
                rowClassName={(record) => (record.isModule ? "module-header" : "activity-row")}
                bordered
                scroll={{
                  x: "max-content",
                  y: "calc(100vh - 252px)",
                }}
              />
            </div>
          </div>
        ) : (
          <div className="container-msg">
            <div className="no-project-message">
              <FolderOpenOutlined style={{ fontSize: "50px", color: "grey" }} />
              {allProjects.length === 0 ? (
                <>
                  <h3>No Projects Found</h3>
                  <p>You need to create a project for defining a timeline.</p>
                  <button onClick={() => {
                    eventBus.emit("updateTab", "/create/register-new-project");
                    navigate("/create/register-new-project");
                  }}>Create Project</button>
                </>
              ) : (
                <>
                  <h3>No Project Selected</h3>
                  <p>Please select a project to continue.</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <Modal
        title="Share Timeline"
        visible={isModalOpen}
        onCancel={handleCancel}
        onOk={handleShare}
        okText="Send"
        className="modal-container"
        okButtonProps={{ className: "bg-secondary" }}
      >
        <div style={{ padding: "0px 10px", fontWeight: "400", fontSize: "16px" }}>
          <span>Enter recipient's email:</span>
          <Input
            style={{ marginTop: "10px" }}
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </Modal>

    </>
  );
};

export default StatusUpdate;