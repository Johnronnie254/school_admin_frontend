import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const LoginModal = ({ show, handleClose, setIsAuthenticated }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:8000/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.access); // Store JWT token
                setIsAuthenticated(true); // Set authentication state
                handleClose(); // Close the modal after successful login
            } else {
                setError(data.message || "Invalid email or password.");
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
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
                    <Form.Group>
                        <Form.Label>Email:</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Password:</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
