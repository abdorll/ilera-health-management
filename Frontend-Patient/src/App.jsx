import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AboutUs from "./pages/AboutUs";
import Appointment from "./pages/Appointment";
import PatientDashboard from "./pages/PatientDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import { Context } from "./main";
import axios from "axios";
import Footer from "./components/footer";
import Loading from "./components/loading";

const App = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "${import.meta.env.VITE_API_URL}/api/v1/user/patient/me",
          { withCredentials: true }
        );
        setIsAuthenticated(true);
        setUser(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setUser({});
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [isAuthenticated, setIsAuthenticated, setUser]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Router basename="/patient">
        <Navbar />
        <Routes>
          {isAuthenticated ? (
            <>
              <Route path="/" element={<PatientDashboard />} />
              <Route path="/appointment" element={<Appointment />} />
              <Route path="/dashboard" element={<PatientDashboard />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </>
          )}
          {/* Always accessible */}
          <Route path="/appointment" element={<Appointment />} />
        </Routes>
        {!isAuthenticated && <Footer />}
        <ToastContainer position="top-center" />
      </Router>
    </>
  );
};

export default App;
