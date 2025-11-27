import React from "react";
import BalanceDisplay from "../Dashboard/BalanceDisplay";
import "./BalancePage.css";

const BalancePage = () => {
  // THE FIX: Define only the 4 leave types to show on this page
  const leaveBalancesOnly = ["earned", "vacation", "sick", "personal"];

  return (
    <div className="balance-page">
      <h2 className="balance-title">Your Current Leave Balances</h2>
      <p className="balance-subtitle">
        This is an overview of your available leave days.
      </p>

      <BalanceDisplay balanceTypesToShow={leaveBalancesOnly} />
    </div>
  );
};

export default BalancePage;
