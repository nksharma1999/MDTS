import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


export const ProjectDetails = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const { selectedFormData } = location.state || {};

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
    if (selectedFormData) {
      setFormData((prevState) => ({
        ...prevState,
        ...selectedFormData, // Merge incoming data with default state
      }));
    }
  }, [selectedFormData]);

  // Generic handler for dropdowns or input fields
  const handleInputChange = (event: any) => {
    const { name, value } = event.target; // Get field name and value
    setFormData((prevState) => ({
      ...prevState,
      [name]: value, // Update only the specific field
    }));
  };

    // Handle the Edit button click for each section
    const handleEditClick = (section: string, sectionData: any) => {
      navigate(`/project-parameters`, {
        state: { sectionData, section} // Pass the section and data for that section
      });
    };


  return (
    <div style={{ padding: "30px", backgroundColor: "#e6e6e6", width: '100%' }}>
      <div className="card mb-3" style={{ borderRadius: "8px", width: '80%' }}>
        <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: "#6c757d", color: "Black", display: "flex", justifyContent: "space-between", position: "relative" }}>
          <h5 style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)", margin: 0
          }}>Project Parameters</h5>
          <div style={{ marginLeft: "auto" }}>
          <button
              className="btn btn-primary btn-sm"
              style={{ marginRight: '8px' }}
              onClick={() => handleEditClick("project-parameters", formData)}
            >
              Edit
            </button>
          </div>

        </div>
        <div className="card-body" style={{ backgroundColor: "#f9f9f9", padding: "15px", width: '100%' }}>
          <table className="table table-sm" style={{ marginBottom: "0", borderCollapse: "collapse", }}>

            <tbody>
              {[
                { label: "Project Name", value: formData.projectName },
                { label: "Mineral", value: formData.mineral },
                { label: "Type of Mine", value: formData.mineType },
                { label: "Reserve", value: formData.reserve },
                { label: "Net Geological Reserve (Mn T)", value: formData.netGeologicalReserve },
                { label: "Extractable Reserve (Mn T)", value: formData.extractableReserve },
                { label: "Grade (in case of Coal)", value: formData.grade },
                { label: "Strip Ratio (Cum / T)", value: formData.stripRatio },
                { label: "Peak Capacity (MTPA)", value: formData.peakCapacity },
                { label: "Mine Life (years)", value: formData.mineLife },
                { label: "Total Coal Block Area (Ha)", value: formData.totalCoalBlockArea },
                { label: "Forest Land (Ha)", value: formData.forestLand },
                { label: "Pvt. Land (Ha)", value: formData.pvtLand },
                { label: "Govt. Land (Ha)", value: formData.govtLand },
              ].map((row, index) => (
                <tr key={index} style={{ borderBottom: "none" }}>
                  <td
                    style={{
                      width: "40%",
                      border: "none",
                      borderRight: "1px solid #ccc", // Keeps the vertical divider intact
                      padding: "8px",
                    }}
                  >
                    <label>{row.label}</label>
                  </td>
                  <td
                    style={{
                      border: "none",
                      padding: "8px", // Add padding to maintain alignment
                    }}
                  >
                    <input
                      type="text"
                      className="form-control"
                      value={row.value || ""}
                      readOnly
                      style={{
                        backgroundColor: "#f9f9f9", // Keeps the input field visible but styled
                        border: "1px solid #ccc", // Adds a border to the input box only
                        borderRadius: "4px",
                        padding: "4px 8px", // Adjust padding for better spacing
                        width: "100%",
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card mb-3" style={{ borderRadius: "8px", width: '80%' }}>
        <div className="card-header d-flex justify-content-between align-items-cente" style={{ backgroundColor: "#6c757d", color: "Black", display: "flex", justifyContent: "space-between", position: "relative" }}>
          <h5 style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)", margin: 0
          }}>Contractual Details</h5>
          <div style={{ marginLeft: "auto" }}>
          <button
              className="btn btn-primary btn-sm"
              style={{ marginRight: '8px' }}
              onClick={() => handleEditClick("contractual-details", formData)}
            >
              Edit
            </button>
          </div>
        </div>
        <div className="card-body" style={{ backgroundColor: "#ffffff", padding: "15px", width: '100%' }}>
          <table className="table table-sm" style={{ marginBottom: "0", borderCollapse: "collapse" }}>
            <tbody>
              {[
                { label: "Mine Owner", value: formData.mineOwner },
                { label: "Date of H1 Bidder", value: formData.dateOfH1Bidder },
                { label: "CBDPA Date", value: formData.cbdpaDate },
                { label: "Vesting Order Date", value: formData.vestingOrderDate },
                { label: "PBG Amount", value: formData.pbgAmount },
              ].map((row, index) => (
                <tr key={index} style={{ borderBottom: "none" }}>
                  <td
                    style={{
                      width: "40%",
                      border: "none",
                      borderRight: "1px solid #ccc", // Keeps the vertical divider intact
                      padding: "8px",
                    }}
                  >
                    <label>{row.label}</label>
                  </td>
                  <td
                    style={{
                      border: "none",
                      padding: "8px", // Add padding to maintain alignment
                    }}
                  >
                    <input
                      type="text"
                      className="form-control"
                      value={row.value || ""}
                      readOnly
                      style={{
                        backgroundColor: "#f9f9f9", // Keeps the input field visible but styled
                        border: "1px solid #ccc", // Adds a border to the input box only
                        borderRadius: "4px",
                        padding: "4px 8px", // Adjust padding for better spacing
                        width: "100%", // Ensures the input fills the column width
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      <div className="card mb-3" style={{ borderRadius: "8px", width: '80%' }}>
        <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: "#6c757d", color: "Black", display: "flex", justifyContent: "space-between", position: "relative" }}>
          <h5 style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)", margin: 0
          }}>Location</h5>
          <div style={{ marginLeft: "auto" }}>
          <button
              className="btn btn-primary btn-sm"
              style={{ marginRight: '8px' }}
              onClick={() => handleEditClick("location", formData)}
            >
              Edit
            </button>
          </div>
        </div>
        <div className="card-body" style={{ backgroundColor: "#ffffff", padding: "15px", width: '100%' }}>
          <table className="table table-sm" style={{ marginBottom: "0", borderCollapse: "collapse", }}>
            <tbody>
              {[
                { label: "State", value: formData.state },
                { label: "District", value: formData.district },
                { label: "Nearest Town", value: formData.nearestTown },
                { label: "Nearest Airport", value: formData.nearestAirport },
                { label: "Nearest Railway Station", value: formData.nearestRailwayStation },
              ].map((row, index) => (
                <tr key={index} style={{ borderBottom: "none" }}>
                  <td
                    style={{
                      width: "40%",
                      border: "none",
                      borderRight: "1px solid #ccc", // Keeps the vertical divider intact
                      padding: "8px",
                    }}
                  >
                    <label>{row.label}</label>
                  </td>
                  <td
                    style={{
                      border: "none",
                      padding: "8px", // Adds padding to keep the fields aligned
                    }}
                  >
                    <input
                      type="text"
                      className="form-control"
                      value={row.value || ""}
                      readOnly
                      style={{
                        backgroundColor: "#f9f9f9", // Keeps the input field visible but styled
                        border: "1px solid #ccc", // Adds a border to the input box only
                        borderRadius: "4px",
                        padding: "4px 8px", // Adjust padding for better spacing
                        width: "100%", // Ensures the input fills the entire column width
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
      {/* Initial Status of the Project Table */}
      <div className="card mb-3" style={{ borderRadius: "8px", width: '80%' }}>
        <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: "#6c757d", color: "Black", display: "flex", justifyContent: "space-between", position: "relative" }}>
          <h5 style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)", margin: 0
          }}>Initial Status of the Project Table</h5>
          <div style={{ marginLeft: "auto" }}>
          <button
              className="btn btn-primary btn-sm"
              style={{ marginRight: '8px' }}
              onClick={() => handleEditClick("statusOfTheProject", formData)}
            >
              Edit
            </button>
          </div>
        </div>
        <div className="card-body" style={{ backgroundColor: "#ffffff", padding: "15px", width: '80%' }}>
          <table className="table table-sm" style={{ marginBottom: "0", borderCollapse: "collapse" }}>

            <tbody>
              {[
                { id: "explored", label: "Explored", value: formData.explored },
                { id: "grApproved", label: "GR Approved", value: formData.grApproved },
                { id: "minePlanApproved", label: "Mine Plan Approved", value: formData.minePlanApproved },
                { id: "grantOfTOR", label: "Grant of TOR", value: formData.grantOfTOR },
                { id: "ec", label: "EC", value: formData.ec },
                { id: "fc", label: "FC", value: formData.fc },
                { id: "cte", label: "CTE", value: formData.cte },
                { id: "cto", label: "CTO", value: formData.cto },
                { id: "mineOpeningPermission", label: "Mine Opening Permission", value: formData.mineOpeningPermission },
              ].map((row, index) => (
                <tr
                  key={row.id}
                  style={{
                    borderBottom: index === 8 ? "none" : "none", // Removes bottom borders for all rows
                  }}
                >
                  <td
                    style={{
                      width: "50%",
                      borderRight: "1px solid #ccc", // Middle border
                      padding: "8px",
                      borderBottom: "none", // Ensure no row borders are displayed
                    }}
                  >
                    <label htmlFor={row.id}>{row.label}</label>
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "none", // Ensure no row borders are displayed
                    }}
                  >
                    <select
                      className="form-select"
                      id={row.id}
                      name={row.id}
                      value={row.value}
                      onChange={handleInputChange}
                    >
                      <option value="">Select {row.label}</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
