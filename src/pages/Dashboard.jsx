import React, { useState, useEffect, useContext } from "react";
import { Calendar, Building, DollarSign, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import Header from "../components/common/Header";
import LeaveBalance from "../components/Dashboard/LeaveBalance.jsx";
import ActionSection from "../components/Dashboard/ActionSection";

import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Check if user is a manager
  const isManager = user?.role === 'Manager' || user?.role === 'manager' || user?.ismanager === true;

  // Fetch leave balance
  useEffect(() => {
    fetch("http://localhost:5001/api/leave/balance")
      .then((res) => res.json())
      .then((data) => {
        setBalances(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching leave balance:", err);
        setLoading(false);
      });
  }, []);

  const handleLeaveAction = (action) => {
    if (action === "apply") {
      navigate("/leave-management");
    } else if (action === "history") {
      navigate("/leave-history");
    }
  };

  const handleWFHAction = (action) => {
    if (action === "request") {
      navigate("/wfh");
    } else if (action === "view") {
      navigate("/wfh-history");
    }
  };

  const handleExpenseAction = (action) => {
    if (action === "submit-expense") {
      navigate("/expense-management");
    } else if (action === "view-expense") {
      navigate("/my-expenses");
    }
  };

  const handleTeamRequestAction = (action) => {
    if (action === "submit") {
      navigate("/team-requests");
    } else if (action === "view-request") { 
      navigate("/request-history");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <Header userName={user?.name || "Employee"} subtitle="Here's your current status" />

        <div className="sections-container">
          {loading ? (
            <p style={{ textAlign: "center", color: "gray" }}>Loading...</p>
          ) : (
            <LeaveBalance balances={balances} />
          )}

          {/* Leave Requests */}
          <ActionSection
            icon={Calendar}
            title="Leave Requests"
            pendingCount={1}
            primaryAction={{
              label: "Apply for Leave",
              onClick: () => handleLeaveAction("apply"),
            }}
            secondaryAction={{
              label: "View History",
              onClick: () => handleLeaveAction("history"),
            }}
          />

          {/* Work From Home */}
          <ActionSection
            icon={Building}
            title="Work From Home"
            pendingCount={1}
            primaryAction={{
              label: "Request WFH",
              onClick: () => handleWFHAction("request"),
            }}
            secondaryAction={{
              label: "View Requests",
              onClick: () => handleWFHAction("view"),
            }}
          />

          {/* Expenses */}
          <ActionSection
            icon={DollarSign}
            title="Expenses"
            pendingCount={1}
            primaryAction={{
              label: "Submit Expense",
              onClick: () => handleExpenseAction("submit-expense"),
            }}
            secondaryAction={{
              label: "View Expenses",
              onClick: () => handleExpenseAction("view-expense"),
            }}
          />

          {/* Team Requests - Only show for managers */}
          {isManager && (
            <ActionSection
              icon={Users}
              title="Team Requests"
              pendingCount={1}
              primaryAction={{
                label: "View Requests",
                onClick: () => handleTeamRequestAction("submit"),
              }}
              secondaryAction={{
                label: "Request History",
                onClick: () => handleTeamRequestAction("view-request"),
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;