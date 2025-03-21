import { useEffect, useState } from "react";
import { Input, DatePicker, Select, Table, Button, Checkbox, Steps, Modal, message, Result, Dropdown, Menu } from "antd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "../styles/time-builder.css";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
const { Option } = Select;
const { Step } = Steps;
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import { CalendarOutlined, ClockCircleOutlined, CloseCircleOutlined, CloseOutlined, DeleteOutlined, DownOutlined, EditOutlined, ExclamationCircleOutlined, FolderOpenOutlined, LinkOutlined, PlusOutlined, SaveOutlined, ToolOutlined } from "@ant-design/icons";
import moment from 'moment';
import { useLocation } from "react-router-dom";
import { db } from "../Utils/dataStorege.ts";
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

interface HolidayData {
  key: string;
  from: string;
  to: string;
  holiday: string;
  module: string[];
  impact: Record<string, string>;
}

interface Column {
  title: any;
  width?: string;
  dataIndex: string;
  key: string;
  align?: "center" | "left" | "right";
  render?: any;
}

const TimeBuilder = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [sequencedModules, setSequencedModules] = useState<Module[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [_activitiesData, setActivitiesData] = useState<Activity[]>([]);
  const [holidayData, setHolidayData] = useState<HolidayData[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<any>([]);
  const [dataSource, setDataSource] = useState<any>([]);
  const [finalData, setFinalData] = useState<Module[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedProjectName, setSelectedProjectName] = useState<any>(null);
  const [libraryName, setLibraryName] = useState<any>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCancelEditModalVisible, setIsCancelEditModalVisiblVisible] = useState(false);
  const [selectedProjectMineType, setSelectedProjectMineType] = useState("");
  const navigate = useNavigate();
  const [finalHolidays, setFinalHolidays] = useState<HolidayData[]>();
  const [isSaturdayWorking, setIsSaturdayWorking] = useState(false);
  const [isSundayWorking, setIsSundayWorking] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const location = useLocation();
  const [isMenualTimeline, setIsMenualTimeline] = useState(false);
  const [allProjectsTimelines, setAllProjectsTimelines] = useState<any[]>([]);
  const [openExistingTimelineModal, setOpenExistingTimelineModal] = useState(false);
  const [selectedExistingProjectId, setSelectedExistingProjectId] = useState(null);
  const [selectedExistingProject, setSelectedExistigProject] = useState<any>(null);
  const [editingKey, setEditingKey] = useState(null);
  const [editedImpact, setEditedImpact] = useState<any>({});
  const [restoreDropdownVisible, setRestoreDropdownVisible] = useState(false);
  const [deletedModules, setDeletedModules] = useState<any>([]);

  useEffect(() => {
    defaultSetup();
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem("holidayCalendarData");
    if (storedData) {
      const parsedData: HolidayData[] = JSON.parse(storedData).map(
        (item: any, index: number) => ({
          ...item,
          key: String(index + 1),
        })
      );
      setHolidayData(parsedData);
      setFinalHolidays(parsedData);
      setSelected(Object.fromEntries(parsedData.map((item) => [item.key, true])));
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setExpandedRowKeys(modules.map((module) => module.parentModuleCode));
      setFinalData(modules);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [modules]);

  useEffect(() => {
    if (currentStep === 6) {
      setExpandedKeys(finalData.map((_, index) => `module-${index}`));

      const finDataSource = sequencedModules.map((module: any, moduleIndex: number) => {
        return {
          key: `module-${moduleIndex}`,
          SrNo: module.parentModuleCode,
          Code: module.parentModuleCode,
          keyActivity: module.moduleName,
          isModule: true,
          children: (module.activities || []).map((activity: any, actIndex: number) => {
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
              actualStart: "",
              actualFinish: "",
              actualDuration: "",
              remarks: "",
              expectedStart: "",
              expectedFinish: "",
              isModule: false,
              activityStatus: activity.activityStatus || "Pending",
            };
          }),
        };
      });
      setDataSource(finDataSource);
    }
  }, [currentStep, finalData]);

  useEffect(() => {
    finalData.forEach((module) => {
      module.activities.forEach((activity) => {
        if (activity.start) {
          handleStartDateChange(activity.code, activity.start);
        }
      });
    });
  }, [isSaturdayWorking, isSundayWorking, finalHolidays]);

  useEffect(() => {
    if (location.state && location.state.selectedProject) {
      const project = location.state.selectedProject;
      setIsUpdateMode(true);
      setSelectedProjectName(project.projectParameters.projectName);
      setSelectedProjectId(project.id);
      setSelectedProject(project);
      setFinalHolidays(project.holidays);

      const selectedProjectLibrary = project.initialStatus.library || [];
      setLibraryName(selectedProjectLibrary);
      if (project && project.projectTimeline) {
        if (project.projectParameters) {
          setSelectedProjectMineType(project.projectParameters.typeOfMine || "");
        }
        setIsSaturdayWorking(project.projectTimeline[0].saturdayWorking)
        setIsSundayWorking(project.projectTimeline[0].sundayWorking)

        if (Array.isArray(project.projectTimeline)) {
          handleLibraryChange(project.projectTimeline);
        } else {
          handleLibraryChange([]);
        }
      }
      else {
        setLibraryName([]);
      }
      setTimeout(() => navigate(".", { replace: true }), 0);
      setIsMenualTimeline(true);
    }
  }, [location.state]);

  const defaultSetup = async () => {
    try {
      const allProjects = await db.getProjects();
      const frestTimelineProject = allProjects.filter((item: any) => item.projectTimeline == undefined);
      setAllProjectsTimelines(allProjects.filter((item: any) => item.projectTimeline != undefined))
      if (!Array.isArray(frestTimelineProject) || frestTimelineProject.length === 0) {
        setAllProjects([]);
        return;
      }
      setAllProjects(frestTimelineProject);
      if (frestTimelineProject && Array.isArray(frestTimelineProject) && frestTimelineProject.length === 1) {
        const firstProject = frestTimelineProject[0];
        if (firstProject && firstProject.id) {
          setSelectedProjectId(firstProject.id);
          setSelectedProject(frestTimelineProject[0]);

          const project = frestTimelineProject.find((p) => p?.id === firstProject.id);
          const selectedProjectLibrary = project.initialStatus.library || [];
          setLibraryName(selectedProjectLibrary);
          if (project && project.projectTimeline) {
            if (project.projectParameters) {
              setSelectedProjectMineType(project.projectParameters.typeOfMine || "");
            }
            setIsSaturdayWorking(project.projectTimeline[0].saturdayWorking)
            setIsSundayWorking(project.projectTimeline[0].sundayWorking)

            if (Array.isArray(project.projectTimeline)) {
              handleLibraryChange(project.projectTimeline);
            } else {
              handleLibraryChange([]);
            }
          }
          else if (project && project.initialStatus) {
            if (project.projectParameters) {
              setSelectedProjectMineType(project.projectParameters.typeOfMine || "");
            }

            if (Array.isArray(project.initialStatus.items)) {
              handleLibraryChange(
                project.initialStatus.items.filter(
                  (item: any) => item?.status?.toLowerCase() !== "completed"
                )
              );
            } else {
              handleLibraryChange([]);
            }
          } else {
            setLibraryName([]);
          }
        }
      }

    } catch (error) {
      console.error("An unexpected error occurred while fetching projects:", error);
    }
  }

  const toggleCheckbox = (key: string) => {
    setSelected((prev) => {
      const updatedSelected = { ...prev, [key]: !prev[key] };
      const updatedHolidays = holidayData.filter((holiday) => updatedSelected[holiday.key]);
      setFinalHolidays(updatedHolidays);
      const updatedModules = finalData.map((module) => ({
        ...module,
        holidays: updatedHolidays,
      }));

      setFinalData(updatedModules);

      return updatedSelected;
    });
  };

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    } else {
      if (isUpdateMode) {
        saveProjectTimeline(sequencedModules);
        navigate("/create/project-timeline")
      }
      else {
        saveProjectTimeline(sequencedModules);
        setIsModalVisible(true);
      }
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(sequencedModules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setFinalData(items);
    setSequencedModules(items);
  };

  const handleSlackChange = (code: any, newSlack: any) => {
    let updatedFinalData = [...finalData];
    let updatedSequencedModules = [...sequencedModules];

    function updateActivities(activities: any) {
      return activities.map((activity: any) => {
        if (activity.code === code) {
          activity.slack = newSlack;
          const prerequisiteEndDate = activity.prerequisite
            ? getActivityEndDate(activity.prerequisite)
            : activity.start;
          const { date: startDate, holidays: slackHolidays } = addBusinessDays(prerequisiteEndDate, parseInt(newSlack, 10) + 1);
          const duration = parseInt(activity.duration, 10) || 0;
          const { date: endDate, holidays: durationHolidays } = addBusinessDays(startDate, duration);

          activity.start = startDate;
          activity.end = endDate;
          activity.holidays = [...slackHolidays, ...durationHolidays];
          updateDependentActivities(activity.code, endDate);
        }
        return activity;
      });
    }

    updatedFinalData = updatedFinalData.map((module) => ({
      ...module,
      activities: updateActivities(module.activities),
    }));

    updatedSequencedModules = updatedSequencedModules.map((module) => ({
      ...module,
      activities: updateActivities(module.activities),
    }));

    setFinalData(updatedFinalData);
    setSequencedModules(updatedSequencedModules);
  };

  const getActivityEndDate = (prerequisiteCode: any) => {
    let endDate = null;
    finalData.forEach((module) => {
      module.activities.forEach((activity) => {
        if (activity.code === prerequisiteCode) {
          endDate = activity.end;
        }
      });
    });
    return endDate;
  };

  const addBusinessDays = (startDate: any, days: any) => {
    let date = moment(startDate);
    let addedDays = 0;
    let holidays = [];

    while (addedDays < days) {
      date = date.add(1, "day");

      const isSaturday = date.day() === 6;
      const isSunday = date.day() === 0;
      const holidayEntry: any = finalHolidays?.find((holiday) => {
        const holidayDate = moment(holiday.from).format("YYYY-MM-DD");
        return holidayDate === date.format("YYYY-MM-DD");
      });

      if (isSaturday && !isSaturdayWorking) {
        holidays.push({ date: date.format("YYYY-MM-DD"), reason: "Saturday" });
      } else if (isSunday && !isSundayWorking) {
        holidays.push({ date: date.format("YYYY-MM-DD"), reason: "Sunday" });
      } else if (holidayEntry) {
        holidays.push({
          date: date.format("YYYY-MM-DD"),
          reason: holidayEntry.holiday || "Holiday",
        });
      } else {
        addedDays++;
      }
    }
    return { date, holidays };
  };

  const handleStartDateChange = (code: any, date: any) => {
    let updatedFinalData = [...finalData];
    let updatedSequencedModules = [...sequencedModules];

    function updateActivities(activities: any) {
      return activities.map((activity: any) => {
        if (activity.code === code) {
          const duration = parseInt(activity.duration, 10) || 0;
          const { date: endDate, holidays } = addBusinessDays(date, duration);

          activity.start = date;
          activity.end = endDate;
          activity.holidays = holidays;
          activity.saturdayWorking = isSaturdayWorking;
          activity.sundayWorking = isSundayWorking;

          updateDependentActivities(activity.code, endDate);
        }
        return activity;
      });
    }

    updatedFinalData = updatedFinalData.map((module) => ({
      ...module,
      activities: updateActivities(module.activities),
    }));

    updatedSequencedModules = updatedSequencedModules.map((module) => ({
      ...module,
      saturdayWorking: isSaturdayWorking,
      sundayWorking: isSundayWorking,
      activities: updateActivities(module.activities),
    }));

    setFinalData(updatedFinalData);
    setSequencedModules(updatedSequencedModules);
  };

  const updateDependentActivities = (prerequisiteCode: any, prerequisiteEndDate: any) => {
    let updatedFinalData = [...finalData];
    let updatedSequencedModules = [...sequencedModules];

    function updateActivities(activities: any) {
      return activities.map((activity: any) => {
        if (activity.prerequisite === prerequisiteCode) {
          const slack = parseInt(activity.slack, 10) || 0;
          const { date: startDate, holidays: slackHolidays } = addBusinessDays(prerequisiteEndDate, slack + 1);
          const duration = parseInt(activity.duration, 10) || 0;
          const { date: endDate, holidays: durationHolidays } = addBusinessDays(startDate, duration);

          activity.start = startDate;
          activity.end = endDate;
          activity.holidays = [...slackHolidays, ...durationHolidays];
          activity.saturdayWorking = isSaturdayWorking;
          activity.sundayWorking = isSundayWorking;

          updateDependentActivities(activity.code, endDate);
        }
        return activity;
      });
    }

    updatedFinalData = updatedFinalData.map((module) => ({
      ...module,
      activities: updateActivities(module.activities),
    }));

    updatedSequencedModules = updatedSequencedModules.map((module) => ({
      ...module,
      saturdayWorking: isSaturdayWorking,
      sundayWorking: isSundayWorking,
      activities: updateActivities(module.activities),
    }));

    setFinalData(updatedFinalData);
    setSequencedModules(updatedSequencedModules);
  };

  const handleActivitySelection = (activityCode: string, isChecked: boolean) => {
    setSelectedActivities((prevSelectedActivities) => {
      const updatedActivities = isChecked
        ? [...prevSelectedActivities, activityCode]
        : prevSelectedActivities.filter((code) => code !== activityCode);

      setSequencedModules((prevFinalData) =>
        prevFinalData.map((module) => ({
          ...module,
          activities: module.activities.filter((activity) => updatedActivities.includes(activity.code)),
        }))
      );

      return updatedActivities;
    });
  };

  const handleProjectChange = (projectId: any) => {
    setCurrentStep(0);
    setSelectedProjectId(projectId);
    const project = allProjects.find((p) => p.id === projectId);
    setSelectedProject(project);
    if (project) {
      const selectedProjectLibrary = project.initialStatus.library;
      setLibraryName(selectedProjectLibrary);
      setSelectedProjectMineType(project.projectParameters.typeOfMine)
      handleLibraryChange((project.initialStatus.items.filter((item: any) => item.status?.toLowerCase() != "completed")));
    } else {
      setLibraryName([]);
    }
  };

  const handleLibraryChange = (libraryItems: any) => {
    if (libraryItems) {
      setSequencedModules(libraryItems);
      setModules(libraryItems);
      const allActivityCodes = libraryItems.flatMap((module: any) =>
        module.activities.map((activity: any) => activity.code)
      );

      setActivitiesData(libraryItems.flatMap((module: any) => module.activities));
      setSelectedActivities(allActivityCodes);

    } else {
      setSequencedModules([]);
      setModules([]);
      setActivitiesData([]);
      setSelectedActivities([]);
    }
  };

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
    setIsModalVisible(false);
  };

  const saveProjectTimeline = async (sequencedModules: any) => {
    try {
      if (!selectedProject || !selectedProjectId) {
        throw new Error("Project or Project ID is missing.");
      }
      const updatedProjectWithTimeline = {
        ...selectedProject,
        projectTimeline: sequencedModules
      };
      await db.updateProject(selectedProjectId, updatedProjectWithTimeline);
      message.success(isUpdateMode
        ? "Project timeline updated successfully!"
        : "Project timeline saved successfully!"
      );
      localStorage.setItem('selectedProjectId', selectedProjectId);
      setSelectedProject(null);
      setSelectedProjectId(null);
      setIsMenualTimeline(false);
      defaultSetup();
    } catch (error) {
      console.error("Error saving project timeline:", error);
      message.error("Failed to save project timeline. Please try again.");
    }
  };

  const holidayColumns: any = [
    {
      title: "From Date",
      dataIndex: "from",
      key: "from",
      width: "10%",
      render: (text: any) => dayjs(text).format("DD-MM-YYYY"),
    },
    {
      title: "To Date",
      dataIndex: "to",
      key: "to",
      align: "left",
      width: "10%",
      render: (text: any) => dayjs(text).format("DD-MM-YYYY"),
    },
    {
      title: "Holiday Name",
      dataIndex: "holiday",
      key: "holiday",
      align: "left",
      width: "25%",
    },
    {
      title: "Module Name",
      dataIndex: "module",
      key: "module",
      align: "left",
      width: "25%",
      render: (modules: any) => (
        <div>
          {modules.map((module: any, index: any) => (
            <div key={index}>{module}</div>
          ))}
        </div>
      ),
    },
    {
      title: "Impact",
      dataIndex: "impact",
      key: "impact",
      align: "left",
      width: "20%",
      render: (impact: any, record: any) =>
        editingKey === record.key ? (
          <div style={{
            backgroundColor: editingKey === record.key ? "#9AA6B2" : "transparent",
            padding: "5px",
            borderRadius: "4px",
          }}>
            {Object.keys(impact).map((module: any, index: any) => (
              <div key={index}>
                <Input
                  value={editedImpact[module]}
                  onChange={(e) => handleImpactChange(module, e.target.value)}
                  style={{ width: "60px", marginRight: "5px", marginBottom: "2px" }}
                />
                <span style={{ fontSize: "10px", marginLeft: "2px" }}>%</span>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {Object.values(impact).map((value: any, index: any) => (
              <div key={index}>
                {value}
                <span style={{ fontSize: "10px", marginLeft: "2px" }}>%</span>
              </div>
            ))}
          </div>
        ),
    },
    {
      title: "✔",
      key: "checkbox",
      width: "5%",
      align: "center",
      render: (_: any, record: any) => (
        <Checkbox
          checked={selected[record.key]}
          onChange={() => toggleCheckbox(record.key)}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: "5%",
      render: (_: any, record: any) =>
        editingKey === record.key ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
            <Button
              type="link"
              icon={<SaveOutlined />}
              className="bg-secondary"
              onClick={() => handleSaveHoliday(record.key)}
            />
            <Button
              type="link"
              className="bg-tertiary"
              icon={<CloseOutlined />}
              onClick={handleCancel}
            />
          </div>
        ) : (
          <Button
            type="link"
            className="bg-info text-white"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.key, record.impact)}
          />
        ),
    },
  ];

  const handleSaveHoliday = async (key: any) => {
    const updatedHolidays: any = finalHolidays?.map((item) =>
      item.key === key ? { ...item, impact: { ...editedImpact } } : item
    );
    const updatedProjectWithHoliday = {
      ...selectedProject,
      holidays: updatedHolidays
    };
    await db.updateProject(selectedProjectId, updatedProjectWithHoliday);
    message.success(isUpdateMode
      ? "Project timeline updated successfully!"
      : "Project timeline saved successfully!"
    );
    setFinalHolidays([...updatedHolidays]);
    setHolidayData([...updatedHolidays]);
    setEditingKey(null);
  };

  const handleImpactChange = (module: any, value: any) => {
    if (!isNaN(value) && value >= 0 && value <= 100) {
      setEditedImpact((prev: any) => ({ ...prev, [module]: Number(value) }));
    }
  };

  const handleEdit = (key: any, impact: any) => {
    setEditingKey(key);
    setEditedImpact({ ...impact });
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditedImpact({});
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

  const getColumnsForStep = (step: number) => {
    const baseColumns: any = [
      {
        title: "Code",
        dataIndex: "code",
        key: "code",
        align: "left",
        render: (_: any, record: any) => record.parentModuleCode || record.code, // Show parentModuleCode for modules, code for activities
      },
      {
        title: "Activity Name",
        dataIndex: "activityName",
        key: "activityName",
        align: "left",
      },
      {
        title: "Duration",
        dataIndex: "duration",
        key: "duration",
        align: "center",
        render: (duration: any) => (duration ? duration : "0"),
      },
    ];

    if (step === 1) {
      baseColumns.push({
        key: "finalize",
        align: "center",
        className: step === 1 ? "active-column" : "",
        onCell: () => ({ className: step === 1 ? "first-column-red" : "" }),
        render: (_: any, record: any) => (
          <Checkbox
            checked={selectedActivities.includes(record.code)}
            onChange={(e) => handleActivitySelection(record.code, e.target.checked)}
            disabled={step !== 1}
          />
        ),
      });
    }

    if (step >= 2) {
      baseColumns.push({
        key: "prerequisite",
        className: step === 2 ? "active-column first-column-red" : "",
        onCell: () => ({ className: step === 2 ? "first-column-red" : "" }),
        render: (_: any, record: any) => (
          <Select
            showSearch
            placeholder="Select Prerequisite"
            value={record.prerequisite === "-" ? undefined : record.prerequisite}
            onChange={(value) => {
              setSequencedModules((prevModules) =>
                prevModules.map((module) => ({
                  ...module,
                  activities: module.activities.map((activity) =>
                    activity.code === record.code
                      ? { ...activity, prerequisite: value }
                      : activity
                  ),
                }))
              );
            }}
            disabled={step !== 2}
            filterOption={(input: any, option: any) =>
              option?.label?.toLowerCase().includes(input.toLowerCase())
            }
            options={[
              { value: "", label: "-" },
              ...sequencedModules.flatMap((module) =>
                module.activities.map((activity) => ({
                  value: activity.code,
                  label: activity.code,
                }))
              ),
            ]}
            style={{ width: "100%" }}
            allowClear
          />
        ),
      });
    }

    if (step >= 3) {
      baseColumns.push({
        key: "slack",
        className: step === 3 ? "active-column first-column-red" : "",
        onCell: () => ({ className: step === 3 ? "first-column-red" : "" }),
        render: (_: any, record: any) => (
          <Input
            placeholder="Slack"
            type="text"
            value={record.slack || 0}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              handleSlackChange(record.code, value);
            }}
            onKeyDown={(e) => {
              if (
                !/^\d$/.test(e.key) &&
                e.key !== "Backspace" &&
                e.key !== "Delete" &&
                e.key !== "ArrowLeft" &&
                e.key !== "ArrowRight"
              ) {
                e.preventDefault();
              }
            }}
            disabled={step !== 3}
          />
        ),
      });
    }

    if (step >= 4) {
      baseColumns.push({
        key: "start",
        className: step === 4 ? "active-column first-column-red" : "",
        onCell: () => ({ className: step === 4 ? "first-column-red" : "" }),
        render: (_: any, record: any) => (
          <DatePicker
            placeholder="Start Date"
            value={record.prerequisite === "" && record.start ? dayjs(record.start) : null}
            onChange={(date) => handleStartDateChange(record.code, date)}
            disabled={step !== 4 || record.prerequisite !== ""}
          />
        ),
      });
    }

    return baseColumns;
  };

  const getOuterTableColumns = (step: number): Column[] => {
    let columns: Column[] = [
      {
        title: "Code",
        dataIndex: "code",
        key: "code",
        render: (_: any, record: any) => record.parentModuleCode || record.code,
      },
      {
        title: "Key Activity",
        dataIndex: "moduleName",
        key: "moduleName",
      },
      {
        title: "Duration",
        dataIndex: "duration",
        key: "duration",
        align: "center",
        render: (duration: any) => (duration ? duration : ""),
      },
    ];

    if (step === 1) {
      columns.push({
        title: "Finalize",
        align: "center",
        dataIndex: "finalize",
        key: "finalize",
      });
    }

    if (step >= 2) {
      columns.push({
        title: "Prerequisite",
        dataIndex: "prerequisite",
        key: "prerequisite",
        align: "center",
        render: (prerequisite: any) => (prerequisite?.code ? prerequisite.code : ""),
      });
    }

    if (step >= 3) {
      columns.push({
        title: "Slack",
        dataIndex: "slack",
        key: "slack",
      });
    }

    if (step >= 4) {
      columns.push({
        title: "Start Date",
        dataIndex: "startDate",
        key: "startDate",
      });
    }

    if (currentStep == 1) {
      columns.push({
        title: (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <span>Actions</span>
            {deletedModules.length > 0 && (
              <div style={{ position: "absolute", right: 0 }}>
                <Dropdown
                  overlay={(
                    <Menu>
                      {deletedModules.map((module: any) => (
                        <Menu.Item key={module.parentModuleCode} onClick={() => restoreDeletedModule(module.parentModuleCode)}>
                          {module.moduleName}
                        </Menu.Item>
                      ))}
                    </Menu>
                  )}
                  trigger={["click"]}
                  visible={restoreDropdownVisible}
                  onVisibleChange={(visible) => setRestoreDropdownVisible(visible)}
                >
                  <Button icon={<DownOutlined />} />
                </Dropdown>
              </div>
            )}
          </div>
        ),
        dataIndex: "actions",
        key: "actions",
        align: "center",
        render: (_text: any, record: any) => (
          <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
            <Button
              type="primary"
              danger
              onClick={() => handleModuleSelection(record.parentModuleCode, false)}
              icon={<DeleteOutlined />}
              size="small"
              style={{
                padding: "6px 10px",
                borderRadius: "4px",
              }}
            >
              Delete
            </Button>
          </div>

        ),
      });
    }

    return columns;
  };

  const handleExistingProjectChange = async (projectId: any) => {
    setSelectedExistingProjectId(projectId);
    const storedAllProjects = await db.getProjects();
    const selectedExProject = storedAllProjects.find((p: any) => p.id === selectedExistingProjectId);
    setSelectedExistigProject(selectedExProject);
  };

  const handleLinkProjectTimeline = async () => {
    try {
      const storedAllProjects = await db.getProjects();
      const selectedExProject = storedAllProjects.find((p: any) => p.id == selectedExistingProjectId);

      if (!selectedExistingProjectId) return;

      if (selectedExProject?.initialStatus.library === selectedProject.initialStatus.library &&
        selectedExProject?.projectParameters.typeOfMine === selectedProject.projectParameters.typeOfMine) {
        const updatedProjectWithTimeline = { ...selectedProject, projectTimeline: [] };
        if (selectedExProject.projectTimeline && selectedExProject.projectTimeline.length > 0) {
          updatedProjectWithTimeline.projectTimeline = selectedExProject.projectTimeline.map((module: any) => ({
            ...module,
            activities: module.activities.map((activity: any) => ({
              ...activity,
              start: "",
              end: "",
            })),
          }));
        }
        await db.updateProject(selectedProject.id, updatedProjectWithTimeline);
        localStorage.setItem('selectedProjectId', selectedProject.id);

        setTimeout(() => message.success("Project timeline linked successfully!"), 0); // Fix for React 18
        navigate("/create/project-timeline");
      } else {
        setTimeout(() => message.error("Selected project and existing project do not match library and mine type!"), 0);
      }
    } catch (error: any) {
      setTimeout(() => message.warning(error.message || "An error occurred"), 0);
    }
  };


  const handleCancelUpdateProjectTimeline = () => {
    setIsCancelEditModalVisiblVisible(false)
    setIsUpdateMode(false);
    setSelectedProject(null);
    setSelectedProjectMineType("");
    setLibraryName("");
    setSelectedProjectId(null);
    setIsMenualTimeline(false);
    defaultSetup();
  };

  const isNextStepAllowed = () => {
    if (currentStep == 4) {
      return sequencedModules.every((module: any) =>
        module.activities.every((activity: any) => {
          if (!activity.prerequisite) {
            return Boolean(activity.start);
          }
          return true;
        })
      );
    }
    return true;
  };

  const handleModuleSelection = (moduleCode: any, isChecked: any) => {
    setSequencedModules((prevModules) => {
      if (!isChecked) {
        const removedModule = prevModules.find((module) => module.parentModuleCode === moduleCode);
        setDeletedModules((prevDeleted: any) => [...prevDeleted, removedModule]);
        return prevModules.filter((module) => module.parentModuleCode !== moduleCode);
      }
      return prevModules;
    });
  };

  const restoreDeletedModule = (moduleCode: any) => {
    setDeletedModules((prevDeleted: any) => {
      const restoredModule = prevDeleted.find((module: any) => module.parentModuleCode === moduleCode);
      if (restoredModule) {
        setSequencedModules((prevModules) => [...prevModules, restoredModule]);
        return prevDeleted.filter((module: any) => module.parentModuleCode !== moduleCode);
      }
      return prevDeleted;
    });
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: "100%" }} className="time-builder-page">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="title-and-filter">
              <div className="heading">
                <span>Timeline Builder</span>
              </div>
              {(allProjects.length > 0 || selectedProject) && (
                <div>
                  <div className="filters">
                    <Select
                      placeholder="Select Project"
                      disabled={isUpdateMode}
                      value={isUpdateMode ? selectedProjectName : selectedProjectId}
                      onChange={handleProjectChange}
                      style={{ width: "100%" }}
                    >
                      {allProjects.map((project) => (
                        <Option key={project.id} value={project.id}>
                          {project.projectParameters.projectName}
                        </Option>
                      ))}
                    </Select>

                    <Input value={selectedProjectMineType} placeholder="Project Mine Type" disabled style={{ width: "100%" }} />
                    <Input value={libraryName} placeholder="Library" disabled style={{ width: "100%" }} />
                  </div>
                </div>
              )}
            </div>
            {(isMenualTimeline && !isUpdateMode) ? (
              <div style={{ padding: "8px 8px 0px 0px" }}>
                <Button
                  type="primary"
                  disabled={!selectedProjectId}
                  icon={<LinkOutlined />}
                  onClick={() => setOpenExistingTimelineModal(true)}
                  style={{ marginLeft: "15px", backgroundColor: "grey", borderColor: "#4CAF50" }}
                >
                  Link Existing Timeline
                </Button>
              </div>
            ) : isUpdateMode && (<>
              <div style={{ paddingRight: "5px" }}>
                <Button
                  type="primary"
                  disabled={!selectedProjectId}
                  icon={<CloseCircleOutlined />}
                  onClick={() => setIsCancelEditModalVisiblVisible(true)}
                  style={{ marginLeft: "15px", backgroundColor: "grey", borderColor: "#4CAF50" }}
                >
                  Cancel
                </Button>
              </div>
            </>)}
          </div>
          <hr style={{ margin: 0 }} />
          {selectedProject != null && isMenualTimeline && (
            <div className="timeline-steps">
              <Steps current={currentStep}>
                <Step title="Sequencing" />
                <Step title="Finalize Activities" />
                <Step title="Prerequisites" />
                <Step title="Slack" />
                <Step title="Start Date" />
                <Step title="Holiday" />
                <Step title="Project Timeline" />
              </Steps>
            </div>
          )}

          {selectedProject != null && isMenualTimeline ? (
            <div className="main-item-container">
              <div className="timeline-items">
                {currentStep === 0 ? (
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="modules">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                          {sequencedModules.map((module, index) => (
                            <Draggable key={module.parentModuleCode} draggableId={module.parentModuleCode} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    padding: "10px",
                                    margin: "0px 0px 8px 0px",
                                    backgroundColor: "#f0f0f0",
                                    borderRadius: "4px",
                                    ...provided.draggableProps.style,
                                  }}
                                >
                                  <strong>{module.parentModuleCode}</strong> {module.moduleName}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                ) : currentStep === 5 ? (
                  <div>
                    {holidayData.length > 0 ? (
                      <>
                        <div className="holiday-actions">
                          <div className="st-sun-field">
                            <Checkbox
                              className="saturday-sunday-checkbox"
                              checked={isSaturdayWorking}
                              onChange={(e) => setIsSaturdayWorking(e.target.checked)}
                            >
                              Saturday Working
                            </Checkbox>
                            <Checkbox
                              className="saturday-sunday-checkbox"
                              checked={isSundayWorking}
                              onChange={(e) => setIsSundayWorking(e.target.checked)}
                            >
                              Sunday Working
                            </Checkbox>
                          </div>
                          <div className="add-new-holiday">
                            <Button type="primary" className="bg-secondary" size="small" onClick={() => navigate("/create/non-working-days")}>
                              Manage Holiday
                            </Button>
                          </div>
                        </div>
                        <Table
                          className="project-timeline-table"
                          dataSource={isUpdateMode ? finalHolidays : holidayData}
                          columns={holidayColumns}
                          pagination={false}
                          scroll={{ y: "calc(100vh - 350px)" }}
                        />
                      </>
                    ) : (
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Result
                          icon={<CalendarOutlined style={{ color: "#1890ff", fontSize: "48px" }} />}
                          title="No Holiday Records Found"
                          subTitle="You haven't added any holidays yet. Click below to add one."
                          extra={
                            <Button type="primary" className="bg-secondary" size="large" onClick={() => navigate("/create/non-working-days")}>
                              Add Holiday
                            </Button>
                          }
                        />
                      </div>
                    )}
                  </div>
                ) : currentStep === 6 || currentStep === 7 ? (
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
                        y: "calc(100vh - 320px)",
                      }}
                    />
                  </div>
                ) : (
                  <div>
                    <Table
                      columns={getOuterTableColumns(currentStep)}
                      className="project-timeline-table"
                      dataSource={sequencedModules}
                      pagination={false}
                      sticky={{ offsetHeader: 0 }}
                      rowClassName={(record) => (record.activities ? "module-heading" : "")}
                      expandedRowKeys={expandedRowKeys}
                      onExpand={(expanded, record) => {
                        setExpandedRowKeys(expanded
                          ? [...expandedRowKeys, record.parentModuleCode]
                          : expandedRowKeys.filter((key) => key !== record.parentModuleCode)
                        );
                      }}
                      expandable={{
                        expandedRowRender: (module) => (
                          <Table
                            columns={getColumnsForStep(currentStep)}
                            dataSource={module.activities}
                            pagination={false}
                            showHeader={false}
                            bordered
                            sticky
                            style={{ overflowX: "hidden" }}
                          />
                        ),
                        rowExpandable: (module) => module.activities.length > 0,
                      }}
                      scroll={{ y: `${window.innerHeight - 300}px`, x: "hidden" }}
                      style={{ overflowX: "hidden" }}
                      rowKey="parentModuleCode"
                    />
                  </div>
                )}
              </div>
              <hr />
              <div className={`action-buttons ${currentStep === 0 ? "float-right" : ""}`}>
                {currentStep > 0 && (
                  <Button className="bg-tertiary" onClick={handlePrev} style={{ marginRight: 8 }} size="small">
                    Previous
                  </Button>
                )}
                <Button
                  disabled={selectedProjectId == null || !isNextStepAllowed()}
                  className="bg-secondary"
                  onClick={handleNext}
                  type="primary"
                  size="small"
                >
                  {currentStep === 7
                    ? isUpdateMode
                      ? "Update"
                      : "Save & Download"
                    : currentStep === 6
                      ? "Mark as Reviewed"
                      : "Next"}
                </Button>

              </div>
            </div>
          ) : <div className="container">
            <div className="no-project-message">

              {allProjects.length === 0 ? (
                <>
                  <h3>No Projects Available</h3>
                  <p>Start by creating a new project to define a timeline.</p>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate("/create/register-new-project")}
                    className="bg-secondary"
                  >
                    Create Project
                  </Button>
                </>
              ) : !selectedProject ? (
                <>
                  <ExclamationCircleOutlined style={{ fontSize: "50px", color: "#258790" }} />
                  <h3>No Project Selected</h3>
                  <p>Please select a project to continue.</p>
                </>
              ) : (
                <>
                  <ClockCircleOutlined style={{ fontSize: "50px", color: "#258790" }} />
                  <h3>Manage Your Timeline</h3>
                  <p>Choose an option below to proceed !</p>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Button
                      type="primary"
                      disabled={!selectedProjectId}
                      icon={<LinkOutlined />}
                      onClick={() => setOpenExistingTimelineModal(true)}
                      style={{ marginLeft: "15px", backgroundColor: "grey", borderColor: "#4CAF50" }}
                    >
                      Link Existing Timeline
                    </Button>
                    <Button
                      type="primary"
                      disabled={!selectedProjectId}
                      icon={<FolderOpenOutlined />}
                      onClick={() => setIsMenualTimeline(true)}
                      style={{ marginLeft: "15px", backgroundColor: "#D35400", borderColor: "#FF9800" }}
                    >
                      Create Timeline Manually
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>}
        </div>
      </div>
      <Modal
        title="Confirm Download"
        visible={isModalVisible}
        onOk={handleDownload}
        onCancel={() => setIsModalVisible(false)}
        okText="Download"
        cancelText="Cancel"
        className="modal-container"
        okButtonProps={{ className: "bg-secondary" }}
      >
        <p style={{ padding: "10px" }}>Are you sure you want to download the data in Excel format?</p>
      </Modal>

      <Modal
        title="Confirm Discard Changes"
        visible={isCancelEditModalVisible}
        onOk={handleCancelUpdateProjectTimeline}
        onCancel={() => setIsCancelEditModalVisiblVisible(false)}
        okText="Yes, Discard"
        cancelText="Cancel"
        className="modal-container"
        okButtonProps={{ className: "bg-secondary" }}
      >
        <p style={{ padding: "10px" }}>
          Are you sure you want to exit? Any unsaved changes will be lost.
        </p>
      </Modal>

      <Modal
        title="Link Existing Project Timeline"
        visible={openExistingTimelineModal}
        onCancel={() => setOpenExistingTimelineModal(false)}
        className="modal-container"
        footer={
          allProjectsTimelines.length > 0 ? (
            <Button
              key="save"
              onClick={handleLinkProjectTimeline}
              className="bg-secondary"
            >
              Save
            </Button>
          ) : (
            <Button
              key="create"
              onClick={() => { setIsMenualTimeline(true); setOpenExistingTimelineModal(false) }}
              type="primary"
              className="bg-secondary"
            >
              Create Manually
            </Button>
          )
        }
      >
        <div style={{ padding: "0px 10px 10px 5px" }}>
          <div className="filters" style={{ marginTop: "8px" }}>
            {allProjectsTimelines.length > 0 ? (
              <>
                <span style={{ marginLeft: "10px", fontSize: "16px", fontWeight: "400" }}>Select Project</span>
                <Select
                  placeholder="Select Project"
                  disabled={isUpdateMode}
                  value={selectedExistingProjectId}
                  onChange={handleExistingProjectChange}
                  style={{ width: "100%" }}
                  allowClear={true}
                >
                  {/* {(allProjectsTimelines.filter((projects: any) => projects.projectParameters.typeOfMine === selectedProject?.projectParameters?.typeOfMine &&
                    projects.initialStatus.library === selectedProject?.projects?.initialStatus?.library)).map((project) => (
                      <Option key={project.id} value={project.id}>
                        {project.projectParameters.projectName}
                      </Option>
                    ))} */}
                  {allProjectsTimelines.map((project) => (
                    <Option key={project.id} value={project.id}>
                      {project.projectParameters.projectName}
                    </Option>
                  ))}
                </Select>
                <Button
                  type="primary"
                  disabled={!selectedExistingProjectId}
                  icon={<ToolOutlined />}
                  onClick={() => navigate("/create/project-timeline", { state: { selectedExistingProject } })}
                  style={{ marginLeft: "15px", backgroundColor: "#d35400" }}
                >
                  View Timeline
                </Button>
              </>
            ) : (
              <p style={{ marginLeft: "10px", marginTop: "10px" }}>No existing project timelines found.</p>
            )}
          </div>
        </div>
        <hr />
      </Modal>
    </>
  );
};

export default TimeBuilder;