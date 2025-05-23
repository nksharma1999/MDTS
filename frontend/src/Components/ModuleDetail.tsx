import { useState, useEffect } from "react";
import { generateTwoLetterAcronym } from "../Utils/generateTwoLetterAcronym";
import { useLocation } from "react-router-dom";
import {
  Typography,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  updateModule,
  findModule,
} from '../Utils/moduleStorage';
import { useNavigate } from 'react-router-dom';



export const ModuleDetails = () => {
  const [newModelName, setNewModelName] = useState<string>("");
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [collapsedModules, setCollapsedModules] = useState({});
  const [isSaveEnabled, setIsSaveEnabled] = useState(true);
  const [selectedRow, setSelectedRow] = useState({ moduleIndex: 0, activityIndex: null });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(null);
  const [modules, setModules] = useState([]);
  const navigate = useNavigate();
  const { state: mod } = useLocation(); // Dynamically passed data from the previous page

  const [existingAcronyms, setExistingAcronyms] = useState([
    "FC",
    "BP",
    "AM",
    "IM",
  ]);

  const [module, setModule] = useState([
    {
      parentModuleCode: "", // Initialize as an empty string
      moduleName: "", // Ensure moduleName is defined or passed as props/state
      lavel: 0,
      plus: 0,
      activitys: [],
    },
  ]);

  if (!mod) {
    return <Typography variant="h6" align="center">Module not found</Typography>;
  }

  useEffect(() => {
    // Find a specific module
    const targetModule = findModule(mod.parentModuleCode, mod.moduleName); // Replace with the desired values
    console.log('Fetched module : ', targetModule);
    if (targetModule) {
      setModule([targetModule]); // Set it as a single-object array
    }
  }, []);

  // Log the updated module state when it changes
  useEffect(() => {
    console.log("Updated Module State:", module);
  }, [module]);

  const handleSaveModuleAndActivity = () => {
    try {
      console.log('Inside handleSaveModuleAndActivity', module);

      if (module.length > 0) {
        const targetModule = module[0]; // Extract the single object from the array
        updateModule(targetModule); // Pass the object directly to the update function
        setIsSaveEnabled(false);
        window.alert("Modules updated successfully!");
      } else {
        window.alert("No module to save.");
      }
    } catch (error) {
      console.error("Error while updating modules:", error);
      window.alert("Failed to update modules. Check the console for details.");
    }
    navigate('/ModuleLibrary');
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

  const toggleModule = (moduleIndex) => {
    setCollapsedModules((prevState) => ({
      ...prevState,
      [moduleIndex]: !prevState[moduleIndex], // Toggle the collapse state
    }));
  };

  const handleModuleMinus = (pCode: string, index: number, values: any) => {
    let tempData = [...module]; // Copy module state to avoid mutating it directly

    for (let i = 0; i < tempData.length; i++) {
      if (tempData[i].parentModuleCode === pCode) {
        const act = tempData[i].activitys;

        // Check if the selected row exists at the given index
        if (index >= 0 && index < act.length) {
          const selectedActivity = act[index];

          // Decrease level only if it's greater than 1
          if (selectedActivity.level > 1) {
            selectedActivity.level -= 1;
          }
        }

        // Update the activities array
        tempData[i].activitys = [...act];
        break;
      }
    }

    setModule(tempData); // Update the state with the modified data
  };

  const [newActInput, setNewActInput] = useState({
    pCode: "",
    childCode: "",
    index: 0,
    input: "",
  });

  const handleAddActivityToFirstRow = () => {
    const { moduleIndex, activityIndex } = selectedRow; // Includes `activityIndex` to track the selected row

    let updatedModules = [...module];
    const selectedModule = updatedModules[moduleIndex];
    const activities = selectedModule.activitys;

    // Fetch the code of the selected activity
    const selectedActivity = activities[activityIndex];
    const previousCode = selectedActivity
      ? selectedActivity.code
      : selectedModule.parentModuleCode;
    // Generate the new code for the activity
    const newCode = getCode(previousCode);

    // Create the new activity object
    const newActivity = {
      level: selectedActivity ? selectedActivity.level : 1,
      name: `New Activity`,
      code: newCode,
      plus: 10,
      duration: 10,
      prerequisites: selectedActivity ? selectedActivity.code : "",
    };

    // Insert the new activity directly below the selected activity
    activities.splice(activityIndex + 1, 0, newActivity);

    // Recalculate codes for all subsequent activities
    for (let i = activityIndex + 2; i < activities.length; i++) {
      if (!isSubModule(activities[i - 1].code, activities[i].code)) {
        activities[i].code = getCode(activities[i - 1].code);
      }
    }

    // Update the module state
    setModule(updatedModules.map((module) => ({ ...module })));
    setIsSaveEnabled(true);
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
  const getCode = (prevCode) => {
    if (!prevCode) {
      return "ZX/10"; // Default case if no previous code exists
    }

    const codeSplit = prevCode.split("/");
    const baseCode = codeSplit.slice(0, -1).join("/"); // Get the prefix (e.g., 'ZX')
    const lastNumber = parseInt(codeSplit[codeSplit.length - 1], 10); // Extract the numeric suffix

    // If the code doesn't have a numeric suffix, start with '10'
    if (isNaN(lastNumber)) {
      return `${prevCode}/10`;
    }

    // Increment the numeric suffix by 10
    return `${baseCode}/${lastNumber + 10}`;
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

  const handleIncButtonClick = (pCode: string, index: number, values: any) => {
    // Create a copy of the module array
    let tempData = [...module];

    for (let i = 0; i < tempData.length; i++) {
      if (tempData[i].parentModuleCode === pCode) {
        // Get a copy of the activities for the current module
        let act = [...tempData[i].activitys];

        if (values.plus === 0) {
          // Increment the level of the selected activity
          act[index].level += 1;

          // Ensure all activities within this submodule have the same level
          const updatedLevel = act[index].level;
          const submoduleCodePrefix = act[index].code
            .split("/")
            .slice(0, 2)
            .join("/"); // Extract submodule code prefix

          act = act.map((activity) => {
            if (activity.code.startsWith(submoduleCodePrefix)) {
              // Update level for all activities within the submodule
              return {
                ...activity,
                level: updatedLevel,
              };
            }
            return activity;
          });
        } else {
          // Add a new activity with acronym logic
          const maxLevel = getMaxLevel(act);

          // Generate a unique two-letter acronym
          const acronym = generateTwoLetterAcronym(
            values.name,
            existingAcronyms
          );
          setExistingAcronyms([...existingAcronyms, acronym]);

          // Create a new activity with updated level and code
          const newActivity = {
            level: maxLevel + 1, // Increment level by 1
            name: values.name,
            code: createSubmoduleCode(values.code, acronym), // Generate new code with acronym
            plus: 0,
            duration: "",
            prerequisites: values.prerequisites,
          };

          act.push(newActivity);

          // Ensure all activities under this submodule have the same level
          const submoduleCodePrefix = newActivity.code
            .split("/")
            .slice(0, 2)
            .join("/"); // Extract submodule code prefix
          const newLevel = newActivity.level;

          act = act.map((activity) => {
            if (activity.code.startsWith(submoduleCodePrefix)) {
              // Update level for all activities within the submodule
              return {
                ...activity,
                level: newLevel,
              };
            }
            return activity;
          });

          // Remove the activity that was split to create the submodule
          act.splice(index, 1); // Remove the original activity
        }

        // Rearrange the activities sequentially by increments of 10
        act = act.map((activity, idx) => ({
          ...activity,
          sequence: (idx + 1) * 10, // Reassign sequence values as 10, 20, 30...
        }));

        // Update the activities array in the module
        tempData[i].activitys = act;
        break;
      }
    }

    // Update the state with the modified module data
    setModule(tempData);

    // Reset input state
    setNewActInput({
      pCode: "",
      childCode: "",
      index: 0,
      input: "",
    });
  };

  // Helper function: Find the maximum level in the current activity list
  const getMaxLevel = (act: any) => {
    return act.reduce((max: number, curr: any) => Math.max(max, curr.level), 0);
  };

  // Helper function: Create a submodule code based on the previous code and acronym
  const createSubmoduleCode = (prevCode: string, acry: string) => {
    const codeSplit = prevCode.split("/");
    let result = codeSplit.slice(0, -1).join("/");
    return result + "/" + acry;
  };

  const handleEditModule = (index) => {
    setIsEditing(true);
    setSelectedModuleIndex(index); // Store the index for handling edit
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
    .filter(Boolean); // Remove null values


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
            <Typography variant="h5" style={{ flexGrow: 1 ,color:"green"}}>
              Tool Bar
            </Typography>
            <div style={{ display: "flex", gap: "20px" }}>
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
                        code: ModuleDetailselectedModule.parentModuleCode,
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
              <button
    title="Edit"
    // onClick={handleEditClick} // Add your edit handler function here
    style={{
      display: "flex",
      alignItems: "center",
      background: "none",
      border: "none",
      cursor: "pointer",
    }}
  >
    <EditIcon style={{ fontSize: "24px", color: "blue" }} />
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
                style={{ width: "300px"}}
              />

              <button
                className="btn btn-info"
                onClick={handleAddActivityToFirstRow}
                style={{ backgroundColor:'#4A90E2' }}
              >
                Add Activity
              </button>
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
                    width: "100px",
                    color:"white"
                  }}
                >
                  Code
                </th>
                <th style={{ textAlign: "center", backgroundColor: "#4F7942",color:"white" }}>
                  Activity Name
                </th>
                <th
                  style={{
                    textAlign: "center",
                    backgroundColor: "#4F7942",
                    width: "100px",
                    color:"white"
                  }}
                >
                  Duration<small> (in days)</small>
                </th>
                <th style={{ textAlign: "center", backgroundColor: "#4F7942", width: "100px", color:"white"}}>
                  Prerequisites
                </th>
                <th style={{ textAlign: "center", backgroundColor: "#4F7942",color:"white" }}>
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
                    <td>{module[0]?.parentModuleCode || "N/A"}</td>
                    <td>
                      {module[0]?.moduleName}
                    </td>
                    <td>{val.duration}</td>
                    <td>{val.prerequisites}</td>
                    <td>
                      {`L${val.lavel}`} {/* Level remains non-editable */}
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
            Update
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