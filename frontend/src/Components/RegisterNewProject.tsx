import { WidthFull } from "@mui/icons-material";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
  saveFormDataToListInLocalStorage,
  isDuplicateProjectName
} from '../Utils/moduleStorage';

export const RegisterNewProject: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
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
    grApproved: "",
    minePlanApproved: "",
    grantOfTOR: "",
    ec: "",
    fc: "",
    cte: "",
    cto: "",
    mineOpeningPermission: "",

  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  // Validation logic
  // Function to alert a message for a specific field
  const setErrorMessage = (field: string, message: string, stepErrors: { [key: string]: string }) => {
    stepErrors[field] = message;
  };

  // Validation logic
  const validateStep = () => {
    let stepErrors: { [key: string]: string } = {};

    if (currentStep === 1) {
      if (!formData.projectName) setErrorMessage("projectName", "Project Name is required.", stepErrors);
      if (isDuplicateProjectName(formData.projectName)){
        setErrorMessage("projectName", "Project name is already exits!.", stepErrors);
        alert("roject name is already exits!.");
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

    if (currentStep === 2) {
      if (!formData.mineOwner) setErrorMessage("mineOwner", "Mine Owner is required.", stepErrors);
      if (!formData.dateOfH1Bidder) setErrorMessage("dateOfH1Bidder", "Date of H1 Bidder is required.", stepErrors);
      if (!formData.cbdpaDate) setErrorMessage("cbdpaDate", "CBDPA Date is required.", stepErrors);
      if (!formData.vestingOrderDate) setErrorMessage("vestingOrderDate", "Vesting Order Date is required.", stepErrors);
      if (!formData.pbgAmount || formData.pbgAmount <= 0)
        setErrorMessage("pbgAmount", "PBG Amount must be greater than 0.", stepErrors);
    }

    if (currentStep === 3) {
      if (!formData.state) setErrorMessage("state", "State is required.", stepErrors);
      if (!formData.district) setErrorMessage("district", "District is required.", stepErrors);
      if (!formData.nearestTown) setErrorMessage("nearestTown", "Nearest Town is required.", stepErrors);
      if (!formData.nearestAirport) setErrorMessage("nearestAirport", "Nearest Airport is required.", stepErrors);
      if (!formData.nearestRailwayStation)
        setErrorMessage("nearestRailwayStation", "Nearest Railway Station is required.", stepErrors);
      if (!formData.nearestRailwaySiding)
        setErrorMessage("nearestRailwaySiding", "Nearest Railway Siding is required.", stepErrors);
    }

    if (currentStep === 4) {
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

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  // const handleNextStep = () => {
  //   // if (validateStep()) {
  //     setCurrentStep((prevStep) => Math.min(prevStep validateStep+ 1)); 
  //   // } else {
  //   //   console.log("Validation errors:", errors); 
  //   // }
  // };

  const handleSaveAndNext = () => {
    // Save the current step's data
    console.log(`Saving data for step ${currentStep}`);
    if (validateStep()) {
      if (currentStep < 4) {
        0
        // Proceed to the next step
        setCurrentStep((prevStep) => prevStep + 1);
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


  const navigateToNextPage = () => {
    // Replace with your navigation logic (e.g., using react-router)
    navigate("/");// Replace with your desired route
  };





  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;

    setFormData((prevData) => {
      const updatedData = { ...prevData, [id]: value };

      // Calculate totalCoalBlockArea
      if (["forestLand", "pvtLand", "govtLand"].includes(id)) {
        const forestLand = parseFloat(updatedData.forestLand.toString()) || 1;
        const pvtLand = parseFloat(updatedData.pvtLand.toString()) || 1;
        const govtLand = parseFloat(updatedData.govtLand.toString()) || 1;

        updatedData.totalCoalBlockArea = forestLand + pvtLand + govtLand;
      }

      return updatedData;
    });

    setErrors((prevErrors) => ({ ...prevErrors, [id]: "" }));
  };

  const renderStepContent = () => {
    const containerStyle = {
      background: "#f0f4f8", // Modern gradient
      padding: "20px",
      borderRadius: "12px", // Rounded corners for a smoother look
      boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)", // Depth effect
      margin: "0", // Reset margin to avoid gaps
      width: "100vw", // Full viewport width
      position: "relative", // Ensure it aligns properly
    };



    const headerStyle = {
      color: "blue",
      fontSize: "28px",
      fontWeight: "bold",
      marginBottom: "30px",
      textAlign: "center",
    };

    const inputStyle = {
      padding: "4px 6px",
      fontSize: "20px",
      height: "28px",
      width: "80%",
      // border: "1px solid #ccc",
      // borderRadius: "4px",
    };

    const selectStyle = {
      ...inputStyle,
      height: "50px", // Slightly taller for dropdown consistency
    };


    const tableStyle = {
      width: "90%",
      borderCollapse: "collapse",
    };

    const thStyle = {
      textAlign: "left",
      padding: "14px",
      // backgroundColor: "#f0f0f0",
      fontWeight: "bold",
    };

    const tdStyle = {
      padding: "8px",
      // borderBottom: "1px solid #ddd",
    };


    const Header = ({ title }) => (
      <div
        style={{
          background: "linear-gradient(90deg, rgb(197, 210, 221), rgb(66, 165, 245))", // Matches container colors
          padding: "15px 20px",
          borderRadius: "12px", // Slightly more rounded corners
          marginBottom: "20px",
          marginTop: "0px",
          width: "100%",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", // Subtle depth
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1
          style={{
            color: "#ffffff", // White text for better contrast
            margin: 0,
            fontSize: "28px",
            fontWeight: "bold",
            textAlign: "center",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)", // Subtle shadow for clarity
          }}
        >
          {title}
        </h1>
      </div>
    );


    // const labelStyle = {
    //   padding: "8px",
    //   // borderBottom: "1px solid #ddd",
    // };
    // const formGroupStyle = {
    //   padding: "8px",
    // }

    const [formValues, setFormValues] = useState({
      forestLand: "", // Or 0 if you prefer initializing as 0
      // other fields...
    });


    switch (currentStep) {
      case 1:
        return (
          <div style={containerStyle}>
            <Header title="Project Parameters" />
            <table style={tableStyle}>
              <tbody>
                {/* Project Name */}
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
                      <option value="Limestone">Limestone</option>
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
                      value={formData.mineType}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Mine Type</option>
                      <option value="OC">OC</option>
                      <option value="UG">UG</option>
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
                      style={inputStyle}
                      type="text"
                      className="form-control"
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
                      style={inputStyle}
                      type="text"
                      className="form-control"
                      id="extractableReserve"
                      placeholder="Extractable Reserve"
                      value={formData.extractableReserve}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                {/* Grade */}
                <tr>
                  <th style={thStyle}>Grade</th>
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
                      style={inputStyle}
                      type="text"
                      className="form-control"
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
                      style={inputStyle}
                      type="text"
                      className="form-control"
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
                      style={inputStyle}
                      type="text"
                      className="form-control"
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
                      name="forestLand"
                      value={formValues.forestLand}
                      onChange={(e) =>
                        setFormValues({ ...formValues, forestLand: parseFloat(e.target.value) })
                      }
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );

      case 2:
        return (
          <div style={containerStyle}>
            <Header title="Contractual Details" />
            {/* <h1 style={headerStyle}>Contractual Details</h1> */}
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

      case 3:
        return (
          <div style={containerStyle}>
            <Header title="Locations" />
            {/* <h1 style={headerStyle}>Locations</h1> */}
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
      case 4:
        return (
          <div style={containerStyle}>
            <Header title="Please provide Initial Status of the project" />
            {/* <h1 style={headerStyle}>Please provide Initial Status of the project</h1> */}
            <table style={tableStyle}>
              <tbody>
                {/* GR Approved */}
                <tr>
                  <th style={thStyle}>GR Approved</th>
                  <td style={tdStyle}>
                    <select
                      style={selectStyle}
                      className={`form-select ${errors.grApproved ? "is-invalid" : ""}`}
                      id="grApproved"
                      value={formData.grApproved}
                      onChange={handleInputChange}
                    >
                      <option value="">Select GR Approved</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    {errors.grApproved && <div className="invalid-feedback">{errors.grApproved}</div>}
                  </td>
                </tr>

                {/* Mine Plan Approved */}
                <tr>
                  <th style={thStyle}>Mine Plan Approved</th>
                  <td style={tdStyle}>
                    <select
                      style={selectStyle}
                      className={`form-select ${errors.minePlanApproved ? "is-invalid" : ""}`}
                      id="minePlanApproved"
                      value={formData.minePlanApproved}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Mine Plan Approved</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    {errors.minePlanApproved && <div className="invalid-feedback">{errors.minePlanApproved}</div>}
                  </td>
                </tr>

                {/* Grant of TOR */}
                <tr>
                  <th style={thStyle}>Grant of TOR</th>
                  <td style={tdStyle}>
                    <select
                      style={selectStyle}
                      className={`form-select ${errors.grantOfTOR ? "is-invalid" : ""}`}
                      id="grantOfTOR"
                      value={formData.grantOfTOR}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Grant of TOR</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    {errors.grantOfTOR && <div className="invalid-feedback">{errors.grantOfTOR}</div>}
                  </td>
                </tr>

                {/* EC */}
                <tr>
                  <th style={thStyle}>EC</th>
                  <td style={tdStyle}>
                    <select
                      style={selectStyle}
                      className={`form-select ${errors.ec ? "is-invalid" : ""}`}
                      id="ec"
                      value={formData.ec}
                      onChange={handleInputChange}
                    >
                      <option value="">Select EC</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    {errors.ec && <div className="invalid-feedback">{errors.ec}</div>}
                  </td>
                </tr>

                {/* FC */}
                <tr>
                  <th style={thStyle}>FC</th>
                  <td style={tdStyle}>
                    <select
                      style={selectStyle}
                      className={`form-select ${errors.fc ? "is-invalid" : ""}`}
                      id="fc"
                      value={formData.fc}
                      onChange={handleInputChange}
                    >
                      <option value="">Select FC</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    {errors.fc && <div className="invalid-feedback">{errors.fc}</div>}
                  </td>
                </tr>

                {/* CTE */}
                <tr>
                  <th style={thStyle}>CTE</th>
                  <td style={tdStyle}>
                    <select
                      style={selectStyle}
                      className={`form-select ${errors.cte ? "is-invalid" : ""}`}
                      id="cte"
                      value={formData.cte}
                      onChange={handleInputChange}
                    >
                      <option value="">Select CTE</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    {errors.cte && <div className="invalid-feedback">{errors.cte}</div>}
                  </td>
                </tr>

                {/* CTO */}
                <tr>
                  <th style={thStyle}>CTO</th>
                  <td style={tdStyle}>
                    <select
                      style={selectStyle}
                      className={`form-select ${errors.cto ? "is-invalid" : ""}`}
                      id="cto"
                      value={formData.cto}
                      onChange={handleInputChange}
                    >
                      <option value="">Select CTO</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    {errors.cto && <div className="invalid-feedback">{errors.cto}</div>}
                  </td>
                </tr>

                {/* Mine Opening Permission */}
                <tr>
                  <th style={thStyle}>Mine Opening Permission</th>
                  <td style={tdStyle}>
                    <select
                      style={selectStyle}
                      className={`form-select ${errors.mineOpeningPermission ? "is-invalid" : ""}`}
                      id="mineOpeningPermission"
                      value={formData.mineOpeningPermission}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Mine Opening Permission</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    {errors.mineOpeningPermission && <div className="invalid-feedback">{errors.mineOpeningPermission}</div>}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  };


  return (
    <div style={{ padding: 10, display: 'flex', flexDirection: 'column', height: '85vh' }}>
      <div className="card mb-3" style={{ flex: 1 }}>
        {renderStepContent()}
      </div>
      <div className="d-flex justify-content-between" style={{ marginTop: '20px' }}>
        <button
          className="btn btn-secondary"
          disabled={currentStep === 1}
          onClick={() => setCurrentStep((prevStep) => prevStep - 1)}
        >
          Previous
        </button>
        <div style={{ display: 'flex', gap: '10px' }}>
          {currentStep === 4 ? (
            <button className="btn btn-success" onClick={handleSaveAndNext}>
              Save
            </button>
          ) : (
            <>
              <button
                className="btn btn-success"
                onClick={handleSaveAndNext}
              >
                Save and Next
              </button>
              {/* <button
              className="btn btn-primary"
              onClick={handleNextStep}
              disabled={currentStep === 4} // Disable on the last step
            >
              {currentStep === 4 ? "Finish" : "Next"}
            </button> */}
            </>
          )}
        </div>
      </div>
    </div>


  );
};
