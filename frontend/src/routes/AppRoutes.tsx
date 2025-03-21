import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "../pages/Registration";
import Dashboard from "../pages/dashboard";
import SignIn from "../pages/SignIn";
import About from "../pages/About";
import Projects from "../pages/Projects";
import KnowledgeCenter from "../pages/KnowledgeCenter";
import Document from "../pages/Document";
import DataMaster from "../pages/DataMaster";
import NotFound from "../pages/NotFound";
import MainLayout from "../Layout/MainLayout";
import ProtectedRoute from "./ProtectedRoutes";
import Profile from "../pages/Profile";
import Module from "../Components/Module";
import CreateDocument from "../Components/CreateDocument";
import { CreateModule } from "../Components/CreateModule";
import DocumentPage from "../Components/Document";
import DocumentLibrary from "../Components/DocumentLibrary";
import { EmployeeRegistration } from "../Components/EmployeeRegistration";
import { HolidayCalender } from "../Components/HolidayCalender";
import ManageUser from "../Components/ManageUser";
import { ModuleDetails } from "../Components/ModuleDetail";
import ModuleLibrary from "../Components/ModuleLibrary";
import NotificationLibrary from "../Components/NotificationLibrary";
import { ProjectDetails } from "../Components/ProjectDetails";
import ProjectParametersPage from "../Components/ProjectParameterPage";
import { RegisterNewProject } from "../Components/RegisterNewProject";
import StatusUpdate from "../Components/StatusUpdate";
import TimelineBuilder from "../Components/TimelineBuilder";
import ViewDocumentPage from "../Components/ViewDocumentPage";
import ViewUser from "../Components/ViewUser";
import CreateNotification from "../Components/CreateNotification";


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
                    <Route path="/create/project-timeline" element={<StatusUpdate />} />
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
                    <Route path="/create/notification" element={<CreateNotification />} />
                    <Route path="*" element={<Navigate to="/not-found" replace />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default AppRoutes;