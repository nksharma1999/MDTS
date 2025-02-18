import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const initialModules = [
  {
    name: "Contract Formulation",
    activities: [
      {
        SrNo: "CF",
        Code: "CF/010",
        keyActivity: "Declaration as H1 Bidder",
        duration: 0,
        preRequisite: "",
        slack: "",
        plannedStart: "5 Mar 25",
        plannedFinish: "5 Mar 25",
        activityStatus: "Completed",
        actualStart: "",
        actualFinish: "",
        actualDuration: "Auto",
        remarks: "",
        expectedStart: "",
        expectedFinish: "Auto",
      },
      {
        SrNo: "CF",
        Code: "CF/020",
        keyActivity: "Signing of CBPDA",
        duration: 6,
        preRequisite: "CF/010",
        slack: "",
        plannedStart: "6 Mar 25",
        plannedFinish: "5 Apr 25",
        activityStatus: "In progress",
        actualStart: "",
        actualFinish: "",
        actualDuration: "Auto",
        remarks: "",
        expectedStart: "Auto",
        expectedFinish: "Auto",
      },
    ],
  },
  {
    name: "Budgetary Planning",
    activities: [
      {
        SrNo: "BP",
        Code: "BP/010",
        keyActivity: "Preparation of NFA for interim budget",
        duration: 15,
        preRequisite: "CF/010",
        slack: 15,
        plannedStart: "21 Mar 25",
        plannedFinish: "",
        activityStatus: "Yet to Start",
        actualStart: "",
        actualFinish: "",
        actualDuration: "",
        remarks: "",
        expectedStart: "",
        expectedFinish: "",
      },
    ],
  },
];

