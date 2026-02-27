import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
    FaUserMd,
    FaSignOutAlt,
    FaStethoscope,
    FaCalendarAlt,
    FaCheckCircle,
    FaHourglassHalf,
    FaMapMarkerAlt,
    FaClipboardList,
    FaHandHoldingMedical,
    FaUserInjured,
    FaEnvelope,
    FaPhone,
    FaCheck,
    FaTimes,
    FaFlagCheckered,
} from "react-icons/fa";

const statusConfig = {
    Assigned: { bg: "#e0f2fe", color: "#0369a1", label: "📋 Awaiting Your Response" },
    Accepted: { bg: "#e8f5ee", color: "#16a34a", label: "✅ You Accepted — Active" },
    Completed: { bg: "#f0fdf4", color: "#15803d", label: "🏁 Visit Completed" },
};

const Dashboard = () => {
    const { user, setIsAuthenticated, setUser } = useContext(Context);
    const navigateTo = useNavigate();
    const [myAppointments, setMyAppointments] = useState([]);
    const [unassignedAppointments, setUnassignedAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("my");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [myRes, unRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/api/v1/appointment/doctor/mypatients`, {
                    withCredentials: true,
                }),
                axios.get(`${import.meta.env.VITE_API_URL}/api/v1/appointment/doctor/unassigned`, {
                    withCredentials: true,
                }),
            ]);
            setMyAppointments(myRes.data.appointments);
            setUnassignedAppointments(unRes.data.appointments);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelfAssign = async (appointmentId) => {
        try {
            const { data } = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/v1/appointment/doctor/selfassign`,
                { appointmentId },
                { withCredentials: true }
            );
            toast.success(data.message);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to assign");
        }
    };

    const handleRespond = async (appointmentId, response) => {
        try {
            const { data } = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/v1/appointment/doctor/respond`,
                { appointmentId, response },
                { withCredentials: true }
            );
            toast.success(data.message);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Action failed");
        }
    };

    const handleComplete = async (appointmentId) => {
        try {
            const { data } = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/v1/appointment/doctor/complete`,
                { appointmentId },
                { withCredentials: true }
            );
            toast.success(data.message);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Action failed");
        }
    };

    const handleLogout = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user/doctor/logout`, {
                withCredentials: true,
            });
            toast.success("Logged out successfully");
            setIsAuthenticated(false);
            setUser({});
            navigateTo("/login");
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    const assignedToMe = myAppointments.filter((a) => a.status === "Assigned");
    const acceptedByMe = myAppointments.filter((a) => a.status === "Accepted");
    const completedByMe = myAppointments.filter((a) => a.status === "Completed");

    return (
        <div className="doctor-app">
            {/* Navbar */}
            <nav className="doc-navbar">
                <div className="doc-nav-brand">
                    <FaStethoscope className="nav-logo-icon" />
                    <span className="nav-brand-text">Ìlera Health</span>
                    <span className="nav-brand-badge">Doctor</span>
                </div>
                <div className="doc-nav-right">
                    <div className="doc-nav-user">
                        <FaUserMd />
                        <span>Dr. {user?.firstName} {user?.lastName}</span>
                    </div>
                    <span className="doc-nav-dept">{user?.doctrDptmnt}</span>
                    <button className="doc-logout-btn" onClick={handleLogout}>
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                </div>
            </nav>

            <div className="doc-content">
                {/* Welcome */}
                <div className="doc-welcome">
                    <div>
                        <h1>Welcome, Dr. {user?.firstName}! 👋</h1>
                        <p>Manage your patients and respond to appointments</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="doc-stats">
                    <div className="doc-stat-card">
                        <div className="doc-stat-icon" style={{ background: "#e0f2fe", color: "#0369a1" }}>
                            <FaClipboardList />
                        </div>
                        <div className="doc-stat-info">
                            <span className="doc-stat-num">{assignedToMe.length}</span>
                            <span className="doc-stat-label">Awaiting Response</span>
                        </div>
                    </div>
                    <div className="doc-stat-card">
                        <div className="doc-stat-icon assigned">
                            <FaCheckCircle />
                        </div>
                        <div className="doc-stat-info">
                            <span className="doc-stat-num">{acceptedByMe.length}</span>
                            <span className="doc-stat-label">Active Patients</span>
                        </div>
                    </div>
                    <div className="doc-stat-card">
                        <div className="doc-stat-icon" style={{ background: "#f0fdf4", color: "#15803d" }}>
                            <FaFlagCheckered />
                        </div>
                        <div className="doc-stat-info">
                            <span className="doc-stat-num">{completedByMe.length}</span>
                            <span className="doc-stat-label">Completed</span>
                        </div>
                    </div>
                    <div className="doc-stat-card">
                        <div className="doc-stat-icon unassigned">
                            <FaHourglassHalf />
                        </div>
                        <div className="doc-stat-info">
                            <span className="doc-stat-num">{unassignedAppointments.length}</span>
                            <span className="doc-stat-label">Unassigned in Dept</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="doc-tabs">
                    <button
                        className={`doc-tab ${activeTab === "my" ? "active" : ""}`}
                        onClick={() => setActiveTab("my")}
                    >
                        <FaUserInjured /> My Patients ({myAppointments.length})
                    </button>
                    <button
                        className={`doc-tab ${activeTab === "unassigned" ? "active" : ""}`}
                        onClick={() => setActiveTab("unassigned")}
                    >
                        <FaHandHoldingMedical /> Unassigned ({unassignedAppointments.length})
                    </button>
                </div>

                {loading ? (
                    <div className="doc-loading">Loading appointments...</div>
                ) : activeTab === "my" ? (
                    <div className="doc-apt-list">
                        {myAppointments.length === 0 ? (
                            <div className="doc-empty">
                                <FaCalendarAlt className="doc-empty-icon" />
                                <h3>No patients assigned yet</h3>
                                <p>Check the "Unassigned" tab for appointments you can pick up.</p>
                            </div>
                        ) : (
                            myAppointments.map((apt) => {
                                const st = statusConfig[apt.status] || {};
                                return (
                                    <div className="doc-apt-card" key={apt._id}>
                                        <div className="doc-apt-header">
                                            <div className="doc-apt-patient">
                                                <FaUserInjured className="doc-apt-patient-icon" />
                                                <div>
                                                    <h4>{apt.patientFirstName} {apt.patientLastName}</h4>
                                                    <span className="doc-apt-dept-badge">{apt.department}</span>
                                                </div>
                                            </div>
                                            <div className="doc-apt-header-right">
                                                <span
                                                    className="doc-status-badge"
                                                    style={{ background: st.bg, color: st.color }}
                                                >
                                                    {st.label}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="doc-apt-body">
                                            <div className="doc-apt-detail">
                                                <FaClipboardList className="doc-apt-detail-icon" />
                                                <div>
                                                    <span className="doc-apt-label">Condition</span>
                                                    <p className="doc-apt-value">{apt.condition}</p>
                                                </div>
                                            </div>
                                            <div className="doc-apt-meta">
                                                <div className="doc-apt-detail">
                                                    <FaCalendarAlt className="doc-apt-detail-icon" />
                                                    <div>
                                                        <span className="doc-apt-label">Date</span>
                                                        <span className="doc-apt-value">{apt.appointment_date}</span>
                                                    </div>
                                                </div>
                                                <div className="doc-apt-detail">
                                                    <FaMapMarkerAlt className="doc-apt-detail-icon" />
                                                    <div>
                                                        <span className="doc-apt-label">Address</span>
                                                        <span className="doc-apt-value">{apt.address}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="doc-apt-contact">
                                                <div className="doc-apt-contact-item">
                                                    <FaEnvelope /> {apt.patientEmail}
                                                </div>
                                                <div className="doc-apt-contact-item">
                                                    <FaPhone /> {apt.patientPhone}
                                                </div>
                                            </div>

                                            {/* Action buttons based on status */}
                                            {apt.status === "Assigned" && (
                                                <div className="doc-action-row">
                                                    <button
                                                        className="doc-accept-btn"
                                                        onClick={() => handleRespond(apt._id, "Accepted")}
                                                    >
                                                        <FaCheck /> Accept
                                                    </button>
                                                    <button
                                                        className="doc-reject-btn"
                                                        onClick={() => handleRespond(apt._id, "Rejected")}
                                                    >
                                                        <FaTimes /> Decline
                                                    </button>
                                                </div>
                                            )}
                                            {apt.status === "Accepted" && (
                                                <div className="doc-action-row">
                                                    <button
                                                        className="doc-complete-btn"
                                                        onClick={() => handleComplete(apt._id)}
                                                    >
                                                        <FaFlagCheckered /> Mark Completed
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                ) : (
                    <div className="doc-apt-list">
                        {unassignedAppointments.length === 0 ? (
                            <div className="doc-empty">
                                <FaCheckCircle className="doc-empty-icon" style={{ color: "#16a34a" }} />
                                <h3>All caught up!</h3>
                                <p>No unassigned appointments in your department right now.</p>
                            </div>
                        ) : (
                            unassignedAppointments.map((apt) => (
                                <div className="doc-apt-card unassigned" key={apt._id}>
                                    <div className="doc-apt-header">
                                        <div className="doc-apt-patient">
                                            <FaUserInjured className="doc-apt-patient-icon" />
                                            <div>
                                                <h4>{apt.patientFirstName} {apt.patientLastName}</h4>
                                                <span className="doc-apt-dept-badge">{apt.department}</span>
                                            </div>
                                        </div>
                                        <button
                                            className="doc-self-assign-btn"
                                            onClick={() => handleSelfAssign(apt._id)}
                                        >
                                            <FaHandHoldingMedical /> Take This Patient
                                        </button>
                                    </div>
                                    <div className="doc-apt-body">
                                        <div className="doc-apt-detail">
                                            <FaClipboardList className="doc-apt-detail-icon" />
                                            <div>
                                                <span className="doc-apt-label">Condition</span>
                                                <p className="doc-apt-value">{apt.condition}</p>
                                            </div>
                                        </div>
                                        <div className="doc-apt-meta">
                                            <div className="doc-apt-detail">
                                                <FaCalendarAlt className="doc-apt-detail-icon" />
                                                <div>
                                                    <span className="doc-apt-label">Date</span>
                                                    <span className="doc-apt-value">{apt.appointment_date}</span>
                                                </div>
                                            </div>
                                            <div className="doc-apt-detail">
                                                <FaMapMarkerAlt className="doc-apt-detail-icon" />
                                                <div>
                                                    <span className="doc-apt-label">Address</span>
                                                    <span className="doc-apt-value">{apt.address}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
