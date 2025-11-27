import React, { useContext } from "react";
import { Calendar, Building, DollarSign, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/common/Header";
import BalanceDisplay from "../components/Dashboard/BalanceDisplay";
import ActionSection from "../components/Dashboard/ActionSection";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLeaveAction = (action) => {
    if (action === "apply") {
      navigate("/leave-management");
    } else if (action === "history") {
      navigate("/leave-management", { state: { initialTab: "history" } });
    }
  };

  const handleWFHAction = (action) => {
    if (action === "request") {
      navigate("/wfh");
    } else if (action === "view") {
      navigate("/wfh", { state: { initialTab: "history" } });
    }
  };

  const handleExpenseAction = (action) => {
    if (action === "submit-expense") {
      navigate("/expense-management");
    } else if (action === "view-expense") {
      navigate("/expense-management", { state: { initialTab: "my-expenses" } });
    }
  };

  const handleTeamRequestAction = (action) => {
    navigate("/team-requests", { state: { initialTab: "requests" } });
  };

  const handleTeamRequestHistoryAction = (action) => {
    navigate("/team-requests", { state: { initialTab: "history" } });
  };

  // THE FIX: Define all 5 balances to show on the dashboard
  const dashboardBalances = ["earned", "vacation", "sick", "personal", "wfh"];

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <Header userName={user.name} subtitle="Here's your current status" />

        <div className="sections-container">
          <BalanceDisplay balanceTypesToShow={dashboardBalances} />

          {/* Leave Requests */}
          <ActionSection
            icon={Calendar}
            title="Leave Requests"
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
            primaryAction={{
              label: "Submit Expense",
              onClick: () => handleExpenseAction("submit-expense"),
            }}
            secondaryAction={{
              label: "View Expenses",
              onClick: () => handleExpenseAction("view-expense"),
            }}
          />

          {/* Team Requests - Conditionally render if user is a manager */}
          {user.role === "manager" && (
            <ActionSection
              icon={Users}
              title="Team Requests"
              primaryAction={{
                label: "View Pending",
                onClick: () => handleTeamRequestAction("submit"),
              }}
              secondaryAction={{
                label: "View History",
                onClick: () => handleTeamRequestHistoryAction("view-request"),
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
