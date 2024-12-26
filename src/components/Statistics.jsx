import { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import data from '../data.json'; // Adjust the data source as needed

function Statistics() {
  const [stats, setStats] = useState({
    averageGrade: 0,
    studentCount: 0,
    averageGradePerCourse: {},
    studentRankings: [],
  });

  useEffect(() => {
    const studentCount = data.length;
    const totalGrades = data.reduce((acc, student) => acc + student.grade, 0);
    const averageGrade = totalGrades / studentCount;

    const courseGrades = {};
    data.forEach(student => {
      if (!courseGrades[student.course]) {
        courseGrades[student.course] = { total: 0, count: 0 };
      }
      courseGrades[student.course].total += student.grade;
      courseGrades[student.course].count += 1;
    });

    const averageGradePerCourse = {};
    for (const course in courseGrades) {
      averageGradePerCourse[course] = courseGrades[course].total / courseGrades[course].count;
    }

    const studentRankings = data.sort((a, b) => b.grade - a.grade);

    setStats({
      averageGrade,
      studentCount,
      averageGradePerCourse,
      studentRankings,
    });
  }, []);

  return (
    <Paper elevation={3} sx={{ padding: 2, margin: 2 }}>
      <Typography variant="h5" component="div" gutterBottom>
        Statistiques
      </Typography>
      <Box mb={2}>
        <Typography variant="body1">Nombre etudiants: {stats.studentCount}</Typography>
        <Typography variant="body1">Note moyenne: {stats.averageGrade.toFixed(2)}</Typography>
        <Typography variant="body1">Moyennes par cours:</Typography>
        <ul>
          {Object.entries(stats.averageGradePerCourse).map(([course, avg]) => (
            <li key={course}>{course}: {avg.toFixed(2)}</li>
          ))}
        </ul>
        <Typography variant="body1">Classement des étudiants:</Typography>
        <ol>
          {stats.studentRankings.map(student => (
            <li key={student.id}>{student.firstname} {student.lastname}: {student.grade}</li>
          ))}
        </ol>
      </Box>
    </Paper>
  );
}

export default Statistics;