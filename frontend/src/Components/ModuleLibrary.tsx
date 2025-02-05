import React, { useEffect, useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, 
  TablePagination, Box, TextField, InputAdornment ,IconButton
} from '@mui/material';
// import { Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, ArrowForward, Delete, FilterList, Search } from "@mui/icons-material";

export const ModuleLibrary = () => {
  const [moduleData, setModuleData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const navigate = useNavigate();
  

  useEffect(() => {
    try {
      const storedModules = localStorage.getItem('modules');
      if (storedModules) {
        const parsedModules = JSON.parse(storedModules);
        const flattenedModules = parsedModules.flat().filter((module: any) => 
          module?.parentModuleCode && module?.moduleName
        );
        setModuleData(flattenedModules);
        setFilteredData(flattenedModules);
      }
    } catch (error) {
      console.error('Error parsing local storage data:', error);
      setModuleData([]);
      setFilteredData([]);
    }
  }, []);

  const handleRowClick = (module: any) => {
    navigate(`/module/${module.moduleName.toLowerCase().replace(' ', '-')}`, {
      state: module,
    });
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = moduleData.filter((module) =>
      module.moduleName.toLowerCase().includes(value) || 
      module.parentModuleCode.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
    setPage(0); // Reset to the first page on new search
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  if (moduleData.length === 0) {
    return (
      <Box 
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}
      >
        <Typography variant="h6" color="textSecondary">
          No data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', padding: '5px', width: '100%', height: '100vh', background: "#fff" }}>
      
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Left Section: Title */}
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "green" }}>
        Tool Bar
      </Typography>

      {/* Middle Section: Navigation Buttons & Search Bar */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <IconButton color="primary">
          <FilterList />
        </IconButton>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search code, name,type, levels"
          onChange={handleSearch}
          sx={{ width: "300px" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      </Box>

      {/* Content */}
      <Box sx={{ display: 'flex', flex: 1, gap: '0px', }}>
        {/* Left Section: Search and Table */}
        <Box sx={{ flex: 3, display:"flex", flexDirection: 'column' ,marginTop:"10px"}}>
          <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 1, flex: 1 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#4F7942' }}>
                  <TableCell sx={headerCellStyles}>Serial No.</TableCell>
                  <TableCell sx={headerCellStyles}>Module Code</TableCell>
                  <TableCell sx={headerCellStyles}>Module Name</TableCell>
                  <TableCell sx={headerCellStyles}>Mine Type</TableCell>
                  <TableCell sx={headerCellStyles}>Module Level</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((module, index) => (
                  <TableRow
                    key={index}
                    hover
                    onClick={() => handleRowClick(module)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: 'action.hover' },
                      transition: 'background-color 0.3s ease',
                    }}
                  >
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{module.parentModuleCode}</TableCell>
                    <TableCell>{module.moduleName}</TableCell>
                    <TableCell>{module.mineType}</TableCell>
                    <TableCell>{module.level}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[]} // Hide rows per page selection
            sx={{ marginTop: '0px' }}
          />
        </Box>

        {/* Right Section: Image */}
        <Box sx={{ flex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img
            src="Mining 3.jpg" // Replace with your image URL
            alt="Module Library Illustration"
            style={{
              width: '100%',
              height: '100%',
              // objectFit: 'cover',
              marginBottom:"12%",
              marginTop:"15%",
              maxHeight: '100%',
              borderRadius: '2px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              margin:"0px"
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

const headerCellStyles = {
  color: 'white',
  fontWeight: 'bold',
  textAlign: 'left',
  fontSize: '14px',
  padding: '12px 15px',
};

export default ModuleLibrary;
