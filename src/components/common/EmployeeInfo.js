import React from "react";
import { LogOut } from "lucide-react";

const EmployeeInfo = ({ name, role, onProfileClick, onLogout }) => {
  return (
    <div className="employee-section">
      <div className="employee-info">
        <div className="employee-name">{name}</div>
        <div className="employee-role">{role}</div>
      </div>
      <button className="icon-button" onClick={onLogout}>
        <LogOut size={20} />
      </button>
    </div>
  );
};

export default EmployeeInfo;
