import React from "react";
import { useLocation } from 'react-router-dom';


export const ProjectDetails = () => {

    const location = useLocation();
    const { selectedFormData } = location.state;

    const {
        projectName,
        mineral,
        mineType,
        reserve,
        forestLand,
        pvtLand,
        govtLand,
        totalCoalBlockArea,
        netGeologicalReserve,
        extractableReserve,
        grade,
        stripRatio,
        peakCapacity,
        mineLife,
        mineOwner,
        dateOfH1Bidder,
        cbdpaDate,
        vestingOrderDate,
        pbgAmount,
        state,
        district,
        nearestTown,
        nearestAirport,
        nearestRailwayStation,
        nearestRailwaySiding,
        grApproved,
        minePlanApproved,
        grantOfTOR,
        ec,
        fc,
        cte,
        cto,
        mineOpeningPermission,
      } = selectedFormData;
      
  return (
    <div style={{ padding: 10 }}>
      <div className="card mb-3">
        <div className="card-header">
          <h5>Project Parameters</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput1"
                  placeholder="Project Name"
                  value={projectName}
                />
                <label htmlFor="floatingInput1">Project Name</label>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-floating mb-3">
                <select
                  className="form-select"
                  id="floatingSelectGrid2"
                  // onChange={handleMineralChange}
                  value={mineral}
                >
                  <option value="select">---Select Mineral---</option>
                  <option value="1">Coal</option>
                  <option value="2">Bauxite</option>
                  <option value="3">Zinc</option>
                </select>
                <label htmlFor="floatingSelectGrid2">Mineral</label>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-floating mb-3">
                <select
                  className="form-select"
                  id="floatingSelectGrid3"
                  // onChange={handleMineralChange}
                  value={mineType}
                >
                  <option value="select">---Select Mine Type---</option>
                  <option value="1">UG</option>
                  <option value="2">OC</option>
                  <option value="3">OC/UG</option>
                </select>
                <label htmlFor="floatingSelectGrid3">Type of Mine</label>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput2"
                  placeholder="Reserve"
                  value={reserve}
                />
                <label htmlFor="floatingInput2">Reserve</label>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput3"
                  placeholder="Net Geological Reserve (Mn T)"
                  value={netGeologicalReserve}
                />
                <label htmlFor="floatingInput3">
                  Net Geological Reserve (Mn T)
                </label>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput4"
                  placeholder="Extractable Reserve (Mn T)"
                  value={extractableReserve}
                />
                <label htmlFor="floatingInput4">
                  Extractable Reserve (Mn T)
                </label>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-floating mb-3">
                <select
                  className="form-select"
                  id="floatingSelectGrid4"
                  // onChange={handleMineralChange}
                  value={grade}
                >
                  <option value="select">---Select Grade---</option>
                  <option value="1">G1</option>
                  <option value="2">G2</option>
                  <option value="3">G3</option>
                  <option value="4">G4</option>
                  <option value="5">G5</option>
                  <option value="6">G6</option>
                  <option value="7">G7</option>
                  <option value="8">G8</option>
                  <option value="9">G9</option>
                  <option value="10">G10</option>
                  <option value="11">G11</option>
                  <option value="12">G12</option>
                  <option value="13">G13</option>
                  <option value="14">NA</option>
                </select>
                <label htmlFor="floatingSelectGrid4">
                  Grade (in case of Coal)
                </label>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput5"
                  placeholder="Strip Ratio (Cum / T)"
                  value={stripRatio}
                />
                <label htmlFor="floatingInput5">Strip Ratio (Cum / T)</label>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput6"
                  placeholder="Peak Capacity (MTPA)"
                  value={peakCapacity}
                />
                <label htmlFor="floatingInput6">Peak Capacity (MTPA)</label>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput7"
                  placeholder="Mine Life (years)"
                  value={mineLife}
                />
                <label htmlFor="floatingInput7">Mine Life (years)</label>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput8"
                  placeholder="Total Coal Block Area (Ha)"
                  value={totalCoalBlockArea}
                  disabled
                />
                <label htmlFor="floatingInput8">
                  Total Coal Block Area (Ha)
                </label>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput9"
                  placeholder="Forest Land (Ha)"
                  value={forestLand}
                />
                <label htmlFor="floatingInput9">Forest Land (Ha)</label>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput10"
                  placeholder="Pvt. Land (Ha)"
                  value={pvtLand}
                />
                <label htmlFor="floatingInput10">Pvt. Land (Ha)</label>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput11"
                  placeholder="Govt. land (Ha)"
                  value={govtLand}
                />
                <label htmlFor="floatingInput11">Govt. land (Ha)</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card mb-3">
        <div className="card-header">
          <h5>Contractual Details</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput12"
                  placeholder="Mine Owner"
                  value={mineOwner}
                />
                <label htmlFor="floatingInput12">Mine Owner</label>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput13"
                  placeholder="Date of H1 Bidder"
                  value={dateOfH1Bidder}
                />
                <label htmlFor="floatingInput13">Date of H1 Bidder</label>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-floating mb-3">
                <input
                  type="date"
                  className="form-control"
                  id="floatingInput14"
                  placeholder="CBDPA Date"
                  value={cbdpaDate}
                />
                <label htmlFor="floatingInput14">CBDPA Date</label>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-floating mb-3">
                <input
                  type="date"
                  className="form-control"
                  id="floatingInput15"
                  placeholder="Vesting Order Date"
                  value={vestingOrderDate}
                />
                <label htmlFor="floatingInput15">Vesting Order Date</label>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput17"
                  placeholder="PBG Amount"
                  value={pbgAmount}
                />
                <label htmlFor="floatingInput17">PBG Amount</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card mb-3">
        <div className="card-header">
          <h5>Locations</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput18"
                  placeholder="State"
                  value={state}
                />
                <label htmlFor="floatingInput18">State</label>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput19"
                  placeholder="District"
                  value={district}
                />
                <label htmlFor="floatingInput19">District</label>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput20"
                  placeholder="Nearest Town"
                  value={nearestTown}
                />
                <label htmlFor="floatingInput20">Nearest Town</label>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput21"
                  placeholder="Nearest Airport"
                  value={nearestAirport}
                />
                <label htmlFor="floatingInput21">Nearest Airport</label>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput22"
                  placeholder="Nearest Raiway Station"
                  value={nearestRailwayStation}
                />
                <label htmlFor="floatingInput22">Nearest Raiway Station</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card mb-3">
        <div className="card-header">
          <h5>Please provide Initial Status of the project</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-floating mb-3">
                <select
                  className="form-select"
                  id="floatingSelectGrid5"
                  // onChange={handleMineralChange}
                  // value={selectedMineral}
                >
                  <option value="select">---Select Explored---</option>
                  <option value="1">Yes</option>
                  <option value="2">NO</option>
                </select>
                <label htmlFor="floatingSelectGrid5">Explored</label>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-floating mb-3">
                <select
                  className="form-select"
                  id="floatingSelectGrid6"
                  // onChange={handleMineralChange}
                  value={grApproved}
                >
                  <option value="select">---Select GR Approved---</option>
                  <option value="1">Yes</option>
                  <option value="2">NO</option>
                </select>
                <label htmlFor="floatingSelectGrid6">GR Approved</label>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-floating mb-3">
                <select
                  className="form-select"
                  id="floatingSelectGrid7"
                  // onChange={handleMineralChange}
                  value={minePlanApproved}
                >
                  <option value="select">
                    Select Mine Plan Approved
                  </option>
                  <option value="1">Yes</option>
                  <option value="2">NO</option>
                </select>
                <label htmlFor="floatingSelectGrid7">Mine Plan Approved</label>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-floating mb-3">
                <select
                  className="form-select"
                  id="floatingSelectGrid8"
                  // onChange={handleMineralChange}
                  value={grantOfTOR}
                >
                  <option value="select">Select Grant of TOR</option>
                  <option value="1">Yes</option>
                  <option value="2">NO</option>
                </select>
                <label htmlFor="floatingSelectGrid8">Grant of TOR</label>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-floating mb-3">
                <select
                  className="form-select"
                  id="floatingSelectGrid9"
                  // onChange={handleMineralChange}
                  value={ec}
                >
                  <option value="select">Select EC</option>
                  <option value="1">Yes</option>
                  <option value="2">NO</option>
                </select>
                <label htmlFor="floatingSelectGrid9">EC</label>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-floating mb-3">
                <select
                  className="form-select"
                  id="floatingSelectGrid10"
                  // onChange={handleMineralChange}
                  value={fc}
                >
                  <option value="select">Select FC</option>
                  <option value="1">Yes</option>
                  <option value="2">NO</option>
                </select>
                <label htmlFor="floatingSelectGrid10">FC</label>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-floating mb-3">
                <select
                  className="form-select"
                  id="floatingSelectGrid11"
                  // onChange={handleMineralChange}
                  value={cte}
                >
                  <option value="select">Select CTE</option>
                  <option value="1">Yes</option>
                  <option value="2">NO</option>
                </select>
                <label htmlFor="floatingSelectGrid11">CTE</label>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-floating mb-3">
                <select
                  className="form-select"
                  id="floatingSelectGrid12"
                  // onChange={handleMineralChange}
                  value={cto}
                >
                  <option value="select">---Select CTO---</option>
                  <option value="1">Yes</option>
                  <option value="2">NO</option>
                </select>
                <label htmlFor="floatingSelectGrid12">CTO</label>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="form-floating mb-3">
                <select
                  className="form-select"
                  id="floatingSelectGrid13"
                  // onChange={handleMineralChange}
                  value={mineOpeningPermission}
                >
                  <option value="select">
                    Select Mine Opening Permission
                  </option>
                  <option value="1">Yes</option>
                  <option value="2">NO</option>
                </select>
                <label htmlFor="floatingSelectGrid13">
                  Mine Opening Permission
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};