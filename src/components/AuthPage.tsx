import React, { useState } from 'react';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import { Button, Container } from 'react-bootstrap';

interface AuthPageProps {
  setIsAuthenticated: (value: boolean) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ setIsAuthenticated }) => {
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [showSignup, setShowSignup] = useState<boolean>(false);

  const buttonStyle = {
    width: '200px', // Fixed width for both buttons
    padding: '10px 0', // Consistent padding
    fontSize: '1.1rem', // Consistent font size
  };

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center vh-100">
      <h1 className="mb-4">Welcome to Edusphere</h1>
      <div className="d-flex flex-column gap-3" style={{ width: '200px' }}>
        <Button 
          variant="primary" 
          style={buttonStyle}
          onClick={() => setShowLogin(true)}
        >
          Login
        </Button>
        <Button 
          variant="secondary" 
          style={buttonStyle}
          onClick={() => setShowSignup(true)}
        >
          Sign Up
        </Button>
      </div>

      <LoginModal 
        show={showLogin} 
        handleClose={() => setShowLogin(false)} 
        setIsAuthenticated={setIsAuthenticated} 
      />
      <SignupModal 
        show={showSignup} 
        handleClose={() => setShowSignup(false)} 
      />
    </Container>
  );
};

export default AuthPage; 