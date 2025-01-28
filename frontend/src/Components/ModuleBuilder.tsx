import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

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

export const ModuleBuilder = () => {
  const [modules, setModules] = useState(initialModules);
  const [editingRow, setEditingRow] = useState(null); // Track editing state
  const [editData, setEditData] = useState({}); // Store edited data

  const handleEdit = (moduleIndex, rowIndex) => {
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

  const handleDelete = (moduleIndex, rowIndex) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].activities.splice(rowIndex, 1);
    setModules(updatedModules);
  };

  const handleChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
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
      {modules.map((module, moduleIndex) => (
        <Accordion
          key={moduleIndex}
          style={{
            marginBottom: "10px",
            backgroundColor: "#4F7942",
            color: "white",
            width: "100%",
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h7" style={{ fontWeight: "bold" }}>
              {module.name}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer
              component={Paper}
              style={{
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Table style={{ minWidth: "1000px" }}>
                <TableHead>
                  <TableRow style={{ backgroundColor: "#e0f7fa", }}>
                    <TableCell style={{ fontWeight: "bold" }}>Sr. No.</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Key Activities</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Duration</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Pre-requisite</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Slack</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Planned Start</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Planned Finish</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Activity Status</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Actual Start</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Actual Finish</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Actual Duration</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Remarks</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Expected Start</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Expected Finish</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {module.activities.map((activity, rowIndex) => (
                    <TableRow
                      key={rowIndex}
                      style={{
                        backgroundColor: rowIndex % 2 === 0 ? "#f7f7f7" : "#ffffff",
                      }}
                    >
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
                                handleChange("SrNo", e.target.value)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={editData.slack}
                              onChange={(e) =>
                                handleChange("keyActivity", e.target.value)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={editData.plannedStart}
                              onChange={(e) =>
                                handleChange("duration", e.target.value)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={editData.plannedFinish}
                              onChange={(e) =>
                                handleChange("SrNo", e.target.value)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={editData.activityStatus}
                              onChange={(e) =>
                                handleChange("keyActivity", e.target.value)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={editData.actualStart}
                              onChange={(e) =>
                                handleChange("SrNo", e.target.value)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={editData.actualFinish}
                              onChange={(e) =>
                                handleChange("keyActivity", e.target.value)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={editData.actualDuration}
                              onChange={(e) =>
                                handleChange("duration", e.target.value)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={editData.remarks}
                              onChange={(e) =>
                                handleChange("duration", e.target.value)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={editData.expectedStart}
                              onChange={(e) =>
                                handleChange("duration", e.target.value)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={editData.expectedFinish}
                              onChange={(e) =>
                                handleChange("duration", e.target.value)
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
                              style={{color:"green"}}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDelete(moduleIndex, rowIndex)}
                              style={{color:"red"}}
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
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default ModuleBuilder;
