import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

interface Props { }

export const EmployeeRegistration: React.FC<Props> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isEdit } = location.state || {};

  const handleSave = () => {
    navigate("/manageuser");
  };

  // State for form fields (pre-filled in edit mode)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    company: user?.company || "",
    project: user?.project || "",
    mobile: user?.mobile || "",
    email: user?.email || "",
    whatsapp: user?.whatsapp || "",
  });

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
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

  // Cancel Action
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
            color: "black",
            backgroundColor: "grey",
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
              <label
                htmlFor="floatingName"
                className="col-sm-3 col-form-label"
                style={{ fontSize: "20px", fontWeight: "Bold" ,width:'300px'}}
              >
                Name
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  className="form-control"
                  id="floatingName"
                  placeholder="Enter Name"
                  style={{
                    padding: "10px",
                    fontSize: "16px",
                    borderRadius: "5px",
                    borderColor: "#ccc",
                    fontWeight: "500",
                  }}
                />
              </div>
            </div>

            {/* Company Field - Dropdown */}
            <div className="row mb-3">
              <label
                htmlFor="floatingCompany"
                className="col-sm-3 col-form-label"
                style={{ fontSize: "20px", fontWeight: "Bold",width:'300px' }}
              >
                Company
              </label>
              <div className="col-sm-9">
                <select
                  className="form-control"
                  id="floatingCompany"
                  style={{
                    padding: "10px",
                    fontSize: "16px",
                    borderRadius: "5px",
                    borderColor: "#ccc",
                    fontWeight: "500",
                  }}
                >
                  <option value="" disabled selected>
                    Select Company
                  </option>
                  <option value="Company A">Company A</option>
                  <option value="Company B">Company B</option>
                  <option value="Company C">Company C</option>
                  <option value="Company D">Company D</option>
                </select>
              </div>
            </div>


            {/* Project Field - Dropdown */}
            <div className="row mb-3">
              <label
                htmlFor="floatingProject"
                className="col-sm-3 col-form-label"
                style={{ fontSize: "20px", fontWeight: "Bold" ,width:'300px'}}
              >
                Project
              </label>
              <div className="col-sm-9">
                <select
                  className="form-control"
                  id="floatingProject"
                  style={{
                    padding: "10px",
                    fontSize: "16px",
                    borderRadius: "5px",
                    borderColor: "#ccc",
                    fontWeight: "500",
                  }}
                >
                  <option value="" disabled selected>
                    Select Project
                  </option>
                  <option value="Project A">Project A</option>
                  <option value="Project B">Project B</option>
                  <option value="Project C">Project C</option>
                  <option value="Project D">Project D</option>
                </select>
              </div>
            </div>

            {/* Mobile No Field */}
            <div className="row mb-3">
              <label
                htmlFor="floatingMobile"
                className="col-sm-3 col-form-label"
                style={{ fontSize: "20px", fontWeight: "Bold",width:'300px' }}
              >
                Mobile No
              </label>
              <div className="col-sm-9">
                <input
                  type="number"
                  className="form-control"
                  id="floatingMobile"
                  placeholder="Enter Mobile Number"
                  style={{
                    padding: "10px",
                    fontSize: "16px",
                    borderRadius: "5px",
                    borderColor: "#ccc",
                    fontWeight: "500",
                  }}
                />
              </div>
            </div>

            {/* Email ID Field */}
            <div className="row mb-3">
              <label
                htmlFor="floatingEmail"
                className="col-sm-3 col-form-label"
                style={{ fontSize: "20px", fontWeight: "Bold",width:'300px' }}
              >
                Email ID
              </label>
              <div className="col-sm-9">
                <input
                  type="email"
                  className="form-control"
                  id="floatingEmail"
                  placeholder="Enter Email"
                  style={{
                    padding: "10px",
                    fontSize: "16px",
                    borderRadius: "5px",
                    borderColor: "#ccc",
                    fontWeight: "500",
                  }}
                />
              </div>
            </div>

            {/* WhatsApp No Field */}
            <div className="row mb-3">
              <label
                htmlFor="floatingWhatsApp"
                className="col-sm-3 col-form-label"
                style={{ fontSize: "20px", fontWeight: "Bold" ,width:'300px'}}
              >
                WhatsApp No
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  className="form-control"
                  id="floatingWhatsApp"
                  placeholder="Enter WhatsApp Number"
                  style={{
                    padding: "10px",
                    fontSize: "16px",
                    borderRadius: "5px",
                    borderColor: "#ccc",
                    fontWeight: "500",
                  }}
                />
              </div>
            </div>

            {/* Save and Cancel Buttons */}
            <div className="d-flex justify-content-between mt-4">
              <button
                className="btn btn-secondary"
                style={{
                  padding: "10px 20px",
                  fontSize: "16px",
                  borderRadius: "5px",
                  border: "none",
                  backgroundColor: "#f0ad4e",
                  color: "#fff",
                  marginLeft: '1600px',
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                style={{
                  padding: "10px 20px",
                  fontSize: "16px",
                  borderRadius: "5px",
                  border: "none",
                  backgroundColor: "#4a90e2",
                  color: "#fff",
                }}
              >
                {isEdit ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
