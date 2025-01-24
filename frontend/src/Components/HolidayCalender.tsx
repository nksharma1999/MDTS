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
  Chip,
  OutlinedInput,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const moduleOptions = [
  "Land Acquisition",
  "Forest Clearance",
  "Budget Planning",
  
];

export const HolidayCalender = () => {
  const [rows, setRows] = useState([
    { from: null, to: null, holiday: "", module: [], impact: {}, editing: true },
  ]);

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;

    if (field === "module") {
      const moduleCount = value.length;
      const impact = {};
      if (moduleCount > 0) {
        const dividedImpact = (100 / moduleCount).toFixed(2);
        value.forEach((module) => {
          impact[module] = dividedImpact; // Default impact percentage
        });
      }
      updatedRows[index].impact = impact;
    }

    setRows(updatedRows);
  };

  const handleImpactChange = (index, module, value) => {
    const updatedRows = [...rows];
    updatedRows[index].impact[module] = value;
    setRows(updatedRows);
  };

  const toggleEdit = (index) => {
    const updatedRows = [...rows];
    updatedRows[index].editing = !updatedRows[index].editing;
    setRows(updatedRows);
  };

  const saveChanges = (index) => {
    const updatedRows = [...rows];
    updatedRows[index].editing = false;
    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([
      ...rows,
      { from: null, to: null, holiday: "", module: [], impact: {}, editing: true },
    ]);
  };

  const deleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper
        elevation={3}
        sx={{
          margin: "10px",
          maxWidth: "80%",
          padding: "20px",
          // backgroundColor: "#F1F8E9",
          borderRadius: "8px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Holiday Calendar
          </Typography>
          <Button
            variant="contained"
            style={{ backgroundColor:'#4A90E2' ,color:'black'}}
            startIcon={<AddIcon />}
            onClick={addRow}
          >
            Add New Row
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#4F7942" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>From</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>To</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Holiday</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Modules</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Impact</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ textAlign: "center" }}>
                    <DatePicker
                      value={row.from}
                      onChange={(newValue) => handleInputChange(index, "from", newValue)}
                      renderInput={(params) => (
                        <TextField {...params} size="small" disabled={!row.editing} />
                      )}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <DatePicker
                      value={row.to}
                      onChange={(newValue) => handleInputChange(index, "to", newValue)}
                      renderInput={(params) => (
                        <TextField {...params} size="small" disabled={!row.editing} />
                      )}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <TextField
                      value={row.holiday}
                      onChange={(e) => handleInputChange(index, "holiday", e.target.value)}
                      size="small"
                      disabled={!row.editing}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {row.editing ? (
                     <Select
                     multiple
                     value={row.module}
                     onChange={(e) => handleInputChange(index, "module", e.target.value)}
                     input={<OutlinedInput />}
                     renderValue={(selected) => (
                       <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                         {selected.map((value) => (
                           <Chip key={value} label={value} />
                         ))}
                       </Box>
                     )}
                     size="small"
                     fullWidth
                   >
                     {moduleOptions.map((module) => (
                       <MenuItem key={module} value={module}>
                         {module}
                       </MenuItem>
                     ))}
                   </Select>
                   
                    ) : (
                      <Box>
                        {row.module.map((module) => (
                          <Typography key={module} variant="body2">
                            {module}
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Box>
                      {Object.entries(row.impact).map(([module, impact]) => (
                        <Box key={module} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          {/* <Typography variant="body2">{module}:</Typography> */}
                          {row.editing ? (
                            <TextField
                              value={impact}
                              onChange={(e) =>
                                handleImpactChange(index, module, e.target.value)
                              }
                              size="small"
                              sx={{ width: "60px" }}
                            />
                          ) : (
                            <Typography variant="body2">{impact}%</Typography>
                          )}
                        </Box>
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {row.editing ? (
                      <>
                        <IconButton
                          color="primary"
                          title="save"
                          onClick={() => saveChanges(index)}
                        >
                          <SaveIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          title="delete"
                          onClick={() => deleteRow(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    ) : (
                      <IconButton
                        color="primary"
                        title="edit"
                        onClick={() => toggleEdit(index)}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
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
