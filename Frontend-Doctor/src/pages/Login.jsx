import React, { useContext, useState } from "react";
import { Context } from "../main";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaStethoscope } from "react-icons/fa";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setIsAuthenticated, setUser } = useContext(Context);
    const navigateTo = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/user/login`,
                {
                    email,
                    password,
                    confirmPassword: password,
                    role: "Doctor",
                },
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                }
            );
            toast.success("Welcome back, Doctor!");
            setIsAuthenticated(true);
            setUser(data.user);
            navigateTo("/");
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo">
                        <FaStethoscope className="logo-icon" />
                    </div>
                    <h1>Ìlera Health</h1>
                    <p className="login-subtitle">Doctor Portal</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <FaEnvelope className="input-icon" />
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <FaLock className="input-icon" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-btn">
                        Sign In
                    </button>
                </form>

                <p className="login-hint">
                    Use the credentials sent to your email by the admin.
                </p>
            </div>
        </div>
    );
};

export default Login;
