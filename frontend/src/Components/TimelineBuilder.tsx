import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  MenuItem,
  Select,
  Typography,
  Box,
} from "@mui/material";

interface DataInterface {
  id: number;
  code: string;
  name: string;
  isSelected?: boolean;
  data?: DataInterface[];
  preRequisite?: string;
  start?: string;
  isModule: boolean;
}

const data1: DataInterface[] = [
  {
    id: 1,
    code: "CF",
    name: "Contract Formulation",
    isSelected: false,
    isModule: true,
    data: [
      {
        id: 11,
        code: "CF/10",
        name: "Declaration as H1 Bidder",
        preRequisite: "",
        start: "",
        isModule: false,
      },
      {
        id: 12,
        code: "CF/20",
        name: "Signing of CBDPA",
        preRequisite: "CF/10",
        start: "",
        isModule: false,
      },
    ],
  },
  {
    id: 7,
    code: "FC",
    name: "Forest Clearance",
    isSelected: false,
    isModule: true,
    data: [
      {
        id: 14,
        code: "FC/PR",
        name: "Pre-requisite to FC Application",
        isModule: true,
        data: [
          {
            id: 141,
            code: "FC/PR/10",
            name: "Declaration as H1 Bidder",
            preRequisite: "CF/10",
            start: "",
            isModule: false,
          },
        ],
      },
    ],
  },
];

 export const TimelineBuilder = () => {
  const [datas, setDatas] = useState<DataInterface[]>(data1);
  const [showActivity, setShowActivity] = useState(false);
  const [popupData, setPopupData] = useState<DataInterface[]>([]);

  const handleCheckboxChange = (selectedVal: DataInterface) => {
    const tempActivity = selectedVal.data?.filter((item) => !item.isModule) || [];
    setPopupData(tempActivity);
    setShowActivity(tempActivity.length > 0);

    const updatedData = datas.map((item) =>
      item.code === selectedVal.code ? { ...item, isSelected: !item.isSelected } : item
    );

    setDatas(updatedData);
  };

  return (
    <Box sx={{ padding: "16px", backgroundColor: "#f4f6f8", minHeight: "100vh" ,width:"70%"}}>
      {/* Header */}
      <Box sx={{ backgroundColor: "#4F7942", padding: "16px", borderRadius: "8px", color: "white", marginBottom: "16px" }}>
        <Typography variant="h5" align="center">
          Timeline Builder
        </Typography>
      </Box>

      {/* Dropdown */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
        <Select defaultValue="" displayEmpty variant="outlined" sx={{ width: "200px" }}>
          <MenuItem value="" disabled>
            Select Project
          </MenuItem>
          <MenuItem value="testing">testing</MenuItem>
          <MenuItem value="testing1">testing1</MenuItem>
        </Select>
      </Box>

      {/* Table */}
      <Box sx={{ backgroundColor: "white", borderRadius: "8px", boxShadow: 2, padding: "16px" }}>
        {/* <Typography variant="h6" sx={{ marginBottom: "16px" }}>
          Modules
        </Typography> */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Module Code</TableCell>
              <TableCell>Module Name</TableCell>
              <TableCell align="center">Select</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datas.map((val) => (
              <TableRow key={val.id}>
                <TableCell>{val.code}</TableCell>
                <TableCell>{val.name}</TableCell>
                <TableCell align="center">
                  <Checkbox
                    checked={val.isSelected}
                    onChange={() => handleCheckboxChange(val)}
                    color="primary"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* Activity Modal */}
      <Dialog open={showActivity} onClose={() => setShowActivity(false)} fullWidth maxWidth="sm">
        <DialogTitle>Activities</DialogTitle>
        <DialogContent>
          {popupData.length > 0 ? (
            <ul>
              {popupData.map((activity) => (
                <li key={activity.id}>
                  <Typography>{activity.name}</Typography>
                </li>
              ))}
            </ul>
          ) : (
            <Typography>No activities available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowActivity(false)} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TimelineBuilder;
