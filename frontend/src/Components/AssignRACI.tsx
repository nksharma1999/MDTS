import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Checkbox,
  ListItemText,
  InputAdornment,
  Chip
} from '@mui/material';

const UserRolesPage = () => {
  const navigate = useNavigate();
  const users = ['User 1', 'User 2', 'User 3', 'User 4', 'User 5'];

  const [responsible, setResponsible] = useState([]);
  const [accountable, setAccountable] = useState([]);
  const [consulted, setConsulted] = useState([]);
  const [informed, setInformed] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearch, setUserSearch] = useState('');

  const handleChange = (event, setRole) => {
    setRole(event.target.value);
  };

  const handleSave = () => {
    navigate('/manageuser');
  };

  const filteredUsers = users.filter(user =>
    user.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div style={{ padding: '30px', backgroundColor: '#fff', width: '50%' }}>
      <Typography variant="h5" style={{ fontWeight: 'bold', marginBottom: '-20px' }}>
        Assign User Roles
      </Typography>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#4F7942', color: 'white' }}>
              <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Role</TableCell>
              <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Assigned Users</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[{ label: 'Responsible', state: responsible, setState: setResponsible },
            { label: 'Accountable', state: accountable, setState: setAccountable },
            { label: 'Consulted', state: consulted, setState: setConsulted },
            { label: 'Informed', state: informed, setState: setInformed }].map(({ label, state, setState }) => (
              <TableRow key={""} hover>
                <TableCell>{label}</TableCell>
                <TableCell>
                  <FormControl fullWidth>
                    <InputLabel>{""}</InputLabel>
                    <Select
  multiple
  value={state}
  onChange={(e) => handleChange(e, setState)}
  renderValue={(selected) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px',flexDirection:"column" }}>
      {selected.map((value) => (
        <Chip
          key={value}
          label={value}
          sx={{
            fontSize: '0.8rem', // Smaller font size
            height: '24px',     // Smaller height
            borderRadius: '12px', // Rounded corners
            padding: '0 px',   
            width:"100px"// Padding inside the Chip
          }}
        />
      ))}
    </div>
  )}
>


                      <MenuItem>
                        <TextField
                          placeholder="Search users"
                          variant="standard"
                          fullWidth
                          onChange={(e) => setUserSearch(e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </MenuItem>
                      {filteredUsers.map((user, index) => (
                        <MenuItem key={index} value={user}>
                          <Checkbox checked={state.indexOf(user) > -1} />
                          <ListItemText primary={user} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container spacing={1} justifyContent="flex-end" style={{ marginTop: '10px' }}>
        <Grid item>
          <Button variant="outlined" style={{ textTransform: 'none', fontWeight: 'bold' }}>Cancel</Button>
        </Grid>
        <Grid item>
          <Button variant="contained" style={{ textTransform: 'none', fontWeight: 'bold' }} onClick={handleSave}>Save</Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default UserRolesPage;
