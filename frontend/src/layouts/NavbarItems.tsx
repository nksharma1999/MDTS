import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    Menu,
    MenuItem,
    IconButton,
    Divider,
    Box,
    Button,
    Modal,
    Select,
    TextField
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import "../styles/nav-bar.css";

const Navbar = () => {
    const [menuAnchor, setMenuAnchor] = useState<{ [key: string]: HTMLElement | null }>({});
    const [openPopup, setOpenPopup] = useState<string | null>(null);
    const location = useLocation();
    const [newModelName, setNewModelName] = useState("");
    const [selectedOption, setSelectedOption] = useState("");
    const [moduleCode, setModuleCode] = useState("");
    const [options, setOptions] = useState<any>([""]);
    const [mineTypePopupOpen, setMineTypePopupOpen] = useState(false);
    const [newMineType, setNewMineType] = useState("");
    const [shorthandCode, setShorthandCode] = useState("");
    const navigate = useNavigate();
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
                { label: "Create New Module", option: "popup", name: "add_new_modal" },
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

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, label: string) => {
        setMenuAnchor((prev) => ({ ...prev, [label]: event.currentTarget }));
    };

    const handleMenuClose = (label: string) => {
        setMenuAnchor((prev) => ({ ...prev, [label]: null }));
    };

    const generateShorthand = (input: string) => {
        return input.split(" ").map(word => word.charAt(0).toUpperCase()).join("");
    };
    const handleMineTypeChange = (value: string) => {
        setNewMineType(value);
        setShorthandCode(generateShorthand(value));
    };

    const handleAddOption = () => {
        if (newMineType) {
            setOptions((prevOptions: any) => [...prevOptions, shorthandCode]);
            setSelectedOption(newMineType);
            setNewMineType("");
            setShorthandCode("");
            setMineTypePopupOpen(false);
        }
    };

    const handleModulePlus = () => {
        if (newModelName && selectedOption) {
            if (newModelName.trim()) {
                navigate("/module", {
                    state: {
                        moduleName: newModelName,
                        mineType: selectedOption,
                        moduleCode: moduleCode,
                    },
                });
                setNewModelName("");
                setSelectedOption("");
                handlePopupClose();
            }
        }
        else {
            console.error("Module Added Error:", { newModelName, selectedOption, moduleCode });
        }
    }

    const handlePopupOpen = (name: string) => {
        setOpenPopup(name);
    };

    const handlePopupClose = () => {
        setOpenPopup(null);
    };

    const isActive = (action: string) => location.pathname.startsWith(action);

    return (
        <>
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
                                        backgroundColor: isActive(link.subItems[0]?.action || "") ? "#424242" : "transparent",
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
                                                component={subItem.option === "popup" ? "div" : Link}
                                                to={subItem.action || ""}
                                                disabled={subItem.isNull}
                                                onClick={() => {
                                                    if (subItem.option === "popup") {
                                                        handlePopupOpen(subItem.name);
                                                    } else {
                                                        handleMenuClose(link.label);
                                                    }
                                                }}
                                                style={{
                                                    fontWeight: isActive(subItem.action || "") ? "bold" : "normal",
                                                    backgroundColor: isActive(subItem.action || "") ? "#e0e0e0" : "transparent",
                                                    cursor: subItem.option === "popup" ? "pointer" : "default"
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
                    <Button component={Link} to="/sign-in" variant="contained" className="signin-btn">
                        Login
                    </Button>
                    <Button sx={{ marginLeft: "20px" }} component={Link} to="/employee-registration" variant="contained" className="signin-btn">
                        Registration
                    </Button>
                </Toolbar>
            </AppBar>


            <Modal open={openPopup === "add_new_modal"} onClose={handlePopupClose}>
                <Box sx={{ width: 500, margin: "100px auto", padding: "20px", bgcolor: "white", borderRadius: "10px", boxShadow: 24 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                        Create New Module
                    </Typography>

                    {/* Module Name */}
                    <TextField
                        fullWidth
                        label="Module Name"
                        variant="outlined"
                        value={newModelName}
                        onChange={(e) => setNewModelName(e.target.value)}
                        sx={{ mb: 2, borderRadius: "8px" }}
                    />

                    {/* Applicable Mine Type */}
                    <Box sx={{ p: 2, borderRadius: "10px", backgroundColor: "#f8f9fa", mb: 2 }}>
                        <div className="d-flex align-items-center justify-content-between">
                            <Typography sx={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}>
                                Applicable Mine Type
                            </Typography>
                            <button
                                type="button"
                                className="btn btn-link text-primary"
                                onClick={() => setMineTypePopupOpen(true)}
                                style={{ fontSize: "24px", textDecoration: "none", fontWeight: "bold" }}
                            >
                                +
                            </button>
                        </div>
                        <Select
                            fullWidth
                            value={selectedOption}
                            onChange={(e) => setSelectedOption(e.target.value)}
                            displayEmpty
                            sx={{ mt: 1, height: 45, fontSize: "14px", borderRadius: "8px" }}
                        >
                            <MenuItem value="">-- Select --</MenuItem>
                            {options.map((option: any, index: any) => (
                                <MenuItem key={index} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>

                    {/* Module Code */}
                    <TextField
                        fullWidth
                        label="Module Code"
                        variant="outlined"
                        value={moduleCode}
                        onChange={(e) => setModuleCode(e.target.value)}
                        sx={{ mb: 2, borderRadius: "8px" }}
                    />

                    {/* Buttons */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                        <Button className="bg-tertiary text-white" onClick={handlePopupClose} variant="contained" color="secondary">
                            Close
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleModulePlus}
                            className="bg-secondary text-white"
                            sx={{ borderRadius: "8px", fontWeight: "bold" }}
                        >
                            Add Module
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Modal for Adding New Mine Type */}
            <Modal open={mineTypePopupOpen} onClose={() => setMineTypePopupOpen(false)}>
                <Box sx={{ width: 400, margin: "100px auto", padding: "20px", bgcolor: "white", borderRadius: "10px", boxShadow: 24 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                        Add Mine Type
                    </Typography>

                    {/* Input for Mine Type */}
                    <TextField
                        fullWidth
                        label="Enter Mine Type"
                        variant="outlined"
                        value={newMineType}
                        onChange={(e) => handleMineTypeChange(e.target.value)}
                        sx={{ mb: 2, borderRadius: "8px" }}
                    />

                    {/* Display Auto-Generated Shorthand Code */}
                    <Box sx={{ p: 2, backgroundColor: "#f8f9fa", borderRadius: "8px", mb: 2 }}>
                        <Typography>
                            Shorthand Code: <strong>{shorthandCode}</strong>
                        </Typography>
                    </Box>

                    {/* Buttons */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                        <Button className="bg-tertiary text-white" onClick={() => setMineTypePopupOpen(false)} variant="contained" color="secondary">
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleAddOption}
                            className="bg-secondary text-white"
                            sx={{ borderRadius: "8px", fontWeight: "bold" }}
                        >
                            Save
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default Navbar;
