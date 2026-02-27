import React, { useContext, useState } from "react";
import { Context } from "../main";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/login`,
        { email, password, confirmPassword: password, role: "Patient" },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(response.data.message);
      setIsAuthenticated(true);
      navigateTo("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <img src="/logo.png" alt="Ìlera" className="auth-logo" />
          <h2>Welcome Back</h2>
          <p>Sign in to manage your appointments and healthcare</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="auth-field">
            <label>Email Address</label>
            <div className="auth-input-wrap">
              <FaEnvelope className="auth-input-icon" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="auth-field">
            <label>Password</label>
            <div className="auth-input-wrap">
              <FaLock className="auth-input-icon" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn">
            Sign In
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to={"/register"}>Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
