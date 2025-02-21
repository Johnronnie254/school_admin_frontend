import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Teachers from './components/Teachers';
import Students from './components/Students';
import Dashboard from './Dashboard';
import Performance from './components/Performance';  // Import Performance component
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div className="d-flex">
        {/* Sidebar remains visible */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="content-container p-4" style={{ marginLeft: '250px', flex: 1 }}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/students" element={<Students />} />
            <Route path="/performance" element={<Performance />} />  {/* Render Performance component */}
            <Route path="/notifications" element={<div>Notifications Page</div>} />
            <Route path="/fees" element={<div>Fee Management Page</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
