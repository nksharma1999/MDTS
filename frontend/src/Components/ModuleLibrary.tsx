import React, { useEffect, useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, 
  TablePagination, Box 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const ModuleLibrary = () => {
  const [moduleData, setModuleData] = useState([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedModules = localStorage.getItem('modules');
      if (storedModules) {
        const parsedModules = JSON.parse(storedModules);
        const flattenedModules = parsedModules.flat().filter((module:any) => 
          module?.parentModuleCode && module?.moduleName
        );
        setModuleData(flattenedModules);
      }
    } catch (error) {
      console.error('Error parsing local storage data:', error);
      setModuleData([]);
    }
  }, []);

  const handleRowClick = (module:any) => {
    navigate(`/module/${module.moduleName.toLowerCase().replace(' ', '-')}`, {
      state: module,
    });
  };

  const handleChangePage = (event, newPage) => {
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
    <Box sx={{ padding: '20px', maxWidth: '90%', margin: '0 auto', marginRight:'150px',height:'100%',width:'90%'}}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '20px',marginRight:'1350px' }}>
        Module Library
      </Typography>
      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={headerCellStyles}>Serial No.</TableCell>
              <TableCell sx={headerCellStyles}>Module Code</TableCell>
              <TableCell sx={headerCellStyles}>Module Name</TableCell>
              <TableCell sx={headerCellStyles}>Mine Type</TableCell>
              <TableCell sx={headerCellStyles}>Module Level</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {moduleData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((module, index) => (
              <TableRow
                key={index}
                hover
                onClick={() => handleRowClick(module)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'action.hover' },
                  transition: 'background-color 0.3s ease',
                  borderBottom: 'none',
                }}
                
              >
                <TableCell sx={{ borderBottom: 'none' }}>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell sx={{ borderBottom: 'none' }}>{module.parentModuleCode}</TableCell>
                <TableCell sx={{ borderBottom: 'none' }}>{module.moduleName}</TableCell>
                <TableCell sx={{ borderBottom: 'none' }}>{module.mineType}</TableCell>
                <TableCell sx={{ borderBottom: 'none' }}>{module.level}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={moduleData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]} // Hide rows per page selection
        sx={{ marginTop: '10px' }}
      />
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
