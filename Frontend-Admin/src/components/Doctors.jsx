import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { toast } from "react-toastify";
import axios from "axios";
import Loading from "./loading";
import { Navigate } from "react-router-dom";
import { FaEdit, FaTrash, FaTimes, FaSave, FaEnvelope, FaPhone, FaCalendarAlt, FaIdCard, FaVenusMars, FaStethoscope } from "react-icons/fa";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useContext(Context);
  const isPrincipal = user?.email === "admin@ilera.com";
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/user/doctors`,
          { withCredentials: true }
        );
        setDoctors(data.doctors);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch doctors");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const startEdit = (doc) => {
    setEditingId(doc._id);
    setEditData({
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      phone: doc.phone,
      doctrDptmnt: doc.doctrDptmnt,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async (id) => {
    setSaving(true);
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/user/doctor/edit/${id}`,
        editData,
        { withCredentials: true }
      );
      toast.success(data.message);
      setDoctors((prev) =>
        prev.map((d) => (d._id === id ? { ...d, ...editData } : d))
      );
      setEditingId(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove Dr. ${name}?`)) return;
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/user/doctor/delete/${id}`,
        { withCredentials: true }
      );
      toast.success(data.message);
      setDoctors((prev) => prev.filter((d) => d._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <Loading />;
  if (!isAuthenticated) return <Navigate to={"/login"} />;

  return (
    <section className="page">
      <div className="page-header">
        <h1>Registered Doctors</h1>
        <p className="page-subtitle">{doctors.length} doctor{doctors.length !== 1 ? "s" : ""} registered on the platform</p>
      </div>

      <div className="staff-grid">
        {doctors && doctors.length > 0 ? (
          doctors.map((element) => (
            <div className="staff-card" key={element._id}>
              <div className="staff-card-top">
                <div className="staff-avatar-wrap">
                  <img
                    src={element.doctrAvatar && element.doctrAvatar.url}
                    alt={`Dr. ${element.firstName}`}
                    className="staff-avatar"
                  />
                </div>
                <div className="staff-identity">
                  <h3 className="staff-name">Dr. {element.firstName} {element.lastName}</h3>
                  <span className="staff-dept-pill">
                    <FaStethoscope /> {element.doctrDptmnt}
                  </span>
                </div>
              </div>

              {editingId === element._id ? (
                <div className="staff-edit-form">
                  <div className="edit-row">
                    <input value={editData.firstName} onChange={(e) => setEditData({ ...editData, firstName: e.target.value })} placeholder="First Name" />
                    <input value={editData.lastName} onChange={(e) => setEditData({ ...editData, lastName: e.target.value })} placeholder="Last Name" />
                  </div>
                  <input value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} placeholder="Email" />
                  <input value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} placeholder="Phone" />
                  <input value={editData.doctrDptmnt} onChange={(e) => setEditData({ ...editData, doctrDptmnt: e.target.value })} placeholder="Department" />
                  <div className="edit-actions">
                    <button className="save-btn" onClick={() => saveEdit(element._id)} disabled={saving}>
                      {saving ? (<><span className="btn-spinner"></span> Saving...</>) : (<><FaSave /> Save</>)}
                    </button>
                    <button className="cancel-btn" onClick={cancelEdit} disabled={saving}>
                      <FaTimes /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="staff-details">
                    <div className="staff-detail-row">
                      <FaEnvelope className="staff-detail-icon" />
                      <span>{element.email}</span>
                    </div>
                    <div className="staff-detail-row">
                      <FaPhone className="staff-detail-icon" />
                      <span>{element.phone}</span>
                    </div>
                    <div className="staff-detail-row">
                      <FaCalendarAlt className="staff-detail-icon" />
                      <span>{element.dob?.substring(0, 10)}</span>
                    </div>
                    <div className="staff-detail-row">
                      <FaVenusMars className="staff-detail-icon" />
                      <span>{element.gender}</span>
                    </div>
                    <div className="staff-detail-row">
                      <FaIdCard className="staff-detail-icon" />
                      <span>{element.nin}</span>
                    </div>
                  </div>
                  {isPrincipal && (
                    <div className="staff-actions">
                      <button className="edit-btn" onClick={() => startEdit(element)}><FaEdit /> Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(element._id, `${element.firstName} ${element.lastName}`)}><FaTrash /> Remove</button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        ) : (
          <div className="staff-empty">
            <FaStethoscope className="empty-icon" />
            <h3>No doctors registered yet</h3>
            <p>Add a new doctor using the sidebar to get started.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Doctors;
