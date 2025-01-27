import { Height, WidthFull } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {
  saveFormDataToListInLocalStorage,
  isDuplicateProjectName,
  getOrderedModuleNames,
  getAllMineType
} from '../Utils/moduleStorage';

export const ProjectDetails: React.FC = () => {

  const [mineTypes, setMineTypes] = useState([{}]);
  const [companyOptions, setCompanyOptions] = useState([""]);


  useEffect(() => {
    // Retrieve the mine types from localStorage using the updated function
    const savedMineTypes = getAllMineType(); // No need for JSON.parse() here, it's already handled
    setMineTypes(savedMineTypes);
  }, []);


  const [formData, setFormData] = useState({
    project_id: 0,
    companyName: "",
    projectName: "",
    mineral: "",
    mineType: "",
    reserve: 0,
    forestLand: 1,
    pvtLand: '',
    govtLand: '',
    totalCoalBlockArea: 0,
    netGeologicalReserve: 0,
    extractableReserve: 0,
    grade: "",
    stripRatio: 0,
    peakCapacity: 0,
    mineLife: 0,
    mineOwner: '',
    dateOfH1Bidder: '',
    cbdpaDate: '',
    vestingOrderDate: '',
    pbgAmount: 0,
    state: '',
    district: '',
    nearestTown: '',
    nearestAirport: '',
    nearestRailwayStation: '',
    nearestRailwaySiding: '',
    explored: "",
    grApproved: "",
    minePlanApproved: "",
    grantOfTOR: "",
    ec: "",
    fc: "",
    cte: "",
    cto: "",
    mineOpeningPermission: "",

  });

  const [currentTab, setCurrentTab] = useState(0);
  // const [tabCompletionStatus, setTabCompletionStatus] = React.useState(
  //   Array(tabs.length).fill(false) // Track completion status of tabs
  // );

  const tabs = [
    "Project Parameters",
    "Contractual Details",
    "Locations",
    "Initial Status of the project",
  ];



  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const orderedModuleNames = getOrderedModuleNames();
  const [newCompany, setNewCompany] = useState("");
  const [tabCompletionStatus, setTabCompletionStatus] = React.useState(
    Array(tabs.length).fill(false) // Track completion status of tabs
  );


  // Validation logic
  // Function to alert a message for a specific field
  const setErrorMessage = (field: string, message: string, stepErrors: { [key: string]: string }) => {
    stepErrors[field] = message;
  };

  // Validation logic
  const validateStep = () => {
    let stepErrors: { [key: string]: string } = {};

    if (currentTab === 0) {
      if (!formData.projectName) setErrorMessage("projectName", "Project Name is required.", stepErrors);
      if (isDuplicateProjectName(formData.projectName)) {
        setErrorMessage("projectName", "Project name is already exits!.", stepErrors);
        alert("Project name is already exits!.");
      }
      if (!formData.mineral) setErrorMessage("mineral", "Please select a mineral.", stepErrors);
      if (!formData.mineType) setErrorMessage("mineType", "Please select a mine type.", stepErrors);
      if (!formData.reserve) setErrorMessage("reserve", "Please select a reserve.", stepErrors);
      if (!formData.netGeologicalReserve || formData.netGeologicalReserve <= 0)
        setErrorMessage("netGeologicalReserve", "Net Geological Reserve must be greater than 0.", stepErrors);
      if (!formData.extractableReserve || formData.extractableReserve <= 0)
        setErrorMessage("extractableReserve", "Extractable Reserve must be greater than 0.", stepErrors);
      if (!formData.grade) setErrorMessage("grade", "Grade is required.", stepErrors);
      if (!formData.stripRatio || formData.stripRatio <= 0)
        setErrorMessage("stripRatio", "Strip Ratio must be greater than 0.", stepErrors);
      if (!formData.peakCapacity || formData.peakCapacity <= 0)
        setErrorMessage("peakCapacity", "Peak Capacity must be greater than 0.", stepErrors);
      if (!formData.mineLife || formData.mineLife <= 0)
        setErrorMessage("mineLife", "Mine Life must be greater than 0.", stepErrors);
      if (!formData.forestLand || formData.forestLand <= 0)
        setErrorMessage("forestLand", "Forest Land must be greater than 0.", stepErrors);
    }

    if (currentTab === 1) {
      if (!formData.mineOwner) setErrorMessage("mineOwner", "Mine Owner is required.", stepErrors);
      if (!formData.dateOfH1Bidder) setErrorMessage("dateOfH1Bidder", "Date of H1 Bidder is required.", stepErrors);
      if (!formData.cbdpaDate) setErrorMessage("cbdpaDate", "CBDPA Date is required.", stepErrors);
      if (!formData.vestingOrderDate) setErrorMessage("vestingOrderDate", "Vesting Order Date is required.", stepErrors);
      if (!formData.pbgAmount || formData.pbgAmount <= 0)
        setErrorMessage("pbgAmount", "PBG Amount must be greater than 0.", stepErrors);
    }

    if (currentTab === 2) {
      if (!formData.state) setErrorMessage("state", "State is required.", stepErrors);
      if (!formData.district) setErrorMessage("district", "District is required.", stepErrors);
      if (!formData.nearestTown) setErrorMessage("nearestTown", "Nearest Town is required.", stepErrors);
      if (!formData.nearestAirport) setErrorMessage("nearestAirport", "Nearest Airport is required.", stepErrors);
      if (!formData.nearestRailwayStation)
        setErrorMessage("nearestRailwayStation", "Nearest Railway Station is required.", stepErrors);
      if (!formData.nearestRailwaySiding)
        setErrorMessage("nearestRailwaySiding", "Nearest Railway Siding is required.", stepErrors);
    }

    if (currentTab === 4) {
      if (!formData.explored) setErrorMessage("explored", "Explored is required.", stepErrors);
      if (!formData.grApproved) setErrorMessage("grApproved", "GR Approved is required.", stepErrors);
      if (!formData.minePlanApproved) setErrorMessage("minePlanApproved", "Mine Plan Approved is required.", stepErrors);
      if (!formData.grantOfTOR) setErrorMessage("grantOfTOR", "Grant of TOR is required.", stepErrors);
      if (!formData.ec) setErrorMessage("ec", "EC is required.", stepErrors);
      if (!formData.fc) setErrorMessage("fc", "FC is required.", stepErrors);
      if (!formData.cte) setErrorMessage("cte", "CTE is required.", stepErrors);
      if (!formData.cto) setErrorMessage("cto", "CTO is required.", stepErrors);
      if (!formData.mineOpeningPermission)
        setErrorMessage("mineOpeningPermission", "Mine Opening Permission is required.", stepErrors);
    }

    console.log('Error : ', stepErrors);
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };


  const handleSaveAndNext = () => {
    // Save the current step's data
    console.log(`Saving data for step ${currentTab}`);
    if (!validateStep()) {
      if (currentTab < 4) {
        0
        // Proceed to the next step
        setCurrentTab((prevStep) => prevStep + 1);
      } else {
        // If it's the last step, save data and navigate to another page
        console.log("Saving final step data and navigating...");
        saveFinalData(); // Implement your save logic here
        navigateToNextPage(); // Function to navigate to the next page
      }
    } else {
      window.alert(errors);
      console.log("Validation errors:", errors);
    }
  };

  // Function to save final step datasetFormDataList
  const saveFinalData = () => {
    // Add logic to save the data (e.g., API call)
    console.log("Final data : ", formData);
    saveFormDataToListInLocalStorage(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;

    setFormData((prevData) => {
      const updatedData = { ...prevData, [id]: value };

      // Calculate totalCoalBlockArea
      if (["forestLand", "pvtLand", "govtLand"].includes(id)) {
        const forestLand = updatedData.forestLand || 1;
        const pvtLand = parseFloat(updatedData.pvtLand.toString()) || 1;
        const govtLand = parseFloat(updatedData.govtLand.toString()) || 1;

        updatedData.totalCoalBlockArea = forestLand + pvtLand + govtLand;
      }

      return updatedData;
    });

    setErrors((prevErrors) => ({ ...prevErrors, [id]: "" }));
  };



  const navigateToNextPage = () => {
    navigate("/");// Replace with your desired route
  };

  const [visibleRows, setVisibleRows] = useState(1); // Show the first row initially

  const handleRowChange = (event: any, rowIndex: any) => {
    const { value } = event.target;
    handleInputChange(event); // Call the parent-provided input handler

    if (value === "Yes" && rowIndex === visibleRows - 1) {
      // If "Yes" is selected in the current row, show the next row
      setVisibleRows((prev) => prev + 1);
    }
  };


  const renderTabContent = () => {
    switch (currentTab) {
      case 0: // Project Parameters
        return (
          <div style={containerStyle}>
            <table style={tableStyle}>
              <tbody>
                {/* Project Name */}
                {/* Company Name */}
                {/* Company Name */}
                <tr>
                  <th style={thStyle}>Company Name</th>
                  <td style={tdStyle}>
                    <div className="d-flex align-items-center" style={{ gap: "10px" }}>
                      <select
                        className="form-select"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        style={{ width: "70%", height: "40px", fontSize: "14px" }}
                      >
                        <option value="">--Select Company--</option>
                        {companyOptions.map((company, index) => (
                          <option key={index} value={company}>
                            {company}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="btn btn-link text-primary p-0"
                        data-bs-toggle="modal"
                        data-bs-target="#addCompanyModal"
                        style={{
                          fontSize: "20px",
                          textDecoration: "none",
                          marginLeft: "5px",
                        }}
                      >
                        +
                      </button>
                    </div>
                  </td>
                </tr>

                <tr>
                  <th style={thStyle}>Project Name</th>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      style={inputStyle}
                      className={`form-control ${errors.projectName ? "is-invalid" : ""}`}
                      id="projectName"
                      placeholder="Project Name"
                      value={formData.projectName}
                      onChange={handleInputChange}
                    />
                    {errors.projectName && (
                      <div className="invalid-feedback">{errors.projectName}</div>
                    )}
                  </td>
                </tr>
                {/* Mineral */}
                <tr>
                  <th style={thStyle}>Mineral</th>
                  <td style={tdStyle}>
                    <select
                      style={selectStyle}
                      className="form-select"
                      id="mineral"
                      value={formData.mineral}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Mineral</option>
                      <option value="Coal">Coal</option>
                      <option value="Iron Ore">Iron Ore</option>
                    </select>
                  </td>
                </tr>
                {/* Type of Mine */}
                <tr>
                  <th style={thStyle}>Type of Mine</th>
                  <td style={tdStyle}>
                    <select
                      style={selectStyle}
                      className="form-select"
                      id="mineType"
                      name="mineType"  // Ensure the correct field name is used
                      value={formData.mineType}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Mine Type</option>
                      {mineTypes && mineTypes.length > 0 ? (
                        mineTypes.map((type, index) => (
                          <option key={index} value={type.code}>
                            {type.code} {/* Displaying the "name" property */}
                          </option>
                        ))
                      ) : null} {/* No options if mineTypes is empty */}
                    </select>
                  </td>
                </tr>
                {/* Reserve */}
                <tr>
                  <th style={thStyle}>Reserve</th>
                  <td style={tdStyle}>
                    <input
                      style={inputStyle}
                      type="text"
                      className="form-control"
                      id="reserve"
                      placeholder="Reserve"
                      value={formData.reserve}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                {/* Net Geological Reserve */}
                <tr>
                  <th style={thStyle}>Net Geological Reserve (Mn T)</th>
                  <td style={tdStyle}>
                    <input
                      type="number"
                      style={inputStyle}
                      id="netGeologicalReserve"
                      placeholder="Net Geological Reserve"
                      value={formData.netGeologicalReserve}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                {/* Extractable Reserve */}
                <tr>
                  <th style={thStyle}>Extractable Reserve (Mn T)</th>
                  <td style={tdStyle}>
                    <input
                      type="number"
                      style={inputStyle}
                      id="extractableReserve"
                      placeholder="Extractable Reserve"
                      value={formData.extractableReserve}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                {/* Grade */}
                <tr>
                  <th style={thStyle}>Grade (in case of Coal)</th>
                  <td style={tdStyle}>
                    <select
                      style={selectStyle}
                      className="form-select"
                      id="grade"
                      value={formData.grade}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Grade</option>
                      <option value="G1">G1</option>
                      <option value="G2">G2</option>
                      <option value="G3">G3</option>
                    </select>
                  </td>
                </tr>
                {/* Strip Ratio */}
                <tr>
                  <th style={thStyle}>Strip Ratio (Cum / T)</th>
                  <td style={tdStyle}>
                    <input
                      type="number"
                      style={inputStyle}
                      id="stripRatio"
                      placeholder="Strip Ratio"
                      value={formData.stripRatio}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                {/* Peak Capacity */}
                <tr>
                  <th style={thStyle}>Peak Capacity (MTPA)</th>
                  <td style={tdStyle}>
                    <input
                      type="number"
                      style={inputStyle}
                      id="peakCapacity"
                      placeholder="Peak Capacity"
                      value={formData.peakCapacity}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                {/* Mine Life */}
                <tr>
                  <th style={thStyle}>Mine Life (years)</th>
                  <td style={tdStyle}>
                    <input
                      type="number"
                      style={inputStyle}
                      id="mineLife"
                      placeholder="Mine Life"
                      value={formData.mineLife}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                {/* Total Coal Block Area */}
                <tr>
                  <th style={thStyle}>Total Coal Block Area (Ha)</th>
                  <td style={tdStyle}>
                    <input
                      type="number"
                      style={inputStyle}
                      id="totalCoalBlockArea"
                      placeholder="forest Land"
                      value={formData.totalCoalBlockArea}
                      //disabled
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      case 1: // Agency Details
        return (
          <div style={containerStyle}>
            <table style={tableStyle}>
              <tbody>
                {/* Mine Owner */}
                <tr>
                  <th style={thStyle}>Mine Owner</th>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      style={inputStyle}
                      className={`form-control ${errors.mineOwner ? "is-invalid" : ""}`}
                      id="mineOwner"
                      placeholder="Mine Owner"
                      value={formData.mineOwner}
                      onChange={handleInputChange}
                    />
                    {errors.mineOwner && (
                      <div className="invalid-feedback">{errors.mineOwner}</div>
                    )}
                  </td>
                </tr>
                {/* Date of H1 Bidder */}
                <tr>
                  <th style={thStyle}>Date of H1 Bidder</th>
                  <td style={tdStyle}>
                    <input
                      type="date"
                      style={inputStyle}
                      className={`form-control ${errors.dateOfH1Bidder ? "is-invalid" : ""}`}
                      id="dateOfH1Bidder"
                      value={formData.dateOfH1Bidder}
                      onChange={handleInputChange}
                    />
                    {errors.dateOfH1Bidder && (
                      <div className="invalid-feedback">{errors.dateOfH1Bidder}</div>
                    )}
                  </td>
                </tr>
                {/* CBDPA Date */}
                <tr>
                  <th style={thStyle}>CBDPA Date</th>
                  <td style={tdStyle}>
                    <input
                      type="date"
                      style={inputStyle}
                      className={`form-control ${errors.cbdpaDate ? "is-invalid" : ""}`}
                      id="cbdpaDate"
                      value={formData.cbdpaDate}
                      onChange={handleInputChange}
                    />
                    {errors.cbdpaDate && (
                      <div className="invalid-feedback">{errors.cbdpaDate}</div>
                    )}
                  </td>
                </tr>
                {/* Vesting Order Date */}
                <tr>
                  <th style={thStyle}>Vesting Order Date</th>
                  <td style={tdStyle}>
                    <input
                      type="date"
                      style={inputStyle}
                      className={`form-control ${errors.vestingOrderDate ? "is-invalid" : ""}`}
                      id="vestingOrderDate"
                      value={formData.vestingOrderDate}
                      onChange={handleInputChange}
                    />
                    {errors.vestingOrderDate && (
                      <div className="invalid-feedback">{errors.vestingOrderDate}</div>
                    )}
                  </td>
                </tr>
                {/* PBG Amount */}
                <tr>
                  <th style={thStyle}>PBG Amount</th>
                  <td style={tdStyle}>
                    <input
                      type="number"
                      style={inputStyle}
                      className={`form-control ${errors.pbgAmount ? "is-invalid" : ""}`}
                      id="pbgAmount"
                      placeholder="PBG Amount"
                      value={formData.pbgAmount}
                      onChange={handleInputChange}
                    />
                    {errors.pbgAmount && (
                      <div className="invalid-feedback">{errors.pbgAmount}</div>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      case 2: // Contact Person Details
        return (
          <div style={containerStyle}>
            {/* Location */}
            <table style={tableStyle}>
              <tbody>
                {/* State */}
                <tr>
                  <th style={thStyle}>State</th>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      style={inputStyle}
                      className={`form-control ${errors.state ? "is-invalid" : ""}`}
                      id="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleInputChange}
                    />
                    {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                  </td>
                </tr>

                {/* District */}
                <tr>
                  <th style={thStyle}>District</th>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      style={inputStyle}
                      className={`form-control ${errors.district ? "is-invalid" : ""}`}
                      id="district"
                      placeholder="District"
                      value={formData.district}
                      onChange={handleInputChange}
                    />
                    {errors.district && <div className="invalid-feedback">{errors.district}</div>}
                  </td>
                </tr>

                {/* Nearest Town */}
                <tr>
                  <th style={thStyle}>Nearest Town</th>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      style={inputStyle}
                      className={`form-control ${errors.nearestTown ? "is-invalid" : ""}`}
                      id="nearestTown"
                      placeholder="Nearest Town"
                      value={formData.nearestTown}
                      onChange={handleInputChange}
                    />
                    {errors.nearestTown && <div className="invalid-feedback">{errors.nearestTown}</div>}
                  </td>
                </tr>

                {/* Nearest Airport */}
                <tr>
                  <th style={thStyle}>Nearest Airport</th>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      style={inputStyle}
                      className={`form-control ${errors.nearestAirport ? "is-invalid" : ""}`}
                      id="nearestAirport"
                      placeholder="Nearest Airport"
                      value={formData.nearestAirport}
                      onChange={handleInputChange}
                    />
                    {errors.nearestAirport && <div className="invalid-feedback">{errors.nearestAirport}</div>}
                  </td>
                </tr>

                {/* Nearest Railway Station */}
                <tr>
                  <th style={thStyle}>Nearest Railway Station</th>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      style={inputStyle}
                      className={`form-control ${errors.nearestRailwayStation ? "is-invalid" : ""}`}
                      id="nearestRailwayStation"
                      placeholder="Nearest Railway Station"
                      value={formData.nearestRailwayStation}
                      onChange={handleInputChange}
                    />
                    {errors.nearestRailwayStation && <div className="invalid-feedback">{errors.nearestRailwayStation}</div>}
                  </td>
                </tr>

                {/* Nearest Railway Siding */}
                <tr>
                  <th style={thStyle}>Nearest Railway Siding</th>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      style={inputStyle}
                      className={`form-control ${errors.nearestRailwaySiding ? "is-invalid" : ""}`}
                      id="nearestRailwaySiding"
                      placeholder="Nearest Railway Siding"
                      value={formData.nearestRailwaySiding}
                      onChange={handleInputChange}
                    />
                    {errors.nearestRailwaySiding && <div className="invalid-feedback">{errors.nearestRailwaySiding}</div>}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      case 3: // Work Order Scope
        return (
          <div style={styles.container}>
            {/* Please provide Initial Status of the project */}
            <table style={styles.table}>
              <tbody>
                {orderedModuleNames.map((moduleName, index) => {
                  const key = moduleName.replace(/\s+/g, "").toLowerCase(); // Generate a unique ID

                  // Show rows up to the `visibleRows` index
                  if (index >= visibleRows) return null;

                  return (
                    <tr key={key}>
                      <th style={styles.th}>{moduleName}</th>
                      <td style={styles.td}>
                        <select
                          style={styles.select}
                          className={`form-select ${errors[key] ? "is-invalid" : ""}`}
                          id={key}
                          name={key}
                          value={formData[key] || ""}
                          onChange={(e) => handleRowChange(e, index)}
                        >
                          <option value="">Select {moduleName}</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                        {errors[key] && (
                          <div className="invalid-feedback">{errors[key]}</div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.registrationContainer}>
      <h1>Edit Project</h1>
      <p></p>
      <ul style={styles.tabNavigation}>

        {tabs.map((tab, index) => (
          <li

            key={index}
            style={
              currentTab === index
                ? { ...styles.tab, ...styles.activeTab }
                : styles.tab
            }
            onClick={() => setCurrentTab(index)}
          >
            <CheckCircleIcon
              style={{
                color: tabCompletionStatus[index] ? "green" : "grey", // Green if completed, grey otherwise
                fontSize: "20px",
                padding: "1px",
                margin: "5px",
              }}
              titleAccess={
                tabCompletionStatus[index] ? "Completed" : "Incomplete"
              }
            />
            {tab}
          </li>
        ))}
      </ul>
      <form>
        {renderTabContent()}
        <div style={styles.formNavigation}>
          <button
            type="button"
            disabled={currentTab === 0}
            onClick={() => setCurrentTab((prev) => prev - 1)}
            style={
              currentTab === 0
                ? { ...styles.button, ...styles.disabledButton }
                : styles.button
            }
            style={{ backgroundColor:'#4A90E2' ,color:'black',fontWeight:'bold',borderRadius:'5px'}}
          >
            Previous
          </button>

          
<button
  type="button"
  onClick={() => {
    // Enable editing for the current tab
    setIsEditing(true); // Add logic to handle editing state
  }}
  style={{
    fontSize: "16px",
    fontWeight: "bold",
    color: "black",
    marginLeft: "auto",
    padding: "10px 20px", // Adjust padding for a balanced look
    gap: "20px",
    backgroundColor: "#4A90E2",
    border: "none",
    borderRadius: "5px", // Smooth corners
    cursor: "pointer",
    // transition: "background-color 0.3s ease, transform 0.2s ease", // Add hover/active effects
  }}
  // onMouseOver={(e) => (e.target.style.backgroundColor = "darkgreen")} // Hover effect
  // onMouseOut={(e) => (e.target.style.backgroundColor = "green")} // Reset background
  // onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")} // Press effect
  onMouseUp={(e) => (e.target.style.transform = "scale(1)")} // Release effect
>
  Edit
</button>


          <button
            type="button"
            onClick={() => {
              if (validateStep()) {
                // / Mark the current tab as completed
                setTabCompletionStatus((prevStatus) => {
                  const updatedStatus = [...prevStatus];
                  updatedStatus[currentTab] = true;
                  return updatedStatus;
                });

                if (currentTab < tabs.length - 1) {
                  setCurrentTab((prev) => prev + 1);
                } else {
                  if (errors !== null) {
                    console.log("Saving final step data and navigating...");
                    saveFinalData(); // Logic to save the final step data
                    navigateToNextPage(); // Logic to navigate to the next page
                  } else {
                    console.log("Validation failed with error: ", errors);
                    alert("Fill the required field of each tab!");
                  }
                }
              } else {
                console.log("Validation failed");
              }
            }}
            style={
              currentTab === tabs.length - 1
                ? { ...styles.button, ...styles.disabledButton }
                : styles.button
            }
            disabled={errors !== null || currentTab === tabs.length - 1 ? false : true}
          >
            {currentTab === tabs.length - 1 ? (
              "Update"
            ) : (
              <>
                Save & Next
                <ArrowForwardIcon
                  style={{
                    fontSize: "16px",
                    marginLeft: "5px",
                    verticalAlign: "middle",
                  }}
                />
              </>
            )}
          </button>
        </div>
      </form>
      <div className="modal fade" id="addCompanyModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Company</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Company Name"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setCompanyOptions([...companyOptions, newCompany]);
                  setNewCompany("");
                  document.getElementById("addCompanyModal").click(); // Close modal
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

const containerStyle = {
  padding: "5px",
  // background: "#f9f9f9",
  borderRadius: "0px",
  margin:"0",
  width: "100%",
};

const tableStyle = {
  width: "80%",
  borderCollapse: "collapse",
  borderRadius: "0px",
};

const thStyle = {
  textAlign: "left",
  padding: "8px",
  background: "#fff",
  color:"black",
  borderRadius: "2px",
  fontSize: "16px",
  fontWeight:'bold',
  width: "50%",
  // border: "1px solid #ccc",
};

const tdStyle = {
  padding: "0px",
  width:"70%",
  borderRadius: "2px",
  // border: "1px solid #ccc",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "4px",
};

const selectStyle = {
  ...inputStyle,
};

const commonContainerStyle = {
  padding: "20px",
  background: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
};

const commonTableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginBottom: "20px",
};

const commonThStyle = {
  textAlign: "left",
  padding: "12px",
  background: "#4caf50",
  color: "white",
  fontSize: "14px",
  border: "1px solid #ccc",
};

const commonTdStyle = {
  padding: "12px",
  fontSize: "14px",
  border: "1px solid #ccc",
};

const commonInputStyle = {
  width: "100%",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  fontSize: "14px",
};

const commonSelectStyle = {
  ...commonInputStyle,
  background: "white",
};

const buttonStyle = {
  padding: "12px 25px",
  borderRadius: "8px",
  fontWeight: "bold",
  fontSize: "14px",
  border: "none",
  cursor: "pointer",
  transition: "background 0.3s ease",
};

const activeButtonStyle = {
  ...buttonStyle,
  background: "#4caf50",
  color: "white",
};

const disabledButtonStyle = {
  ...buttonStyle,
  background: "#ddd",
  color: "#888",
  cursor: "not-allowed",
};

const tabStyle = {
  cursor: "pointer",
  padding: "12px 25px",
  borderRadius: "8px",
  textAlign: "center",
  background: "#e6e6e6",
  fontWeight: "bold",
  fontSize: "14px",
  transition: "background 0.3s ease",
};

const activeTabStyle = {
  ...tabStyle,
  background: "#4caf50",
  color: "white",
  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
};

const styles = {
  registrationContainer: {
    width: "70%",
    margin: "0",
    // padding: "30px",
    // background: "#ffffff", // Cleaner white background for better contrast
    // borderRadius: "12px",
    // boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.15)",
    // // Softer shadow for a polished look
  },
  tabNavigation: {
    display: "flex",
    justifyContent: "space-evenly", // Evenly distribute tabs
    alignItems: "center",
    marginBottom: "5px", // Extra spacing below tabs
    padding: "0", // Removed extra padding for a cleaner look
    listStyle: "none",
  },
  tab: {
    cursor: "pointer",
    padding: "12px 25px", // Slightly larger padding for better clickability
    // borderRadius: "8px",
    background: "#4F7942", 
    color:"black",// Lighter gray for a more modern feel
    flex: "1",
    textAlign: "left",
    // margin: "0 8px", // Reduced margin for tighter spacing
    fontWeight: "bold",
    fontSize: "16px",
    transition: "background 0.3s ease, color 0.3s ease", // Smooth hover/active effects
    borderRight: "1px solid #ccc",
  },
  activeTab: {
    borderBottom: "2px solid rgb(219, 156, 20)",
    color: "white", // Green text for the active tab
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)", // Optional highlighted effect
  },
  formContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "25px", // Increased gap for better spacing between fields
    marginBottom: "20px", // Added spacing at the bottom of the form
  },
  formGroup: {
    flex: "1 1 calc(50% - 20px)", // Two columns with space in between
    display: "flex",
    flexDirection: "column",
  },
  formLabel: {
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "8px", // Space between label and input
    color: "#333", // Darker color for better readability
  },
  formInput: {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
  },
  formNavigation: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px", // Extra spacing above navigation
  },
  button: {
    padding: "20px 30px", // Larger button size for better usability
    border: "none",
    borderRadius: "8px",
    background: "#4A90E2",
    color: "black",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background 0.3s ease", // Smooth hover effect
  },
  buttonHover: {
    background: "#45a049", // Slightly darker shade for hover effect
  },
  disabledButton: {
    background: "#4A90E2",
    color: "black",
    cursor: "not-allowed",
     margin:"0px"
  },
  container: {
    width: "70%",
    margin: "0 auto",
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
  },
  sectionHeading: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "15px",
  },
  instructionText: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
  },
  th: {
    background: "#fff",
    color: "black",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
  },
  td: {
    padding: "10px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  select: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    // borderRadius: "4px",
    background: "white",
    fontSize: "14px",
  },
  errorText: {
    color: "#d9534f",
    fontSize: "12px",
    marginTop: "5px",
  },
  loadMoreButton: {
    display: "block",
    margin: "20px auto",
    padding: "10px 20px",
    background: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
  },
  loadMoreButtonHover: {
    background: "#45a049",
  },
};