import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Nav, Container, Row, Col } from "react-bootstrap";

function Students() {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [newStudent, setNewStudent] = useState({ name: "", guardian: "", contact: "" });
  const [file, setFile] = useState(null);

  // Fetch all students from the backend
  useEffect(() => {
    fetch("http://localhost:8000/api/students/")
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((error) => console.error("Error fetching students:", error));
  }, []);

  // Handle file selection
  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle file submission
  const handleFileSubmit = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    fetch("http://localhost:8000/api/students/upload/", {
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

  // Handle student creation
  const handleCreateStudent = () => {
    fetch("http://localhost:8000/api/students/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStudent),
    })
      .then((response) => response.json())
      .then((data) => {
        setStudents((prev) => [...prev, data]);
        setShowModal(false);
        setNewStudent({ name: "", guardian: "", contact: "" });
      })
      .catch((error) => console.error("Error creating student:", error));
  };

  // Handle student edit
  const handleEditStudent = (student) => {
    setStudentToEdit(student);
    setNewStudent({ name: student.name, guardian: student.guardian, contact: student.contact });
    setIsEditMode(true);
    setShowModal(true);
  };

  // Handle student update
  const handleUpdateStudent = () => {
    fetch(`http://localhost:8000/api/students/${studentToEdit.id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStudent),
    })
      .then((response) => response.json())
      .then((data) => {
        setStudents((prev) => prev.map((student) => (student.id === data.id ? data : student)));
        setShowModal(false);
        setNewStudent({ name: "", guardian: "", contact: "" });
        setIsEditMode(false);
      })
      .catch((error) => console.error("Error updating student:", error));
  };

  // Handle student deletion
  const handleDeleteStudent = (id) => {
    fetch(`http://localhost:8000/api/students/${id}/`, {
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
          </Nav>
        </Col>

        <Col md={9}>
          <h2>Manage Students</h2>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <input type="file" onChange={handleFileUpload} />
              <Button className="ms-2" onClick={handleFileSubmit} disabled={!file}>
                Upload
              </Button>
            </div>
            <Button onClick={() => { setShowModal(true); setIsEditMode(false); }}>Add Student</Button>
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
        </Col>
      </Row>

      {/* Student Modal */}
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