export const StatusUpdate = () => {
  const [modules, setModules] = useState(initialModules);
  const [editingRow, setEditingRow] = useState(null);
  const [editData, setEditData] = useState({});
  const [expandedModules, setExpandedModules] = useState([]);

  const handleEdit = (moduleIndex:any, rowIndex:any) => {
    setEditingRow({ moduleIndex, rowIndex });
    setEditData({ ...modules[moduleIndex].activities[rowIndex] });
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditData({});
  };

  const handleSaveEdit = () => {
    const updatedModules = [...modules];
    updatedModules[editingRow.moduleIndex].activities[editingRow.rowIndex] =
      editData;
    setModules(updatedModules);
    handleCancelEdit();
  };

  const handleDelete = (moduleIndex:any, rowIndex:any) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].activities.splice(rowIndex, 1);
    setModules(updatedModules);
  };

  const handleChange = (field:any, value:any) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleModule = (moduleIndex:any) => {
    if (expandedModules.includes(moduleIndex)) {
      setExpandedModules(expandedModules.filter((index) => index !== moduleIndex));
    } else {
      setExpandedModules([...expandedModules, moduleIndex]);
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#fff", width: "100%" }}>
      <Typography
        variant="h5"
        gutterBottom
        style={{
          marginBottom: "20px",
          textAlign: "left",
          fontWeight: "bold",
          color: "#4F7942",
        }}
      >
        Status Update
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#4F7942", color: "white" ,width:"70%"}}>
              <TableCell style={{ fontWeight: "bold" }}></TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Module</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {modules.map((module, moduleIndex) => (
              <React.Fragment key={moduleIndex}>
                <TableRow>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => toggleModule(moduleIndex)}
                    >
                      {expandedModules.includes(moduleIndex) ? (
                        <RemoveIcon />
                      ) : (
                        <AddIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell>{module.name}</TableCell>
                </TableRow>
                {expandedModules.includes(moduleIndex) && (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Table>
                        <TableHead>
                          <TableRow style={{ backgroundColor: "#e0f7fa" }}>
                            <TableCell style={{ fontWeight: "bold" }}>
                              Sr. No.
                            </TableCell>
                            <TableCell style={{ fontWeight: "bold" }}>
                              Key Activities
                            </TableCell>
                            <TableCell style={{ fontWeight: "bold" }}>
                              Duration
                            </TableCell>
                            <TableCell style={{ fontWeight: "bold" }}>
                              Pre-requisite
                            </TableCell>
                            <TableCell style={{ fontWeight: "bold" }}>
                              Slack
                            </TableCell>
                            <TableCell style={{ fontWeight: "bold" }}>
                              Planned Start
                            </TableCell>
                            <TableCell style={{ fontWeight: "bold" }}>
                              Planned Finish
                            </TableCell>
                            <TableCell style={{ fontWeight: "bold" }}>
                              Activity Status
                            </TableCell>
                            <TableCell style={{ fontWeight: "bold" }}>
                              Actual Start
                            </TableCell>
                            <TableCell style={{ fontWeight: "bold" }}>
                              Actual Finish
                            </TableCell>
                            <TableCell style={{ fontWeight: "bold" }}>
                              Actual Duration
                            </TableCell>
                            <TableCell style={{ fontWeight: "bold" }}>
                              Remarks
                            </TableCell>
                            <TableCell style={{ fontWeight: "bold" }}>
                              Expected Start
                            </TableCell>
                            <TableCell style={{ fontWeight: "bold" }}>
                              Expected Finish
                            </TableCell>
                            <TableCell style={{ fontWeight: "bold" }}>
                              Actions
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {module.activities.map((activity, rowIndex) => (
                            <TableRow key={rowIndex}>
                              {editingRow &&
                              editingRow.moduleIndex === moduleIndex &&
                              editingRow.rowIndex === rowIndex ? (
                                <>
                                  <TableCell>
                                    <TextField
                                      value={editData.SrNo}
                                      onChange={(e) =>
                                        handleChange("SrNo", e.target.value)
                                      }
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      value={editData.keyActivity}
                                      onChange={(e) =>
                                        handleChange("keyActivity", e.target.value)
                                      }
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      value={editData.duration}
                                      onChange={(e) =>
                                        handleChange("duration", e.target.value)
                                      }
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      value={editData.preRequisite}
                                      onChange={(e) =>
                                        handleChange("preRequisite", e.target.value)
                                      }
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      value={editData.slack}
                                      onChange={(e) =>
                                        handleChange("slack", e.target.value)
                                      }
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      value={editData.plannedStart}
                                      onChange={(e) =>
                                        handleChange("plannedStart", e.target.value)
                                      }
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      value={editData.plannedFinish}
                                      onChange={(e) =>
                                        handleChange("plannedFinish", e.target.value)
                                      }
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      value={editData.activityStatus}
                                      onChange={(e) =>
                                        handleChange("activityStatus", e.target.value)
                                      }
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      value={editData.actualStart}
                                      onChange={(e) =>
                                        handleChange("actualStart", e.target.value)
                                      }
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      value={editData.actualFinish}
                                      onChange={(e) =>
                                        handleChange("actualFinish", e.target.value)
                                      }
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      value={editData.actualDuration}
                                      onChange={(e) =>
                                        handleChange("actualDuration", e.target.value)
                                      }
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      value={editData.remarks}
                                      onChange={(e) =>
                                        handleChange("remarks", e.target.value)
                                      }
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      value={editData.expectedStart}
                                      onChange={(e) =>
                                        handleChange("expectedStart", e.target.value)
                                      }
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      value={editData.expectedFinish}
                                      onChange={(e) =>
                                        handleChange("expectedFinish", e.target.value)
                                      }
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <IconButton onClick={handleSaveEdit}>
                                      <SaveIcon />
                                    </IconButton>
                                    <IconButton onClick={handleCancelEdit}>
                                      <CancelIcon />
                                    </IconButton>
                                  </TableCell>
                                </>
                              ) : (
                                <>
                                  <TableCell>{activity.SrNo}</TableCell>
                                  <TableCell>{activity.keyActivity}</TableCell>
                                  <TableCell>{activity.duration}</TableCell>
                                  <TableCell>{activity.preRequisite}</TableCell>
                                  <TableCell>{activity.slack}</TableCell>
                                  <TableCell>{activity.plannedStart}</TableCell>
                                  <TableCell>{activity.plannedFinish}</TableCell>
                                  <TableCell>{activity.activityStatus}</TableCell>
                                  <TableCell>{activity.actualStart}</TableCell>
                                  <TableCell>{activity.actualFinish}</TableCell>
                                  <TableCell>{activity.actualDuration}</TableCell>
                                  <TableCell>{activity.remarks}</TableCell>
                                  <TableCell>{activity.expectedStart}</TableCell>
                                  <TableCell>{activity.expectedFinish}</TableCell>
                                  <TableCell>
                                    <IconButton
                                      onClick={() => handleEdit(moduleIndex, rowIndex)}
                                    >
                                      <EditIcon />
                                    </IconButton>
                                    <IconButton
                                      onClick={() => handleDelete(moduleIndex, rowIndex)}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </TableCell>
                                </>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
export default StatusUpdate;

