import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Teachers from './pages/Teachers';
import Students from './pages/Students';
import Performance from './pages/Performance';
import FeeManagement from './pages/FeeManagement';
import Login from './pages/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PerformanceManagement from './pages/Performance';
import Notifications from './pages/Notifications';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));

  return (
    <Provider store={store}>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/teachers" element={<Teachers />} />
              <Route path="/students" element={<Students />} />
              <Route path="/performance" element={<ProtectedRoute isAuthenticated={isAuthenticated}><PerformanceManagement /></ProtectedRoute>} />
              <Route path="/fees" element={<FeeManagement />} />
              <Route path="/notifications" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Notifications /></ProtectedRoute>} />
            </Route>
          </Routes>
        </MainLayout>
        <ToastContainer position="top-right" autoClose={5000} />
      </Router>
    </Provider>
  );
}

export default App; 