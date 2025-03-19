import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Card,
  Badge,
  InputGroup,
  FormControl,
} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Notice } from '../types';
import api from '../services/api';
import { addNotification } from '../store/slices/uiSlice';
import { FaBell, FaEdit, FaTrash } from 'react-icons/fa';

interface NoticeFormData {
  title: string;
  content: string;
  type: Notice['type'];
}

const Notifications: React.FC = () => {
  const dispatch = useDispatch();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState<NoticeFormData>({
    title: '',
    content: '',
    type: 'general',
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await api.getNotices();
      setNotices(response.data.data);
    } catch (error) {
      dispatch(
        addNotification({
          message: 'Failed to fetch notifications',
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
      if (selectedNotice) {
        await api.updateNotice(selectedNotice.id, {
          ...formData,
          date: new Date().toISOString(),
          author: 'Admin',
        });
        dispatch(
          addNotification({
            message: 'Notice updated successfully',
            type: 'success',
          })
        );
      } else {
        await api.createNotice({
          ...formData,
          date: new Date().toISOString(),
          author: 'Admin',
        });
        dispatch(
          addNotification({
            message: 'Notice created successfully',
            type: 'success',
          })
        );
      }
      setShowModal(false);
      fetchNotices();
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
    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await api.deleteNotice(id);
        dispatch(
          addNotification({
            message: 'Notice deleted successfully',
            type: 'success',
          })
        );
        fetchNotices();
      } catch (error) {
        dispatch(
          addNotification({
            message: 'Failed to delete notice',
            type: 'error',
          })
        );
      }
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'academic':
        return 'primary';
      case 'event':
        return 'success';
      default:
        return 'warning';
    }
  };

  const filteredNotices = notices.filter(
    (notice) =>
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (notice: Notice) => {
    setSelectedNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      type: notice.type,
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedNotice(null);
    setFormData({
      title: '',
      content: '',
      type: 'general',
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
          <div className="d-flex align-items-center">
            <FaBell className="me-2" />
            <h4 className="mb-0">Notifications</h4>
          </div>
          <Button variant="primary" onClick={handleAdd}>
            Create Notice
          </Button>
        </Card.Header>
        <Card.Body>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Content</th>
                <th>Type</th>
                <th>Date</th>
                <th>Author</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotices.map((notice) => (
                <tr key={notice.id}>
                  <td>{notice.title}</td>
                  <td>{notice.content}</td>
                  <td>
                    <Badge bg={getTypeBadgeVariant(notice.type)}>
                      {notice.type}
                    </Badge>
                  </td>
                  <td>{new Date(notice.date).toLocaleDateString()}</td>
                  <td>{notice.author}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(notice)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(notice.id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedNotice ? 'Edit Notice' : 'Create Notice'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as Notice['type']
                  })
                }
                required
              >
                <option value="general">General</option>
                <option value="academic">Academic</option>
                <option value="event">Event</option>
              </Form.Select>
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
                {selectedNotice ? 'Update' : 'Create'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Notifications; 