import { useState } from "react";
import { generateTwoLetterAcronym } from "../Utils/generateTwoLetterAcronym";
import {
  Typography, TextField, InputAdornment, Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';



export const ModuleBuilder = () => {
  const [newModelName, setNewModelName] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [collapsedModules, setCollapsedModules] = useState({});
  const [existingAcronyms, setExistingAcronyms] = useState([
    "FC",
    "BP",
    "AM",
    "IM",
  ]);
  //   const [selectedMineType, setSelectedMineType] = useState<string>("UG");

  const [module, setModule] = useState([
    {
      parentModuleCode: "FC",
      name: "Forest Clearance",
      lavel: 0,
      plus: 0,
      activitys: [
        {
          level: 2,
          name: "Pre-requisite to Forest Clearance",
          code: "FC/PR",
          duration: "2 months", // Added duration field
          prerequisites: "Approval from State Authorities",
          plus: 0,
        },
        {
          level: 3,
          name: "Procurement of Private Land for CA Purpose",
          code: "FC/PR/CA",
          duration: "3 weeks", // Added duration field
          prerequisites: "Private Land Acquisition Agreement",
          plus: 0,
        }
      ],
    },
    {
      parentModuleCode: "BP",
      name: "Budgetary Planning",
      lavel: 0,
      plus: 0,
      activitys: [
        {
          level: 2,
          name: "Pre-requisite to Forest Clearance",
          code: "FC/PR",
          duration: "1 month", // Added duration
          prerequisites: "Initial Budget Draft Approval",
          plus: 0,
        },
        {
          level: 5,
          name: "Pre-requisite to Forest Clearance 4",
          code: "FC/PR/10",
          duration: "2 month", // Added duration
          plus: 10,
        },
        {
          level: 4,
          name: "Pre-requisite to Forest Clearance 6",
          code: "FC/PR/20",
          plus: 20,
        },
        {
          level: 3,
          name: "Procurement of Private Land for CA Purpose",
          code: "FC/PR/CA",
          plus: 0,
        },
      ],
    },
  ]);

  const [selectedRow, setSelectedRow] = useState({ moduleIndex: 0, activityIndex: null });

  const handleModulePlus = () => {
    try {
      const acronym = generateTwoLetterAcronym(newModelName, existingAcronyms);
      setExistingAcronyms([...existingAcronyms, acronym]);
      setModule((pre) => [
        ...pre,
        {
          parentModuleCode: acronym,
          name: newModelName,
          activitys: [],
          lavel: 1,
          plus: 0,
        },
      ]);
    } catch (error) {
      console.error(error);
    }
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
      setModule((prevModule) => prevModule.filter((_, idx) => idx !== moduleIndex));
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
  const handleAddActivity = (id: number, pcode: string, childCode: string) => {
    setNewActInput({
      pCode: pcode,
      index: id,
      input: "",
      childCode: childCode,
    });

    // Retrieve the previous activity
    const selectedModule = module.find(mod => mod.parentModuleCode === pcode);
    const lastActivity = selectedModule?.activitys[selectedModule.activitys.length - 1];

    if (lastActivity) {
      setNewActInput(prev => ({
        ...prev,
        input: lastActivity.name, // Set the prerequisite to the previous activity's name
      }));
    }
  };


  const handleAddActivityToFirstRow = () => {
    const { moduleIndex, activityIndex } = selectedRow; // Includes `activityIndex` to track the selected row

    let updatedModules = [...module];
    const selectedModule = updatedModules[moduleIndex];
    const activities = selectedModule.activitys;

    // Fetch the code of the selected activity
    const selectedActivity = activities[activityIndex];
    const previousCode = selectedActivity ? selectedActivity.code : selectedModule.parentModuleCode;

    // Generate the new code for the activity
    const newCode = getCode(previousCode);

    // Create the new activity object
    const newActivity = {
      level: selectedActivity ? selectedActivity.level : 2,
      name: `New Activity`,
      code: newCode,
      plus: 10,
      duration: "",
      prerequisites: selectedActivity ? selectedActivity.name : "",
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
    setModule(updatedModules);
  };

  // Check if it is a submodule
  const isSubModule = (prevCode: string, currentCode: string): boolean => {
    const preCodeArr = prevCode.split("/");
    const currodeArr = currentCode.split("/");

    if (
      preCodeArr.length !== currodeArr.length ||
      (currodeArr[1] !== undefined && isNaN(Number(currodeArr[1])) && !Number.isInteger(Number(currodeArr[1])))
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
          const submoduleCodePrefix = act[index].code.split("/").slice(0, 2).join("/"); // Extract submodule code prefix

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
          const acronym = generateTwoLetterAcronym(values.name, existingAcronyms);
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
          const submoduleCodePrefix = newActivity.code.split("/").slice(0, 2).join("/"); // Extract submodule code prefix
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




  const handleRightArrowClick = () => {
    const { moduleIndex, activityIndex } = selectedRow;
    if (moduleIndex !== null && activityIndex !== null) {
      setModule((prevModules) => {
        const updatedModules = [...prevModules];
        const activities = updatedModules[moduleIndex].activitys;
        const selectedActivity = activities[activityIndex];
        let maxLevel = 0;
        for (let act of activities) {
          if (act.level > maxLevel) {
            maxLevel = act.level;
          }
        }

        selectedActivity.level = selectedActivity.level + 1;

        const parentCode = updatedModules[moduleIndex].parentModuleCode || "ROOT";
        selectedActivity.code = `${parentCode}.${selectedActivity.level}`;

        return updatedModules;
      });
    } else {
      console.warn("No row selected for incrementing level.");
    }
  };


  const handleEditRow = (moduleIndex: number, activityIndex: number, updatedActivity: any) => {
    if (moduleIndex !== undefined && module[moduleIndex]) {
      setModule(prevModule => {
        const updatedModule = [...prevModule];
        if (updatedModule[moduleIndex].activitys && updatedModule[moduleIndex].activitys[activityIndex]) {
          updatedModule[moduleIndex].activitys[activityIndex] = updatedActivity;
        }
        return updatedModule;
      });
    }
  };


  const handleFilterClick = () => {
    const { moduleIndex } = selectedRow;

    if (moduleIndex !== null && module[moduleIndex]) {
      const currentModule = module[moduleIndex];

      // Sort the activities by level in ascending or descending order
      const sortedActivities = [...currentModule.activitys].sort((a, b) => a.level - b.level);
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



  // const handleSearchClick = () => {
  //   // Filter out all the activity which is not selected
  //   const { moduleIndex, activityIndex } = selectedRow;
  //   if (moduleIndex !== null && module[moduleIndex]) {
  //     const currentModule = module[moduleIndex];
  //     const currentLevel = activityIndex !== null
  //       ? currentModule.activitys[activityIndex].level
  //       : currentModule.lavel;

  //     const filteredActivities = module.map(mod => ({
  //       ...mod,
  //       activitys: mod.activitys.filter(activity => activity.level === currentLevel)
  //     }));

  //     setModule(filteredActivities);
  //     console.log(`Showing activities for level ${currentLevel}:`, filteredActivities);

  //   }
  //   else {
  //     console.warn("No row selected for filtering.");
  //   }
  // };

  const filteredModules = module.map((mod) => {
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
  }).filter(Boolean); // Remove null values




  return (
    <div style={{ padding: 10 }}>
      <div className="card mb-3">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" style={{ flexGrow: 1 }}>
              ToolBar
            </Typography>
            <div style={{ display: "flex", gap: "20px" }}>
              <button
                className="btn"
                title="Decrease Level"
                onClick={() => {
                  const { moduleIndex, activityIndex } = selectedRow;

                  if (moduleIndex !== null) {
                    const selectedModule = module[moduleIndex];
                    if (activityIndex !== null) {
                      // If an activity is selected
                      const selectedActivity = selectedModule.activitys[activityIndex];
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
                      handleModuleMinus(selectedModule.parentModuleCode, moduleIndex, values);
                    }
                  }
                }}
                style={{ padding: 0, margin: 0, fontSize: '22px', color: 'blueviolet' }}
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
                      const selectedActivity = selectedModule.activitys[activityIndex];
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
                      handleIncButtonClick(selectedModule.parentModuleCode, moduleIndex, values);
                    }
                  }
                }}
                style={{ padding: 0, margin: 0, fontSize: '22px', color: 'blueviolet' }}
              >
                <i className="fa-solid fa-arrow-right-long"></i>
              </button>

              <button
                className="btn"
                title="Delete"
                onClick={handleDelete}
                style={{ marginLeft: 0, color: 'blue' }}
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>

              <button
                title="Filter"
                onClick={handleFilterClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <FilterListIcon style={{ fontSize: '24px', color: '#333' }} />
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
                style={{ width: "300px" }}
              />

              <button
                type="button"
                className="btn btn-success"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              // title="Add New Module"
              >
                Add New Module
              </button>
              <button className="btn btn-info" onClick={handleAddActivityToFirstRow}>
                Add Activity
              </button>
            </div>
          </div>
        </div>
        {/* </div> */}
        {/* </div> */}


        <div className="card-body">
          <table className="table table-bordered" cellSpacing="0" cellPadding="0">

            {/* Table header: Rendered only once */}
            <thead>
              <tr>
                <th style={{ textAlign: 'center', backgroundColor: '#e0f7fa', columnGap: '0' }}>Code</th>
                <th style={{ textAlign: 'center', backgroundColor: '#e0f7fa', }}>Activity Name</th>
                <th style={{ textAlign: 'center', backgroundColor: '#e0f7fa', width:'10px' }}>Duration</th>
                <th style={{ textAlign: 'center', backgroundColor: '#e0f7fa', }}>Prerequisites</th>
                <th style={{ textAlign: 'center', backgroundColor: '#e0f7fa', }}>Level</th>
                <th style={{ textAlign: 'center', backgroundColor: '#e0f7fa', }}>Action</th>
              </tr>
            </thead>
            {/* Table body: Rendered dynamically */}
            <tbody>
              {filteredModules.map((val, moduleIndex) => {
                // Parent row rendering
                const parentRow = (
                  <tr
                    key={`module-${moduleIndex}`}
                    style={{
                      backgroundColor: moduleIndex === selectedRow.moduleIndex ? 'grey' : 'gray',
                      color: 'white',
                      textAlign: 'center',
                    }}
                    onClick={() => setSelectedRow({ moduleIndex, activityIndex: null })}
                  >
                    <td>{val.parentModuleCode}</td>
                    <td>{val.name}</td>
                    <td style={{width:'10px'}}>{val.duration}</td>
                    <td>{val.prerequisites}</td>
                    <td>L{val.lavel}</td>
                    <td>
                      <button
                        onClick={() => toggleModule(moduleIndex)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '26px',
                          color: 'red',
                        }}
                      >
                        {collapsedModules[moduleIndex] ? '+' : '-'}
                      </button>
                    </td>
                  </tr>
                );

                // Child rows rendering
                const activityRows = !collapsedModules[moduleIndex]
                  ? val.activitys.map((act, activityIndex) => (
                    <tr
                      key={`module-${moduleIndex}-activity-${activityIndex}`}
                      style={{
                        backgroundColor:
                          moduleIndex === selectedRow.moduleIndex &&
                            activityIndex === selectedRow.activityIndex
                            ? 'lightblue'
                            : '',
                        textAlign: 'center',
                      }}
                      onClick={() => setSelectedRow({ moduleIndex, activityIndex })}
                    >
                      <td>{act.code}</td>
                      <td>
                        <TextField
                          value={act.name}
                          onChange={(e) =>
                            handleEditRow(moduleIndex, activityIndex, {
                              ...act,
                              name: e.target.value,
                            })
                          }
                          variant="standard"
                          fullWidth
                          InputProps={{ disableUnderline: true }}
                        />
                      </td>
                      <td>
                        <TextField
                          value={act.duration}
                          onChange={(e) =>
                            handleEditRow(moduleIndex, activityIndex, {
                              ...act,
                              duration: e.target.value,
                            })
                          }
                          variant="standard"
                          fullWidth
                          InputProps={{ disableUnderline: true }}
                        />
                      </td>
                      <td>
                        <TextField
                          value={act.prerequisites}
                          onChange={(e) =>
                            handleEditRow(moduleIndex, activityIndex, {
                              ...act,
                              prerequisites: e.target.value,
                            })
                          }
                          variant="standard"
                          fullWidth
                          InputProps={{ disableUnderline: true }}
                        />
                      </td>
                      <td>L{act.level}</td>
                      {/* <button
                onClick={() => toggleModule(moduleIndex)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '26px',
                  color: 'blue',
                }}
              >
                {collapsedModules[moduleIndex] ? '-' : '+'}
              </button> */}
                    </tr>
                  ))
                  : null;

                // Return both parent and child rows
                return [parentRow, activityRows];
              })}
            </tbody>
          </table>
        </div>




        <div
          className="modal fade"
          id="exampleModal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Add New Module
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
                    value={newModelName}
                    onChange={(e) => {
                      setNewModelName(e.target.value);
                    }}
                  />
                  <label htmlFor="floatingInput2">Module Name</label>
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
                  onClick={handleModulePlus}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
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
