import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
export const Navbar = () => {
  const [newModelName, setNewModelName] = useState("");
  const [newCode, setNewCode] = useState("");
  const navigate = useNavigate();

  const handleModulePlus = () => {
    if (newModelName.trim() ) {
      navigate("/CreateModule", {
        state: { moduleName: newModelName,},
      });
    } else {
      alert("Please enter both module name and code");
    }
  };

  const handleNavigation = () => {
    navigate('/modulebuilder');
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
                <li>
                  <a className="dropdown-item" href="#">
                    Dhirauli
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Bijahan
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Gondulpara
                  </a>
                </li>
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
                  <a className="dropdown-item" href="#">
                    Timeline Builder
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
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
                  <a className="dropdown-item" onClick={handleNavigation}>
                    Module Library
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Status Update
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    RACI, Alert & Notification
                  </a>
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
       <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Add New Module</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
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
              {/* <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Code"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                />
                <label>Code</label>
              </div> */}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={handleModulePlus}>Add Module</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
