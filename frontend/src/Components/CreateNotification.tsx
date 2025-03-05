import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Switch, Button, Select, Input, Table } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

const { Option } = Select;

type FormRow = {
  status: string;
  defaultMessage: string;
  personalizedMessage: string | string[];
  selectedDays?: string[];
  notificationEnabled: boolean;
};

type DelayedDropdownProps = {
  selectedDays: string[];
  onChange: (days: string[]) => void;
};

const DelayedDropdown: React.FC<DelayedDropdownProps> = ({ selectedDays, onChange }) => {
  const delayOptions = ["1 day", "7 days", "14 days", "30 days"];

  const handleChange = (value: string[]) => {
    onChange(value);
  };

  return (
    <Select
      mode="multiple"
      value={selectedDays}
      onChange={handleChange}
      style={{ width: "130px", margin: "10px" }}
    >
      {delayOptions.map((option) => (
        <Option key={option} value={option}>
          {option}
        </Option>
      ))}
    </Select>
  );
};

const CreateNotification: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormRow[]>([
    { status: "Started", defaultMessage: "", personalizedMessage: "", notificationEnabled: false },
    { status: "Completed", defaultMessage: "", personalizedMessage: "", notificationEnabled: false },
    { status: "Delayed", defaultMessage: "", personalizedMessage: [], selectedDays: [], notificationEnabled: false },
  ]);

  const handlePersonalizedMessageChange = (index: number, value: string, dayIndex?: number) => {
    const updatedForm = [...form];
    if (dayIndex !== undefined && Array.isArray(updatedForm[index].personalizedMessage)) {
      updatedForm[index].personalizedMessage[dayIndex] = value;
    } else {
      updatedForm[index].personalizedMessage = value;
    }
    setForm(updatedForm);
  };

  const handleToggle = (index: number) => {
    setForm((prevForm) =>
      prevForm.map((row, i) =>
        i === index ? { ...row, notificationEnabled: !row.notificationEnabled } : row
      )
    );
  };

  const handleDaysChange = (index: number, days: string[]) => {
    const updatedForm = [...form];
    updatedForm[index].selectedDays = days;
    setForm(updatedForm);
  };

  const handleSave = () => {
    console.log("Form Data Saved:", form);
    alert("Form saved successfully!");
    onClose();
    navigate("/modules");
  };

  const columns: any = [
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text: string, record: FormRow, index: number) => (
        <div>
          {text}
          {text === "Delayed" && (
            <DelayedDropdown
              selectedDays={record.selectedDays || []}
              onChange={(days) => handleDaysChange(index, days)}
            />
          )}
        </div>
      ),
    },
    {
      title: "Notification Setup",
      dataIndex: "notificationEnabled",
      key: "notificationEnabled",
      align: "center",
      render: (_: boolean, _record: FormRow, index: number) => (
        <Switch
          checked={form[index].notificationEnabled}
          onChange={() => handleToggle(index)}
        />
      ),
    },
    {
      title: "Personalized Message",
      dataIndex: "personalizedMessage",
      key: "personalizedMessage",
      render: (_: string | string[], record: FormRow, index: number) => (
        <div>
          {record.status === "Delayed" && Array.isArray(record.personalizedMessage)
            ? record.selectedDays?.map((day, i) => (
              <Input
                key={i}
                value={record.personalizedMessage[i] || ""}
                onChange={(e) => handlePersonalizedMessageChange(index, e.target.value, i)}
                placeholder={`Message for ${day}`}
                style={{ marginBottom: "6px" }}
              />
            ))
            : (
              <Input
                value={record.personalizedMessage as string}
                onChange={(e) => handlePersonalizedMessageChange(index, e.target.value)}
                placeholder="Enter text here"
              />
            )}
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={form.map((item, index) => ({ ...item, key: index }))}
        pagination={false}
        bordered
      />
      <div style={{ marginTop: 10, textAlign: "right" }}>
        <Button className="bg-tertiary" style={{ marginRight: 10 }} onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="primary"
          className={"bg-secondary"}
          onClick={handleSave}
          icon={<ArrowRightOutlined />}
        >
          Save
        </Button>
      </div>
    </>
  );
};

export default CreateNotification;