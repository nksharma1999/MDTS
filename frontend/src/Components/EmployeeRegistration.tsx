import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input, Select, Button, Form, Upload, DatePicker, Row, Col } from "antd";
import { UploadOutlined, ArrowRightOutlined } from "@ant-design/icons";
import moment from "moment";
import "../styles/employee-registration.css"
import ImageContainer from "./ImageContainer";
interface EmployeeData {
  name: string;
  company: string;
  project: string[];
  mobile: string;
  email: string;
  whatsapp: string;
  registrationDate: string | null;
  photo: string;
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
    project: user?.project || [],
    mobile: user?.mobile || "",
    email: user?.email || "",
    whatsapp: user?.whatsapp || "",
    registrationDate: user?.registrationDate || "",
    photo: user?.photo || "",
  });

  const projectOptions = ["Project A", "Project B", "Project C", "Project D"];
  const companyOptions = ["Company A", "Company B", "Company C", "Company D"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProjectChange = (value: string[]) => {
    setFormData((prev) => ({ ...prev, project: value }));
  };

  const handlePhotoUpload = (file: any) => {
    setFormData((prev) => ({ ...prev, photo: URL.createObjectURL(file.originFileObj) }));
    return false;
  };

  const handleSaveOrUpdate = () => {
    if (isEdit) {
      console.log("Updating user:", formData);
    } else {
      console.log("Saving new user:", formData);
    }
    navigate("/manageuser");
  };

  return (
    <>
      <div className="main-container-div">
        <div className="employee-registration">
          <div className="card">
            <div className="card-header bg-secondary">
              {isEdit ? "Edit Employee Details" : "Employee Registration"}
            </div>

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
                    <label>Project</label>
                  </Col>
                  <Col span={18}>
                    <Select
                      mode="multiple"
                      value={formData.project}
                      onChange={handleProjectChange}
                      placeholder="Select Projects"
                    >
                      {projectOptions.map((project) => (
                        <Select.Option key={project} value={project}>
                          {project}
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

                <Row gutter={[16, 16]} className="form-row" align="middle">
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
                </Row>

                <div className="button-group">
                  <Button
                    className="bg-secondary"
                    icon={<ArrowRightOutlined />}
                    onClick={handleSaveOrUpdate}
                  >
                    {isEdit ? "Update" : "Save"}
                  </Button>
                </div>
              </Form>

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
