import { useState } from "react";

interface dataInterface {
  id: number;
  code: string;
  name: string;
  isSelected?: boolean;
  data?: dataInterface[];
  preRequisite?: string;
  start?: string;
  isModule: boolean;
}

const data1: dataInterface[] = [
  {
    id: 1,
    code: "CF",
    name: "Contract Formulation",
    isSelected: false,
    isModule: true,
    data: [
      {
        id: 11,
        code: "CF/10",
        name: "Declaration as H1 Bidder",
        preRequisite: "",
        start: "",
        isModule: false,
      },
      {
        id: 11,
        code: "CF/110",
        name: "Declaration as H1 Bidder2",
        preRequisite: "",
        start: "",
        isModule: false,
      },
      {
        id: 12,
        code: "CF/20",
        name: "Signing of CBDPA",
        preRequisite: "CF/10",
        start: "",
        isModule: false,
      },
      {
        id: 13,
        code: "CF/30",
        name: "Payment to MoC ( Fixed Charges ,Upfront payment & PBG)",
        preRequisite: "CF/20",
        start: "",
        isModule: false,
      },
    ],
  },
  //   {
  //     id: 2,
  //     code: "BP",
  //     name: "Budgetary Planning",
  //     isSelected: false,
  //     isModule: true,
  //   },
  //   {
  //     id: 3,
  //     code: "BC",
  //     name: "Boundary Coordinate Certification by CMPDI",
  //     isSelected: false,
  //     isModule: true,
  //   },
  //   {
  //     id: 4,
  //     code: "DG",
  //     name: "DGPS Survey, Land Schedule and Cadestral Map",
  //     isSelected: false,
  //     isModule: true,
  //   },
  //   {
  //     id: 5,
  //     code: "GR",
  //     name: "Geological Report",
  //     isSelected: false,
  //     isModule: true,
  //   },
  //   {
  //     id: 6,
  //     code: "MP",
  //     name: "Mine Plan Approval",
  //     isSelected: false,
  //     isModule: true,
  //   },
  {
    id: 7,
    code: "FC",
    name: "Forest Clearance",
    isSelected: false,
    isModule: true,
    data: [
      {
        id: 14,
        code: "FC/PR",
        name: "Pre-requisite to FC Application",
        isSelected: false,
        isModule: true,
        data: [
          {
            id: 141,
            code: "FC/PR/10",
            name: "Declaration as H1 Bidder",
            preRequisite: "CF/10",
            start: "",
            isModule: false,
          },
          {
            id: 142,
            code: "FC/PR/20",
            name: "Signing of CBDPA",
            preRequisite: "FC/PR/10",
            start: "",
            isModule: false,
          },
          {
            id: 143,
            code: "FC/PR/30",
            name: "Payment to MoC ( Fixed Charges ,Upfront payment & PBG)",
            preRequisite: "FC/PR/20",
            start: "",
            isModule: false,
          },
        ],
      },
      {
        id: 15,
        code: "FC/I",
        name: "FC Stage-1 Proceedings",
        isSelected: false,
        isModule: true,
        data: [
          {
            id: 11,
            code: "CF/10",
            name: "Declaration as H1 Bidder",
            preRequisite: "",
            start: "",
            isModule: false,
          },
        ],
      },
    ],
  },
  //   {
  //     id: 8,
  //     code: "TOR",
  //     name: "Terms of Reference",
  //     isSelected: false,
  //     isModule: true,
  //   },
  //   {
  //     id: 9,
  //     code: "EC",
  //     name: "Environment Clearance",
  //     isSelected: false,
  //     isModule: true,
  //   },
  //   {
  //     id: 10,
  //     code: "ML",
  //     name: "Mining Lease",
  //     isSelected: false,
  //     isModule: true,
  //   },
  //   {
  //     id: 11,
  //     code: "CTE",
  //     name: "Consent to Establish",
  //     isSelected: false,
  //     isModule: true,
  //   },
  //   {
  //     id: 12,
  //     code: "CTO",
  //     name: "Consent to Operate",
  //     isSelected: false,
  //     isModule: true,
  //   },
  //   {
  //     id: 13,
  //     code: "MO",
  //     name: "Mine Opening Permission",
  //     isSelected: false,
  //     isModule: true,
  //   },
];
export const TimelineBuilder = () => {
  const inputStyle = {
    padding: "10px 6px",
    fontSize: "15px",
    height: "28px",
    width: "250px",
    // border: "1px solid #ccc",
    // borderRadius: "4px",
  };

  const selectStyle = {
    ...inputStyle,
    height: "50px", // Slightly taller for dropdown consistency
  };

  const [datas, setDatas] = useState<dataInterface[]>(data1);
  const [popupData, setPopupData] = useState<dataInterface[]>();
  const [popupModuleData, setPopupModuleData] = useState<dataInterface[]>();
  const [showActivity, setShowActivity] = useState<boolean>(false);
  const [showModule, setShowModule] = useState<boolean>(false);
  const handleCheckboxChange = (
    selectedVal: dataInterface,
    data: dataInterface[],
    ispopupdata: boolean
  ) => {
    let tempSubModule = [];
    let tempActivity: dataInterface[] = [];
    if (selectedVal.data) {
      for (let i = 0; i < selectedVal.data?.length; i++) {
        if (selectedVal.data[i].isModule) {
          tempSubModule.push(selectedVal.data[i]);
        } else {
          if (selectedVal.data[i].preRequisite === "") {
            tempActivity.push(selectedVal.data[i]);
          }
        }
      }
    }
    if (tempActivity.length > 0) {
      setShowActivity(true);
      setPopupData(tempActivity);
    }
    if (tempSubModule.length > 0) {
      setShowModule(true);
      setPopupModuleData(tempSubModule);
    }

    const updatedData = data.map((item) => {
      if (item.code === selectedVal.code) {
        if (selectedVal.isSelected) {
          setPopupData([]);
        }
        return { ...item, isSelected: !item.isSelected };
      }
      return item;
    });

    if (ispopupdata) {
      setPopupModuleData(updatedData);
    } else {
      setDatas(updatedData);
    }
  };
  const handleCloseBtn = () => {
    setShowActivity(false);
    setPopupData([]);
  };
  const handleModuleCloseBtn = () => {
    setShowModule(false);
    setPopupModuleData([]);
  };

  return (
    <>
      <div style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "right" }}>
          <div>
            <select
              style={selectStyle}
              className="form-select"
              id="mineType"
              // value={formData.mineType}
              // onChange={handleInputChange}
            >
              <option value="">Select Mine Type</option>
              <option value="OC">OC</option>
              <option value="UG">UG</option>
            </select>
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
                </tr>
              </thead>
              <tbody>
                {datas.map((val, index) => {
                  return (
                    <tr key={index}>
                      <th scope="row">{val.code}</th>
                      <td>{val.name}</td>
                      <td>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={val.isSelected}
                          onChange={() =>
                            handleCheckboxChange(val, datas, false)
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showActivity &&
        !showModule &&
        popupData !== undefined &&
        popupData?.length > 0 && (
          <div className="popupParent">
            <div className="popupChildBox">
              <div
                style={{
                  position: "relative",
                }}
              >
                <div
                  style={{ position: "absolute", left: "45%", top: "-60px" }}
                >
                  <button
                    style={{
                      width: "40px",
                      height: "40px",
                      border: "none",
                      borderRadius: "25px",
                    }}
                    onClick={handleCloseBtn}
                  >
                    X
                  </button>
                </div>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">#Code</th>
                      <th scope="col">Key Activities</th>
                      <th scope="col">Start Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {popupData.map((val, index) => {
                      return (
                        <tr key={index}>
                          <th scope="row">{val.code}</th>
                          <td>{val.name}</td>
                          <td>
                            <input type="date"></input>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      {showModule &&
        !showActivity &&
        popupModuleData !== undefined &&
        popupModuleData?.length > 0 && (
          <div className="popupParent">
            <div className="popupChildBox">
              <div
                style={{
                  position: "relative",
                }}
              >
                <div
                  style={{ position: "absolute", left: "45%", top: "-60px" }}
                >
                  <button
                    style={{
                      width: "40px",
                      height: "40px",
                      border: "none",
                      borderRadius: "25px",
                    }}
                    onClick={handleModuleCloseBtn}
                  >
                    X
                  </button>
                </div>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">#Code</th>
                      <th scope="col">Sub Module</th>
                      <th scope="col">Yes/No</th>
                    </tr>
                  </thead>
                  <tbody>
                    {popupModuleData.map((val, index) => {
                      return (
                        <tr key={index}>
                          <th scope="row">{val.code}</th>
                          <td>{val.name}</td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={val.isSelected}
                              onChange={() =>
                                handleCheckboxChange(val, popupModuleData, true)
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
    </>
  );
};
