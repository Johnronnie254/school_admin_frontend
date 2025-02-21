import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false); // Controls login form visibility
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:8000/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.access); // Store JWT access token
                navigate("/dashboard"); // Redirect to dashboard
            } else {
                setError(data.message || "Invalid email or password.");
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div>
            {/* Buttons for Login & Sign Up */}
            <button onClick={() => setShowForm(true)}>Login</button>
            <button onClick={() => navigate("/signup")}>Sign Up</button>

            {/* Show login form only when "Login" is clicked */}
            {showForm && (
                <div>
                    <h2>Login</h2>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <form onSubmit={handleLogin}>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <br />

                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <br />

                        <button type="submit">Login</button>
                        <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Login;
