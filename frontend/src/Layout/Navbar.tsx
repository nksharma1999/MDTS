import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import {
  listOfProjectName,
  getFormDataByProjectName,
  getAllMineType,
  updateMineType
} from '../Utils/moduleStorage';

export const Navbar = () => {
  const [newModelName, setNewModelName] = useState("");
  const navigate = useNavigate();
  const [projectNames, setProjectNames] = useState([]);
  const [moduleLevel, setModuleLevel] = useState("");
  const [options, setOptions] = useState([""]); // Dropdown options
  const [selectedOption, setSelectedOption] = useState("");
  const [newOption, setNewOption] = useState("");
  const [shorthandCode, setShorthandCode] = useState("");
  const [mineTypes, setMineTypes] = useState<any[]>([]); // Store the mine types

  // Fetch mine types on page load
  useEffect(() => {
    const fetchMineTypes = async () => {
      const fetchedMineTypes = await getAllMineType(); // Function to fetch mine types
      setMineTypes(fetchedMineTypes);
      const options = fetchedMineTypes.map((type) => type.code);
      setOptions(options); // Set options for dropdown
    };
    fetchMineTypes();

    const names = listOfProjectName();
    setProjectNames(names);
  }, []);

  useEffect(() => {
    const names = listOfProjectName();
    setProjectNames(names);
  }, []);


  const handleAddOption = async () => {
    if (newOption.trim()) {
      const shorthandCode = newOption
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase())
        .join("")
        .slice(0, 3);

      const newMineType = { name: newOption, code: shorthandCode };
      const updatedMineTypes = [...mineTypes, newMineType];

      setMineTypes(updatedMineTypes);
      setOptions((prevOptions) => [...prevOptions, shorthandCode]);
      setNewOption("");

      // Call to update mine types in the database or storage
      await updateMineType(updatedMineTypes);

      // Close modals
      const addOptionModal = document.getElementById("addOptionModal");
      const addOptionModalInstance = bootstrap.Modal.getInstance(addOptionModal);
      addOptionModalInstance.hide();

      const mainModal = document.getElementById("exampleModal");
      const mainModalInstance = new bootstrap.Modal(mainModal);
      mainModalInstance.show();
    } else {
      alert("Mine Type cannot be empty!");
    }
  };

  // Handle mine type change
  const handleMineTypeChange = (value: string) => {
    setNewOption(value);
    const code = value
      .split(" ")
      .map(word => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 3);
    setShorthandCode(code);
  };


  // Handle adding module
  const handleModulePlus = () => {
    if (newModelName.trim()) {
      navigate("/CreateModule", {
        state: {
          moduleName: newModelName,
          mineType: selectedOption,
          moduleLevel: moduleLevel,
        },
      });

      const modal = document.getElementById("exampleModal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
    } else {
      alert("Please enter both module name and code");
    }
  };

  const handleNavigation = () => {
    navigate('/modulebuilder');
  };

  const handleProjectClick = (projectName: string) => {
    const selectedFormData = getFormDataByProjectName(projectName);
    if (selectedFormData) {
      const { projectName } = selectedFormData;
      navigate(`/projectdetails/${projectName.replace(/\s+/g, '')}`, { state: { selectedFormData } });
    } else {
      console.error("No formData found for project:", projectName);
      alert("No data available for the selected project.");
    }
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-dark sticky-top"
        style={{ backgroundColor: "#374151" }}
      >
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent2"
            aria-controls="navbarSupportedContent2"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent2">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  About
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Project
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  {projectNames.map((projectName, index) => (
                    <li key={index}>
                      <a
                        className="dropdown-item"
                        href="#"
                        role="button" // Optional but recommended
                        onClick={(e) => {
                          e.preventDefault(); // Prevent default anchor behavior
                          handleProjectClick(projectName);
                        }}
                      >
                        {projectName}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Documents
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Knowledge Center
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Data Master
                </a>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Create
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <NavLink className="dropdown-item" to="/RegisterNewProject">
                      Register New Project
                    </NavLink>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      Create New Module
                    </a>
                  </li>
                  <li>
                    
                    <NavLink className="dropdown-item" to="/timeline-builder">
                    Timeline Builder
                    </NavLink>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/HolidayCalender">
                      Non-working days
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Delay Cost Calculator
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Cash-Flow Builder
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      WhatsApp Notification
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      DPR Cost Builder
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="/ModuleLibrary"
                    >
                      Module Library
                    </a>
                  </li>

                  <li>
                    <a className="dropdown-item" href="#">
                      Status Update
                    </a>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/manageuser">
                      RACI, Alert & Notification
                    </Link>
                  </li>

                  <li>
                    <a className="dropdown-item" href="#">
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Document
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
            <div className="d-flex">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li>
                  <NavLink className="nav-link" to={"/#"}>
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink className="nav-link" to={"/EmployeeRegistration"}>
                    Registration
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>


      {/* Modal for Adding New Module */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Add New Module
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* Module Name */}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Module Name"
                  value={newModelName}
                  onChange={(e) => setNewModelName(e.target.value)}
                />
                <label>Module Name</label>
              </div>

              <div className="border p-3 mb-3" style={{ borderRadius: "8px" }}>
                <div
                  className="d-flex align-items-center justify-content-between"
                  style={{ gap: "10px", }}
                >
                  <label
                    className="form-label"
                    style={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      marginBottom: "0",
                      color: "#000",
                    }}
                  >
                    Applicable Mine Type
                  </label>
                  <button
                    type="button"
                    className="btn btn-link text-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#addOptionModal"
                    style={{
                      fontSize: "25px",
                      textDecoration: "none",
                    }}
                  >
                    +
                  </button>

                  <select
                    className="form-select"
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    style={{ width: "40%", height: "40px", fontSize: "14px" }}
                  >
                    <option value="">--select--</option>
                    {options.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                </div>
              </div>

              {/* Module Level */}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Module Level"
                  value={moduleLevel}
                  onChange={(e) => setModuleLevel(e.target.value)}
                />
                <label>Module Level</label>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleModulePlus}
              >
                Add Module
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* Modal for Adding New Mine Type */}
      <div
        className="modal fade"
        id="addOptionModal"
        tabIndex={-1}
        aria-labelledby="addOptionModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ width: "60%", margin: "0 auto" }}>
            <div className="modal-header">
              <h5 className="modal-title" id="addOptionModalLabel">
                Add Mine Type
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* Input for Mine Type */}
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Enter Mine Type"
                value={newOption}
                onChange={(e) => handleMineTypeChange(e.target.value)}
              />
              {/* Display Auto-Generated Shorthand Code */}
              <div className="form-control mb-3" style={{ background: "#f8f9fa" }}>
                Shorthand Code <strong>{shorthandCode}</strong>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddOption}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};
