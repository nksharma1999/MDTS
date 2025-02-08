import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "../pages/auth/Registration";
import SignIn from "../pages/auth/signin";
import Dashboard from "../pages/home/dashboard";
import LandingPage from "../pages/LandingPage";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signin" element={<Dashboard />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
