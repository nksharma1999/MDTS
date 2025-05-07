import { useEffect, useState } from "react";
import "../styles/project-timeline.css";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { FolderOpenOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Button, Select, Modal, Input, message, Table, DatePicker, Tooltip, Checkbox, Space } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined, DownloadOutlined, ExclamationCircleOutlined, InfoCircleOutlined, LikeOutlined, ShareAltOutlined, SyncOutlined } from "@ant-design/icons";
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

import { Dropdown } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

const tabs = [
    "All",
    "In-Progress",
    "Upcoming 1 Month",
    "Recent Completed",
    "Yet To Start",
    "Can be started with in a week"
];
const ProjectTimeline = (project: any) => {

    const navigate = useNavigate();
    const [expandedKeys, setExpandedKeys] = useState<any>([]);
    const [allProjects, setAllProjects] = useState<any>([]);
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


    const [activeTab, setActiveTab] = useState(0);
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
            const storedData: any = (await db.getProjects()).filter((p) => p.id == project.code);
            setAllProjects(storedData);
            let selectedProject = null;
            selectedProject = storedData[0];
            setSelectedProject(selectedProject);
            if (storedData[0].projectTimeline) {
                if (storedData != null) {
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
            }

        } catch (error) {
            console.error("An unexpected error occurred while fetching projects:", error);
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

    const renderStatusSelect = (
        status: string,
        recordKey: string,
        _fin_status: string,
        _disabled: boolean = false
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
                disabled
                className={`status-select ${status}`}
                style={{ width: "100%", fontWeight: "bold" }}
            />
        );
    };

    const baseColumns: ColumnsType = [
        {
            title: "Key Activity",
            dataIndex: "keyActivity",
            key: "keyActivity",
            width: 250,
            align: "left",
            render: (_, record) => {
              const {
                activityStatus,
                plannedStart,
                plannedFinish,
                actualStart,
                actualFinish,
              } = record;
          
              const plannedStartDate = plannedStart ? dayjs(plannedStart) : null;
              const plannedFinishDate = plannedFinish ? dayjs(plannedFinish) : null;
              const actualStartDate = actualStart ? dayjs(actualStart) : null;
              const actualFinishDate = actualFinish ? dayjs(actualFinish) : null;
          
              let icon = <ClockCircleOutlined style={{ color: 'gray' }} />;
              let label = record.keyActivity;
          
              if (activityStatus === 'completed') {
                if (actualFinishDate && plannedFinishDate && actualFinishDate.isAfter(plannedFinishDate)) {
                  icon = <ExclamationCircleOutlined style={{ color: 'red' }} />;
                } else {
                  icon = <CheckCircleOutlined style={{ color: 'green' }} />;
                }
              } else if (activityStatus === 'inProgress') {
                icon = <SyncOutlined spin style={{ color: 'blue' }} />;
              } else if (activityStatus === 'yetToStart') {
                icon = <ClockCircleOutlined style={{ color: 'gray' }} />;
              }
          
              return (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {icon} {label}
                </span>
              );
            }
          }
          
    ];

    const editingColumns: ColumnsType = [
        {
            title: "Actual/Expected Duration",
            dataIndex: "duration",
            key: "duration",
            width: 250,
            align: "center",
            render: (_, record) => {
                const { activityStatus, actualStart, actualFinish, duration } = record;

                if (activityStatus === "completed") {
                    if (actualStart && actualFinish) {
                        const start = dayjs(actualStart);
                        const finish = dayjs(actualFinish);
                        const diffDays = finish.diff(start, 'day');
                        return isNaN(diffDays) ? "" : `${diffDays} days`;
                    }
                    return "";
                }

                if (activityStatus === "inProgress") {
                    if (actualStart && duration != null) {
                        return `${duration} days`;
                    }
                    return "";
                }

                return duration != null ? `${duration} days` : "";
            },
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
            width: 320,
            align: "center",
            render: (_, { actualStart, activityStatus, key, isModule, fin_status }) =>
                isEditing && !isModule ? (
                    <DatePicker
                        value={actualStart ? dayjs(actualStart) : null}
                        onChange={(_date, dateString) => handleFieldChange(dateString, key, "actualStart")}
                        disabled
                        className={activityStatus != "yetToStart" && fin_status == 'yetToStart' ? "" : ""}
                    />
                ) : (
                    actualStart || ""
                ),
        },
        {
            title: "Actual / Expected Finish",
            dataIndex: "actualFinish",
            key: "actualFinish",
            width: 320,
            align: "center",
            render: (_, { actualFinish, activityStatus, key, isModule, fin_status }) =>
                isEditing && !isModule ? (
                    <DatePicker
                        value={actualFinish ? dayjs(actualFinish) : null}
                        onChange={(_date, dateString) => handleFieldChange(dateString, key, "actualFinish")}
                        disabled
                        className={activityStatus != "yetToStart" && fin_status == 'yetToStart' ? "" : ""}
                    />
                ) : (
                    actualFinish || ""
                ),
        },
    ];

    const finalColumns: ColumnsType = isEditing ? [...baseColumns, ...editingColumns] : baseColumns;

    const handleFieldChange = (value: any, recordKey: any, fieldName: any) => {
        setDataSource((prevData: any) => {
            const updateItem = (item: any) => {
                if (item.key === recordKey) {
                    if (fieldName === "activityStatus" && value === "yetToStart") {
                        return {
                            ...item,
                            activityStatus: value,
                            actualStart: null,
                            actualFinish: null,
                        };
                    }
                    return { ...item, [fieldName]: value };
                }
                return item;
            };

            const updatedData = prevData.map((item: any) => {
                if (item.key === recordKey) {
                    return updateItem(item);
                } else if (item.children) {
                    return {
                        ...item,
                        children: item.children.map((child: any) =>
                            child.key === recordKey ? updateItem(child) : child
                        ),
                    };
                }
                return item;
            });

            return updatedData;
        });
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

    const formattedDate = selectedProjectTimeline?.createdAt
        ? new Date(selectedProjectTimeline.createdAt).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        })
        : "N/A";

    const items = tabs.map((tab, index) => ({
        key: index,
        label: (
            <div className={activeTab === index ? 'dropdown-item active' : 'dropdown-item'}>
                {tab}
            </div>
        ),
        onClick: () => setActiveTab(index),
    }));

    const filterActivitiesWithinModules = (modules: any, activeTab: any) => {
        const today = dayjs();
        const oneMonthLater = today.add(1, 'month');
        const oneWeekLater = today.add(7, 'day');

        return modules.map((module: any) => {
            const filteredChildren = (module.children || []).filter((a: any) => {
                switch (activeTab) {
                    case 0:
                        return true;

                    case 1:
                        return a.activityStatus === 'inProgress';

                    case 2:
                        if (!a.plannedStart) return false;
                        const plannedStart = dayjs(a.plannedStart, "DD-MM-YYYY");
                        return plannedStart.isAfter(today) && plannedStart.isBefore(oneMonthLater);

                    case 3:
                        if (!a.actualFinish) return false;
                        const actualFinish = dayjs(a.actualFinish);
                        return actualFinish.isAfter(today.subtract(30, 'days')) && actualFinish.isBefore(today);

                    case 4:
                        return a.activityStatus === 'yetToStart';

                    case 5:
                        if (!a.plannedStart) return false;
                        const ps = dayjs(a.plannedStart, "DD-MM-YYYY");
                        return ps.isAfter(today) && ps.isBefore(oneWeekLater);

                    default:
                        return true;
                }
            });

            return {
                ...module,
                children: filteredChildren,
            };
        });
    };

    const filteredDataSource = filterActivitiesWithinModules(dataSource, activeTab);

    const dropdownContent = (
        <div className="custom-dropdown">
            <Input.Search placeholder="Search activity..." className="dropdown-search" />

            {/* Status Filter */}
            <div className="dropdown-section">
                <p className="dropdown-title">Status</p>
                <Select
                    className="full-width-select"
                    placeholder="Select status"
                    allowClear
                >
                    <Option value="completed">Completed</Option>
                    <Option value="inProgress">In Progress</Option>
                    <Option value="yetToStart">Yet to Start</Option>
                </Select>
            </div>

            {/* Planned Date Filter */}
            <div className="dropdown-section">
                <p className="dropdown-title">Planned Start Date</p>
                <DatePicker className="full-width-range" />
            </div>

            {/* Assigned Users */}
            <div className="dropdown-section">
                <p className="dropdown-title">Assigned Users</p>
                <Checkbox.Group className="checkbox-group">
                    <Checkbox value="user1">John Doe</Checkbox>
                    <Checkbox value="user2">Jane Smith</Checkbox>
                    <Checkbox value="user3">Alice Johnson</Checkbox>
                </Checkbox.Group>
            </div>
        </div>
    );

    return (
        <>
            <div className="timeline-main">
                {allProjects[0]?.projectTimeline ? (
                    <>
                        <div className="status-toolbar">
                            {allVersions?.length > 0 && (
                                <div className="select-item">
                                    <div className="flex-item">
                                        <label style={{ fontWeight: "bold", marginTop: "3px", width: "100%" }}>
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
                                                const selectedVersion = allVersions.find((v: any) => v.versionId === value);
                                                setSelectedProjectTimeline(selectedVersion);
                                                setSelectedVersionId(value);
                                                handleChangeVersionTimeline(value);
                                            }}
                                            popupMatchSelectWidth={false}
                                            style={{ width: '100%' }}
                                            labelInValue
                                        >
                                            {allVersions.map((version: any) => (
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
                                </div>
                            )}
                            <div style={{ display: "flex", gap: "10px" }}>
                                <span>Status:</span>
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
                            <div className="actions">
                                <Tooltip title="Download Project">
                                    <Button
                                        type="primary"
                                        disabled={!selectedProjectId}
                                        icon={<DownloadOutlined />}
                                        onClick={handleDownload}
                                        style={{ backgroundColor: "#4CAF50" }}
                                    />
                                </Tooltip>
                                <Tooltip title="Share Project">
                                    <Button
                                        type="primary"
                                        disabled={!selectedProjectId}
                                        icon={<ShareAltOutlined />}
                                        onClick={showModal}
                                        style={{ backgroundColor: "#00BFA6" }}
                                    />
                                </Tooltip>
                                <Tooltip
                                    title={
                                        <div className="times-stamps">
                                            <div className="time-row">
                                                <p className="time-label">Created / Updated By</p>
                                                <p className="time-value">{selectedProjectTimeline?.addedBy || "N/A"}</p>
                                            </div>
                                            <div className="time-row">
                                                <p className="time-label">Created / Updated At</p>
                                                <p className="time-value">{formattedDate}</p>
                                            </div>
                                        </div>
                                    }
                                    overlayClassName="custom-tooltip"
                                >
                                    <Button type="primary" icon={<InfoCircleOutlined />} className="styled-button" />
                                </Tooltip>

                                <Space direction="vertical">
                                    <Space wrap>
                                        <Button.Group>
                                            <Button icon={<FilterOutlined />} />
                                            <Dropdown overlay={dropdownContent} placement="bottomLeft" trigger={['click']}>
                                                <Button>Filters</Button>
                                            </Dropdown>
                                        </Button.Group>
                                    </Space>
                                </Space>
                            </div>
                        </div>
                        <hr />
                        <div className="status-update-item">
                            <div className="table-container">
                                <Table
                                    columns={finalColumns}
                                    dataSource={filteredDataSource}
                                    className="project-timeline-table"
                                    pagination={false}
                                    expandable={{
                                        expandedRowRender: () => null,
                                        rowExpandable: (record) => record.children?.length > 0,
                                        expandedRowKeys: expandedKeys,
                                        onExpand: (expanded, record) => {
                                            setExpandedKeys(expanded
                                                ? [...expandedKeys, record.key]
                                                : expandedKeys.filter((key: any) => key !== record.key));
                                        },
                                        expandIconColumnIndex: 0,
                                    }}
                                    rowClassName={(record) =>
                                        record.isModule ? "module-header" : "activity-row"
                                    }
                                    bordered
                                    scroll={{
                                        x: true,
                                        y: "calc(100vh - 260px)",
                                    }}
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="container-msg">
                        <div className="no-project-message">
                            <FolderOpenOutlined style={{ fontSize: "50px", color: "grey" }} />
                            <h3>No Projects Timeline Found</h3>
                            <p>Please define the timeline.</p>
                            <button
                                onClick={() => {
                                    eventBus.emit("updateTab", "/create/register-new-project");
                                    navigate("/create/timeline-builder");
                                }}
                            >
                                Create Project Timeline
                            </button>
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
        </>
    )
}

export default ProjectTimeline