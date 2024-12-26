import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  IconButton,
  TextField,
  Button,
  Snackbar,
  Alert,
  Paper,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import data from '../data.json'; // Adjust the data source as needed

function Etudiants() {
  const [loading, setLoading] = useState(true);
  const [etudiantsData, setEtudiantsData] = useState([]);
  const [currentEtudiant, setCurrentEtudiant] = useState({ id: null, firstname: '', lastname: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    setTimeout(() => {
      const formattedData = data.map((item) => ({
        id: item.student.id,
        firstname: item.student.firstname,
        lastname: item.student.lastname,
      }));
      setEtudiantsData(formattedData);
      setLoading(false);
    }, 1000); // Simulate loading delay
  }, []);

  const handleAdd = (event) => {
    event.preventDefault(); // Prevent default form submission

    if (currentEtudiant.firstname.trim() === '' || currentEtudiant.lastname.trim() === '') {
      setSnackbar({ open: true, message: 'Failed to add: Missing first or last name', severity: 'error' });
      return;
    }

    const newId = Date.now();
    if (etudiantsData.some((item) => item.id === newId)) {
      setSnackbar({ open: true, message: 'Failed to add: Duplicate ID', severity: 'error' });
      return;
    }

    const newEtudiant = { id: newId, ...currentEtudiant };
    setEtudiantsData((prevData) => [...prevData, newEtudiant]);
    setCurrentEtudiant({ id: null, firstname: '', lastname: '' });
    setSnackbar({ open: true, message: 'Student added successfully', severity: 'success' });
  };

  const handleEdit = (id) => {
    const etudiant = etudiantsData.find((item) => item.id === id);
    setCurrentEtudiant(etudiant);
  };

  const handleUpdate = (event) => {
    event.preventDefault(); // Prevent default form submission

    if (currentEtudiant.firstname.trim() === '' || currentEtudiant.lastname.trim() === '') {
      setSnackbar({ open: true, message: 'Failed to update: Missing first or last name', severity: 'error' });
      return;
    }

    setEtudiantsData(
        etudiantsData.map((item) =>
            item.id === currentEtudiant.id ? currentEtudiant : item
        )
    );
    setCurrentEtudiant({ id: null, firstname: '', lastname: '' });
    setSnackbar({ open: true, message: 'Student updated successfully', severity: 'success' });
  };

  const handleDelete = (id) => {
    setEtudiantsData(etudiantsData.filter((item) => item.id !== id));
    setSnackbar({ open: true, message: 'Student deleted successfully', severity: 'info' });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const columns = [
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
            >
              <EditIcon />
            </IconButton>
            <IconButton
                color="error"
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
        <form onSubmit={currentEtudiant.id ? handleUpdate : handleAdd}>
          <Box mb={2}>
            <TextField
                label="First Name"
                value={currentEtudiant.firstname}
                onChange={(e) =>
                    setCurrentEtudiant({ ...currentEtudiant, firstname: e.target.value })
                }
                sx={{ marginRight: 1 }}
            />
            <TextField
                label="Last Name"
                value={currentEtudiant.lastname}
                onChange={(e) =>
                    setCurrentEtudiant({ ...currentEtudiant, lastname: e.target.value })
                }
                sx={{ marginRight: 1 }}
            />
            {currentEtudiant.id ? (
                <>
                  <Button variant="contained" color="primary" type="submit">
                    Update
                  </Button>
                  <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDelete(currentEtudiant.id)}
                      style={{ marginLeft: 8 }}
                  >
                    Delete
                  </Button>
                </>
            ) : (
                <Button variant="contained" color="primary" type="submit">
                  Add
                </Button>
            )}
          </Box>
        </form>
        <DataGrid
            rows={etudiantsData}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
        />
        <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
        >
          <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
  );
}

export default Etudiants;