import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);

  useEffect(() => {
    // Fetch teachers from the API
    fetch('###')  // Replace with actual API
      .then(response => response.json())
      .then(data => setTeachers(data));
  }, []);

  const handleEdit = (teacher) => {
    setCurrentTeacher(teacher);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    // Call API to delete teacher
    setTeachers(teachers.filter((teacher) => teacher.id !== id));
  };

  const handleSave = () => {
    // Save logic to API
    setShowModal(false);
  };

  // File Upload Logic
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    fetch('###') // Replace with the appropriate API
      .then((response) => response.json())
      .then((data) => setTeachers(data)) // Call the function to update data
      .catch((error) => console.error('File upload error:', error));
  };

  return (
    <div>
      <h2>Teachers</h2>
      <Button variant="primary" onClick={() => setShowModal(true)}>Add Teacher</Button>
      
      {/* Upload Button */}
      <input type="file" onChange={handleFileUpload} />
      
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Class Assigned</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher.id}>
              <td>{teacher.name}</td>
              <td>{teacher.email}</td>
              <td>{teacher.classAssigned}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(teacher)} className="me-2">Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(teacher.id)}>Delete</Button>
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
              <Form.Control type="text" placeholder="Enter name" defaultValue={currentTeacher?.name} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" defaultValue={currentTeacher?.email} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Class Assigned</Form.Label>
              <Form.Control type="text" placeholder="Enter class" defaultValue={currentTeacher?.classAssigned} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSave}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Teachers;
