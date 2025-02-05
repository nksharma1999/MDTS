import React, { useState } from "react";
import { addMonths, format, addDays } from "date-fns";
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
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const moduleOptions = [
  "Land Acquisition",
  "Forest Clearance",
  "Budget Planning",
];

export const HolidayCalender = () => {
  const [rows, setRows] = useState([
    { from: null, to: null, holiday: "", module: [], impact: {}, editing: true },
  ]);

  const [baseMonth, setBaseMonth] = useState(new Date());

  // Calculate holiday dates for calendar marking
  const holidayDates = rows
    .filter(row => !row.editing && row.from && row.to)
    .flatMap(row => {
      const start = new Date(row.from);
      const end = new Date(row.to);
      const dates = [];
      let current = start;
      while (current <= end) {
        dates.push(format(current, 'yyyy-MM-dd'));
        current = addDays(current, 1);
      }
      return dates;
    });

  const handleLowerCalendarNavigation = (activeStartDate: any) => {
    setBaseMonth(addMonths(activeStartDate, -1));
  };

  const handleUpperCalendarNavigation = (activeStartDate: any) => {
    setBaseMonth(activeStartDate);
  };

  const nextMonth = addMonths(baseMonth, 1);

  const handleInputChange = (index: any, field: any, value: any) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;

    if (field === "module") {
      const moduleCount = value.length;
      const impact = {};
      if (moduleCount > 0) {
        const dividedImpact = (100 / moduleCount).toFixed(2);
        value.forEach((module: any) => {
          impact[module] = dividedImpact;
        });
      }
      updatedRows[index].impact = impact;
    }

    setRows(updatedRows);
  };

  const handleImpactChange = (index: any, module: any, value: any) => {
    const updatedRows = [...rows];
    updatedRows[index].impact[module] = value;
    setRows(updatedRows);
  };

  const toggleEdit = (index: any) => {
    const updatedRows = [...rows];
    updatedRows[index].editing = !updatedRows[index].editing;
    setRows(updatedRows);
  };

  const saveChanges = (index: any) => {
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

  const deleteRow = (index: any) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  // Calendar tile content for holiday markers
  const calendarTileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;
    const dateStr = format(date, 'yyyy-MM-dd');
    const isHoliday = holidayDates.includes(dateStr);
    
    return isHoliday ? (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '2px'
      }}>
        <div style={{
          backgroundColor: '#ff4d4d',
          borderRadius: '50%',
          width: '8px',
          height: '8px',
        }} />
      </div>
    ) : null;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper
        elevation={0}
        sx={{
          margin: "10px",
          padding: "0px",
          borderRadius: "8px",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "50px"
        }}
      >
        <Box sx={{ width: "80%", pr: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "20px" }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Holiday Calendar
            </Typography>
            
            <Button
              variant="contained"
              sx={{ backgroundColor: "#4A90E2", color: "black", marginBottom: "10px" }}
              startIcon={<AddIcon />}
              onClick={addRow}
            >
              Add New Row
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: "#4F7942", marginTop: "10px" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center", color: "white", fontSize: "16px" }}>From Date</TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center", color: "white", fontSize: "16px" }}>To Date</TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center", color: "white", fontSize: "16px" }}>Holiday</TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center", color: "white", fontSize: "16px" }}>Modules</TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center", color: "white", fontSize: "16px" }}>Impact</TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center", color: "white", fontSize: "16px" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ textAlign: "center" }}>
                      <DatePicker
                        value={row.from}
                        onChange={(newValue) => handleInputChange(index, "from", newValue)}
                        renderInput={(params) => <TextField {...params} size="small" disabled={!row.editing} />}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <DatePicker
                        value={row.to}
                        onChange={(newValue) => handleInputChange(index, "to", newValue)}
                        renderInput={(params) => <TextField {...params} size="small" disabled={!row.editing} />}
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
                            {row.editing ? (
                              <TextField
                                value={impact}
                                onChange={(e) => handleImpactChange(index, module, e.target.value)}
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
                          <IconButton color="primary" title="save" onClick={() => saveChanges(index)}>
                            <SaveIcon />
                          </IconButton>
                          <IconButton color="error" title="delete" onClick={() => deleteRow(index)}>
                            <DeleteIcon />
                          </IconButton>
                        </>
                      ) : (
                        <IconButton color="primary" title="edit" onClick={() => toggleEdit(index)}>
                          <EditIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Right: Calendars */}
        <Box
          style={{
            width: "400px",
            padding: "15px",
            backgroundColor: "#4A90E2",
            borderRadius: "8px",
            marginTop: "90px",
          }}
        >
          {/* Upper Calendar */}
          <Calendar
            value={baseMonth}
            activeStartDate={baseMonth}
            onActiveStartDateChange={({ activeStartDate }) =>
              handleUpperCalendarNavigation(activeStartDate)
            }
            view="month"
            tileContent={calendarTileContent}
          />

          {/* Lower Calendar */}
          <Box mt={3}>
            <Calendar
              value={nextMonth}
              activeStartDate={nextMonth}
              onActiveStartDateChange={({ activeStartDate }) =>
                handleLowerCalendarNavigation(activeStartDate)
              }
              view="month"
              tileContent={calendarTileContent}
            />
          </Box>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
};