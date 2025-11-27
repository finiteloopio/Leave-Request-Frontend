import React from 'react';

const Header = ({ userName, subtitle }) => {
  return (
    <div className="dashboard-header">
      <h1 className="welcome-title">Welcome back, {userName}!</h1>
      <p className="welcome-subtitle">{subtitle}</p>
    </div>
  );
};

export default Header;