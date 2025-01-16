import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  TextField,
  Autocomplete,
  Chip,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Box,
} from "@mui/material";

interface Props { }

export const EmployeeRegistration: React.FC<Props> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isEdit } = location.state || {};

  const [formData, setFormData] = useState({
    name: user?.name || "",
    company: user?.company || "",
    project: user?.project || [],
    mobile: user?.mobile || "",
    email: user?.email || "",
    whatsapp: user?.whatsapp || "",
    registrationDate: user?.registrationDate || "",
    photo: user?.photo || "", // to store the uploaded photo file
  });

  const projectOptions = ["Project A", "Project B", "Project C", "Project D"];
  const companyOptions = ["Company A", "Company B", "Company C", "Company D"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  

  // Handle project selection
  const handleProjectChange = (event: any, value: string[]) => {
    setFormData((prev) => ({ ...prev, project: value }));
  };

  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: URL.createObjectURL(file) }));
    }
  };

  // Save or Update Logic
  const handleSaveOrUpdate = () => {
    if (isEdit) {
      console.log("Updating user:", formData);
      // Perform update logic
    } else {
      console.log("Saving new user:", formData);
      // Perform save logic
    }
    navigate("/manageuser");
  };

  const handleCancel = () => {
    navigate("/manageuser");
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
      <div
        className="card mb-3"
        style={{
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          border: "none",
        }}
      >
        <div
          className="card-header"
          style={{
            textAlign: "center",
            fontSize: "24px",
            fontWeight: "bold",
            color: "white",
            backgroundColor: "blue",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
            padding: "15px",
          }}
        >
          {isEdit ? "Edit Employee Details" : "Employee Registration"}
        </div>
        <div className="card-body" style={{ padding: "30px" }}>
          <form>
            {/* Name Field */}
            <div className="row mb-3">
              <label htmlFor="name" className="col-sm-3 col-form-label" style={{ fontWeight: "bold" }}>
                Name
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter Name"
                />
              </div>
            </div>

            {/* Company Field - Dropdown */}
            <div className="row mb-3">
              <label htmlFor="company" className="col-sm-3 col-form-label" style={{ fontWeight: "bold" }}>
                Company
              </label>
              <div className="col-sm-9">
                <FormControl fullWidth>
                  <InputLabel id="company-label">Select Company</InputLabel>
                  <Select
                    labelId="company-label"
                    name="company" // Use name instead of id
                    value={formData.company}
                    onChange={handleInputChange}
                    label="Select Company"
                  >
                    {companyOptions.map((company) => (
                      <MenuItem key={company} value={company}>
                        {company}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

              </div>
            </div>

            {/* Project Field - Multi-Select */}
            <div className="row mb-3">
              <label htmlFor="project" className="col-sm-3 col-form-label" style={{ fontWeight: "bold" }}>
                Project
              </label>
              <div className="col-sm-9">
                <Autocomplete
                  multiple
                  id="project"
                  options={projectOptions}
                  value={formData.project}
                  onChange={handleProjectChange}
                  renderTags={(value: string[], getTagProps) =>
                    value.map((option, index) => (
                      <Chip key={option} label={option} {...getTagProps({ index })} />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Select Projects"
                      placeholder="Projects"
                    />
                  )}
                />
              </div>
            </div>

            {/* Mobile No Field */}
            <div className="row mb-3">
              <label htmlFor="mobile" className="col-sm-3 col-form-label" style={{ fontWeight: "bold" }}>
                Mobile No
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  className="form-control"
                  id="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="Enter Mobile No"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="row mb-3">
              <label htmlFor="email" className="col-sm-3 col-form-label" style={{ fontWeight: "bold" }}>
                Email
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter Email"
                />
              </div>
            </div>

            {/* WhatsApp No Field */}
            <div className="row mb-3">
              <label htmlFor="whatsapp" className="col-sm-3 col-form-label" style={{ fontWeight: "bold" }}>
                WhatsApp No
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  className="form-control"
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  placeholder="Enter WhatsApp No"
                />
              </div>
            </div>

            {/* Registration Date Field */}
            <div className="row mb-3">
              <label htmlFor="registrationDate" className="col-sm-3 col-form-label" style={{ fontWeight: "bold" }}>
                Registration Date
              </label>
              <div className="col-sm-9">
                <input
                  type="date"
                  className="form-control"
                  id="registrationDate"
                  value={formData.registrationDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Upload Photo Field */}
            <div className="row mb-3">
              <label htmlFor="photo" className="col-sm-3 col-form-label" style={{ fontWeight: "bold" }}>
                Upload Photo
              </label>
              <div className="col-sm-9">
                <input
                  type="file"
                  className="form-control"
                  id="photo"
                  onChange={handlePhotoUpload}
                />
                {formData.photo && (
                  <Box mt={2}>
                    <img
                      src={formData.photo}
                      alt="Uploaded"
                      style={{ width: "150px", height: "150px", borderRadius: "50%" }}
                    />
                  </Box>
                )}
              </div>
            </div>

            {/* Save and Cancel Buttons */}
            <div className="d-flex justify-content-between mt-4">
              <button className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveOrUpdate}>
                {isEdit ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
