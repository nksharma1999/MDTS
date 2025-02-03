import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Switch, Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, Select, Chip } from "@mui/material";

const DelayedDropdown = ({ selectedDays, onChange }) => {
  const delayOptions = ["1 day", "7 days", "14 days", "30 days"];

  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <Select
      multiple
      value={selectedDays}
      onChange={handleChange}
      renderValue={(selected) => (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" ,flexDirection: "column",width:"100px"}}>
          {selected.map((value) => (
            <Chip key={value} label={value} />
          ))}
        </div>
      )}
      fullWidth
      style={{ width: "130px",margin:"10px" }}
    >
      {delayOptions.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  );
};

const CreateNotification = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState([
    { status: "Started", defaultMessage: "", personalizedMessage: "", notificationEnabled: false },
    { status: "Completed", defaultMessage: "", personalizedMessage: "", notificationEnabled: false },
    { status: "Delayed", defaultMessage: "", personalizedMessage: [], selectedDays: [], notificationEnabled: false },
  ]);

  const handlePersonalizedMessageChange = (index, value, dayIndex) => {
    const updatedForm = [...form];
    const messages = updatedForm[index].personalizedMessage || [];
    messages[dayIndex] = value;
    updatedForm[index].personalizedMessage = messages;
    setForm(updatedForm);
  };

  const handleToggle = (index) => {
    setForm((prevForm) =>
      prevForm.map((row, i) =>
        i === index ? { ...row, notificationEnabled: !row.notificationEnabled } : row
      )
    );
  };

  const handleDaysChange = (index, days) => {
    const updatedForm = [...form];
    updatedForm[index].selectedDays = days;
    setForm(updatedForm);
  };

  const handleSave = () => {
    console.log("Form Data Saved:", form);
    alert("Form saved successfully!");
    onClose();
    navigate("/createmodule");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Notification Settings</DialogTitle>
      <DialogContent dividers>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Status</th>
              <th style={styles.tableHeader}>Notification Setup</th>
              <th style={styles.tableHeader}>Personalized Message</th>
            </tr>
          </thead>
          <tbody>
            {form.map((row, index) => (
              <tr key={index}>
                <td style={styles.tableCell}>
                  {row.status}
                  {row.status === "Delayed" && (
                    <DelayedDropdown
                      selectedDays={row.selectedDays}
                      onChange={(days) => handleDaysChange(index, days)}
                     
                    />
                  )}
                </td>
                <td style={styles.tableCell}>
                  <Switch
                    checked={row.notificationEnabled}
                    onChange={() => handleToggle(index)}
                  />
                </td>
                <td style={styles.tableCell}>
                  {row.status === "Delayed" &&
                    row.selectedDays.map((day, i) => (
                      <div key={i} style={{ marginBottom: "6px" }}>
                        {/* <strong>{day}:</strong> */}
                        <input
                          type="text"
                          value={row.personalizedMessage[i] || ""}
                          onChange={(e) =>
                            handlePersonalizedMessageChange(index, e.target.value, i)
                          }
                          style={styles.input}
                          placeholder={`Message for ${day}`}
                        />
                      </div>
                    ))}
                  {row.status !== "Delayed" && (
                    <input
                      type="text"
                      value={row.personalizedMessage}
                      onChange={(e) =>
                        handlePersonalizedMessageChange(index, e.target.value)
                      }
                      style={styles.input}
                      placeholder="Enter text here"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} style={styles.cancelButton}>
          Cancel
        </Button>
        <Button onClick={handleSave} style={styles.saveButton}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    border: "1px solid #ccc",
    padding: "10px",
    backgroundColor: "#4F7942",
    color: "#fff",
    fontWeight: "bold",
  },
  tableCell: {
    padding: "10px",
    textAlign: "left",
    fontSize: "18px",
    fontWeight: "bold",
    
  },
  input: {
    width: "100%",
    padding: "8px",
    fontSize: "12px",
    borderRadius: "4px",
  },
  cancelButton: {
    backgroundColor: "#f44336",
    color: "white",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  saveButton: {
    backgroundColor: "#4A90E2",
    color: "white",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default CreateNotification;
