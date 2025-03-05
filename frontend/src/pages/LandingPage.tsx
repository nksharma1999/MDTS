import { Outlet } from "react-router-dom";
import Navbar from "../layouts/NavbarItems";
import "../styles/landing-page.css";
// import { Box } from "@mui/material";

const LandingPage = () => {
    return (
        <>
            {/* <Box
                sx={{
                    background: "linear-gradient(135deg, #257180 20%, #e33b28 60%, #257180 80%)",
                    textAlign: "center",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    px: 1,
                    py: 1,
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                }}
            >
                <div className="logo-sections">
                    <img
                        src="../public/images/logos/main-logo.png"
                        alt="Logo"
                        className="logo-image"
                    />
                </div>
                <p className="heading-title">Mine Development Tracking System</p>
            </Box> */}


            <div className="navbar-div" >
                <Navbar />
            </div>

            <main className="main-content">
                <Outlet />
            </main>
        </>
    );
};

export default LandingPage;