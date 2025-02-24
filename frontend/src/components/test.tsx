import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Box, IconButton } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { Select } from "antd";
import '../styles/module-library.css';
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
const { Option } = Select;

interface Activity {
    code: string;
    activityName: string;
    duration: number | string;
    prerequisite: string;
    level: string;
}

interface Module {
    parentModuleCode: string;
    moduleName: string;
    level: string;
    mineType: string;
    activities: Activity[];
    duration: string;
}

interface Activity {
    code: string;
    activityName: string;
    duration: number | string;
    prerequisite: string;
    level: string;
}

interface Module {
    parentModuleCode: string;
    moduleName: string;
    level: string;
    mineType: string;
    activities: Activity[];
}

interface Library {
    name: string;
    items: Module[];
}

const ModuleLibrary = () => {
    const [_searchTerm, setSearchTerm] = useState<any>("");
    const [page, setPage] = useState<any>(0);
    const rowsPerPage = 10;
    const [selectedOption, setSelectedOption] = useState<any>("");
    const [_newLibraryType, setNewLibraryType] = useState<any>("");
    const [libraryType, setLibraryType] = useState("custom");
    const projects = ["Project A", "Project B", "Project C"];
    const handleSearch = (event: any) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);

        const filtered = modulesData.filter(
            (module: any) =>
                module.moduleName.toLowerCase().includes(value) ||
                module.parentModuleCode.toLowerCase().includes(value)
        );

        setFilteredData(filtered);
        setPage(0);
    };

    const handleChangePage = (_: any, newPage: any) => {
        setPage(newPage);
    };

    const handleChange = (event: any) => {
        setSelectedOption(event.target.value);
    };

    const [filteredData, setFilteredData] = useState<any>([]);
    const [modulesData, setModulesData] = useState<Module[]>([]);
    const [libraries, setLibraries] = useState<Library[]>([]);
    const [libraryName, setLibraryName] = useState<string>("");

    useEffect(() => {
        const storedModules = localStorage.getItem("modules");
        if (storedModules) {
            try {
                setModulesData(JSON.parse(storedModules));
            } catch (error) {
                console.error("Error parsing modules from localStorage:", error);
            }
        }
    }, []);

    const handleCreateLibrary = () => {
        if (libraryName.trim()) {
            setLibraries([...libraries, { name: libraryName, items: [] }]);
            setLibraryName("");
        }
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, module: Module) => {
        e.dataTransfer.setData("application/json", JSON.stringify(module));
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        const data = e.dataTransfer.getData("application/json");
        const moduleData: Module = JSON.parse(data);

        setLibraries((prevLibraries) => {
            const updatedLibraries = [...prevLibraries];
            if (!updatedLibraries[index].items.some(item => item.moduleName === moduleData.moduleName)) {
                updatedLibraries[index].items.push(moduleData);
            }
            return updatedLibraries;
        });
    };
    const handleSaveLibraries = () => {
        console.log("Saved Libraries:", libraries);
    };
    return (
        <>
            <div className="page-heading-module-library">
                <span>Module Library</span>
            </div>

            <div className="headings">
                <div className="heading-one"><span>Modules</span></div>
                <div className="heading-two"><span>Libraries</span></div>
                <div className="heading-three"><span>Create Libraries</span></div>
            </div>

            <Box className="main-section">
                <div className="module-list-page">
                    <Box sx={{ flex: 3 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", gap: "10px", padding: "10px" }}>
                            <Input
                                size="small"
                                placeholder="Search..."
                                onChange={handleSearch}
                                prefix={<SearchOutlined />}
                                style={{ height: "26px", fontSize: "12px" }}
                            />
                            <Select
                                value={selectedOption}
                                onChange={handleChange}
                                size="small"
                                placeholder="Select Option"
                                style={{ width: "100%", height: "26px", fontSize: "12px" }}
                            >
                                <Select.Option value="">Select Module Type</Select.Option>
                                <Select.Option value="option1">MDTS Module</Select.Option>
                                <Select.Option value="option2">Custom Module</Select.Option>
                            </Select>

                            <IconButton color="primary" style={{ padding: "0px" }}>
                                <FilterList />
                            </IconButton>
                        </Box>
                        <hr style={{ margin: 0, marginBottom: "8px" }} />
                        <TableContainer component={Paper} style={{ maxWidth: "500px" }}>
                            <Table>
                                <TableHead>
                                    <TableRow style={{ background: "#007bff", color: "white" }}>
                                        <TableCell style={headerStyle}>Module Code</TableCell>
                                        <TableCell style={headerStyle}>Module Name</TableCell>
                                        <TableCell style={headerStyle}>Mine Type</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {modulesData.length > 0 ? (
                                        modulesData.map((module, index) => (
                                            <TableRow
                                                key={index}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, module)}
                                                style={{ cursor: "grab" }}
                                            >
                                                <TableCell>{module.parentModuleCode}</TableCell>
                                                <TableCell>{module.moduleName}</TableCell>
                                                <TableCell>{module.mineType}</TableCell>
                                            </TableRow>

                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} style={{ textAlign: "center", color: "#888" }}>
                                                Loading modules...
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            component="div"
                            count={filteredData.length}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            onPageChange={handleChangePage}
                            rowsPerPageOptions={[]}
                            sx={{ mt: 2 }}
                        />
                    </Box>
                </div>

                <div style={{ position: "relative" }} className="create-library-section">
                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: "10px", padding: "10px" }}>
                        <Input
                            size="small"
                            placeholder="Search..."
                            onChange={handleSearch}
                            prefix={<SearchOutlined />}
                            style={{ height: "26px", fontSize: "12px" }}
                        />
                        <IconButton color="primary" style={{ padding: "0px" }}>
                            <FilterList />
                        </IconButton>
                    </Box>
                    <hr style={{ margin: 0, marginBottom: "8px" }} />

                    <div style={boxStyle}>
                        {libraries.map((library, index) => (
                            <div
                                key={index}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => handleDrop(e, index)}
                                style={{ ...libraryStyle, minHeight: "100px" }}
                            >
                                <strong>{library.name}</strong>
                                {library.items.length === 0 ? (
                                    <p style={emptyTextStyle}>Drop modules here</p>
                                ) : null}
                                {library.items.map((item, idx) => (
                                    <div key={idx} style={itemStyle}>
                                        {item.moduleName}
                                    </div>
                                ))}
                            </div>
                        ))}

                    </div>

                    <div style={{ position: "absolute", bottom: "7px", right: "10px" }}>
                        <Button type="primary" className="bg-secondary" onClick={handleSaveLibraries}>Save</Button>
                    </div>

                </div>

                <div className="library-details">
                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: "10px", padding: "10px" }}>
                        <Select size="small" value={libraryType} onChange={(value) => { setLibraryType(value); setNewLibraryType(""); }} style={{ width: "100%", height: "26px", fontSize: "12px" }}>
                            <Option value="project">Project Based Library</Option>
                            <Option value="custom">Custom Library</Option>
                        </Select>
                        <IconButton color="primary" style={{ padding: "0px" }}>
                            <FilterList />
                        </IconButton>
                    </Box>
                    <hr style={{ margin: 0, marginBottom: "8px" }} />
                    <div style={{ padding: "0px 10px" }}>
                        <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                            {libraryType === "project" && (
                                <Select value={libraryName} onChange={setLibraryName} placeholder="Select Project" style={{ width: "100%" }}>
                                    {projects.map((project) => (
                                        <Option key={project} value={project}>
                                            {project}
                                        </Option>
                                    ))}
                                </Select>
                            )}
                            {libraryType === "custom" && (
                                <Input
                                    size="small"
                                    placeholder="Add Library/Mine Type"
                                    type="text"
                                    value={libraryName}
                                    onChange={(e) => setLibraryName(e.target.value)}
                                />
                            )}
                            <Button type="primary" className="bg-secondary" icon={<PlusOutlined />} onClick={handleCreateLibrary}>
                                Create
                            </Button>
                        </div>

                        <div style={{ marginTop: "24px", flexWrap: "wrap" }}>
                            {Object.keys(libraries)
                                .filter((type) => type !== "moduleList")
                                .map((type) => (
                                    <Typography.Text className="bg-tertiary" key={type} style={{ display: "block", padding: "5px 10px", borderRadius: "5px", marginBottom: "5px" }}>
                                        {type}
                                    </Typography.Text>
                                ))}
                        </div>
                    </div>
                </div>
            </Box>
        </>
    );
};

const headerStyle: React.CSSProperties = {
    color: "white",
    fontWeight: "bold",
};

const boxStyle: React.CSSProperties = {
    padding: "2px 10px",
    width: "100%",
    borderRadius: "8px",
    background: "#f9f9f9",
};

const itemStyle: React.CSSProperties = {
    padding: "8px",
    margin: "5px 0",
    background: "#ddd",
    color: "#000",
    fontWeight: "400",
    borderRadius: "3px",
    cursor: "grab",
};

const libraryStyle: React.CSSProperties = {
    border: "2px dashed #ddd",
    padding: "10px",
    minHeight: "100px",
    borderRadius: "5px",
    background: "#fff",
};

const emptyTextStyle: React.CSSProperties = {
    fontSize: "12px",
    color: "#888",
};

export default ModuleLibrary;