import "../styles/register-new-project.css";
import { useEffect, useState } from "react";
import { Select, Input, Form, Row, Col, Button, DatePicker, Modal, notification, Table, Tooltip } from "antd";
import "../styles/register-new-project.css";
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import ImageContainer from "../components/ImageContainer";
import { getAllLibraries } from "../Utils/moduleStorage";
const { Option } = Select;
import { getAllMineTypes } from '../Utils/moduleStorage';
export const RegisterNewProject: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addCompanyPopupOpen, setAddCompanyPopupOpen] = useState<boolean>(false);
  const [allLibrariesName, setAllLibrariesName] = useState<any>([]);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [mineTypeOptions, setMineTypeOptions] = useState<string[]>([]);
  const initialLibrary = allLibrariesName[0]?.name;
  const [selectedLibrary, setSelectedLibrary] = useState<any>(initialLibrary);
  const [newCompany, setNewCompany] = useState<string>("");
  const steps = [
    { id: 1, title: "Project Parameters" },
    { id: 2, title: "Locations" },
    { id: 3, title: "Contractual Details" },
    { id: 4, title: "Initial Status" },
  ];
  const [companyList, setCompanyList] = useState([
    { id: 1, name: "Company A" },
    { id: 2, name: "Company B" }
  ]);
  const [formStepsData, setFormStepsData] = useState<any[]>(() => {
    const savedData = localStorage.getItem("projectFormData");
    return savedData ? JSON.parse(savedData) : [];
  });
  const [selectedItems, setSelectedItems] = useState(
    allLibrariesName.find((lib: any) => lib.name === initialLibrary)?.items || []
  );
  const requiredFields: { [key: number]: string[] } = {
    1: ["companyName", "projectName", "mineral", "typeOfMine", "reserve", "netGeologicalReserve", "extractableReserve", "grade", "stripRatio", "peakCapacity", "mineLife", "totalCoalBlockArea"],
    2: ["state", "district", "nearestTown", "nearestAirport", "nearestRailwayStation"],
    3: ["mineOwner", "dateOfH1Bidder", "cbdpaDate", "vestingOrderDate", "pbgAmount"],
    4: Object.values(allLibrariesName).map((moduleName: any) => moduleName)
  };

  useEffect(() => {
    setFormData({});
    clearFormData();
    const storedList = localStorage.getItem('companyList');
    if (storedList) {
      setCompanyList(JSON.parse(storedList));
    } else {
      setCompanyList([{ id: 1, name: "Company A" }, { id: 2, name: "Company B" }]);
    }
    const keys: any = getAllLibraries();
    setAllLibrariesName(keys)
  }, []);

  useEffect(() => {
    try {
      const storedOptions = getAllMineTypes();
      if (storedOptions.length > 0) {
        setMineTypeOptions(storedOptions);
      }
    } catch (error) {
      console.error("Error fetching mine types:", error);
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
    const initialDataVal = { library: selectedLibrary, items: selectedItems };
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
      initialStatus: initialDataVal || {},
    };
    const updatedProjects = [...storedProjects, newProject];
    localStorage.setItem(userProjectsKey, JSON.stringify(updatedProjects));
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
      ...(Array.isArray(allLibrariesName) ? allLibrariesName : []).reduce(
        (acc: any, moduleName: any) => {
          if (typeof moduleName === "string") {
            const key = moduleName.replace(/\s+/g, "").toLowerCase();
            acc[key] = undefined;
          }
          return acc;
        },
        {}
      ),
    });
    setErrors({});
  };

  const handleLibraryChange = (value: string) => {
    setSelectedLibrary(value);
    const selectedLib: any = allLibrariesName.find((lib: any) => lib.name === value);
    setSelectedItems(selectedLib ? selectedLib.items : []);
  };

  const handleStatusChange = (index: number, value: string) => {
    setSelectedItems((prevItems: any) =>
      prevItems.map((item: any, i: any) => {
        if (i < index) return item;
        if (i === index) return { ...item, status: value === "Yes" ? "Completed" : "Pending" };
        return { ...item, status: "Pending" };
      })
    );
  };

  const columns: any = [
    {
      title: "Module",
      dataIndex: "moduleName",
      key: "moduleName",
      width: "60%",
      align: "left",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "20%",
      align: "center",
      render: (_: any, record: any, index: number) => {
        const isDisabled = index > 0 && selectedItems[index - 1].status !== "Completed";

        return (
          <Tooltip title={isDisabled ? "Complete the previous module first" : "Mark as Completed"}>
            <Select
              value={record.status === "Completed" ? "Yes" : "No"}
              style={{ width: "100%" }}
              onChange={(value) => handleStatusChange(index, value)}
              disabled={isDisabled}
            >
              <Option value="No">No</Option>
              <Option value="Yes">Yes</Option>
            </Select>
          </Tooltip>
        );
      },
    },
  ];

  const renderStepForm = () => {
    switch (currentStep) {
      case 1:
        // return (
        //   <Form style={{ marginTop: "15px" }} layout="horizontal">
        //     <Row gutter={[16, 16]}>
        //       <Col span={24}>
        //         <Form.Item
        //           colon={false}
        //           label="Company Name"
        //           labelAlign="left"
        //           labelCol={{ span: 6 }}
        //           wrapperCol={{ span: 18 }}
        //           validateStatus={errors.companyName ? "error" : ""}
        //           help={errors.companyName ? "Company Name is required" : ""}
        //         >
        //           <div style={{ display: "flex", gap: "10px" }}>
        //             <Select
        //               value={formData.companyName || ""}
        //               onChange={(value) => handleChange("companyName", value)}
        //             >
        //               {companyList.map((company) => (
        //                 <Select.Option key={company.id} value={company.name}>
        //                   {company.name}
        //                 </Select.Option>
        //               ))}
        //             </Select>
        //             <Button
        //               type="dashed"
        //               icon={<PlusOutlined />}
        //               onClick={() => setAddCompanyPopupOpen(true)}
        //             />
        //           </div>
        //         </Form.Item>
        //       </Col>

        //       {[
        //         { label: "Project Name", key: "projectName", type: "text" },
        //         { label: "Reserve", key: "reserve", type: "number" },
        //         { label: "Net Geological Reserve", key: "netGeologicalReserve", type: "number" },
        //         { label: "Extractable Reserve", key: "extractableReserve", type: "number" },
        //         { label: "Strip Ratio", key: "stripRatio", type: "number" },
        //         { label: "Peak Capacity", key: "peakCapacity", type: "number" },
        //         { label: "Mine Life (years)", key: "mineLife", type: "number" },
        //         { label: "Total Coal Block Area", key: "totalCoalBlockArea", type: "number" },
        //       ].map(({ label, key, type }) => (
        //         <Col span={24} key={key}>
        //           <Form.Item
        //             colon={false}
        //             label={label}
        //             labelAlign="left"
        //             labelCol={{ span: 6 }}
        //             wrapperCol={{ span: 18 }}
        //             validateStatus={errors[key] ? "error" : ""}
        //             help={errors[key] ? `${label} is required` : ""}
        //           >
        //             <Input
        //               type={type}
        //               value={formData[key] || ""}
        //               onChange={(e) => handleChange(key, e.target.value)}
        //             />
        //           </Form.Item>
        //         </Col>
        //       ))}

        //       <Col span={24}>
        //         <Form.Item
        //           colon={false}
        //           label="Mineral"
        //           labelAlign="left"
        //           labelCol={{ span: 6 }}
        //           wrapperCol={{ span: 18 }}
        //           validateStatus={errors.mineral ? "error" : ""}
        //           help={errors.mineral ? "Mineral is required" : ""}
        //         >
        //           <Select value={formData.mineral || ""} onChange={(value) => handleChange("mineral", value)}>
        //             {["Coal", "Iron"].map((option) => (
        //               <Select.Option key={option} value={option}>
        //                 {option}
        //               </Select.Option>
        //             ))}
        //           </Select>
        //         </Form.Item>
        //       </Col>

        //       <Col span={24}>
        //         <Form.Item
        //           colon={false}
        //           label="Type of Mine"
        //           labelAlign="left"
        //           labelCol={{ span: 6 }}
        //           wrapperCol={{ span: 18 }}
        //           validateStatus={errors.typeOfMine ? "error" : ""}
        //           help={errors.typeOfMine ? "Type of Mine is required" : ""}
        //         >
        //           <Select
        //             value={formData.typeOfMine || ""}
        //             onChange={(value) => {
        //               handleChange("typeOfMine", value);
        //               const filteredLib = allLibrariesName.filter((group: any) => group.mineType === value);
        //               setAllLibrariesName(filteredLib);
        //               handleLibraryChange(filteredLib[0]?.name);
        //             }}
        //           >
        //             {mineTypeOptions.map((option) => (
        //               <Select.Option key={option} value={option}>
        //                 {option}
        //               </Select.Option>
        //             ))}
        //           </Select>
        //         </Form.Item>
        //       </Col>

        //       <Col span={24}>
        //         <Form.Item
        //           colon={false}
        //           label="Grade (in case of Coal)"
        //           labelAlign="left"
        //           labelCol={{ span: 6 }}
        //           wrapperCol={{ span: 18 }}
        //           validateStatus={errors.grade ? "error" : ""}
        //           help={errors.grade ? "Grade is required" : ""}
        //         >
        //           <Select value={formData.grade || ""} onChange={(value) => handleChange("grade", value)}>
        //             {["Grade A", "Grade B"].map((option) => (
        //               <Select.Option key={option} value={option}>
        //                 {option}
        //               </Select.Option>
        //             ))}
        //           </Select>
        //         </Form.Item>
        //       </Col>
        //     </Row>
        //   </Form>
        // );
        return (
          <Form style={{ marginTop: "15px" }} layout="horizontal">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item
                  colon={false}
                  label="Company Name"
                  labelAlign="left"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 19 }}
                  validateStatus={errors.companyName ? "error" : ""}
                  help={errors.companyName ? "Company Name is required" : ""}
                >
                  <div style={{ display: "flex", gap: "10px" }}>
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
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => setAddCompanyPopupOpen(true)}
                    />
                  </div>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  colon={false}
                  label="Project Name"
                  labelAlign="left"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 19 }}
                  validateStatus={errors.projectName ? "error" : ""}
                  help={errors.projectName ? "Project Name is required" : ""}
                >
                  <Input
                    type="text"
                    value={formData.projectName || ""}
                    onChange={(e) => handleChange("projectName", e.target.value)}
                  />
                </Form.Item>
              </Col>
              {[
                { label: "Reserve", key: "reserve", type: "number" },
                { label: "Net Geological Reserve", key: "netGeologicalReserve", type: "number" },
                { label: "Extractable Reserve", key: "extractableReserve", type: "number" },
                { label: "Strip Ratio", key: "stripRatio", type: "number" },
                { label: "Peak Capacity", key: "peakCapacity", type: "number" },
                { label: "Mine Life (years)", key: "mineLife", type: "number" },
                { label: "Total Coal Block Area", key: "totalCoalBlockArea", type: "number" },
              ].map(({ label, key, type }, index) => (
                <Col span={12} key={key}>
                  <Form.Item
                    colon={false}
                    label={label}
                    labelAlign="left"
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 14 }}
                    validateStatus={errors[key] ? "error" : ""}
                    help={errors[key] ? `${label} is required` : ""}
                  >
                    <Input
                      style={{ marginLeft: index % 2 === 0 ? "4px" : "0", marginRight: index % 2 !== 0 ? "4px" : "0" }}
                      type={type}
                      value={formData[key] || ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                    />
                  </Form.Item>
                </Col>
              ))}
              <Col span={12}>
                <Form.Item
                  colon={false}
                  label="Mineral"
                  labelAlign="left"
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 14 }}
                  validateStatus={errors.mineral ? "error" : ""}
                  help={errors.mineral ? "Mineral is required" : ""}
                >
                  <Select value={formData.mineral || ""} onChange={(value) => handleChange("mineral", value)}>
                    {["Coal", "Iron"].map((option) => (
                      <Select.Option key={option} value={option}>
                        {option}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  colon={false}
                  label="Type of Mine"
                  labelAlign="left"
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 14 }}
                  validateStatus={errors.typeOfMine ? "error" : ""}
                  help={errors.typeOfMine ? "Type of Mine is required" : ""}
                >
                  <Select
                    value={formData.typeOfMine || ""}
                    style={{ marginLeft: "4px" }}
                    onChange={(value) => {
                      handleChange("typeOfMine", value);
                      const filteredLib = allLibrariesName.filter((group: any) => group.mineType === value);
                      setAllLibrariesName(filteredLib);
                      handleLibraryChange(filteredLib[0]?.name);
                    }}
                  >
                    {mineTypeOptions.map((option) => (
                      <Select.Option key={option} value={option}>
                        {option}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  colon={false}
                  label="Grade (in case of Coal)"
                  labelAlign="left"
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 14 }}
                  validateStatus={errors.grade ? "error" : ""}
                  help={errors.grade ? "Grade is required" : ""}
                >
                  <Select value={formData.grade || ""} onChange={(value) => handleChange("grade", value)}>
                    {["Grade A", "Grade B"].map((option) => (
                      <Select.Option key={option} value={option}>
                        {option}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        );


      case 2:
        return (
          <Form style={{ marginTop: "15px" }} layout="horizontal">
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
          <Form style={{ marginTop: "15px" }} layout="horizontal">
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
          <div>
            <Form className="select-module-group" layout="horizontal">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Form.Item
                    colon={false}
                    label="Select Module Group"
                    labelAlign="left"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    style={{ fontSize: "18px", fontWeight: "400" }}

                  >
                    <Select
                      value={selectedLibrary}
                      onChange={handleLibraryChange}
                      allowClear={true}
                    >
                      {allLibrariesName.map((lib: any) => (
                        <Option key={lib.name} value={lib.name}>
                          {lib.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Table
              columns={columns}
              dataSource={selectedItems}
              pagination={false}
              rowKey="moduleName"
              className="project-timeline-table"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="registration-container">
        <div className="step-registration-form">
          <div className="page-heading-main bg-secondary">
            <span className="page-heading">Register New Project</span>
          </div>
          <div className="form-container-item-div">
            <div className="form-items">
              <div className="progress-bars">
                <ul>
                  {steps.map((step, index) => (
                    <li
                      key={step.id}
                      className={`step ${currentStep > index + 1 ? "completed" : currentStep === index + 1 ? "active" : ""}`}
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
                <Button variant="outlined" onClick={handlePrevious} className="bg-tertiary text-white" disabled={currentStep === 1}>
                  Previous
                </Button>
                <Button className="bg-secondary text-white" onClick={currentStep === steps.length ? showConfirmationModal : handleNext}>
                  {currentStep === steps.length ? "Submit" : "Next"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="image-container">
          <ImageContainer imageUrl={["/images/auths/m5.jpg", "/images/auths/m5.jpg"]} />
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
        className="modal-container"
      >
        <p className="modal-body-item-padding">
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
        className="modal-container"
      >
        <div className="modal-body-item-padding">
          <Input
            placeholder="Enter Company Name"
            value={newCompany}
            onChange={(e) => setNewCompany(e.target.value)}
            style={{ marginBottom: "10px" }}
          />
        </div>
      </Modal>
    </>
  );
};