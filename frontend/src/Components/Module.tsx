import { useEffect, useState } from "react";
import { generateTwoLetterAcronym } from "../Utils/generateTwoLetterAcronym";
import { useLocation } from "react-router-dom";
import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { addModule } from '../Utils/moduleStorage';
import "../styles/module.css"
import { Input, Button, Tooltip, Row, Col, Typography, Modal, Select, notification, AutoComplete, Radio } from 'antd';
import { SearchOutlined, ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, FilterOutlined, UserOutlined, BellOutlined, ArrowRightOutlined, PlusOutlined } from '@ant-design/icons';
const { Option } = Select;
import { getAllMineTypes, addNewMineType } from '../Utils/moduleStorage';
import UserRolesPage from "./AssignRACI";
import CreateNotification from "./CreateNotification";

const Module = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const existingAcronyms = useState(["FC", "BP", "AM", "IM"])[0];
    const moduleName = state?.moduleName ?? "";
    const mineType = state?.mineType ?? "";
    const moduleCode = state?.moduleCode ?? null;
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [open, setOpen] = useState<boolean>(false);
    const parentModuleCode = moduleCode
        ? moduleCode
        : generateTwoLetterAcronym(moduleName, existingAcronyms);
    const [openPopup, setOpenPopup] = useState<boolean>(false);
    const [newModelName, setNewModelName] = useState<string>("");
    const [selectedOption, setSelectedOption] = useState<string>("");
    const [options, setOptions] = useState<string[]>([]);
    const [mineTypePopupOpen, setMineTypePopupOpen] = useState<boolean>(false);
    const [newMineType, setNewMineType] = useState<string>("");
    const [shorthandCode, setShorthandCode] = useState<string>("");
    const [moduleCodeName, setModuleCodeName] = useState<string>("");
    const [filteredModuleData, setFilteredModuleData] = useState<any>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [moduleData, setModuleData] = useState<any>({
        parentModuleCode: parentModuleCode,
        moduleName: moduleName,
        level: "",
        mineType: mineType,
        duration: '',
        activities: state?.activities || []
    });
    const isEditing = !!state;

    useEffect(() => {
        if (state) {
            setModuleData({
                parentModuleCode: state.parentModuleCode,
                moduleName: state.moduleName,
                level: state.level,
                mineType: state.mineType,
                duration: state.duration,
                activities: state.activities
            });
        }
    }, [state]);

    useEffect(() => {
        try {
            const storedOptions = getAllMineTypes();
            if (storedOptions.length > 0) {
                setOptions(storedOptions);
            }
        } catch (error) {
            console.error("Error fetching mine types:", error);
        }
    }, []);

    const handleSaveModuleAndActivity = () => {
        try {
            if (isEditing) {
                const storedModulesString = localStorage.getItem("modules");
                const storedModules = storedModulesString ? JSON.parse(storedModulesString) : [];
                const updatedModules = storedModules.map((module: any) =>
                    module.parentModuleCode === moduleData.parentModuleCode ? moduleData : module
                );
                localStorage.setItem("modules", JSON.stringify(updatedModules));
                notification.success({
                    message: "Module updated successfully!",
                    duration: 3,
                });
            } else {
                addModule(moduleData);
                notification.success({
                    message: "Module saved successfully!",
                    duration: 3,
                });
            }
        } catch (error) {
            console.error("Error while saving/updating module:", error);
            notification.error({
                message: "Failed to save/update module.",
                description: "Check the console for details.",
                duration: 3,
            });
        }

        navigate('/create/module-library');
    };

    const addActivity = () => {
        if (!selectedRow) return;

        const isModuleSelected = selectedRow.level === "L1";
        const parentCode = isModuleSelected ? moduleData.parentModuleCode : selectedRow.code;
        const newLevel = isModuleSelected ? "L2" : selectedRow.level;
        const sameLevelActivities = moduleData.activities.filter((a: any) => a.level === newLevel);
        const lastActivity = sameLevelActivities.length > 0 ? sameLevelActivities[sameLevelActivities.length - 1] : null;
        const lastNumber = lastActivity ? parseInt(lastActivity.code.split('/').pop()) : 0;

        const newNumber = isModuleSelected
            ? (lastNumber ? lastNumber + 10 : 10)
            : parseInt(selectedRow.code.split('/').pop()) + 10;

        const newCode = isModuleSelected
            ? `${moduleData.parentModuleCode}/${newNumber}`
            : `${parentCode.split('/').slice(0, -1).join('/')}/${newNumber}`;

        const timestamp = new Date().toLocaleTimeString('en-GB');

        const newActivity = {
            code: newCode,
            activityName: "New Activity " + timestamp,
            duration: 0,
            prerequisite: isModuleSelected ? "" : selectedRow.code,
            level: newLevel
        };

        const updatedActivities: any = [];
        let inserted = false;

        moduleData.activities.forEach((activity: any) => {
            if (activity.code === selectedRow.code) {
                updatedActivities.push(activity);
                updatedActivities.push(newActivity);
                inserted = true;
            } else if (inserted && activity.level === newLevel) {
                const activityNumber = parseInt(activity.code.split('/').pop());
                const updatedCode = activity.code.replace(`/${activityNumber}`, `/${activityNumber + 10}`);
                updatedActivities.push({ ...activity, code: updatedCode });
            } else {
                updatedActivities.push(activity);
            }
        });

        if (isModuleSelected && !inserted) {
            updatedActivities.push(newActivity);
        }


        setModuleData((prev: any) => {
            const newData = { ...prev, activities: updatedActivities };
            return newData;
        });

        setTimeout(() => {
            handlePrerequisite();
        }, 0);
    };

    const deleteActivity = () => {
        if (!selectedRow || selectedRow.code === moduleData.parentModuleCode) return;

        setModuleData((prev: any) => {
            let activities = [...prev.activities];
            let children = activities.filter(activity => activity.code.startsWith(selectedRow.code + "/"));
            children.forEach(child => {
                let newParentCode = selectedRow.prerequisite;
                let childParts = child.code.split("/");
                childParts[selectedRow.code.split("/").length - 1] = newParentCode.split("/").pop();
                child.code = newParentCode + "/" + childParts.slice(-1);
                child.prerequisite = newParentCode;
            });

            let updatedActivities = activities.filter(activity => activity.code !== selectedRow.code);

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
        handlePrerequisite();
    };

    const increaseLevel = () => {
        if (!selectedRow || selectedRow.level === "L1") return;

        setModuleData((prev: any) => {
            let activities = [...prev.activities];
            let activityIndex = activities.findIndex((a) => a.code === selectedRow.code);
            if (activityIndex === -1) return prev;

            let activity = activities[activityIndex];
            let currentLevel = parseInt(activity.level.slice(1));

            let aboveIndex = activityIndex - 1;
            while (aboveIndex >= 0 && activities[aboveIndex].level !== activity.level) {
                aboveIndex--;
            }

            if (aboveIndex < 0) return prev;
            let aboveActivity = activities[aboveIndex];

            let lastChildCode = aboveActivity.code;
            let children = activities.filter((a) => a.code.startsWith(`${aboveActivity.code}/`));
            if (children.length > 0) {
                let lastChild = children[children.length - 1];
                let lastChildParts = lastChild.code.split("/");
                let lastChildNumber = parseInt(lastChildParts[lastChildParts.length - 1]);
                lastChildCode = `${aboveActivity.code}/${lastChildNumber + 10}`;
            } else {
                lastChildCode = `${aboveActivity.code}/10`;
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

            let previousLevel = `L${currentLevel}`;
            let siblings = updatedActivities.filter((a) => a.level === previousLevel && a.code !== activity.code);

            if (siblings) {
                let lastSiblingCode = aboveActivity.code;
                let lastSiblingPrefix = removeLastSegment(lastSiblingCode);
                let count = 10;

                siblings.forEach((sibling) => {
                    let newSiblingCode = `${lastSiblingPrefix}/${count}`;
                    sibling.code = newSiblingCode;
                    sibling.prerequisite = lastSiblingCode;
                    count += 10;
                    lastSiblingCode = newSiblingCode;
                });
            }

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
        handlePrerequisite();
    };

    const removeLastSegment = (code: any) => {
        let parts = code.split('/');
        if (parts.length > 1) {
            parts.pop();
        }
        return parts.join('/');
    };

    const decreaseLevel = () => {
        if (!selectedRow || selectedRow.level === "L1" || selectedRow.level === "L2") return;

        setModuleData((prev: any) => {
            let activities = [...prev.activities];
            let activityIndex = activities.findIndex((a) => a.code === selectedRow.code);
            if (activityIndex === -1) return prev;

            let activity = activities[activityIndex];
            let currentLevel = parseInt(activity.level.slice(1));

            // Find the new parent activity (one level above)
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

            if (!newParentCode) return prev;

            // Generate the new code for the updated activity
            let splited = newParentCode.split("/");
            let newNumber = parseInt(splited[splited.length - 1]) + 10;
            let newCode = `${removeLastSegment(newParentCode)}/${newNumber}`;
            let newLevel = `L${currentLevel - 1}`;

            // Update the current activity
            let updatedActivity = {
                ...activity,
                code: newCode,
                prerequisite: newParentCode,
                level: newLevel,
            };

            // Update the activities array
            let updatedActivities = [...activities];
            updatedActivities[activityIndex] = updatedActivity;

            // Re-number sibling activities
            let siblings = updatedActivities.filter((a) => a.level === newLevel && a.code.startsWith(removeLastSegment(newCode)));
            siblings.sort((a, b) => parseInt(a.code.split("/").pop()) - parseInt(b.code.split("/").pop()));

            let count = 10;
            siblings.forEach((sibling, index) => {
                let newSiblingCode = `${removeLastSegment(newCode)}/${count}`;
                sibling.code = newSiblingCode;
                if (index > 0) {
                    sibling.prerequisite = siblings[index - 1].code;
                }
                count += 10;
            });

            // Sort all activities by code to ensure correct order
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
        handlePrerequisite();
    };

    const handleEdit = (field: any, value: any) => {
        setModuleData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleActivityEdit = (code: any, field: any, value: any) => {
        setModuleData((prev: any) => ({
            ...prev,
            activities: prev.activities.map((activity: any) =>
                activity.code === code ? { ...activity, [field]: value } : activity
            ),
        }));
    };

    const handlePopupClose = () => setOpenPopup(false);

    const handleModulePlus = () => {
        if (newModelName && selectedOption) {
            if (newModelName.trim()) {
                setModuleData({
                    parentModuleCode: moduleCodeName
                        ? moduleCodeName
                        : generateTwoLetterAcronym(newModelName, existingAcronyms),
                    moduleName: newModelName,
                    level: "L1",
                    mineType: selectedOption,
                    activities: []
                })
                setNewModelName("");
                setSelectedOption("");
                handlePopupClose();
            }
        }
        else {
            console.error("Module Added Error:", { newModelName, selectedOption, moduleCode });
        }
    }

    const generateShorthand = (input: string): string => {
        return input
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase())
            .join("");
    };

    const handleAddNewMineType = () => {
        if (newMineType) {
            const updatedOptions = [...options, shorthandCode];
            addNewMineType(updatedOptions)
            setOptions(updatedOptions);
            setNewMineType("");
            setShorthandCode("");
            setMineTypePopupOpen(false);
        }
    };

    const handlePopupOpen = () => setOpenPopup(true);

    const handleMineTypeChange = (value: string) => {
        setNewMineType(value);
        setShorthandCode(generateShorthand(value));
    };

    const getAllPrerequisites = () => {
        return moduleData.activities
            .filter((activity: any) => activity.level !== "L1")
            .map((activity: any) => activity.code);
    };

    const handlePrerequisiteChange = (activityCode: any, value: any) => {
        const updatedActivities = moduleData.activities.map((activity: any) =>
            activity.code === activityCode ? { ...activity, prerequisite: value } : activity
        );
        setModuleData((prev: any) => ({ ...prev, activities: updatedActivities }));
    };

    const filterPrerequisites = (inputValue: string, option: any) => {
        return option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;
    };

    const handlePrerequisite = () => {
        setModuleData((prev: any) => {
            let parentCode: string = "";
            let firstIndex = 0;

            const updatedActivities = prev.activities.map((activity: any, index: number) => {
                if (firstIndex === 0) {
                    firstIndex = 1;
                    parentCode = activity.code; // Set parentCode for the first activity
                    return { ...activity, prerequisite: "" };
                } else if (activity.level === "L2") {
                    parentCode = activity.code; // Update parentCode when L2 is found
                    return { ...activity, prerequisite: prev.activities[index - 1]?.code || "" };
                } else if (activity.level !== "L1") {
                    return { ...activity, prerequisite: parentCode };
                }
                return activity;
            });

            return { ...prev, activities: updatedActivities };
        });
    };

    useEffect(() => {
        if (moduleData.activities.length > 0) {
            //handlePrerequisite();
        }
    }, [moduleData.activities]);

    const handleAssignRACI = () => {
        if (!selectedRow) {
            notification.warning({
                message: "Please select a row to assign RACI.",
                duration: 3,
            });
            return;
        }

        // Filter activities to include only the selected activity
        const filteredData = {
            ...moduleData, // Copy all other properties
            activities: moduleData.activities.filter(
                (activity: any) => activity.code === selectedRow.code
            ),
        };

        // Set the filtered data in state
        setFilteredModuleData(filteredData);

        // Open the modal
        setOpenModal(true);
    };

    const [moduleType, setModuleType] = useState("custom");
    const [selectedMTTSModule, setSelectedMTTSModule] = useState(null);
    const mttsModules = ["MTTS-001", "MTTS-002", "MTTS-003"];
    return (
        <div>
            <div className="module-main">

                <div className="top-item" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                    <div className="module-title" style={{ display: "flex", justifyContent: "space-between", gap: "100px", alignItems: "center" }}>
                        <span className="">Modules</span>
                        <div className="searching-and-create">
                            <Input
                                placeholder="Search modules, activities, levels"
                                size="small"
                                className="search-input"
                                style={{
                                    height: "30px",
                                    fontSize: "14px",
                                    boxShadow: isFocused ? "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)" : "none",
                                    transition: "box-shadow 0.3s ease-in-out",
                                }}
                                prefix={<SearchOutlined />}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                            />
                        </div>
                    </div>
                    <div className="toolbar-container">
                        <Row justify="space-between" align="middle">
                            <Col>
                                <Row gutter={16}>
                                    <Col>
                                        <Tooltip title="Decrease Level">
                                            <Button
                                                icon={<ArrowDownOutlined />}
                                                className="icon-button orange"
                                                onClick={decreaseLevel}
                                            />
                                        </Tooltip>
                                    </Col>
                                    <Col>
                                        <Tooltip title="Increase Level">
                                            <Button
                                                icon={<ArrowUpOutlined />}
                                                className="icon-button orange"
                                                onClick={increaseLevel}
                                            />
                                        </Tooltip>
                                    </Col>
                                    <Col>
                                        <Tooltip title="Delete">
                                            <Button
                                                icon={<DeleteOutlined />}
                                                className="icon-button red"
                                                onClick={deleteActivity}
                                            />
                                        </Tooltip>
                                    </Col>
                                    <Col>
                                        <Tooltip title="Filter">
                                            <Button
                                                icon={<FilterOutlined />}
                                                className="icon-button blue"
                                            />
                                        </Tooltip>
                                    </Col>
                                    <Col>
                                        <Tooltip title="Assign RACI">
                                            <Button
                                                icon={<UserOutlined />}
                                                onClick={handleAssignRACI}
                                                className="icon-button blue"
                                                disabled={!selectedRow}
                                            />
                                        </Tooltip>
                                        <Modal
                                            title={<span style={{ fontWeight: "bold", fontSize: "20px" }}>Assign User Roles</span>}
                                            open={openModal}
                                            onCancel={() => setOpenModal(false)}
                                            footer={false}
                                            width={"50%"}
                                        >
                                            <UserRolesPage
                                                open={openModal}
                                                onClose={() => setOpenModal(false)}
                                                selectedRow={selectedRow}
                                                moduleData={filteredModuleData}
                                            />
                                        </Modal>
                                    </Col>
                                    <Col>
                                        <Tooltip title="Notifications">
                                            <Button
                                                icon={<BellOutlined />}
                                                onClick={() => setOpen(true)}
                                                className="icon-button blue"
                                            />
                                        </Tooltip>
                                        <Modal
                                            title="Notification Settings"
                                            visible={open}
                                            onCancel={() => setOpen(false)}
                                            width={"70%"}
                                            footer={false}
                                        >
                                            <CreateNotification open={open} onClose={() => setOpen(false)} />
                                        </Modal>
                                    </Col>
                                    <Col>
                                        <Tooltip title="Add Activity">
                                            <Button
                                                type="primary"
                                                onClick={addActivity}
                                                className="add-button"
                                                style={{ height: "30px", fontSize: "14px" }}
                                            >
                                                Add Activity
                                            </Button>
                                        </Tooltip>
                                    </Col>

                                    <Col>
                                        <Tooltip title="Create New Module">
                                            <Button
                                                type="primary"
                                                onClick={handlePopupOpen}
                                                className="add-module-button"
                                                style={{ height: "30px", fontSize: "14px" }}
                                            >
                                                Create New Module
                                            </Button>
                                        </Tooltip>
                                    </Col>

                                </Row>
                            </Col>
                        </Row>
                    </div>
                </div>

                <div className="modules-data">
                    <div className="modules-items">
                        <Paper elevation={3}>
                            <Table className="custom-table">
                                <TableHead className="custom-header">
                                    <TableRow sx={{ backgroundColor: '#258790' }}>
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
                                        <TableCell contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleEdit('parentModuleCode', e.target.innerText)}
                                            sx={{ cursor: 'text', outline: 'none', padding: '10px' }}
                                        >{moduleData.parentModuleCode}</TableCell>
                                        <TableCell
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleEdit('moduleName', e.target.innerText)}
                                            sx={{ cursor: 'text', outline: 'none', padding: '10px' }}
                                        >
                                            {moduleData.moduleName}
                                        </TableCell>
                                        <TableCell
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleEdit('duration', e.target.innerText)}
                                            sx={{ cursor: 'text', outline: 'none', padding: '10px' }}
                                        >{moduleData.duration}
                                        </TableCell>
                                        <TableCell contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleEdit('', e.target.innerText)}
                                            sx={{ cursor: 'text', outline: 'none', padding: '10px' }}></TableCell>
                                        <TableCell sx={{ padding: '10px', cursor: "pointer" }}>{moduleData.level}</TableCell>
                                    </TableRow>
                                    {moduleData.activities
                                        .sort((a: any, b: any) => a.code.localeCompare(b.code))
                                        .map((activity: any, index: any, sortedActivities: any) => (
                                            <TableRow
                                                hover
                                                key={activity.code}
                                                selected={selectedRow?.code === activity.code}
                                                onClick={() => setSelectedRow(activity)}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell sx={{ padding: '10px', cursor: "pointer" }}>{activity.code}</TableCell>
                                                <TableCell
                                                    contentEditable
                                                    suppressContentEditableWarning
                                                    onBlur={(e) => handleActivityEdit(activity.code, 'activityName', e.target.innerText)}
                                                    sx={{ cursor: 'text', outline: 'none', padding: '10px' }}
                                                >
                                                    {activity.activityName}
                                                </TableCell>
                                                <TableCell
                                                    contentEditable
                                                    suppressContentEditableWarning
                                                    onBlur={(e) => handleActivityEdit(activity.code, 'duration', e.target.innerText)}
                                                    sx={{ cursor: 'text', outline: 'none', padding: '10px' }}
                                                >
                                                    {activity.duration}
                                                </TableCell>
                                                <TableCell sx={{ padding: '10px' }}>
                                                    <AutoComplete
                                                        value={activity.prerequisite || (index === 0 && activity.level === 'L2' ? "" : (sortedActivities[index - 1]?.code || ""))}
                                                        options={getAllPrerequisites().map((code: string) => ({ value: code }))}
                                                        onChange={(value) => handlePrerequisiteChange(activity.code, value)}
                                                        filterOption={filterPrerequisites}
                                                        placeholder="Select Prerequisite"
                                                        style={{ width: '100%' }}
                                                        allowClear
                                                    />
                                                </TableCell>

                                                <TableCell sx={{ padding: '10px', cursor: "pointer" }}>{activity.level}</TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>

                            </Table>
                        </Paper>
                    </div>
                    <div className="save-button-container">
                        <Button
                            type="primary"
                            className="save-button"
                            onClick={handleSaveModuleAndActivity}
                        >
                            {isEditing ? "Update" : "Save"} <ArrowRightOutlined className="save-button-icon" />
                        </Button>
                    </div>
                </div>

                <Modal
                    title="Create New Module"
                    open={openPopup}
                    onCancel={handlePopupClose}
                    onOk={handleModulePlus}
                    okButtonProps={{ className: "bg-secondary" }}
                    cancelButtonProps={{ className: "bg-tertiary" }}
                    maskClosable={false}
                    keyboard={false}
                    className="modal-container"
                    style={{ marginBottom: "10px !important" }}
                >
                    <div className="modal-body-item-padding">
                        <Radio.Group
                            value={moduleType}
                            onChange={(e) => setModuleType(e.target.value)}
                            style={{ marginBottom: "10px" }}
                        >
                            <Radio value="custom">Custom Module</Radio>
                            <Radio value="mtts">MTTS Module</Radio>
                        </Radio.Group>

                        <div style={{ display: "flex", gap: "10px" }}>
                            <Select
                                style={{ width: "100%", marginBottom: "10px" }}
                                value={selectedOption || undefined}
                                onChange={setSelectedOption}
                                placeholder="Select mine type"
                            >
                                {options.map((option, index) => (
                                    <Option key={index} value={option}>
                                        {option}
                                    </Option>
                                ))}
                            </Select>
                            <Button
                                type="dashed"
                                icon={<PlusOutlined />}
                                onClick={() => setMineTypePopupOpen(true)}
                            />
                        </div>

                        {moduleType === "custom" ? (
                            <Input
                                placeholder="Module Name"
                                value={newModelName}
                                onChange={(e) => setNewModelName(e.target.value)}
                                style={{ marginBottom: "10px" }}
                            />
                        ) : (
                            <Select
                                style={{ width: "100%", marginBottom: "10px" }}
                                value={selectedMTTSModule || undefined}
                                onChange={setSelectedMTTSModule}
                                placeholder="Select MTTS Module"
                            >
                                {mttsModules.map((module, index) => (
                                    <Option key={index} value={module}>
                                        {module}
                                    </Option>
                                ))}
                            </Select>
                        )}
                        <Input
                            placeholder="Module Code"
                            value={moduleCodeName}
                            onChange={(e) => setModuleCodeName(e.target.value)}
                            style={{ marginBottom: "10px" }}
                        />
                    </div>
                </Modal>

                <Modal
                    title="Add Mine Type"
                    open={mineTypePopupOpen}
                    onCancel={() => setMineTypePopupOpen(false)}
                    onOk={handleAddNewMineType}
                    okButtonProps={{ className: "bg-secondary" }}
                    cancelButtonProps={{ className: "bg-tertiary" }}
                    maskClosable={false}
                    keyboard={false}
                    className="modal-container"
                >
                    <div className="modal-body-item-padding">
                        <Input
                            placeholder="Enter Mine Type"
                            value={newMineType}
                            onChange={(e) => handleMineTypeChange(e.target.value)}
                            style={{ marginBottom: "10px" }}
                        />

                        <Typography>Shorthand Code: <strong>{shorthandCode}</strong></Typography>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default Module;