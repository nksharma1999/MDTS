import React, { useState } from "react";
import { Checkbox, Modal, Button, Typography, DatePicker, Space, Select } from "antd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const { Option } = Select;

const activityMapping = {
  CF: { activityCode: "FC/PR", activityName: "Pre-requisite to FC Application" },
  BP: { activityCode: "FC-I", activityName: "FC Stage-1 Proceedings" },
  BC: { activityCode: "FC-II", activityName: "FC Stage-2 Proceedings" },
  DG: { activityCode: "FC/PR", activityName: "Pre-requisite to FC Application" },
  FC: { activityCode: "FC", activityName: "Forest Clearance" },
  TOR: { activityCode: "FC-I", activityName: "FC Stage-1 Proceedings" },
};

const TimeBuilder = () => {
  const [modules, setModules] = useState([
    { moduleCode: "CF", moduleName: "Contract Formulation", isSelected: false },
    { moduleCode: "BP", moduleName: "DGPS Survey", isSelected: false },
    { moduleCode: "BC", moduleName: "Geological Report", isSelected: false },
    { moduleCode: "DG", moduleName: "Mine Plan", isSelected: false },
    { moduleCode: "FC", moduleName: "Forest Clearance", isSelected: false },
    { moduleCode: "TOR", moduleName: "Terms of Reference", isSelected: false },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState([]);
  const [selectedProject, setSelectedProject] = useState("Project A");
  const [selectedMineType, setSelectedMineType] = useState("Open-Cast");

  // Handle checkbox change
  const handleCheckboxChange = (module) => {
    const updatedModules = modules.map((m) =>
      m.moduleCode === module.moduleCode ? { ...m, isSelected: !m.isSelected } : m
    );
    setModules(updatedModules);

    if (!module.isSelected) {
      const activity = activityMapping[module.moduleCode];
      const selectedActivityData = {
        moduleCode: activity.activityCode,
        moduleName: activity.activityName,
        startDate: null,
      };
      setSelectedActivity([selectedActivityData]);
      setOpenDialog(true);
    }
  };

  // Handle Drag-and-Drop
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedModules = [...modules];
    const [movedModule] = reorderedModules.splice(result.source.index, 1);
    reorderedModules.splice(result.destination.index, 0, movedModule);

    setModules(reorderedModules);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <Typography.Title level={4} style={{ textAlign: "center", marginBottom: "20px" }}>
        TimeBuilder
      </Typography.Title>

      {/* Select Project and Type of Mine */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <Typography.Text>Select Project:</Typography.Text>
          <Select
            style={{ width: 200, marginLeft: "10px" }}
            value={selectedProject}
            onChange={(value) => setSelectedProject(value)}
          >
            <Option value="Project A">Project A</Option>
            <Option value="Project B">Project B</Option>
            <Option value="Project C">Project C</Option>
          </Select>
        </div>
        <div>
          <Typography.Text>Type of Mine:</Typography.Text>
          <Select
            style={{ width: 200, marginLeft: "10px" }}
            value={selectedMineType}
            onChange={(value) => setSelectedMineType(value)}
          >
            <Option value="Open-Cast">Open-Cast</Option>
            <Option value="Underground">Underground</Option>
            <Option value="Mixed">Mixed</Option>
          </Select>
        </div>
      </div>

      {/* Drag-and-Drop Table */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ borderRadius: "8px", overflow: "hidden", boxShadow: "0px 2px 10px rgba(0,0,0,0.1)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "green", color: "white", textAlign: "left" }}>
                <th style={{ padding: "10px", textAlign: "center" }}>Module Code</th>
                <th style={{ padding: "10px" }}>Module Name</th>
                <th style={{ padding: "10px", textAlign: "center" }}>Select</th>
              </tr>
            </thead>
            <Droppable droppableId="modules">
              {(provided) => (
                <tbody ref={provided.innerRef} {...provided.droppableProps}>
                  {modules.map((module, index) => (
                    <Draggable key={module.moduleCode} draggableId={module.moduleCode} index={index}>
                      {(provided) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            cursor: "grab",
                            background: module.isSelected ? "#e6f7ff" : "white",
                            transition: "background 0.2s",
                            borderBottom: "1px solid #ddd",
                            ...provided.draggableProps.style,
                          }}
                        >
                          <td style={{ padding: "12px", textAlign: "center", fontWeight: "bold" }}>
                           {module.moduleCode}
                          </td>
                          <td style={{ padding: "12px" }}>{module.moduleName}</td>
                          <td style={{ textAlign: "center", padding: "12px" }}>
                            <Checkbox
                              checked={module.isSelected}
                              onChange={() => handleCheckboxChange(module)}
                            />
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              )}
            </Droppable>
          </table>
        </div>
      </DragDropContext>

      {/* Dialog for Activities */}
      <Modal
        title="Activities"
        open={openDialog}
        onCancel={() => setOpenDialog(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setOpenDialog(false)}>
            Close
          </Button>,
        ]}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
          <thead>
            <tr style={{ background: "#fafafa", borderBottom: "1px solid #ddd" }}>
              <th style={{ padding: "10px" }}>Activity Code</th>
              <th style={{ padding: "10px" }}>Activity Name</th>
              <th style={{ padding: "10px" }}>Start Date</th>
            </tr>
          </thead>
          <tbody>
            {selectedActivity.map((activity) => (
              <tr key={activity.moduleCode} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px" }}>{activity.moduleCode}</td>
                <td style={{ padding: "10px" }}>{activity.moduleName}</td>
                <td style={{ padding: "10px" }}>
                  <DatePicker
                    placeholder="Select Date"
                    onChange={(date, dateString) =>
                      setSelectedActivity((prev) =>
                        prev.map((act) =>
                          act.moduleCode === activity.moduleCode ? { ...act, startDate: dateString } : act
                        )
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal>
    </div>
  );
};

export default TimeBuilder;
