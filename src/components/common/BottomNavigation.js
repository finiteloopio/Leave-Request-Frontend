import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Bell, Calendar, Building, DollarSign } from "lucide-react";
import "./BottomNavigation.css"; // Assuming you have a CSS file for styling

const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Dashboard" },
    { path: "/notifications", icon: Bell, label: "Notifications", badge: 2 },
    { path: "/leave-management", icon: Calendar, label: "Leave" },
    { path: "/wfh", icon: Building, label: "WFH" },
    // THE FIX: The path is now corrected to match the route in App.js
    { path: "/expense-management", icon: DollarSign, label: "Expenses" },
  ];

  return (
    <div className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive ? "active" : ""}`}
          >
            <div className="nav-icon-wrapper">
              <Icon size={24} />
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </div>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNavigation;
