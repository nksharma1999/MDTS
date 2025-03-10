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
} from "@mui/material";
import { getAllUsers } from "../Utils/moduleStorage";
import { useNavigate } from "react-router-dom";
import { getModules } from "../Utils/moduleStorage";
import "../styles/user-management.css";
import { Visibility, Archive, Notifications, Edit } from "@mui/icons-material";
import Assignment from "@mui/icons-material/Assignment";
import { Col, Form, Input, List, Modal, Row, Select, Typography } from "antd";
const { Option } = Select;
const { Text } = Typography;

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
  designation?: string;
  mobile: string;
  email: string;
  whatsapp: string;
  registeredOn?: string;
  profilePhoto: string;
  password?: string;
  isTempPassword?: boolean;
  role?: string;
  assignedModules?: {
    moduleCode: string;
    moduleName: string;
    responsibilitiesOnActivities: {
      activityCode: string;
      responsibilities: string[];
    }[];
  }[];
}

interface ManageUserProps {
  options?: {
    isAddMember?: boolean;
    isToolbar?: boolean;
    title?: string;
  };
}

const ManageUser: React.FC<ManageUserProps> = ({ options }) => {
  const navigate = useNavigate();
  const [_modules, setModules] = useState<Module[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openAlertModal, setOpenAlertModal] = useState<boolean>(false);
  const [openRACIModal, setOpenRACIModal] = useState<boolean>(false);
  const [_isRACIValid, _setIsRACIValid] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: true,
    whatsapp: true,
    text: true,
  });
  const [form] = Form.useForm();
  const [selectedEmails, setSelectedEmails] = useState<any>([]);

  const [_selectedUserFor, setSelectedUserFor] = useState<any>({
    raci: {},
  });

  useEffect(() => {
    const fetchData = () => {
      const allUsers = getAllUsers();
      setUsers(allUsers);

      const uniqueModules: any = [];
      allUsers.forEach((user: User) => {
        user.assignedModules?.forEach((module) => {
          if (!uniqueModules.some((m: any) => m.parentModuleCode === module.moduleCode)) {
            uniqueModules.push({
              parentModuleCode: module.moduleCode,
              moduleName: module.moduleName,
            });
          }
        });
      });

      setModules(uniqueModules);
    };

    if (openRACIModal) {
      fetchData();
    }
  }, [openRACIModal]);

  const getRACIAssignments = (user: any, moduleCode: any) => {
    const module = user.assignedModules?.find((m: any) => m.moduleCode === moduleCode);
    if (module) {
      return {
        responsible: module.responsibilitiesOnActivities?.some((a: any) =>
          a.responsibilities.includes("Responsible")
        ),
        accountable: module.responsibilitiesOnActivities?.some((a: any) =>
          a.responsibilities.includes("Accountable")
        ),
        consulted: module.responsibilitiesOnActivities?.some((a: any) =>
          a.responsibilities.includes("Consulted")
        ),
        informed: module.responsibilitiesOnActivities?.some((a: any) =>
          a.responsibilities.includes("Informed")
        ),
      };
    }
    return {
      responsible: false,
      accountable: false,
      consulted: false,
      informed: false,
    };
  };

  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      const parsedUsers: User[] = JSON.parse(storedUsers).map((user: any) => ({
        id: user.id,
        name: user.name || "N/A",
        company: user.company || "N/A",
        designation: user.designation || "N/A",
        mobile: user.mobile || "N/A",
        email: user.email,
        whatsapp: user.whatsapp || "N/A",
        registeredOn: user.registeredOn || "",
        profilePhoto: user.profilePhoto || "https://via.placeholder.com/120",
        role: user.role || "User",
      }));
      setUsers(parsedUsers);
    }
  }, []);

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

  const invitationSuggestions = [
    { name: 'sudhindra rao', role: 'Founder & COO', email: 'sudhindra@simpro.co.in' },
    { name: 'amit tiwari', role: 'Manager-Business', email: 'amit.tiwari@simpro.co.in' }
  ];

  const handleAddEmail = (email: any) => {
    if (!selectedEmails.includes(email)) {
      setSelectedEmails([...selectedEmails, email]);
    }
  };

  const handleSendInvites = () => {
    form.validateFields().then(values => {
      console.log('Inviting:', { ...values, emails: selectedEmails });
      setAddMemberModalVisible(false);
    });
  };

  const handleClose = () => {
    setAddMemberModalVisible(false);
  };

  return (
    <div className="page-container">
      <div style={{ background: "none", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0px" }}>
        <div className="" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="holiday-page-heading" style={{ marginLeft: "10px" }}>
            {options?.title ? options.title : "RACI, Alert & Notification"}
          </div>
          {options?.isAddMember && (
            <div className="searching-and-create" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Tooltip title="Add new member">
                <Button style={{ fontSize: "14px", textTransform: "none", padding: "0px 10px" }} size="small" onClick={() => { setAddMemberModalVisible(true) }} className="add-member-button bg-secondary">
                  Add Member
                </Button>
              </Tooltip>
            </div>
          )}
        </div>
        {options?.isToolbar != false && (
          <Toolbar className="toolbar" style={{ paddingRight: "5px" }}>
            <div className="toolbar-buttons">
              {[
                { title: "View", icon: <Visibility sx={{ color: "#1976d2" }} />, action: handleViewUser },
                { title: "Edit", icon: <Edit sx={{ color: "#2e7d32" }} />, action: handleEditUser },
                { title: "Archive", icon: <Archive sx={{ color: "#ff9800" }} />, action: handleArchiveUser }
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
                <IconButton
                  disabled={!selectedUser}
                  onClick={() => setOpenRACIModal(true)}
                  className="toolbar-icon"
                >
                  <Assignment sx={{ color: "#9c27b0" }} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Alerts">
                <IconButton
                  disabled={!selectedUser}
                  onClick={() => setOpenAlertModal(true)}
                  className="toolbar-icon"
                >
                  <Notifications sx={{ color: "#d32f2f" }} />
                </IconButton>
              </Tooltip>
            </div>
          </Toolbar>
        )}
      </div>

      <hr style={{ marginTop: "5px" }} />

      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead style={{ backgroundColor: "#258790" }}>
            <TableRow className="table-header">
              <TableCell className="header-cell">S.No</TableCell>
              <TableCell className="header-cell">Name</TableCell>
              <TableCell className="header-cell">Company</TableCell>
              <TableCell className="header-cell">Designation</TableCell>
              <TableCell className="header-cell">Role</TableCell>
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
                <TableCell className="table-cell-item">{user.designation}</TableCell>
                <TableCell className="table-cell-item">{user.role}</TableCell>
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

      <Dialog open={openRACIModal} onClose={handleCloseModal} maxWidth="lg" fullWidth className="raci-dialog">
        <DialogTitle className="raci-dialog-title">RACI Module Assignments</DialogTitle>
        <DialogContent className="raci-dialog-content">
          {selectedUser && (
            <div>
              <div className="raci-table-container">
                <table className="raci-table">
                  <thead>
                    <tr>
                      <th className="raci-table-header">Module</th>
                      <th className="raci-table-header">Activity</th>
                      <th className="raci-table-header">Responsibilities</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedUser.assignedModules?.map((module) =>
                      module.responsibilitiesOnActivities.map((activity) => (
                        <tr key={`${module.moduleCode}-${activity.activityCode}`} className="raci-table-row">
                          <td className="raci-table-cell">{module.moduleName}</td>
                          <td className="raci-table-cell">{activity.activityCode}</td>
                          <td className="raci-table-cell">{activity.responsibilities.join(", ")}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions className="raci-dialog-actions">
          <Button onClick={handleCloseModal} className="raci-button raci-close-button">Close</Button>
          <Button onClick={handleCloseModal} className="raci-button raci-save-button">Save</Button>
        </DialogActions>
      </Dialog>

      <Modal
        title=""
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        className="custom-user-modal"
        width={800}
        footer={[""]}
      >
        <div className="user-info-main">
          <div className="profile-cover bg-secondary">
            <div className="profile-item">
              <span>{getInitials(selectedUser?.name)}</span>
            </div>
          </div>
          <div className="user-details">
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
                <label>Designation</label>
              </Col>
              <Col span={18}>
                <Input
                  disabled
                  style={{ marginBottom: "10px" }}
                  value={selectedUser?.designation}
                />
              </Col>
            </Row>
            <Row gutter={[16, 16]} className="form-row" align="middle">
              <Col span={6} style={{ textAlign: 'left' }}>
                <label>Role</label>
              </Col>
              <Col span={18}>
                <Input
                  disabled
                  style={{ marginBottom: "10px" }}
                  value={selectedUser?.role}
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
                  value={selectedUser?.registeredOn}
                />
              </Col>
            </Row>
          </div>
        </div>
      </Modal>

      <Modal
        visible={addMemberModalVisible}
        onCancel={handleClose}
        onOk={handleSendInvites}
        okText="Send Invites"
        okButtonProps={{ className: "bg-secondary" }}
        cancelButtonProps={{ className: "bg-tertiary" }}
        closable={false}
        width={"50%"}
        className="modal-container"
      >
        <div className="modal-body" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Text strong style={{ fontSize: "16px" }}>Invite your Team</Text>
            <Button
              size="small"
              className="bg-secondary"
              sx={{ fontSize: "0.75rem", padding: "2px 8px", minWidth: "auto", textTransform: "none" }}
              onClick={() => navigate("/employee-registration")}
            >
              Create Member Manually
            </Button>
          </div>
          <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
            <Form.Item
              name="permissionProfile"
              label="Set permission profile"
              rules={[{ required: true, message: 'Please select a permission profile!' }]}
            >
              <Select placeholder="Select...">
                <Option value="admin">Admin</Option>
                <Option value="manager">Manager</Option>
                <Option value="employee">Employee</Option>
              </Select>
            </Form.Item>

            <Form.Item name="emails" label="Add multiple email addresses">
              <Input placeholder="Enter email addresse" />
            </Form.Item>
          </Form>

          <div style={{ marginTop: 24 }}>
            <Text strong>Invitation Suggestions</Text>
            <List
              dataSource={invitationSuggestions}
              renderItem={item => (
                <List.Item
                  actions={[<Button onClick={() => handleAddEmail(item.email)}>Add</Button>]}
                >
                  <List.Item.Meta
                    title={item.name}
                    description={`${item.role} | ${item.email}`}
                  />
                </List.Item>
              )}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageUser;
