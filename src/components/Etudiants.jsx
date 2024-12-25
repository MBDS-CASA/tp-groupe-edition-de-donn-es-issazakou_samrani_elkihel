import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Paper,
  IconButton,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';
import data from '../data.json';

function Etudiants() {
  const [loading, setLoading] = useState(true);
  const [etudiantsData, setEtudiantsData] = useState([]);
  const [currentEtudiant, setCurrentEtudiant] = useState({
    id: '',
    firstname: '',
    lastname: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    setTimeout(() => {
      const formattedData = data.map((item) => ({
        id: item.student.id,
        firstname: item.student.firstname,
        lastname: item.student.lastname,
      }));
      setEtudiantsData(formattedData);
      setLoading(false);
    }, 1000);
  }, []);

  // Vérification si le prénom commence par un caractère interdit
  const isFirstnameValid = (firstname) => {
    const forbiddenChars = ['-', '@'];
    return !forbiddenChars.some((char) => firstname.startsWith(char));
  };

  const handleAdd = () => {
    if (currentEtudiant.firstname.trim() === '' || currentEtudiant.lastname.trim() === '') {
      setSnackbar({
        open: true,
        message: 'Failed to add: Missing first or last name',
        severity: 'error',
      });
      return;
    }

    if (!isFirstnameValid(currentEtudiant.firstname)) {
      setSnackbar({
        open: true,
        message: 'Failed to add: First name cannot start with "-" or "@"',
        severity: 'error',
      });
      return;
    }

    const newEtudiant = {
      id: uuidv4(),
      firstname: currentEtudiant.firstname,
      lastname: currentEtudiant.lastname,
    };
    setEtudiantsData((prevData) => [...prevData, newEtudiant]);
    setCurrentEtudiant({ id: '', firstname: '', lastname: '' });
    setSnackbar({
      open: true,
      message: 'Student added successfully',
      severity: 'success',
    });
  };

  const handleEdit = (id) => {
    const etudiant = etudiantsData.find((item) => item.id === id);
    setCurrentEtudiant(etudiant);
  };

  const handleUpdate = () => {
    if (currentEtudiant.firstname.trim() === '' || currentEtudiant.lastname.trim() === '') {
      setSnackbar({
        open: true,
        message: 'Failed to update: Missing first or last name',
        severity: 'error',
      });
      return;
    }

    if (!isFirstnameValid(currentEtudiant.firstname)) {
      setSnackbar({
        open: true,
        message: 'Failed to update: First name cannot start with "-" or "@"',
        severity: 'error',
      });
      return;
    }

    setEtudiantsData(
        etudiantsData.map((item) =>
            item.id === currentEtudiant.id ? currentEtudiant : item
        )
    );
    setCurrentEtudiant({ id: '', firstname: '', lastname: '' });
    setSnackbar({
      open: true,
      message: 'Student updated successfully',
      severity: 'success',
    });
  };

  const handleDelete = (id) => {
    setEtudiantsData(etudiantsData.filter((item) => item.id !== id));
    setSnackbar({
      open: true,
      message: 'Student deleted successfully',
      severity: 'info',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'firstname', headerName: 'First Name', flex: 1 },
    { field: 'lastname', headerName: 'Last Name', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: (params) => (
          <strong>
            <IconButton
                color="primary"
                size="small"
                onClick={() => handleEdit(params.row.id)}
                style={{ marginRight: 8 }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
                color="secondary"
                size="small"
                onClick={() => handleDelete(params.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          </strong>
      ),
    },
  ];

  if (loading) {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
    );
  }

  return (
      <Paper elevation={3} sx={{ padding: 2, margin: 2 }}>
        <Typography variant="h5" component="div" gutterBottom>
          Étudiants
        </Typography>
        <Box mb={2}>
          <TextField
              label="ID"
              value={currentEtudiant.id}
              onChange={(e) => setCurrentEtudiant({ ...currentEtudiant, id: e.target.value })}
              sx={{ marginRight: 1 }}
              disabled // Désactivé pour éviter la modification manuelle de l'ID
          />
          <TextField
              label="First Name"
              value={currentEtudiant.firstname}
              onChange={(e) => setCurrentEtudiant({ ...currentEtudiant, firstname: e.target.value })}
              sx={{ marginRight: 1 }}
          />
          <TextField
              label="Last Name"
              value={currentEtudiant.lastname}
              onChange={(e) => setCurrentEtudiant({ ...currentEtudiant, lastname: e.target.value })}
              sx={{ marginRight: 1 }}
          />
          {currentEtudiant.id ? (
              <Button variant="contained" color="primary" onClick={handleUpdate}>
                Update
              </Button>
          ) : (
              <Button variant="contained" color="primary" onClick={handleAdd}>
                Add
              </Button>
          )}
        </Box>
        <DataGrid
            rows={etudiantsData}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
        />
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
  );
}

export default Etudiants;
