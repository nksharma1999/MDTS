import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input, Select, Button, Form, Upload, DatePicker, Row, Col } from "antd";
import { UploadOutlined, ArrowRightOutlined } from "@ant-design/icons";
import moment from "moment";
import "../styles/employee-registration.css"
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

  const handleCancel = () => {
    navigate("/manageuser");
  };

  return (
    <div className="employee-registration">
      <div className="card">
        <div className="card-header bg-secondary">
          {isEdit ? "Edit Employee Details" : "Employee Registration"}
        </div>

        <div className="card-body">
          <Form className="professional-form">
            <Row gutter={[16, 16]} className="form-row">
              <Col span={8}>
                <label>Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter Name"
                />
              </Col>
              <Col span={8}>
                <label>Company</label>
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
              <Col span={8}>
                <label>Project</label>
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

            <Row gutter={[16, 16]} className="form-row">
              <Col span={8}>
                <label>Mobile No</label>
                <Input
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="Enter Mobile No"
                />
              </Col>
              <Col span={8}>
                <label>Email</label>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter Email"
                />
              </Col>
              <Col span={8}>
                <label>WhatsApp No</label>
                <Input
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  placeholder="Enter WhatsApp No"
                />
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="form-row">
              <Col span={8}>
                <label>Registration Date</label>
                <DatePicker
                  value={formData.registrationDate ? moment(formData.registrationDate) : null}
                  onChange={(date, dateString) => setFormData((prev: any) => ({ ...prev, registrationDate: dateString || "" }))}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col span={8}>
                <label>Upload Photo</label>
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
              {/* <Button onClick={handleCancel} className="bg-tertiary">Cancel</Button> */}
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
  );
};
