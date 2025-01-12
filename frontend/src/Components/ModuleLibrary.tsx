import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const ModuleLibrary = () => {
  const [moduleData, setModuleData] = useState([]);
  const [page, setPage] = useState(0);  // State to handle pagination
  const rowsPerPage = 10;  // Fixed number of rows per page
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
      }
    } catch (error) {
      console.error('Error parsing local storage data:', error);
      setModuleData([]); // Fallback to an empty array on error
    }
  }, []);

  const handleRowClick = (module: any) => {
    navigate(`/module/${module.moduleName.toLowerCase().replace(' ', '-')}`, {
      state: module, // Pass the module data
    });
  };

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  if (moduleData.length === 0) {
    return <Typography variant="h6" align="center">No data available</Typography>;
  }

  return (
    <div style={styles.container}>
      <Typography variant="h5" gutterBottom style={styles.title}>
        Module Library
      </Typography>
      <TableContainer component={Paper} style={styles.tableContainer}>
        <Table style={styles.table}>
          <TableHead>
            <TableRow>
              <TableCell style={styles.headerCell}>Serial No.</TableCell>
              <TableCell style={styles.headerCell}>Module Code</TableCell>
              <TableCell style={styles.headerCell}>Module Name</TableCell>
              <TableCell style={styles.headerCell}>Mine Type</TableCell>
              <TableCell style={styles.headerCell}>Module Level</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {moduleData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((module, index) => (
              <TableRow
                key={index}
                hover
                onClick={() => handleRowClick(module)}
                style={styles.tableRow}
              >
                <TableCell style={styles.tableCell}>{page * rowsPerPage + index + 1}</TableCell> {/* Serial No. */}
                <TableCell style={styles.tableCell}>{module.parentModuleCode}</TableCell>
                <TableCell style={styles.tableCell}>{module.moduleName}</TableCell>
                <TableCell style={styles.tableCell}>{module.mineType}</TableCell>
                <TableCell style={styles.tableCell}>{module.level}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination component without rows per page */}
      <TablePagination
        component="div"
        count={moduleData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]} // This is crucial to remove the rows per page selection
      />
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '80%',
    margin: '0 auto',
  },
  title: {
    fontWeight: 600,
    textAlign: 'center',
    marginBottom: '20px',
  },
  tableContainer: {
    maxHeight: '500px',
    overflowY: 'auto',
  },
  table: {
    minWidth: 650,
  },
  tableRow: {
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  headerCell: {
    backgroundColor: 'grey',  // Color for header
    color: 'white',
    fontWeight: 'bold',
    padding: '12px 15px',
    fontSize: '14px',
  },
  tableCell: {
    padding: '12px 15px',
    fontSize: '14px',
    textAlign: 'left',
  },
};

export default ModuleLibrary;
