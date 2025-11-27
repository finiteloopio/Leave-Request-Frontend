import React, { useState } from "react";
import { Building } from "lucide-react";
import WFHRequestPage from "../components/WFH/WFHRequestPage";
import WFHHistoryPage from "../components/WFH/WFHHistoryPage";

import "./WFH.css";

const WFH = ({ initialTab = "request", onBack }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const renderCurrentPage = () => {
    switch (activeTab) {
      case "request":
        return <WFHRequestPage />;
      case "history":
        return <WFHHistoryPage />;
      default:
        return <WFHRequestPage />;
    }
  };

  return (
    <div className="wfh-container">
      <div className="wfh-content-wrapper">
        <div className="wfh-header">
          <div className="header-title">
            {onBack && (
              <button onClick={onBack} className="back-button">
                ←
              </button>
            )}
            <Building size={24} />
            <h1 className="main-title">Work From Home</h1>
          </div>
          <p className="main-subtitle">
            Request to work from home and track your requests
          </p>
        </div>

        <div className="tabs-container">
          <div className="tabs">
            <button
              className={`tab ${activeTab === "request" ? "active" : ""}`}
              onClick={() => setActiveTab("request")}
            >
              Request
            </button>
            <button
              className={`tab ${activeTab === "history" ? "active" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              History
            </button>
          </div>
        </div>

        <div className="main-content">{renderCurrentPage()}</div>
      </div>
    </div>
  );
};

export default WFH;

