import React, { useState } from "react";
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Grid,
  Tooltip,
  IconButton,
  Box,
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";

const DocumentPage = () => {
  const [modules, setModules] = useState([
    {
      milestones: [
        {
          milestone: "Bidding",
          documents: ["CBDPA"],
        },
        {
          milestone: "GR",
          documents: ["PMT study report", "Gasiness Study report"],
        },
        {
          milestone: "Mine Plan Approval",
          documents: ["DGPS Survey Report"],
        },
        {
          milestone: "Grant of EC",
          documents: ["Draft EIA/EMP Report"],
        },
        {
          milestone: "Grant of TOR",
          documents: ["Pre feasibility report"],
        },
        {
          milestone: "CTE",
          documents: ["Grant of CTE"],
        },
        {
          milestone: "CTO",
          documents: ["Grant of CTO"],
        },
        {
          milestone: "Land Acquisition",
          documents: ["Application to CGWA"],
        },
      ],
    },
  ]);

  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState(null);
  const [isEditable, setIsEditable] = useState(false);

  const handleSelectMilestone = (index) => {
    setSelectedMilestoneIndex(index);
    setIsEditable(false); // Reset editability when a new milestone is selected
  };

  const handleAddDocument = () => {
    if (selectedMilestoneIndex === null) {
      alert("Please select a milestone first!");
      return;
    }
    const updatedModules = [...modules];
    updatedModules[0].milestones[selectedMilestoneIndex].documents.push("");
    setModules(updatedModules);
  };

  const handleEdit = () => {
    if (selectedMilestoneIndex === null) {
      alert("Please select a milestone first!");
      return;
    }
    setIsEditable(true); // Enable editing
  };

  const handleDocumentChange = (milestoneIndex, documentIndex, value) => {
    const updatedModules = [...modules];
    updatedModules[0].milestones[milestoneIndex].documents[documentIndex] = value;
    setModules(updatedModules);
  };

  const handleDeleteDocument = (milestoneIndex, documentIndex) => {
    const updatedModules = [...modules];
    updatedModules[0].milestones[milestoneIndex].documents.splice(documentIndex, 1);
    setModules(updatedModules);
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          marginBottom: "20px",
          textAlign: "center",
          color: "black",
        }}
      >
        Document Management
      </Typography>

      <Grid container justifyContent="center">
        <Grid item xs={12} md={10}>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: "10px",
              overflow: "auto",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              minHeight: "100vh",
            }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "#607d8b",
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#fff",
                    }}
                  >
                    Milestone
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#fff",
                    }}
                  >
                    Documents
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#fff",
                      textAlign: "center",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
                    >
                      <Tooltip title="Add a document ">
                        <Button
                          variant="contained"
                          color="secondary"
                          startIcon={<Add />}
                          onClick={handleAddDocument}
                          sx={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            borderRadius: "8px",
                            padding: "6px 12px",
                            textTransform: "capitalize",
                          }}
                        >
                          Add Document
                        </Button>
                      </Tooltip>

                      <Tooltip title="Edit selected milestone" arrow>
                        <IconButton
                          color="warning"
                          disabled={selectedMilestoneIndex === null}
                          onClick={handleEdit}
                        >
                          <Edit sx={{ color: "purple" }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {modules[0].milestones.map((milestone, milestoneIndex) => (
                  <React.Fragment key={milestoneIndex}>
                    <TableRow
                      onClick={() => handleSelectMilestone(milestoneIndex)}
                      sx={{
                        backgroundColor:
                          selectedMilestoneIndex === milestoneIndex
                            ? "#e0f7fa"
                            : "inherit",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "#f0f0f0",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          verticalAlign: "top",
                          fontWeight: "bold",
                          color: "#333",
                        }}
                      >
                        {milestone.milestone}
                      </TableCell>
                      <TableCell>
                        {milestone.documents.map((doc, documentIndex) => (
                          <div
                            key={documentIndex}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "10px",
                              gap: "10px",
                            }}
                          >
                            <TextField
                              value={doc}
                              onChange={(e) =>
                                handleDocumentChange(
                                  milestoneIndex,
                                  documentIndex,
                                  e.target.value
                                )
                              }
                              fullWidth
                              disabled={!isEditable} // Disable based on isEditable state
                              sx={{
                                backgroundColor: "#f9f9f9",
                                borderRadius: "5px",
                                "& .MuiInputBase-input": {
                                  fontWeight: "500",
                                },
                              }}
                              size="small"
                            />
                          </div>
                        ))}
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  );
};

export default DocumentPage;
