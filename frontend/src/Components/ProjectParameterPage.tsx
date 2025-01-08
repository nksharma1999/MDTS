import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Box,
  Button,
  Divider
} from "@mui/material";

function ProjectParametersPage() {
//   const { section, formData } = location.state || {};
  const location = useLocation();
//   const navigate = useNavigate();
  const { sectionData , section} = location.state || {};
  const [mineral, setMineral] = useState(sectionData?.mineral || "");
const [mineType, setMineType] = useState(sectionData?.mineType || "");
const [grade, setGrade] = useState(sectionData?.grade || "");


  const [formData, setFormData] = useState({
    project_id: 0,
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
    explored: '',
    grApproved: "",
    minePlanApproved: "",
    grantOfTOR: "",
    ec: "",
    fc: "",
    cte: "",
    cto: "",
    mineOpeningPermission: "",

  });

  // Initialize state with selectedFormData values
  useEffect(() => {
    console.log('Section and Section Data : ', section, sectionData);
    if (sectionData) {
      setFormData((prevState) => ({
        ...prevState,
        ...sectionData, // Merge incoming data with default state
      }));
    }
  }, [sectionData]);

  const styles = {
    pageContainer: {
      backgroundColor: "#eaf2f8", // Light blue background for a fresh look
      minHeight: "100vh",
      padding: "30px 20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    formContainer: {
      backgroundColor: "#ffffff", // White form background
      borderRadius: "12px",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
      padding: "30px",
      maxWidth: "1100px",
      width: "100%",
      marginTop: "20px",
    },
    headerText: {
      fontSize: "24px",
      fontWeight: "600",
      color: "#333",
      marginBottom: "20px",
      textAlign: "center",
      borderBottom: "2px solid #007bff",
      paddingBottom: "10px",
    },
    fieldLabel: {
      color: "#555",
      fontWeight: "500",
    },
    inputField: {
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: "30px",
    },
    updateButton: {
      backgroundColor: "#007bff",
      color: "#fff",
      padding: "10px 20px",
      fontWeight: "bold",
      borderRadius: "8px",
      '&:hover': {
        backgroundColor: "#0056b3",
      },
    },
    sectionTitle: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#333",
      marginTop: "20px",
      marginBottom: "10px",
    },
    divider: {
      margin: "20px 0",
    },
  };

  const handleUpdate = () => {
    // Implement the logic to update the data
    console.log("Update button clicked");
  };

  const renderSectionForm = () => {
    console.log("Form Data : ", formData);
    switch (section) {
      case "project-parameters":
        return (
          <Box style={styles.formContainer}>
            <Typography style={styles.headerText}>
              Edit Project Parameters
            </Typography>
            <Grid container spacing={3}>
              {[
                { label: "Project Name", value: sectionData?.projectName },
                { label: "Mineral", value: sectionData?.mineral, type: "select" },
                { label: "Type of Mine", value: sectionData?.mineType, type: "select" },
                { label: "Reserve", value: sectionData?.reserve },
                { label: "Net Geological Reserve (Mn T)", value: sectionData?.netGeologicalReserve },
                { label: "Extractable Reserve (Mn T)", value: sectionData?.extractableReserve },
                { label: "Grade (in case of Coal)", value: sectionData?.grade, type: "select" },
                { label: "Strip Ratio (Cum / T)", value: sectionData?.stripRatio },
                { label: "Peak Capacity (MTPA)", value: sectionData?.peakCapacity },
                { label: "Mine Life (years)", value: sectionData?.mineLife },
                { label: "Total Coal Block Area (Ha)", value: sectionData?.totalCoalBlockArea },
                { label: "Forest Land (Ha)", value: sectionData?.forestLand },
                // { label: "Pvt. Land (Ha)", value: sectionData?.pvtLand },
                // { label: "Govt. Land (Ha)", value: sectionData?.govtLand },
              ].map((row, index) => (
                <Grid item xs={12} md={6} key={index}>
                  {row.type === "select" ? (
                    <FormControl fullWidth>
                    <InputLabel style={styles.fieldLabel}>{row.label}</InputLabel>
                    <Select
                      value={row.label === "Mineral" ? mineral : row.label === "Type of Mine" ? mineType : grade}
                      onChange={(e) => {
                        if (row.label === "Mineral") {
                          setMineral(e.target.value);
                        } else if (row.label === "Type of Mine") {
                          setMineType(e.target.value);
                        } else if (row.label === "Grade (in case of Coal)") {
                          setGrade(e.target.value);
                        }
                      }}
                      style={styles.inputField}
                    >
                      {/* Replace with actual options for Mineral */}
                      {row.label === "mineral" && (
                        <>
                          <MenuItem value="Select Mineral">Select Mineral</MenuItem>
                          <MenuItem value="Coal">Coal</MenuItem>
                          <MenuItem value="Iron Ore">Iron Ore</MenuItem>
                        </>
                      )}
                      {/* Replace with actual options for Type of Mine */}
                      {row.label === "Type of Mine" && (
                        <>
                          <MenuItem value="Select Type of Mine">Select Type of Mine</MenuItem>
                          <MenuItem value="OC">OC</MenuItem>
                          <MenuItem value="UG">UG</MenuItem>
                        </>
                      )}
                      {/* Replace with actual options for Grade */}
                      {row.label === "Grade (in case of Coal)" && (
                        <>
                          <MenuItem value="Select Grade">Select Grade</MenuItem>
                          <MenuItem value="G1">G1</MenuItem>
                          <MenuItem value="G2">G2</MenuItem>
                          <MenuItem value="G3">G3</MenuItem>
                        </>
                      )}
                    </Select>
                  </FormControl>
                    
                  ) : (
                    <TextField
                      fullWidth
                      label={row.label}
                      defaultValue={row.value}
                      variant="outlined"
                      InputLabelProps={{ style: styles.fieldLabel }}
                      InputProps={{ style: styles.inputField }}
                    />
                  )}
                </Grid>
              ))}
            </Grid>
            <Divider style={styles.divider} />
            <Box style={styles.buttonContainer}>
              <Button
                variant="contained"
                style={styles.updateButton}
                onClick={handleUpdate}
              >
                Update
              </Button>
            </Box>
          </Box>
        );
      case "contractual-details":
        return (
          <Box style={styles.formContainer}>
            <Typography style={styles.headerText}>
              Edit Contractual Details
            </Typography>
            <Grid container spacing={3}>
              {[
                { label: "Mine Owner", value: sectionData?.mineOwner },
                { label: "Date of H1 Bidder", value: sectionData?.dateOfH1Bidder },
                { label: "CBDPA Date", value: sectionData?.cbdpaDate },
                { label: "Vesting Order Date", value: sectionData?.vestingOrderDate },
                { label: "PBG Amount", value: sectionData?.pbgAmount },
              ].map((row, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <TextField
                    fullWidth
                    label={row.label}
                    defaultValue={row.value}
                    variant="outlined"
                    InputLabelProps={{ style: styles.fieldLabel }}
                    InputProps={{ style: styles.inputField }}
                  />
                </Grid>
              ))}
            </Grid>
            <Divider style={styles.divider} />
            <Box style={styles.buttonContainer}>
              <Button
                variant="contained"
                style={styles.updateButton}
                onClick={handleUpdate}
              >
                Update
              </Button>
            </Box>
          </Box>
        );
      case "location":
        return (
          <Box style={styles.formContainer}>
            <Typography style={styles.headerText}>Edit Location</Typography>
            <Grid container spacing={3}>
              {[
                { label: "State", value: sectionData?.state },
                { label: "District", value: sectionData?.district },
                { label: "Nearest Town", value: sectionData?.nearestTown },
                { label: "Nearest Airport", value: sectionData?.nearestAirport },
                { label: "Nearest Railway Station", value: sectionData?.nearestRailwayStation },
              ].map((row, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <TextField
                    fullWidth
                    label={row.label}
                    defaultValue={row.value}
                    variant="outlined"
                    InputLabelProps={{ style: styles.fieldLabel }}
                    InputProps={{ style: styles.inputField }}
                  />
                </Grid>
              ))}
            </Grid>
            <Divider style={styles.divider} />
            <Box style={styles.buttonContainer}>
              <Button
                variant="contained"
                style={styles.updateButton}
                onClick={handleUpdate}
              >
                Update
              </Button>
            </Box>
          </Box>
        );
      case "statusOfTheProject":
        return (
          <Box style={styles.formContainer}>
            <Typography style={styles.headerText}>
              Initial Status of the Project
            </Typography>
            <Grid container spacing={3}>
              {[
                { label: "Explored", value: sectionData?.explored },
                { label: "GR Approved", value: sectionData?.grApproved },
                { label: "Mine Plan Approved", value: sectionData?.minePlanApproved },
                { label: "Grant of TOR", value: sectionData?.grantOfTOR },
                { label: "EC", value: sectionData?.ec },
                { label: "FC", value: sectionData?.fc },
                { label: "CTE", value: sectionData?.cte },
                { label: "CTO", value: sectionData?.cto },
                { label: "Mine Opening Permission", value: sectionData?.mineOpeningPermission },
              ].map((row, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <FormControl fullWidth>
                    <InputLabel style={styles.fieldLabel}>{row.label}</InputLabel>
                    <Select
                      defaultValue={row.value || ""}
                      style={styles.inputField}
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              ))}
            </Grid>
            <Divider style={styles.divider} />
            <Box style={styles.buttonContainer}>
              <Button
                variant="contained"
                style={styles.updateButton}
                onClick={handleUpdate}
              >
                Update
              </Button>
            </Box>
          </Box>
        );
      default:
        return <div>No section selected</div>;
    }
  };

  return (
    <Box style={styles.pageContainer}>
      {renderSectionForm()}
    </Box>
  );
}

export default ProjectParametersPage;
