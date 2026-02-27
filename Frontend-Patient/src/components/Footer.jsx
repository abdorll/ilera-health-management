import React from "react";
import { Link } from "react-router-dom";
import { FaLocationDot, FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaClock, FaHeartbeat } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner container">
        {/* Brand Column */}
        <div className="footer-brand">
          <div className="footer-logo-row">
            <img src="/logo.png" alt="Ìlera" className="footer-logo" />
          </div>
          <p className="footer-tagline">
            Your trusted healthcare partner at the University of Lagos.
            Delivering compassionate care with modern expertise.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to={"/"}>Home</Link></li>
            <li><Link to={"/appointment"}>Book Appointment</Link></li>
            <li><Link to={"/about"}>About Us</Link></li>
            <li><Link to={"/login"}>Patient Login</Link></li>
          </ul>
        </div>

        {/* Departments */}
        <div className="footer-col">
          <h4>Departments</h4>
          <ul>
            <li><span>Cardiology</span></li>
            <li><span>Neurology</span></li>
            <li><span>Pediatrics</span></li>
            <li><span>Orthopedics</span></li>
            <li><span>Dermatology</span></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-col">
          <h4>Contact Us</h4>
          <div className="footer-contact">
            <div className="footer-contact-item">
              <FaPhone />
              <div>
                <span>+2349076106639</span>
                <span>+2348121985597</span>
              </div>
            </div>
            <div className="footer-contact-item">
              <MdEmail />
              <span>info@ilera.com.ng</span>
            </div>
            <div className="footer-contact-item">
              <FaLocationDot />
              <span>University of Lagos, Akoka, Lagos</span>
            </div>
            <div className="footer-contact-item">
              <FaClock />
              <span>Mon–Fri: 8am – 6pm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>&copy; {new Date().getFullYear()} Ìlera Health & Wellness. All rights reserved.</p>
          <p className="footer-heart">
            Made with <FaHeartbeat /> for better healthcare
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
