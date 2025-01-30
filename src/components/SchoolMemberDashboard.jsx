import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, TextField, MenuItem } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import data from '../data.json';

function SchoolMemberDashboard() {
    const [statistics, setStatistics] = useState({
        totalStudents: 0,
        averageGradePerCourse: {},
        studentGrades: [],
    });
    const [filteredGrades, setFilteredGrades] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');

    useEffect(() => {
        setTimeout(() => {
            const students = [...new Set(data.map((item) => item.student.id))];
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

            const studentGrades = data.map((item) => ({
                student: `${item.student.firstname} ${item.student.lastname}`,
                course: item.course,
                grade: item.grade,
            }));

            setStatistics({
                totalStudents: students.length,
                averageGradePerCourse,
                studentGrades,
            });
            setFilteredGrades(studentGrades);
        }, 1000); // Simule un délai de chargement
    }, []);

    const handleCourseChange = (event) => {
        const course = event.target.value;
        setSelectedCourse(course);
        if (course) {
            setFilteredGrades(statistics.studentGrades.filter(grade => grade.course === course));
        } else {
            setFilteredGrades(statistics.studentGrades);
        }
    };

    const chartData = Object.entries(statistics.averageGradePerCourse).map(([course, avgGrade]) => ({
        course,
        averageGrade: avgGrade,
    }));

    return (
        <Paper elevation={3} sx={{ padding: 2, margin: 2 }}>
            <Typography variant="h4" component="div" gutterBottom>
                School Member Dashboard
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Nombre d'Étudiants</Typography>
                            <Typography variant="h4">{statistics.totalStudents}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Moyenne par Matière</Typography>
                            <BarChart width={500} height={300} data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="course" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="averageGrade" fill="#8884d8" />
                            </BarChart>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Notes des Étudiants</Typography>
                            <TextField
                                select
                                label="Filtrer par matière"
                                value={selectedCourse}
                                onChange={handleCourseChange}
                                fullWidth
                                margin="normal"
                            >
                                <MenuItem value="">
                                    Toutes les matières
                                </MenuItem>
                                {Object.keys(statistics.averageGradePerCourse).map((course) => (
                                    <MenuItem key={course} value={course}>
                                        {course}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <ul>
                                {filteredGrades.map(({ student, course, grade }, index) => (
                                    <li key={index}>
                                        {student} - {course}: {grade}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Paper>
    );
}

export default SchoolMemberDashboard;