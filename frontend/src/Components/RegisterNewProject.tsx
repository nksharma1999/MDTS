import "../styles/register-new-project.css";
import { useEffect, useState } from "react";
import { Select, Input, Form, Row, Col, Button, DatePicker, Modal, notification } from "antd";
import "../styles/register-new-project.css";
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import eventBus from "../Utils/EventEmitter";
import ImageContainer from "../components/ImageContainer";
import { getOrderedModuleNames } from "../Utils/moduleStorage";
const { Option } = Select;
export const RegisterNewProject: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addCompanyPopupOpen, setAddCompanyPopupOpen] = useState<boolean>(false);
  const [orderedModuleNames] = useState<string[]>(getOrderedModuleNames());
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
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
    setFormData({});
    clearFormData();
    const storedList = localStorage.getItem('companyList');
    if (storedList) {
      setCompanyList(JSON.parse(storedList));
    } else {
      setCompanyList([{ id: 1, name: "Company A" }, { id: 2, name: "Company B" }]);
    }
  }, []);

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
    const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");

    if (!loggedInUser.id) {
      notification.error({
        message: "Error",
        description: "No logged-in user found.",
        duration: 3,
      });
      return;
    }
    const userId = loggedInUser.id;
    const userProjectsKey = `projects_${userId}`;
    const finalData = Array.isArray(formStepsData) ? [...formStepsData] : [];
    finalData[currentStep - 1] = { ...formData };
    const storedProjects = JSON.parse(localStorage.getItem(userProjectsKey) || "[]");
    const newProject = {
      id: storedProjects.length + 1,
      projectParameters: finalData[0] || {},
      locations: finalData[1] || {},
      contractualDetails: finalData[2] || {},
      initialStatus: finalData[3] || {},
    };

    const updatedProjects = [...storedProjects, newProject];
    localStorage.setItem(userProjectsKey, JSON.stringify(updatedProjects));

    const projectName = newProject.projectParameters?.projectName;
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
    clearFormData();
  };

  const handleRowChange = (value: string, key: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: value ? "" : "Required" }));
  };

  const requiredFields: { [key: number]: string[] } = {
    1: ["companyName", "projectName", "mineral", "typeOfMine", "reserve", "netGeologicalReserve", "extractableReserve", "grade", "stripRatio", "peakCapacity", "mineLife", "totalCoalBlockArea"],
    2: ["state", "district", "nearestTown", "nearestAirport", "nearestRailwayStation"],
    3: ["mineOwner", "dateOfH1Bidder", "cbdpaDate", "vestingOrderDate", "pbgAmount"],
    4: orderedModuleNames.map((moduleName) => moduleName.replace(/\s+/g, "").toLowerCase())
  };

  const validateFields = (step: number): boolean => {
    let newErrors: { [key: string]: string } = {};
    requiredFields[step].forEach((field) => {
      const fieldValue = formData[field];
      if (fieldValue === undefined || fieldValue === null || (typeof fieldValue === 'string' && fieldValue.trim() === "") || (typeof fieldValue === 'number' && isNaN(fieldValue))) {
        newErrors[field] = "This field is required.";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      if (!validateFields(currentStep)) {
        notification.error({
          message: "Validation Error",
          description: "Please fill all required fields before proceeding.",
          duration: 3,
        });
        return;
      }

      const updatedData = Array.isArray(formStepsData) ? [...formStepsData] : [];
      updatedData[currentStep - 1] = { ...formData };
      setFormStepsData(updatedData);
      // localStorage.setItem("projectFormData", JSON.stringify({ updatedData }));
      setCurrentStep(currentStep + 1);
      setFormData(updatedData[currentStep] || {});
    }
  };

  const clearFormData = () => {
    setFormData({
      companyName: "",
      projectName: "",
      reserve: "",
      netGeologicalReserve: "",
      extractableReserve: "",
      stripRatio: "",
      peakCapacity: "",
      mineLife: "",
      totalCoalBlockArea: "",
      mineral: "",
      typeOfMine: "",
      grade: "",
      state: "",
      district: "",
      nearestTown: "",
      nearestAirport: "",
      nearestRailwayStation: "",
      mineOwner: "",
      dateOfH1Bidder: null,
      cbdpaDate: null,
      vestingOrderDate: null,
      pbgAmount: "",
      ...orderedModuleNames.reduce((acc: any, moduleName: any) => {
        const key = moduleName.replace(/\s+/g, "").toLowerCase();
        acc[key] = undefined;
        return acc;
      }, {}),
    });

    setErrors({});
  };

  const renderStepForm = () => {
    switch (currentStep) {
      case 1:
        return (
          <Form layout="horizontal">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item
                  colon={false}
                  label="Company Name"
                  labelAlign="left"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  validateStatus={errors.companyName ? "error" : ""}
                  help={errors.companyName ? "Company Name is required" : ""}
                >
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

              {[
                { label: "Project Name", key: "projectName" },
                { label: "Reserve", key: "reserve" },
                { label: "Net Geological Reserve (Mn T)", key: "netGeologicalReserve" },
                { label: "Extractable Reserve (Mn T)", key: "extractableReserve" },
                { label: "Strip Ratio (Cum / T)", key: "stripRatio" },
                { label: "Peak Capacity (MTPA)", key: "peakCapacity" },
                { label: "Mine Life (years)", key: "mineLife" },
                { label: "Total Coal Block Area (Ha)", key: "totalCoalBlockArea" },
              ].map(({ label, key }) => (
                <Col span={24} key={key}>
                  <Form.Item
                    colon={false}
                    label={label}
                    labelAlign="left"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    validateStatus={errors[key] ? "error" : ""}
                    help={errors[key] ? `${label} is required` : ""}
                  >
                    <Input value={formData[key] || ""} onChange={(e) => handleChange(key, e.target.value)} />
                  </Form.Item>
                </Col>
              ))}

              {[
                { label: "Mineral", key: "mineral", options: ["Coal", "Iron"] },
                { label: "Type of Mine", key: "typeOfMine", options: ["Open Cast", "Underground"] },
                { label: "Grade (in case of Coal)", key: "grade", options: ["Grade A", "Grade B"] },
              ].map(({ label, key, options }) => (
                <Col span={24} key={key}>
                  <Form.Item
                    colon={false}
                    label={label}
                    labelAlign="left"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    validateStatus={errors[key] ? "error" : ""}
                    help={errors[key] ? `${label} is required` : ""}
                  >
                    <Select value={formData[key] || ""} onChange={(value) => handleChange(key, value)}>
                      {options.map((option) => (
                        <Select.Option key={option} value={option}>
                          {option}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              ))}
            </Row>
          </Form>
        );
      case 2:
        return (
          <Form layout="horizontal">
            <Row gutter={[16, 16]}>
              {[
                { label: "State", key: "state" },
                { label: "District", key: "district" },
                { label: "Nearest Town", key: "nearestTown" },
                { label: "Nearest Airport", key: "nearestAirport" },
                { label: "Nearest Railway Station", key: "nearestRailwayStation" },
              ].map(({ label, key }) => (
                <Col span={24} key={key}>
                  <Form.Item
                    colon={false}
                    label={label}
                    labelAlign="left"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    validateStatus={errors[key] ? "error" : ""}
                    help={errors[key] ? `${label} is required` : ""}
                  >
                    <Input value={formData[key] || ""} onChange={(e) => handleChange(key, e.target.value)} />
                  </Form.Item>
                </Col>
              ))}
            </Row>
          </Form>
        );
      case 3:
        return (
          <Form layout="horizontal">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item
                  colon={false}
                  label="Mine Owner"
                  labelAlign="left"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  validateStatus={errors.mineOwner ? "error" : ""}
                  help={errors.mineOwner ? "Mine Owner is required" : ""}
                >
                  <Input value={formData.mineOwner || ""} onChange={(e) => handleChange("mineOwner", e.target.value)} />
                </Form.Item>
              </Col>
              {[
                { label: "Date of H1 Bidder", key: "dateOfH1Bidder" },
                { label: "CBDPA Date", key: "cbdpaDate" },
                { label: "Vesting Order Date", key: "vestingOrderDate" },
              ].map(({ label, key }) => (
                <Col span={24} key={key}>
                  <Form.Item
                    colon={false}
                    label={label}
                    labelAlign="left"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    validateStatus={errors[key] ? "error" : ""}
                    help={errors[key] ? `${label} is required` : ""}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      value={formData[key] || null}
                      onChange={(date) => handleChange(key, date)}
                    />
                  </Form.Item>
                </Col>
              ))}
              <Col span={24}>
                <Form.Item
                  colon={false}
                  label="PBG Amount"
                  labelAlign="left"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  validateStatus={errors.pbgAmount ? "error" : ""}
                  help={errors.pbgAmount ? "PBG Amount is required" : ""}
                >
                  <Input type="number" value={formData.pbgAmount || ""} onChange={(e) => handleChange("pbgAmount", e.target.value)} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        );
      case 4:
        return (
          <Form layout="horizontal">
            <div>
              <div className="module-list">
                {orderedModuleNames.map((moduleName) => {
                  const key = moduleName.replace(/\s+/g, "").toLowerCase();
                  return (
                    <Row key={key} className="module-item" gutter={16} align="middle">
                      <Col span={6}>
                        <label className="module-label" htmlFor={key}>
                          {moduleName}
                        </label>
                      </Col>
                      <Col span={18} style={{ marginBottom: "10px" }}>
                        <Select
                          className={`custom-select ${errors[key] ? "error" : ""}`}
                          id={key}
                          value={formData[key] || undefined}
                          onChange={(value) => handleRowChange(value, key)}
                          style={{ width: "100%" }}
                          placeholder={`Select ${moduleName}`}
                        >
                          <Option value="Yes">Yes</Option>
                          <Option value="No">No</Option>
                        </Select>
                        {errors[key] && <div className="error-text">{`${moduleName} selection is required`}</div>}
                      </Col>
                    </Row>
                  );
                })}
              </div>
            </div>
          </Form>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="main-container-div">
        <div>
          <div className="page-heading-main bg-secondary">
            <span className="page-heading">
              Register New Project
            </span>
          </div>
          <div className="form-container-item-div">
            <div className="form-items">
              <div className="progress-bars">
                <ul>
                  {steps.map((step, index) => (
                    <li
                      key={step.id}
                      className={`step ${((currentStep > index + 1))
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
                </form>
              </div>
              <hr className="saparation-line" />
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
            </div>
          </div>
        </div>

        <div>
          <ImageContainer imageUrl="/images/auths/m5.jpg" />
        </div>

      </div>
      <Modal
        title="Confirm Submission"
        open={isModalVisible}
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
    </>
  );
};