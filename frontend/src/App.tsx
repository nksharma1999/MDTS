import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Header } from "./layouts/Header";
import { Navbar } from "./layouts/Navbar";
import { RegisterNewProject } from "./components/RegisterNewProject";
import { EmployeeRegistration } from "./components/EmployeeRegistration";
import { ModuleBuilder } from "./components/ModuleBuilder";
import { CreateModule } from './components/CreateModule';
import { ModuleLibrary } from './components/ModuleLibrary';
import React, { useEffect } from "react";
import { ModuleDetails } from './components/ModuleDetail';
import { HolidayCalender } from './components/HolidayCalender';
import {
  initializeModules,
} from './Utils/moduleStorage';
import { ProjectDetails } from "./components/ProjectDetails";
import ProjectParametersPage from "./components/ProjectParameterPage";
import ManageUser from "./components/ManageUser";
import ViewUser from "./components/ViewUser";
import { TimelineBuilder } from "./components/TimelineBuilder";
import DocumentPage from "./components/Document";
import CreateDocument from "./components/CreateDocument";
import DocumentLibrary from "./components/DocumentLibrary";
import ViewDocumentPage from "./components/ViewDocumentPage";
import CreateNotification from "./components/CreateNotification";
import NotificationLibrary from "./components/NotificationLibrary";
import AssignRaci from "./components/AssignRACI";
import Module from "./components/Module";

function App() {

  useEffect(() => {
    // Ensure local storage is initialized with an empty array
    initializeModules();
  }, []);

  return (
    <>
      <Header />
      {/* <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: 10,
        }}
      >
        <div>Dhirauli</div>
        <div>Amrendra Kumar</div>
      </div> */}
      <Navbar />
      <Routes>
        <Route path="/" element={"/"} /> {/* Default page */}
        <Route path="/RegisterNewProject" element={<RegisterNewProject />} />
        <Route
          path="/EmployeeRegistration"
          element={<EmployeeRegistration />}
        />
        <Route path="/ModuleBuilder" element={<ModuleBuilder />} />
        <Route path="/CreateModule" element={<CreateModule />} />
        <Route path="/ModuleLibrary" element={<ModuleLibrary />} />
        <Route path="/HolidayCalender" element={<HolidayCalender />} />
        <Route path="/module/:moduleName" element={<ModuleDetails />} />
        <Route path="/projectdetails/:projectName" element={<ProjectDetails />} />
        <Route path="/project-parameters" element={<ProjectParametersPage />} />
        <Route path="/manageuser" element={<ManageUser />} />
        <Route path="/view-user" element={<ViewUser />} />
        <Route path="/documentpage" element={<DocumentPage />} />
        <Route path="/createdocument" element={<CreateDocument />} />
        <Route path="/documentlibrary" element={<DocumentLibrary />} />
        <Route path="/view-document" element={<ViewDocumentPage />} />
        <Route path="/createnotification" element={<CreateNotification />} />
        <Route path="/notificationlibrary" element={<NotificationLibrary />} />
        <Route path="/assignraci" element={<AssignRaci />} />
        <Route path="/module" element={<Module />} />
        <Route path="/timeline-builder" element={<TimelineBuilder />} />
      </Routes>
    </>
  );
}

export default App;
