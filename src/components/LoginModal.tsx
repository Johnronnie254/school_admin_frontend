import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface LoginModalProps {
    show: boolean;
    handleClose: () => void;
    setIsAuthenticated: (value: boolean) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ show, handleClose, setIsAuthenticated }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await api.login(email, password);
            localStorage.setItem("token", response.data.data.token);
            setIsAuthenticated(true);
            handleClose();
            navigate('/dashboard');
        } catch (error) {
            setError("Invalid email or password. Try admin@school.com / password");
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email:</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password:</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-between mt-3">
                        <Button variant="primary" type="submit">Login</Button>
                        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default LoginModal; 