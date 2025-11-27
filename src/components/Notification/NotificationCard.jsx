import React, { useEffect, useState } from "react";
import NotificationCard from "./NotificationCard";
import { FiBell } from "react-icons/fi";

const NotificationsList = () => {
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
  fetch("http://localhost:5000/api/notifications")
    .then((res) => {
      console.log("Response status:", res.status); // debug
      return res.json();
    })
    .then((data) => {
      console.log("Fetched data:", data); // debug
      setNotifications(data);
    })
    .catch((err) => console.error("Fetch failed:", err));
}, []);


  return (
    <div>
      {notifications.map((notif, index) => (
        <NotificationCard
          key={index}
          icon={<FiBell />}
          title={notif.title}
          description={notif.description}
          date={notif.date}
        />
      ))}
    </div>
  );
};

export default NotificationsList;
