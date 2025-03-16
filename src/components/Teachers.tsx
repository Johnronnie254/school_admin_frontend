import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';

interface Teacher {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  class_assigned: string;
  subjects: string[];
}

const Teachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  useEffect(() => {
    // Fetch teachers from the API
    fetch('http://localhost:8000/api/teachers/')
      .then((response) => response.json())
      .then((data: Teacher[]) => setTeachers(data))
      .catch((error) => console.error('Error fetching teachers:', error));
  }, []);

  const handleEdit = (teacher: Teacher) => {
    setCurrentTeacher(teacher);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    // Call API to delete teacher
    fetch(`http://localhost:8000/api/teachers/${id}/`, { method: 'DELETE' })
      .then(() => {
        setTeachers(teachers.filter((teacher) => teacher.id !== id));
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      })
      .catch((error) => console.error('Error deleting teacher:', error));
  };

  const handleSave = () => {
    if (!currentTeacher) return;

    // Save logic for add/edit teacher to API
    const method = currentTeacher.id ? 'PUT' : 'POST';
    const url = currentTeacher.id
      ? `http://localhost:8000/api/teachers/${currentTeacher.id}/`
      : 'http://localhost:8000/api/teachers/';

    const teacherToSave = {
      name: currentTeacher.name,
      email: currentTeacher.email,
      phone_number: currentTeacher.phone_number,
      class_assigned: currentTeacher.class_assigned,
      subjects: currentTeacher.subjects,
    };

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teacherToSave),
    })
      .then((response) => response.json())
      .then((data: Teacher) => {
        if (currentTeacher.id) {
          setTeachers(teachers.map((teacher) => (teacher.id === data.id ? data : teacher)));
        } else {
          setTeachers((prev) => [...prev, data]);
        }
        setShowModal(false);
        setCurrentTeacher(null);
      })
      .catch((error) => console.error('Error saving teacher:', error));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) return;

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    fetch('http://localhost:8000/api/teachers/upload_teachers/', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data: Teacher[]) => setTeachers(data))
      .catch((error) => console.error('File upload error:', error));
  };

  // Ensure subjects is always an array
  const normalizeSubjects = (subjects: string[] | string | undefined): string[] => {
    if (!subjects) return [];
    if (Array.isArray(subjects)) return subjects;
    return subjects.split(',').map((subject: string) => subject.trim());
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
              <td>{teacher.phone_number}</td>
              <td>{teacher.class_assigned}</td>
              <td>
                {normalizeSubjects(teacher.subjects).map((subject, index) => (
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
          <Modal.Title>{currentTeacher?.id ? 'Edit Teacher' : 'Add Teacher'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={currentTeacher?.name || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCurrentTeacher(currentTeacher ? { ...currentTeacher, name: e.target.value } : null)
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={currentTeacher?.email || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCurrentTeacher(currentTeacher ? { ...currentTeacher, email: e.target.value } : null)
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                value={currentTeacher?.phone_number || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCurrentTeacher(currentTeacher ? { ...currentTeacher, phone_number: e.target.value } : null)
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Class Assigned</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter class"
                value={currentTeacher?.class_assigned || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCurrentTeacher(currentTeacher ? { ...currentTeacher, class_assigned: e.target.value } : null)
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Subjects</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter subjects (comma-separated)"
                value={currentTeacher?.subjects ? currentTeacher.subjects.join(', ') : ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCurrentTeacher(
                    currentTeacher
                      ? {
                          ...currentTeacher,
                          subjects: e.target.value.split(',').map((s) => s.trim()),
                        }
                      : null
                  )
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
};

export default Teachers; 