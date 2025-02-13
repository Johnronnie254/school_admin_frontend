import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Nav, NavDropdown, Container, Row, Col } from "react-bootstrap";

function Students() {
  const [students, setStudents] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [newStudent, setNewStudent] = useState({ name: "", guardian: "", contact: "" });
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (selectedGrade) {
      // Fetch students from a specific grade-based endpoint
      fetch(`http://localhost:8000/api/students/grade-${selectedGrade}/`)
        .then((response) => response.json())
        .then((data) => setStudents(data))
        .catch((error) => console.error("Error fetching students:", error));
    }
  }, [selectedGrade]);

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileSubmit = () => {
    if (!file || !selectedGrade) return;
    const formData = new FormData();
    formData.append("file", file);

    fetch(`http://localhost:8000/api/students/grade-${selectedGrade}/upload/`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
        alert("File uploaded successfully!");
      })
      .catch((error) => console.error("File upload error:", error));
  };

  const handleCreateStudent = () => {
    fetch(`http://localhost:8000/api/students/grade-${selectedGrade}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStudent),
    })
      .then((response) => response.json())
      .then((data) => {
        setStudents((prev) => [...prev, data]);
        setShowModal(false);
      })
      .catch((error) => console.error("Error creating student:", error));
  };

  const handleEditStudent = (student) => {
    setStudentToEdit(student);
    setNewStudent({ name: student.name, guardian: student.guardian, contact: student.contact });
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleUpdateStudent = () => {
    fetch(`http://localhost:8000/api/students/grade-${selectedGrade}/${studentToEdit.id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStudent),
    })
      .then((response) => response.json())
      .then((data) => {
        setStudents((prev) => prev.map((student) => (student.id === data.id ? data : student)));
        setShowModal(false);
      })
      .catch((error) => console.error("Error updating student:", error));
  };

  const handleDeleteStudent = (id) => {
    fetch(`http://localhost:8000/api/students/grade-${selectedGrade}/${id}/`, {
      method: "DELETE",
    })
      .then(() => {
        setStudents((prev) => prev.filter((student) => student.id !== id));
      })
      .catch((error) => console.error("Error deleting student:", error));
  };

  return (
    <Container>
      <Row>
        <Col md={3} className="sidebar">
          <Nav className="flex-column">
            <Nav.Link disabled>Students</Nav.Link>
            <NavDropdown title="Select Grade" id="nav-dropdown">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((grade) => (
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
                    <th>Guardian</th>
                    <th>Contact</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>{student.guardian}</td>
                      <td>{student.contact}</td>
                      <td>
                        <Button variant="warning" onClick={() => handleEditStudent(student)}>
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => handleDeleteStudent(student.id)} className="ms-2">
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
          <Modal.Title>{isEditMode ? "Edit Student" : "Add New Student"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="guardian">
              <Form.Label>Guardian</Form.Label>
              <Form.Control
                type="text"
                value={newStudent.guardian}
                onChange={(e) => setNewStudent({ ...newStudent, guardian: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="contact">
              <Form.Label>Contact</Form.Label>
              <Form.Control
                type="text"
                value={newStudent.contact}
                onChange={(e) => setNewStudent({ ...newStudent, contact: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={isEditMode ? handleUpdateStudent : handleCreateStudent}>
            {isEditMode ? "Update Student" : "Add Student"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Students;
