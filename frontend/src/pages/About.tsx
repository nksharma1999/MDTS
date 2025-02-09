import { motion } from "framer-motion";
import "../styles/register-new-project.css";
import { useState } from "react";
import { Typography, MenuItem, Select, TextField, Grid, FormControl, InputLabel, Button } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { DownOutlined } from '@ant-design/icons';
import type { DropdownProps, MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
const About = () => {
    const steps = [
        { id: 1, title: "Project Parameters" },
        { id: 2, title: "Locations" },
        { id: 3, title: "Contractual Details" },
        { id: 4, title: "Initial Status" },
    ];

    const items: MenuProps['items'] = [
        {
            label: 'Clicking me will not close the menu.',
            key: '1',
        },
        {
            label: 'Clicking me will not close the menu also.',
            key: '2',
        },
        {
            label: 'Clicking me will close the menu.',
            key: '3',
        },
    ];

    const [open, setOpen] = useState(false);

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        if (e.key === '3') {
            setOpen(false);
        }
    };

    const handleOpenChange: DropdownProps['onOpenChange'] = (nextOpen, info) => {
        if (info.source === 'trigger' || nextOpen) {
            setOpen(nextOpen);
        }
    };

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<any>({});

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEdit = (step: number) => {
        setCurrentStep(step);
    };

    const renderStepForm = () => {
        switch (currentStep) {
            case 1:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Company Name</InputLabel>
                                <Select name="companyName" onChange={handleChange} value={formData.companyName || ""}>
                                    <MenuItem value="Company A">Company A</MenuItem>
                                    <MenuItem value="Company B">Company B</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="projectName"
                                label="Project Name"
                                fullWidth
                                onChange={handleChange}
                                value={formData.projectName || ""}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Mineral</InputLabel>
                                <Select name="mineral" onChange={handleChange} value={formData.mineral || ""}>
                                    <MenuItem value="Coal">Coal</MenuItem>
                                    <MenuItem value="Iron">Iron</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Type of Mine</InputLabel>
                                <Select name="typeOfMine" onChange={handleChange} value={formData.typeOfMine || ""}>
                                    <MenuItem value="Open Cast">Open Cast</MenuItem>
                                    <MenuItem value="Underground">Underground</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="reserve"
                                label="Reserve"
                                fullWidth
                                onChange={handleChange}
                                value={formData.reserve || ""}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="netGeologicalReserve"
                                label="Net Geological Reserve (Mn T)"
                                fullWidth
                                onChange={handleChange}
                                value={formData.netGeologicalReserve || ""}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="extractableReserve"
                                label="Extractable Reserve (Mn T)"
                                fullWidth
                                onChange={handleChange}
                                value={formData.extractableReserve || ""}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Grade (in case of Coal)</InputLabel>
                                <Select name="grade" onChange={handleChange} value={formData.grade || ""}>
                                    <MenuItem value="Grade A">Grade A</MenuItem>
                                    <MenuItem value="Grade B">Grade B</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="stripRatio"
                                label="Strip Ratio (Cum / T)"
                                fullWidth
                                onChange={handleChange}
                                value={formData.stripRatio || ""}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="peakCapacity"
                                label="Peak Capacity (MTPA)"
                                fullWidth
                                onChange={handleChange}
                                value={formData.peakCapacity || ""}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="mineLife"
                                label="Mine Life (years)"
                                fullWidth
                                onChange={handleChange}
                                value={formData.mineLife || ""}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="totalCoalBlockArea"
                                label="Total Coal Block Area (Ha)"
                                fullWidth
                                onChange={handleChange}
                                value={formData.totalCoalBlockArea || ""}
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>
                );
            case 2:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="state"
                                label="State"
                                fullWidth
                                onChange={handleChange}
                                value={formData.state || ""}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="district"
                                label="District"
                                fullWidth
                                onChange={handleChange}
                                value={formData.district || ""}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="nearestTown"
                                label="Nearest Town"
                                fullWidth
                                onChange={handleChange}
                                value={formData.nearestTown || ""}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="nearestAirport"
                                label="Nearest Airport"
                                fullWidth
                                onChange={handleChange}
                                value={formData.nearestAirport || ""}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="nearestRailwayStation"
                                label="Nearest Railway Station"
                                fullWidth
                                onChange={handleChange}
                                value={formData.nearestRailwayStation || ""}
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>
                );
            case 3:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="mineOwner"
                                label="Mine Owner"
                                fullWidth
                                onChange={handleChange}
                                value={formData.mineOwner || ""}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="dateOfH1Bidder"
                                label="Date of H1 Bidder"
                                type="date"
                                fullWidth
                                onChange={handleChange}
                                value={formData.dateOfH1Bidder || ""}
                                variant="outlined"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="cbdpaDate"
                                label="CBDPA Date"
                                type="date"
                                fullWidth
                                onChange={handleChange}
                                value={formData.cbdpaDate || ""}
                                variant="outlined"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="vestingOrderDate"
                                label="Vesting Order Date"
                                type="date"
                                fullWidth
                                onChange={handleChange}
                                value={formData.vestingOrderDate || ""}
                                variant="outlined"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="pbgAmount"
                                label="PBG Amount"
                                fullWidth
                                onChange={handleChange}
                                value={formData.pbgAmount || ""}
                                variant="outlined"
                                type="number"
                            />
                        </Grid>
                    </Grid>
                );
            case 4:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" gutterBottom>Mine Owner</Typography>
                            <Typography>{formData.mineOwner || "No Response"}</Typography>
                            <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<Edit />}
                                onClick={() => handleEdit(3)}
                            >
                                Edit
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" gutterBottom>Date of H1 Bidder</Typography>
                            <Typography>{formData.dateOfH1Bidder || "No Response"}</Typography>
                            <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<Edit />}
                                onClick={() => handleEdit(3)}
                            >
                                Edit
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" gutterBottom>CBDPA Date</Typography>
                            <Typography>{formData.cbdpaDate || "No Response"}</Typography>
                            <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<Edit />}
                                onClick={() => handleEdit(3)}
                            >
                                Edit
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" gutterBottom>Vesting Order Date</Typography>
                            <Typography>{formData.vestingOrderDate || "No Response"}</Typography>
                            <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<Edit />}
                                onClick={() => handleEdit(3)}
                            >
                                Edit
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" gutterBottom>PBG Amount</Typography>
                            <Typography>{formData.pbgAmount || "No Response"}</Typography>
                            <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<Edit />}
                                onClick={() => handleEdit(3)}
                            >
                                Edit
                            </Button>
                        </Grid>
                    </Grid>
                );
            default:
                return null;
        }
    };

    return (
        <div className="main-container-div">
            <div className="flex mt-3 px-2 items-center justify-center min-h-screen bg-gray-900 p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                    <Typography variant="h4" component="h4" color="black" fontWeight="bold" gutterBottom>
                        Register New Project
                    </Typography>
                </motion.div>
            </div>
            <Dropdown
                menu={{
                    items,
                    onClick: handleMenuClick,
                }}
                onOpenChange={handleOpenChange}
                open={open}
            >
                <a onClick={(e) => e.preventDefault()}>
                    <Space>
                        Hover me
                        <DownOutlined />
                    </Space>
                </a>
            </Dropdown>
            <hr />
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
                                <motion.div className="circle" animate={{ scale: currentStep === index + 1 ? 1.02 : 1 }}>
                                    {currentStep > index + 1 ? "✔" : index + 1}
                                </motion.div>
                                <span className="step-title">{step.title}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="form-container">
                    <div className="form-header">{steps[currentStep - 1].title}</div>
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
                                variant="contained"
                                className="bg-secondary text-white"
                                onClick={handleNext}
                                disabled={currentStep === steps.length}
                            >
                                {currentStep === steps.length ? "Submit" : "Next"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default About;
