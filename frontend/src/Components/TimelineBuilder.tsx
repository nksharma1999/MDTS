import React, { useState } from "react";
import { Input, DatePicker, Select, Table, Button, Typography, Checkbox, Steps } from "antd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
const { Option } = Select;
const { Title } = Typography;
const { Step } = Steps;

const modulesData = [
  { code: "CF", name: "Contract Formulation", activities: [
      { code: "FC/PR/CA/010", activity: "Issuance of SO to Land Aggregators", prerequisite: "", slack: "", start: "" },
      { code: "FC/PR/CA/020", activity: "Issuance of SO to an advocate for legal due diligence", prerequisite: "", slack: "", start: "" },
      { code: "FC/PR/CA/040", activity: "Identification of land and collection of P2 Documents", prerequisite: "FC/PR/CA/010", slack: "", start: "" },
  ] },
  { code: "BP", name: "Bugetary Plan", activities: [
      { code: "BP/010", activity: "Preparation of NFA for interim budget", prerequisite: "", slack: "", start: "" },
      { code: "BP/020", activity: "Approval of Interim Budget", prerequisite: "", slack: "", start: "" },
      { code: "BP/030", activity: "Preparation of DPR", prerequisite: "", slack: "", start: "" },
  ] },
  { code: "BC", name: "Boundary Coordinate Certification by CMPDI", activities: [
    { code: "BC/010", activity: "Mobilization of CMPDI to the site to ascertain boundary coordinates", prerequisite: "", slack: "", start: "" },
    { code: "BC/020", activity: "Completion of Survey by CMPDI", prerequisite: "", slack: "", start: "" },
    { code: "BC/030", activity: "Receipt of Certified Boundary Coordinates by CMPDI", prerequisite: "", slack: "", start: "" },
  ] },
  { code: "DG", name: "DGPS Survey, Land Schedule and Cadestral Map", activities: [
    
  ] },
  { code: "GR", name: "Geological Report", activities: [
   
  ] },
  { code: "FC", name: "Forest Clearance", activities: [
    
  ] }
];

const TimeBuilder = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [sequencedModules, setSequencedModules] = useState(modulesData); // Use modulesData for Step 1
  const [activitiesData, setActivitiesData] = useState(modulesData.flatMap(module => module.activities));

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

  const handleActivitySelection = (activityCode:any, isChecked:any) => {
    if (isChecked) {
      setSelectedActivities([...selectedActivities, activityCode]);
    } else {
      setSelectedActivities(selectedActivities.filter(code => code !== activityCode));
    }
  };

  const onDragEnd = (result:any) => {
    if (!result.destination) return;

    const items = Array.from(sequencedModules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSequencedModules(items);
  };

  const handleSlackChange = (code:any, value:any) => {
    const updatedActivities = activitiesData.map(activity => 
      activity.code === code ? { ...activity, slack: value } : activity
    );
    setActivitiesData(updatedActivities);
  };

  const handleStartDateChange = (code:any, date:any) => {
    const updatedActivities = activitiesData.map(activity => 
      activity.code === code ? { ...activity, start: date } : activity
    );
    setActivitiesData(updatedActivities);
  };

  const getColumnsForStep = (step:any) => {
    if (step === 0) {
      return [
        { title: 'Module Code', dataIndex: 'code', key: 'code' },
        { title: 'Module Name', dataIndex: 'name', key: 'name' },
      ];
    }

    const baseColumns = [
      { title: 'Activity', dataIndex: 'activity', key: 'activity' },
    ];

    if (step === 1) {
      baseColumns.push({
        title: 'Finalize',
        key: 'finalize',
        render: (_:any, record:any) => (
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
        render: (_:any, record) => (
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
        render: (_:any, record) => (
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
    <div style={{ padding: "50px", backgroundColor: "", borderRadius: 8 ,width:"70%"}}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 20 }}>Time Builder</Title>
      <Steps current={currentStep} style={{ marginBottom: 20 }}>
        <Step title="Sequencing" />
        <Step title="Finalize Activities" />
        <Step title="Prerequisites" />
        <Step title="Slack" />
        <Step title="Start Date" />
      </Steps>

      {/* Show Select Project, Select Library, and Mine Type only on Step 1 */}
      {currentStep === 0 && (
        <>
          <Select placeholder="Select Library" style={{ width: 200, marginBottom: 10 }}>
            <Option value="lib1">Library 1</Option>
            <Option value="lib2">Library 2</Option>
          </Select>
          <Select placeholder="Select Project" style={{ width: 200, marginBottom: 20 }}>
            <Option value="proj1">Project 1</Option>
            <Option value="proj2">Project 2</Option>
          </Select>
          <Input value="Mine Type Auto-filled" disabled style={{ width: 200, marginBottom: 10 }} />
        </>
      )}

      {/* Render the table with accumulated columns */}
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
                          padding: "16px",
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
        />
      )}

      <div style={{ marginTop: "8px", textAlign: 'right' }}>
        {currentStep > 0 && (
          <Button onClick={handlePrev} style={{ marginRight: 8 }} size="large">Previous</Button>
        )}
        <Button onClick={handleNext} type="primary" size="large">
          {currentStep === 4 ? 'Finish' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default TimeBuilder;