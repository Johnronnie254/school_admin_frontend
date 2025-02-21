import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import axios from 'axios';

const Performance = () => {
  const [grade, setGrade] = useState('grade1');
  const [studentData, setStudentData] = useState([]);
  const [performanceData, setPerformanceData] = useState({});
  
  const gradeOptions = ['playgroup', 'pp1', 'pp2', 'grade1', 'grade2', 'grade3', 'grade4', 'grade5', 'grade6', 'grade7'];

  // Simulated data (use this data temporarily until API integration)
  const simulatedStudentData = {
    playgroup: [{ name: 'John Doe', math: 75, english: 80, science: 65 }],
    pp1: [{ name: 'Jane Doe', math: 85, english: 70, science: 90 }],
    grade1: [
      { name: 'Alice', math: 90, english: 85, science: 88 },
      { name: 'Bob', math: 80, english: 80, science: 75 }
    ],
    // Add more grade data here
  };

  // Simulated performance metrics for charts
  const simulatedPerformance = {
    math: {
      labels: ['Playgroup', 'PP1', 'Grade 1'],
      data: [75, 85, 90]
    },
    english: {
      labels: ['Playgroup', 'PP1', 'Grade 1'],
      data: [80, 70, 85]
    },
    science: {
      labels: ['Playgroup', 'PP1', 'Grade 1'],
      data: [65, 90, 88]
    }
  };

  useEffect(() => {
    // Call the backend API to fetch student data when the component mounts
    // Example API endpoint for fetching student data for a specific grade
    axios.get(`/api/performance/${grade}`).then((response) => {
      setStudentData(response.data);
    });

    // Example API endpoint for fetching performance metrics for a specific grade
    axios.get(`/api/performance/metrics/${grade}`).then((response) => {
      setPerformanceData(response.data);
    });
  }, [grade]);

  // Chart Data for Performance by Subject
  const performanceBySubjectData = {
    labels: simulatedPerformance.math.labels,
    datasets: [
      {
        label: 'Mathematics',
        data: simulatedPerformance.math.data,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'English',
        data: simulatedPerformance.english.data,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
      },
      {
        label: 'Science',
        data: simulatedPerformance.science.data,
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1
      }
    ]
  };

  // Handle Grade Change
  const handleGradeChange = (event) => {
    setGrade(event.target.value);
  };

  return (
    <div className="performance-page">
      <h2>Student Performance</h2>

      {/* Grade Filter */}
      <select onChange={handleGradeChange} value={grade}>
        {gradeOptions.map((gradeOption) => (
          <option key={gradeOption} value={gradeOption}>
            {gradeOption.charAt(0).toUpperCase() + gradeOption.slice(1)}
          </option>
        ))}
      </select>

      {/* Overview Section */}
      <div className="overview">
        <h3>Overall Performance Metrics for {grade.charAt(0).toUpperCase() + grade.slice(1)}</h3>

        <div className="performance-chart">
          <Line data={performanceBySubjectData} />
        </div>
      </div>

      {/* Student Performance Table */}
      <div className="student-performance">
        <h3>Student Performance</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Math</th>
              <th>English</th>
              <th>Science</th>
            </tr>
          </thead>
          <tbody>
            {studentData.length === 0
              ? simulatedStudentData[grade].map((student, index) => (
                  <tr key={index}>
                    <td>{student.name}</td>
                    <td>{student.math}</td>
                    <td>{student.english}</td>
                    <td>{student.science}</td>
                  </tr>
                ))
              : studentData.map((student, index) => (
                  <tr key={index}>
                    <td>{student.name}</td>
                    <td>{student.math}</td>
                    <td>{student.english}</td>
                    <td>{student.science}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Subject Mastery Pie Chart */}
      <div className="subject-mastery">
        <h3>Subject Mastery</h3>
        <Doughnut
          data={{
            labels: ['Math', 'English', 'Science'],
            datasets: [
              {
                data: [70, 80, 75],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
              }
            ]
          }}
        />
      </div>

      {/* Grade vs National Benchmark (simulated data) */}
      <div className="benchmark-comparison">
        <h3>Grade vs National Benchmark</h3>
        {/* This will be replaced with actual API data for national comparison */}
        <Bar
          data={{
            labels: ['Grade 1', 'Grade 2', 'Grade 3'],
            datasets: [
              {
                label: 'National Average',
                data: [80, 85, 78],
                backgroundColor: '#FF9F40',
                borderColor: '#FF9F40',
                borderWidth: 1
              },
              {
                label: 'Grade Average',
                data: [85, 88, 90],
                backgroundColor: '#36A2EB',
                borderColor: '#36A2EB',
                borderWidth: 1
              }
            ]
          }}
        />
      </div>
    </div>
  );
};

export default Performance;
