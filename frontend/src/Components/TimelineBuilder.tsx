import { useEffect, useState } from "react";
import { Input, DatePicker, Select, Table, Button, Checkbox, Steps, Modal, message, Result } from "antd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "../styles/time-builder.css";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
const { Option } = Select;
const { Step } = Steps;
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import { FolderOpenOutlined } from "@mui/icons-material";
import { CalendarOutlined } from "@ant-design/icons";
import moment from 'moment';
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
  title: string;
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
  const [activitiesData, setActivitiesData] = useState<Activity[]>([]);
  const [holidayData, setHolidayData] = useState<HolidayData[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<any>([]);
  const [dataSource, setDataSource] = useState<any>([]);
  const [finalData, setFinalData] = useState<Module[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [libraryName, setLibraryName] = useState<any>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProjectMineType, setSelectedProjectMineType] = useState("");
  const navigate = useNavigate();
  const [finalHolidays, setFinalHolidays] = useState<HolidayData[]>();
  const [isSaturdayWorking, setIsSaturdayWorking] = useState(false);
  const [isSundayWorking, setIsSundayWorking] = useState(false);

  useEffect(() => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = loggedInUser.id;
      const userProjectsKey = `projects_${userId}`;
      const storedData = JSON.parse(localStorage.getItem(userProjectsKey) || "[]");

      if (!Array.isArray(storedData) || storedData.length === 0) {
        setAllProjects([]);
        return;
      }
      setAllProjects(storedData);
      if (storedData && Array.isArray(storedData) && storedData.length === 1) {
        const firstProject = storedData[0];

        if (firstProject && firstProject.id) {
          setSelectedProjectId(firstProject.id);

          const project = storedData.find((p) => p?.id === firstProject.id);

          if (project && project.initialStatus) {
            const selectedProjectLibrary = project.initialStatus.library || [];
            setLibraryName(selectedProjectLibrary);

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
    console.log(finalHolidays);

  }, [isSaturdayWorking, isSundayWorking, finalHolidays]);

  const toggleCheckbox = (key: string) => {
    setSelected((prev) => {
      const updatedSelected = { ...prev, [key]: !prev[key] };

      // Filter holidays that are still checked (true)
      const updatedHolidays = holidayData.filter((holiday) => updatedSelected[holiday.key]);

      console.log("Checked Holidays:", updatedHolidays);

      // Update final holidays list
      setFinalHolidays(updatedHolidays);

      // Update finalData modules with new holiday list
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
      console.log(sequencedModules);
    } else {
      setIsModalVisible(true);
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

  const handleSlackChange = (code: string, value: string) => {
    const updatedActivities = activitiesData.map((activity) =>
      activity.code === code ? { ...activity, slack: value } : activity
    );
    setActivitiesData(updatedActivities);

    const updatedModules = finalData.map((module) => ({
      ...module,
      activities: module.activities.map((activity) =>
        activity.code === code ? { ...activity, slack: value } : activity
      ),
    }));
    setFinalData(updatedModules);

    const updatedSequencedModules = sequencedModules.map((module) => ({
      ...module,
      activities: module.activities.map((activity) =>
        activity.code === code ? { ...activity, slack: value } : activity
      ),
    }));
    setSequencedModules(updatedSequencedModules);
  };

  const addBusinessDays = (startDate: any, days: any) => {
    let date = startDate;
    let addedDays = 0;
    let holidays = [];

    while (addedDays < days) {
      date = date.add(1, "day");

      const isSaturday = date.day() === 6;
      const isSunday = date.day() === 0;
      const isHoliday = finalHolidays?.some((holiday) => {
        const holidayDate = moment(holiday.from).format("YYYY-MM-DD");
        return holidayDate === date.format("YYYY-MM-DD");
      });

      if (
        (isSaturday && !isSaturdayWorking) ||
        (isSunday && !isSundayWorking)
      ) {
        holidays.push({ date: date.format("YYYY-MM-DD"), reason: "Weekend" });
      } else if (isHoliday) {
        holidays.push({
          date: date.format("YYYY-MM-DD"),
          reason: "Holiday",
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
    saveAs(blob, "activity_data.xlsx");
    message.success("Download started!");
    setIsModalVisible(false);
  };

  const holidayColumns: ColumnsType<HolidayData> = [
    {
      title: "From Date",
      dataIndex: "from",
      key: "from",
      render: (text) => dayjs(text).format("DD-MM-YYYY"),
    },
    {
      title: "To Date",
      dataIndex: "to",
      key: "to",
      align: "left",
      render: (text) => dayjs(text).format("DD-MM-YYYY"),
    },
    {
      title: "Holiday Name",
      dataIndex: "holiday",
      key: "holiday",
      align: "left",
    },
    {
      title: "Module Name",
      dataIndex: "module",
      key: "module",
      align: "left",
      render: (modules) => modules.join(", "),
    },
    {
      title: "Impact",
      dataIndex: "impact",
      key: "impact",
      align: "left",
      render: (impact) => Object.values(impact).join(", "),
    },
    {
      title: "✔",
      key: "checkbox",
      width: 50,
      align: "center",
      render: (_, record) => (
        <Checkbox checked={selected[record.key]} onChange={() => toggleCheckbox(record.key)} />
      ),
    },
  ];

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
            defaultValue={0}
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
            value={record.prerequisite == "" ? record.start : ''}
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

    return columns;
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: "100%" }} className="time-builder-page">
          <div className="title-and-filter">
            <div className="heading">
              <span>Timeline Builder</span>
            </div>
            {allProjects.length > 0 && (
              <div className="filters">
                <Select
                  placeholder="Select Project"
                  value={selectedProjectId}
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
            )}
          </div>
          <hr style={{ margin: 0 }} />
          {allProjects.length > 0 && (
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

          {allProjects.length > 0 ? (
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
                        <Table className="project-timeline-table" dataSource={holidayData} columns={holidayColumns} pagination={false} />
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
                  <Table
                    columns={getOuterTableColumns(currentStep)}
                    className="project-timeline-table"
                    dataSource={sequencedModules}
                    pagination={false}
                    sticky={{ offsetHeader: 0 }}
                    rowClassName={(record) => (record.activities ? "module-heading" : "")}
                    expandedRowKeys={expandedRowKeys}
                    onExpand={(expanded, record) => {
                      if (expanded) {
                        setExpandedRowKeys([...expandedRowKeys, record.parentModuleCode]);
                      } else {
                        setExpandedRowKeys(expandedRowKeys.filter((key) => key !== record.parentModuleCode));
                      }
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
                          style={{ marginBottom: "10px" }}
                          scroll={{ x: "hidden" }}
                        />
                      ),
                      rowExpandable: (module) => module.activities.length > 0,
                    }}
                    scroll={{ y: 290, x: "hidden" }}
                    style={{ overflowX: "hidden" }}
                    rowKey="parentModuleCode"
                  />
                )}
              </div>
              <hr />
              <div className={`action-buttons ${currentStep === 0 ? "float-right" : ""}`}>
                {currentStep > 0 && (
                  <Button className="bg-tertiary" onClick={handlePrev} style={{ marginRight: 8 }} size="small">
                    Previous
                  </Button>
                )}
                <Button disabled={selectedProjectId == null} className="bg-secondary" onClick={handleNext} type="primary" size="small">
                  {currentStep === 7 ? "Download" : currentStep === 6 ? "Mark as Reviewed" : "Next"}
                </Button>
              </div>
            </div>
          ) : <div className="contaainer">
            <div className="no-project-message">
              <FolderOpenOutlined style={{ fontSize: "16px", color: "#1890ff" }} />
              <h3>No Projects Found</h3>
              <p>You need to create a project for defining timeline.</p>
              <button onClick={() => navigate("/create/register-new-project")}>Create Project</button>
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
      >
        <p>Are you sure you want to download the data in Excel format?</p>
      </Modal>
    </>
  );
};

export default TimeBuilder;