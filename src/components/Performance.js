import React, { useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Performance = () => {
  // Placeholder for student performance data
  const [performanceData, setPerformanceData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    // Function to simulate fetching data (replace with actual API calls later)
    const fetchPerformanceData = async () => {
      try {
        // Placeholder: Use hashed API endpoints
        const response = await axios.get('https://api.example.com/api/performance'); // Placeholder endpoint
        setPerformanceData(response.data);
      } catch (error) {
        console.error('Error fetching performance data:', error);
      }
    };

    fetchPerformanceData();

    // Cleanup: destroy chart if component unmounts or when data is updated
    return () => {
      if (chartRef.current && chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }
    };
  }, []);

  // Placeholder data for now
  const chartData = {
    labels: ['Playgroup', 'PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7'],
    datasets: [
      {
        label: 'Average Performance',
        data: [75, 80, 85, 90, 92, 88, 85, 80, 78, 90], // Dummy data
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Student Performance Analysis'
      },
      tooltip: {
        enabled: true
      }
    },
    scales: {
      x: {
        beginAtZero: true
      },
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  return (
    <div>
      <h2>Performance Overview</h2>
      {/* Chart Rendering */}
      <div style={{ height: '400px', width: '100%' }}>
        <Bar ref={chartRef} data={chartData} options={options} />
      </div>

      <h3>Performance Data for All Grades (CBC)</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Grade</th>
            <th>Average Performance</th>
            <th>Top Performers</th>
            <th>Improvement Areas</th>
            <th>Overall Score</th>
            <th>Subject-wise Breakdown</th>
            <th>Attendance Rate</th>
            <th>Disciplinary Issues</th>
            <th>Teacher Feedback</th>
            <th>Parent Feedback</th>
            <th>Quiz Scores</th>
            <th>Exam Scores</th>
            <th>Assignments Completed</th>
            <th>Absenteeism</th>
            <th>Behavioral Observations</th>
            <th>Class Participation</th>
            <th>Homework Completion</th>
            <th>Self-Discipline</th>
            <th>Physical Education Score</th>
            <th>Health & Wellness</th> {/* New feature */}
            <th>Extra-Curricular Participation</th> {/* New feature */}
          </tr>
        </thead>
        <tbody>
          {/* Example hard-coded data for now */}
          {[...Array(10)].map((_, index) => (
            <tr key={index}>
              <td>{['Playgroup', 'PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7'][index]}</td>
              <td>{(75 + index * 2)}%</td>
              <td>John Doe, Jane Smith</td>
              <td>Math, Science</td>
              <td>{(80 + index * 2)}%</td>
              <td>Math: 80%, English: 85%</td>
              <td>95%</td>
              <td>No issues</td>
              <td>Good progress</td>
              <td>Active participation</td>
              <td>90%</td>
              <td>85%</td>
              <td>98%</td>
              <td>1-2 days</td>
              <td>Positive</td>
              <td>Active</td>
              <td>Completed all tasks</td>
              <td>Good</td>
              <td>95%</td>
              <td>Good</td> {/* Health & Wellness */}
              <td>Soccer, Drama</td> {/* Extra-Curricular Participation */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Performance;
