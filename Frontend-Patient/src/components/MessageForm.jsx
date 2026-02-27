import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane } from "react-icons/fa";

const MessageForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMesage] = useState("");

  const handleMessage = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(
          "${import.meta.env.VITE_API_URL}/api/v1/message/send",
          { firstName, lastName, phone, email, message },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          toast.success(res.data.message);
          setFirstName("");
          setLastName("");
          setEmail("");
          setPhone("");
          setMesage("");
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <section className="contact-section">
      <div className="container">
        <div className="contact-header">
          <h2>Get in Touch</h2>
          <p>Have a question or need assistance? We'd love to hear from you.</p>
        </div>

        <div className="contact-wrapper">
          {/* Contact Info Side */}
          <div className="contact-info">
            <div className="contact-info-inner">
              <h3>Contact Information</h3>
              <p>Reach out to us through any of the following channels or fill out the form.</p>

              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon">
                    <FaPhone />
                  </div>
                  <div>
                    <span className="contact-label">Phone</span>
                    <span className="contact-value">+2349076106639</span>
                    <span className="contact-value">+2348121985597</span>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <FaEnvelope />
                  </div>
                  <div>
                    <span className="contact-label">Email</span>
                    <span className="contact-value">info@ilera.com.ng</span>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <span className="contact-label">Address</span>
                    <span className="contact-value">University of Lagos, Akoka, Lagos, Nigeria</span>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <FaClock />
                  </div>
                  <div>
                    <span className="contact-label">Working Hours</span>
                    <span className="contact-value">Mon–Fri: 8am – 6pm</span>
                    <span className="contact-value">Sat: 9am – 2pm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="contact-form-side">
            <form onSubmit={handleMessage}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="text"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    placeholder="08012345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  rows={5}
                  placeholder="Write your message here..."
                  value={message}
                  onChange={(e) => setMesage(e.target.value)}
                ></textarea>
              </div>

              <button type="submit" className="send-btn">
                <FaPaperPlane />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MessageForm;
