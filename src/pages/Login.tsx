import React from 'react';
import AuthPage from '../components/AuthPage';

interface LoginPageProps {
  setIsAuthenticated: (value: boolean) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setIsAuthenticated }) => {
  return <AuthPage setIsAuthenticated={setIsAuthenticated} />;
};

export default LoginPage; 