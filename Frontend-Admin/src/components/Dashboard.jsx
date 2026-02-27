import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import Loading from "./loading";
import axios from "axios";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import { FaUserMd } from "react-icons/fa";
import { toast } from "react-toastify";

const statusColors = {
  Pending: { bg: "#fff8e1", color: "#b45309", label: "⏳ Awaiting Doctor Assignment" },
  Assigned: { bg: "#e0f2fe", color: "#0369a1", label: "📋 Doctor Assigned — Awaiting Response" },
  Accepted: { bg: "#e8f5ee", color: "#16a34a", label: "✅ Doctor Confirmed" },
  Rejected: { bg: "#fef2f2", color: "#dc2626", label: "❌ Doctor Declined — Needs Reassignment" },
  Completed: { bg: "#f0fdf4", color: "#15803d", label: "🏁 Visit Completed" },
};

const Dashboard = () => {
  const { isAuthenticated, user } = useContext(Context);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState(null);
  const [deptDoctors, setDeptDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "${import.meta.env.VITE_API_URL}/api/v1/appointment/getall",
          { withCredentials: true }
        );
        setAppointments(data.appointments);
      } catch (error) {
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const openAssignPanel = async (appointment) => {
    setAssigningId(appointment._id);
    setSelectedDoctor("");
    setLoadingDoctors(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/appointment/doctors/${encodeURIComponent(appointment.department)}`,
        { withCredentials: true }
      );
      setDeptDoctors(data.doctors);
    } catch (error) {
      toast.error("Failed to fetch doctors");
      setDeptDoctors([]);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleAssignDoctor = async () => {
    if (!selectedDoctor) {
      toast.error("Please select a doctor!");
      return;
    }
    try {
      const { data } = await axios.put(
        "${import.meta.env.VITE_API_URL}/api/v1/appointment/assign",
        { appointmentId: assigningId, doctorId: selectedDoctor },
        { withCredentials: true }
      );
      toast.success(data.message);
      const doctor = deptDoctors.find((d) => d._id === selectedDoctor);
      setAppointments((prev) =>
        prev.map((apt) =>
          apt._id === assigningId
            ? {
              ...apt,
              doctorId: doctor,
              doctor: { firstName: doctor.firstName, lastName: doctor.lastName },
              status: "Assigned",
            }
            : apt
        )
      );
      setAssigningId(null);
      setDeptDoctors([]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Assignment failed");
    }
  };

  if (loading) return <Loading />;
  if (!isAuthenticated) return <Navigate to={"/login"} />;

  const pending = appointments.filter((a) => a.status === "Pending");
  const rejected = appointments.filter((a) => a.status === "Rejected");
  const needsAction = [...pending, ...rejected];
  const assigned = appointments.filter((a) => a.status === "Assigned");
  const accepted = appointments.filter((a) => a.status === "Accepted");
  const completed = appointments.filter((a) => a.status === "Completed");

  return (
    <>
      <section className="dashboard page">
        <div className="banner">
          <div className="firstBox">
            <img src="/doc.png" alt="Admin" />
            <div className="content">
              <div>
                <p>Hello, </p>
                <h5>{user && `${user.firstName} ${user.lastName}`}</h5>
              </div>
              <p>Manage appointments, assign doctors, and oversee the system.</p>
            </div>
          </div>
          <div className="secondBox">
            <p>Total Appointments</p>
            <h3>{appointments.length}</h3>
          </div>
          <div className="thirdBox">
            <p>Needs Action</p>
            <h3 style={{ color: needsAction.length > 0 ? "#f59e0b" : "#16a34a" }}>
              {needsAction.length}
            </h3>
          </div>
        </div>

        {/* Appointments needing doctor assignment (Pending + Rejected) */}
        {needsAction.length > 0 && (
          <div className="banner">
            <h5 style={{ color: "#b45309" }}>
              ⏳ Needs Doctor Assignment ({needsAction.length})
            </h5>
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Department</th>
                  <th>Condition</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {needsAction.map((apt) => (
                  <tr key={apt._id}>
                    <td>{`${apt.patientFirstName} ${apt.patientLastName}`}</td>
                    <td>{apt.appointment_date}</td>
                    <td>{apt.department}</td>
                    <td>
                      {apt.status === "Rejected" && apt.doctor?.firstName && (
                        <span style={{ display: "block", color: "#dc2626", fontSize: "0.75rem", fontWeight: 600, marginBottom: 2 }}>
                          ❌ Dr. {apt.doctor.firstName} {apt.doctor.lastName} declined
                        </span>
                      )}
                      {apt.condition && apt.condition.length > 40
                        ? apt.condition.substring(0, 40) + "..."
                        : apt.condition}
                    </td>
                    <td>
                      {assigningId === apt._id ? (
                        <div className="assign-panel">
                          {loadingDoctors ? (
                            <span className="assign-loading">Loading...</span>
                          ) : deptDoctors.length === 0 ? (
                            <span className="assign-no-doctors">No doctors in this dept</span>
                          ) : (
                            <>
                              <select
                                value={selectedDoctor}
                                onChange={(e) => setSelectedDoctor(e.target.value)}
                                className="assign-select"
                              >
                                <option value="">Select Doctor</option>
                                {deptDoctors.map((doc) => (
                                  <option key={doc._id} value={doc._id}>
                                    Dr. {doc.firstName} {doc.lastName}
                                  </option>
                                ))}
                              </select>
                              <button className="assign-btn" onClick={handleAssignDoctor}>
                                Assign
                              </button>
                            </>
                          )}
                          <button className="assign-cancel" onClick={() => setAssigningId(null)}>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button className="assign-trigger-btn" onClick={() => openAssignPanel(apt)}>
                          <FaUserMd /> Assign Doctor
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* All Appointments */}
        <div className="banner">
          <h5>All Appointments</h5>
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Department</th>
                <th>Doctor</th>
                <th>Condition</th>
                <th>Status</th>
                <th>Visited</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length > 0 ? (
                appointments.map((appointment) => {
                  const doc = appointment.doctorId || appointment.doctor;
                  const doctorName =
                    doc && doc.firstName
                      ? `Dr. ${doc.firstName} ${doc.lastName}`
                      : "Not Assigned";
                  const st = statusColors[appointment.status] || statusColors.Pending;

                  return (
                    <tr key={appointment._id}>
                      <td>{`${appointment.patientFirstName} ${appointment.patientLastName}`}</td>
                      <td>{appointment.appointment_date}</td>
                      <td>{appointment.department}</td>
                      <td>
                        <span
                          style={{
                            color: doctorName === "Not Assigned" ? "#f59e0b" : "inherit",
                            fontWeight: doctorName === "Not Assigned" ? 600 : 400,
                          }}
                        >
                          {doctorName}
                        </span>
                      </td>
                      <td>
                        {appointment.condition && appointment.condition.length > 40
                          ? appointment.condition.substring(0, 40) + "..."
                          : appointment.condition}
                      </td>
                      <td>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            background: st.bg,
                            color: st.color,
                          }}
                        >
                          {st.label}
                        </span>
                      </td>
                      <td>
                        {appointment.hasVisited ? (
                          <GoCheckCircleFill className="green" />
                        ) : (
                          <AiFillCloseCircle className="red" />
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "40px" }}>
                    No Appointments Yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default Dashboard;