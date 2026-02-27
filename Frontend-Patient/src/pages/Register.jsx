import React, { useContext, useState } from "react";
import { Context } from "../main";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaLock, FaCalendarAlt } from "react-icons/fa";

const Register = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [nin, setNin] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");

  const navigateTo = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "${import.meta.env.VITE_API_URL}/api/v1/user/patient/register",
        {
          firstName,
          lastName,
          email,
          phone,
          password,
          gender,
          nin,
          dob,
          role: "Patient",
        },
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
      <div className="auth-card auth-card-wide">
        <div className="auth-header">
          <img src="/logo.png" alt="Ìlera" className="auth-logo" />
          <h2>Create Account</h2>
          <p>Join Ìlera Health & Wellness at the University of Lagos</p>
        </div>

        <form onSubmit={handleRegister} className="auth-form">
          <div className="auth-row">
            <div className="auth-field">
              <label>First Name</label>
              <div className="auth-input-wrap">
                <FaUser className="auth-input-icon" />
                <input
                  type="text"
                  value={firstName}
                  placeholder="John"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
            </div>
            <div className="auth-field">
              <label>Last Name</label>
              <div className="auth-input-wrap">
                <FaUser className="auth-input-icon" />
                <input
                  type="text"
                  value={lastName}
                  placeholder="Doe"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="auth-row">
            <div className="auth-field">
              <label>Email Address</label>
              <div className="auth-input-wrap">
                <FaEnvelope className="auth-input-icon" />
                <input
                  type="email"
                  value={email}
                  placeholder="you@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="auth-field">
              <label>Phone Number</label>
              <div className="auth-input-wrap">
                <FaPhone className="auth-input-icon" />
                <input
                  type="text"
                  value={phone}
                  placeholder="08012345678"
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="auth-row">
            <div className="auth-field">
              <label>NIN (National ID)</label>
              <div className="auth-input-wrap">
                <FaIdCard className="auth-input-icon" />
                <input
                  type="text"
                  value={nin}
                  placeholder="12345678901"
                  onChange={(e) => setNin(e.target.value)}
                />
              </div>
            </div>
            <div className="auth-field">
              <label>Date of Birth</label>
              <div className="auth-input-wrap">
                <FaCalendarAlt className="auth-input-icon" />
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="auth-row">
            <div className="auth-field">
              <label>Gender</label>
              <div className="auth-input-wrap">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>
            <div className="auth-field">
              <label>Password</label>
              <div className="auth-input-wrap">
                <FaLock className="auth-input-icon" />
                <input
                  type="password"
                  value={password}
                  placeholder="Create a password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button type="submit" className="auth-submit-btn">
            Create Account
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to={"/login"}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
