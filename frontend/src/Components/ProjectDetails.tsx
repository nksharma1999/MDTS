import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';

export const ProjectDetails = () => {
  const location = useLocation();
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

  const [isEditing, setIsEditing] = useState(false);  // Single state for edit toggle

  // Initialize state with selectedFormData values
  useEffect(() => {
    if (selectedFormData) {
      setFormData((prevState) => ({
        ...prevState,
        ...selectedFormData, // Merge incoming data with default state
      }));
    }
  }, [selectedFormData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value, // Update only the specific field
    }));
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);  // Toggle the edit mode for all sections
  };

  const renderTableRows = (sectionData) => {
    return sectionData.map((row, index) => (
      <tr key={index}>
        <td style={{ width: "40%", padding: "12px", fontWeight: 'bold' }}>
          <label>{row.label}</label>
        </td>
        <td style={{ padding: "12px" }}>
          {isEditing ? (
            <input
              type="text"
              className="form-control"
              name={row.name}
              value={formData[row.name] || ""}
              onChange={handleInputChange}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #ccc",
                borderRadius: "6px",
                padding: "10px",
              }}
            />
          ) : (
            <input
              type="text"
              className="form-control"
              value={formData[row.name] || ""}
              readOnly
              style={{
                backgroundColor: "#f9f9f9",
                border: "1px solid #ddd",
                borderRadius: "6px",
                padding: "10px",
              }}
            />
          )}
        </td>
      </tr>
    ));
  };

  const projectParams = [
    { label: "Project Name", name: "projectName" },
    { label: "Mineral", name: "mineral" },
    { label: "Type of Mine", name: "mineType" },
    { label: "Reserve", name: "reserve" },
    { label: "Net Geological Reserve (Mn T)", name: "netGeologicalReserve" },
    { label: "Extractable Reserve (Mn T)", name: "extractableReserve" },
    { label: "Grade (in case of Coal)", name: "grade" },
    { label: "Strip Ratio (Cum / T)", name: "stripRatio" },
    { label: "Peak Capacity (MTPA)", name: "peakCapacity" },
    { label: "Mine Life (years)", name: "mineLife" },
    { label: "Total Coal Block Area (Ha)", name: "totalCoalBlockArea" },
    { label: "Forest Land (Ha)", name: "forestLand" },
    { label: "Pvt. Land (Ha)", name: "pvtLand" },
    { label: "Govt. Land (Ha)", name: "govtLand" },
  ];

  const contractualDetails = [
    { label: "Mine Owner", name: "mineOwner" },
    { label: "Date of H1 Bidder", name: "dateOfH1Bidder" },
    { label: "CBDPA Date", name: "cbdpaDate" },
    { label: "Vesting Order Date", name: "vestingOrderDate" },
    { label: "PBG Amount (Rs in Cr)", name: "pbgAmount" },
  ];

  const locationDetails = [
    { label: "State", name: "state" },
    { label: "District", name: "district" },
    { label: "Nearest Town", name: "nearestTown" },
    { label: "Nearest Airport", name: "nearestAirport" },
    { label: "Nearest Railway Station", name: "nearestRailwayStation" },
    { label: "Nearest Railway Siding", name: "nearestRailwaySiding" },
  ];

  return (
    <div style={{ padding: "40px", backgroundColor: "#f7f7f7", minHeight: '100vh' }}>
      <div className="section-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-between' }}>
        
        {/* Project Parameters Section */}
        <div className="card mb-3" style={{
          borderRadius: "12px", width: '48%', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', padding: '20px'
        }}>
          <div className="card-header d-flex justify-content-between align-items-center" style={{
            backgroundColor: "#007bff", color: "white", borderRadius: '8px', padding: '12px'
          }}>
            <h5 style={{ margin: 0, fontWeight: 'bold' }}>Project Parameters</h5>
            <button
              className="btn btn-outline-light btn-sm"
              style={{ borderRadius: '50px', padding: '5px 15px', fontSize: '14px' }}
              onClick={toggleEdit}
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>
          <div className="card-body" style={{ backgroundColor: "#ffffff", padding: "15px", borderRadius: '8px' }}>
            <table className="table table-bordered" style={{ marginBottom: "0" }}>
              <tbody>
                {renderTableRows(projectParams)}
              </tbody>
            </table>
          </div>
        </div>

        {/* Contractual Details Section */}
        <div className="card mb-3" style={{
          borderRadius: "12px", width: '48%', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', padding: '20px'
        }}>
          <div className="card-header d-flex justify-content-between align-items-center" style={{
            backgroundColor: "#007bff", color: "white", borderRadius: '8px', padding: '12px'
          }}>
            <h5 style={{ margin: 0, fontWeight: 'bold' }}>Contractual Details</h5>
            <button
              className="btn btn-outline-light btn-sm"
              style={{ borderRadius: '50px', padding: '5px 15px', fontSize: '14px' }}
              onClick={toggleEdit}
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>
          <div className="card-body" style={{ backgroundColor: "#ffffff", padding: "15px", borderRadius: '8px' }}>
            <table className="table table-bordered" style={{ marginBottom: "0" }}>
              <tbody>
                {renderTableRows(contractualDetails)}
              </tbody>
            </table>
          </div>
        </div>

        {/* Location Details Section */}
        <div className="card mb-3" style={{
          borderRadius: "12px", width: '48%', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', padding: '20px'
        }}>
          <div className="card-header d-flex justify-content-between align-items-center" style={{
            backgroundColor: "#007bff", color: "white", borderRadius: '8px', padding: '12px'
          }}>
            <h5 style={{ margin: 0, fontWeight: 'bold' }}>Location</h5>
            <button
              className="btn btn-outline-light btn-sm"
              style={{ borderRadius: '50px', padding: '5px 15px', fontSize: '14px' }}
              onClick={toggleEdit}
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>
          <div className="card-body" style={{ backgroundColor: "#ffffff", padding: "15px", borderRadius: '8px' }}>
            <table className="table table-bordered" style={{ marginBottom: "0" }}>
              <tbody>
                {renderTableRows(locationDetails)}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
