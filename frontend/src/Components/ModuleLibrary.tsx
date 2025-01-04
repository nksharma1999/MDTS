import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const ModuleLibrary = () => {
  const [moduleData, setModuleData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedModules = localStorage.getItem('modules');
      if (storedModules) {
        const parsedModules = JSON.parse(storedModules);

        const flattenedModules = parsedModules.flat().filter((module) => 
          module?.parentModuleCode && module?.moduleName
        );

        setModuleData(flattenedModules);
      }
    } catch (error) {
      console.error('Error parsing local storage data:', error);
      setModuleData([]); // Fallback to an empty array on error
    }
  }, []);

  const handleTileClick = (module) => {
    navigate(`/module/${module.moduleName.toLowerCase().replace(' ', '-')}`, {
      state: module, // Pass the module data
    });
  };

  if (moduleData.length === 0) {
    return <Typography variant="h6" align="center">No data available</Typography>;
  }

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h5" gutterBottom>
        Module Library
      </Typography>
      <Grid container spacing={3}>
        {moduleData.map((module, index) => (
          <Grid item xs={12} sm={6} md={4} key={`module-${index}`}>
            <div
              style={{
                padding: '20px',
                backgroundColor: '#f0f4f8',
                textAlign: 'center',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onClick={() => handleTileClick(module)}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Typography variant="h6" gutterBottom>
                Module Code: {module.parentModuleCode}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Module Name: {module.moduleName}
              </Typography>
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ModuleLibrary;
