import React, { useState } from "react";
import { Calendar, ExternalLink } from "lucide-react";
import ApplyPage from "../components/LeaveManagement/ApplyPage";
import HistoryPage from "../components/LeaveManagement/HistoryPage";
import BalancePage from "../components/LeaveManagement/BalancePage";

import "./LeaveManagement.css";

const LeaveManagement = ({ initialTab = "apply", onBack }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeBottomTab, setActiveBottomTab] = useState("leave");

  const handleTabChange = (tabId) => {
    setActiveBottomTab(tabId);
    console.log("Tab changed to:", tabId);
  };

  const handleProfileClick = () => {
    console.log("Profile clicked");
  };

  const renderCurrentPage = () => {
    switch (activeTab) {
      case "apply":
        return <ApplyPage />;
      case "history":
        return <HistoryPage />;
      case "balance":
        return <BalancePage />;
      default:
        return <ApplyPage />;
    }
  };

  return (
    <div className="leave-management-container">
      <div className="leave-management-content">
        {/* Header */}
        <div className="leave-management-header">
          <div className="header-title">
            {onBack && (
              <button onClick={onBack} className="back-button">
                ←
              </button>
            )}
            <Calendar size={24} />
            <h1 className="main-title">Leave Management</h1>
          </div>
          <p className="main-subtitle">
            Apply for leave and track your requests
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="tabs-container">
          <div className="tabs">
            <button
              className={`tab ${activeTab === "apply" ? "active" : ""}`}
              onClick={() => setActiveTab("apply")}
            >
              Apply
            </button>
            <button
              className={`tab ${activeTab === "history" ? "active" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              History
            </button>
            <button
              className={`tab ${activeTab === "balance" ? "active" : ""}`}
              onClick={() => setActiveTab("balance")}
            >
              Balance
            </button>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="main-content">{renderCurrentPage()}</div>
      </div>
    </div>
  );
};

export default LeaveManagement;
