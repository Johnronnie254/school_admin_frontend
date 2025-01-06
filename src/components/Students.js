import React, { useState, useEffect } from 'react';
import { Card, Table } from 'react-bootstrap';

function Students() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Fetch students data from API
    fetch('###') // Replace with actual API
      .then(response => response.json())
      .then(data => setStudents(data));
  }, []);

  const handleGradeClick = (grade) => {
    // Display students of that grade
  };

  // File Upload Logic
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    fetch('###') // Replace with the appropriate API
      .then((response) => response.json())
      .then((data) => setStudents(data)) // Call the function to update data
      .catch((error) => console.error('File upload error:', error));
  };

  return (
    <div>
      <h2>Students</h2>
      
      {/* Upload Button */}
      <input type="file" onChange={handleFileUpload} />
      
      <div className="d-flex flex-wrap">
        {students.map((grade, index) => (
          <Card key={index} className="m-3" style={{ width: '18rem' }} onClick={() => handleGradeClick(grade)}>
            <Card.Body>
              <Card.Title>Grade {grade.grade}</Card.Title>
              <Table striped bordered hover className="mt-3">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Parent</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {grade.students.map((student, idx) => (
                    <tr key={idx}>
                      <td>{student.name}</td>
                      <td>{student.parent}</td>
                      <td>{student.balance}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Students;
