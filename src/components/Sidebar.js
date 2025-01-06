import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div
      className="bg-dark text-white p-3"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: '250px', // Fixed width
      }}
    >
      <h3>EduSphere</h3>
      <Nav className="flex-column">
        <Nav.Link as={Link} to="/teachers" className="text-white">Teachers</Nav.Link>
        <Nav.Link as={Link} to="/students" className="text-white">Students</Nav.Link>
        <Nav.Link as={Link} to="/performance" className="text-white">Performance</Nav.Link>
        <Nav.Link as={Link} to="/notifications" className="text-white">Notifications</Nav.Link>
        <Nav.Link as={Link} to="/fees" className="text-white">Fee Management</Nav.Link>
      </Nav>
    </div>
  );
}

export default Sidebar;
