import React, { useState, useEffect } from 'react';
import {  Table, Button, Modal, Form, Nav, NavDropdown, Container, Row, Col } from 'react-bootstrap';

function Students() {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]); // Grades 1-9
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', guardian: '', contact: '', grade: '' });
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (selectedGrade) {
      // Fetch students data for the selected grade
      fetch(`API_URL/students?grade=${selectedGrade}`) // Replace with actual API URL
        .then((response) => response.json())
        .then((data) => setStudents(data))
        .catch((error) => console.error('Error fetching students:', error));
    }
  }, [selectedGrade]);

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileSubmit = () => {
    if (!file || !selectedGrade) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('grade', selectedGrade);

    fetch('API_URL/upload', { // Replace with actual API URL
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
        alert('File uploaded successfully!');
      })
      .catch((error) => console.error('File upload error:', error));
  };

  const handleCreateStudent = () => {
    fetch('API_URL/students', { // Replace with actual API URL
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStudent),
    })
      .then((response) => response.json())
      .then((data) => {
        setStudents((prev) => [...prev, data]);
        setShowModal(false);
      })
      .catch((error) => console.error('Error creating student:', error));
  };

  const handleDeleteStudent = (id) => {
    fetch(`API_URL/students/${id}`, { // Replace with actual API URL
      method: 'DELETE',
    })
      .then(() => {
        setStudents((prev) => prev.filter((student) => student.id !== id));
      })
      .catch((error) => console.error('Error deleting student:', error));
  };

  return (
    <Container>
      <Row>
        <Col md={3} className="sidebar">
          <Nav className="flex-column">
            <Nav.Link disabled>Students</Nav.Link>
            <NavDropdown title="Select Grade" id="nav-dropdown">
              {grades.map((grade) => (
                <NavDropdown.Item key={grade} onClick={() => setSelectedGrade(grade)}>
                  Grade {grade}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          </Nav>
        </Col>

        <Col md={9}>
          <h2>Manage Students {selectedGrade && `- Grade ${selectedGrade}`}</h2>

          {selectedGrade && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <input type="file" onChange={handleFileUpload} />
                  <Button className="ms-2" onClick={handleFileSubmit} disabled={!file}>
                    Upload
                  </Button>
                </div>
                <Button onClick={() => setShowModal(true)}>Add Student</Button>
              </div>

              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Grade</th>
                    <th>Guardian</th>
                    <th>Contact</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>{student.grade}</td>
                      <td>{student.guardian}</td>
                      <td>{student.contact}</td>
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => console.log('Edit student', student.id)}
                        >
                          Edit
                        </Button>{' '}
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteStudent(student.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter student name"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Guardian</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter guardian name"
                value={newStudent.guardian}
                onChange={(e) => setNewStudent({ ...newStudent, guardian: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contact</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter contact information"
                value={newStudent.contact}
                onChange={(e) => setNewStudent({ ...newStudent, contact: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Grade</Form.Label>
              <Form.Control
                as="select"
                value={newStudent.grade}
                onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
              >
                <option value="">Select Grade</option>
                {grades.map((grade) => (
                  <option key={grade} value={grade}>
                    Grade {grade}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateStudent}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Students;
