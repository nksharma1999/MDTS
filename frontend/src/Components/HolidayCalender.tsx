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
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/holiday.css"
import { Button, DatePicker, Input, Select, Tooltip } from "antd";
import { SaveOutlined, DeleteOutlined, EditOutlined } from "@mui/icons-material";
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
  const nextMonth = addMonths(baseMonth, 1);
  const tableHeaders = ["From Date", "To Date", "Holiday", "Modules", "Impact", "Actions"];
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
      <Paper className="main-container-div" elevation={0}>
        <Box className="left-part">
          <Box className="card-header-items">
            <div className="holiday-page-heading">
              Holiday Calendar
            </div>

            <Button
              className="aad-btn bg-secondary"
              onClick={addRow}
            >
              Add New Row
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead className="bg-secondary" sx={{ marginTop: "10px" }}>
                <TableRow className="table-header">
                  {tableHeaders.map((header) => (
                    <TableCell key={header} className="table-cell">{header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell style={{ textAlign: "center", paddingTop: "0px", paddingBottom: "0px" }}>
                      <DatePicker
                        value={row.from}
                        onChange={(date) => handleInputChange(index, "from", date)}
                        disabled={!row.editing}
                      />
                    </TableCell>

                    <TableCell sx={{ textAlign: "center", paddingTop: "0px", paddingBottom: "0px" }}>
                      <TableCell style={{ textAlign: "center" }}>
                        <DatePicker
                          value={row.to}
                          onChange={(date) => handleInputChange(index, "to", date)}
                          disabled={!row.editing}
                        />
                      </TableCell>

                    </TableCell>
                    <TableCell style={{ textAlign: "center", paddingTop: "0px", paddingBottom: "0px" }}>
                      <Input
                        value={row.holiday}
                        onChange={(e) => handleInputChange(index, "holiday", e.target.value)}
                        placeholder="Enter holiday name"
                        disabled={!row.editing}
                      />
                    </TableCell>
                    <TableCell style={{ textAlign: "center", paddingTop: "0px", paddingBottom: "0px" }}>
                      {row.editing ? (
                        <Select
                          mode="multiple"
                          value={row.module}
                          onChange={(value) => handleInputChange(index, "module", value)}
                          style={{ width: "100%" }}
                        >
                          {moduleOptions.map((module) => (
                            <Select.Option key={module} value={module}>
                              {module}
                            </Select.Option>
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

                    <TableCell sx={{ textAlign: "center", paddingTop: "0px", paddingBottom: "0px" }}>
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
                              <Typography variant="body2">{impact !== undefined && impact !== null ? `${impact}%` : 'N/A'}</Typography>
                            )}
                          </Box>
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell style={{ textAlign: "center", display: "flex", gap: "10px" }}>
                      {row.editing ? (
                        <>
                          <Tooltip title="Save">
                            <Button
                              type="primary"
                              shape="circle"
                              icon={<SaveOutlined />}
                              onClick={() => saveChanges(index)}
                            />
                          </Tooltip>
                          <Tooltip title="Delete">
                            <Button
                              type="primary"
                              danger
                              shape="circle"
                              icon={<DeleteOutlined />}
                              onClick={() => deleteRow(index)}
                            />
                          </Tooltip>
                        </>
                      ) : (
                        <Tooltip title="Edit">
                          <Button
                            type="primary"
                            shape="circle"
                            icon={<EditOutlined />}
                            onClick={() => toggleEdit(index)}
                          />
                        </Tooltip>
                      )}
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box
          className="right-part"
          style={{
            width: "500px",
            padding: "10px",
            borderRadius: "5px",
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