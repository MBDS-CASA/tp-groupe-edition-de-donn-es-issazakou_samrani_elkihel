import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, IconButton, TextField, Button, Snackbar, Alert, Paper, Grid, Card, CardContent } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import data from '../data.json';

function Notes() {
    const [loading, setLoading] = useState(true);
    const [notesData, setNotesData] = useState([]);
    const [currentNote, setCurrentNote] = useState({ id: null, course: '', student: '', date: '', grade: '' });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [statistics, setStatistics] = useState({ averageGrade: 0, studentCount: 0, averageGradePerCourse: {}, studentRankings: [] });

    useEffect(() => {
        setTimeout(() => {
            const formattedData = data.map((item) => ({
                id: item.unique_id,
                course: item.course,
                student: `${item.student.firstname} ${item.student.lastname}`,
                date: item.date,
                grade: item.grade,
            }));
            setNotesData(formattedData);
            setLoading(false);
            calculateStatistics(formattedData);
        }, 1000); // Simulate loading delay
    }, []);

    const calculateStatistics = (data) => {
        const totalGrades = data.reduce((sum, item) => sum + item.grade, 0);
        const studentCount = data.length;
        const averageGrade = totalGrades / studentCount;

        const courseGrades = {};
        data.forEach(item => {
            if (!courseGrades[item.course]) {
                courseGrades[item.course] = { total: 0, count: 0 };
            }
            courseGrades[item.course].total += item.grade;
            courseGrades[item.course].count += 1;
        });

        const averageGradePerCourse = {};
        for (const course in courseGrades) {
            averageGradePerCourse[course] = courseGrades[course].total / courseGrades[course].count;
        }

        const studentRankings = data.sort((a, b) => b.grade - a.grade).map((item, index) => ({
            rank: index + 1,
            student: item.student,
            grade: item.grade,
        }));

        setStatistics({ averageGrade, studentCount, averageGradePerCourse, studentRankings });
    };

    const handleAdd = () => {
        if (currentNote.course.trim() === '') {
            setSnackbar({ open: true, message: 'Failed to add: Course is empty', severity: 'error' });
            return; // Prevent adding empty course
        }
        const newNote = { id: Date.now(), course: currentNote.course, student: currentNote.student, date: currentNote.date, grade: currentNote.grade };
        setNotesData((prevData) => [...prevData, newNote]);
        setCurrentNote({ id: null, course: '', student: '', date: '', grade: '' }); // Reset form
        setSnackbar({ open: true, message: 'Course added successfully', severity: 'success' });
        calculateStatistics([...notesData, newNote]);
    };

    const handleEdit = (id) => {
        const note = notesData.find((item) => item.id === id);
        setCurrentNote(note);
    };

    const handleUpdate = () => {
        const updatedData = notesData.map((item) =>
            item.id === currentNote.id ? currentNote : item
        );
        setNotesData(updatedData);
        setCurrentNote({ id: null, course: '', student: '', date: '', grade: '' });
        calculateStatistics(updatedData);
    };

    const handleDelete = (id) => {
        const updatedData = notesData.filter((item) => item.id !== id);
        setNotesData(updatedData);
        calculateStatistics(updatedData);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const columns = [
        { field: 'course', headerName: 'Course', flex: 1 },
        { field: 'student', headerName: 'Student', flex: 1 },
        { field: 'date', headerName: 'Date', flex: 1 },
        { field: 'grade', headerName: 'Grade', flex: 1 },
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
                Notes
            </Typography>
            <Box mb={2}>
                <Typography variant="h6">Statistics</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Average Grade</Typography>
                                <Typography variant="h4">{statistics.averageGrade.toFixed(2)}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Number of Students</Typography>
                                <Typography variant="h4">{statistics.studentCount}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Average Grade per Course</Typography>
                                <ul>
                                    {Object.entries(statistics.averageGradePerCourse).map(([course, avgGrade]) => (
                                        <li key={course}>{course}: {avgGrade.toFixed(2)}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Student Rankings</Typography>
                                <ol>
                                    {statistics.studentRankings.map(({ rank, student, grade }) => (
                                        <li key={rank}>{rank}. {student} - {grade}</li>
                                    ))}
                                </ol>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
            <Box mb={2}>
                <TextField
                    label="Course"
                    value={currentNote.course}
                    onChange={(e) => setCurrentNote({ ...currentNote, course: e.target.value })}
                />
                <TextField
                    label="Student"
                    value={currentNote.student}
                    onChange={(e) => setCurrentNote({ ...currentNote, student: e.target.value })}
                />
                <TextField
                    label="Date"
                    value={currentNote.date}
                    onChange={(e) => setCurrentNote({ ...currentNote, date: e.target.value })}
                />
                <TextField
                    label="Grade"
                    value={currentNote.grade}
                    onChange={(e) => setCurrentNote({ ...currentNote, grade: e.target.value })}
                />
                {currentNote.id ? (
                    <>
                        <Button variant="contained" color="primary" onClick={handleUpdate}>
                            Update
                        </Button>
                        <Button variant="contained" color="secondary" onClick={() => handleDelete(currentNote.id)} style={{ marginLeft: 8 }}>
                            Delete
                        </Button>
                    </>
                ) : (
                    <Button variant="contained" color="primary" onClick={handleAdd}>
                        Add
                    </Button>
                )}
            </Box>
            <DataGrid
                rows={notesData}
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

export default Notes;