import { useEffect, useState } from "react";
import "../styles/profile.css";
import { Form, Input, Button, Row, Col, Select, DatePicker, Upload, message } from "antd";
import { ArrowRightOutlined, UploadOutlined } from "@ant-design/icons";
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
    });

    const [selectedTab, setSelectedTab] = useState("Profile Information");
    const [image, setImage] = useState<string | null>(null);
    useEffect(() => {
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
            });
        }
    }, []);

    useEffect(() => {
        if (formData.id) {
            const userId = formData.id;
            const storedImage = localStorage.getItem(`profileImage_${userId}`);
            if (storedImage) {
                setImage(storedImage);
            }
        }
    }, [formData.id]);


    const isProfileCompleted = () => {
        return (
            formData.name &&
            formData.company &&
            formData.designation &&
            formData.mobile &&
            formData.email &&
            formData.whatsapp &&
            formData.registeredOn &&
            formData.role ||
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

    const handlePhotoUpload = (info: any) => {
        const file = info.file;

        if (!file) {
            console.error("File upload error: No file selected");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                const base64Image = e.target.result as string;
                setFormData({ ...formData, profilePhoto: base64Image });
                localStorage.setItem("profilePhoto", base64Image); // Save to localStorage
            }
        };
        reader.readAsDataURL(file);
    };


    const handleSave = () => {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const userIndex = users.findIndex((user: any) => user.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...formData };
            localStorage.setItem("users", JSON.stringify(users));
        }
        localStorage.setItem("user", JSON.stringify(formData));
        message.success("Profile information saved successfully!");
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
                localStorage.setItem(`profileImage_${formData.id}`, base64Image);
            }
        };
        reader.readAsDataURL(file);
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
                                        <img src={image || "https://via.placeholder.com/100"} alt="Upload Photo" className="profile-image" />
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

                            <Form className="eployee-professional-form">
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
                                    </Col>
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
                                            disabled={formData.role != 'Admin'}
                                        >
                                            <Option value="Admin">Admin</Option>
                                            <Option value="Supervisor">Supervisor</Option>
                                            <Option value="Worker">Worker</Option>
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
                    if (tab === 'Team Members' && formData.role !== 'Admin') {
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

    );
};

export default Profile;
