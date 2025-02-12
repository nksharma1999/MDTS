import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getModules } from "../Utils/moduleStorage";
import "../styles/user-management.css";
import { Visibility, Edit, Archive, Notifications } from "@mui/icons-material";
import Assignment from "@mui/icons-material/Assignment";
import { Col, Input, Modal, Row } from "antd";
interface User {
  id: number;
  name: string;
  company: string;
  project: string;
  mobile: string;
  email: string;
  whatsapp: string;
  profilePhoto: string;
}

interface Module {
  parentModuleCode: string;
}

interface RACI {
  responsible?: boolean;
  accountable?: boolean;
  consulted?: boolean;
  informed?: boolean;
}

interface NotificationSettings {
  email: boolean;
  whatsapp: boolean;
  text: boolean;
}

interface User {
  id: number;
  name: string;
  company: string;
  project: string;
  mobile: string;
  email: string;
  whatsapp: string;
  profilePhoto: string;
}

const ManageUser: React.FC = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openAlertModal, setOpenAlertModal] = useState<boolean>(false);
  const [openRACIModal, setOpenRACIModal] = useState<boolean>(false);
  const [isRACIValid, _setIsRACIValid] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: true,
    whatsapp: true,
    text: true,
  });

  const [selectedUserFor, setSelectedUserFor] = useState<any>({
    raci: {},
  });

  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "John Doe",
      company: "ABC Corp",
      project: "Project Alpha",
      mobile: "1234567890",
      email: "john@example.com",
      whatsapp: "1234567890",
      profilePhoto: "https://via.placeholder.com/120",
    },
    {
      id: 2,
      name: "Jane Doe",
      company: "XYZ Inc",
      project: "Project Beta",
      mobile: "0987654321",
      email: "jane@example.com",
      whatsapp: "0987654321",
      profilePhoto: "https://via.placeholder.com/120",
    },
  ]);

  useEffect(() => {
    const savedModules: Module[] = getModules();
    setModules(savedModules);
  }, []);

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setOpenAlertModal(false);
    setOpenRACIModal(false);
  };

  const handleToggle = (event: ChangeEvent<HTMLInputElement>) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [event.target.name]: event.target.checked,
    }));
  };

  const handleRACIChange = (event: ChangeEvent<HTMLInputElement>, moduleCode: string, type: keyof RACI) => {
    setSelectedUserFor((prev: any) => ({
      ...prev,
      raci: {
        ...prev.raci,
        [moduleCode]: {
          ...prev.raci[moduleCode],
          [type]: event.target.checked,
        },
      },
    }));
  };

  useEffect(() => {
    const savedModules = getModules();
    setModules(savedModules || []);
  }, []);

  const handleEditUser = () => {
    if (selectedUser) {
      navigate("/employee-registration", {
        state: { user: selectedUser, isEdit: true },
      });
    }
  };

  const handleArchiveUser = () => {
    if (selectedUser && window.confirm("Are you sure you want to archive this user?")) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id ? { ...user, archived: true } : user
        )
      );
      setSelectedUser(null);
    }
  };

  const handleViewUser = () => {
    setSelectedUser(selectedUser);
    console.log(selectedUser);

    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    if (selectedUser) {
      navigate(`/view-user`, { state: { user: selectedUser } });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  function getInitials(name?: string): string {
    if (!name) return "";
    const parts = name.trim().split(/\s+/);
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : parts[0][0]?.toUpperCase() || "";
  }


  return (
    <div className="page-container">
      <div style={{ background: "none", display: "flex", justifyContent: "space-between" }} >
        <div className="holiday-page-heading" style={{ marginLeft: "10px", marginTop: "5px" }}>
          RACI, Alert & Notification
        </div>
        <Toolbar className="toolbar" style={{ paddingRight: "5px" }}>
          <Typography variant="h6" className="toolbar-title">
            Toolbar
          </Typography>

          <div className="toolbar-buttons">
            {[
              { title: "View", icon: <Visibility />, action: handleViewUser },
              { title: "Edit", icon: <Edit />, action: handleEditUser },
              { title: "Archive", icon: <Archive />, action: handleArchiveUser }
            ].map(({ title, icon, action }, index) => (
              <Tooltip key={index} title={title}>
                <IconButton
                  onClick={action}
                  disabled={!selectedUser}
                  className={`toolbar-icon ${selectedUser ? "enabled" : "disabled"}`}
                >
                  {icon}
                </IconButton>
              </Tooltip>
            ))}

            <Tooltip title="Assign RACI">
              <IconButton disabled={!selectedUser} onClick={() => setOpenRACIModal(true)} className="toolbar-icon">
                <Assignment />
              </IconButton>
            </Tooltip>

            <Tooltip title="Alerts">
              <IconButton disabled={!selectedUser} onClick={() => setOpenAlertModal(true)} className="toolbar-icon">
                <Notifications />
              </IconButton>
            </Tooltip>
          </div>
        </Toolbar>
      </div>

      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow className="table-header">
              <TableCell className="header-cell">S.No</TableCell>
              <TableCell className="header-cell">Name</TableCell>
              <TableCell className="header-cell">Company</TableCell>
              <TableCell className="header-cell">Project</TableCell>
              <TableCell className="header-cell">Mobile</TableCell>
              <TableCell className="header-cell">Email</TableCell>
              <TableCell className="header-cell">WhatsApp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow
                key={user.id}
                className={`table-row ${selectedUser?.id === user.id ? "selected-row" : ""}`}
                onClick={() => handleRowClick(user)}
              >
                <TableCell className="table-cell-item">{index + 1}</TableCell>
                <TableCell className="table-cell-item">{user.name}</TableCell>
                <TableCell className="table-cell-item">{user.company}</TableCell>
                <TableCell className="table-cell-item">{user.project}</TableCell>
                <TableCell className="table-cell-item">{user.mobile}</TableCell>
                <TableCell className="table-cell-item">{user.email}</TableCell>
                <TableCell className="table-cell-item">{user.whatsapp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openAlertModal} onClose={handleCloseModal} className="dialog-alert">
        <div className="dialog-arrow"></div>
        <DialogTitle>Notification Preferences</DialogTitle>
        <DialogContent>
          <div>
            <FormControlLabel
              control={<Switch checked={notificationSettings.email} onChange={handleToggle} name="email" />}
              label="Email"
            />
            <FormControlLabel
              control={<Switch checked={notificationSettings.whatsapp} onChange={handleToggle} name="whatsapp" />}
              label="WhatsApp"
            />
            <FormControlLabel
              control={<Switch checked={notificationSettings.text} onChange={handleToggle} name="text" />}
              label="Text"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} className="close-button">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openRACIModal} onClose={handleCloseModal} maxWidth="lg" fullWidth className="dialog-raci">
        <DialogTitle>RACI Module Assignments</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <div>
              <div className="table-container">
                <table className="raci-table">
                  <thead>
                    <tr>
                      <th>Responsible</th>
                      <th>Accountable</th>
                      <th>Consulted</th>
                      <th>Informed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modules.map((module) => (
                      <tr key={module.parentModuleCode}>
                        <td>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={selectedUserFor?.raci?.[module.parentModuleCode]?.responsible || false}
                                onChange={(e) => handleRACIChange(e, module.parentModuleCode, "responsible")}
                              />
                            }
                            label="Responsible"
                          />
                        </td>
                        <td>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={selectedUserFor?.raci?.[module.parentModuleCode]?.accountable || false}
                                onChange={(e) => handleRACIChange(e, module.parentModuleCode, "accountable")}
                              />
                            }
                            label="Accountable"
                          />
                        </td>
                        <td>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={selectedUserFor?.raci?.[module.parentModuleCode]?.consulted || false}
                                onChange={(e) => handleRACIChange(e, module.parentModuleCode, "consulted")}
                              />
                            }
                            label="Consulted"
                          />
                        </td>
                        <td>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={selectedUserFor?.raci?.[module.parentModuleCode]?.informed || false}
                                onChange={(e) => handleRACIChange(e, module.parentModuleCode, "informed")}
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
        <DialogActions>
          <Button onClick={handleCloseModal} className="close-button">
            Close
          </Button>
          <Button onClick={handleCloseModal} className="save-button" disabled={!isRACIValid}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Modal
        title=""
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        className="custom-user-modal"
        width={600}
        footer={[""]}
      >
        <div className="user-info-main">
          <div className="profile-cover bg-secondary">
            <div className="profile-item">
              <span>{getInitials(selectedUser?.name)}</span>
            </div>
          </div>
          <div className="profile-min-details">
            <p className="user-name">{selectedUser?.name}</p>
            <p className="email">{selectedUser?.email}</p>
          </div>

          <div className="user-details">
            <hr />
            <Row gutter={[16, 16]} className="form-row" align="middle">
              <Col span={6} style={{ textAlign: 'left' }}>
                <label>Full Name</label>
              </Col>
              <Col span={18}>
                <Input
                  disabled
                  style={{ marginBottom: "10px" }}
                  value={selectedUser?.name}
                />
              </Col>
            </Row>
            <Row gutter={[16, 16]} className="form-row" align="middle">
              <Col span={6} style={{ textAlign: 'left' }}>
                <label>Company</label>
              </Col>
              <Col span={18}>
                <Input
                  disabled
                  style={{ marginBottom: "10px" }}
                  value={selectedUser?.company}
                />
              </Col>
            </Row>
            <Row gutter={[16, 16]} className="form-row" align="middle">
              <Col span={6} style={{ textAlign: 'left' }}>
                <label>Project</label>
              </Col>
              <Col span={18}>
                <Input
                  disabled
                  style={{ marginBottom: "10px" }}
                  value={selectedUser?.project}
                />
              </Col>
            </Row>
            <Row gutter={[16, 16]} className="form-row" align="middle">
              <Col span={6} style={{ textAlign: 'left' }}>
                <label>Mobile</label>
              </Col>
              <Col span={18}>
                <Input
                  disabled
                  style={{ marginBottom: "10px" }}
                  value={selectedUser?.mobile}
                />
              </Col>
            </Row>
            <Row gutter={[16, 16]} className="form-row" align="middle">
              <Col span={6} style={{ textAlign: 'left' }}>
                <label>Email</label>
              </Col>
              <Col span={18}>
                <Input
                  disabled
                  style={{ marginBottom: "10px" }}
                  value={selectedUser?.email}
                />
              </Col>
            </Row>
            <Row gutter={[16, 16]} className="form-row" align="middle">
              <Col span={6} style={{ textAlign: 'left' }}>
                <label>WhatsApp</label>
              </Col>
              <Col span={18}>
                <Input
                  disabled
                  style={{ marginBottom: "10px" }}
                  value={selectedUser?.whatsapp}
                />
              </Col>
            </Row>
            <Row gutter={[16, 16]} className="form-row" align="middle">
              <Col span={6} style={{ textAlign: 'left' }}>
                <label>Registration Date</label>
              </Col>
              <Col span={18}>
                <Input
                  disabled
                  style={{ marginBottom: "10px" }}
                  value={selectedUser?.name}
                />
              </Col>
            </Row>

          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageUser;
