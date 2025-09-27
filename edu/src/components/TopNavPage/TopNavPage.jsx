import React from "react";
import "./TopNavPage.css";

const TopNavPage = ({ userInitials = "NS" }) => {
  return (
    <div className="dashboard">
      {/* Top navigation bar */}
      <nav className="top-nav">
        <div className="nav-left">
          <button className="nav-btn">My Skills</button>
          <button className="nav-btn">In Progress</button>
          <button className="nav-btn">Job Opportunities</button>
        </div>

        <div className="nav-right">
          <button className="add-skill-btn">+ Learn New Skill</button>
          <div className="user-circle">{userInitials}</div>
        </div>
      </nav>

      {/* Welcome back message */}
      <div className="welcome-message">
        <h1>Welcome back, Ntokozo 👋</h1>
      </div>
    </div>
  );
};

export default TopNavPage;
