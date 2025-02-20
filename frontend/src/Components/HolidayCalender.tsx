import { useEffect, useState } from "react";
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
import { Button, DatePicker, Input, message, Modal, Select, Tooltip } from "antd";
import { SaveOutlined, DeleteOutlined, EditOutlined } from "@mui/icons-material";
import dayjs from "dayjs";
const moduleOptions = [
  "Land Acquisition",
  "Forest Clearance",
  "Budget Planning",
];

export const HolidayCalender = () => {
  const [rows, setRows] = useState([
    {
      from: null, to: null, holiday: "", module: [], impact: {}, editing: true
    },
  ]);
  const [, setBaseMonth] = useState(new Date());
  const tableHeaders = ["From Date", "To Date", "Holiday", "Modules", "Impact", "Actions"];
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const holidayDates = rows.filter((row: any) => !row.editing && row.from && row.to)
    .flatMap((row: any) => {
      const start: any = new Date(row.from);
      const end: any = new Date(row.to);
      const dates = [];
      let current = start;
      while (current <= end) {
        dates.push(format(current, 'yyyy-MM-dd'));
        current = addDays(current, 1);
      }
      return dates;
    });

  useEffect(() => {
    const storedData = localStorage.getItem("holidayCalendarData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        const updatedRows = parsedData.map((row: any) => ({
          ...row,
          from: row.from ? dayjs(row.from) : null,
          to: row.to ? dayjs(row.to) : null,
        }));

        setRows(updatedRows);
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    }
  }, []);


  const handleLowerCalendarNavigation = (activeStartDate: any) => {
    setBaseMonth(addMonths(activeStartDate, -1));
  };

  const handleUpperCalendarNavigation = (activeStartDate: any) => {
    setBaseMonth(activeStartDate);
  };

  const handleInputChange = (index: any, field: any, value: any) => {
    const updatedRows: any = [...rows];
    updatedRows[index][field] = value;

    if (field === "module") {
      const moduleCount = value.length;
      const impact: any = {};
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
    const updatedRows: any = [...rows];
    updatedRows[index].impact[module] = value;
    setRows(updatedRows);
  };

  const toggleEdit = (index: any) => {
    const updatedRows = [...rows];
    updatedRows[index].editing = !updatedRows[index].editing;
    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([
      ...rows,
      { from: null, to: null, holiday: "", module: [], impact: {}, editing: true },
    ]);
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

  const showDeleteModal = (index: number) => {
    setDeleteIndex(index);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteIndex !== null) {
      deleteRow(deleteIndex);
    }
    setDeleteModalVisible(false);
    setDeleteIndex(null);
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
    setDeleteIndex(null);
  };

  const deleteRow = (index: number) => {
    setRows((prevRows) => prevRows.filter((_, i) => i !== index));
  };

  const saveChanges = (index: number) => {
    const row = rows[index];
    if (!row.from || !row.to || !row.holiday.trim() || row.module.length === 0) {
      message.error("Please fill all required fields before saving.");
      return;
    }

    const storedData = localStorage.getItem("holidayCalendarData");
    let existingData = storedData ? JSON.parse(storedData) : [];

    const updatedRows = [...rows];
    updatedRows[index].editing = false;

    const existingIndex = existingData.findIndex(
      (item: any) => item.holiday === row.holiday && item.from === row.from && item.to === row.to
    );

    if (existingIndex !== -1) {
      existingData[existingIndex] = row;
    } else {
      existingData.push(row);
    }

    setRows(updatedRows);
    localStorage.setItem("holidayCalendarData", JSON.stringify(existingData));
  };

  const [showCalendar, setShowCalendar] = useState(true);

  const toggleCalendar = () => {
    setShowCalendar((prev) => !prev);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper className="main-container-div" elevation={0}>
        <Box className="left-part">
          <Box className="card-header-items">
            <div className="holiday-page-heading">
              Holiday Calendar
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <Button
                className="aad-btn bg-secondary"
                onClick={addRow}
                style={{ padding: "0px 10px" }}
              >
                Add New Row
              </Button>
              <Button
                className="toggle-calendar-btn bg-tertiary"
                onClick={toggleCalendar}
                color="primary"
              >
                {showCalendar ? "Hide Calendar" : "Show Calendar"}
              </Button>
            </div>

          </Box>

          <TableContainer className="table-items">
            <Table stickyHeader>
              <TableHead
                className="bg-secondary"
                sx={{
                  position: "sticky",
                  top: 0,
                  zIndex: 2,
                  backgroundColor: "#257180",
                }}
              >
                <TableRow className="table-header">
                  {tableHeaders.map((header) => (
                    <TableCell
                      key={header}
                      className="table-cell"
                      sx={{
                        backgroundColor: "#257180",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {header}
                    </TableCell>
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
                        disabledDate={(current: any) =>
                          current
                            ? current.isBefore(dayjs().startOf("day")) || (row.to && current.isAfter(dayjs(row.to)))
                            : false
                        }
                      />
                    </TableCell>

                    <TableCell style={{ textAlign: "center" }}>
                      <DatePicker
                        value={row.to}
                        onChange={(date) => handleInputChange(index, "to", date)}
                        disabled={!row.editing}
                        style={{ width: "100%" }}
                        disabledDate={(current: any) =>
                          current
                            ? current.isBefore(dayjs().startOf("day")) || (row.from && current.isBefore(dayjs(row.from)))
                            : false
                        }
                      />
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
                          style={{ width: "150px" }}
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
                      <Box sx={{ display: "flex", gap: "5px", flexWrap: "wrap", flexDirection: "column", justifyContent: "center" }}>
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

                    <TableCell style={{ textAlign: "center", display: "flex", gap: "20px", justifyContent: "space-between", borderBottom: "0px" }}>
                      {row.editing ? (
                        <>
                          <Tooltip title="Delete">
                            <Tooltip title="Delete">
                              <Button
                                type="primary"
                                danger
                                shape="circle"
                                icon={<DeleteOutlined />}
                                onClick={() => showDeleteModal(index)}
                              />
                            </Tooltip>

                          </Tooltip>
                          <Tooltip title="Save">
                            <Button
                              type="primary"
                              shape="circle"
                              icon={<SaveOutlined />}
                              onClick={() => saveChanges(index)}
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

        {showCalendar && (
          <Box
            className="right-part"
            style={{
              width: "35%",
              padding: "10px",
              borderRadius: "5px",
              display: "grid",
              gridTemplateColumns: "repeat(1, 1fr)",
              gap: "10px",
            }}
          >
            {Array.from({ length: 12 }).map((_, monthIndex) => {
              const monthDate = dayjs().month(monthIndex).startOf("month").toDate();

              return (
                <Calendar
                  key={monthIndex}
                  value={monthDate}
                  activeStartDate={monthDate}
                  onActiveStartDateChange={({ activeStartDate }) =>
                    handleUpperCalendarNavigation
                      ? handleUpperCalendarNavigation(activeStartDate)
                      : handleLowerCalendarNavigation(activeStartDate)
                  }
                  view="month"
                  tileContent={calendarTileContent}
                />
              );
            })}
          </Box>
        )}
        <Modal
          title="Confirm Deletion"
          visible={isDeleteModalVisible}
          onOk={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          okText="Delete"
          okType="danger"
          cancelText="Cancel"
        >
          <p>Are you sure you want to delete this row?</p>
        </Modal>

      </Paper>
    </LocalizationProvider>
  );
};