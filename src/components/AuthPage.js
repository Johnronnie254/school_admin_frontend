import React, { useState } from 'react';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import { Button, Container } from 'react-bootstrap';

const AuthPage = ({ setIsAuthenticated }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center vh-100">
      <h1 className="mb-4">Welcome to Edusphere</h1>
      <Button variant="primary" className="mb-2" onClick={() => setShowLogin(true)}>
        Login
      </Button>
      <Button variant="secondary" onClick={() => setShowSignup(true)}>
        Sign Up
      </Button>

      <LoginModal show={showLogin} handleClose={() => setShowLogin(false)} setIsAuthenticated={setIsAuthenticated} />
      <SignupModal show={showSignup} handleClose={() => setShowSignup(false)} />
    </Container>
  );
};

export default AuthPage;
