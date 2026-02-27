import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Context } from "../main";
import axios from "axios";
import { toast } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaCalendarPlus, FaHome, FaInfoCircle, FaTachometerAlt, FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const [show, setShow] = useState(true);
  const { isAuthenticated, setIsAuthenticated, user } = useContext(Context);
  const navigateTo = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await axios
      .get(`${import.meta.env.VITE_API_URL}/api/v1/user/patient/logout`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const isActive = (path) => location.pathname === path;

  // Logged-in navbar
  if (isAuthenticated) {
    return (
      <nav className="container">
        <div className="logo">
          <img
            src="/logo.png"
            alt="Ìlera"
            className="logo-img"
            onClick={() => navigateTo("/")}
          />
        </div>

        <div className={show ? "navLinks showmenu" : "navLinks"}>
          <div className="links">
            <Link
              to="/"
              className={isActive("/") || isActive("/dashboard") ? "nav-link active" : "nav-link"}
              onClick={() => setShow(true)}
            >
              <FaTachometerAlt className="nav-link-icon" />
              Dashboard
            </Link>
          </div>

          <div className="nav-actions">
            <span className="nav-user-name">
              {user?.firstName} {user?.lastName?.[0]}.
            </span>

            <button className="nav-auth-btn logout" onClick={handleLogout}>
              <FaSignOutAlt className="nav-btn-icon" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <div className="hamburger" onClick={() => setShow(!show)}>
          {show ? <GiHamburgerMenu /> : <AiOutlineClose />}
        </div>
      </nav >
    );
  }

  // Public / logged-out navbar
  return (
    <nav className="container">
      <div className="logo">
        <img
          src="/logo.png"
          alt="Ìlera"
          className="logo-img"
          onClick={() => navigateTo("/")}
        />
      </div>

      <div className={show ? "navLinks showmenu" : "navLinks"}>
        <div className="links">
          <Link
            to="/"
            className={isActive("/") ? "nav-link active" : "nav-link"}
            onClick={() => setShow(!show)}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={isActive("/about") ? "nav-link active" : "nav-link"}
            onClick={() => setShow(!show)}
          >
            About Us
          </Link>
        </div>

        <div className="nav-actions">
          <Link
            to="/appointment"
            className="nav-appointment-btn"
            onClick={() => setShow(!show)}
          >
            <FaCalendarPlus />
            <span>Book Appointment</span>
          </Link>

          <button
            className="nav-auth-btn login"
            onClick={() => {
              navigateTo("/login");
              setShow(!show);
            }}
          >
            Sign In
          </button>
        </div>
      </div>

      <div className="hamburger" onClick={() => setShow(!show)}>
        {show ? <GiHamburgerMenu /> : <AiOutlineClose />}
      </div>
    </nav>
  );
};

export default Navbar;
