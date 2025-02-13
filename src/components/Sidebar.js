import React from 'react';
import { Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function Sidebar({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/api/logout/', {
        method: 'POST',
        credentials: 'include', // Ensures cookies are included
      });
      setIsAuthenticated(false);
      navigate('/'); // Redirect to login page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div
      className="bg-dark text-white d-flex flex-column p-3"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: '250px',
      }}
    >
      <h3>EduSphere</h3>
      <Nav className="flex-column flex-grow-1">
        <Nav.Link as={Link} to="/dashboard" className="text-white fw-bold">Dashboard</Nav.Link>
        <Nav.Link as={Link} to="/teachers" className="text-white">Teachers</Nav.Link>
        <Nav.Link as={Link} to="/students" className="text-white">Students</Nav.Link>
        <Nav.Link as={Link} to="/performance" className="text-white">Performance</Nav.Link>
        <Nav.Link as={Link} to="/notifications" className="text-white">Notifications</Nav.Link>
        <Nav.Link as={Link} to="/fees" className="text-white">Fee Management</Nav.Link>
      </Nav>

      {/* Sign Out Button - Stays at the Bottom */}
      <div className="mt-auto">
        <Button variant="danger" className="w-100" onClick={handleLogout}>
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export default Sidebar;
