import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Context } from "./main";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import "./App.css";

const App = () => {
    const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v1/user/doctor/me`,
                    { withCredentials: true }
                );
                setIsAuthenticated(true);
                setUser(data.user);
            } catch (error) {
                setIsAuthenticated(false);
                setUser({});
            }
        };
        fetchUser();
    }, []);

    return (
        <Router basename="/doctors">
            <Routes>
                <Route
                    path="/"
                    element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
                />
                <Route
                    path="/login"
                    element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
                />
            </Routes>
            <ToastContainer position="top-center" />
        </Router>
    );
};

export default App;
