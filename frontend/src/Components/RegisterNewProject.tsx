
import { motion } from "framer-motion";
import "../styles/register-new-project.css";
import { useEffect, useState } from "react";
import { Select, Input, Form, Row, Col, Button, DatePicker, Typography, Modal, notification } from "antd";
import "../styles/register-new-project.css";
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import eventBus from "../Utils/EventEmitter";
import ImageContainer from "./ImageContainer";
export const RegisterNewProject: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addCompanyPopupOpen, setAddCompanyPopupOpen] = useState<boolean>(false);
  const steps = [
    { id: 1, title: "Project Parameters" },
    { id: 2, title: "Locations" },
    { id: 3, title: "Contractual Details" },
    { id: 4, title: "Initial Status" },
  ];
  const [newCompany, setNewCompany] = useState<string>("");
  const [companyList, setCompanyList] = useState([
    { id: 1, name: "Company A" },
    { id: 2, name: "Company B" }
  ]);


  const [formStepsData, setFormStepsData] = useState<any[]>(() => {
    const savedData = localStorage.getItem("projectFormData");
    return savedData ? JSON.parse(savedData) : [];
  });

  useEffect(() => {
    const storedList = localStorage.getItem('companyList');
    if (storedList) {
      setCompanyList(JSON.parse(storedList));
    } else {
      setCompanyList([{ id: 1, name: "Company A" }, { id: 2, name: "Company B" }]);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length) {
      const updatedData = Array.isArray(formStepsData) ? [...formStepsData] : [];
      updatedData[currentStep - 1] = { ...formData };
      setFormStepsData(updatedData);
      localStorage.setItem("projectFormData", JSON.stringify(updatedData));
      setCurrentStep(currentStep + 1);
      setFormData(updatedData[currentStep] || {});
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setFormData(formStepsData[currentStep - 2] || {});
    }
  };

  const handleChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  const showConfirmationModal = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddCompany = () => {
    if (newCompany.trim()) {
      const newId = companyList.length > 0 ? Math.max(...companyList.map((company) => company.id)) + 1 : 1;
      const updatedList = [
        ...companyList,
        { id: newId, name: newCompany }
      ];
      setCompanyList(updatedList);
      localStorage.setItem('companyList', JSON.stringify(updatedList));
      setNewCompany("");
      setAddCompanyPopupOpen(false);
    }
  };

  const handleSubmit = () => {
    const finalData = Array.isArray(formStepsData) ? [...formStepsData] : [];
    finalData[currentStep - 1] = { ...formData };
    localStorage.setItem("projectFormData", JSON.stringify(finalData));
    const projectName = finalData[0]?.projectName;
    eventBus.emit('newProjectAdded', projectName);

    notification.success({
      message: "Project Created Successfully",
      description: "All form data has been saved and cleared.",
      duration: 3,
    });

    setFormStepsData([]);
    setFormData({});
    setCurrentStep(1);
    setIsModalVisible(false);
  };

  const renderStepForm = () => {
    switch (currentStep) {
      case 1:
        return (
          <Form layout="horizontal">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item colon={false} label="Company Name" labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  <div style={{ display: 'flex', gap: "10px" }}>
                    <Select
                      value={formData.companyName || ""}
                      onChange={(value) => handleChange("companyName", value)}
                    >
                      {companyList.map((company) => (
                        <Select.Option key={company.id} value={company.name}>
                          {company.name}
                        </Select.Option>
                      ))}
                    </Select>
                    <Button type="dashed" icon={<PlusOutlined />} onClick={() => setAddCompanyPopupOpen(true)}></Button>
                  </div>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item colon={false} label="Project Name" labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  <Input value={formData.projectName || ""} onChange={(e) => handleChange("projectName", e.target.value)} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item colon={false} label="Mineral" labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  <Select value={formData.mineral || ""} onChange={(value) => handleChange("mineral", value)}>
                    <Select.Option value="Coal">Coal</Select.Option>
                    <Select.Option value="Iron">Iron</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item colon={false} label="Type of Mine" labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  <Select value={formData.typeOfMine || ""} onChange={(value) => handleChange("typeOfMine", value)}>
                    <Select.Option value="Open Cast">Open Cast</Select.Option>
                    <Select.Option value="Underground">Underground</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item colon={false} label="Reserve" labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  <Input value={formData.reserve || ""} onChange={(e) => handleChange("reserve", e.target.value)} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item colon={false} label="Net Geological Reserve (Mn T)" labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  <Input value={formData.netGeologicalReserve || ""} onChange={(e) => handleChange("netGeologicalReserve", e.target.value)} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item colon={false} label="Extractable Reserve (Mn T)" labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  <Input value={formData.extractableReserve || ""} onChange={(e) => handleChange("extractableReserve", e.target.value)} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item colon={false} label="Grade (in case of Coal)" labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  <Select value={formData.grade || ""} onChange={(value) => handleChange("grade", value)}>
                    <Select.Option value="Grade A">Grade A</Select.Option>
                    <Select.Option value="Grade B">Grade B</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item colon={false} label="Strip Ratio (Cum / T)" labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  <Input value={formData.stripRatio || ""} onChange={(e) => handleChange("stripRatio", e.target.value)} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item colon={false} label="Peak Capacity (MTPA)" labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  <Input value={formData.peakCapacity || ""} onChange={(e) => handleChange("peakCapacity", e.target.value)} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item colon={false} label="Mine Life (years)" labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  <Input value={formData.mineLife || ""} onChange={(e) => handleChange("mineLife", e.target.value)} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item colon={false} label="Total Coal Block Area (Ha)" labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  <Input value={formData.totalCoalBlockArea || ""} onChange={(e) => handleChange("totalCoalBlockArea", e.target.value)} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        );
      case 2:
        return (
          <Form layout="horizontal">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item colon={false} label="State" labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  <Input value={formData.state || ""} onChange={(e) => handleChange("state", e.target.value)} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item colon={false} label="District" labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  <Input value={formData.district || ""} onChange={(e) => handleChange("district", e.target.value)} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item colon={false} label="Nearest Town" labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  <Input value={formData.nearestTown || ""} onChange={(e) => handleChange("nearestTown", e.target.value)} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item colon={false} label="Nearest Airport" labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  <Input value={formData.nearestAirport || ""} onChange={(e) => handleChange("nearestAirport", e.target.value)} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item colon={false} label="Nearest Railway Station" labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  <Input value={formData.nearestRailwayStation || ""} onChange={(e) => handleChange("nearestRailwayStation", e.target.value)} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        );
      case 3:
        return (
          <Form layout="horizontal">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item colon={false} label="Mine Owner" labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  <Input value={formData.mineOwner || ""} onChange={(e) => handleChange("mineOwner", e.target.value)} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item colon={false} label="Date of H1 Bidder" labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  <DatePicker style={{ width: "100%" }} value={formData.dateOfH1Bidder || null} onChange={(date) => handleChange("dateOfH1Bidder", date)} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item colon={false} label="CBDPA Date" labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  <DatePicker style={{ width: "100%" }} value={formData.cbdpaDate || null} onChange={(date) => handleChange("cbdpaDate", date)} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item colon={false} label="Vesting Order Date" labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  <DatePicker style={{ width: "100%" }} value={formData.vestingOrderDate || null} onChange={(date) => handleChange("vestingOrderDate", date)} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item colon={false} label="PBG Amount" labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  <Input type="number" value={formData.pbgAmount || ""} onChange={(e) => handleChange("pbgAmount", e.target.value)} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        );
      case 4:
        return (
          <>
            <Typography.Title level={4}>Review & Submit</Typography.Title>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="main-container-div">
      <div className="form-container-item-div">
        <div className="page-heading-main bg-secondary">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <span className="page-heading">
              Register New Project
            </span>
          </motion.div>
        </div>
        <div>
          <div className="progress-bars">
            <ul>
              {steps.map((step, index) => (
                <li
                  key={step.id}
                  className={`step ${currentStep > index + 1
                    ? "completed"
                    : currentStep === index + 1
                      ? "active"
                      : ""
                    }`}
                >
                  <span className="step-title">{step.title}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="form-container">
            <form>
              <div className="form-group">{renderStepForm()}</div>
              <hr />
              <div className="form-buttons">
                <Button
                  variant="outlined"
                  onClick={handlePrevious}
                  className="bg-tertiary text-white"
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                <Button
                  className="bg-secondary text-white"
                  onClick={currentStep === steps.length ? showConfirmationModal : handleNext}
                >
                  {currentStep === steps.length ? "Submit" : "Next"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div>
        <ImageContainer imageUrl="/images/auths/m5.jpg" />
      </div>

      <Modal
        title="Confirm Submission"
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleModalCancel}
        okText="Submit"
        cancelText="Cancel"
        okButtonProps={{ className: "bg-secondary" }}
        cancelButtonProps={{ className: "bg-tertiary" }}
        maskClosable={false}
        keyboard={false}
      >
        <p>
          <ExclamationCircleOutlined style={{ color: "red", marginRight: 8 }} />
          Are you sure you want to submit the form? Once submitted, all data will be cleared.
        </p>
      </Modal>

      <Modal
        title="Add Company"
        open={addCompanyPopupOpen}
        onCancel={() => setAddCompanyPopupOpen(false)}
        onOk={handleAddCompany}
        okButtonProps={{ className: "bg-secondary" }}
        cancelButtonProps={{ className: "bg-tertiary" }}
        maskClosable={false}
        keyboard={false}
      >
        <Input
          placeholder="Enter Company Name"
          value={newCompany}
          onChange={(e) => setNewCompany(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
      </Modal>

    </div>
  );
};
