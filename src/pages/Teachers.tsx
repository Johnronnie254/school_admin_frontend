import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Card,
  InputGroup,
  FormControl,
} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Teacher } from '../types';
import api from '../services/api';
import { addNotification } from '../store/slices/uiSlice';

const Teachers: React.FC = () => {
  const dispatch = useDispatch();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState<Omit<Teacher, 'id'>>({
    name: '',
    email: '',
    subject: '',
    qualification: '',
    experience: 0,
    contactNumber: '',
    address: '',
    joiningDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await api.getTeachers();
      setTeachers(response);
    } catch (error) {
      dispatch(
        addNotification({
          message: 'Failed to fetch teachers',
          type: 'error',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedTeacher) {
        await api.updateTeacher(selectedTeacher.id, formData);
        dispatch(
          addNotification({
            message: 'Teacher updated successfully',
            type: 'success',
          })
        );
      } else {
        await api.addTeacher(formData);
        dispatch(
          addNotification({
            message: 'Teacher added successfully',
            type: 'success',
          })
        );
      }
      setShowModal(false);
      fetchTeachers();
    } catch (error) {
      dispatch(
        addNotification({
          message: 'Operation failed',
          type: 'error',
        })
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await api.deleteTeacher(id);
        dispatch(
          addNotification({
            message: 'Teacher deleted successfully',
            type: 'success',
          })
        );
        fetchTeachers();
      } catch (error) {
        dispatch(
          addNotification({
            message: 'Failed to delete teacher',
            type: 'error',
          })
        );
      }
    }
  };

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      subject: teacher.subject,
      qualification: teacher.qualification,
      experience: teacher.experience,
      contactNumber: teacher.contactNumber,
      address: teacher.address,
      joiningDate: teacher.joiningDate,
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedTeacher(null);
    setFormData({
      name: '',
      email: '',
      subject: '',
      qualification: '',
      experience: 0,
      contactNumber: '',
      address: '',
      joiningDate: new Date().toISOString().split('T')[0],
    });
    setShowModal(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Teachers</h4>
          <Button variant="primary" onClick={handleAdd}>
            Add Teacher
          </Button>
        </Card.Header>
        <Card.Body>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Qualification</th>
                <th>Experience</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td>{teacher.name}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.subject}</td>
                  <td>{teacher.qualification}</td>
                  <td>{teacher.experience} years</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(teacher)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(teacher.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedTeacher ? 'Edit Teacher' : 'Add Teacher'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Qualification</Form.Label>
              <Form.Control
                type="text"
                value={formData.qualification}
                onChange={(e) =>
                  setFormData({ ...formData, qualification: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Experience (years)</Form.Label>
              <Form.Control
                type="number"
                value={formData.experience}
                onChange={(e) =>
                  setFormData({ ...formData, experience: parseInt(e.target.value) })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                type="tel"
                value={formData.contactNumber}
                onChange={(e) =>
                  setFormData({ ...formData, contactNumber: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Joining Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.joiningDate}
                onChange={(e) =>
                  setFormData({ ...formData, joiningDate: e.target.value })
                }
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {selectedTeacher ? 'Update' : 'Add'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Teachers; 