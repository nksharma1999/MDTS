import { useState } from "react";
import { generateTwoLetterAcronym } from "../Utils/generateTwoLetterAcronym";

export const ModuleBuilder = () => {
  const [newModelName, setNewModelName] = useState<string>("");
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
      lavel: 1,
      plus: 0,
      activitys: [
        {
          level: 2,
          name: "Pre-requisite to Forest Clearance",
          code: "FC/PR",
          plus: 0,
        },
        {
          level: 3,
          name: "Procurement of Private Land for CA Purpose",
          code: "FC/PR/CA",
          plus: 0,
        },
      ],
    },
    {
      parentModuleCode: "BP",
      name: "Budgetary Planning",
      lavel: 1,
      plus: 0,
      activitys: [
        {
          level: 2,
          name: "Pre-requisite to Forest Clearance",
          code: "FC/PR",
          plus: 0,
        },
        {
          level: 2,
          name: "Pre-requisite to Forest Clearance 4",
          code: "FC/PR/10",
          plus: 10,
        },
        {
          level: 2,
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

  const handleModulePlus = () => {
    try {
      console.log(existingAcronyms);
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
  };

  const getCode = (prevCode: string, plus: number) => {
    if (plus === 0) {
      return prevCode + "/" + (plus + 10).toString();
    } else {
      const codeSplit = prevCode.split("/");
      let result = codeSplit.slice(0, -1).join("/");
      return result + "/" + (plus + 10).toString();
    }
  };

  const handleSaveActivity = () => {
    let tempData = module;
    // console.log(newActInput);
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
  const getMaxLevel = (act: any) => {
    let max = 0;
    for (let i = 0; i < act.length; i++) {
      max = Math.max(max, act[i].level);
    }
    return max;
  };
  const createSubmoduleCode = (prevCode: string, acry: string) => {
    const codeSplit = prevCode.split("/");
    let result = codeSplit.slice(0, -1).join("/");
    return result + "/" + acry;
  };
  const handleIncButtonClick = (pCode: string, index: number, values: any) => {
    let tempData = module;
    for (let i = 0; i < tempData.length; i++) {
      if (tempData[i].parentModuleCode === pCode) {
        const act = tempData[i].activitys;
        if (values.plus === 0) {
          const preLevel = values.level;
          const maxLevel = getMaxLevel(act);
          for (let j = index; j < act.length; j++) {
            if (act[j].level === preLevel) {
              act[j].level = maxLevel + 1;
            }
          }
        } else {
        //   const preLevel = values.level;
          const maxLevel = getMaxLevel(act);
          const acronym = generateTwoLetterAcronym(
            values.name,
            existingAcronyms
          );
          setExistingAcronyms([...existingAcronyms, acronym]);
          act.push({
            level: maxLevel+1,
            name: act[index].name,
            code: createSubmoduleCode(values.code, acronym),
            plus: 0,
          });
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
            <h5>Module Builder</h5>
            <div>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                Add New Model
              </button>
            </div>
          </div>
        </div>
        <div className="card-body">
          {module.map((val, index) => {
            return (
              <table className="table table-bordered" key={index}>
                {/* {index == 0 && (
                  <thead>
                    <tr>
                      <th scope="col">Module Code</th>
                      <th scope="col">Module Name</th>
                      <th scope="col">Module Level</th>
                    </tr>
                  </thead>
                )} */}
                <tbody>
                  <tr style={{ backgroundColor: "gray", color: "white" }}>
                    <td>{val.parentModuleCode}</td>
                    <td>{val.name}</td>
                    <td>L{val.lavel}</td>
                    <td>
                      <button className="btn">-</button>
                      <button className="btn">+</button>
                      <button className="btn">ADD</button>
                      <button className="btn">DEL</button>
                    </td>
                  </tr>
                  {val.activitys.map((act, ids) => {
                    return (
                      <tr key={ids}>
                        <td>{act.code}</td>
                        <td>{act.name}</td>
                        <td>L{act.level}</td>
                        <td>
                          <button className="btn">-</button>
                          <button
                            className="btn"
                            onClick={() =>
                              handleIncButtonClick(
                                val.parentModuleCode,
                                ids,
                                act
                              )
                            }
                          >
                            +
                          </button>

                          <button
                            type="button"
                            className="btn btn-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal2"
                            onClick={() =>
                              handleAddActivity(
                                ids,
                                val.parentModuleCode,
                                act.code
                              )
                            }
                          >
                            ADD
                          </button>
                          <button className="btn">DEL</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            );
          })}
        </div>
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
                Add New Model
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
                <label htmlFor="floatingInput2">Model Name</label>
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
  );
};
