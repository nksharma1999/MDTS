import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Box, IconButton } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { Select, Input, Button, Typography, message, Modal } from "antd";
import { SearchOutlined, DeleteOutlined, RobotOutlined } from "@ant-design/icons";
import "../styles/module-library.css";
import { Link } from "react-router-dom";
import { getCurrentUserId } from '../Utils/moduleStorage';
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
  duration?: string;
}

interface Library {
  name: string;
  mineType: string;
  items: Module[];
  userId: string;
  id: string;
}

const ModuleLibrary = () => {
  const [_searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const rowsPerPage = 10;
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [newLibraryName, setNewLibraryName] = useState<string>("");
  const [newLibraryMineType, setNewLibraryMineType] = useState<string>("");
  const [newLibraryMineTypeFilter, setNewLibraryMineTypeFilter] = useState<string>("");
  const [libraryType, setLibraryType] = useState("custom");
  const [filteredData, setFilteredData] = useState<Module[]>([]);
  const [modulesData, setModulesData] = useState<Module[]>([]);
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [selectedLibrary, setSelectedLibrary] = useState<Library | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [projects, setProjects] = useState<string[]>([]);
  const [allProjects, setAllProjects] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | undefined>(undefined);
  const [mineTypes, setMineTypes] = useState<any>([]);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
      } catch (err) {
        console.error("Error parsing user", err);
      }
    }
  }, []);

  useEffect(() => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = loggedInUser?.id;
      const userProjectsKey = `projects_${userId}`;
      const storedProjects = JSON.parse(localStorage.getItem(userProjectsKey) || "[]");

      if (!Array.isArray(storedProjects) || storedProjects.length === 0) {
        console.warn("No projects found for the user.");
        setProjects([]);
        setAllProjects([]);
        return;
      }

      const projectNames = storedProjects.map((project: any) => project.projectParameters.projectName);
      setProjects(projectNames);
      setAllProjects(storedProjects);
    } catch (error) {
      console.error("Error fetching projects from local storage:", error);
    }
  }, []);

  useEffect(() => {
    const storedModules = localStorage.getItem("modules");
    if (storedModules) {
      try {
        const parsedModules = JSON.parse(storedModules);
        setModulesData(parsedModules);
        setFilteredData(parsedModules);
      } catch (error) {
        console.error("Error parsing modules from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      try {
        const storageKey = `libraries_${currentUser.id}`;
        const storedLibraries = localStorage.getItem(storageKey);

        if (storedLibraries) {
          setLibraries(JSON.parse(storedLibraries));
        } else {
          setLibraries([]);
        }
      } catch (err) {
        console.error("Error parsing libraries from localStorage", err);
        setLibraries([]);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    const storedMineTypes = localStorage.getItem("mineTypes");
    const parsedMineTypes: string[] = storedMineTypes ? JSON.parse(storedMineTypes) : [];
    setMineTypes(parsedMineTypes);
  }, []);

  const updateLibraryInLocalStorage = (updatedLibrary: Library) => {
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        console.error("User ID not found. Cannot update library.");
        return;
      }

      const storageKey = `libraries_${userId}`;
      const storedLibraries = localStorage.getItem(storageKey);
      let librariesArr: Library[] = [];

      if (storedLibraries) {
        try {
          librariesArr = JSON.parse(storedLibraries);
        } catch (err) {
          console.error("Error parsing libraries", err);
        }
      }

      const index = librariesArr.findIndex(lib => lib.id === updatedLibrary.id);
      if (index !== -1) {
        librariesArr[index] = updatedLibrary;
      } else {
        librariesArr.push(updatedLibrary);
      }

      localStorage.setItem(storageKey, JSON.stringify(librariesArr));
    } catch (error) {
      console.error("Error updating library in localStorage:", error);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = modulesData.filter(
      (module: Module) =>
        module.moduleName.toLowerCase().includes(value) ||
        module.parentModuleCode.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
    setPage(0);
  };

  const handleChangePage = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChange = (value: string) => {
    setSelectedOption(value);
  };

  const handleCreateLibrary = () => {
    if (selectedLibrary) handleSaveLibrary();
    if (!newLibraryName.trim() || !newLibraryMineType.trim()) {
      message.error("Library name and Mine Type are mandatory.");
      return;
    }
    if (!currentUser) {
      message.error("User not found.");
      return;
    }
    const newLibrary: Library = {
      name: newLibraryName,
      mineType: newLibraryMineType,
      items: [],
      userId: currentUser.id,
      id: Date.now().toString()
    };
    const updatedLibraries = [...libraries, newLibrary];
    setLibraries(updatedLibraries);
    updateLibraryInLocalStorage(newLibrary);
    setSelectedLibrary(newLibrary);
    setNewLibraryName("");
    setNewLibraryMineType("");
    message.success("New library created! You can now drag and drop modules.");
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, module: Module) => {
    e.dataTransfer.setData("application/json", JSON.stringify(module));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!selectedLibrary) return;
    const data = e.dataTransfer.getData("application/json");
    const moduleData: Module = JSON.parse(data);
    if (moduleData.mineType !== selectedLibrary.mineType) {
      message.error(
        `Module Mine Type (${moduleData.mineType}) does not match library Mine Type (${selectedLibrary.mineType}).`
      );
      return;
    }
    if (selectedLibrary.items.some(item => item.moduleName === moduleData.moduleName)) {
      message.info("Module already exists in this library.");
      return;
    }
    const updatedLibrary = { ...selectedLibrary, items: [...selectedLibrary.items, moduleData] };
    setSelectedLibrary(updatedLibrary);
    setLibraries(prev => prev.map(lib => lib.id === updatedLibrary.id ? updatedLibrary : lib));
    updateLibraryInLocalStorage(updatedLibrary);
  };


  const handleDeleteModule = (modIndex: number) => {
    if (!selectedLibrary) return;
    Modal.confirm({
      title: "Are you sure you want to delete this module?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      cancelText: "Cancel",
      okButtonProps: { danger: true },
      onOk: () => {
        const updatedLibrary = {
          ...selectedLibrary,
          items: selectedLibrary.items.filter((_, index) => index !== modIndex),
        };

        setSelectedLibrary(updatedLibrary);
        setLibraries(prev =>
          prev.map(lib => (lib.id === updatedLibrary.id ? updatedLibrary : lib))
        );
        updateLibraryInLocalStorage(updatedLibrary);
      },
    });
  };

  const handleSaveLibrary = () => {
    if (selectedLibrary) {
      updateLibraryInLocalStorage(selectedLibrary);
      message.success("Library saved successfully!");
      setSelectedLibrary(null);
    }
  };

  const handleProjectChange = (value: string) => {
    setSelectedProject(value);
    const selected: any = allProjects.find((project: any) => project.projectParameters.projectName === value);
    setNewLibraryMineType(selected?.projectParameters.typeOfMine || null);
    setNewLibraryName(value);
  };

  return (
    <>
      <div className="page-heading-module-library">
        <span>Module Library</span>
      </div>

      <div className="headings">
        <div className="heading-one">
          <span>Modules</span>
        </div>
        <div className="heading-two">
          <span>Libraries</span>
        </div>
        <div className="heading-three">
          <span>Create Module Group</span>
        </div>
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
                <Option value="">Select Module Type</Option>
                <Option value="option1">MDTS Module</Option>
                <Option value="option2">Custom Module</Option>
              </Select>

              <Select
                size="small"
                placeholder="Mine Type"
                value={newLibraryMineTypeFilter || undefined}
                style={{ width: "100%", height: "26px" }}
                disabled={libraryType === "project"}
              >
                {mineTypes.map((type: any) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>

              <IconButton color="primary" style={{ padding: "0px" }}>
                <FilterList />
              </IconButton>
            </Box>
            <hr style={{ margin: 0, marginBottom: "8px" }} />
            <TableContainer component={Paper} style={{ marginTop: "5px" }}>
              <Table>
                <TableHead style={{ display: "block", background: "#258790", color: "white" }}>
                  <TableRow style={{ display: "flex", width: "100%" }}>
                    <TableCell style={{ color: "white", fontWeight: "bold", flex: "0 0 30%", padding: "5px 10px" }}>Module Code</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold", flex: "0 0 40%", padding: "5px 10px" }}>Module Name</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold", flex: "0 0 30%", textAlign: "center", padding: "5px 10px" }}>Mine Type</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody style={{ display: "block", overflowY: "auto", maxHeight: "calc(100vh - 244px)" }}>
                  {modulesData.length > 0 ? (
                    modulesData.map((module, index) => (
                      <TableRow
                        key={index}
                        draggable
                        onDragStart={(e) => handleDragStart(e, module)}
                        style={{ cursor: "grab", display: "flex", width: "100%" }}
                      >
                        <TableCell style={{ flex: "0 0 30%", padding: "8px" }}>{module.parentModuleCode}</TableCell>
                        <TableCell style={{ flex: "0 0 40%", padding: "8px" }}>{module.moduleName}</TableCell>
                        <TableCell style={{ flex: "0 0 30%", padding: "8px", textAlign: "center" }}>{module.mineType}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <div style={{ padding: "10px", fontSize: "12px", color: "#dddd", display: "flex", justifyContent: "center" }}>
                      No Module available. Please add a Module to get started.
                      <div style={{ marginLeft: "30px" }}>
                        <Button size="small" className="bg-secondary" icon={<RobotOutlined />}>
                          <Link style={{ color: "inherit", textDecoration: "none" }} to={"/modules"}>New</Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </TableBody>
              </Table>

            </TableContainer>

            {/* <TablePagination
              component="div"
              count={filteredData.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[]}
              sx={{ mt: 2 }}
            /> */}
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
          <div style={{ height: "calc(100vh - 245px)" }}>
            {selectedLibrary ? (
              <div style={boxStyle} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
                <strong>
                  {selectedLibrary.name} ({selectedLibrary.mineType})
                </strong>
                {selectedLibrary.items.length === 0 ? (
                  <p style={emptyTextStyle}>Drop modules here</p>
                ) : null}
                {selectedLibrary.items.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "10px" }}>
                    <span style={itemStyle}>
                      {item.moduleName}
                    </span>
                    <span>
                      <DeleteOutlined
                        onClick={() => handleDeleteModule(idx)}
                        style={deleteButtonStyle}
                      />
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ ...boxStyle, textAlign: "center", padding: "20px" }}>
                <p>Please select a library from the right side or create a new one.</p>
              </div>
            )}
          </div>
          <div>
            {selectedLibrary && (
              <>
                <hr />
                <Button style={{ float: "right", height: "26px", marginTop: "5px", marginRight: "10px" }} type="primary" className="bg-secondary" onClick={handleSaveLibrary}>
                  Save
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="library-details">
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: "10px", padding: "10px" }}>
            <Select
              size="small"
              value={libraryType}
              onChange={(value) => {
                setLibraryType(value);
                setNewLibraryName("");
                setNewLibraryMineType("");
              }}
              disabled
              style={{ width: "100%", height: "26px", fontSize: "12px" }}
            >
              {/* <Option value="project">Project Based Library</Option> */}
              <Option value="custom">Custom Library</Option>
            </Select>
            <IconButton color="primary" style={{ padding: "0px" }}>
              <FilterList />
            </IconButton>
          </Box>
          <hr style={{ margin: 0, marginBottom: "8px" }} />
          <div style={{ padding: "0px 10px" }}>

            <div style={{ display: "flex", gap: "8px", marginTop: "5px" }}>
              {libraryType === "project" ? (
                <Select
                  value={newLibraryName || undefined}
                  onChange={handleProjectChange}
                  placeholder="Select Project"
                  style={{ width: "100%", height: "26px" }}
                >
                  {projects.map((project) => (
                    <Option key={project} value={project}>
                      {project}
                    </Option>
                  ))}
                </Select>
              ) : (
                <Input
                  size="small"
                  placeholder="Enter Library Name"
                  type="text"
                  value={newLibraryName}
                  onChange={(e) => setNewLibraryName(e.target.value)}
                />
              )}

              <Select
                size="small"
                placeholder="Mine Type"
                value={newLibraryMineType || undefined}
                onChange={(value) => setNewLibraryMineType(value)}
                style={{ width: "100%", height: "26px" }}
                disabled={libraryType === "project"}
              >
                {mineTypes.map((type: any) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>

              <Button style={{ height: "26px" }} type="primary" className="bg-secondary" onClick={handleCreateLibrary}>
                Create
              </Button>
            </div>

            <div style={{ marginTop: "24px", flexWrap: "wrap" }}>
              {libraries.map((library) => (
                <Typography.Text
                  onClick={() => setSelectedLibrary(library)}
                  key={library.id}
                  style={{
                    display: "block",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    marginBottom: "5px",
                    cursor: "pointer",
                    background: selectedLibrary && selectedLibrary.id === library.id ? "#d0ebff" : "#eee"
                  }}
                >
                  {library.name} ({library.mineType})
                </Typography.Text>
              ))}
            </div>
          </div>
        </div>
      </Box>
    </>
  );
};

const boxStyle: React.CSSProperties = {
  padding: "10px",
  width: "98.5%",
  borderRadius: "8px",
  margin: "4px",
  paddingBottom: "50px",
  border: "2px dashed #ddd"
};

const deleteButtonStyle: React.CSSProperties = {
  marginTop: "4px",
  backgroundColor: "#ee4d4d",
  color: "#fff",
  cursor: "pointer",
  padding: "10px",
  borderRadius: "5px"
};

const itemStyle: React.CSSProperties = {
  padding: "6px",
  margin: "5px 0",
  width: "100%",
  borderRadius: "5px",
  background: "#ddd",
  color: "#000",
  cursor: "grab",
  fontWeight: "400",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between"
};

const emptyTextStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#888"
};

export default ModuleLibrary;
