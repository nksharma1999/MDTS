import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    Menu,
    MenuItem,
    IconButton,
    Divider,
    Box,
    Button
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import "../styles/nav-bar.css";

const navLinks = [
    { label: "Home", action: "/home" },
    { label: "About", action: "/about" },
    { label: "Projects", action: "/projects" },
    { label: "Document", action: "/document" },
    { label: "Knowledge Center", action: "/knowledge-center" },
    { label: "Data Master", action: "/data-master" },
    {
        label: "Create",
        subItems: [
            { label: "Register New Project", action: "/create/register-new-project" },
            { label: "Create New Module", action: "/create/new-module", isNull: true },
            { label: "Timeline Builder", action: "/create/timeline-builder" },
            { label: "Non-working Days", action: "/create/non-working-days" },
            { label: "Delay Cost Calculator", action: "/create/delay-cost-calculator", isNull: true },
            { label: "Cash-Flow Builder", action: "/create/cash-flow-builder", isNull: true },
            { label: "Notification", action: "/create/notification", isNull: true },
            { label: "DPR Cost Builder", action: "/create/dpr-cost-builder", isNull: true },
            { label: "Module Library", action: "/create/module-library" },
            { label: "Status Update", action: "/create/status-update" },
            { label: "RACI, Alert & Notification", action: "/create/raci-alert-notification" },
            { label: "Dashboard", action: "/create/dashboard", isNull: true },
            { label: "Document", action: "/create/document" },
        ]
    }
];

const Navbar = () => {
    const [menuAnchor, setMenuAnchor] = useState<{ [key: string]: HTMLElement | null }>({});
    const location = useLocation();

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, label: string) => {
        setMenuAnchor((prev) => ({ ...prev, [label]: event.currentTarget }));
    };

    const handleMenuClose = (label: string) => {
        setMenuAnchor((prev) => ({ ...prev, [label]: null }));
    };

    const isActive = (action: string) => location.pathname.startsWith(action);

    return (
        <AppBar position="static" sx={{ bgcolor: "#257180" }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    MDTS
                </Typography>
                {navLinks.map((link, index) => (
                    <div
                        key={index}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            position: "relative",
                            margin: "0 8px",
                        }}
                    >
                        {link.subItems ? (
                            <div
                                className="nav-item"
                                onMouseEnter={(e) => handleMenuOpen(e as any, link.label)}
                                onMouseLeave={() => handleMenuClose(link.label)}
                                style={{
                                    padding: "5px 10px",
                                    position: "relative",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    backgroundColor: isActive(link.subItems[0].action) ? "#424242" : "transparent",
                                    borderRadius: "4px",
                                }}
                            >
                                <IconButton
                                    className="nav-menu"
                                    color="inherit"
                                    sx={{ fontSize: "1.1rem !important" }}
                                >
                                    {link.label} <ArrowDropDownIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={menuAnchor[link.label]}
                                    open={Boolean(menuAnchor[link.label])}
                                    onClose={() => handleMenuClose(link.label)}
                                    MenuListProps={{ onMouseLeave: () => handleMenuClose(link.label) }}
                                >
                                    {link.subItems.map((subItem, subIndex) => (
                                        <MenuItem
                                            key={subIndex}
                                            component={Link}
                                            to={subItem.action}
                                            disabled={subItem.isNull}
                                            onClick={() => handleMenuClose(link.label)}
                                            style={{
                                                fontWeight: isActive(subItem.action) ? "bold" : "normal",
                                                backgroundColor: isActive(subItem.action) ? "#e0e0e0" : "transparent",
                                            }}
                                        >
                                            {subItem.label}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </div>
                        ) : (
                            <Box
                                className={`nav-item ${isActive(link.action) ? "active" : ""}`}
                                component={Link}
                                to={link.action}
                                sx={{
                                    padding: "5px 10px",
                                    position: "relative",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    textDecoration: "none",
                                    color: "inherit",
                                    "&:hover": {
                                        backgroundColor: "#424242",
                                        borderRadius: "4px",
                                    },
                                    backgroundColor: isActive(link.action) ? "#424242" : "transparent",
                                    borderRadius: "4px",
                                }}
                            >
                                {link.label}
                            </Box>
                        )}
                        {index < navLinks.length - 1 && !link.subItems && (
                            <Divider
                                style={{ marginTop: "8px" }}
                                orientation="vertical"
                                flexItem
                                sx={{ bgcolor: "white", height: 20, margin: "0 5px" }}
                            />
                        )}
                    </div>
                ))}
                <Button
                    component={Link}
                    to="/sign-in"
                    variant="contained"
                    className="signin-btn"
                >
                    Login
                </Button>
                <Button
                    sx={{ marginLeft: "20px" }}
                    component={Link}
                    to="/employee-registration"
                    variant="contained"
                    className="signin-btn"
                >
                    Registration
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;