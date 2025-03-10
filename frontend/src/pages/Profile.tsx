import { useEffect, useState } from "react";
import "../styles/profile.css";
import { Form, Input, Button, Row, Col, Select, message, Modal } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import ManageUser from "../Components/ManageUser";
import { CameraOutlined } from "@ant-design/icons";

const { Option } = Select;

const Profile = () => {

    const [formData, setFormData] = useState<any>({
        id: null as number | null,
        name: null as string | null,
        company: null as string | null,
        designation: null as string | null,
        companyType: null as string | null,
        industryType: null as string | null,
        mobile: null as string | null,
        email: null as string | null,
        whatsapp: null as string | null,
        registeredOn: null as string | null,
        profilePhoto: null as string | null,
        password: null as string | null,
        isTempPassword: null as boolean | null,
        role: null as string | null,
        address: null as string | null,
        city: null as string | null,
        state: null as string | null,
        country: null as string | null,
        zipCode: null as string | null,
        assignedModules: [] as {
            moduleCode: string | null;
            moduleName: string | null;
            isApplicableOnModule: boolean | null;
            responsibilitiesOnActivities: {
                activityCode: string | null;
                activityName: string | null;
                responsibilities: string[];
            }[];
        }[]
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
                companyType: parsedData.companyType || "",
                industryType: parsedData.industryType || "",
                mobile: parsedData.mobile || "",
                email: parsedData.email || "",
                whatsapp: parsedData.whatsapp || "",
                registeredOn: parsedData.registeredOn || "",
                profilePhoto: parsedData.profilePhoto || "",
                address: parsedData.address,
                city: parsedData.city,
                state: parsedData.state,
                country: parsedData.country,
                zipCode: parsedData.zipCode || "",
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
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value: any, name: any) => {
        setFormData((prev: any) => ({ ...prev, [name]: value }));
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

                            <div className="company-registration-form">
                                <Form
                                    className={`employee-professional-form ${isProfileCompleted()
                                        ? "registration-height-without-warning"
                                        : "registration-height-with-warning"
                                        }`}
                                    layout="horizontal"
                                    labelCol={{ span: 6 }}
                                    wrapperCol={{ span: 18 }}
                                    labelAlign="left"
                                >
                                    <Row gutter={[16, 16]} className="form-row">
                                        <Col span={12}>
                                            <Form.Item
                                                label="Company Name"
                                                colon={false}
                                                rules={[{ required: true, message: "Please enter company name" }]}
                                            >
                                                <Input
                                                    name="company"
                                                    value={formData.company}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Company"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Company Type"
                                                colon={false}
                                                rules={[{ required: true, message: "Please select company type" }]}
                                            >
                                                <Select
                                                    value={formData.companyType}
                                                    onChange={(value) => handleSelectChange(value, "companyType")}
                                                    placeholder="Select Company Type"
                                                    style={{ width: "100%" }}
                                                >
                                                    <Option value="Mining">Mining</Option>
                                                    <Option value="Construction">Construction</Option>
                                                    <Option value="Equipment Supplier">Equipment Supplier</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={[16, 16]} className="form-row">
                                        <Col span={12}>
                                            <Form.Item
                                                label="Industry Type"
                                                colon={false}
                                                rules={[{ required: true, message: "Please select industry type" }]}
                                            >
                                                <Select
                                                    value={formData.industryType}
                                                    onChange={(value) => handleSelectChange(value, "industryType")}
                                                    placeholder="Select Industry Type"
                                                    style={{ width: "100%" }}
                                                >
                                                    <Option value="Coal">Coal</Option>
                                                    <Option value="Iron">Iron</Option>
                                                    <Option value="Gold">Gold</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Designation"
                                                colon={false}
                                                rules={[{ required: true, message: "Please select designation" }]}
                                            >
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
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={[16, 16]} className="form-row">
                                        <Col span={12}>
                                            <Form.Item
                                                label="Full Name"
                                                colon={false}
                                                rules={[{ required: true, message: "Please enter name" }]}
                                            >
                                                <Input
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Name"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Email"
                                                colon={false}
                                                rules={[{ required: true, message: "Please enter email", type: "email" }]}
                                            >
                                                <Input
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Email"
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={[16, 16]} className="form-row">
                                        <Col span={12}>
                                            <Form.Item
                                                label="Mobile No"
                                                colon={false}
                                                rules={[{ required: true, message: "Please enter mobile number" }]}
                                            >
                                                <Input
                                                    name="mobile"
                                                    value={formData.mobile}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Mobile No"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item label="WhatsApp No" colon={false}>
                                                <Input
                                                    name="whatsapp"
                                                    value={formData.whatsapp}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter WhatsApp No"
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={[16, 16]} className="form-row">
                                        <Col span={12}>
                                            <Form.Item
                                                label="Role"
                                                colon={false}
                                                rules={[{ required: true, message: "Please select role" }]}
                                            >
                                                <Select
                                                    value={formData.role}
                                                    onChange={(value) => handleSelectChange(value, "role")}
                                                    placeholder="Select Role"
                                                    style={{ width: "100%" }}
                                                >
                                                    <Option value="admin">Admin</Option>
                                                    <Option value="manager">Manager</Option>
                                                    <Option value="worker">Worker</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>

                                        <Col span={12}>
                                            <Form.Item label="City" colon={false}>
                                                <Input
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter City"
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={[16, 16]} className="form-row">
                                        <Col span={12}>
                                            <Form.Item label="Address" colon={false}>
                                                <Input.TextArea
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Address"
                                                    rows={3}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={[16, 16]} className="form-row">
                                        <Col span={12}>
                                            <Form.Item label="State" colon={false}>
                                                <Input
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter State"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item label="Country" colon={false}>
                                                <Input
                                                    name="country"
                                                    value={formData.country}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Country"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item label="Zip Code" colon={false}>
                                                <Input
                                                    name="zipCode"
                                                    value={formData.zipCode}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Zip Code"
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            </div>


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
                return <div className=""><ManageUser options={{ isAddMember: true, isToolbar: true, title: "Team Members" }} /></div>;
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
                                src={image || "../public/images/logos/user-profile.png"}
                                alt="Logo"
                                className="profile-image"
                            />
                        </div>
                        <div className="details">
                            <div style={{ fontSize: "18px" }}>{formData?.name || ""}</div>
                            <div style={{ color: "grey", fontSize: "12px" }}>{formData?.company || ""}</div>
                        </div>
                    </div>

                    {['Profile Information', 'Team Members', "Accessibility"].map((tab) => {
                        if (tab === 'Team Members' && formData.role !== 'admin') {
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
