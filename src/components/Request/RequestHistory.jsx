import React from 'react';
import LeaveHistoryCard from './LeaveHistoryCard';
import './RequestHistory.css';

const RequestHistory = () => {
  return (
    <div className="history-container">
      <LeaveHistoryCard />
      {/* WFHHistoryCard will be added here by your teammate */}
    </div>
  );
};

export default RequestHistory;