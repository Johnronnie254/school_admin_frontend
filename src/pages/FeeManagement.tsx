import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Card,
  Row,
  Col,
  Badge,
  InputGroup,
  FormControl,
} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { FeePayment } from '../types';
import api from '../services/api';
import { addNotification } from '../store/slices/uiSlice';
import { FaMoneyBillWave } from 'react-icons/fa';

interface FeeFormData {
  studentId: string;
  amount: number;
  type: string;
  description: string;
}

const FeeManagement: React.FC = () => {
  const dispatch = useDispatch();
  const [payments, setPayments] = useState<FeePayment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<FeeFormData>({
    studentId: '',
    amount: 0,
    type: 'tuition',
    description: '',
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.getFeePayments();
      setPayments(response.data.data);
    } catch (error) {
      dispatch(
        addNotification({
          message: 'Failed to fetch fee payments',
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
      await api.recordFeePayment(formData);
      dispatch(
        addNotification({
          message: 'Payment recorded successfully',
          type: 'success',
        })
      );
      setShowModal(false);
      fetchPayments();
    } catch (error) {
      dispatch(
        addNotification({
          message: 'Failed to record payment',
          type: 'error',
        })
      );
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const calculateTotalCollections = () => {
    const total = payments.reduce((sum, payment) => {
      if (payment.status.toLowerCase() === 'paid') {
        return sum + payment.amount;
      }
      return sum;
    }, 0);
    return total;
  };

  const calculatePendingPayments = () => {
    const total = payments.reduce((sum, payment) => {
      if (payment.status.toLowerCase() === 'pending') {
        return sum + payment.amount;
      }
      return sum;
    }, 0);
    return total;
  };

  const calculateOverduePayments = () => {
    const total = payments.reduce((sum, payment) => {
      if (payment.status.toLowerCase() === 'overdue') {
        return sum + payment.amount;
      }
      return sum;
    }, 0);
    return total;
  };

  const filteredPayments = payments.filter(
    (payment) =>
      payment.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <FaMoneyBillWave className="me-2" />
            <h4 className="mb-0">Fee Management</h4>
          </div>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Record Payment
          </Button>
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={4}>
              <Card className="text-center">
                <Card.Body>
                  <h5>Total Collections</h5>
                  <h3>KES {calculateTotalCollections().toLocaleString()}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center">
                <Card.Body>
                  <h5>Pending Payments</h5>
                  <h3>KES {calculatePendingPayments().toLocaleString()}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center">
                <Card.Body>
                  <h5>Overdue Payments</h5>
                  <h3>KES {calculateOverduePayments().toLocaleString()}</h3>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <InputGroup className="mb-3">
            <FormControl
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Amount (KES)</th>
                <th>Type</th>
                <th>Date</th>
                <th>Status</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.studentId}</td>
                  <td>{payment.amount.toLocaleString()}</td>
                  <td>{payment.type}</td>
                  <td>{new Date(payment.date).toLocaleDateString()}</td>
                  <td>
                    <Badge bg={getStatusBadgeVariant(payment.status)}>
                      {payment.status}
                    </Badge>
                  </td>
                  <td>{payment.description}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Record Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Student ID</Form.Label>
              <Form.Control
                type="text"
                value={formData.studentId}
                onChange={(e) =>
                  setFormData({ ...formData, studentId: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Amount (KES)</Form.Label>
              <Form.Control
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: Number(e.target.value) })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                required
              >
                <option value="tuition">Tuition Fee</option>
                <option value="library">Library Fee</option>
                <option value="transport">Transport Fee</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                className="me-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Payment
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FeeManagement; 