import { useState } from "react";
import { Input, DatePicker, Select, Table, Button, Checkbox, Steps } from "antd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
const { Option } = Select;
const { Step } = Steps;
import { ColumnsType } from 'antd/es/table';
import "../styles/time-builder.css";
import ImageContainer from "./ImageContainer";

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

const modulesData = [
  {
    code: "CF", name: "Contract Formulation", activities: [
      { code: "FC/PR/CA/010", activity: "Issuance of SO to Land Aggregators", prerequisite: "", slack: "", start: "" },
      { code: "FC/PR/CA/020", activity: "Issuance of SO to an advocate for legal due diligence", prerequisite: "", slack: "", start: "" },
      { code: "FC/PR/CA/040", activity: "Identification of land and collection of P2 Documents", prerequisite: "FC/PR/CA/010", slack: "", start: "" },
    ]
  },
  {
    code: "BP", name: "Bugetary Plan", activities: [
      { code: "BP/010", activity: "Preparation of NFA for interim budget", prerequisite: "", slack: "", start: "" },
      { code: "BP/020", activity: "Approval of Interim Budget", prerequisite: "", slack: "", start: "" },
      { code: "BP/030", activity: "Preparation of DPR", prerequisite: "", slack: "", start: "" },
    ]
  },
  {
    code: "BC", name: "Boundary Coordinate Certification by CMPDI", activities: [
      { code: "BC/010", activity: "Mobilization of CMPDI to the site to ascertain boundary coordinates", prerequisite: "", slack: "", start: "" },
      { code: "BC/020", activity: "Completion of Survey by CMPDI", prerequisite: "", slack: "", start: "" },
      { code: "BC/030", activity: "Receipt of Certified Boundary Coordinates by CMPDI", prerequisite: "", slack: "", start: "" },
    ]
  },
  {
    code: "DG", name: "DGPS Survey, Land Schedule and Cadestral Map", activities: [

    ]
  },
  {
    code: "GR", name: "Geological Report", activities: [

    ]
  },
  {
    code: "FC", name: "Forest Clearance", activities: [

    ]
  }
];

const TimeBuilder = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [sequencedModules, setSequencedModules] = useState<Module[]>(modulesData);
  const [activitiesData, setActivitiesData] = useState<Activity[]>(modulesData.flatMap(module => module.activities));

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      window.location.href = "/create/status-update";
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleActivitySelection = (activityCode: any, isChecked: any) => {
    if (isChecked) {
      setSelectedActivities([...selectedActivities, activityCode]);
    } else {
      setSelectedActivities(selectedActivities.filter((code: any) => code !== activityCode));
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(sequencedModules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSequencedModules(items);
  };

  const handleSlackChange = (code: any, value: any) => {
    const updatedActivities = activitiesData.map((activity: any) =>
      activity.code === code ? { ...activity, slack: value } : activity
    );
    setActivitiesData(updatedActivities);
  };

  const handleStartDateChange = (code: any, date: any) => {
    const updatedActivities = activitiesData.map((activity: any) =>
      activity.code === code ? { ...activity, start: date } : activity
    );
    setActivitiesData(updatedActivities);
  };

  const getColumnsForStep = (step: any) => {
    if (step === 0) {
      return [
        { title: 'Module Code', dataIndex: 'code', key: 'code' },
        { title: 'Module Name', dataIndex: 'name', key: 'name' },
      ];
    }

    const baseColumns: ColumnsType<any> = [
      { title: 'Activity', dataIndex: 'activity', key: 'activity', width: "50%" },
    ];

    if (step === 1) {
      baseColumns.push({
        title: 'Finalize',
        key: 'finalize',
        align: "center",
        render: (_: any, record: any) => (
          <Checkbox
            checked={selectedActivities.includes(record.code)}
            onChange={(e) => handleActivitySelection(record.code, e.target.checked)}
            disabled={step !== currentStep}
          />
        ),
      });
    }

    if (step >= 2) {
      baseColumns.push({
        title: 'Prerequisite',
        key: 'prerequisite',
        render: (_: any, record) => (
          <Input
            placeholder="Prerequisite"
            value={record.prerequisite}
            onChange={(e) => {
              const updatedActivities = activitiesData.map(activity =>
                activity.code === record.code ? { ...activity, prerequisite: e.target.value } : activity
              );
              setActivitiesData(updatedActivities);
            }}
            disabled={step !== currentStep}
          />
        ),
      });
    }

    if (step >= 3) {
      baseColumns.push({
        title: 'Slack',
        key: 'slack',
        render: (_: any, record) => (
          <Input
            placeholder="Slack"
            value={record.slack}
            onChange={(e) => handleSlackChange(record.code, e.target.value)}
            disabled={step !== currentStep}
          />
        ),
      });
    }

    if (step >= 4) {
      baseColumns.push({
        title: 'Start Date',
        key: 'start',
        render: (_, record) => (
          <DatePicker
            placeholder="Start Date"
            value={record.start}
            onChange={(date) => handleStartDateChange(record.code, date)}
            disabled={step !== currentStep}
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
              <span>Time Builder</span>
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
            </Steps>
          </div>

          <div className="main-item-container">
            <div
              className="timeline-items"
              style={{ padding: currentStep > 0 ? "0px" : "10px" }}
            >
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
                                  margin: "8px 0",
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
              ) : (
                <Table
                  columns={getColumnsForStep(currentStep)}
                  dataSource={activitiesData}
                  pagination={false}
                  bordered
                  sticky
                />
              )}

            </div>
            <div className={`action-buttons ${currentStep === 0 ? "float-right" : ""}`}>
              {currentStep > 0 && (
                <Button className="bg-tertiary" onClick={handlePrev} style={{ marginRight: 8 }} size="small">Previous</Button>
              )}
              <Button className="bg-secondary" onClick={handleNext} type="primary" size="small">
                {currentStep === 4 ? 'Submit' : 'Next'}
              </Button>
            </div>
          </div>
        </div>
        <div>
          <ImageContainer imageUrl="/images/auths/m5.jpg" />
        </div>
      </div>
    </>
  );
};

export default TimeBuilder;