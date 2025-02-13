import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Card, Button, ListGroup, Form } from 'react-bootstrap';

const Dashboard = () => {
  const [students, setStudents] = useState(0);
  const [teachers, setTeachers] = useState(0);
  const [date, setDate] = useState(new Date());
  const [notices, setNotices] = useState([]);
  const [newNotice, setNewNotice] = useState("");

  // Fetch student & teacher count
  useEffect(() => {
    fetch('http://localhost:8000/api/stats/', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setStudents(data.students);
        setTeachers(data.teachers);
      });
  }, []);

  const handleAddNotice = () => {
    if (newNotice.trim() !== "") {
      setNotices([...notices, { date, text: newNotice }]);
      setNewNotice("");
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Student & Teacher Count */}
        <div className="col-md-6 mb-3">
          <Card className="p-3 text-center shadow-lg">
            <h4>Students</h4>
            <div className="mx-auto bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: '100px', height: '100px', fontSize: '24px' }}>
              {students}
            </div>
          </Card>
        </div>

        <div className="col-md-6 mb-3">
          <Card className="p-3 text-center shadow-lg">
            <h4>Teachers</h4>
            <div className="mx-auto bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: '100px', height: '100px', fontSize: '24px' }}>
              {teachers}
            </div>
          </Card>
        </div>

        {/* Notice Board */}
        <div className="col-md-6">
          <Card className="shadow-lg">
            <Card.Header className="bg-warning text-dark fw-bold">Notice Board</Card.Header>
            <Card.Body>
              <ListGroup>
                {notices.map((notice, index) => (
                  <ListGroup.Item key={index}>{notice.date.toDateString()} - {notice.text}
                    <Button variant="outline-primary" size="sm" className="float-end">Share</Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Form.Control
                type="text"
                placeholder="Add a notice..."
                value={newNotice}
                onChange={(e) => setNewNotice(e.target.value)}
                className="mt-3"
              />
              <Button className="mt-2" onClick={handleAddNotice}>Post Notice</Button>
            </Card.Body>
          </Card>
        </div>

        {/* Calendar */}
        <div className="col-md-6">
          <Card className="shadow-lg">
            <Card.Header className="bg-info text-white fw-bold">School Calendar</Card.Header>
            <Card.Body>
              <Calendar onChange={setDate} value={date} />
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Additional Features */}
      <div className="row mt-4">
        <div className="col-md-4">
          <Card className="shadow-lg">
            <Card.Header className="bg-secondary text-white">Upcoming Events</Card.Header>
            <Card.Body>No upcoming events</Card.Body>
          </Card>
        </div>

        <div className="col-md-4">
          <Card className="shadow-lg">
            <Card.Header className="bg-secondary text-white">Recent Activity</Card.Header>
            <Card.Body>No recent activity</Card.Body>
          </Card>
        </div>

        <div className="col-md-4">
          <Card className="shadow-lg">
            <Card.Header className="bg-secondary text-white">Quick Links</Card.Header>
            <Card.Body>
              <Button variant="link">Leave Application</Button>
              <Button variant="link">Attendance</Button>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-6 mt-3">
          <Card className="shadow-lg">
            <Card.Header className="bg-secondary text-white">Assignments Due</Card.Header>
            <Card.Body>No pending assignments</Card.Body>
          </Card>
        </div>

        <div className="col-md-6 mt-3">
          <Card className="shadow-lg">
            <Card.Header className="bg-secondary text-white">Message Center</Card.Header>
            <Card.Body>No new messages</Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
