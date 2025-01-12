import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Header } from "./Layout/Header";
import { Navbar } from "./Layout/Navbar";
import { RegisterNewProject } from "./Components/RegisterNewProject";
import { EmployeeRegistration } from "./Components/EmployeeRegistration";
import { ModuleBuilder } from "./Components/ModuleBuilder";
import {CreateModule} from './Components/CreateModule';
import { ModuleLibrary } from './Components/ModuleLibrary';
import React, { useEffect } from "react";
import {ModuleDetails} from './Components/ModuleDetail';
import {HolidayCalender} from './Components/HolidayCalender';


import {
  initializeModules,
} from './Utils/moduleStorage';
import { ProjectDetails } from "./Components/ProjectDetails";
import { TimelineBuilder } from "./Components/TimelineBuilder";

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
        <Route path="/projectdetails" element={<ProjectDetails />} />
        <Route path="/timeline-builder" element={<TimelineBuilder />} />
      </Routes>
    </>
  );
}

export default App;
