import React, { useState } from "react";
import { Table, Checkbox, Modal, Button, Typography, DatePicker, Space, Select } from "antd";

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

  // Handle date change
  const handleDateChange = (date, dateString, activity) => {
    const updatedActivity = selectedActivity.map((act) =>
      act.moduleCode === activity.moduleCode ? { ...act, startDate: dateString } : act
    );
    setSelectedActivity(updatedActivity);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography.Title level={4}>TimeBuilder</Typography.Title>

      {/* Select Project and Type of Mine */}
      <div style={{ marginBottom: "20px" }}>
        <Space size="large">
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
        </Space>
      </div>

      {/* Module Table */}
      <Table
        dataSource={modules}
        rowKey="moduleCode"
        pagination={false}
        columns={[
          {
            title: "Module Code",
            dataIndex: "moduleCode",
            key: "moduleCode",
          },
          {
            title: "Module Name",
            dataIndex: "moduleName",
            key: "moduleName",
          },
          {
            title: "Select",
            key: "select",
            render: (_, record) => (
              <Checkbox
                checked={record.isSelected}
                onChange={() => handleCheckboxChange(record)}
              />
            ),
          },
        ]}
      />

      {/* Dialog for Activities */}
      <Modal
        title="Activities"
        visible={openDialog}
        onCancel={handleCloseDialog}
        footer={[
          <Button key="close" type="primary" onClick={handleCloseDialog}>
            Close
          </Button>,
        ]}
      >
        <Table
          dataSource={selectedActivity}
          rowKey="moduleCode"
          pagination={false}
          columns={[
            {
              title: "Activity Code",
              dataIndex: "moduleCode",
              key: "moduleCode",
            },
            {
              title: "Activity Name",
              dataIndex: "moduleName",
              key: "moduleName",
            },
            {
              title: "Start Date",
              key: "startDate",
              render: (_, record) => (
                <Space>
                  <DatePicker
                    placeholder="Select Date"
                    onChange={(date, dateString) =>
                      handleDateChange(date, dateString, record)
                    }
                  />
                </Space>
              ),
            },
          ]}
        />
      </Modal>
    </div>
  );
};

export default TimeBuilder;
