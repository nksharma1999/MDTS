// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Switch, Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, Select, Chip } from "@mui/material";
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// const DelayedDropdown = ({ selectedDays, onChange }) => {
//   const delayOptions = ["1 day", "7 days", "14 days", "30 days"];

//   const handleChange = (event) => {
//     onChange(event.target.value);
//   };

//   return (
//     <Select
//       multiple
//       value={selectedDays}
//       onChange={handleChange}
//       renderValue={(selected) => (
//         <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" ,flexDirection: "column",width:"80px"}}>
//           {selected.map((value) => (
//             <Chip key={value} label={value} />
//           ))}
//         </div>
//       )}
//       fullWidth
//       style={{ width: "130px",margin:"10px" }}
//     >
//       {delayOptions.map((option) => (
//         <MenuItem key={option} value={option}>
//           {option}
//         </MenuItem>
//       ))}
//     </Select>
//   );
// };

// const CreateNotification = ({ open, onClose }) => {
//   const navigate = useNavigate();
//   const [form, setForm] = useState([
//     { status: "Started", defaultMessage: "", personalizedMessage: "", notificationEnabled: false },
//     { status: "Completed", defaultMessage: "", personalizedMessage: "", notificationEnabled: false },
//     { status: "Delayed", defaultMessage: "", personalizedMessage: [], selectedDays: [], notificationEnabled: false },
//   ]);

//   const handlePersonalizedMessageChange = (index, value, dayIndex) => {
//     const updatedForm = [...form];
//     const messages = updatedForm[index].personalizedMessage || [];
//     messages[dayIndex] = value;
//     updatedForm[index].personalizedMessage = messages;
//     setForm(updatedForm);
//   };

//   const handleToggle = (index) => {
//     setForm((prevForm) =>
//       prevForm.map((row, i) =>
//         i === index ? { ...row, notificationEnabled: !row.notificationEnabled } : row
//       )
//     );
//   };

//   const handleDaysChange = (index, days) => {
//     const updatedForm = [...form];
//     updatedForm[index].selectedDays = days;
//     setForm(updatedForm);
//   };

//   const handleSave = () => {
//     console.log("Form Data Saved:", form);
//     alert("Form saved successfully!");
//     onClose();
//     navigate("/createmodule");
//   };

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
//       <DialogTitle>Notification Settings</DialogTitle>
//       <DialogContent dividers>
//         <table style={styles.table}>
//           <thead>
//             <tr>
//               <th style={styles.tableHeader}>Status</th>
//               <th style={styles.tableHeader}>Notification Setup</th>
//               <th style={styles.tableHeader}>Personalized Message</th>
//             </tr>
//           </thead>
//           <tbody>
//             {form.map((row, index) => (
//               <tr key={index}>
//                 <td style={styles.tableCell}>
//                   {row.status}
//                   {row.status === "Delayed" && (
//                     <DelayedDropdown
//                       selectedDays={row.selectedDays}
//                       onChange={(days) => handleDaysChange(index, days)}

//                     />
//                   )}
//                 </td>
//                 <td style={styles.tableCell}>
//                   <Switch
//                     checked={row.notificationEnabled}
//                     onChange={() => handleToggle(index)}
//                   />
//                 </td>
//                 <td style={styles.tableCell}>
//                   {row.status === "Delayed" &&
//                     row.selectedDays.map((day, i) => (
//                       <div key={i} style={{ marginBottom: "6px" }}>
//                         {/* <strong>{day}:</strong> */}
//                         <input
//                           type="text"
//                           value={row.personalizedMessage[i] || ""}
//                           onChange={(e) =>
//                             handlePersonalizedMessageChange(index, e.target.value, i)
//                           }
//                           style={styles.input}
//                           placeholder={`Message for ${day}`}
//                         />
//                       </div>
//                     ))}
//                   {row.status !== "Delayed" && (
//                     <input
//                       type="text"
//                       value={row.personalizedMessage}
//                       onChange={(e) =>
//                         handlePersonalizedMessageChange(index, e.target.value)
//                       }
//                       style={styles.input}
//                       placeholder="Enter text here"
//                     />
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </DialogContent>
//       <DialogActions>
//   <Button onClick={onClose} style={styles.cancelButton}>
//     Cancel
//   </Button>
//   <Button onClick={handleSave} style={styles.saveButton} endIcon={<ArrowForwardIcon />}>
//     Save
//   </Button>
// </DialogActions>
//     </Dialog>
//   );
// };

// const styles = {
//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//   },
//   tableHeader: {
//     border: "1px solid #ccc",
//     padding: "10px",
//     backgroundColor: "#4F7942",
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   tableCell: {
//     padding: "10px",
//     textAlign: "left",
//     fontSize: "18px",
//     fontWeight: "bold",

//   },
//   input: {
//     width: "100%",
//     padding: "8px",
//     fontSize: "12px",
//     borderRadius: "4px",
//   },
//   cancelButton: {
//     backgroundColor: "#ED9121",
//     color: "black",
//     padding: "8px 16px",
//     borderRadius: "4px",
//     cursor: "pointer",
//     fontSize: "16px",
//   },
//   saveButton: {
//     backgroundColor: "#ED9121",
//     color: "black",
//     padding: "8px 16px",
//     borderRadius: "4px",
//     cursor: "pointer",
//     fontSize: "16px",
//   },
// };

// export default CreateNotification;



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Switch, Modal, Button, Select, Input, Table } from "antd";
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
    // <Modal
    //   title="Notification Settings"
    //   open={open}
    //   onCancel={onClose}
    //   footer={null}
    //   width={800}
    // >

    // </Modal>
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