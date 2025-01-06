// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Teachers from './components/Teachers';
import Students from './components/Students';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div className="d-flex">
        <Sidebar />
        <div
          className="content-container p-4"
          style={{ marginLeft: '250px', flex: 1 }} // Add margin-left to account for sidebar width
        >
          <Routes>
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/students" element={<Students />} />
            <Route path="/performance" element={<div>Performance Page</div>} />
            <Route path="/notifications" element={<div>Notifications Page</div>} />
            <Route path="/fees" element={<div>Fee Management Page</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
