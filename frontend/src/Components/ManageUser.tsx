import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getModules } from '../Utils/moduleStorage';
import { Archive } from "@mui/icons-material";
import AssignmentIcon from '@mui/icons-material/Assignment';
import NotificationsIcon from '@mui/icons-material/Notifications';



const ManageUser = () => {
  const navigate = useNavigate();
  const [openRACIModal, setOpenRACIModal] = useState(false);
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [isRACIValid, setIsRACIValid] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    whatsapp: true,
    text: true,
  });
  const [selectedUserFor, setSelectedUserFor] = React.useState({
    raci: {
      CF: { responsible: false, accountable: false, consulted: false, informed: false },
      BP: { responsible: false, accountable: false, consulted: false, informed: false },
      BC: { responsible: false, accountable: false, consulted: false, informed: false },
      DG: { responsible: false, accountable: false, consulted: false, informed: false },
      GR: { responsible: false, accountable: false, consulted: false, informed: false },
      MP: { responsible: false, accountable: false, consulted: false, informed: false },
      FC: { responsible: false, accountable: false, consulted: false, informed: false },
    },
  });
  const [modules, setModules] = useState([{}]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      company: "ABC Corp",
      project: "Project Alpha",
      mobile: "1234567890",
      email: "john@example.com",
      whatsapp: "1234567890",
      profilePhoto: "https://via.placeholder.com/120"
    },
    {
      id: 2,
      name: "Jane Doe",
      company: "XYZ Inc",
      project: "Project Beta",
      mobile: "0987654321",
      email: "jane@example.com",
      whatsapp: "0987654321",
      profilePhoto: "https://via.placeholder.com/120"
    },
  ]);

  useEffect(() => {
    const savedModules = getModules();
    setModules(savedModules);
  }, []);

  const handleViewUser = (user: any) => {
    // Navigate to the 'View User' page with the user details passed as state
    navigate(`/view-user`, { state: { user: selectedUser } });
  };
  const handleCloseModal = () => {
    setOpenRACIModal(false);
    setOpenAlertModal(false); // Close both modals
  };
  const handleToggle = (event: any) => {
    setNotificationSettings({
      ...notificationSettings,
      [event.target.name]: event.target.checked,
    });
  };

  const handleOpenRACIModal = (user: any) => {
    setSelectedUser(user);
    setOpenRACIModal(true); // Open the RACI modal when the button is clicked
  };



  const handleEditUser = () => {
    if (selectedUser) {
      navigate("/EmployeeRegistration", { state: { user: selectedUser, isEdit: true } });
    }
  };

  // const handleDeleteUser = () => {
  //   if (selectedUser && window.confirm("Are you sure you want to delete this user?")) {
  //     setUsers((prevUsers) => prevUsers.filter((user) => user.id !== selectedUser.id));
  //     setSelectedUser(null); // Reset selected user
  //   }
  // };
  const handleArchiveUser = () => {
    if (selectedUser && window.confirm("Are you sure you want to archive this user?")) {
      // Logic to archive the user
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id ? { ...user, archived: true } : user
        )
      );
      setSelectedUser(null); // Reset selected user
    }
  };
  const handleRowClick = (user) => {
    // console.log("Selected User:", selectedUser);
    setSelectedUser(user);
  };

  return (
    <div style={styles.pageContainer}>
      <AppBar position="static">
        <Toolbar style={{ backgroundColor: "#607d8b" }}>
          <Typography variant="h5" style={{ flexGrow: 1 ,color:'black'}}>
            Tool Bar
          </Typography>
          <Tooltip title="View">
          <IconButton style={{ color: "white" }} onClick={handleViewUser} disabled={!selectedUser}>
              <Visibility />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
          <IconButton style={{ color: "white" }} onClick={handleEditUser} disabled={!selectedUser}>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Archive">
    <IconButton
      style={{ color: "white" }}
      onClick={handleArchiveUser}
      disabled={!selectedUser}
    >
      <Archive /> {/* Use the Archive icon */}
    </IconButton>
  </Tooltip>
  <IconButton
          // variant="contained"
          onClick={handleOpenRACIModal}
          style={styles.actionButton}
        >
          <AssignmentIcon />
        </IconButton>
          <IconButton
            // variant="contained"
            onClick={() => setOpenAlertModal(true)}
            style={styles.actionButton}
          >
             <NotificationsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <TableContainer component={Paper} style={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow style={styles.tableHeader}>
              <TableCell style={styles.headerCell}>S.No</TableCell>
              <TableCell style={styles.headerCell}>Name</TableCell>
              <TableCell style={styles.headerCell}>Company</TableCell>
              <TableCell style={styles.headerCell}>Project</TableCell>
              <TableCell style={styles.headerCell}>Mobile</TableCell>
              <TableCell style={styles.headerCell}>Email</TableCell>
              <TableCell style={styles.headerCell}>WhatsApp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow
                key={user.id}
                style={{
                  backgroundColor: selectedUser?.id === user.id ? "#f0f0f0" : "inherit",
                  cursor: "pointer",
                }}
                onClick={() => handleRowClick(user)}
              >
                
                <TableCell style={styles.tableCell}>{index + 1}</TableCell>
                <TableCell style={styles.tableCell}>{user.name}</TableCell>
                <TableCell style={styles.tableCell}>{user.company}</TableCell>
                <TableCell style={styles.tableCell}>{user.project}</TableCell>
                <TableCell style={styles.tableCell}>{user.mobile}</TableCell>
                <TableCell style={styles.tableCell}>{user.email}</TableCell>
                <TableCell style={styles.tableCell}>{user.whatsapp}</TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>

      {/* Add your Dialogs here as you did before */} {/* Dialog Content */}
      <Dialog
        open={openAlertModal}
        onClose={handleCloseModal}
        PaperProps={{
          style: {
            position: "absolute",
            // top: document
            //   ?.getElementById("alertNotificationButton")
            //   ?.getBoundingClientRect()?.bottom + 10 || "10%",
            // left: document
            //   ?.getElementById("alertNotificationButton")
            //   ?.getBoundingClientRect()?.left || "10%",
            marginRight: 0,
            width: "300px",
            borderRadius: "8px",
            padding: "10px",
            overflow: "visible",
            top: "212.5px",
            left: "1510.63px"
          },
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -10, // Adjust position above the dialog
            right: 20, // Position the arrow towards the right
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent", // Make the left side transparent
            borderRight: "10px solid transparent", // Make the right side transparent
            borderBottom: "10px solid white", // Match with the dialog background color
            zIndex: 1,
          }}
        ></div>


        {/* Dialog Content */}
        <DialogTitle>Notification Preferences</DialogTitle>
        <DialogContent>
          <div>
            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.email}
                  onChange={handleToggle}
                  name="email"
                />
              }
              label="Email"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.whatsapp}
                  onChange={handleToggle}
                  name="whatsapp"
                />
              }
              label="WhatsApp"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.text}
                  onChange={handleToggle}
                  name="text"
                />
              }
              label="Text"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} style={{ backgroundColor:'#4A90E2' ,color:'black',}}>
            Close
          </Button>
        </DialogActions>
      </Dialog>



      {/* Modal for RACI */}
      <Dialog
        open={openRACIModal}
        onClose={handleCloseModal}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          style: { borderRadius: 10, overflow: "hidden" },
        }}
      >
        <DialogTitle style={{ backgroundColor: "#1976d2", color: "#fff" }}>
          RACI Module Assignments
        </DialogTitle>
        <DialogContent style={{ padding: "24px", backgroundColor: "#f9f9f9" }}>
          {selectedUser && (
            <div>
              {/* <h4 style={styles.sectionHeader}>Module Assignments</h4> */}
              <div style={styles.tableContainer}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={styles.tableHeader}>
                    <tr>
                      {/* <th style={{ ...styles.headerCell, padding: "12px" }}>Code</th>
                      <th style={{ ...styles.headerCell, padding: "12px" }}>Module</th> */}
                      <th style={{ ...styles.headerCell, padding: "12px" }}>Responsible</th>
                      <th style={{ ...styles.headerCell, padding: "12px" }}>Accountable</th>
                      <th style={{ ...styles.headerCell, padding: "12px" }}>Consulted</th>
                      <th style={{ ...styles.headerCell, padding: "12px" }}>Informed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modules.map((module) => (
                      <tr key={module.parentModuleCode}>
                        {/* <td style={styles.tableCell}>{module.parentModuleCode}</td>
                        <td style={styles.tableCell}>{module.moduleName}</td> */}
                        <td style={styles.tableCell}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={
                                  selectedUserFor?.raci?.[module.parentModuleCode]?.responsible || false
                                }
                                onChange={(e) =>
                                  handleRACIChange(e, module.parentModuleCode, "responsible")
                                }
                              />
                            }
                            label="Responsible"
                          />
                        </td>
                        <td style={styles.tableCell}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={
                                  selectedUserFor?.raci?.[module.parentModuleCode]?.accountable || false
                                }
                                onChange={(e) =>
                                  handleRACIChange(e, module.parentModuleCode, "accountable")
                                }
                              />
                            }
                            label="Accountable"
                          />
                        </td>
                        <td style={styles.tableCell}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={
                                  selectedUser?.raci?.[module.parentModuleCode]?.consulted || false
                                }
                                onChange={(e) =>
                                  handleRACIChange(e, module.parentModuleCode, "consulted")
                                }
                              />
                            }
                            label="Consulted"
                          />
                        </td>
                        <td style={styles.tableCell}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={
                                  selectedUser?.raci?.[module.parentModuleCode]?.informed || false
                                }
                                onChange={(e) =>
                                  handleRACIChange(e, module.parentModuleCode, "informed")
                                }
                              />
                            }
                            label="Informed"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions style={{ padding: "16px", backgroundColor: "#f9f9f9" }}>
          <Button onClick={handleCloseModal} style={{ backgroundColor:'#4A90E2' ,color:'black',}} variant="outlined">
            Close
          </Button>
          <Button
            onClick={handleCloseModal}
            style={{ backgroundColor:'#4A90E2' ,color:'black',}}
            variant="contained"
            disabled={!isRACIValid}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

const styles = {
  pageContainer: {
    width: "100%", // Decreased width to 90% of the screen width
    maxWidth: "1200px", // Max width set to 1200px
    margin: "0", // Centers the page content
    padding: "20px", // Optional padding to ensure content doesn't touch edges
  },
  tableContainer: {
    width: "100%",
    marginTop: "20px",
  },
  tableHeader: {
    backgroundColor: "#4F7942",
    textAlign: "center",
    color: "white",
  },
  headerCell: {
    fontWeight: "bold",
    padding: "10px",
    textAlign: "center",
    color: "white",
  },
  tableCell: {
    padding: "20px",
    textAlign: "center",
  },
  actionButton: {
    margin: "0 10px",
    // backgroundColor: "#1976d2",
    color: "white",
  },
  sectionHeader: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "15px",
  },
};



export default ManageUser;
