import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Header } from "./Layout/Header";
import { Navbar } from "./Layout/Navbar";
import { RegisterNewProject } from "./Components/RegisterNewProject";
import { EmployeeRegistration } from "./Components/EmployeeRegistration";
import { ModuleBuilder } from "./Components/ModuleBuilder";

function App() {
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
      </Routes>
    </>
  );
}

export default App;
