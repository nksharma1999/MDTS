import React, { useState, useEffect } from "react";
import { generateTwoLetterAcronym } from "../Utils/generateTwoLetterAcronym";
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

const Module = () => {
    const [existingAcronyms, setExistingAcronyms] = useState([
        "FC",
        "BP",
        "AM",
        "IM",
    ]);
    const location = useLocation();
    const { moduleName, mineType, moduleCode } = location.state || {};
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
        //Only first row will be created by parent module, it measn only L2 as add activity
        if (!selectedRow || 'L1' !== selectedRow.level) return;
        addSubActivityOrChild();
    };

    const addSubActivityOrChild = () => {
        // Get all existing codes for accurate numbering
        const parentCode = selectedRow.code || moduleData.parentModuleCode;
        console.log("selectedRow.code : ", selectedRow.code);
        const siblings = moduleData.activities.filter(a => a.prerequisite === parentCode);

        // Find highest existing number under this parent
        const existingNumbers = siblings.map(a => {
            const parts = a.code.split('/');
            return parseInt(parts[parts.length - 1]);
        });

        const newNumber = existingNumbers.length > 0
            ? Math.max(...existingNumbers) + 10
            : 10;

        const newCode = `${parentCode}/${newNumber}`;
        const newActivity = {
            code: newCode,
            activityName: "New Activity",
            duration: 10,
            prerequisite: parentCode,
            level: `L${parseInt(selectedRow.level.slice(1)) + 1}`
        };

        setModuleData(prev => ({
            ...prev,
            activities: [...prev.activities, newActivity]
        }));
    }

    const deleteActivity = () => {
        if (!selectedRow || selectedRow.code === moduleData.parentModuleCode) return;

        setModuleData(prev => {
            let filteredActivities = prev.activities.filter(activity => !activity.code.startsWith(selectedRow.code));
            let updatedActivities = [];
            let parentChildMap = {};

            filteredActivities.forEach(activity => {
                if (!parentChildMap[activity.prerequisite]) {
                    parentChildMap[activity.prerequisite] = [];
                }
                parentChildMap[activity.prerequisite].push(activity);
            });

            const adjustCodes = (parentCode, newParentCode) => {
                if (parentChildMap[parentCode]) {
                    parentChildMap[parentCode].forEach((activity, index) => {
                        const newCode = `${newParentCode}/${(index + 1) * 10}`;
                        activity.code = newCode;
                        activity.prerequisite = newParentCode;
                        updatedActivities.push(activity);
                        adjustCodes(activity.code, newCode);
                    });
                }
            };

            let mainActivities = filteredActivities.filter(activity => activity.prerequisite === moduleData.parentModuleCode);
            mainActivities.forEach((activity, index) => {
                const newCode = `${moduleData.parentModuleCode}/${(index + 1) * 10}`;
                activity.code = newCode;
                updatedActivities.push(activity);
                adjustCodes(activity.code, newCode);
            });

            return {
                ...prev,
                activities: updatedActivities
            };
        });

        setSelectedRow(null);
    };

    const changeLevel = (increase: boolean) => {
        if (!selectedRow || selectedRow.level === "L1") return;
        
        //Increase button will be act like new sub-activity or a child row now
        if (increase){
            addSubActivityOrChild();
            return;
        }

        setModuleData((prev) => {
            let activities = [...prev.activities];
            let activityIndex = activities.findIndex((a) => a.code === selectedRow.code);
            if (activityIndex === -1) return prev;

            let activity = activities[activityIndex];
            let currentLevel = parseInt(activity.level.slice(1));

            if (increase && currentLevel >= 3) return prev; // Max level L3
            if (!increase && currentLevel === 2) return prev; // Min level L2

            let newPrerequisite, newLevelValue;

            let parentCodeParts = activity.prerequisite.split("/");
            parentCodeParts.pop();
            newPrerequisite = parentCodeParts.join("/") || prev.parentModuleCode;
            newLevelValue = currentLevel - 1;

            const parentExists =
                newPrerequisite === prev.parentModuleCode ||
                activities.some((a) => a.code === newPrerequisite);

            if (!parentExists) return prev;

            let siblingsNewParent = activities.filter((a) => a.prerequisite === newPrerequisite);
            let existingNumbers = siblingsNewParent.map((a) => {
                const parts = a.code.split("/");
                return parseInt(parts[parts.length - 1]) || 0;
            });

            let newNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 10 : 10;
            let newCode = newPrerequisite === prev.parentModuleCode
                ? `${prev.parentModuleCode}/${newNumber}`
                : `${newPrerequisite}/${newNumber}`;

            let updatedActivity = {
                ...activity,
                code: newCode,
                prerequisite: newPrerequisite,
                level: `L${newLevelValue}`,
            };

            let updatedActivities = [...activities];
            updatedActivities[activityIndex] = updatedActivity;

            const updateChildren = (oldParent, newParent) => {
                updatedActivities.forEach((a) => {
                    if (a.prerequisite === oldParent) {
                        let parts = a.code.split("/");
                        let newChildCode = `${newParent}/${parts[parts.length - 1]}`;
                        a.code = newChildCode;
                        a.prerequisite = newParent;
                        updateChildren(oldParent, newChildCode);
                    }
                });
            };

            updateChildren(activity.code, newCode);

            return { ...prev, activities: updatedActivities };
        });
    };

    const handleDialogClose = () => {
        setOpen(false); // Close the dialog
    };

    const handleAssignRACI = () => {
        navigate('/assignraci');
    };

    return (
        <div style={{ padding: '20px' }}>

            <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" style={{ flexGrow: 1, color: "green" }}>
                        Tool Bar
                    </Typography>
                    <Stack direction="row" spacing={1}>

                        <Tooltip title="Decrease Level">
                            <IconButton onClick={() => changeLevel(false)} style={{
                                padding: 0,
                                margin: 0,
                                fontSize: "22px",
                                color: "orange",
                            }}>
                                <ArrowDownward />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Increase Level">
                            <IconButton onClick={() => changeLevel(true)} style={{
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
                                sx={{ backgroundColor: '#4A90E2', color: "black" }}
                            >
                                Add Activity
                            </Button>
                        </Tooltip>
                        <IconButton title="Assign RACI" onClick={handleAssignRACI}>
                            <PersonIcon style={{ color: "blue", fontSize: "30px" }} />
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
                    // disabled={!isSaveEnabled}
                    style={{
                        position: "fixed",
                        bottom: "20px",
                        right: "20px",
                        zIndex: 1000,
                        fontSize: '18px',
                        backgroundColor: "#4A90E2", // Blue background
                        color: "black", // White text for better contrast
                        //   opacity: isSaveEnabled ? 1 : 0.6, // Dim button if disabled
                    }}
                >
                    Save
                </Button>
            </div>
        </div>
    );
};

export default Module;