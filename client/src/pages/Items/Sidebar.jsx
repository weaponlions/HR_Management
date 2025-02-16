import React, { useState } from "react";
import "./Sidebar.css";
import { FaUsers, FaChartBar, FaSignOutAlt, FaUserPlus, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Sidebar = ({title}) => {
  const active = title;
  const navigate = useNavigate();
  
  const changeRoute = (path) => {
    navigate(path)
  }

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">LOGO</div>

      {/* Search Box */}
      <div className="sidebar-search-box">
        <FaSearch className="sidebar-search-icon" />
        <input type="text" placeholder="Search" />
      </div>

      {/* Menu Sections */}
      <div className="sidebar-menu-section">
        <h4>Recruitment</h4>
        <div
          className={`sidebar-menu-item ${active === "candidate" ? "active" : ""}`}
          onClick={() => changeRoute("candidate")}
        >
          <FaUserPlus />
          <span>Candidates</span>
        </div>
      </div>

      <div className="sidebar-menu-section">
        <h4>Organization</h4>
        <div
          className={`sidebar-menu-item ${active === "employee" ? "active" : ""}`}
          onClick={() => changeRoute("employee")}
        >
          <FaUsers />
          <span>Employees</span>
        </div>
        <div 
          className={`sidebar-menu-item ${active === "attendance" ? "active" : ""}`}
          onClick={() => changeRoute("attendance")}
        >
          <FaChartBar />
          <span>Attendance</span>
        </div>
        <div 
          className={`sidebar-menu-item ${active === "leave" ? "active" : ""}`}
          onClick={() => changeRoute("leave")}
        >
          <FaChartBar />
          <span>Leaves</span>
        </div>
      </div>

      <div className="sidebar-menu-section">
        <h4>Others</h4>
        <div className="sidebar-menu-item" onClick={() => {localStorage.clear(); changeRoute("/login")}}>
          <FaSignOutAlt />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
