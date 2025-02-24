import { useEffect, useState } from "react";
import { Input, DatePicker, Select, Table, Button, Checkbox, Steps, Modal, message } from "antd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "../styles/time-builder.css";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
const { Option } = Select;
const { Step } = Steps;
import ExcelJS from "exceljs";

import { saveAs } from "file-saver";

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
  render?: (value: any) => string;
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
  const [_selectedProjectId, setSelectedProjectId] = useState(null);
  const [libraryNames, setLibraryNames] = useState<any>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProjectMineType, setSelectedProjectMineType] = useState("");

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
      setSelected(Object.fromEntries(parsedData.map((item) => [item.key, true])));
    }

    // if (storedModuleData) {
    //   const parsedModules = JSON.parse(storedModuleData);
    //   setSequencedModules(parsedModules);
    //   setModules(parsedModules);
    //   const allActivityCodes = parsedModules.flatMap((module: any) =>
    //     module.activities.map((activity: any) => activity.code)
    //   );

    //   setActivitiesData(parsedModules.flatMap((module: any) => module.activities));
    //   setSelectedActivities(allActivityCodes);
    // }
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
              slack: activity.slack ?? "",
              plannedStart: activity.start ? new Date(activity.start).toISOString().split("T")[0] : "-",
              plannedFinish: activity.end ? new Date(activity.end).toISOString().split("T")[0] : "-",
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

  const toggleCheckbox = (key: string) => {
    setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
    const canceledHolidays = holidayData.filter((holiday) => !selected[holiday.key]);
    const updatedModules = finalData.map((module) => ({
      ...module,
      holidays: canceledHolidays,
    }));
    setFinalData(updatedModules);
  };

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsModalVisible(true);
      // window.location.href = "/create/status-update";
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

  const handleStartDateChange = (code: string, date: dayjs.Dayjs) => {
    const updatedActivities: any = activitiesData.map((activity) => {
      if (activity.code === code) {
        const duration = activity.duration || 0;
        const endDate = date.add(duration + 1);
        return { ...activity, start: date, end: endDate };
      }
      return activity;
    });
    setActivitiesData(updatedActivities);

    const updatedModules: any = finalData.map((module) => ({
      ...module,
      activities: module.activities.map((activity) => {
        if (activity.code === code) {
          const duration = activity.duration || 0;
          const endDate = date.add(duration + 1, "day");
          return { ...activity, start: date, end: endDate };
        }
        return activity;
      }),
    }));
    setFinalData(updatedModules);

    const updatedSequencedModules: any = sequencedModules.map((module) => ({
      ...module,
      activities: module.activities.map((activity) => {
        if (activity.code === code) {
          const duration = activity.duration || 0;
          const endDate = date.add(duration + 1, "day");
          return { ...activity, start: date, end: endDate };
        }
        return activity;
      }),
    }));
    setSequencedModules(updatedSequencedModules);
  };

  const handleActivitySelection = (activityCode: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedActivities([...selectedActivities, activityCode]);
    } else {
      setSelectedActivities(selectedActivities.filter((code) => code !== activityCode));
    }
    const updatedModules = finalData.map((module) => ({
      ...module,
      activities: module.activities.filter((activity) => selectedActivities.includes(activity.code))
    }));
    setFinalData(updatedModules);
  };

  const getColumnsForStep = (step: number) => {
    const baseColumns: any = [
      { dataIndex: "activityName", key: "activityName", width: "50%", align: "left" },
    ];

    if (step >= 1) {
      baseColumns.push({
        key: "finalize",
        align: "center",
        render: (_: any, record: any) => (
          <Checkbox
            checked={selectedActivities.includes(record.code)}
            onChange={(e) => handleActivitySelection(record.code, e.target.checked)}
            disabled={step !== 1}
          />
        ),
      });
    }

    // if (step >= 2) {
    //   baseColumns.push({
    //     key: "prerequisite",
    //     render: (_: any, record: any) => (
    //       <Input
    //         placeholder="Prerequisite"
    //         value={record.prerequisite}
    //         onChange={(e) => {
    //           console.log(activitiesData);

    //           const updatedActivities = activitiesData.map((activity) =>
    //             activity.code === record.code ? { ...activity, prerequisite: e.target.value } : activity
    //           );
    //           setActivitiesData(updatedActivities);
    //         }}
    //         disabled={step !== 2}
    //       />
    //     ),
    //   });
    // }

    if (step >= 2) {
      baseColumns.push({
        key: "prerequisite",
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
              { value: "", label: "None" },
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
        render: (_: any, record: any) => (
          <Input
            placeholder="Slack"
            value={record.slack}
            type="number"
            defaultValue={0}
            onChange={(e) => handleSlackChange(record.code, e.target.value)}
            onKeyDown={(e) => {
              if (!/^\d$/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== "ArrowLeft" && e.key !== "ArrowRight") {
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
        render: (_: any, record: any) => (
          <DatePicker
            placeholder="Start Date"
            value={record.start}
            onChange={(date) => handleStartDateChange(record.code, date)}
            disabled={step !== 4}
          />
        ),
      });
    }

    return baseColumns;
  };

  const handleProjectChange = (projectId: any) => {
    setSelectedProjectId(projectId);
    const project = allProjects.find((p) => p.id === projectId);
    if (project) {
      const libraries = Object.keys(project.initialStatus).filter(
        (lib) => project.initialStatus[lib] === "Yes"
      );
      setLibraryNames(libraries);
      setSelectedProjectMineType(project.projectParameters.typeOfMine)
    } else {
      setLibraryNames([]);
    }
  };

  const handleLibraryChange = (selectedLibrary: string) => {
    const userId = JSON.parse(localStorage.getItem("user") || "{}")?.id;
    const storedLibraryData = userId && localStorage.getItem(`libraries_${userId}`);

    if (storedLibraryData) {
      const parsedLibraryData = JSON.parse(storedLibraryData);

      const library = parsedLibraryData.find((lib: any) => lib.name === selectedLibrary);

      if (library) {
        setSequencedModules(library.items);
        setModules(library.items);
        const allActivityCodes = library.items.flatMap((module: any) =>
          module.activities.map((activity: any) => activity.code)
        );

        setActivitiesData(library.items.flatMap((module: any) => module.activities));
        setSelectedActivities(allActivityCodes);

      } else {
        setSequencedModules([]);
        setModules([]);
        setActivitiesData([]);
        setSelectedActivities([]);
      }
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
      "Planned Finish",
      "Activity Status",
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
          activity.start ? new Date(activity.start).toISOString().split("T")[0] : "-",
          activity.end ? new Date(activity.end).toISOString().split("T")[0] : "-",
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

  const columns: ColumnsType<HolidayData> = [
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
    { title: "Planned Finish", dataIndex: "plannedFinish", key: "plannedFinish", width: 120, align: "center" },
    { title: "Activity Status", dataIndex: "activityStatus", key: "activityStatus", width: 150, align: "center" },
  ];

  const getOuterTableColumns = (step: number): Column[] => {
    let columns: Column[] = [
      { title: "Key Activity", width: "48%", dataIndex: "moduleName", key: "moduleName" },
    ];

    if (step >= 1) {
      columns.push({ title: "Finalize", align: "center", dataIndex: "finalize", key: "finalize" });
    }
    if (step >= 2) {
      columns.push({
        title: "Prerequisite",
        dataIndex: "prerequisite",
        key: "prerequisite",
        align: "center",
        render: (prerequisite) => (prerequisite?.code ? prerequisite.code : "-"),
      });
    }
    if (step >= 3) {
      columns.push({ title: "Slack", dataIndex: "slack", key: "slack" });
    }
    if (step >= 4) {
      columns.push({ title: "Start Date", dataIndex: "startDate", key: "startDate" });
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
            <div className="filters">
              <Select
                placeholder="Select Project"
                style={{ width: 200 }}
                onChange={handleProjectChange}
              >
                {allProjects.map((project) => (
                  <Option key={project.id} value={project.id}>
                    {project.projectParameters.projectName}
                  </Option>
                ))}
              </Select>

              <Select
                placeholder="Select Library"
                style={{ width: 200 }}
                onChange={handleLibraryChange}
              >
                {libraryNames.map((library: any) => (
                  <Option key={library} value={library}>
                    {library}
                  </Option>
                ))}
              </Select>
              <Input value={selectedProjectMineType} placeholder="Project Mine Type" disabled style={{ width: 200 }} />
            </div>
          </div>
          <hr style={{ margin: 0 }} />
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
                  <Table className="project-timeline-table" dataSource={holidayData} columns={columns} pagination={false} />
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
              <Button className="bg-secondary" onClick={handleNext} type="primary" size="small">
                {currentStep === 7 ? "Download" : currentStep === 6 ? "Mark as Reviewed" : "Next"}
              </Button>
            </div>
          </div>
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