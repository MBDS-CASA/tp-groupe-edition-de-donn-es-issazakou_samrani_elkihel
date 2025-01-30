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

function AdminDashboard() {
    const [statistics, setStatistics] = useState({
        totalCourses: 0,
        totalStudents: 0,
        averageGrade: 0,
        averageGradePerCourse: {},
        studentRankings: [],
    });
    const [selectedCourse, setSelectedCourse] = useState('all'); // Filtre par cours

    useEffect(() => {
        setTimeout(() => {
            // Calcul des statistiques
            const courses = [...new Set(data.map((item) => item.course))];
            const students = [...new Set(data.map((item) => item.student.id))];
            const totalGrades = data.reduce((sum, item) => sum + item.grade, 0);
            const averageGrade = totalGrades / data.length;

            const courseGrades = {};
            data.forEach((item) => {
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

            const studentRankings = data
                .sort((a, b) => b.grade - a.grade)
                .map((item, index) => ({
                    rank: index + 1,
                    student: `${item.student.firstname} ${item.student.lastname}`,
                    grade: item.grade,
                    course: item.course,
                }));

            setStatistics({
                totalCourses: courses.length,
                totalStudents: students.length,
                averageGrade,
                averageGradePerCourse,
                studentRankings,
            });
        }, 1000); // Simule un délai de chargement
    }, []);

    // Données pour le graphique des moyennes par cours
    const courseChartData = Object.entries(statistics.averageGradePerCourse).map(([course, avgGrade]) => ({
        name: course,
        value: avgGrade.toFixed(2),
    }));

    // Couleurs pour le graphique en secteurs
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

    // Filtrage des classements par cours
    const filteredRankings =
        selectedCourse === 'all'
            ? statistics.studentRankings
            : statistics.studentRankings.filter((item) => item.course === selectedCourse);

    return (
        <Paper elevation={3} sx={{ padding: 2, margin: 2 }}>
            <Typography variant="h4" component="div" gutterBottom>
                Admin Dashboard
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
                        {Object.keys(statistics.averageGradePerCourse).map((course) => (
                            <MenuItem key={course} value={course}>
                                {course}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Grille de statistiques */}
            <Grid container spacing={2}>
                {/* Nombre de matières */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ backgroundColor: '#f4ffff', height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                Nombre de Matières
                            </Typography>
                            <Typography variant="h4" color="primary">
                                {statistics.totalCourses}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Nombre d'étudiants */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ backgroundColor: '#fff0f5', height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                Nombre dÉtudiants
                            </Typography>
                            <Typography variant="h4" color="secondary">
                                {statistics.totalStudents}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Moyenne générale */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ backgroundColor: '#f0fff4', height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                Moyenne Générale
                            </Typography>
                            <Typography variant="h4" color="success.main">
                                {statistics.averageGrade.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Graphique des moyennes par cours */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Moyenne par Matière
                            </Typography>
                            <BarChart width={500} height={300} data={courseChartData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Graphique en secteurs des moyennes par cours */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Répartition des Moyennes par Matière
                            </Typography>
                            <PieChart width={500} height={300}>
                                <Pie
                                    data={courseChartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    label
                                >
                                    {courseChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Classement des étudiants */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Classement des Étudiants ({selectedCourse === 'all' ? 'Tous les cours' : selectedCourse})
                            </Typography>
                            <List>
                                {filteredRankings.map(({ rank, student, grade }) => (
                                    <ListItem key={rank} sx={{ backgroundColor: rank <= 3 ? '#e8f5e9' : 'transparent' }}>
                                        <ListItemText
                                            primary={`${rank}. ${student}`}
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

export default AdminDashboard;