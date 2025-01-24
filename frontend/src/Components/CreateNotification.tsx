import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Autocomplete, TextField, Chip } from "@mui/material";

const CreateNotification = ({ mode = "create" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize form state
  const [form, setForm] = useState({
    subject: "",
    message: "",
    module: "",
    activity: [],
    status: "",
  });

  useEffect(() => {
    if (mode === "edit" && location.state?.notification) {
      // Populate form with notification data when in edit mode
      setForm(location.state.notification);
    }
  }, [mode, location.state]);

  const [notificationType, setNotificationType] = useState(
    mode === "edit" ? "edit" : "create"
  );

  const modules = {
    Module1: ["Activity 1.1", "Activity 1.2", "Activity 1.3"],
    Module2: ["Activity 2.1", "Activity 2.2", "Activity 2.3"],
    Module3: ["Activity 3.1", "Activity 3.2", "Activity 3.3"],
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleActivityChange = (event: any, value: any) => {
    setForm((prevForm) => ({ ...prevForm, activity: value }));
  };

  const handleRadioChange = (e: any) => {
    setNotificationType(e.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const notificationData = {
      ...form,
      notificationType,
    };

    if (mode === "create") {
      navigate("/notificationlibrary", { state: { newNotification: notificationData } });
    } else {
      navigate("/notificationlibrary", { state: { updatedNotification: notificationData } });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h5 style={styles.title}>
            {mode === "create" ? "Create Notification" : "Edit Notification"}
          </h5>
        </div>

        <div style={styles.radioGroup}>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              value="default"
              checked={notificationType === "default"}
              onChange={handleRadioChange}
              style={styles.radioInput}
            />
            Default Message (Alert)
          </label>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              value="create"
              checked={notificationType === "create"}
              onChange={handleRadioChange}
              style={styles.radioInput}
            />
            Personalized
          </label>
        </div>

        <div>
          <h5 style={styles.formTitle}>
            {notificationType === "default"
              ? "Default Notification"
              : "Personalized Message"}
          </h5>

          {/* Form Fields */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="">Select status</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Delay">Delay</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Module</label>
            <select
              name="module"
              value={form.module}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="">Select a module</option>
              <option value="Module1">Module 1</option>
              <option value="Module2">Module 2</option>
              <option value="Module3">Module 3</option>
            </select>
          </div>

          {form.module && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Activity</label>
              <Autocomplete
                multiple
                options={modules[form.module] || []}
                value={form.activity}
                onChange={handleActivityChange}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      key={option}
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Select activities"
                  />
                )}
                style={{ width: "100%" }}
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Notification Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              style={styles.textarea}
              placeholder="Enter notification message"
            />
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button type="button" style={styles.cancelButton} onClick={() => navigate("/notificationlibrary")}>
            Cancel
          </button>
          <button
            type="submit"
            style={styles.saveButton}
            onClick={handleSubmit}
          >
            {mode === "create" ? "Save" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
    padding: "20px",
    background: "#fff",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    padding: "40px",
    width: "100%",
    maxWidth: "600px",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#333",
    margin: 0,
  },
  formTitle: {
    fontSize: "20px",
    fontWeight: "500",
    color: "#007bff",
    marginBottom: "20px",
  },
  radioGroup: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "30px",
  },
  radioLabel: {
    fontSize: "18px",
    color: "#333",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  radioInput: {
    marginRight: "10px",
    accentColor: "#007bff",
    cursor: "pointer",
  },
  inputGroup: {
    marginBottom: "25px",
  },
  label: {
    display: "block",
    fontSize: "16px",
    color: "#333",
    marginBottom: "10px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "16px",
    border: "1px solid #ced4da",
    borderRadius: "10px",
  },
  textarea: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "16px",
    border: "1px solid #ced4da",
    borderRadius: "10px",
    minHeight: "100px",
  },
  select: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "16px",
    border: "1px solid #ced4da",
    borderRadius: "10px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "30px",
  },
  cancelButton: {
    background: "#4A90E2",
    color: "black",
    border: "1px solid #6c757d",
    padding: "10px 24px",
    fontSize: "16px",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  saveButton: {
    background: "#4A90E2",
    color: "black",
    border: "none",
    padding: "10px 24px",
    fontSize: "16px",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    
  },
};

export default CreateNotification;
