import React, { useState } from "react";
import {
  Table,
  Box,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  IconButton,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export const HolidayCalender = () => {
  const [rows, setRows] = useState([
    { from: null, to: null, holiday: "", module: "All", impact: "100", editing: false },
  ]);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const toggleEdit = (index) => {
    const updatedRows = [...rows];
    updatedRows[index].editing = !updatedRows[index].editing;
    setRows(updatedRows);
  };

  const saveChanges = () => {
    if (selectedRow !== null) {
      toggleEdit(selectedRow);
      setSelectedRow(null); // Deselect row after saving
    }
  };

  const addRow = () => {
    setRows([
      ...rows,
      { from: null, to: null, holiday: "", module: "All", impact: "100", editing: false },
    ]);
  };

  const deleteRow = () => {
    if (selectedRow !== null) {
      const updatedRows = rows.filter((_, index) => index !== selectedRow);
      setRows(updatedRows);
      setSelectedRow(null); // Deselect row after deletion
    }
  };

  const selectRow = (index) => {
    setSelectedRow(index === selectedRow ? null : index); // Toggle selection
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper
        elevation={3}
        sx={{
          margin: "20px auto",
          maxWidth: "90%",
          padding: "20px",
          backgroundColor: "#F1F8E9",
          borderRadius: "8px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mb: 2,
            gap: 2,
          }}
        >
            <Typography variant="h5" style={{ flexGrow: 1 }}>
              Tool Bar
            </Typography>
          <Button
            variant="outlined"
            color="primary"
            disabled={selectedRow === null}
            onClick={() => toggleEdit(selectedRow)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            disabled={selectedRow === null}
            onClick={deleteRow}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={selectedRow === null || !rows[selectedRow]?.editing}
            onClick={saveChanges}
          >
            Save
          </Button>
        </Box>

        <Typography
          variant="h6"
          align="center"
          sx={{
            backgroundColor: "#4285F4",
            color: "white",
            padding: "12px",
            borderRadius: "4px",
            marginBottom: "16px",
            fontWeight: "bold",
          }}
        >
          Holiday Calendar
        </Typography>

        <TableContainer>
          <Table sx={{ border: "1px solid #ddd" }}>
            <TableHead>
            <TableRow>
  <TableCell sx={{ fontWeight: "bold", textAlign: "center", backgroundColor: "#E0F7FA" }}>
    From
  </TableCell>
  <TableCell sx={{ fontWeight: "bold", textAlign: "center", backgroundColor: "#E0F7FA" }}>
    To
  </TableCell>
  <TableCell sx={{ fontWeight: "bold", textAlign: "center", backgroundColor: "#E0F7FA" }}>
    Holiday
  </TableCell>
  <TableCell sx={{ fontWeight: "bold", textAlign: "center", backgroundColor: "#E0F7FA" }}>
    Module
  </TableCell>
  <TableCell sx={{ fontWeight: "bold", textAlign: "center", backgroundColor: "#E0F7FA" }}>
    Impact %
  </TableCell>
  <TableCell sx={{ fontWeight: "bold", textAlign: "center", backgroundColor: "#E0F7FA" }}>
    Actions
  </TableCell>
</TableRow>

            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow
                  key={index}
                  onClick={() => selectRow(index)}
                  selected={selectedRow === index}
                  sx={{ cursor: "pointer", backgroundColor: selectedRow === index ? "#f0f4c3" : "white" }}
                >
                  <TableCell sx={{ textAlign: "center" }}>
                    <DatePicker
                      value={row.from}
                      onChange={(newValue) => handleInputChange(index, "from", newValue)}
                      renderInput={(params) => (
                        <TextField {...params} size="small" sx={{ width: "150px" }} disabled={!row.editing} />
                      )}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <DatePicker
                      value={row.to}
                      onChange={(newValue) => handleInputChange(index, "to", newValue)}
                      renderInput={(params) => (
                        <TextField {...params} size="small" sx={{ width: "150px" }} disabled={!row.editing} />
                      )}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <TextField
                      value={row.holiday}
                      onChange={(e) => handleInputChange(index, "holiday", e.target.value)}
                      size="small"
                      sx={{ width: "150px" }}
                      disabled={!row.editing}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Select
                      value={row.module}
                      onChange={(e) => handleInputChange(index, "module", e.target.value)}
                      fullWidth
                      size="small"
                      sx={{ width: "200px", backgroundColor: "white" }}
                      disabled={!row.editing}
                    >
                      <MenuItem value="All">All</MenuItem>
                      <MenuItem value="Land Acquisition">Land Acquisition</MenuItem>
                      <MenuItem value="Forest Clearance">Forest Clearance</MenuItem>
                      <MenuItem value="Construction">Construction</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <TextField
                      type="number"
                      value={row.impact}
                      onChange={(e) => handleInputChange(index, "impact", e.target.value)}
                      size="small"
                      sx={{ width: "150px" }}
                      disabled={!row.editing}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={addRow}
                      sx={{ borderRadius: "50%", backgroundColor: "#e8f0fe" }}
                    >
                      <AddIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </LocalizationProvider>
  );
};

export default HolidayCalender;
