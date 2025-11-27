import React, { useEffect, useState } from 'react';
import { Calendar } from "lucide-react";
import api from "../../services/api";
import './BalancePage.css';

const BalancePage = () => {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true);
        const res = await api.get("/leave/balance");
        const rows = res.data?.data || [];
        const mapped = rows.map((r) => ({
          count: r.remaining,
          type: r.typename,
        }));
        setBalances(mapped);
        setError(null);
      } catch (err) {
        console.error("Error fetching leave balance:", err);
        setError("Failed to load leave balances");
        setBalances([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBalance();
  }, []);

  return (
    <div className="balance-page">
      <h2 className="balance-title">Leave Balance</h2>
      <p className="balance-subtitle">Your current leave balances</p>
      
      {loading ? (
        <div className="balance-cards">
          <p style={{ color: "gray", textAlign: "center", width: "100%" }}>
            Loading balances...
          </p>
        </div>
      ) : error ? (
        <div className="balance-cards">
          <p style={{ color: "red", textAlign: "center", width: "100%" }}>
            {error}
          </p>
        </div>
      ) : balances.length === 0 ? (
        <div className="balance-cards">
          <p style={{ color: "gray", textAlign: "center", width: "100%" }}>
            No leave balance data available
          </p>
        </div>
      ) : (
        <div className="balance-cards">
          {balances.map((balance, index) => (
            <div key={index} className="balance-card">
              <div className="balance-number">{balance.count}</div>
              <div className="balance-label">{balance.type}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BalancePage;