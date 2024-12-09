interface props {}

export const EmployeeRegistration: React.FC<props> = () => {
  return (
    <div style={{ padding: 10 }}>
      <div></div>
      <div className="card mb-3">
        <div className="card-header">
          <h4 style={{ textAlign: "center" }}>Amrendra Kumar</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-lg-4 col-md-4 col-sm-6">
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="floatingInput12"
                  placeholder="Email"
                />
                <label htmlFor="floatingInput12">Email</label>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput13"
                  placeholder="WhatsApp"
                />
                <label htmlFor="floatingInput13">WhatsApp</label>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6">
              <div className="form-floating mb-3">
                <input
                  type="number"
                  className="form-control"
                  id="floatingInput14"
                  placeholder="Mobile"
                />
                <label htmlFor="floatingInput14">Mobile</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card mb-3">
        <div className="card-header">
          <h5>Desired Notification</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col">
              <div className="form-check">
                <label className="form-check-label" htmlFor="defaultCheck1">
                  Email
                </label>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="defaultCheck1"
                />
              </div>
            </div>
            <div className="col">
              <div className="form-check">
                <label className="form-check-label" htmlFor="defaultCheck2">
                  WhatsApp
                </label>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="defaultCheck2"
                />
              </div>
            </div>
            <div className="col">
              <div className="form-check">
                <label className="form-check-label" htmlFor="defaultCheck3">
                  Mobile
                </label>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="defaultCheck3"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card mb-3">
        <div className="card-header">
          <h5>Modules</h5>
        </div>
        <div className="card-body">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">#Code</th>
                <th scope="col">Select Modules</th>
                <th scope="col">YES/NO</th>
                <th scope="col">Responsible</th>
                <th scope="col">Accountable</th>
                <th scope="col">Consulted</th>
                <th scope="col">Informed</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">CF</th>
                <td>Contract Formulation</td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">BP</th>
                <td>Budgetary Planning</td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">BC</th>
                <td>Boundary Coordinate Certification by CMPDI</td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">DG</th>
                <td>DGPS Survey, Land Schedule and Cadestral Map</td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">GR</th>
                <td>Geological Report</td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">MP</th>
                <td>Mine Plan Approval</td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">FC</th>
                <td>Forest Clearance</td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">TOR</th>
                <td>Terms of Reference</td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">EC</th>
                <td>Environment Clearance</td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">ML</th>
                <td>Mining Lease</td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">CTE</th>
                <td>Consent to Establish</td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">CTO</th>
                <td>Consent to Operate</td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">MO</th>
                <td>Mine Opening Permission</td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
