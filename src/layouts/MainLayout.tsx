import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from '../components/Sidebar';
import { useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  const handleSetIsAuthenticated = (value: boolean) => {
    if (!value) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar setIsAuthenticated={handleSetIsAuthenticated} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${240}px)` },
          marginLeft: '250px',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout; 