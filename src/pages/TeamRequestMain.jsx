import React, { useState } from 'react';
import { Users } from 'lucide-react';
import Requests from '../components/Request/Requests';
import RequestHistory from '../components/Request/RequestHistory';
import './TeamRequestMain.css';

const TeamRequestMain = () => {
  const [activeTab, setActiveTab] = useState('requests');

  return (
    <div className="team-request-container">
      {/* Header Section */}
      <div className="header-section">
        <div className="header-content">
          <Users className="header-icon" size={28} />
          <div>
            <h1 className="header-title">Team Request</h1>
            <p className="header-subtitle">Apply for leave and track your requests</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Team Requests
        </button>
        <button
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Request History
        </button>
      </div>

      {/* Content Area */}
      <div className="content-area">
        {activeTab === 'requests' ? <Requests /> : <RequestHistory />}
      </div>
    </div>
  );
};

export default TeamRequestMain;