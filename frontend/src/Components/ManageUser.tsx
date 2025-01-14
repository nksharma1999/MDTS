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
  RadioGroup,
  FormControl,
  FormLabel,
  Radio,
} from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  getModules
} from '../Utils/moduleStorage';

const ManageUser = () => {
  const navigate = useNavigate();
  const [openRACIModal, setOpenRACIModal] = useState(false);  // Separate state for RACI modal
  const [openAlertModal, setOpenAlertModal] = useState(false);  // Separate state for Alert modal
  const [isRACIValid, setIsRACIValid] = useState(false);
  const alertButtonRef = useRef(null);
  const [dialogPosition, setDialogPosition] = useState({ top: 0, left: 0 });
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    whatsapp: true,
    mobile: true,
  });

  const [selectedUser, setSelectedUser] = React.useState({
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

  useEffect(() => {
    // Retrieve the mine types from localStorage using the updated function
    const savedModules = getModules(); // No need for JSON.parse() here, it's already handled
    setModules(savedModules);
    console.log("Module : ", savedModules);
  }, []);

  //Hard coded to be removed
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      company: "ABC Corp",
      project: "Project Alpha",
      mobile: "1234567890",
      email: "john@example.com",
      whatsapp: "1234567890",
    },
    {
      id: 2,
      name: "Jane Doe",
      company: "XYZ Inc",
      project: "Project Beta",
      mobile: "0987654321",
      email: "jane@example.com",
      whatsapp: "0987654321",
    },
  ]);

  // const handleRACIChange = (event:any) => {
  //   // Update the RACI value for the selected user
  //   setUsers((prevUsers) =>
  //     prevUsers.map((user) =>
  //       user.id === selectedUser.id
  //         ? { ...user, raci: event.target.value }
  //         : usergetOrderedModuleNames
  //     )
  //   );
  // };


  const handleOpenRACIModal = (user: any) => {
    setSelectedUser(user);
    setOpenRACIModal(true); // Open the RACI modal when the button is clicked
  };

  const handleOpenAlertModal = () => {
    if (alertButtonRef.current) {
      const rect = alertButtonRef.current.getBoundingClientRect(); // Get button's position
      setDialogPosition({
        top: rect.bottom + window.scrollY + 10, // Below the button
        left: rect.left + rect.width / 2 - 150, // Centered horizontally (adjust based on dialog width)
      });
    }
    setOpenAlertModal(true);
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

  const handleViewUser = (user: any) => {
    // Navigate to the 'View User' page with the user details passed as state
    navigate(`/view-user`, { state: { user } });
  };

  const handleEditUser = (user) => {
    navigate("/EmployeeRegistration", { state: { user, isEdit: true } });
  };

  const handleDeleteUser = (userId: any) => {
    // Confirm deletion
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      console.log("Deleted user with ID:", userId);
    }
  };

  // Function to handle RACI changes
  const handleRACIChange = (event, code, type) => {
    setSelectedUser((prevState) => {
      // Ensure `prevState.raci` exists before attempting to update it
      const updatedRaci = {
        ...prevState.raci,
        [code]: {

          ...prevState.raci?.[code], // Safely access the specific code object
          [type]: event.target.checked, // Update the specific RACI type
        },
      };

      return {
        ...prevState,
        raci: updatedRaci, // Update the RACI property in the state
      };
    });
  };


  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.header}>Manage User</h1>
      <div style={styles.buttonContainer}>
        <Button
          variant="contained"
          onClick={handleOpenRACIModal}
          style={styles.actionButton}
        >
          Assign RACI
        </Button>
        <Button
          id="alertNotificationButton" 
          variant="contained"
          onClick={handleOpenAlertModal}
          style={styles.actionButton}
        >
          Alert & Notification
        </Button>
      </div>
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
              <TableCell style={styles.headerCell}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user.id} style={styles.tableRow}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.company}</TableCell>
                <TableCell>{user.project}</TableCell>
                <TableCell>{user.mobile}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.whatsapp}</TableCell>
                <TableCell>
                  <Tooltip title="View">
                    <IconButton color="primary" onClick={() => handleViewUser(user)}>
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton style={{ color: "#4CAF50" }} onClick={() => handleEditUser(user)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDeleteUser(user.id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
                  checked={notificationSettings.mobile}
                  onChange={handleToggle}
                  name="mobile"
                />
              }
              label="Mobile"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
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
              <h4 style={styles.sectionHeader}>Module Assignments</h4>
              <div style={styles.tableContainer}>
                <table style={{ width: "100%", borderCollapse: "collapse"}}>
                  <thead style={styles.tableHeader}>
                    <tr>
                      <th style={{ ...styles.headerCell, padding: "12px" }}>Code</th>
                      <th style={{ ...styles.headerCell, padding: "12px" }}>Module</th>
                      <th style={{ ...styles.headerCell, padding: "12px" }}>Responsible</th>
                      <th style={{ ...styles.headerCell, padding: "12px" }}>Accountable</th>
                      <th style={{ ...styles.headerCell, padding: "12px" }}>Consulted</th>
                      <th style={{ ...styles.headerCell, padding: "12px" }}>Informed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modules.map((module) => (
                      <tr key={module.parentModuleCode}>
                        <td style={styles.tableCell}>{module.parentModuleCode}</td>
                        <td style={styles.tableCell}>{module.moduleName}</td>
                        <td style={styles.tableCell}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={
                                  selectedUser?.raci?.[module.parentModuleCode]?.responsible || false
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
                                  selectedUser?.raci?.[module.parentModuleCode]?.accountable || false
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
          <Button onClick={handleCloseModal} color="primary" variant="outlined">
            Close
          </Button>
          <Button
            onClick={handleCloseModal}
            color="primary"
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

export default ManageUser;

const styles = {
  sectionHeader: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "16px",
    color: "#333",
  },
  tableContainer: {
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    maxHeight: "800px", // Set a max height for the scrollable table
        overflow: "auto",
  },
  tableHeader: {
    backgroundColor: "#1976d2",
    position: "sticky",
    top: 0, 
    zIndex: 1000, 
  },  
  headerCell: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "left",
    borderBottom: "1px solid #e0e0e0",
  },
  tableCell: {
    padding: "12px",
    borderBottom: "1px solid #e0e0e0",
    color: "#333",
    textAlign: "center",
  },
  pageContainer: {
    padding: "22px",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
    overflowX: "auto",
  },
  header: {
    fontSize: "30px",
    textAlign: "left",
    color: "#333",
    marginBottom: "0px",
    fontWeight: "bold",
  },
  buttonContainer: {
    marginBottom: "15px",
    display: "flex",
    gap: "10px",
  },
  actionButton: {
    marginBottom: "0px",
    display: "flex",
    gap: "10px",
    left: '1480px',
  }
};
