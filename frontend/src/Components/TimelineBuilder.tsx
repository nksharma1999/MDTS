import { useEffect, useState } from "react";
import { Input, DatePicker, Select, Table, Button, Checkbox, Steps } from "antd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "../styles/time-builder.css";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

const { Option } = Select;
const { Step } = Steps;

interface Activity {
  code: string;
  activity: string;
  prerequisite: string;
  slack: string;
  start: string | null;
}

interface Module {
  code: string;
  name: string;
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

const modulesData: Module[] = [
  {
    code: "CF",
    name: "Contract Formulation",
    activities: [
      { code: "FC/PR/CA/010", activity: "Issuance of SO to Land Aggregators", prerequisite: "", slack: "", start: "" },
      { code: "FC/PR/CA/020", activity: "Issuance of SO to an advocate for legal due diligence", prerequisite: "", slack: "", start: "" },
      { code: "FC/PR/CA/040", activity: "Identification of land and collection of P2 Documents", prerequisite: "FC/PR/CA/010", slack: "", start: "" },
    ],
  },
  {
    code: "BP",
    name: "Budgetary Plan",
    activities: [
      { code: "BP/010", activity: "Preparation of NFA for interim budget", prerequisite: "", slack: "", start: "" },
      { code: "BP/020", activity: "Approval of Interim Budget", prerequisite: "", slack: "", start: "" },
      { code: "BP/030", activity: "Preparation of DPR", prerequisite: "", slack: "", start: "" },
    ],
  },
  {
    code: "BC",
    name: "Boundary Coordinate Certification by CMPDI",
    activities: [
      { code: "BC/010", activity: "Mobilization of CMPDI to the site to ascertain boundary coordinates", prerequisite: "", slack: "", start: "" },
      { code: "BC/020", activity: "Completion of Survey by CMPDI", prerequisite: "", slack: "", start: "" },
      { code: "BC/030", activity: "Receipt of Certified Boundary Coordinates by CMPDI", prerequisite: "", slack: "", start: "" },
    ],
  },
  {
    code: "DG",
    name: "DGPS Survey, Land Schedule and Cadestral Map",
    activities: [
      { code: "BC/010", activity: "Mobilization of CMPDI to the site to ascertain boundary coordinates", prerequisite: "", slack: "", start: "" },
      { code: "BC/020", activity: "Completion of Survey by CMPDI", prerequisite: "", slack: "", start: "" },
      { code: "BC/030", activity: "Receipt of Certified Boundary Coordinates by CMPDI", prerequisite: "", slack: "", start: "" },
    ],
  },
  {
    code: "GR",
    name: "Geological Report",
    activities: [{ code: "BC/010", activity: "Mobilization of CMPDI to the site to ascertain boundary coordinates", prerequisite: "", slack: "", start: "" },
    { code: "BC/020", activity: "Completion of Survey by CMPDI", prerequisite: "", slack: "", start: "" },],
  },
  {
    code: "FC",
    name: "Forest Clearance",
    activities: [{ code: "BC/010", activity: "Mobilization of CMPDI to the site to ascertain boundary coordinates", prerequisite: "", slack: "", start: "" },
    { code: "BC/020", activity: "Completion of Survey by CMPDI", prerequisite: "", slack: "", start: "" },],
  },
];

const initialModules = [
  {
    name: "Contract Formulation",
    moduleCode: "CF",
    activities: [
      {
        SrNo: "CF",
        Code: "CF/010",
        keyActivity: "Declaration as H1 Bidder",
        duration: 0,
        preRequisite: "",
        slack: "",
        plannedStart: "5 Mar 25",
        plannedFinish: "5 Mar 25",
        activityStatus: "Completed",
        actualStart: "",
        actualFinish: "",
        actualDuration: "Auto",
        remarks: "",
        expectedStart: "",
        expectedFinish: "Auto",
      },
      {
        SrNo: "CF",
        Code: "CF/020",
        keyActivity: "Signing of CBPDA",
        duration: 6,
        preRequisite: "CF/010",
        slack: "",
        plannedStart: "6 Mar 25",
        plannedFinish: "5 Apr 25",
        activityStatus: "In progress",
        actualStart: "",
        actualFinish: "",
        actualDuration: "Auto",
        remarks: "",
        expectedStart: "Auto",
        expectedFinish: "Auto",
      },
    ],
  },
  {
    name: "Budgetary Planning",
    moduleCode: "BP",
    activities: [
      {
        SrNo: "BP",
        Code: "BP/010",
        keyActivity: "Preparation of NFA for interim budget",
        duration: 15,
        preRequisite: "CF/010",
        slack: 15,
        plannedStart: "21 Mar 25",
        plannedFinish: "",
        activityStatus: "Yet to Start",
        actualStart: "",
        actualFinish: "",
        actualDuration: "",
        remarks: "",
        expectedStart: "",
        expectedFinish: "",
      },
    ],
  },
  {
    name: "Budgetary Planning",
    moduleCode: "BP",
    activities: [
      {
        SrNo: "BP",
        Code: "BP/010",
        keyActivity: "Preparation of NFA for interim budget",
        duration: 15,
        preRequisite: "CF/010",
        slack: 15,
        plannedStart: "21 Mar 25",
        plannedFinish: "",
        activityStatus: "Yet to Start",
        actualStart: "",
        actualFinish: "",
        actualDuration: "",
        remarks: "",
        expectedStart: "",
        expectedFinish: "",
      },
    ],
  },
];

const statusUpdateColumns: ColumnsType = [
  { title: "Sr No", dataIndex: "Code", key: "Code", width: 100, align: "center" },
  { title: "Key Activity", dataIndex: "keyActivity", key: "keyActivity", width: 250, align: "left" },
  { title: "Duration", dataIndex: "duration", key: "duration", width: 80, align: "center" },
  { title: "Pre-Requisite", dataIndex: "preRequisite", key: "preRequisite", width: 120, align: "center" },
  { title: "Slack", dataIndex: "slack", key: "slack", width: 80, align: "center" },
  { title: "Planned Start", dataIndex: "plannedStart", key: "plannedStart", width: 120, align: "center" },
  { title: "Planned Finish", dataIndex: "plannedFinish", key: "plannedFinish", width: 120, align: "center" },
  { title: "Activity Status", dataIndex: "activityStatus", key: "activityStatus", width: 150, align: "center" },
];

const TimeBuilder = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [sequencedModules, setSequencedModules] = useState<Module[]>(modulesData);
  const [activitiesData, setActivitiesData] = useState<Activity[]>(modulesData.flatMap((module) => module.activities));
  const [holidayData, setHolidayData] = useState<HolidayData[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [expandedKeys, setExpandedKeys] = useState(initialModules.map((_, index) => `module-${index}`));
  const dataSource = initialModules.map((module, moduleIndex) => ({
    key: `module-${moduleIndex}`,
    SrNo: module.moduleCode,
    Code: module.moduleCode,
    keyActivity: module.name,
    duration: "",
    preRequisite: "",
    slack: "",
    plannedStart: "",
    plannedFinish: "",
    activityStatus: "",
    actualStart: "",
    actualFinish: "",
    actualDuration: "",
    remarks: "",
    expectedStart: "",
    expectedFinish: "",
    isModule: true,
    children: module.activities.map((activity, actIndex) => ({
      key: `activity-${moduleIndex}-${actIndex}`,
      ...activity,
      isModule: false,
    })),
  }));

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
  }, []);

  const toggleCheckbox = (key: string) => {
    setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
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

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    } else {
      window.location.href = "/create/status-update";
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleActivitySelection = (activityCode: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedActivities([...selectedActivities, activityCode]);
    } else {
      setSelectedActivities(selectedActivities.filter((code) => code !== activityCode));
    }
  };

  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>(
    modulesData.map((module) => module.code)
  );

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(sequencedModules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSequencedModules(items);
  };

  const handleSlackChange = (code: string, value: string) => {
    const updatedActivities = activitiesData.map((activity) =>
      activity.code === code ? { ...activity, slack: value } : activity
    );
    setActivitiesData(updatedActivities);
  };

  const handleStartDateChange = (code: string, date: string) => {
    const updatedActivities = activitiesData.map((activity) =>
      activity.code === code ? { ...activity, start: date } : activity
    );
    setActivitiesData(updatedActivities);
  };

  const getColumnsForStep = (step: number) => {
    const baseColumns: any = [
      { dataIndex: "activity", key: "activity", width: "50%", align: "left" },
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

    if (step >= 2) {
      baseColumns.push({
        key: "prerequisite",
        render: (_: any, record: any) => (
          <Input
            placeholder="Prerequisite"
            value={record.prerequisite}
            onChange={(e) => {
              const updatedActivities = activitiesData.map((activity) =>
                activity.code === record.code ? { ...activity, prerequisite: e.target.value } : activity
              );
              setActivitiesData(updatedActivities);
            }}
            disabled={step !== 2}
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
            onChange={(e) => handleSlackChange(record.code, e.target.value)}
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

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: "100%" }} className="time-builder-page">
          <div className="title-and-filter">
            <div className="heading">
              <span>Timeline Builder</span>
            </div>
            <div className="filters">
              {currentStep === 0 && (
                <>
                  <Select placeholder="Select Project" style={{ width: 200 }}>
                    <Option value="proj1">Project 1</Option>
                    <Option value="proj2">Project 2</Option>
                  </Select>
                  <Select placeholder="Select Library" style={{ width: 200 }}>
                    <Option value="lib1">Library 1</Option>
                    <Option value="lib2">Library 2</Option>
                  </Select>
                  <Input value="Mine Type Auto-filled" disabled style={{ width: 200 }} />
                </>
              )}
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
                          <Draggable key={module.code} draggableId={module.code} index={index}>
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
                                <strong>{module.code}</strong> - {module.name}
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
              ) : currentStep === 6 ? (
                <div style={{ overflowX: "hidden" }}>
                  <Table
                    columns={statusUpdateColumns}
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
                            : expandedKeys.filter((key) => key !== record.key)
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
                  columns={[{ title: "Module", dataIndex: "name", key: "name" }]}
                  className="custom-table-heading"
                  dataSource={sequencedModules}
                  pagination={false}
                  sticky
                  showHeader={false}
                  rowClassName={(record) => (record.activities ? "module-heading" : "")}
                  expandedRowKeys={expandedRowKeys}
                  onExpand={(expanded, record) => {
                    if (expanded) {
                      setExpandedRowKeys([...expandedRowKeys, record.code]);
                    } else {
                      setExpandedRowKeys(expandedRowKeys.filter((key) => key !== record.code));
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
                      />
                    ),
                    rowExpandable: (module) => module.activities.length > 0,
                  }}
                  style={{ overflowX: "hidden" }}
                  rowKey="code"
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
                {currentStep === 7 ? "Submit" : "Next"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TimeBuilder;