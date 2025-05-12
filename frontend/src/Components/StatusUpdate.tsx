import { useEffect, useMemo, useState } from "react";
import "../styles/status-update.css";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { FolderOpenOutlined, SaveOutlined } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Button, Select, Modal, Input, message, Table, DatePicker, List, Typography } from "antd";
import { ClockCircleOutlined, DownloadOutlined, EditOutlined, FileTextOutlined, FormOutlined, LikeOutlined, ReloadOutlined, ShareAltOutlined, SyncOutlined } from "@ant-design/icons";
import eventBus from "../Utils/EventEmitter";
import { db } from "../Utils/dataStorege.ts";
import { getCurrentUser } from '../Utils/moduleStorage';
import TextArea from "antd/es/input/TextArea";
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
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedKeys, setExpandedKeys] = useState<any>([]);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [sequencedModules, setSequencedModules] = useState<Module[]>([]);
  const [dataSource, setDataSource] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProjectTimeline, setSelectedProjectTimeline] = useState<any>([]);
  const [selectedVersionId, setSelectedVersionId] = useState(null);
  const [allVersions, setAllVersions] = useState<any>();
  const [isReviseModalOpen, setIsReviseModalOpen] = useState(false);
  const [reviseRemarks, setReviseRemarks] = useState("");
  const [selectedActivityKey, setSelectedActivityKey] = useState<string | null>(null);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [noteInput, setNoteInput] = useState('');
  const [editNoteId, setEditNoteId] = useState<string | null>(null);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEmail("");
  };

  useEffect(() => {
    defaultSetup();
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

  const getProjectTimeline = async (project: any) => {
    if (Array.isArray(project?.projectTimeline)) {
      try {
        const latestVersionId = localStorage.getItem("latestProjectVersion");
        const foundTimeline = project?.projectTimeline.filter((item: any) => item.version == latestVersionId);
        const timelineId = !latestVersionId ? project.projectTimeline[0].timelineId : foundTimeline[0].timelineId;
        const timeline = await db.getProjectTimelineById(timelineId);
        const finTimeline = timeline.map(({ id, ...rest }: any) => rest);
        return finTimeline;
      } catch (err) {
        console.error("Error fetching timeline:", err);
        return [];
      }
    }

    if (Array.isArray(project?.initialStatus?.items)) {
      return project.initialStatus.items.filter(
        (item: any) => item?.status?.toLowerCase() !== "completed"
      );
    }

    return [];
  };

  const defaultSetup = async () => {
    try {
      const storedData = (await db.getProjects()).filter((p) => p.projectTimeline);
      setAllProjects(storedData);

      let selectedProject = null;
      const lastVisitedProjectId = localStorage.getItem("selectedProjectId");

      if (storedData.length === 1) {
        selectedProject = storedData[0];
      } else if (lastVisitedProjectId) {
        selectedProject = storedData.find((p) => p.id == lastVisitedProjectId) || null;
      }

      if (selectedProject) {
        setSelectedProjectId(selectedProject.id);
        setSelectedProject(selectedProject);

        const timelineData = await getProjectTimeline(selectedProject);
        handleLibraryChange(timelineData);
      } else {
        handleLibraryChange([]);
      }

      const projectTimeline = selectedProject?.projectTimeline || [];
      const latestVersionId = localStorage.getItem("latestProjectVersion");

      const extractedTimelines = projectTimeline.map((version: any) => ({
        versionId: version.timelineId,
        version: version.version,
        status: version.status,
        addedBy: version.addedBy,
        addedUserEmail: version.addedUserEmail,
        currentStatus: version.currentStatus ? version.currentStatus : '',
        createdAt: version.createdAt || new Date().toISOString(),
        updatedAt: version.updatedAt || new Date().toISOString(),
      }));

      setAllVersions(extractedTimelines);
      if (extractedTimelines.length > 0) {
        const selectedTimeline = latestVersionId
          ? extractedTimelines.find((timeline: any) => timeline.version == latestVersionId) || extractedTimelines[0]
          : extractedTimelines[0];

        setSelectedVersionId(latestVersionId ?? extractedTimelines[0].versionId);
        setSelectedProjectTimeline(selectedTimeline);
      } else {
        console.warn("No project timeline data available.");
      }
    } catch (error) {
      console.error("An unexpected error occurred while fetching projects:", error);
    }
  };

  const handleProjectChange = async (projectId: any) => {
    setSelectedProjectId(projectId);
    const project = allProjects.find((p) => p.id === projectId);
    localStorage.setItem('selectedProjectId', projectId);
    setSelectedProjectTimeline(project.projectTimeline[0]);
    defaultSetup();
    const timelineId = project.projectTimeline[0].timelineId;
    const timeline = await db.getProjectTimelineById(timelineId);
    const finTimeline = timeline.map(({ id, ...rest }: any) => rest);
    setSelectedProject(project);
    if (project?.projectTimeline) {
      handleLibraryChange(finTimeline);
    } else {
      handleLibraryChange([]);
    }
  };

  const handleDownload = async () => {
    const workbook: any = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Project Report");
    const currentUser = getCurrentUser();
    const titleStyle = {
      font: { bold: true, size: 16, color: { argb: "004d99" } },
      alignment: { horizontal: "center", vertical: "middle" },
    };

    const subtitleStyle = {
      font: { bold: true, size: 12, color: { argb: "333333" } },
      alignment: { horizontal: "center", vertical: "middle" },
    };

    const tableHeaderStyle = {
      font: { bold: true, size: 12, color: { argb: "FFFFFF" } },
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "258790" } },
      alignment: { horizontal: "center", vertical: "middle" },
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      },
    };

    const moduleHeaderStyle = {
      font: { bold: true, size: 12, color: { argb: "000000" } },
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "DDDDDD" } },
      alignment: { horizontal: "left", vertical: "middle" },
    };

    const dataRowStyle = {
      font: { size: 11 },
      alignment: { horizontal: "left", vertical: "middle" },
      border: { top: { style: "thin" }, bottom: { style: "thin" } },
    };

    worksheet.mergeCells("B1:G1");
    const projectTitle = worksheet.getCell("B1");
    projectTitle.value = `Project Report: ${selectedProject?.projectParameters.projectName}`;
    projectTitle.font = titleStyle.font;
    projectTitle.alignment = titleStyle.alignment;

    worksheet.mergeCells("B2:G2");
    const companyTitle = worksheet.getCell("B2");
    companyTitle.value = `Company: ${currentUser.company}`;
    companyTitle.font = subtitleStyle.font;
    companyTitle.alignment = subtitleStyle.alignment;

    worksheet.mergeCells("B3:G3");
    const timestamp = worksheet.getCell("B3");
    timestamp.value = `Generated On: ${dayjs().format("DD-MM-YYYY HH:mm:ss")}`;
    timestamp.font = { italic: true, size: 12, color: { argb: "555555" } };
    timestamp.alignment = subtitleStyle.alignment;

    worksheet.addRow([]);

    const globalHeader = [
      "Sr No.",
      "Key Activity",
      "Duration (Days)",
      "Pre-Requisite",
      "Slack",
      "Planned Start",
      "Planned Finish",
    ];
    const headerRow = worksheet.addRow(globalHeader);

    headerRow.eachCell((cell: any) => {
      Object.assign(cell, tableHeaderStyle);
    });

    worksheet.getRow(5).height = 25;
    let rowIndex = 6;
    sequencedModules.forEach((module, moduleIndex) => {
      const moduleHeaderRow = worksheet.addRow([
        `Module: ${module.parentModuleCode}`,
        module.moduleName,
        "",
        "",
        "",
        "",
        "",
      ]);

      moduleHeaderRow.eachCell((cell: any) => {
        Object.assign(cell, moduleHeaderStyle);
      });

      rowIndex++;
      module.activities.forEach((activity, activityIndex) => {
        const row = worksheet.addRow([
          `${moduleIndex + 1}.${activityIndex + 1}`,
          activity.activityName,
          activity.duration || 0,
          activity.prerequisite,
          activity.slack || 0,
          activity.start ? dayjs(activity.start).format("DD-MM-YYYY") : "-",
          activity.end ? dayjs(activity.end).format("DD-MM-YYYY") : "-",
        ]);

        row.eachCell((cell: any) => {
          Object.assign(cell, dataRowStyle);
        });
        if (activityIndex % 2 === 0) {
          row.eachCell((cell: any) => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "F7F7F7" },
            };
          });
        }
        rowIndex++;
      });

      worksheet.addRow([]);
      rowIndex++;
    });

    worksheet.columns = [
      { width: 10 },
      { width: 35 },
      { width: 18 },
      { width: 30 },
      { width: 15 },
      { width: 20 },
      { width: 20 },
    ];

    worksheet.mergeCells(`B${rowIndex + 2}:G${rowIndex + 2}`);
    const createdByRow = worksheet.getCell(`B${rowIndex + 2}`);
    createdByRow.value = `Created by: ${currentUser.name || ""}`;
    createdByRow.font = { italic: true, size: 12, color: { argb: "777777" } };
    createdByRow.alignment = { horizontal: "right", vertical: "middle" };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${selectedProject?.projectParameters.projectName}.xlsx`);
    message.success("Download started!");
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

  const handleApproveTimeline = async () => {
    const updatedProjectTimeline = selectedProject.projectTimeline.map((timeline: any) => {
      if (timeline.timelineId === selectedProjectTimeline.versionId || selectedProjectTimeline.timelineId) {
        return { ...timeline, status: "Approved" };
      }
      return timeline;
    });

    const updatedSelectedProject = {
      ...selectedProject,
      projectTimeline: updatedProjectTimeline,
    };
    await db.updateProject(selectedProjectId, updatedSelectedProject);
    message.success("Timeline approved successfully");
    setIsApproveModalOpen(false);
    defaultSetup();
  };

  const isPreReqCompleted = (preRequisiteCode: string, allData: any[]): boolean => {
    let isCompleted = false;

    const findActivityByCode = (data: any[]): any => {
      for (const item of data) {
        if (item.children && item.children.length > 0) {
          const found = findActivityByCode(item.children);
          if (found) return found;
        } else if (item.Code === preRequisiteCode) {
          return item;
        }
      }
      return null;
    };

    if (!preRequisiteCode) return true;

    const preReqActivity = findActivityByCode(allData);
    isCompleted = preReqActivity?.activityStatus === 'completed';

    return isCompleted;
  };

  const handleLibraryChange = (libraryItems: any) => {
    if (libraryItems) {
      setSequencedModules(libraryItems);
      let editingRequired = false;
      const finDataSource = libraryItems.map((module: any, moduleIndex: number) => {
        const children = (module.activities || []).map((activity: any, actIndex: number) => {
          if (activity.activityStatus === "completed" || activity.activityStatus === "inProgress") {
            editingRequired = true;
          }

          return {
            key: `activity-${moduleIndex}-${actIndex}`,
            SrNo: module.parentModuleCode,
            Code: activity.code,
            keyActivity: activity.activityName,
            duration: activity.duration ?? "",
            preRequisite: activity.prerequisite ?? "-",
            slack: activity.slack ?? "0",
            plannedStart: activity.start ? dayjs(activity.start).format("DD-MM-YYYY") : "-",
            plannedFinish: activity.end ? dayjs(activity.end).format("DD-MM-YYYY") : "-",
            actualStart: activity.actualStart || null,
            actualFinish: activity.actualFinish || null,
            expectedStart: activity.expectedStart ? dayjs(activity.expectedStart).format("DD-MM-YYYY") : "",
            expectedFinish: activity.expectedFinish ? dayjs(activity.expectedFinish).format("DD-MM-YYYY") : "",
            actualDuration: activity.actualDuration ?? "",
            remarks: activity.remarks ?? "",
            isModule: false,
            activityStatus: activity.activityStatus || "yetToStart",
            fin_status: activity.fin_status || ''
          };
        });

        return {
          key: `module-${moduleIndex}`,
          SrNo: module.parentModuleCode,
          Code: module.parentModuleCode,
          keyActivity: module.moduleName,
          isModule: true,
          children,
        };
      });
      setDataSource(finDataSource);
      setExpandedKeys(finDataSource.map((_: any, index: any) => `module-${index}`));
      if (editingRequired) {
        setIsEditing(true);
      } else {
        setIsEditing(false);
      }
    } else {
      setSequencedModules([]);
      setDataSource([]);
      setIsEditing(false);
    }
  };

  const editTimeBuilder = () => {
    eventBus.emit("updateTab", "/create/timeline-builder");
    navigate("/create/timeline-builder", { state: { selectedProject: selectedProject, selectedTimeline: selectedProjectTimeline } });
  };

  const rePlanTimeline = () => {
    eventBus.emit("updateTab", "/create/timeline-builder");
    navigate("/create/timeline-builder", { state: { selectedProject: selectedProject, selectedTimeline: selectedProjectTimeline, rePlanTimeline: true } });
  };

  const renderStatusSelect = (
    status: string,
    recordKey: string,
    fin_status: string,
    disabled: boolean = false
  ) => {
    return (
      <Select
        value={status}
        onChange={(value) => handleFieldChange(value, recordKey, "activityStatus")}
        options={[
          { label: "Yet to Start", value: "yetToStart" },
          { label: "In Progress", value: "inProgress" },
          { label: "Completed", value: "completed" },
        ]}
        disabled={disabled || fin_status === "completed"}
        className={`status-select ${status}`}
        style={{ width: "100%", fontWeight: "bold" }}
      />
    );
  };

  const getWorkingDaysDiff = (start: dayjs.Dayjs, end: dayjs.Dayjs): number => {
    let count = 0;
    let current = start.clone();
    while (current.isBefore(end, 'day') || current.isSame(end, 'day')) {
      const day = current.day();
      if (day !== 0 && day !== 6) {
        count++;
      }
      current = current.add(1, 'day');
    }
    return count - 1;
  };

  const baseColumns: ColumnsType = [
    { title: "Sr No", dataIndex: "Code", key: "Code", width: 100, align: "center" },
    {
      title: "Key Activity",
      dataIndex: "keyActivity",
      key: "keyActivity",
      width: 250,
      align: "left",
      render: (_, record) => {
        const {
          activityStatus, keyActivity, duration, actualStart, actualFinish, plannedStart, plannedFinish, remarks
        } = record;

        const plannedStartDate = plannedStart ? dayjs(plannedStart, 'DD-MM-YYYY') : null;
        const actualStartDate = actualStart ? dayjs(actualStart, 'DD-MM-YYYY') : null;
        const plannedFinishDate = plannedFinish ? dayjs(plannedFinish, 'DD-MM-YYYY') : null;
        const actualFinishDate = actualFinish ? dayjs(actualFinish, 'DD-MM-YYYY') : null;

        let iconSrc = '';
        const isStartSame = plannedStartDate && actualStartDate && plannedStartDate.isSame(actualStartDate, 'day');
        const isFinishSame = plannedFinishDate && actualFinishDate && plannedFinishDate.isSame(actualFinishDate, 'day');
        const isWithinPlannedDuration =
          plannedStartDate && plannedFinishDate && actualStartDate &&
          getBusinessDays(actualStartDate, dayjs()) <= getBusinessDays(plannedStartDate, plannedFinishDate);

        if (activityStatus === 'completed') {
          const isCompletedOnTime = isStartSame && isFinishSame;
          iconSrc = isCompletedOnTime ? '/images/icons/completed.png' : '/images/icons/overdue.png';
        } else if (activityStatus === 'inProgress') {
          iconSrc = isWithinPlannedDuration ? '/images/icons/inprogress.png' : '/images/icons/overdue.png';
        } else {
          iconSrc = '/images/icons/yettostart.png';
        }

        return (
          <span
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            onClick={() => {
              setSelectedActivityKey(record.key)
            }
            }
          >
            {record.notes?.length > 0 && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedActivityKey(record.key);
                  setNoteModalVisible(true);
                  setNoteInput('');
                  setEditNoteId(null);
                }}
              >
                <FileTextOutlined style={{ fontSize: 22, color: '#1890ff' }} />
              </span>
            )}
            {duration && <img src={iconSrc} alt={activityStatus} style={{ width: 34, height: 34 }} />}
            {keyActivity}
          </span>
        );
      },
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      width: 80,
      align: "center",
      render: (_, record) => `${record.duration ? record.duration : ''}`
    },
    { title: "Pre-Requisite", dataIndex: "preRequisite", key: "preRequisite", width: 120, align: "center" },
    { title: "Slack", dataIndex: "slack", key: "slack", width: 80, align: "center" },
    { title: "Planned Start", dataIndex: "plannedStart", key: "plannedStart", width: 120, align: "center" },
    { title: "Planned Finish", dataIndex: "plannedFinish", key: "plannedFinish", width: 120, align: "center" },
  ];

  function getBusinessDays(start: dayjs.Dayjs, end: dayjs.Dayjs): number {
    let count = 0;
    let current = start.clone();

    while (current.isBefore(end, 'day') || current.isSame(end, 'day')) {
      const day = current.day();
      if (day !== 0 && day !== 5) {
        count++;
      }
      current = current.add(1, 'day');
    }

    return count;
  }

  const editingColumns: ColumnsType = [
    {
      title: "Actual/Expected Duration",
      key: "durations",
      width: 200,
      align: "center",
      render: (_, record) => {
        const { actualStart, actualFinish, expectedDuration, duration, activityStatus, isModule } = record;

        const start = actualStart && dayjs(actualStart, 'DD-MM-YYYY').isValid()
          ? dayjs(actualStart, 'DD-MM-YYYY')
          : null;
        const finish = actualFinish && dayjs(actualFinish, 'DD-MM-YYYY').isValid()
          ? dayjs(actualFinish, 'DD-MM-YYYY')
          : null;

        const calculatedDuration = start && finish ? getWorkingDaysDiff(start, finish) : null;

        const displayDuration = expectedDuration ?? calculatedDuration ?? duration;

        const isEditable = isEditing && !isModule && (activityStatus === "inProgress" || activityStatus === "yetToStart");

        return isEditable ? (
          <Input
            type="number"
            value={displayDuration}
            onChange={(e) => handleFieldChange(e.target.value, record.key, "expectedDuration")}
            style={{ width: 80 }}
          />
        ) : (
          displayDuration != null ? `${displayDuration}` : ""
        );
      }
    },
    {
      title: "Status",
      dataIndex: "activityStatus",
      key: "activityStatus",
      width: 150,
      align: "center",
      render: (_, record) => {
        const preReqDone = isPreReqCompleted(record.preRequisite, dataSource);
        return isEditing && !record.isModule
          ? renderStatusSelect(record.activityStatus, record.key, record.fin_status, !preReqDone)
          : record.activityStatus;
      },
    },
    {
      title: "Actual / Expected Start",
      dataIndex: "actualStart",
      key: "actualStart",
      width: 180,
      align: "center",
      render: (_, { actualStart, activityStatus, key, isModule }) =>
        isEditing && !isModule ? (
          <DatePicker
            format="DD-MM-YYYY"
            value={
              actualStart && dayjs(actualStart, 'DD-MM-YYYY').isValid()
                ? dayjs(actualStart, 'DD-MM-YYYY')
                : null
            }
            onChange={(date) =>
              handleFieldChange(date ? dayjs(date).format('DD-MM-YYYY') : null, key, "actualStart")
            }
            disabled={activityStatus === "yetToStart"}
          />
        ) : (
          actualStart || ""
        ),
    },
    {
      title: "Actual / Expected Finish",
      dataIndex: "actualFinish",
      key: "actualFinish",
      width: 180,
      align: "center",
      render: (_, { actualFinish, activityStatus, key, isModule }) =>
        isEditing && !isModule ? (
          <DatePicker
            format="DD-MM-YYYY"
            value={
              actualFinish && dayjs(actualFinish, 'DD-MM-YYYY').isValid()
                ? dayjs(actualFinish, 'DD-MM-YYYY')
                : null
            }
            onChange={(date) =>
              handleFieldChange(date ? dayjs(date).format('DD-MM-YYYY') : null, key, "actualFinish")
            }
            disabled={
              activityStatus === "yetToStart" ||
              activityStatus === "inProgress"
            }
          />
        ) : (
          actualFinish || ""
        ),
    },
  ];

  const finalColumns: ColumnsType = isEditing ? [...baseColumns, ...editingColumns] : baseColumns;


  const handleFieldChange = (value: any, recordKey: any, fieldName: any) => {
    setDataSource((prevData: any) => {
      const today = dayjs();
      const parseDate = (date: string | null | undefined) =>
        date && dayjs(date, 'DD-MM-YYYY').isValid() ? dayjs(date, 'DD-MM-YYYY') : null;

      const addBusinessDays = (start: dayjs.Dayjs, numDays: number): dayjs.Dayjs => {
        let count = 0;
        let date = start.clone();
        while (count < numDays) {
          date = date.add(1, 'day');
          const day = date.day();
          if (day !== 0 && day !== 6) count++;
        }
        return date;
      };

      const businessDaysBetween = (start: dayjs.Dayjs, end: dayjs.Dayjs): number => {
        let count = 0;
        let date = start.clone();
        while (date.isBefore(end, 'day') || date.isSame(end, 'day')) {
          const day = date.day();
          if (day !== 0 && day !== 6) count++;
          date = date.add(1, 'day');
        }
        return count;
      };

      const findActivityByCode = (data: any[], code: string): any | null => {
        for (const item of data) {
          if (item.Code === code) return item;
          if (item.children) {
            const found = findActivityByCode(item.children, code);
            if (found) return found;
          }
        }
        return null;
      };

      const updateItem = (item: any): any => {
        if (item.key !== recordKey) return item;

        let updatedItem = { ...item };

        const plannedStart = parseDate(updatedItem.plannedStart);
        const plannedFinish = parseDate(updatedItem.plannedFinish);
        const plannedDuration = updatedItem.duration ? parseInt(updatedItem.duration, 10) : 0;

        switch (fieldName) {
          case "activityStatus": {
            updatedItem.activityStatus = value;

            if (value === "yetToStart") {
              updatedItem.expectedDuration = plannedDuration;

              if (plannedStart && plannedFinish) {
                updatedItem.actualStart = plannedStart.format('DD-MM-YYYY');
                updatedItem.actualFinish = plannedFinish.format('DD-MM-YYYY');
              } else {
                updatedItem.actualStart = null;
                updatedItem.actualFinish = null;
              }
            }

            if (value === "inProgress") {
              const plannedStartValid = plannedStart && plannedStart.isValid();
              let startCandidate = plannedStartValid && plannedStart.isAfter(today) ? plannedStart : today;

              if (!updatedItem.preRequisite) {
                updatedItem.actualStart = startCandidate.format('DD-MM-YYYY');
              } else {
                const preReqCodes = updatedItem.preRequisite.split(',').map((code: any) => code.trim());
                const preReqActivities = preReqCodes
                  .map((code: any) => findActivityByCode(prevData, code))
                  .filter((item: any) => item && item.actualFinish);

                const latestPreReqFinish = preReqActivities
                  .map((item: any) => parseDate(item.actualFinish))
                  .sort((a: any, b: any) => b!.isAfter(a!) ? 1 : -1)[0];

                if (latestPreReqFinish) {
                  const preReqBasedStart = latestPreReqFinish.add(1, 'day');
                  if (preReqBasedStart.isAfter(startCandidate)) {
                    startCandidate = preReqBasedStart;
                  }
                }

                updatedItem.actualStart = startCandidate.format('DD-MM-YYYY');
              }

              const actualStartDate = parseDate(updatedItem.actualStart);
              if (actualStartDate) {
                const workingDaysSinceStart = businessDaysBetween(actualStartDate, today);
                const newExpectedDuration = Math.max(plannedDuration, workingDaysSinceStart);

                updatedItem.expectedDuration = newExpectedDuration;
                updatedItem.actualFinish = addBusinessDays(actualStartDate, newExpectedDuration).format('DD-MM-YYYY');
              }
            }

            if (value === "completed") {
              if (!updatedItem.preRequisite) {
                updatedItem.actualStart = plannedStart?.format('DD-MM-YYYY') || null;
              } else {
                const preReqCodes = updatedItem.preRequisite.split(',').map((code: any) => code.trim());
                const preReqActivities = preReqCodes
                  .map((code: any) => findActivityByCode(prevData, code))
                  .filter((item: any) => item && item.actualFinish);

                const latestPreReqFinish = preReqActivities
                  .map((item: any) => parseDate(item.actualFinish))
                  .sort((a: any, b: any) => b!.isAfter(a!) ? 1 : -1)[0];

                if (latestPreReqFinish) {
                  const candidateStart = latestPreReqFinish.add(1, 'day');
                  updatedItem.actualStart = candidateStart.isAfter(plannedFinish!)
                    ? null
                    : candidateStart.format('DD-MM-YYYY');
                }
              }

              const startDate = parseDate(updatedItem.actualStart);
              if (startDate && plannedDuration >= 0) {
                updatedItem.expectedDuration = plannedDuration;
                updatedItem.actualFinish = addBusinessDays(startDate, plannedDuration).format('DD-MM-YYYY');
              }
            }

            break;
          }

          case "expectedDuration": {
            const parsed = parseInt(value, 10);
            if (!isNaN(parsed)) {
              updatedItem.expectedDuration = parsed;

              const actualStart = parseDate(updatedItem.actualStart);
              if (actualStart) {
                updatedItem.actualFinish = addBusinessDays(actualStart, parsed).format('DD-MM-YYYY');
              }
            }
            break;
          }

          case "actualStart": {
            updatedItem.actualStart = value;
            const newStart = parseDate(value);
            if (newStart && updatedItem.expectedDuration != null) {
              updatedItem.actualFinish = addBusinessDays(newStart, updatedItem.expectedDuration).format('DD-MM-YYYY');
            }
            break;
          }

          case "actualFinish": {
            updatedItem.actualFinish = value;
            const newFinish = parseDate(value);
            const start = parseDate(updatedItem.actualStart);
            if (start && newFinish) {
              const dur = businessDaysBetween(start, newFinish);
              updatedItem.expectedDuration = dur >= 0 ? dur : null;
            }
            break;
          }


          default:
            updatedItem[fieldName] = value;
        }

        return updatedItem;
      };

      const updateData = (data: any[]): any[] => {
        return data.map((item) => {
          if (item.key === recordKey) {
            return updateItem(item);
          } else if (item.children) {
            return {
              ...item,
              children: updateData(item.children),
            };
          }
          return item;
        });
      };

      return updateData(prevData);
    });
  };

  const handleUpdateStatus = () => {
    setIsEditing(true);
  };

  const handleSaveStatus = async () => {
    let isValid = true;
    let errorMessage = "";

    dataSource.some((module: any) => {
      if (module.children) {
        return module.children.some((activity: any) => {
          const { activityStatus, actualStart, actualFinish } = activity;

          if (activityStatus === "inProgress" && !actualStart) {
            errorMessage = `Activity ${activity.keyActivity} is IN-PROGRESS but Actual Start is missing.`;
            isValid = false;
            return true;
          }

          if (activityStatus === "completed") {
            if (!actualStart && !actualFinish) {
              errorMessage = `Activity ${activity.keyActivity} is COMPLETED but Actual Start and Actual Finish are missing.`;
            } else if (!actualStart) {
              errorMessage = `Activity ${activity.keyActivity} is COMPLETED but Actual Start is missing.`;
            } else if (!actualFinish) {
              errorMessage = `Activity ${activity.keyActivity} is COMPLETED but Actual Finish is missing.`;
            }

            if (errorMessage) {
              isValid = false;
              return true;
            }
          }

          if (activityStatus === "yetToStart" && (actualStart || actualFinish)) {
            errorMessage = `Activity ${activity.keyActivity} is Yet To Start but ${actualStart ? "Actual Start" : "Actual Finish"} is filled incorrectly.`;
            isValid = false;
            return true;
          }

          return false;
        });
      }
      return false;
    });

    if (!isValid) {
      message.error(errorMessage);
      return;
    }

    if (!sequencedModules.length || !dataSource.length) return;

    const updatedActivityMap = new Map();
    dataSource.forEach((module: any) => {
      module.children.forEach((activity: any) => {
        updatedActivityMap.set(activity.Code, {
          actualStart: activity.actualStart,
          actualFinish: activity.actualFinish,
          activityStatus: activity.activityStatus,
          fin_status: activity.activityStatus,
        });
      });
    });

    const updatedSequencedModules = sequencedModules.map((module: any) => ({
      ...module,
      activities: module.activities.map((activity: any) => ({
        ...activity,
        ...(updatedActivityMap.has(activity.code) ? updatedActivityMap.get(activity.code) : {}),
      })),
    }));

    setSequencedModules(updatedSequencedModules);
    let updatedProject = selectedProject;
    updatedProject.projectTimeline = updatedSequencedModules;
    await db.updateProjectTimeline(selectedProjectTimeline.versionId || selectedProjectTimeline.timelineId, updatedSequencedModules);
    defaultSetup();
    message.success("Status updated successfully!");
  };

  const getProjectTimelineById = (id: any) => {
    const data = selectedProject.projectTimeline.filter((item: any) => item.timelineId == id);
    if (data.length > 0) {
      setSelectedProjectTimeline(data[0]);
      localStorage.setItem("latestProjectVersion", data[0].version);
    } else {
      console.warn("No matching timeline found for id:", id);
    }
  };

  const handleChangeVersionTimeline = async (id: any) => {
    const timelineData = await db.getProjectTimelineById(id);
    getProjectTimelineById(id);
    handleLibraryChange(timelineData);
  }

  const handleReviseConfirm = () => {
    setIsReviseModalOpen(false);
  };

  const selectedNotes = useMemo(() => {
    const findNotes = (items: any[]): any[] => {
      for (const item of items) {
        if (item.key === selectedActivityKey) return item.notes || [];
        if (item.children) {
          const found = findNotes(item.children);
          if (found) return found;
        }
      }
      return [];
    };
    return findNotes(dataSource);
  }, [selectedActivityKey, dataSource]);

  const handleSaveNote = () => {
    const newNote = {
      id: editNoteId || Date.now().toString(),
      text: noteInput.trim(),
      updatedAt: new Date(),
    };

    setDataSource((prev: any) => {
      const update = (items: any[]): any[] =>
        items.map(item => {
          if (item.key === selectedActivityKey) {
            const notes = item.notes || [];
            const updatedNotes = editNoteId
              ? notes.map((n: any) => (n.id === editNoteId ? { ...n, text: noteInput.trim() } : n))
              : [...notes, newNote];
            return { ...item, notes: updatedNotes };
          }
          if (item.children) return { ...item, children: update(item.children) };
          return item;
        });
      return update(prev);
    });

    setNoteInput('');
    setEditNoteId(null);
  };

  const handleDeleteNote = (noteId: string) => {
    setDataSource((prev: any) => {
      const update = (items: any[]): any[] =>
        items.map(item => {
          if (item.key === selectedActivityKey) {
            const notes = item.notes?.filter((n: any) => n.id !== noteId) || [];
            return { ...item, notes };
          }
          if (item.children) return { ...item, children: update(item.children) };
          return item;
        });
      return update(prev);
    });
  };

  return (
    <>
      <div className="status-heading">
        <div className="status-update-header">
          <p>Project Timeline</p>
          {allProjects.length != 0 && (
            <div style={{ display: "flex", gap: "10px" }}>
              <span>Approval Status:</span>
              <span
                style={{ fontWeight: 'bold', textTransform: "uppercase" }}
                className={
                  selectedProjectTimeline?.status?.toLowerCase() === "approved"
                    ? "text-approved"
                    : selectedProjectTimeline?.status?.toLowerCase() === "pending"
                      ? "text-warning"
                      : selectedProjectTimeline?.status?.toLowerCase() === "replanned"
                        ? "text-replanned"
                        : "text-danger"
                }
              >
                {selectedProjectTimeline?.status}
              </span>
            </div>
          )}
          {allProjects.length != 0 && (
            <div className="times-stamps" style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <p style={{ color: "#6c757d", fontWeight: "900", minWidth: "80px" }}>Created&nbsp;/&nbsp;Updated By</p>
                <p style={{ fontWeight: "bold", color: "#007bff" }}>
                  {selectedProjectTimeline?.addedBy}
                </p>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <p style={{ color: "#6c757d", fontWeight: "900", minWidth: "80px" }}>Created&nbsp;/&nbsp;Updated At</p>
                <p style={{ fontWeight: "bold", color: "#007bff" }}>
                  {new Date(selectedProjectTimeline?.createdAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="main-status-update">
        {allProjects.length != 0 && (
          <>
            <div className="status-toolbar">
              <div className="select-item">
                <div className="flex-item">
                  <label htmlFor="" style={{ fontWeight: "bold", marginTop: "3px", width: "100%" }}>Project</label>
                  <Select
                    placeholder="Select Project"
                    value={selectedProjectId}
                    onChange={handleProjectChange}
                    popupMatchSelectWidth={false}
                    style={{ width: "100%" }}
                  >
                    {allProjects.map((project) => (
                      <Option key={project.id} value={project.id}>
                        {project.projectParameters.projectName}
                      </Option>
                    ))}
                  </Select>
                </div>
                {allVersions?.length > 0 && (
                  <div className="flex-item">
                    <label htmlFor="" style={{ fontWeight: "bold", marginTop: "3px", width: "100%" }}>
                      Version
                    </label>
                    <Select
                      placeholder="Select Version"
                      value={{
                        value: selectedVersionId,
                        label: (
                          <>
                            {selectedProjectTimeline?.status === 'pending' ? (
                              <ClockCircleOutlined style={{ color: 'orange', marginRight: 8 }} />
                            ) : selectedProjectTimeline?.status === 'replanned' ? (
                              <SyncOutlined style={{ color: '#6f42c1', marginRight: 8 }} />
                            ) : (
                              <LikeOutlined style={{ color: 'green', marginRight: 8 }} />
                            )}
                            {selectedProjectTimeline?.version}
                          </>
                        ),
                      }}
                      onChange={(valueObj) => {
                        const value = valueObj.value;
                        const selectedVersion = allVersions.find((version: any) => version.versionId === value);
                        setSelectedProjectTimeline(selectedVersion);
                        setSelectedVersionId(value);
                        handleChangeVersionTimeline(value);
                      }}
                      popupMatchSelectWidth={false}
                      style={{ width: '100%' }}
                      labelInValue
                    >
                      {allVersions?.map((version: any) => (
                        <Option key={version.versionId} value={version.versionId}>
                          {version.status === 'pending' ? (
                            <ClockCircleOutlined style={{ color: 'orange', marginRight: 8 }} />
                          ) : version.status === 'replanned' ? (
                            <SyncOutlined style={{ color: 'blue', marginRight: 8 }} />
                          ) : (
                            <LikeOutlined style={{ color: 'green', marginRight: 8 }} />
                          )}
                          {version.version}
                        </Option>
                      ))}
                    </Select>
                  </div>
                )}
              </div>
              <div className="actions">
                <Button
                  icon={<FormOutlined />}
                  disabled={!selectedActivityKey}
                  onClick={() => setNoteModalVisible(true)}
                  style={{
                    backgroundColor: selectedActivityKey ? '#f6ffed' : '#f5f5f5',
                    borderColor: selectedActivityKey ? '#b7eb8f' : '#d9d9d9',
                    color: selectedActivityKey ? '#52c41a' : '#bfbfbf',
                    cursor: selectedActivityKey ? 'pointer' : 'not-allowed',
                  }}
                >
                  Add Note
                </Button>

                <Button
                  type="primary"
                  disabled={!selectedProjectId}
                  icon={<DownloadOutlined />}
                  onClick={handleDownload}
                  style={{ backgroundColor: "#4CAF50" }}
                >
                  Download Timeline
                </Button>
                {selectedProjectTimeline?.status != 'replanned' && (
                  <Button
                    type="primary"
                    disabled={!selectedProjectId}
                    icon={selectedProjectTimeline?.status != 'Approved' ? <EditOutlined /> : <ReloadOutlined />}
                    onClick={selectedProjectTimeline?.status != 'Approved' ? editTimeBuilder : rePlanTimeline}
                    style={{ backgroundColor: "#FF8A65" }}
                  >
                    {selectedProjectTimeline?.status != 'Approved' ? 'Edit Timeline' : 'Replan Timeline'}
                  </Button>
                )}
                <Button
                  type="primary"
                  disabled={!selectedProjectId}
                  icon={<ShareAltOutlined />}
                  onClick={showModal}
                  style={{ backgroundColor: "#00BFA6" }}
                >
                  Share
                </Button>

                {(selectedProjectTimeline?.status == 'Approved') && (
                  <Button
                    type={isEditing ? "primary" : "default"}
                    style={{
                      backgroundColor: isEditing ? "#AB47BC" : "#5C6BC0",
                      color: isEditing ? undefined : "#fff",
                    }}
                    icon={isEditing ? <SaveOutlined /> : <FormOutlined />}
                    onClick={isEditing ? handleSaveStatus : handleUpdateStatus}
                  >
                    {isEditing ? "Save Status" : "Update Status"}
                  </Button>
                )}

                {(selectedProjectTimeline?.status != 'Approved' && selectedProjectTimeline?.status != 'replanned') && getCurrentUser().role == 'Admin' && (
                  <div className="action-btn">
                    <Button
                      type="primary"
                      disabled={!selectedProjectId}
                      style={{ backgroundColor: "#E57373" }}
                      onClick={() => setIsReviseModalOpen(true)}
                    >
                      Revise
                    </Button>
                    <Button
                      type="primary"
                      disabled={!selectedProjectId}
                      onClick={() => setIsApproveModalOpen(true)}
                      style={{ backgroundColor: "#258780" }}
                    >
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <hr />
          </>
        )}
        {selectedProject != null ? (
          <>
            <div className="status-update-items">
              <div className="status-update-table">
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
                  rowClassName={(record) => {
                    if (record.isModule) return "module-header";
                    return record.key === selectedActivityKey ? "selected-row activity-row" : "activity-row";
                  }}
                  bordered
                  scroll={{
                    x: "max-content",
                    y: "calc(100vh - 250px)",
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="container-msg">
            <div className="no-project-message">
              <FolderOpenOutlined style={{ fontSize: "50px", color: "grey" }} />
              {allProjects.length === 0 ? (
                <>
                  <h3>No Projects Timeline Found</h3>
                  <p>You need to create a project for defining a timeline.</p>
                  <button onClick={() => {
                    eventBus.emit("updateTab", "/create/register-new-project");
                    navigate("/create/timeline-builder");
                  }}>Create Project Timeline</button>
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

      <Modal
        title="Project Timeline Confirmation"
        visible={isApproveModalOpen}
        onCancel={() => setIsApproveModalOpen(false)}
        onOk={handleApproveTimeline}
        okText="Yes"
        className="modal-container"
        okButtonProps={{ className: "bg-secondary" }}
      >
        <div style={{ padding: "0px 10px", fontWeight: "400", fontSize: "16px" }}>
          <p>Are You sure you want to confirm?</p>
        </div>
      </Modal>

      <Modal
        title="Revise Project Timeline"
        visible={isReviseModalOpen}
        onCancel={() => setIsReviseModalOpen(false)}
        onOk={handleReviseConfirm}
        okText="Confirm"
        cancelText="Cancel"
        className="modal-container"
        okButtonProps={{ danger: true }}
      >
        <div style={{ padding: "0px 20px" }}>
          <div className="times-stamps revise" style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <p style={{ color: "#6c757d", fontWeight: "900", minWidth: "80px" }}>Created By</p>
              <p style={{ fontWeight: "bold", color: "#007bff" }}>
                {selectedProjectTimeline?.addedBy}
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <p style={{ color: "#6c757d", fontWeight: "900", minWidth: "80px" }}>Created At</p>
              <p style={{ fontWeight: "bold", color: "#007bff" }}>
                {new Date(selectedProjectTimeline?.createdAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}
              </p>
            </div>
          </div>

          <TextArea
            rows={4}
            value={reviseRemarks}
            onChange={(e) => setReviseRemarks(e.target.value)}
            placeholder="Enter revision notes..."
          />
        </div>
      </Modal>

      <Modal
        title="Activity Notes"
        open={noteModalVisible}
        onCancel={() => {
          setNoteModalVisible(false);
          setNoteInput('');
          setEditNoteId(null);
        }}
        width={'60%'}
        footer={null}
        className="modal-container"
      >
        <div style={{ padding: "10px 24px" }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography.Title level={5}>
              {editNoteId ? "Edit Note" : "Add New Note"}
            </Typography.Title>

            <Button
              type="primary"
              block
              onClick={handleSaveNote}
              disabled={!noteInput.trim()}
              style={{ width: '15%', marginBottom: 8 }}
            >
              {editNoteId ? "Update Note" : "Add Note"}
            </Button>

          </div>

          <Input.TextArea
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            placeholder="Write your note here..."
            rows={4}
          />

          <List
            header={<strong style={{ fontSize: 16 }}>Previous Notes</strong>}
            dataSource={selectedNotes}
            locale={{ emptyText: "No notes available" }}
            itemLayout="horizontal"
            style={{ marginBottom: 20 }}
            renderItem={(item: any) => (
              <List.Item
                style={{ padding: "8px 0" }}
                actions={[
                  <a key="edit" onClick={() => {
                    setNoteInput(item.text);
                    setEditNoteId(item.id);
                  }}>Edit</a>,
                  <a key="delete" onClick={() => handleDeleteNote(item.id)}>Delete</a>
                ]}
              >
                <Typography.Paragraph style={{ margin: 0 }}>{item.text}</Typography.Paragraph>
              </List.Item>
            )}
          />

        </div>
      </Modal>


    </>
  );
};

export default StatusUpdate;