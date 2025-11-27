import React from 'react';

const ActionSection = ({ 
  icon: Icon, 
  title, 
  pendingCount = 0, 
  primaryAction, 
  secondaryAction 
}) => {
  return (
    <div className="section">
      <div className="section-header">
        <Icon size={20} />
        <h2 className="section-title">{title}</h2>
        {pendingCount > 0 && (
          <span className="pending-badge">{pendingCount} pending</span>
        )}
      </div>
      
      <div className="action-buttons">
        <button 
          className="primary-button"
          onClick={primaryAction.onClick}
        >
          {primaryAction.label}
        </button>
        <button 
          className="secondary-button"
          onClick={secondaryAction.onClick}
        >
          {secondaryAction.label}
        </button>
      </div>
    </div>
  );
};

export default ActionSection;