import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Checkbox,
  ListItemText,
  InputAdornment,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

const UserRolesPage = ({ open, onClose }) => {
  const users = ["User 1", "User 2", "User 3", "User 4", "User 5"];

  const [responsible, setResponsible] = useState([]);
  const [accountable, setAccountable] = useState([]);
  const [consulted, setConsulted] = useState([]);
  const [informed, setInformed] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const navigate = useNavigate();

  const handleChange = (event, setRole) => {
    setRole(event.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.toLowerCase().includes(userSearch.toLowerCase())
  );
  const handleSave = () => {
    navigate("/createmodule");
    }

    const handleCancel = () => {
      navigate("/createmodule");

  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: "bold",fontSize:"20px" }}>Assign User Roles</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#4F7942", color: "white" }}>
                <TableCell sx={{ fontWeight: "bold", color: "white",fontSize:"16px" }}>
                  Role
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white",fontSize:"16px" }}>
                  Assigned Users
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                { label: "Responsible", state: responsible, setState: setResponsible ,},
                { label: "Accountable", state: accountable, setState: setAccountable },
                { label: "Consulted", state: consulted, setState: setConsulted },
                { label: "Informed", state: informed, setState: setInformed },
              ].map(({ label, state, setState }) => (
                <TableRow key={label} hover>
                  <TableCell>{label}</TableCell>
                  <TableCell>
                    <FormControl fullWidth>
                      <InputLabel>{""}</InputLabel>
                      <Select
                        multiple
                        value={state}
                        onChange={(e) => handleChange(e, setState)}
                        renderValue={(selected) => (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", flexDirection: "column" ,fontSize:"16px"}}>
                            {selected.map((value) => (
                              <Chip key={value} label={value} sx={{ fontSize: "0.8rem", height: "24px", borderRadius: "12px", padding: "0 px", width: "100px" ,fontSize:"14px"}} />
                            ))}
                          </div>
                        )}
                      >
                        <MenuItem>
                          <TextField
                            placeholder="Search users"
                            variant="standard"
                            fullWidth
                            onChange={(e) => setUserSearch(e.target.value)}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SearchIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </MenuItem>
                        {filteredUsers.map((user, index) => (
                          <MenuItem key={index} value={user}>
                            <Checkbox checked={state.indexOf(user) > -1} />
                            <ListItemText primary={user} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" sx={{ backgroundColor: "#ED9121", color: "black", fontSize: "16px" }} onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="contained" sx={{ backgroundColor: "#ED9121", color: "black", fontSize: "16px" }} onClick={handleSave} endIcon={<ArrowForwardIcon />}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserRolesPage;
