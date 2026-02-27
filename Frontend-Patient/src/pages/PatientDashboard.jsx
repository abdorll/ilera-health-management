import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Link } from "react-router-dom";
import axios from "axios";
import {
    FaCalendarPlus,
    FaStethoscope,
    FaClock,
    FaCheckCircle,
    FaTimesCircle,
    FaHourglassHalf,
    FaUserMd,
    FaEnvelope,
    FaPhone,
    FaChevronDown,
    FaChevronUp,
    FaMapMarkerAlt,
    FaCalendarAlt,
} from "react-icons/fa";

const PatientDashboard = () => {
    const { user } = useContext(Context);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        const fetchMyAppointments = async () => {
            try {
                const { data } = await axios.get(
                    "${import.meta.env.VITE_API_URL}/api/v1/appointment/myappointments",
                    { withCredentials: true }
                );
                setAppointments(data.appointments);
            } catch (error) {
                setAppointments([]);
            } finally {
                setLoading(false);
            }
        };
        fetchMyAppointments();
    }, []);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Accepted":
                return <FaCheckCircle className="status-icon" />;
            case "Completed":
                return <FaCheckCircle className="status-icon" />;
            case "Assigned":
                return <FaHourglassHalf className="status-icon" />;
            case "Rejected":
                return <FaTimesCircle className="status-icon" />;
            default:
                return <FaHourglassHalf className="status-icon" />;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "Accepted":
                return "status-accepted";
            case "Completed":
                return "status-completed";
            case "Assigned":
                return "status-assigned";
            case "Rejected":
                return "status-rejected";
            default:
                return "status-pending";
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "Pending":
                return "Pending";
            case "Assigned":
                return "Doctor Assigned";
            case "Accepted":
                return "Doctor Accepted";
            case "Completed":
                return "Completed";
            case "Rejected":
                return "Being Reassigned";
            default:
                return status;
        }
    };

    return (
        <div className="patient-dashboard">
            {/* Welcome header */}
            <div className="dash-header">
                <div className="dash-welcome">
                    <h1>Welcome, {user?.firstName}! 👋</h1>
                    <p>Manage your appointments and track your healthcare journey</p>
                </div>
                <Link to="/appointment" className="dash-book-btn">
                    <FaCalendarPlus />
                    <span>Book Appointment</span>
                </Link>
            </div>

            {/* Stats row */}
            <div className="dash-stats">
                <div className="stat-card">
                    <div className="stat-icon total">
                        <FaStethoscope />
                    </div>
                    <div className="stat-info">
                        <span className="stat-number">{appointments.length}</span>
                        <span className="stat-label">Total Appointments</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon pending">
                        <FaClock />
                    </div>
                    <div className="stat-info">
                        <span className="stat-number">
                            {appointments.filter((a) => a.status === "Pending").length}
                        </span>
                        <span className="stat-label">Pending</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon accepted">
                        <FaCheckCircle />
                    </div>
                    <div className="stat-info">
                        <span className="stat-number">
                            {appointments.filter((a) => a.status === "Accepted").length}
                        </span>
                        <span className="stat-label">Accepted</span>
                    </div>
                </div>
            </div>

            {/* Appointments list */}
            <div className="dash-section">
                <h2>Your Appointments</h2>

                {loading ? (
                    <div className="dash-loading">Loading appointments...</div>
                ) : appointments.length === 0 ? (
                    <div className="dash-empty">
                        <FaCalendarPlus className="empty-icon" />
                        <h3>No appointments yet</h3>
                        <p>
                            Book your first appointment to get started with Ìlera Health &
                            Wellness.
                        </p>
                        <Link to="/appointment" className="dash-book-btn">
                            Book Now
                        </Link>
                    </div>
                ) : (
                    <div className="appointments-list">
                        {appointments.map((apt) => {
                            const doc = apt.doctorId; // populated doctor object
                            const isExpanded = expandedId === apt._id;

                            return (
                                <div
                                    className={`appointment-card ${isExpanded ? "expanded" : ""}`}
                                    key={apt._id}
                                >
                                    {/* Card header */}
                                    <div
                                        className="apt-top"
                                        onClick={() => toggleExpand(apt._id)}
                                    >
                                        <div className="apt-top-left">
                                            <div className="apt-dept">
                                                <FaStethoscope className="apt-dept-icon" />
                                                <span>{apt.department}</span>
                                            </div>
                                            <span className="apt-date-badge">
                                                <FaCalendarAlt /> {apt.appointment_date}
                                            </span>
                                        </div>
                                        <div className="apt-top-right">
                                            <div
                                                className={`apt-status ${getStatusClass(apt.status)}`}
                                            >
                                                {getStatusIcon(apt.status)}
                                                <span>{getStatusLabel(apt.status)}</span>
                                            </div>
                                            <span className="apt-expand-icon">
                                                {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card body */}
                                    <div className={`apt-body ${isExpanded ? "show" : ""}`}>
                                        {/* Condition */}
                                        <div className="apt-condition-block">
                                            <span className="apt-label">Condition</span>
                                            <p className="apt-value">{apt.condition}</p>
                                        </div>

                                        <div className="apt-detail-grid">
                                            <div className="apt-detail-item">
                                                <FaMapMarkerAlt className="apt-detail-icon" />
                                                <div>
                                                    <span className="apt-label">Address</span>
                                                    <span className="apt-value">{apt.address}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Doctor profile card */}
                                        {doc && (
                                            <div className="doctor-profile-card">
                                                <div className="doc-profile-header">
                                                    <FaUserMd className="doc-section-icon" />
                                                    <span>Assigned Doctor</span>
                                                </div>
                                                <div className="doc-profile-body">
                                                    {doc.doctrAvatar?.url ? (
                                                        <img
                                                            src={doc.doctrAvatar.url}
                                                            alt={`Dr. ${doc.firstName}`}
                                                            className="doc-avatar"
                                                        />
                                                    ) : (
                                                        <div className="doc-avatar-placeholder">
                                                            <FaUserMd />
                                                        </div>
                                                    )}
                                                    <div className="doc-info">
                                                        <h4 className="doc-name">
                                                            Dr. {doc.firstName} {doc.lastName}
                                                        </h4>
                                                        <span className="doc-dept-badge">
                                                            {doc.doctrDptmnt}
                                                        </span>
                                                        <div className="doc-details">
                                                            <div className="doc-detail-item">
                                                                <FaEnvelope />
                                                                <span>{doc.email}</span>
                                                            </div>
                                                            <div className="doc-detail-item">
                                                                <FaPhone />
                                                                <span>{doc.phone}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Show "awaiting" if no doctor assigned */}
                                        {!doc && (
                                            <div className="awaiting-assignment">
                                                <FaHourglassHalf className="awaiting-icon" />
                                                <div>
                                                    <h4>Awaiting Doctor Assignment</h4>
                                                    <p>An admin will assign a doctor in the {apt.department} department to your appointment shortly.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientDashboard;
