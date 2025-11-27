import React, { useState } from "react";
import { DollarSign } from "lucide-react";
// These are the two components for your tabs
import ExpenseRequestPage from "../components/Expense/ExpenseRequestPage";
import ExpenseHistoryPage from "../components/Expense/ExpenseHistoryPage";

import "./ExpenseManagement.css";

const ExpenseManagement = ({ initialTab = "submit", onBack }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const renderCurrentPage = () => {
    switch (activeTab) {
      case "submit":
        return <ExpenseRequestPage />;
      case "my-expenses":
        return <ExpenseHistoryPage />;
      default:
        return <ExpenseRequestPage />;
    }
  };

  return (
    <div className="expense-container">
      <div className="expense-content-wrapper">
        <div className="expense-header">
          <div className="header-title">
            {onBack && (
              <button onClick={onBack} className="back-button">
                ←
              </button>
            )}
            <DollarSign size={24} />
            <h1 className="main-title">Expense Management</h1>
          </div>
          <p className="main-subtitle">Submit and track your expense claims</p>
        </div>

        <div className="tabs-container">
          <div className="tabs">
            {/* Tab for the submission form */}
            <button
              className={`tab ${activeTab === "submit" ? "active" : ""}`}
              onClick={() => setActiveTab("submit")}
            >
              Submit
            </button>
            {/* Tab for the history page */}
            <button
              className={`tab ${activeTab === "my-expenses" ? "active" : ""}`}
              onClick={() => setActiveTab("my-expenses")}
            >
              My Expenses
            </button>
          </div>
        </div>

        <div className="main-content">{renderCurrentPage()}</div>
      </div>
    </div>
  );
};

export default ExpenseManagement;
