import React, { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import api from "../../services/api";
import "../../pages/Dashboard.css"; // ✅ make sure this path is correct

const LeaveBalance = () => {
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await api.get("/leave/balance");
        const rows = res.data?.data || [];
        const mapped = rows.map((r) => ({
          count: r.remaining,
          label: r.typename,
        }));
        setBalances(mapped);
      } catch (err) {
        console.error("Error fetching leave balance:", err);
        setBalances([]);
      }
    };
    fetchBalance();
  }, []);

  
  return (
    <div className="section">
      {/* Header */}
      <div className="section-header">
        <Calendar />
        <h3 className="section-title">Leave Balance</h3>
      </div>

      {/* Balance Grid */}
      <div className="balance-grid">
        {balances.length === 0 ? (
          <p style={{ color: "gray" }}>No leave balance data</p>
        ) : (
          balances.map((balance, index) => (
            <div key={index} className="balance-item">
              <span className="balance-number">{balance.count}</span>
              <span className="balance-label">{balance.label}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeaveBalance;
