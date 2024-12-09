import { NavLink, useNavigate } from "react-router-dom";
export const Navbar = () => {
  return (
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
                  <NavLink className="dropdown-item" to="/ModuleBuilder">
                    Module Builder
                  </NavLink>
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
                  <a className="dropdown-item" href="#">
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
  );
};
