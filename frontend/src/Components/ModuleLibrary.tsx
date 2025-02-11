import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography,
  TablePagination, Box, TextField, InputAdornment, IconButton, Button
} from '@mui/material';
import { Search, FilterList, Add } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export const ModuleLibrary = () => {
  const [moduleData, setModuleData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const [newMineType, setNewMineType] = useState('');
  const [libraries, setLibraries] = useState({
    moduleList: []
  });

  useEffect(() => {
    try {
      const storedModules = localStorage.getItem('modules');
      if (storedModules) {
        const parsedModules = JSON.parse(storedModules).flat().filter(module => module?.parentModuleCode && module?.moduleName);
        setModuleData(parsedModules);
        setFilteredData(parsedModules);
        setLibraries(prev => ({ ...prev, moduleList: parsedModules }));
      }
    } catch (error) {
      console.error('Error parsing local storage data:', error);
      setModuleData([]);
      setFilteredData([]);
    }
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = moduleData.filter(module =>
      module.moduleName.toLowerCase().includes(value) || module.parentModuleCode.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
    setPage(0);
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const addMineType = () => {
    if (newMineType && !libraries[newMineType]) {
      setLibraries(prev => ({ ...prev, [newMineType]: [] }));
      setNewMineType('');
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
  
    const { source, destination } = result;
    const sourceId = source.droppableId;
    const destinationId = destination.droppableId;
  
    if (sourceId === destinationId) return;
  
    const draggedModule = libraries[sourceId][source.index];
  
    setLibraries((prev) => {
      const updatedSource = [...prev[sourceId]];
      updatedSource.splice(source.index, 1);
  
      const updatedDestination = [...prev[destinationId], draggedModule];
  
      return {
        ...prev,
        [sourceId]: updatedSource,
        [destinationId]: updatedDestination,
      };
    });
  };
  
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box sx={{ display: 'flex', width: '100%', height: '100vh' }}>
        <Box sx={{ flex: 3, padding: 2 }}>
          <Typography variant="h6" color="green" sx={{ fontWeight: 'bold' }}>Tool Bar</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <IconButton color="primary"><FilterList /></IconButton>
            <TextField
              variant="outlined" size="small" placeholder="Search code, name, type"
              onChange={handleSearch} sx={{ width: '300px' }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
            />
          </Box>
          <Droppable droppableId="moduleList">
            {(provided) => (
              <TableContainer component={Paper} ref={provided.innerRef} {...provided.droppableProps}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#4F7942' }}>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Module Code</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Module Name</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Mine Type</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((module, index) => (
                      <Draggable key={module.parentModuleCode} draggableId={module.parentModuleCode} index={index}>
                        {(provided) => (
                          <TableRow ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <TableCell>{module.parentModuleCode}</TableCell>
                            <TableCell>{module.moduleName}</TableCell>
                            <TableCell>{module.mineType}</TableCell>
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
            component="div" count={filteredData.length} page={page} rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage} rowsPerPageOptions={[]} sx={{ mt: 2 }}
          />
        </Box>

        <Box sx={{ flex: 3, padding: 2, borderLeft: '1px solid #ddd' }}>
          {/* <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Create Library</Typography> */}
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField
              size="small" label="Add Library/Mine Type" value={newMineType}
              onChange={(e) => setNewMineType(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={addMineType} startIcon={<Add />}>Create</Button>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3 }}>Library Details</Typography>
          {Object.keys(libraries).filter(type => type !== "moduleList").map((type) => (
            <Droppable droppableId={type} key={type}>
              {(provided) => (
                <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ minHeight: '100px', p: 1, border: '1px dashed gray', mt: 2 }}>
                  <Typography variant="h6">{type}</Typography>
                  {libraries[type].map((module, index) => (
                    <Draggable key={module.parentModuleCode} draggableId={module.parentModuleCode} index={index}>
                      {(provided) => (
                        <Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} sx={{ p: 1, backgroundColor: '#f0f0f0', borderRadius: '4px', mb: 1 }}>
                          {module.moduleName}
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          ))}
        </Box>
      </Box>
    </DragDropContext>
  );
};

export default ModuleLibrary;