import React from "react";
import "./Dashboard.css";
import ProgressCard from "./ProgressCard";
import CyberAlertCard from "./CyberAlertCard";
import JobMatchCard from "./JobMatchCard";
import QuickAccessCard from "./QuickAccessCard";

const Dashboard = ({ userName = "Ntokozo" }) => {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Welcome back, {userName} 👋</h1>
          <p>Your personalized EduSecure+ dashboard</p>
        </div>
        <div className="header-actions">
          <button className="primary-btn">Go to Tutor</button>
        </div>
      </header>

      <section className="dashboard-grid">
        <ProgressCard />
        <CyberAlertCard />
        <JobMatchCard />
        <QuickAccessCard />
      </section>
    </div>
  );
};

export default Dashboard;
