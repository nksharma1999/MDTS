import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input, Select, Button, Form, Upload, DatePicker, Row, Col } from "antd";
import { UploadOutlined, ArrowRightOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import moment from "moment";
import "../styles/employee-registration.css"
import ImageContainer from "../components/ImageContainer";
interface EmployeeData {
  name: string;
  company: string;
  role: string;
  mobile: string;
  email: string;
  designation: string;
  whatsapp: string;
  registrationDate: string | null;
  photo: string;
  password: string;
}

interface LocationState {
  user: EmployeeData | null;
  isEdit: boolean;
}

export const EmployeeRegistration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isEdit }: LocationState = location.state || { user: null, isEdit: false };

  const [formData, setFormData] = useState<EmployeeData>({
    name: user?.name || "",
    company: user?.company || "",
    role: user?.role || "",
    mobile: user?.mobile || "",
    email: user?.email || "",
    whatsapp: user?.whatsapp || "",
    registrationDate: user?.registrationDate || "",
    photo: user?.photo || "",
    designation: user?.designation || "",
    password: user?.password || "",
  });

  const roleOptions = ["Editor", "Viewer"];
  const companyOptions = ["Mining Corp", "Deep Earth Industries", "Rock Minerals Ltd"];
  const [passwordVisible, _setPasswordVissible] = useState(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const designationOptions = ['Mining Engineer', 'Geologist', 'Operations Manager'];

  const handlePhotoUpload = (file: any) => {
    setFormData((prev) => ({ ...prev, photo: URL.createObjectURL(file.originFileObj) }));
    return false;
  };

  const handleSaveOrUpdate = () => {
    const existingEmployees = JSON.parse(localStorage.getItem("users") || "[]");

    if (isEdit) {
      const updatedEmployees = existingEmployees.map((emp: EmployeeData) =>
        emp.email === formData.email ? { ...emp, ...formData } : emp
      );
      localStorage.setItem("users", JSON.stringify(updatedEmployees));
      console.log("Updating user:", formData);
    } else {
      const newEmployee = {
        id: Date.now(),
        ...formData,
        registeredOn: new Date().toISOString(),
        profilePhoto: formData.photo || "",
        password: "default@123",
        isTempPassword: true,
      };

      const updatedEmployees = [...existingEmployees, newEmployee];
      localStorage.setItem("users", JSON.stringify(updatedEmployees));
      console.log("Saving new user:", newEmployee);
    }

    navigate("/create/raci-alert-notification");
  };


  return (
    <>
      <div className="main-container-div-items">
        <div className="employee-registration">
          <div className="card-header bg-secondary">
            {isEdit ? "Edit Employee Details" : "Employee Registration"}
          </div>
          <div className="card">
            <div className="card-body">
              <Form className="professional-form">
                <Row gutter={[16, 16]} className="form-row" align="middle">
                  <Col span={6} style={{ textAlign: 'left' }}>
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
                      onChange={(value) => setFormData((prev) => ({ ...prev, company: value }))}
                      placeholder="Select Company"
                    >
                      {companyOptions.map((company) => (
                        <Select.Option key={company} value={company}>
                          {company}
                        </Select.Option>
                      ))}
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
                      onChange={(value) => setFormData((prev) => ({ ...prev, designation: value }))}
                      placeholder="Select Designation"
                    >
                      {designationOptions.map((designation) => (
                        <Select.Option key={designation} value={designation}>
                          {designation}
                        </Select.Option>
                      ))}
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
                      onChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
                      placeholder="Select Role"
                    >
                      {roleOptions.map((role) => (
                        <Select.Option key={role} value={role}>
                          {role}
                        </Select.Option>
                      ))}
                    </Select>
                  </Col>
                </Row>

                <Row gutter={[16, 16]} className="form-row" align="middle">
                  <Col span={6} style={{ textAlign: 'left' }}>
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
                  <Col span={6} style={{ textAlign: 'left' }}>
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
                  <Col span={6} style={{ textAlign: 'left' }}>
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
                  <Col span={6} style={{ textAlign: 'left' }}>
                    <label>Registration Date</label>
                  </Col>
                  <Col span={18}>
                    <DatePicker
                      value={formData.registrationDate ? moment(formData.registrationDate) : null}
                      onChange={(_date, dateString) => setFormData((prev: any) => ({ ...prev, registrationDate: dateString || "" }))}
                      style={{ width: '100%' }}
                    />
                  </Col>
                </Row>
                {/* Password Field with Show/Hide */}
                <Row gutter={[16, 16]} className="form-row" align="middle">
                  <Col span={6} style={{ textAlign: 'left' }}>
                    <label>Password</label>
                  </Col>
                  <Col span={18}>
                    <Input.Password
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter Password"
                      iconRender={(visible) =>
                        visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                      }
                      type={passwordVisible ? "text" : "password"}
                    />
                  </Col>
                </Row>

                {/* <Row gutter={[16, 16]} className="form-row" align="middle">
                  <Col span={6} style={{ textAlign: 'left' }}>
                    <label>Upload Photo</label>
                  </Col>
                  <Col span={18}>
                    <Upload
                      showUploadList={false}
                      customRequest={handlePhotoUpload}
                      maxCount={1}
                      accept="image/*"
                    >
                      <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                    {formData.photo && (
                      <img src={formData.photo} alt="Uploaded" className="uploaded-photo" />
                    )}
                  </Col>
                </Row> */}
              </Form>
              <hr />
              <div className="button-group">
                <Button
                  className="bg-secondary save-btn"
                  icon={<ArrowRightOutlined />}
                  onClick={handleSaveOrUpdate}
                  style={{ float: 'right' }}
                >
                  {isEdit ? "Update" : "Save"}
                </Button>
              </div>

            </div>
          </div>
        </div>
        <div>
          <ImageContainer imageUrl="/images/auths/m7.jpg" />
        </div>
      </div>
    </>
  );
};
