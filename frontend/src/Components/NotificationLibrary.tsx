import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

const data = [
  {
    module: "Contract Formulation",
    activities: [
      { name: "Declaration as H1 Bidder", notification: "TRUE", status: "Completed", message: "This is my message" },
      { name: "Signing of CBDPA", notification: "FALSE", status: "", message: "" },
      { name: "Payment to MoC (Fixed Charges, Upfront payment & PBG)", notification: "TRUE", status: "", message: "" },
      { name: "Issuance of Vesting Order", notification: "", status: "InProgress", message: "" },
    ],
  },
  {
    module: "Budgetary Planning",
    activities: [
      { name: "Approval of Interim Budget", notification: "TRUE", status: "", message: "" },
      { name: "Preparation of DPR", notification: "", status: "", message: "" },
      { name: "Approval of DPR", notification: "TRUE", status: "Delayed", message: "", defaultmessage: "This is new message" },
    ],
  },
  {
    module: "Boundary Coordinate Certification by CMPDI",
    activities: [
      { name: "Survey by CMPDI to ascertain boundary coordinates", notification: "TRUE", status: "Completed", message: "" },
      { name: "Receipt of Certified Boundary Coordinates by CMPDI", notification: "FALSE", status: "", message: "" },
    ],
  },
];

const NotificationLibrary = () => {
  const navigate = useNavigate();

  const handleEditHeader = () => {
    navigate("/createnotification");
  };

  const handleDeleteHeader = () => {
    alert("Delete button clicked on header");
  };

  return (
    <TableContainer component={Paper} style={{ margin: "20px auto", maxWidth: "90%" }}>
      <Typography variant="h5" style={{ margin: "16px", fontWeight: "bold", color: "#4A148C" }}>
        Notification Library
      </Typography>
      {data.map((section) => (
        <Accordion key={section.module} style={{ marginBottom: "10px" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} style={{ backgroundColor: "#E1BEE7" }}>
            <Typography variant="h6" style={{ fontWeight: "bold" }}>
              {section.module}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "#F3E5F5" }}>
                  <TableCell style={{ fontWeight: "bold" }}>Activity</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Notification Set-up</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Notification Message</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Default Message</TableCell>
                  <TableCell style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <IconButton onClick={handleEditHeader} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={handleDeleteHeader} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {section.activities.map((activity, index) => (
                  <TableRow key={index}>
                    <TableCell>{activity.name}</TableCell>
                    <TableCell>{activity.notification}</TableCell>
                    <TableCell>{activity.status}</TableCell>
                    <TableCell>{activity.message}</TableCell>
                    <TableCell>{activity.defaultmessage}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
      ))}
    </TableContainer>
  );
};

export default NotificationLibrary;
