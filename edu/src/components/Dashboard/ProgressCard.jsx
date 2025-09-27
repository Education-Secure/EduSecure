import React from "react";

const ProgressCard = () => {
  // Replace hardcoded values with real props / firestore data later
  return (
    <div className="card">
      <h2>Learning Progress</h2>
      <div className="progress-item">
        <span>Math</span>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: "75%" }}></div>
        </div>
        <span className="progress-percent">75%</span>
      </div>

      <div className="progress-item">
        <span>Science</span>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: "60%" }}></div>
        </div>
        <span className="progress-percent">60%</span>
      </div>

      <div className="progress-item">
        <span>Cyber Hygiene</span>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: "45%" }}></div>
        </div>
        <span className="progress-percent">45%</span>
      </div>
    </div>
  );
};

export default ProgressCard;
