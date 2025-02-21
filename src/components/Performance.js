import React, { useState, useEffect } from 'react';
import { Card, Dropdown, Button, Container, Row, Col, Table, Navbar } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Performance = () => {
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [studentData, setStudentData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Hardcoded CBC Subjects for each Grade
  const cbcSubjects = {
    "Playgroup": ["Creative Arts", "Motor Skills", "Physical Education", "Language Development", "Social Studies"],
    "PP1": ["Mathematics", "Kiswahili", "English", "Environmental Activities", "Physical Education"],
    "PP2": ["Mathematics", "Kiswahili", "English", "Science", "Social Studies"],
    "Grade 1": ["Mathematics", "English", "Kiswahili", "Science", "Social Studies", "CRE", "Music"],
    "Grade 2": ["Mathematics", "English", "Kiswahili", "Science", "Social Studies", "CRE", "Music", "Art"],
    "Grade 3": ["Mathematics", "English", "Kiswahili", "Science", "Social Studies", "CRE", "Art", "Music", "Physical Education"],
    "Grade 4": ["Mathematics", "English", "Kiswahili", "Science", "Social Studies", "CRE", "Art", "Music", "Physical Education"],
    "Grade 5": ["Mathematics", "English", "Kiswahili", "Science", "Social Studies", "CRE", "Art", "Music", "Home Science"],
    "Grade 6": ["Mathematics", "English", "Kiswahili", "Science", "Social Studies", "CRE", "Art", "Music", "Agriculture"],
    "Grade 7": ["Mathematics", "English", "Kiswahili", "Science", "Social Studies", "CRE", "Art", "Music", "Agriculture", "Home Science"]
  };

  // Handle grade selection
  const handleGradeSelect = (grade) => {
    setSelectedGrade(grade);
    setSelectedSubject(''); // Reset subject selection when grade changes
    setChartData(null); // Reset chart data
    fetchPerformanceData(grade); // Fetch new data when grade changes
  };

  // Handle subject selection
  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    fetchChartData(selectedGrade, subject); // Fetch performance chart data
  };

  // Fetch performance data based on selected grade
  const fetchPerformanceData = async (grade) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/performance/${grade}`);
      const data = await response.json();
      setStudentData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching performance data:', error);
      setLoading(false);
    }
  };

  // Fetch chart data for selected grade and subject
  const fetchChartData = async (grade, subject) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/chart/${grade}/${subject}`);
      const data = await response.json();
      const chartData = {
        labels: data.terms, // e.g., ['Term 1', 'Term 2', 'Term 3']
        datasets: [
          {
            label: `${subject} Performance`,
            data: data.scores, // e.g., [80, 85, 90]
            borderColor: 'rgba(75,192,192,1)',
            fill: false,
          }
        ]
      };
      setChartData(chartData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setLoading(false);
    }
  };

  // Render the performance table for selected grade and subject
  const renderPerformanceTable = () => {
    if (loading) {
      return <p>Loading data...</p>;
    }
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Student Name</th>
            {Object.keys(studentData[0]?.subjects || {}).map(subject => (
              <th key={subject}>{subject}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {studentData.map((student, index) => (
            <tr key={index}>
              <td>{student.name}</td>
              {Object.values(student.subjects).map((score, index) => (
                <td key={index}>{score}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <Container>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">Performance Dashboard</Navbar.Brand>
      </Navbar>

      <Row className="mt-4">
        <Col sm={3}>
          <Card>
            <Card.Header>Select Grade</Card.Header>
            <Card.Body>
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {selectedGrade || 'Select Grade'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {Object.keys(cbcSubjects).map((grade) => (
                    <Dropdown.Item key={grade} onClick={() => handleGradeSelect(grade)}>{grade}</Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={3}>
          <Card>
            <Card.Header>Select Subject</Card.Header>
            <Card.Body>
              <Dropdown disabled={!selectedGrade}>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {selectedSubject || 'Select Subject'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {selectedGrade && cbcSubjects[selectedGrade].map((subject, index) => (
                    <Dropdown.Item key={index} onClick={() => handleSubjectSelect(subject)}>{subject}</Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={6}>
          <Card>
            <Card.Header>Performance Chart</Card.Header>
            <Card.Body>
              {loading ? (
                <p>Loading chart...</p>
              ) : (
                chartData ? <Line data={chartData} /> : <p>Select grade and subject to view the chart.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header>Performance Table</Card.Header>
            <Card.Body>
              {renderPerformanceTable()}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Performance;
