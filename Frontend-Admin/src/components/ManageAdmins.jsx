import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { toast } from "react-toastify";
import axios from "axios";
import Loading from "./loading";
import { Navigate } from "react-router-dom";
import { FaEdit, FaTrash, FaTimes, FaSave, FaShieldAlt, FaUserShield, FaEnvelope, FaPhone, FaCalendarAlt, FaIdCard, FaVenusMars } from "react-icons/fa";

const ManageAdmins = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated, user } = useContext(Context);
    const isPrincipal = user?.email === "admin@ilera.com";
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v1/user/admins`,
                    { withCredentials: true }
                );
                setAdmins(data.admins);
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to fetch admins");
            } finally {
                setLoading(false);
            }
        };
        fetchAdmins();
    }, []);

    const startEdit = (admin) => {
        setEditingId(admin._id);
        setEditData({
            firstName: admin.firstName,
            lastName: admin.lastName,
            email: admin.email,
            phone: admin.phone,
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
                `${import.meta.env.VITE_API_URL}/api/v1/user/admin/edit/${id}`,
                editData,
                { withCredentials: true }
            );
            toast.success(data.message);
            setAdmins((prev) =>
                prev.map((a) => (a._id === id ? { ...a, ...editData } : a))
            );
            setEditingId(null);
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to remove admin ${name}?`))
            return;
        try {
            const { data } = await axios.delete(
                `${import.meta.env.VITE_API_URL}/api/v1/user/admin/delete/${id}`,
                { withCredentials: true }
            );
            toast.success(data.message);
            setAdmins((prev) => prev.filter((a) => a._id !== id));
        } catch (error) {
            toast.error(error.response?.data?.message || "Delete failed");
        }
    };

    if (loading) return <Loading />;
    if (!isAuthenticated) return <Navigate to={"/login"} />;
    if (!isPrincipal) return <Navigate to={"/"} />;

    return (
        <section className="page">
            <div className="page-header">
                <h1>Manage Admins</h1>
                <p className="page-subtitle">{admins.length} admin{admins.length !== 1 ? "s" : ""} on the platform</p>
            </div>

            <div className="staff-grid">
                {admins && admins.length > 0 ? (
                    admins.map((element) => {
                        const isThisPrincipal = element.email === "admin@ilera.com";
                        return (
                            <div className={`staff-card ${isThisPrincipal ? "staff-card-principal" : ""}`} key={element._id}>
                                <div className="staff-card-top">
                                    <div className="staff-avatar-wrap admin-avatar-wrap">
                                        {isThisPrincipal ? (
                                            <FaShieldAlt className="admin-avatar-icon principal-icon" />
                                        ) : (
                                            <FaUserShield className="admin-avatar-icon secondary-icon" />
                                        )}
                                    </div>
                                    <div className="staff-identity">
                                        <h3 className="staff-name">{element.firstName} {element.lastName}</h3>
                                        <span className={`staff-role-pill ${isThisPrincipal ? "pill-principal" : "pill-secondary"}`}>
                                            {isThisPrincipal ? "👑 Principal Admin" : "🛡️ Secondary Admin"}
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
                                        {!isThisPrincipal && (
                                            <div className="staff-actions">
                                                <button className="edit-btn" onClick={() => startEdit(element)}><FaEdit /> Edit</button>
                                                <button className="delete-btn" onClick={() => handleDelete(element._id, `${element.firstName} ${element.lastName}`)}><FaTrash /> Remove</button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="staff-empty">
                        <FaUserShield className="empty-icon" />
                        <h3>No admins found</h3>
                        <p>Start by adding administrators to the system.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ManageAdmins;
