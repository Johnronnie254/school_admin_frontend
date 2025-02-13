import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Teachers from './components/Teachers';
import Students from './components/Students';
import AuthPage from './components/AuthPage';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/api/auth-status/', {
      credentials: 'include', // Ensure cookies are sent
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
        }
      })
      .catch((err) => console.error('Auth check failed', err));
  }, []);

  return (
    <Router>
      <div className="d-flex">
        {!isAuthenticated ? (
          <AuthPage setIsAuthenticated={setIsAuthenticated} />
        ) : (
          <>
            <Sidebar />
            <div className="content-container p-4" style={{ marginLeft: '250px', flex: 1 }}>
              <Routes>
                <Route path="/teachers" element={<Teachers />} />
                <Route path="/students" element={<Students />} />
                <Route path="/performance" element={<div>Performance Page</div>} />
                <Route path="/notifications" element={<div>Notifications Page</div>} />
                <Route path="/fees" element={<div>Fee Management Page</div>} />
              </Routes>
            </div>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
