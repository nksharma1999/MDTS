import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Box, IconButton } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Select } from "antd";
import '../styles/module-library.css';
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
const { Option } = Select;

const ModuleLibrary = () => {
  const [moduleData, setModuleData] = useState<any>([]);
  const [filteredData, setFilteredData] = useState<any>([]);
  const [_searchTerm, setSearchTerm] = useState<any>("");
  const [page, setPage] = useState<any>(0);
  const rowsPerPage = 10;
  const [selectedOption, setSelectedOption] = useState<any>("");
  const [newLibraryType, setNewLibraryType] = useState<any>("");
  const [libraries, setLibraries] = useState<any>({ moduleList: [] });

  const [libraryType, setLibraryType] = useState("custom");
  const projects = ["Project A", "Project B", "Project C"];
  useEffect(() => {
    try {
      const storedModules = localStorage.getItem("modules");
      if (storedModules) {
        const parsedModules = JSON.parse(storedModules)
          .flat()
          .filter((module: any) => module?.parentModuleCode && module?.moduleName);

        setModuleData(parsedModules);
        setFilteredData(parsedModules);
        setLibraries((prev: any) => ({ ...prev, moduleList: parsedModules }));
      }
    } catch (error) {
      console.error("Error parsing local storage data:", error);
      setModuleData([]);
      setFilteredData([]);
    }
  }, []);

  const handleSearch = (event: any) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = moduleData.filter(
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

  const addLibraryType = () => {
    if (newLibraryType && !libraries[newLibraryType]) {
      setLibraries((prev: any) => ({ ...prev, [newLibraryType]: [] }));
      setNewLibraryType("");
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceId = source.droppableId;
    const destinationId = destination.droppableId;

    if (sourceId === destinationId) return;

    const draggedModule = libraries[sourceId][source.index];

    setLibraries((prev: any) => {
      const updatedSource = [...prev[sourceId]];
      updatedSource.splice(source.index, 1);

      const updatedDestination = [...(prev[destinationId] || []), draggedModule];

      return {
        ...prev,
        [sourceId]: updatedSource,
        [destinationId]: updatedDestination,
      };
    });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="page-heading-module-library">
        <span>Module Library</span>
      </div>
      <div className="headings">
        <div className="heading-one">Modules</div>
        <div className="heading-two">Libraries</div>
        <div className="heading-three">Create Libraries</div>
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
            <Droppable droppableId="moduleList">
              {(provided) => (
                <TableContainer
                  component={Paper}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ borderRadius: "0px" }}
                >
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#248590" }}>
                        <TableCell sx={{ color: "white", fontWeight: "bold", padding: "5px 10px" }}>
                          Module Code
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold", padding: "5px 10px" }}>
                          Module Name
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold", padding: "5px 10px" }}>
                          Mine Type
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredData
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((module: any, index: any) => (
                          <Draggable
                            key={module.parentModuleCode}
                            draggableId={module.parentModuleCode}
                            index={index}
                          >
                            {(provided) => (
                              <TableRow
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <TableCell style={{ padding: "10px" }}>{module.parentModuleCode}</TableCell>
                                <TableCell style={{ padding: "10px" }}>{module.moduleName}</TableCell>
                                <TableCell style={{ padding: "10px" }}>{module.mineType}</TableCell>
                              </TableRow>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Droppable>
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

        <div className="create-library-section">
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

          <div style={{ padding: "0px 10px" }}>
            {Object.keys(libraries)
              .filter((type) => type !== "moduleList")
              .map((type) => (
                <Droppable droppableId={type} key={type}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        minHeight: "100px",
                        padding: "8px",
                        border: "1px dashed gray",
                        marginTop: "16px",
                      }}
                    >
                      <Typography.Title level={5}>{type}</Typography.Title>

                      {libraries[type].map((module: any, index: any) => (
                        <Draggable key={module.parentModuleCode} draggableId={module.parentModuleCode} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                padding: "8px",
                                backgroundColor: "#f0f0f0",
                                borderRadius: "4px",
                                marginBottom: "8px",
                              }}
                            >
                              {module.moduleName}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
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
                <Select value={newLibraryType} onChange={setNewLibraryType} placeholder="Select Project" style={{ width: "100%" }}>
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
                  value={newLibraryType}
                  onChange={(e) => setNewLibraryType(e.target.value)}
                />
              )}
              <Button type="primary" className="bg-secondary" icon={<PlusOutlined />} onClick={addLibraryType}>
                Create
              </Button>
            </div>

            <div style={{ marginTop: "24px", flexWrap: "wrap" }}>
              {Object.keys(libraries)
                .filter((type) => type !== "moduleList")
                .map((type) => (
                  <Typography.Text className="bg-tertiary" key={type} style={{ display: "block", padding: "5px 10px", borderRadius: "5px" }}>
                    {type}
                  </Typography.Text>
                ))}
            </div>
          </div>
        </div>
      </Box>
    </DragDropContext>
  );
};

export default ModuleLibrary;