import { useState, useEffect } from "react";
import { generateTwoLetterAcronym } from "../Utils/generateTwoLetterAcronym";
import { useLocation } from "react-router-dom";
import { IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import {
  Typography,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  addModule,
  isDuplicateModuleName,
  isDuplicateModuleCode
} from '../Utils/moduleStorage';
import { useNavigate } from 'react-router-dom';



export const CreateModule = () => {
  const location = useLocation();
  const { moduleName, mineType, moduleCode } = location.state || {};
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [collapsedModules, setCollapsedModules] = useState({});
  const [isSaveEnabled, setIsSaveEnabled] = useState(true);
  const [selectedRow, setSelectedRow] = useState({ moduleIndex: 0, activityIndex: null });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(null);
  const [modules, setModules] = useState([]);
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState("");
  const activities = [];

  const [existingAcronyms, setExistingAcronyms] = useState([
    "FC",
    "BP",
    "AM",
    "IM",
  ]);

  const [module, setModule] = useState([
    {
      parentModuleCode: moduleCode ? moduleCode : '', // Initialize from nav bar else keep empty
      moduleName: moduleName, // Ensure moduleName is defined or passed as props/state
      mineType: mineType,
      lavel: 'L0',
      plus: 0,
      activitys: [],
    },
  ]);

  const [newActInput, setNewActInput] = useState({
    pCode: "",
    childCode: "",
    index: 0,
    input: "",
  });

  // Update parentModuleCode when moduleName changes
  useEffect(() => {
    if (moduleName) {
      //Checking module name duplication
      if (isDuplicateModuleName(moduleName)) {
        const errorMessage = `Duplicate module name found: ${moduleName}`;
        window.alert(errorMessage); // Show an alert to the user
        throw new Error(errorMessage); // Throw an exception for duplication
      }
      const acronym = moduleCode ? moduleCode : generateModuleCode(moduleName);
      console.log("Code, mineType, name : ", acronym, mineType, moduleName);
      setModule((prevModule) =>
        prevModule.map((mod) => ({
          ...mod,
          parentModuleCode: acronym, // Update parentModuleCode
          mineType: mineType
        }))
      );
    }
  }, [moduleName]);

  //Generate a new code 
  const generateModuleCode = (moduleName: string) => {
    try {
      // Generate a two-letter acronym (replace generateTwoLetterAcronym with your actual implementation)
      const acronym = generateTwoLetterAcronym(moduleName, existingAcronyms);

      //Now checking module code duplication
      if (isDuplicateModuleCode(acronym)) {
        //Instead of throwing the error re-generate new acronym
        const errorMessage = `Duplicate module code found for module name : ${moduleName}`;
        window.alert(errorMessage); // Show an alert to the user
        throw new Error(errorMessage); // Throw an exception for duplication
      }
      return acronym;
    } catch (error) {
      //console.error("Error in generateModuleCode:", error);
      navigate('/');
    }
    return "NA"; // Return a fallback value in case of an error
  };

  //Save module to local storage
  const handleSaveModuleAndActivity = () => {
    try {
      console.log('Inside handleSaveModuleAndActivity', module)
      addModule(module);
      setIsSaveEnabled(false);
      window.alert("Modules saved successfully!");
    } catch (error) {
      console.error("Error while saving modules:", error);
      window.alert("Failed to save modules. Check the console for details.");
    }
    navigate('/ModuleLibrary');
  };

  const handleAddActivity = () => {
    const { moduleIndex, activityIndex } = selectedRow;

    // Clone the modules state
    const updatedModules = [...module];
    const selectedModule = updatedModules[moduleIndex];
    const activities = selectedModule.activitys;

    // Determine the parent code and level
    const isRootLevel = activityIndex === null;
    const parentCode = isRootLevel
      ? selectedModule.parentModuleCode // Module-level parent code
      : activities[activityIndex].code; // Activity-level parent code

    const parentLevel = isRootLevel ? 0 : activities[activityIndex].level;

    // Generate the new activity code
    const newActivityCode = generateActivityCode(activities, parentCode);

    // Create a new activity object
    const newActivity = {
      level: parentLevel + 1, // Increment level for sub-activity
      name: "New Activity",
      code: newActivityCode,
      plus: 10, // Default value
      duration: 10, // Default value
      prerequisites: parentCode, // Reference parent code
    };

    // Insert the new activity below the selected one
    activities.splice(activityIndex !== null ? activityIndex + 1 : activities.length, 0, newActivity);

    // Sort activities by code and level for consistency
    activities.sort((a, b) => {
      const [codeA, codeB] = [a.code, b.code];
      if (codeA === codeB) return a.level - b.level;
      return codeA.localeCompare(codeB, undefined, { numeric: true });
    });

    // Update the module state
    setModule(updatedModules);
  };

  const generateActivityCode = (activities, parentCode) => {
    // Get direct children of the parent code
    const childActivities = activities.filter((act) => act.code.startsWith(`${parentCode}/`));

    // Extract numeric suffixes from child activity codes
    const childNumbers = childActivities.map((act) => {
      const parts = act.code.split("/");
      return parseInt(parts[parts.length - 1], 10); // Extract the last numeric part
    });

    // Determine the next number for the new activity (increment by 10)
    const nextNumber = childNumbers.length > 0 ? Math.max(...childNumbers) + 10 : 10;

    // Generate the new activity code
    return `${parentCode}/${nextNumber}`;
  };


  // Check if it is a submodule
  const isSubModule = (prevCode: string, currentCode: string): boolean => {
    const preCodeArr = prevCode.split("/");
    const currodeArr = currentCode.split("/");

    if (
      preCodeArr.length !== currodeArr.length ||
      (currodeArr[1] !== undefined &&
        isNaN(Number(currodeArr[1])) &&
        !Number.isInteger(Number(currodeArr[1])))
    ) {
      return true;
    }
    return false; // Replace this with your actual logic
  };

  // Updated `getCode` Function
  const getCode = (baseCode: string, increment: number = 1): string => {
    // Split the base code into parts
    const codeParts = baseCode.split("/");

    // Parse the last part of the code as a number
    const lastPart = parseInt(codeParts[codeParts.length - 1], 10);

    // If the last part is numeric, increment it; otherwise, start with '10'
    const newLastPart = isNaN(lastPart) ? 10 : lastPart + increment * 10;

    // Join the base parts with the new incremented part
    return `${codeParts.slice(0, -1).join("/")}/${newLastPart}`;
  };


  const handleModuleMinus = (pCode: string, index: number, values: any) => {
    setModule((prevModules) => {
      return prevModules.map((mod) => {
        if (mod.parentModuleCode === pCode) {
          // Step 1: Decrease Level
          let updatedActivities = mod.activitys.map((act, idx) => {
            if (idx === index) {
              if (act.level > 1) {
                let newLevel = act.level - 1;
                let newCode = removeLastSegment(act.code);
                if (!newCode.includes("/")) {
                  newCode = `${pCode}/10`;
                }
                return { ...act, level: newLevel, code: newCode };
              }
            }
            return act;
          });
  
          // Step 2: Sort Activities
          updatedActivities = updatedActivities.sort((a, b) =>
            a.code.localeCompare(b.code)
          );
  
          // Step 3: Fix Duplicates
          updatedActivities = fixDuplicateCodes(updatedActivities, pCode);
  
          return { ...mod, activitys: updatedActivities };
        }
        return mod;
      });
    });
  };
  
  /**
   * Removes the last segment (e.g., `/10`) from a code.
   */
  const removeLastSegment = (code: string) => {
    const parts = code.split("/");
    if (parts.length > 1) {
      parts.pop(); // Remove last segment
    }
    return parts.join("/");
  };
  
  /**
   * Fixes duplicate activity codes by renaming them uniquely.
   */
  const fixDuplicateCodes = (activities: any[], pCode: string) => {
    const codeMap = new Map<string, number>();
    const updatedActivities = [];
  
    activities.forEach((act) => {
      let baseCode = act.code.split("/").slice(0, -1).join("/") || pCode;
      let lastSegment = parseInt(act.code.split("/").pop() || "10", 10);
  
      // If baseCode already exists, increment the last segment
      if (codeMap.has(baseCode)) {
        lastSegment = codeMap.get(baseCode) + 10;
      }
  
      const newCode = `${baseCode}/${lastSegment}`;
      codeMap.set(baseCode, lastSegment);
  
      updatedActivities.push({ ...act, code: newCode });
    });
  
    return updatedActivities;
  };
  
  
  
  const handleDelete = () => {
    const { moduleIndex, activityIndex } = selectedRow;
    if (activityIndex !== null) {
      setModule((prevModule) => {
        const updatedModule = [...prevModule];
        updatedModule[moduleIndex].activitys.splice(activityIndex, 1);
        return updatedModule;
      });
    } else {
      setModule((prevModule) =>
        prevModule.filter((_, idx) => idx !== moduleIndex)
      );
    }
    setSelectedRow({ moduleIndex: 0, activityIndex: null });
  };

  const handleSaveActivity = () => {
    let tempData = module;
    for (let i = 0; i < tempData.length; i++) {
      if (tempData[i].parentModuleCode === newActInput.pCode) {
        const act = tempData[i].activitys;

        act.splice(newActInput.index + 1, 0, {
          level: act[newActInput.index].level,
          name: newActInput.input,
          code: getCode(
            act[newActInput.index].code,
            act[newActInput.index].plus
          ),
          plus: act[newActInput.index].plus + 10,
          duration: "",
          prerequisites: act[newActInput.index].prerequisites,
        });

        for (let j = newActInput.index + 1; j < act.length; j++) {
          if (act[j].level == act[j - 1].level) {
            act[j].code = getCode(act[j - 1].code, act[j - 1].plus);
            act[j].plus = act[j - 1].plus + 10;
          }
        }
        setModule(tempData);
      }
    }
    setNewActInput({
      pCode: "",
      childCode: "",
      index: 0,
      input: "",
    });
  };

 const handleIncButtonClick = (pCode: string, index: number) => {
  console.log("Called handleIncButtonClick!");

  setModule((prevModules) => {
    return prevModules.map((mod) => {
      if (mod.parentModuleCode === pCode) {
        console.log("Found parent module:", pCode);

        // Find the selected activity
        const selectedActivity = mod.activitys[index];
        if (!selectedActivity) return mod;

        // Compute new values for the selected activity
        const newLevel = selectedActivity.level + 1;
        const newCode = `${selectedActivity.code}/10`; // Append "/10" to maintain hierarchy

        // Update the selected activity
        const updatedActivities = mod.activitys.map((act) => {
          if (act.code === selectedActivity.code) {
            return { ...act, level: newLevel, code: newCode };  // Update only the selected activity
          }
          return act;
        });

        // Now update all child activities (those with prerequisites matching the selected activity's code)
        const finalActivities = updateChildActivities(updatedActivities, selectedActivity.code, newCode);

        return { ...mod, activitys: finalActivities };
      }
      return mod;
    });
  });

  setNewActInput({ pCode: "", childCode: "", index: 0, input: "" });
};

/**
 * Recursively updates all child activities when a parent’s code changes.
 * It checks if the child's code starts with the parent’s code, updates them with the new level and code,
 * and ensures the child activities’ level increases by 10 (not by 1).
 */
const updateChildActivities = (activities: any[], oldCode: string, newCode: string) => {
  return activities.map((act) => {
    // If the activity's code starts with the old code, it is a child
    if (act.prerequisites === oldCode) {
      // Increase the level of the child activity by 10 (not by 1)
      const newLevel = act.level + 1;
      const updatedCode = `${newCode}${act.code.slice(oldCode.length)}`;  // Update child code based on the parent

      return {
        ...act,
        level: newLevel,  // Increase the level by 10
        code: updatedCode,  // Update the code based on parent
        prerequisites: newCode,  // Update prerequisites to new code
      };
    }
    return act;
  });
};

  


  function handleEditRow(
    moduleIndex: number,
    activityIndex: number,
    updatedActivity: { code: string; name: string; duration: number; prerequisites: string; level: number }
  ) {
    // Ensure updatedModules is correctly typed and cloned
    const updatedModules = [...module]; // Assuming `module` is the state holding modules
    updatedModules[moduleIndex].activitys[activityIndex] = updatedActivity;
    setModule(updatedModules); // Update state
  }


  const handleFilterClick = () => {
    const { moduleIndex } = selectedRow;

    if (moduleIndex !== null && module[moduleIndex]) {
      const currentModule = module[moduleIndex];

      // Sort the activities by level in ascending or descending order
      const sortedActivities = [...currentModule.activitys].sort(
        (a, b) => a.level - b.level
      );
      // Uncomment the following line for descending order
      // const sortedActivities = [...currentModule.activitys].sort((a, b) => b.level - a.level);

      // Update only the specific module's activities
      const updatedModules = [...module];
      updatedModules[moduleIndex] = {
        ...currentModule,
        activitys: sortedActivities,
      };

      setModule(updatedModules);
      console.log(`Sorted activities:`, sortedActivities);
    } else {
      console.warn("No row selected for sorting.");
    }
  };

  const filteredModules = module
    .map((mod) => {
      const { name = "", code = "" } = mod; // Safely destructure module fields

      // Filter activities within each module
      const filteredActivities = (mod.activitys || []).filter((activity) => {
        if (!activity || typeof activity !== "object") {
          return false; // Skip invalid activities
        }

        // Destructure activity fields with defaults
        const {
          name: activityName = "",
          level = "",
          prerequisites = "",
          code: activityCode = "",
          duration = "",
        } = activity;

        const searchTermLower = searchTerm.toLowerCase();

        // Check if any activity field matches the search term
        return (
          activityName.toLowerCase().includes(searchTermLower) ||
          level.toString().toLowerCase().includes(searchTermLower) ||
          prerequisites.toLowerCase().includes(searchTermLower) ||
          activityCode.toLowerCase().includes(searchTermLower) ||
          duration.toLowerCase().includes(searchTermLower)
        );
      });

      // Check if the module itself matches the search term or has filtered activities
      if (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        code.toLowerCase().includes(searchTerm.toLowerCase()) || // Check module code
        filteredActivities.length > 0 // Include if any activities matched
      ) {
        return { ...mod, activitys: filteredActivities }; // Return module with filtered activities
      }

      return null; // Exclude modules with no matches
    })
    .filter(Boolean);


  const handleNotificationClick = () => {
    console.log("Notification button clicked!");
    navigate('/createnotification');
    // Handle notification logic
  };

  const handleAssignRACI = () => {
    console.log("Assign RACI button clicked!");
    navigate('/assignraci');
    // Handle Assign RACI logic here
  };


  return (
    <div style={{ padding: 10 }}>
      <div className="card mb-3">
        <div className="card-header">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" style={{ flexGrow: 1, color: "green" }}>
              Tool Bar
            </Typography>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="btn"
                title="Decrease Level"
                onClick={() => {
                  const { moduleIndex, activityIndex } = selectedRow;

                  if (moduleIndex !== null) {
                    console.log("module index : ", moduleIndex);
                    const selectedModule = module[moduleIndex];
                    console.log("selectedModule : ", selectedModule);
                    if (activityIndex !== null) {
                      // If an activity is selected
                      const selectedActivity =
                        selectedModule.activitys[activityIndex];
                      handleModuleMinus(
                        selectedModule.parentModuleCode,
                        activityIndex,
                        selectedActivity
                      );
                    } else {
                      // If no activity is selected, apply the minus function to the module
                      const values = {
                        level: selectedModule.lavel,
                        code: selectedModule.parentModuleCode,
                      };
                      handleModuleMinus(
                        selectedModule.parentModuleCode,
                        moduleIndex,
                        values
                      );
                    }
                  }
                }}
                style={{
                  padding: 0,
                  margin: 0,
                  fontSize: "22px",
                  color: "orange",
                }}
              >
                <i className="fas fa-arrow-left-long"></i>
              </button>

              <button
                className="btn"
                title="Increase Level"
                onClick={() => {
                  const { moduleIndex, activityIndex } = selectedRow;

                  if (moduleIndex !== null) {
                    const selectedModule = module[moduleIndex];
                    if (activityIndex !== null) {
                      // If an activity is selected
                      const selectedActivity =
                        selectedModule.activitys[activityIndex];
                      handleIncButtonClick(
                        selectedModule.parentModuleCode,
                        activityIndex,
                        selectedActivity
                      );
                    } else {
                      // If no activity is selected, apply the minus function to the module
                      const values = {
                        level: selectedModule.lavel,
                        code: selectedModule.parentModuleCode,
                      };
                      handleIncButtonClick(
                        selectedModule.parentModuleCode,
                        moduleIndex,
                        values
                      );
                    }
                  }
                }}
                style={{
                  padding: 0,
                  margin: 0,
                  fontSize: "22px",
                  color: "orange",
                }}
              >
                <i className="fa-solid fa-arrow-right-long"></i>
              </button>

              <button
                className="btn"
                title="Delete"
                onClick={handleDelete}
                style={{ marginLeft: 0, color: "red" }}
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>

              <button
                title="Filter"
                onClick={handleFilterClick}
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
                title="Search"
                variant="outlined"
                placeholder="Search modules, activities, levels, or prerequisites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                style={{ width: "300px", }}
              />

              <button
                className="btn btn-info"
                onClick={handleAddActivity}
                style={{ backgroundColor: '#4A90E2' }}
              >
                Add Activity
              </button>

              {/* Assign RACI Button */}
              <IconButton title="Assign RACI" onClick={handleAssignRACI}>
                {/* <Badge badgeContent={assignRACIcount} color="primary"> */}
                <PersonIcon style={{ color: "blue", fontSize: "30px" }} />
                {/* </Badge> */}
              </IconButton>

              {/* Notification Button with Badge */}
              <IconButton title="Notifications" onClick={handleNotificationClick}>
                {/* <Badge badgeContent={notificationCount} color="error"> */}
                <NotificationsIcon style={{ color: "blue", fontSize: "30px" }} />
                {/* </Badge> */}
              </IconButton>


            </div>
          </div>
        </div>

        <div className="card-body">
          <table
            className="table table-bordered"
            cellSpacing="0"
            cellPadding="0"
          >
            {/* Table header: Rendered only once */}
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "center",
                    backgroundColor: "#4F7942",
                    width: "200px",
                    color: 'white',
                    // marginLeft: "500px"
                  }}
                >
                  Code
                </th>
                <th style={{ textAlign: "center", backgroundColor: "#4F7942", color: 'white' }}>
                  Module Name
                </th>
                <th
                  style={{
                    textAlign: "center",
                    backgroundColor: "#4F7942",
                    width: "200px",
                    color: 'white',
                    margin: "20px"
                  }}
                >
                  Duration<small> (in days)</small>
                </th>
                <th style={{ textAlign: "center", backgroundColor: "#4F7942", width: "100px", color: 'white' }}>
                  Prerequisites
                </th>
                <th style={{ textAlign: "center", backgroundColor: "#4F7942", color: 'white' }}>
                  Level
                </th>
                {/* <th style={{ textAlign: 'center', backgroundColor: '#e0f7fa', }}>Action</th> */}
              </tr>
            </thead>
            {/* Table body: Rendered dynamically */}
            <tbody>
              {filteredModules.map((val, moduleIndex) => {
                // Parent row rendering
                const isEditing = selectedRow.moduleIndex === moduleIndex;
                const parentRow = (
                  <tr
                    key={`module-${moduleIndex}`}
                    style={{
                      backgroundColor: moduleIndex === selectedRow.moduleIndex ? "#F5F7FA" : "gray",
                      color: "black",
                      textAlign: "center",
                    }}
                    onClick={() => setSelectedRow({ moduleIndex, activityIndex: null })}
                  >
                    <td
                      contentEditable="true"
                      suppressContentEditableWarning={true}
                      onBlur={(e) => handleCodeBlur(e, moduleIndex)}
                      style={{
                        outline: "none",
                        backgroundColor: "inherit",
                        color: "black",
                        width: "100px",
                        marginLeft: "100px"
                      }}
                    >
                      {val.parentModuleCode || "N/A"}
                    </td>
                    <td>
                      {moduleName}
                    </td>
                    <td>{val.duration}</td>
                    <td>{val.prerequisites}</td>
                    <td>
                      {`${val.lavel}`}
                    </td>
                  </tr>
                );

                // Child rows rendering
                const activityRows = !collapsedModules[moduleIndex]
                  ? val.activitys.map((act, activityIndex) => (
                    <tr
                      key={`module-${moduleIndex}-activity-${activityIndex}`}
                      style={{
                        backgroundColor: moduleIndex === selectedRow.moduleIndex && activityIndex === selectedRow.activityIndex ? "lightblue" : "",
                        textAlign: "center",
                      }}
                      onClick={() => setSelectedRow({ moduleIndex, activityIndex })}
                    >
                      <td style={{
                        textAlign: "center",

                      }}>
                        <TextField
                          value={act.code}
                          onChange={(e) => handleEditRow(moduleIndex, activityIndex, { ...act, code: e.target.value })}
                          variant="standard"
                          fullWidth
                          InputProps={{ disableUnderline: true }}
                        />
                      </td>
                      <td style={{
                        textAlign: "center",

                      }}>
                        <TextField
                          value={act.name}
                          onChange={(e) => handleEditRow(moduleIndex, activityIndex, { ...act, name: e.target.value })}
                          variant="standard"
                          fullWidth
                          InputProps={{ disableUnderline: true }}
                        />
                      </td>
                      <td>
                        <TextField
                          value={act.duration}
                          onChange={(e) => handleEditRow(moduleIndex, activityIndex, { ...act, duration: e.target.value })}
                          variant="standard"
                          fullWidth
                          InputProps={{ disableUnderline: true }}
                        />
                      </td>
                      <td>
                        <TextField
                          value={act.prerequisites}
                          onChange={(e) => handleEditRow(moduleIndex, activityIndex, { ...act, prerequisites: e.target.value })}
                          variant="standard"
                          fullWidth
                          InputProps={{ disableUnderline: true }}
                        />
                      </td>
                      <td>L{act.level}</td>
                    </tr>
                  ))
                  : null;

                // Return both parent and child rows
                return [parentRow, activityRows];
              })}
            </tbody>

          </table>
          <Button
            variant="contained"
            onClick={handleSaveModuleAndActivity}
            disabled={!isSaveEnabled}
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              zIndex: 1000,
              fontSize: '18px',
              backgroundColor: "#4A90E2", // Blue background
              color: "black", // White text for better contrast
              opacity: isSaveEnabled ? 1 : 0.6, // Dim button if disabled
            }}
          >
            Save
          </Button>
        </div>

        <div
          className="modal fade"
          id="exampleModal2"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Add New Activity
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput2"
                    placeholder="Reserve"
                    value={newActInput.input}
                    onChange={(e) => {
                      setNewActInput({ ...newActInput, input: e.target.value });
                    }}
                  />
                  <label htmlFor="floatingInput2">Activity</label>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveActivity}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};