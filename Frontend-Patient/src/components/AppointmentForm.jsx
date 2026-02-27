import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaStethoscope, FaCalendarAlt, FaMapMarkerAlt, FaClipboardList } from "react-icons/fa";

const AppointmentForm = () => {
  const [department, setDepartment] = useState("");
  const [condition, setCondition] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [address, setAddress] = useState("");
  const [hasVisited, setHasVisited] = useState(false);
  const navigateTo = useNavigate();

  const departmentsArray = [
    { name: "Pediatrics", icon: "👶" },
    { name: "Orthopedics", icon: "🦴" },
    { name: "Cardiology", icon: "❤️" },
    { name: "Neurology", icon: "🧠" },
    { name: "Oncology", icon: "🔬" },
    { name: "Radiology", icon: "📡" },
    { name: "Physical Therapy", icon: "🏃" },
    { name: "Dermatology", icon: "🧴" },
    { name: "ENT", icon: "👂" },
  ];

  const handleAppointment = async (e) => {
    e.preventDefault();
    if (!department) {
      toast.error("Please select a department");
      return;
    }
    if (!condition) {
      toast.error("Please describe your condition");
      return;
    }
    if (!appointmentDate) {
      toast.error("Please select a preferred date");
      return;
    }
    if (!address) {
      toast.error("Please provide your address");
      return;
    }
    try {
      const { data } = await axios.post(
        "${import.meta.env.VITE_API_URL}/api/v1/appointment/post",
        {
          department,
          condition,
          appointment_date: appointmentDate,
          address,
          hasVisited: Boolean(hasVisited),
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("Appointment booked! 🎉 Check your dashboard — a doctor will be assigned to you shortly.");
      navigateTo("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="appointment-page">
      <div className="appointment-container">
        {/* Header */}
        <div className="appointment-header">
          <h2>Book Your Appointment</h2>
          <p>A doctor will be assigned to you automatically based on the department you select.</p>
        </div>

        <form onSubmit={handleAppointment}>
          {/* Step 1: Department Selection */}
          <div className="form-section">
            <div className="section-label">
              <FaStethoscope />
              <span>Select Department</span>
            </div>
            <div className="department-grid">
              {departmentsArray.map((dept, index) => (
                <div
                  key={index}
                  className={`dept-card ${department === dept.name ? "selected" : ""}`}
                  onClick={() => setDepartment(dept.name)}
                >
                  <span className="dept-icon">{dept.icon}</span>
                  <span className="dept-name">{dept.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Condition */}
          <div className="form-section">
            <div className="section-label">
              <FaClipboardList />
              <span>Describe Your Condition</span>
            </div>
            <textarea
              rows="5"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="Please describe your symptoms, concerns, or reason for visit in detail..."
              className="condition-textarea"
            />
          </div>

          {/* Step 3: Date & Address */}
          <div className="form-section">
            <div className="section-label">
              <FaCalendarAlt />
              <span>Preferred Date</span>
            </div>
            <input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="date-input"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="form-section">
            <div className="section-label">
              <FaMapMarkerAlt />
              <span>Your Address</span>
            </div>
            <textarea
              rows="2"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your current residential address"
              className="address-textarea"
            />
          </div>

          {/* Visited Before */}
          <div className="form-section visited-section">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={hasVisited}
                onChange={(e) => setHasVisited(e.target.checked)}
              />
              <span className="checkmark"></span>
              <span>I have visited Ìlera Health & Wellness before</span>
            </label>
          </div>

          {/* Submit */}
          <button type="submit" className="submit-btn">
            Confirm Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
