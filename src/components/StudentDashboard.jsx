import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    IconButton,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import data from '../data.json';

function StudentDashboard() {
    const [statistics, setStatistics] = useState({
        studentName: '',
        averageGrade: 0,
        grades: [],
        ranking: 0,
    });
    const [selectedCourse, setSelectedCourse] = useState('all'); // Filtre par cours

    const studentId = 'student1'; // Remplacez par l'ID de l'étudiant connecté

    useEffect(() => {
        setTimeout(() => {
            const studentData = data.filter((item) => item.student.id === studentId);
            const studentName = studentData[0]?.student.firstname + ' ' + studentData[0]?.student.lastname;
            const totalGrades = studentData.reduce((sum, item) => sum + item.grade, 0);
            const averageGrade = totalGrades / studentData.length;

            const allStudents = data.map((item) => ({
                id: item.student.id,
                name: `${item.student.firstname} ${item.student.lastname}`,
                grade: item.grade,
            }));
            const sortedStudents = allStudents.sort((a, b) => b.grade - a.grade);
            const ranking = sortedStudents.findIndex((student) => student.id === studentId) + 1;

            setStatistics({
                studentName,
                averageGrade,
                grades: studentData.map((item) => ({
                    course: item.course,
                    grade: item.grade,
                })),
                ranking,
            });
        }, 1000); // Simule un délai de chargement
    }, [studentId]);

    // Données pour le graphique des notes par cours
    const gradesChartData = statistics.grades.map(({ course, grade }) => ({
        name: course,
        grade: grade,
    }));

    // Couleurs pour le graphique en secteurs
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

    // Filtrage des notes par cours
    const filteredGrades =
        selectedCourse === 'all'
            ? statistics.grades
            : statistics.grades.filter((item) => item.course === selectedCourse);

    return (
        <Paper elevation={3} sx={{ padding: 2, margin: 2 }}>
            <Typography variant="h4" component="div" gutterBottom>
                Student Dashboard
            </Typography>

            {/* Filtre par cours */}
            <Box mb={2}>
                <FormControl fullWidth>
                    <InputLabel id="course-filter-label">Filtrer par cours</InputLabel>
                    <Select
                        labelId="course-filter-label"
                        value={selectedCourse}
                        label="Filtrer par cours"
                        onChange={(e) => setSelectedCourse(e.target.value)}
                    >
                        <MenuItem value="all">Tous les cours</MenuItem>
                        {[...new Set(statistics.grades.map((item) => item.course))].map((course) => (
                            <MenuItem key={course} value={course}>
                                {course}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Grille de statistiques */}
            <Grid container spacing={2}>
                {/* Nom de l'étudiant */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ backgroundColor: '#f0f4ff', height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                Nom de l'Étudiant
                            </Typography>
                            <Typography variant="h4" color="primary">
                                {statistics.studentName}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Moyenne générale */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ backgroundColor: '#fff0f5', height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                Moyenne Générale
                            </Typography>
                            <Typography variant="h4" color="secondary">
                                {statistics.averageGrade.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Classement */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ backgroundColor: '#f0fff4', height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                Classement
                            </Typography>
                            <Typography variant="h4" color="success.main">
                                {statistics.ranking}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Graphique des notes par cours */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Mes Notes par Cours
                            </Typography>
                            <BarChart width={500} height={300} data={gradesChartData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="grade" fill="#8884d8" />
                            </BarChart>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Graphique en secteurs des notes par cours */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Répartition des Notes par Cours
                            </Typography>
                            <PieChart width={500} height={300}>
                                <Pie
                                    data={gradesChartData}
                                    dataKey="grade"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    label
                                >
                                    {gradesChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Liste des notes filtrées */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Mes Notes ({selectedCourse === 'all' ? 'Tous les cours' : selectedCourse})
                            </Typography>
                            <List>
                                {filteredGrades.map(({ course, grade }, index) => (
                                    <ListItem key={index} sx={{ backgroundColor: grade >= 80 ? '#e8f5e9' : '#ffebee' }}>
                                        <ListItemText
                                            primary={course}
                                            secondary={`Note: ${grade}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Paper>
    );
}

export default StudentDashboard;