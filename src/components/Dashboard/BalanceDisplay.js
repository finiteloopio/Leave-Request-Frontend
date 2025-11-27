import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Spinner from "../common/Spinner";
import "./BalanceDisplay.css";

// Updated to accept an array of balance types to show
const BalanceDisplay = ({ balanceTypesToShow }) => {
  const [balances, setBalances] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        setLoading(true);
        const response = await api.get("/balances/my-balance");
        setBalances(response.data);
      } catch (err) {
        setError("Could not load balances.");
      } finally {
        setLoading(false);
      }
    };
    fetchBalances();
  }, []);

  if (loading) {
    return (
      <div className="balance-cards-container loading">
        <Spinner size="medium" />
      </div>
    );
  }

  if (error) {
    return <p className="feedback-message error">{error}</p>;
  }

  if (!balances) return null;

  // Map all 5 database columns to user-friendly names
  const allBalances = [
    { id: "earned", type: "Earned Leave", count: balances.EarnedLeave },
    { id: "vacation", type: "Vacation Leave", count: balances.VacationLeave },
    { id: "sick", type: "Sick Leave", count: balances.SickLeave },
    { id: "personal", type: "Personal Leave", count: balances.PersonalLeave },
    { id: "wfh", type: "WFH Days", count: balances.WFHBalance },
  ];

  // Filter the balances based on the prop passed from the parent
  const balanceData = allBalances.filter((balance) =>
    balanceTypesToShow.includes(balance.id)
  );

  return (
    <div className="balance-cards-container">
      {balanceData.map((balance, index) => (
        <div key={index} className="balance-card">
          <div className="balance-number">{balance.count}</div>
          <div className="balance-label">{balance.type}</div>
        </div>
      ))}
    </div>
  );
};

export default BalanceDisplay;
