import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import type { Value } from 'react-calendar/dist/cjs/shared/types';
import 'react-calendar/dist/Calendar.css';
import { Card, Button, ListGroup, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { DashboardStats, Notice } from '../types';
import { RootState } from '../store';
import api from '../services/api';
import useApi from '../hooks/useApi';

interface DashboardNotice extends Omit<Notice, 'id' | 'author' | 'type' | 'date'> {
  date: Date;
  text: string;
}

const Dashboard: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [notices, setNotices] = useState<DashboardNotice[]>([]);
  const [newNotice, setNewNotice] = useState<string>("");
  const { user } = useSelector((state: RootState) => state.auth);

  const { data: stats, loading, error, execute: fetchStats } = useApi<DashboardStats>({
    errorMessage: 'Failed to fetch dashboard stats'
  });

  useEffect(() => {
    fetchStats(api.getDashboardStats());
  }, [fetchStats]);

  const handleDateChange = (value: Value) => {
    if (value instanceof Date) {
      setDate(value);
    }
  };

  const handleAddNotice = () => {
    if (newNotice.trim() !== "") {
      setNotices([...notices, { date, text: newNotice, content: newNotice, title: '' }]);
      setNewNotice("");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!stats) return null;

  const defaultStats = {
    totalStudents: stats?.totalStudents ?? 0,
    totalTeachers: stats?.totalTeachers ?? 0,
    upcomingEvents: stats?.upcomingEvents ?? [],
    recentNotices: stats?.recentNotices ?? [],
    attendance: stats?.attendance ?? { present: 0, absent: 0, total: 0 }
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
              {defaultStats.totalStudents}
            </div>
          </Card>
        </div>

        <div className="col-md-6 mb-3">
          <Card className="p-3 text-center shadow-lg">
            <h4>Teachers</h4>
            <div className="mx-auto bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: '100px', height: '100px', fontSize: '24px' }}>
              {defaultStats.totalTeachers}
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
                  <ListGroup.Item key={index}>
                    {notice.date.toDateString()} - {notice.text}
                    <Button variant="outline-primary" size="sm" className="float-end">Share</Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Form.Control
                type="text"
                placeholder="Add a notice..."
                value={newNotice}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewNotice(e.target.value)}
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
              <Calendar onChange={handleDateChange} value={date} />
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Additional Features */}
      <div className="row mt-4">
        <div className="col-md-4">
          <Card className="shadow-lg">
            <Card.Header className="bg-secondary text-white">Upcoming Events</Card.Header>
            <Card.Body>
              {defaultStats.upcomingEvents.length > 0 ? (
                <ListGroup>
                  {defaultStats.upcomingEvents.map((event) => (
                    <ListGroup.Item key={event.id}>
                      {event.title} - {new Date(event.date).toLocaleDateString()}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                'No upcoming events'
              )}
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4">
          <Card className="shadow-lg">
            <Card.Header className="bg-secondary text-white">Recent Activity</Card.Header>
            <Card.Body>
              {defaultStats.recentNotices.length > 0 ? (
                <ListGroup>
                  {defaultStats.recentNotices.map((notice) => (
                    <ListGroup.Item key={notice.id}>
                      {notice.title}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                'No recent activity'
              )}
            </Card.Body>
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
            <Card.Header className="bg-secondary text-white">Attendance Overview</Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-around">
                <div className="text-center">
                  <h5>Present</h5>
                  <div className="text-success">{defaultStats.attendance.present}</div>
                </div>
                <div className="text-center">
                  <h5>Absent</h5>
                  <div className="text-danger">{defaultStats.attendance.absent}</div>
                </div>
                <div className="text-center">
                  <h5>Total</h5>
                  <div>{defaultStats.attendance.total}</div>
                </div>
              </div>
            </Card.Body>
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