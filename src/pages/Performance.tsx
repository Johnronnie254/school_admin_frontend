import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Card,
  Row,
  Col,
  Dropdown,
  InputGroup,
  FormControl
} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Performance, Grade, PerformanceUpdate } from '../types';
import api from '../services/api';
import { addNotification } from '../store/slices/uiSlice';

interface GradeFormData {
  subject: string;
  marks: number;
  maxMarks: number;
  examDate: string;
}

const PerformanceManagement: React.FC = () => {
  const dispatch = useDispatch();
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const [formData, setFormData] = useState<GradeFormData>({
    subject: '',
    marks: 0,
    maxMarks: 100,
    examDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchPerformances();
  }, []);

  const fetchPerformances = async () => {
    try {
      const response = await api.getAllPerformances();
      setPerformances(response.data.data);
    } catch (error) {
      dispatch(
        addNotification({
          message: 'Failed to fetch performance data',
          type: 'error',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !selectedTerm) {
      dispatch(
        addNotification({
          message: 'Please select a student and term',
          type: 'error',
        })
      );
      return;
    }

    try {
      const grade: Grade = {
        ...formData,
        grade: calculateGrade(formData.marks, formData.maxMarks)
      };

      await api.updateGrades(selectedStudent, {
        studentId: selectedStudent,
        term: selectedTerm,
        grades: [grade],
        attendance: 0,
        remarks: ''
      });

      dispatch(
        addNotification({
          message: 'Grades updated successfully',
          type: 'success',
        })
      );
      setShowModal(false);
      fetchPerformances();
    } catch (error) {
      dispatch(
        addNotification({
          message: 'Failed to update grades',
          type: 'error',
        })
      );
    }
  };

  const calculateGrade = (marks: number, maxMarks: number): string => {
    const percentage = (marks / maxMarks) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'F';
  };

  const getPerformanceStats = () => {
    const totalStudents = performances.length;
    const passedStudents = performances.filter(p => 
      p.grades.every(g => (g.marks / g.maxMarks) * 100 >= 40)
    ).length;
    const failedStudents = totalStudents - passedStudents;

    return { totalStudents, passedStudents, failedStudents };
  };

  const filteredPerformances = performances.filter(
    (performance) =>
      performance.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      performance.term.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  const stats = getPerformanceStats();

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Performance Management</h4>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Add Grades
          </Button>
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={4}>
              <Card className="text-center">
                <Card.Body>
                  <h5>Total Students</h5>
                  <h3>{stats.totalStudents}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center text-success">
                <Card.Body>
                  <h5>Passed</h5>
                  <h3>{stats.passedStudents}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center text-danger">
                <Card.Body>
                  <h5>Failed</h5>
                  <h3>{stats.failedStudents}</h3>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <InputGroup className="mb-3">
            <FormControl
              placeholder="Search performances..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Term</th>
                <th>Subjects</th>
                <th>Average Grade</th>
                <th>Attendance</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filteredPerformances.map((performance) => (
                <tr key={`${performance.studentId}-${performance.term}`}>
                  <td>{performance.studentId}</td>
                  <td>{performance.term}</td>
                  <td>
                    {performance.grades.map((grade) => (
                      <div key={grade.subject}>
                        {grade.subject}: {grade.grade} ({grade.marks}/{grade.maxMarks})
                      </div>
                    ))}
                  </td>
                  <td>
                    {calculateGrade(
                      performance.grades.reduce((sum, g) => sum + (g.marks / g.maxMarks) * 100, 0) /
                        performance.grades.length,
                      100
                    )}
                  </td>
                  <td>{performance.attendance}%</td>
                  <td>{performance.remarks || '-'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Grades</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Student ID</Form.Label>
              <Form.Control
                type="text"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Term</Form.Label>
              <Form.Select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                required
              >
                <option value="">Select Term</option>
                <option value="Term 1">Term 1</option>
                <option value="Term 2">Term 2</option>
                <option value="Term 3">Term 3</option>
              </Form.Select>
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

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Marks Obtained</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.marks}
                    onChange={(e) => setFormData({ ...formData, marks: Number(e.target.value) })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Maximum Marks</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.maxMarks}
                    onChange={(e) => setFormData({ ...formData, maxMarks: Number(e.target.value) })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Exam Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.examDate}
                onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Grades
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PerformanceManagement; 