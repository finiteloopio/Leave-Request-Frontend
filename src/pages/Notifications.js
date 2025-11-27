import React from "react";
import "./Notifications.css"; // We will create this CSS file next

// Note: For icons, you should use a library like 'lucide-react' or 'react-icons'.
// I'm using text placeholders (e.g., "[L]") for now.

const Notifications = () => {
  const mockNotifications = [
    {
      id: 1,
      type: "Leave",
      title: "Leave Request Approved",
      description: "Your vacation leave for Jan 15-19 has been approved",
      date: "1/2/2024",
      icon: "L", // Placeholder for Leave Icon
    },
    {
      id: 2,
      type: "WFH",
      title: "WFH Request Approved",
      description: "Your work from home request for Feb 20 has been approved",
      date: "2/16/2024",
      icon: "W", // Placeholder for WFH Icon
    },
  ];

  return (
    <div className="notifications-page">
      <header className="notifications-header">
        <div className="title-group">
          <h1>
            Notifications <span className="notification-count">2</span>
          </h1>
          <p>Stay updated with your requests and approvals</p>
        </div>
        <button className="mark-all-read-btn">✓ Mark all read</button>
      </header>

      <main className="notifications-content">
        <div className="notification-list">
          {mockNotifications.map((notif) => (
            <div key={notif.id} className="notification-card">
              <div className="card-icon-wrapper">
                <span
                  className={`icon-placeholder icon-${notif.type.toLowerCase()}`}
                >
                  {notif.icon}
                </span>
              </div>
              <div className="card-details">
                <h3>{notif.title}</h3>
                <p>{notif.description}</p>
                <span>{notif.date}</span>
              </div>
              <div className="card-chevron">›</div>
            </div>
          ))}
        </div>

        <div className="notification-settings">
          <h2>Notification Settings</h2>
          <p>Manage how you receive notifications</p>
          <div className="settings-row">
            <div className="settings-info">
              <h3>Push Notifications</h3>
              <p>Get notified about request updates</p>
            </div>
            <button className="settings-btn">Enable</button>
          </div>
          <div className="settings-row">
            <div className="settings-info">
              <h3>Email Notifications</h3>
              <p>Receive email updates for important changes</p>
            </div>
            <button className="settings-btn">Configure</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Notifications;
