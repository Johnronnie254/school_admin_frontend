import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Fetch teachers from the API
    fetch('###') // Replace with actual API endpoint
      .then((response) => response.json())
      .then((data) => setTeachers(data))
      .catch((error) => console.error('Error fetching teachers:', error));
  }, []);

  const handleEdit = (teacher) => {
    setCurrentTeacher(teacher);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    // Call API to delete teacher
    fetch(`###/teachers/${id}`, { method: 'DELETE' }) // Replace with actual API
      .then(() => {
        setTeachers(teachers.filter((teacher) => teacher.id !== id));
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      })
      .catch((error) => console.error('Error deleting teacher:', error));
  };

  const handleSave = () => {
    // Save logic for add/edit teacher to API
    const method = currentTeacher ? 'PUT' : 'POST';
    const url = currentTeacher ? `###/teachers/${currentTeacher.id}` : '###/teachers'; // Replace with actual API
    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentTeacher),
    })
      .then((response) => response.json())
      .then((data) => {
        if (currentTeacher) {
          setTeachers(teachers.map((teacher) => (teacher.id === data.id ? data : teacher)));
        } else {
          setTeachers((prev) => [...prev, data]);
        }
        setShowModal(false);
        setCurrentTeacher(null);
      })
      .catch((error) => console.error('Error saving teacher:', error));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    fetch('###/teachers/upload', {
      method: 'POST',
      body: formData,
    }) // Replace with actual API endpoint
      .then((response) => response.json())
      .then((data) => setTeachers(data))
      .catch((error) => console.error('File upload error:', error));
  };

  return (
    <div>
      <h2 className="mb-4">Teachers</h2>

      {showAlert && <Alert variant="success">Teacher deleted successfully!</Alert>}

      <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>
        Add Teacher
      </Button>

      <Form.Group controlId="fileUpload" className="mb-3">
        <Form.Label>Upload Teachers</Form.Label>
        <Form.Control type="file" onChange={handleFileUpload} />
      </Form.Group>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Class Assigned</th>
            <th>Subjects</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher.id}>
              <td>{teacher.name}</td>
              <td>{teacher.email}</td>
              <td>{teacher.phoneNumber}</td>
              <td>{teacher.classAssigned}</td>
              <td>
                {teacher.subjects?.map((subject, index) => (
                  <Badge bg="info" key={index} className="me-1">
                    {subject}
                  </Badge>
                ))}
              </td>
              <td>
                <Button
                  variant="warning"
                  className="me-2"
                  onClick={() => handleEdit(teacher)}
                >
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(teacher.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentTeacher ? 'Edit Teacher' : 'Add Teacher'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={currentTeacher?.name || ''}
                onChange={(e) =>
                  setCurrentTeacher({ ...currentTeacher, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={currentTeacher?.email || ''}
                onChange={(e) =>
                  setCurrentTeacher({ ...currentTeacher, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                value={currentTeacher?.phoneNumber || ''}
                onChange={(e) =>
                  setCurrentTeacher({ ...currentTeacher, phoneNumber: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Class Assigned</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter class"
                value={currentTeacher?.classAssigned || ''}
                onChange={(e) =>
                  setCurrentTeacher({ ...currentTeacher, classAssigned: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Subjects</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter subjects (comma-separated)"
                value={currentTeacher?.subjects?.join(', ') || ''}
                onChange={(e) =>
                  setCurrentTeacher({
                    ...currentTeacher,
                    subjects: e.target.value.split(',').map((s) => s.trim()),
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Teachers;
