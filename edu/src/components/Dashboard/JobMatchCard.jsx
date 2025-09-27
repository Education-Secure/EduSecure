import React from "react";

const JobMatchCard = () => {
  return (
    <div className="card">
      <h2>Job Matches 💼</h2>
      <ul className="jobs-list">
        <li>
          <strong>Junior Web Dev</strong>
          <p>Remote • Entry • Matches your skills</p>
        </li>
        <li>
          <strong>Data Entry Gig</strong>
          <p>3 days • Freelance</p>
        </li>
      </ul>
      <button className="primary-btn">View All</button>
    </div>
  );
};

export default JobMatchCard;
