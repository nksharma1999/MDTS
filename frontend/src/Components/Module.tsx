import React, { useState, useEffect } from "react";
import { generateTwoLetterAcronym } from "../Utils/generateTwoLetterAcronym";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useLocation } from "react-router-dom";
import {
    TextField,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    IconButton,
    Tooltip,
    Button,
    Stack,
    InputAdornment,
    Typography
} from "@mui/material";
import {
    Add,
    Delete,
    ArrowUpward,
    ArrowDownward,
    Save,
    Search
} from "@mui/icons-material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import FilterListIcon from "@mui/icons-material/FilterList";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from 'react-router-dom';
import {
    addModule,
    isDuplicateModuleName,
    isDuplicateModuleCode
} from '../Utils/moduleStorage';
import CreateNotification from "./CreateNotification";
import UserRolesPage from './AssignRACI';

const Module = () => {
    const [existingAcronyms, setExistingAcronyms] = useState([
        "FC",
        "BP",
        "AM",
        "IM",
    ]);
    const location = useLocation();
    const { moduleName, mineType, moduleCode } = location.state || {};
    const [openModal, setOpenModal] = useState(false);
    const [moduleData, setModuleData] = useState({
        parentModuleCode: moduleCode ? moduleCode : generateTwoLetterAcronym(moduleName, existingAcronyms), // Initialize from nav bar else keep empty
        moduleName: moduleName, // Ensure moduleName is defined or passed as props/state
        level: 'L1',
        mineType: mineType,
        activities: []
    });
    const [selectedRow, setSelectedRow] = useState(null);
    const navigate = useNavigate();
    const [openPopup, setOpenPopup] = useState(false);
    const [open, setOpen] = useState(false);

    const handleSaveModuleAndActivity = () => {
        try {
            console.log('Inside handleSaveModuleAndActivity', moduleData)
            addModule(moduleData);
            window.alert("Modules saved successfully!");
        } catch (error) {
            console.error("Error while saving modules:", error);
            window.alert("Failed to save modules. Check the console for details.");
        }
        navigate('/ModuleLibrary');
    };

    const addActivity = () => {
        if (!selectedRow) return;
    
        const isModuleSelected = selectedRow.level === "L1"; // Check if L1 is selected
        const parentCode = isModuleSelected ? moduleData.parentModuleCode : selectedRow.code;
        const newLevel = isModuleSelected ? "L2" : selectedRow.level;
    
        // Find all activities at the same level
        const sameLevelActivities = moduleData.activities.filter(a => a.level === newLevel);
        
        // Find the index of the selectedRow in the list
        const selectedIndex = sameLevelActivities.findIndex(a => a.code === selectedRow.code);
        
        // Determine the new activity number
        const lastActivity = sameLevelActivities.length > 0 ? sameLevelActivities[sameLevelActivities.length - 1] : null;
        const lastNumber = lastActivity ? parseInt(lastActivity.code.split('/').pop()) : 0;
    
        // Assign new code
        const newNumber = isModuleSelected
            ? (lastNumber ? lastNumber + 10 : 10)
            : parseInt(selectedRow.code.split('/').pop()) + 10;
        
        const newCode = isModuleSelected
            ? `${moduleData.parentModuleCode}/${newNumber}`
            : `${parentCode.split('/').slice(0, -1).join('/')}/${newNumber}`;
    
        // Timestamp for naming the new activity
        const timestamp = new Date().toLocaleTimeString('en-GB');
    
        // Create new activity
        const newActivity = {
            code: newCode,
            activityName: "New Activity " + timestamp,
            duration: 10,
            prerequisite: isModuleSelected ? "-" : selectedRow.code,
            level: newLevel
        };
    
        // Reorder and update existing activities
        const updatedActivities = [];
        let inserted = false;
    
        moduleData.activities.forEach(activity => {
            if (activity.code === selectedRow.code) {
                updatedActivities.push(activity);
                updatedActivities.push(newActivity);
                inserted = true;
            } else if (inserted && activity.level === newLevel) {
                // Increment the numbering for activities at the same level after the insertion
                const activityNumber = parseInt(activity.code.split('/').pop());
                const updatedCode = activity.code.replace(`/${activityNumber}`, `/${activityNumber + 10}`);
                updatedActivities.push({ ...activity, code: updatedCode });
            } else {
                updatedActivities.push(activity);
            }
        });
    
        // If adding under L1 and no insertion happened, push to the end
        if (isModuleSelected && !inserted) {
            updatedActivities.push(newActivity);
        }
    
        // Update state
        setModuleData(prev => ({
            ...prev,
            activities: updatedActivities
        }));
    
        console.log("Updated Activities:", updatedActivities);
    };
    


    const deleteActivity = () => {
        if (!selectedRow || selectedRow.code === moduleData.parentModuleCode) return;
    
        setModuleData(prev => {
            let activities = [...prev.activities];
    
            // Step 1: Find all children of the selected activity
            let children = activities.filter(activity => activity.code.startsWith(selectedRow.code + "/"));
    
            // Step 2: Update children to adopt the deleted row's parent
            children.forEach(child => {
                let newParentCode = selectedRow.prerequisite; // Assign new parent
                let childParts = child.code.split("/");
                childParts[selectedRow.code.split("/").length - 1] = newParentCode.split("/").pop(); // Adjust numbering
                child.code = newParentCode + "/" + childParts.slice(-1); // Rebuild child code
                child.prerequisite = newParentCode; // Update prerequisite
            });
    
            // Step 3: Remove the selected activity
            let updatedActivities = activities.filter(activity => activity.code !== selectedRow.code);
    
            // Step 4: Renumber the remaining activities at the same level
            let sameLevelActivities = updatedActivities.filter(activity => {
                let parentCode = selectedRow.code.split("/").slice(0, -1).join("/");
                return activity.code.startsWith(parentCode) && activity.level === selectedRow.level;
            });
    
            sameLevelActivities.sort((a, b) => parseInt(a.code.split("/").pop()) - parseInt(b.code.split("/").pop()));
    
            sameLevelActivities.forEach((activity, index) => {
                let newCode = `${selectedRow.code.split("/").slice(0, -1).join("/")}/${(index + 1) * 10}`;
                activity.code = newCode;
            });
    
            return {
                ...prev,
                activities: updatedActivities
            };
        });
    
        setSelectedRow(null);
    };
    

    const increaseLevel = () => {
        if (!selectedRow || selectedRow.level === "L1") return;

        setModuleData((prev) => {
            let activities = [...prev.activities];
            let activityIndex = activities.findIndex((a) => a.code === selectedRow.code);
            if (activityIndex === -1) return prev;

            let activity = activities[activityIndex];
            let currentLevel = parseInt(activity.level.slice(1));

            if (currentLevel >= 3) return prev; // Max level L3

            // Find immediate above row of the same level
            let aboveIndex = activityIndex - 1;
            while (aboveIndex >= 0 && activities[aboveIndex].level !== activity.level) {
                aboveIndex--;
            }

            if (aboveIndex < 0) return prev;

            let aboveActivity = activities[aboveIndex];

            // Find the last child of the above activity to generate the next sequential code
            let lastChildCode = aboveActivity.code;
            let children = activities.filter((a) => a.code.startsWith(`${aboveActivity.code}/`));
            if (children.length > 0) {
                let lastChild = children[children.length - 1];
                let lastChildParts = lastChild.code.split("/");
                let lastChildNumber = parseInt(lastChildParts[lastChildParts.length - 1]);
                lastChildCode = `${aboveActivity.code}/${lastChildNumber + 10}`; // Increment by 10
            } else {
                lastChildCode = `${aboveActivity.code}/10`; // First child
            }

            let newLevelValue = currentLevel + 1;

            let updatedActivity = {
                ...activity,
                code: lastChildCode,
                prerequisite: aboveActivity.code,
                level: `L${newLevelValue}`,
            };

            let updatedActivities = [...activities];
            updatedActivities[activityIndex] = updatedActivity;

            // Adjust remaining activities at previous level (L2)
            let previousLevel = `L${currentLevel}`;
            let siblings = updatedActivities.filter((a) => a.level === previousLevel && a.code !== activity.code);

            let lastSiblingCode = aboveActivity.code; // Find the last valid L2 code
            let count = 10;

            siblings.forEach((sibling) => {
                let newSiblingCode = `${lastSiblingCode.split("/")[0]}/${count}`;
                sibling.code = newSiblingCode;
                sibling.prerequisite = lastSiblingCode;
                count += 10;
            });

            // Sort activities by code to ensure they are in correct order
            updatedActivities.sort((a, b) => {
                let aParts = a.code.split("/").map(Number);
                let bParts = b.code.split("/").map(Number);
                for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
                    let aPart = aParts[i] || 0;
                    let bPart = bParts[i] || 0;
                    if (aPart !== bPart) return aPart - bPart;
                }
                return 0;
            });

            return { ...prev, activities: updatedActivities };
        });
    };

    const decreaseLevel = () => {
        if (!selectedRow || selectedRow.level === "L1") return; // L1 cannot be decreased
    
        setModuleData((prev) => {
            let activities = [...prev.activities];
            let activityIndex = activities.findIndex((a) => a.code === selectedRow.code);
            if (activityIndex === -1) return prev;
    
            let activity = activities[activityIndex];
            let currentLevel = parseInt(activity.level.slice(1));
    
            // Step A: Find the nearest parent row with a lower level
            let aboveIndex = activityIndex - 1;
            let newParentCode = "";
            while (aboveIndex >= 0) {
                let aboveActivity = activities[aboveIndex];
                let aboveLevel = parseInt(aboveActivity.level.slice(1));
    
                if (aboveLevel < currentLevel) {
                    newParentCode = aboveActivity.code;
                    break;
                }
                aboveIndex--;
            }
    
            if (!newParentCode) return prev; // No valid parent found
    
            // Step B: Generate new L2 code (last L2 code + 10)
            let lastL2 = activities
                .filter(a => a.level === "L2")
                .pop()?.code || `${newParentCode}/0`;
    
            let lastL2Number = parseInt(lastL2.split("/").pop()) || 0;
            let newCode = `${newParentCode.split("/")[0]}/${lastL2Number + 10}`;
            let newLevel = `L${currentLevel - 1}`;
    
            // Step C: Update the selected row
            let updatedActivity = {
                ...activity,
                code: newCode,
                prerequisite: newParentCode,
                level: newLevel,
            };
    
            let updatedActivities = [...activities];
            updatedActivities[activityIndex] = updatedActivity;
    
            // Step D: Adjust child modules (if any)
            for (let i = activityIndex + 1; i < updatedActivities.length; i++) {
                let item = updatedActivities[i];
    
                if (item.prerequisite.startsWith(selectedRow.code)) {
                    let newItemCode = item.code.replace(selectedRow.code, newCode);
                    item.code = newItemCode;
                    item.prerequisite = newCode;
                }
            }
    
            return { ...prev, activities: updatedActivities };
        });
    };
    
    return (
        <div style={{ padding: '20px' }}>

            <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" style={{ flexGrow: 1, color: "black", fontWeight: "bold" }}>
                        Tool Bar
                    </Typography>
                    <Stack direction="row" spacing={1}>

                        <Tooltip title="Decrease Level">
                            <IconButton onClick={() => decreaseLevel()} style={{
                                padding: 0,
                                margin: 0,
                                fontSize: "22px",
                                color: "orange",
                            }}>
                                <ArrowDownward />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Increase Level">
                            <IconButton onClick={() => increaseLevel()} style={{
                                padding: 0,
                                margin: 0,
                                fontSize: "22px",
                                color: "orange",
                            }}>
                                <ArrowUpward />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton onClick={deleteActivity} style={{ marginLeft: 0, color: "red" }}>
                                <Delete />
                            </IconButton>
                        </Tooltip>
                        <button
                            title="Filter"
                            onClick={""}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            <FilterListIcon style={{ fontSize: "24px", color: "blue" }} />
                        </button>
                        <TextField
                            placeholder="Search modules, activities, levels"
                            variant="outlined"
                            size="small"
                            style={{ width: "300px", }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Tooltip title="Add Activity">
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={addActivity}
                                sx={{ backgroundColor: '#ED9121', color: "black" }}
                            >
                                Add Activity
                            </Button>
                        </Tooltip>
                        <IconButton title="Assign RACI" onClick={() => setOpenModal(true)}>
                            <PersonIcon style={{ color: "blue", fontSize: "30px" }} />
                            <UserRolesPage open={openModal} handleClose={() => setOpenModal(false)} />
                        </IconButton>
                        <IconButton title="Notifications" onClick={() => setOpen(true)}>
                            <NotificationsIcon style={{ color: "blue", fontSize: "30px" }} />
                            <CreateNotification open={open} onClose={() => setOpen(false)} />
                        </IconButton>
                    </Stack>
                </Stack>
            </Paper>

            <Paper elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#4F7942' }}>
                            <TableCell sx={{ fontWeight: 'bold', color: "white" }}>Code</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: "white" }}>Module Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: "white" }}>Duration (in days)</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: "white" }}>Prerequisites</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: "white" }}>Level</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow
                            hover
                            selected={selectedRow === moduleData}
                            onClick={() => setSelectedRow(moduleData)}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell>{moduleData.parentModuleCode}</TableCell>
                            <TableCell>{moduleData.moduleName}</TableCell>
                            <TableCell>10</TableCell>
                            <TableCell>-</TableCell>
                            <TableCell>{moduleData.level}</TableCell>
                        </TableRow>
                        {moduleData.activities
                            .sort((a, b) => a.code.localeCompare(b.code))
                            .map((activity, index, sortedActivities) => (
                                <TableRow
                                    hover
                                    key={activity.code}
                                    selected={selectedRow?.code === activity.code}
                                    onClick={() => setSelectedRow(activity)}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>{activity.code}</TableCell>
                                    <TableCell>{activity.activityName}</TableCell>
                                    <TableCell>{activity.duration}</TableCell>
                                    <TableCell>
                                        {(index === 0 && activity.level === 'L2') // First row with level 'L2' should display nothing
                                            ? null
                                            : (sortedActivities[index - 1]?.code || "-")} {/* Display previous row's code */}
                                    </TableCell>
                                    <TableCell>{activity.level}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </Paper>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    onClick={handleSaveModuleAndActivity}
                    style={{
                        position: "fixed",
                        bottom: "20px",
                        right: "20px",
                        zIndex: 1000,
                        fontSize: "18px",
                        backgroundColor: "#ED9121", // Orange background
                        color: "black", // Black text for contrast
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // Space between text and icon
                        padding: "10px 16px",
                        borderRadius: "8px",
                    }}
                >
                    Save <ArrowForwardIcon style={{ fontSize: "22px" }} />
                </Button>

            </div>
        </div>
    );
};

export default Module;