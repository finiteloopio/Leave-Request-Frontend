import React from 'react';
import LeaveRequestCard from './LeaveRequestCard';
import './Requests.css';

const Requests = () => {
  return (
    <div className="requests-container">
      <LeaveRequestCard />
      {/* WFHRequestCard will be added here by your teammate */}
    </div>
  );
};

export default Requests;