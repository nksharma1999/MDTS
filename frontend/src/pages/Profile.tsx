import { useEffect, useState } from "react";
import "../styles/profile.css";
import { Form, Input, Button, Row, Col, Select, DatePicker, message, Modal } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import moment from "moment";
import ManageUser from "../components/ManageUser";
import { CameraOutlined } from "@ant-design/icons";

const { Option } = Select;

const Profile = () => {

    const [formData, setFormData] = useState({
        id: "",
        name: "",
        mobile: "",
        whatsapp: "",
        registeredOn: "",
        profilePhoto: "",
        company: "",
        designation: "",
        role: "",
        email: "",
        isTempPassword: true
    });
    const [selectedTab, setSelectedTab] = useState("Profile Information");
    const [image, setImage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fillUsersData();
    }, []);

    useEffect(() => {
        if (formData.id) {
            const storedImage = formData.profilePhoto;
            if (storedImage) {
                setImage(storedImage);
            }
        }
    }, [formData.id]);

    const fillUsersData = () => {
        const userData = localStorage.getItem("user");
        if (userData) {
            const parsedData = JSON.parse(userData);
            setFormData({
                id: parsedData.id || "",
                name: parsedData.name || "",
                company: parsedData.company || "",
                designation: parsedData.designation || "",
                mobile: parsedData.mobile || "",
                email: parsedData.email || "",
                whatsapp: parsedData.whatsapp || "",
                registeredOn: parsedData.registeredOn || "",
                profilePhoto: parsedData.profilePhoto || "",
                role: parsedData.role || "",
                isTempPassword: parsedData.isTempPassword
            });
            form.resetFields();
        }

    }

    const isProfileCompleted = () => {
        return (
            formData.name &&
            formData.company &&
            formData.designation &&
            formData.mobile &&
            formData.email &&
            formData.whatsapp &&
            formData.registeredOn &&
            formData.role &&
            formData.profilePhoto
        );
    };

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value: any, name: any) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

        if (currentUser?.isTempPassword) {
            setIsModalOpen(true);
        }

        const userIndex = users.findIndex((user: any) => user.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...formData };
            localStorage.setItem("users", JSON.stringify(users));
        }
        localStorage.setItem("user", JSON.stringify(formData));
        if (!formData.isTempPassword)
            message.success("Profile information Updated successfully!");
    };

    function getInitials(name?: string): string {
        if (!name) return "";
        const parts = name.trim().split(/\s+/);
        return parts.length > 1
            ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
            : parts[0][0]?.toUpperCase() || "";
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            console.error("File upload error: No file selected");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                const base64Image = e.target.result as string;
                setImage(base64Image);
                const users = JSON.parse(localStorage.getItem("users") || "[]");
                const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
                const userIndex = users.findIndex((user: any) => user.email === currentUser.email);
                if (userIndex !== -1) {
                    users[userIndex] = {
                        ...users[userIndex],
                        profilePhoto: base64Image,
                    };
                    localStorage.setItem("users", JSON.stringify(users));
                }

                localStorage.setItem(
                    "user",
                    JSON.stringify({ ...currentUser, profilePhoto: base64Image, })
                );

                message.success("Profile photo updated successfully!");
                setIsModalOpen(false);
                setTimeout(() => {
                    fillUsersData();
                }, 1000)
            }
        };
        reader.readAsDataURL(file);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleSubmit = (values: any) => {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

        const userIndex = users.findIndex((user: any) => user.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex] = {
                ...users[userIndex],
                password: values.newPassword,
                isTempPassword: false,
            };
            localStorage.setItem("users", JSON.stringify(users));
        }

        localStorage.setItem(
            "user",
            JSON.stringify({ ...currentUser, password: values.newPassword, isTempPassword: false })
        );

        message.success(formData.isTempPassword ? "Profile updated successfully!" : "Password updated successfully!");
        setIsModalOpen(false);
        setTimeout(() => {
            fillUsersData();
        }, 1000)
    };


    const renderContent = () => {
        switch (selectedTab) {
            case "Profile Information":
                return (
                    <div style={{ marginTop: "10px" }} className="card">
                        <div className="card-body">
                            {/* <div className="profile-cover bg-secondary">
                                <div className="profile-item">
                                    <span>{getInitials(formData.name)}</span>
                                </div>
                            </div> */}
                            <div className="profile-cover bg-secondary">
                                <div className="profile-item">
                                    <div className="profile-image-container">
                                        <img src={image || "https://via.placeholder.com/100"} alt={getInitials()} className="profile-image" />
                                        <div className="overlay">
                                            <label htmlFor="file-input" className="upload-icon">
                                                <CameraOutlined className="upload-icon" />
                                            </label>
                                            <input
                                                type="file"
                                                id="file-input"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                style={{ display: 'none' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="change-password-container">
                                <a onClick={showModal}>Change Password</a>
                            </div>
                            <Form className={`eployee-professional-form ${isProfileCompleted() ? "registration-height-without-warning" : "registration-height-with-warning"}`}>
                                <Row gutter={[16, 16]} className="form-row" align="middle">
                                    <Col span={6} style={{ textAlign: "left" }}>
                                        <label>Name</label>
                                    </Col>
                                    <Col span={18}>
                                        <Input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Enter Name"
                                        />
                                    </Col>
                                </Row>

                                <Row gutter={[16, 16]} className="form-row" align="middle">
                                    <Col span={6} style={{ textAlign: 'left' }}>
                                        <label>Company</label>
                                    </Col>
                                    <Col span={18}>
                                        <Input
                                            name="company"
                                            value={formData.company}
                                            onChange={handleInputChange}
                                            placeholder="Enter Company"
                                        />
                                    </Col>
                                    {/* <Col span={18}>
                                        <Select
                                            value={formData.company}
                                            onChange={(value) => handleSelectChange(value, "company")}
                                            placeholder="Select Company"
                                            style={{ width: "100%" }}
                                        >
                                            <Option value="Mining Corp">Mining Corp</Option>
                                            <Option value="Deep Earth Industries">Deep Earth Industries</Option>
                                            <Option value="Rock Minerals Ltd">Rock Minerals Ltd</Option>
                                        </Select>
                                    </Col> */}
                                </Row>

                                <Row gutter={[16, 16]} className="form-row" align="middle">
                                    <Col span={6} style={{ textAlign: 'left' }}>
                                        <label>Designation</label>
                                    </Col>
                                    <Col span={18}>
                                        <Select
                                            value={formData.designation}
                                            onChange={(value) => handleSelectChange(value, "designation")}
                                            placeholder="Select Designation"
                                            style={{ width: "100%" }}
                                        >
                                            <Option value="Mining Engineer">Mining Engineer</Option>
                                            <Option value="Geologist">Geologist</Option>
                                            <Option value="Operations Manager">Operations Manager</Option>
                                        </Select>
                                    </Col>
                                </Row>

                                <Row gutter={[16, 16]} className="form-row" align="middle">
                                    <Col span={6} style={{ textAlign: 'left' }}>
                                        <label>Role</label>
                                    </Col>
                                    <Col span={18}>
                                        <Select
                                            value={formData.role}
                                            onChange={(value) => handleSelectChange(value, "role")}
                                            placeholder="Select Role"
                                            style={{ width: "100%" }}
                                        >
                                            <Option value="Editor">Editor</Option>
                                            <Option value="Viewer">Viewer</Option>
                                        </Select>
                                    </Col>
                                </Row>

                                <Row gutter={[16, 16]} className="form-row" align="middle">
                                    <Col span={6} style={{ textAlign: "left" }}>
                                        <label>Mobile No</label>
                                    </Col>
                                    <Col span={18}>
                                        <Input
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleInputChange}
                                            placeholder="Enter Mobile No"
                                        />
                                    </Col>
                                </Row>

                                <Row gutter={[16, 16]} className="form-row" align="middle">
                                    <Col span={6} style={{ textAlign: "left" }}>
                                        <label>Email</label>
                                    </Col>
                                    <Col span={18}>
                                        <Input
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Enter Email"
                                        />
                                    </Col>
                                </Row>

                                <Row gutter={[16, 16]} className="form-row" align="middle">
                                    <Col span={6} style={{ textAlign: "left" }}>
                                        <label>WhatsApp No</label>
                                    </Col>
                                    <Col span={18}>
                                        <Input
                                            name="whatsapp"
                                            value={formData.whatsapp}
                                            onChange={handleInputChange}
                                            placeholder="Enter WhatsApp No"
                                        />
                                    </Col>
                                </Row>

                                <Row gutter={[16, 16]} className="form-row" align="middle">
                                    <Col span={6} style={{ textAlign: "left" }}>
                                        <label>Registration Date</label>
                                    </Col>
                                    <Col span={18}>
                                        <DatePicker
                                            value={formData.registeredOn ? moment(formData.registeredOn) : null}
                                            style={{ width: "100%" }}
                                        />
                                    </Col>
                                </Row>

                                {/* <Row gutter={[16, 16]} className="form-row" align="middle">
                                    <Col span={6} style={{ textAlign: "left" }}>
                                        <label>Upload Photo</label>
                                    </Col>
                                    <Col span={18}>
                                        <Upload
                                            showUploadList={false}
                                            beforeUpload={() => false}
                                            customRequest={handlePhotoUpload}
                                            accept="image/*"
                                        >
                                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                        </Upload>
                                        {formData.profilePhoto && (
                                            <img
                                                src={formData.profilePhoto}
                                                alt="Uploaded"
                                                className="uploaded-photo"
                                                style={{ marginTop: 10, width: 100, height: 100, objectFit: 'cover', borderRadius: '50%' }}
                                            />
                                        )}
                                    </Col>
                                </Row> */}
                            </Form>
                            <hr />
                            <div className="button-group">
                                <Button
                                    className="bg-secondary save-btn"
                                    icon={<ArrowRightOutlined />}
                                    onClick={handleSave}
                                    style={{ float: "right" }}
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            case "Team Members":
                return <div className=""><ManageUser /></div>;
            case "Projects":
                return <div className="card">Projects Section</div>;
            default:
                return null;
        }
    };

    return (
        <>
            <div className="main-profile">
                <div className="sidebar-menu">
                    <div className="basic-info">
                        <div>
                            <img
                                src="../public/images/logos/user-profile.png"
                                alt="Logo"
                                className="profile-image"
                            />
                        </div>
                        <div className="details">
                            <p>{formData?.name || ""}</p>
                        </div>
                    </div>

                    {['Profile Information', 'Team Members'].map((tab) => {
                        if (tab === 'Team Members' && formData.role !== 'Editor') {
                            return null;
                        }

                        return (
                            <div
                                key={tab}
                                className={`items ${selectedTab === tab ? 'active-tab' : ''}`}
                                onClick={() => setSelectedTab(tab)}
                            >
                                {tab}
                            </div>
                        );
                    })}
                </div>

                <div style={{ marginBottom: "0px" }} className="items-details">
                    {!isProfileCompleted() && (
                        <div style={{ marginTop: "10px" }} className={`card-header progress-warning create-doc-heading ${isProfileCompleted() ? 'bg-secondary' : ""}`}>
                            <p style={{ margin: "0px", padding: "0px" }}>{isProfileCompleted() ? "Manage Profile" : "Please complete registration"}</p>
                        </div>
                    )}
                    {renderContent()}
                </div>
            </div>

            <div className="modal-container">
                <Modal
                    title={formData.name ? "Name" : "Email"}
                    open={isModalOpen}
                    onCancel={handleCancel}
                    footer={null}
                    className="modal-container"
                >
                    {/* <Form
                        requiredMark={false}
                        form={form}
                        layout="horizontal"
                        onFinish={handleSubmit}
                        style={{ padding: "10px 10px 0px 10px" }}
                        colon={false}
                    >
                        <Form.Item
                            label="Old Password"
                            name="oldPassword"
                            labelCol={{ span: 8, style: { textAlign: "left" } }} // Left-align label
                            wrapperCol={{ span: 16 }}
                            rules={[{ required: true, message: "Please enter your old password!" }]}
                        >
                            <Input.Password placeholder="Enter old password" />
                        </Form.Item>

                        <Form.Item
                            label="New Password"
                            name="newPassword"
                            labelCol={{ span: 8, style: { textAlign: "left" } }} // Left-align label
                            wrapperCol={{ span: 16 }}
                            rules={[
                                { required: true, message: "Please enter a new password!" },
                                { min: 6, message: "Password must be at least 6 characters!" }
                            ]}
                        >
                            <Input.Password placeholder="Enter new password" />
                        </Form.Item>

                        <Form.Item
                            label="Confirm New Password"
                            name="confirmNewPassword"
                            labelCol={{ span: 8, style: { textAlign: "left" } }}
                            wrapperCol={{ span: 16 }}
                            dependencies={["newPassword"]}
                            rules={[
                                { required: true, message: "Please confirm your new password!" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("newPassword") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error("Passwords do not match!"));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Confirm new password" />
                        </Form.Item>

                        <Form.Item style={{ display: "flex", justifyContent: "end" }}>
                            <Button type="primary" className="bg-secondary" htmlType="submit">
                                Save
                            </Button>
                        </Form.Item>
                    </Form> */}

                    <Form
                        requiredMark={false}
                        form={form}
                        layout="horizontal"
                        onFinish={handleSubmit}
                        style={{ padding: "10px 10px 0px 10px" }}
                        colon={false}
                    >
                        {!formData?.isTempPassword && (
                            <Form.Item
                                label="Old Password"
                                name="oldPassword"
                                labelCol={{ span: 8, style: { textAlign: "left" } }}
                                wrapperCol={{ span: 16 }}
                                rules={[{ required: true, message: "Please enter your old password!" }]}
                            >
                                <Input.Password placeholder="Enter old password" />
                            </Form.Item>
                        )}
                        {formData.isTempPassword}
                        <Form.Item
                            label="New Password"
                            name="newPassword"
                            labelCol={{ span: 8, style: { textAlign: "left" } }}
                            wrapperCol={{ span: 16 }}
                            rules={[
                                { required: true, message: "Please enter a new password!" },
                                { min: 6, message: "Password must be at least 6 characters!" }
                            ]}
                        >
                            <Input.Password placeholder="Enter new password" />
                        </Form.Item>

                        <Form.Item
                            label="Confirm New Password"
                            name="confirmNewPassword"
                            labelCol={{ span: 8, style: { textAlign: "left" } }}
                            wrapperCol={{ span: 16 }}
                            dependencies={["newPassword"]}
                            rules={[
                                { required: true, message: "Please confirm your new password!" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("newPassword") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error("Passwords do not match!"));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Confirm new password" />
                        </Form.Item>

                        <Form.Item style={{ display: "flex", justifyContent: "end" }}>
                            <Button type="primary" className="bg-secondary" htmlType="submit">
                                Save
                            </Button>
                        </Form.Item>
                    </Form>


                </Modal>
            </div>
        </>
    );
};

export default Profile;
