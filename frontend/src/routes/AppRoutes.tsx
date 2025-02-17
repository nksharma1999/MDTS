import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "../pages/Registration";
import Dashboard from "../pages/dashboard";
import SignIn from "../pages/SignIn";
import CreateDocument from "../components/CreateDocument";
import { CreateModule } from "../components/CreateModule";
import DocumentPage from "../components/Document";
import DocumentLibrary from "../components/DocumentLibrary";
import { HolidayCalender } from "../components/HolidayCalender";
import ManageUser from "../components/ManageUser";
import ModuleBuilder from "../components/ModuleBuilder";
import { ModuleDetails } from "../components/ModuleDetail";
import ModuleLibrary from "../components/ModuleLibrary";
import NotificationLibrary from "../components/NotificationLibrary";
import { ProjectDetails } from "../components/ProjectDetails";
import ProjectParametersPage from "../components/ProjectParameterPage";
import { RegisterNewProject } from "../components/RegisterNewProject";
import TimelineBuilder from "../components/TimelineBuilder";
import ViewDocumentPage from "../components/ViewDocumentPage";
import ViewUser from "../components/ViewUser";
import About from "../pages/About";
import Projects from "../pages/Projects";
import KnowledgeCenter from "../pages/KnowledgeCenter";
import Document from "../pages/Document";
import DataMaster from "../pages/DataMaster";
import NotFound from "../pages/NotFound";
import { EmployeeRegistration } from "../components/EmployeeRegistration";
import Module from "../components/Module";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoutes";
import Profile from "../pages/Profile";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/register" element={<Register />} />
                <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                    <Route path="/home" element={<Dashboard />} />
                    <Route path="/not-found" element={<NotFound />} />
                    <Route path="/create/register-new-project" element={<RegisterNewProject />} />
                    <Route path="/employee-registration" element={<EmployeeRegistration />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/create/status-update" element={<ModuleBuilder />} />
                    <Route path="/CreateModule" element={<CreateModule />} />
                    <Route path="/create/module-library" element={<ModuleLibrary />} />
                    <Route path="/create/non-working-days" element={<HolidayCalender />} />
                    <Route path="/module/:moduleName" element={<ModuleDetails />} />
                    <Route path="/projectdetails/:projectName" element={<ProjectDetails />} />
                    <Route path="/project-parameters" element={<ProjectParametersPage />} />
                    <Route path="/create/raci-alert-notification" element={<ManageUser />} />
                    <Route path="/view-user" element={<ViewUser />} />
                    <Route path="/documentpage" element={<DocumentPage />} />
                    <Route path="/create/document" element={<CreateDocument />} />
                    <Route path="/documentlibrary" element={<DocumentLibrary />} />
                    <Route path="/view-document" element={<ViewDocumentPage />} />
                    <Route path="/notificationlibrary" element={<NotificationLibrary />} />
                    <Route path="/create/timeline-builder" element={<TimelineBuilder />} />
                    <Route path="/data-master" element={<DataMaster />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/projects-details" element={<Projects />} />
                    <Route path="/modules" element={<Module />} />
                    <Route path="/knowledge-center" element={<KnowledgeCenter />} />
                    <Route path="/document" element={<Document />} />
                    <Route path="*" element={<Navigate to="/not-found" replace />} />
                </Route>

            </Routes>
        </Router>
    );
};

export default AppRoutes;