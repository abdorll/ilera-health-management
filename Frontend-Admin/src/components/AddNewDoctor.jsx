import React, { useContext, useState } from "react";
import { Context } from "../main";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AddNewDoctor = () => {
  const { isAuthenticated } = useContext(Context);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [nin, setNin] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [doctrDptmnt, setDoctrDptmnt] = useState("");
  const [doctrAvatar, setDoctrAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const departmentsArray = [
    "Pediatrics",
    "Orthopedics",
    "Cardiology",
    "Neurology",
    "Oncology",
    "Radiology",
    "Physical Therapy",
    "Dermatology",
    "ENT",
  ];

  const navigateTo = useNavigate();

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setAvatarPreview(reader.result);
      setDoctrAvatar(file);
    };
  };

  const addNewDoctor = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("nin", nin);
      formData.append("gender", gender);
      formData.append("dob", dob);
      formData.append("doctrDptmnt", doctrDptmnt);
      formData.append("password", password);
      formData.append("doctrAvatar", doctrAvatar);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/doctor/addnew`,
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success(response.data.message);
      navigateTo("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page add-staff-page">
      <div className="add-staff-card">
        <div className="add-staff-header">
          <img src="/logo.png" alt="Ìlera" />
          <h1>Register New Doctor</h1>
          <p>Add a specialist to the Ìlera medical team</p>
        </div>

        <form onSubmit={addNewDoctor} className="add-staff-body">
          <div className="avatar-upload">
            <img
              src={avatarPreview ? avatarPreview : "/docHolder.jpg"}
              alt="Doctor Avatar"
            />
            <div className="form-group" style={{ width: "100%", marginBottom: 0 }}>
              <label>Doctor Photo</label>
              <input type="file" onChange={handleAvatar} accept="image/png, image/jpeg, image/webp" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="e.g. Chinedu" />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="e.g. Okafor" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. doctor@example.com" />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 08012345678" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>NIN</label>
              <input type="text" value={nin} onChange={(e) => setNin(e.target.value)} placeholder="National ID Number" />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div className="form-group">
              <label>Department</label>
              <select value={doctrDptmnt} onChange={(e) => setDoctrDptmnt(e.target.value)}>
                <option value="">Select Department</option>
                {departmentsArray.map((dept, i) => (
                  <option value={dept} key={i}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a login password for this doctor" />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? (
              <><span className="btn-spinner"></span> Sending invite & registering...</>
            ) : (
              "Register New Doctor"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddNewDoctor;
