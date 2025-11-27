import React, { useState, useEffect } from "react";
import api from "../../services/api";

const WFHRequestPage = () => {
  // Form state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [approverId, setApproverId] = useState("");
  const [reason, setReason] = useState("");

  const [managers, setManagers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await api.get("/users/managers");
        setManagers(response.data);
      } catch (err) {
        setError("Could not fetch the list of managers.");
      }
    };
    fetchManagers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (new Date(endDate) < new Date(startDate)) {
      setError("End date cannot be before the start date.");
      return;
    }

    try {
      const response = await api.post("/wfh/apply", {
        startDate,
        endDate,
        approverId,
        reason,
      });
      setMessage(response.data.message);
      // Clear form
      setStartDate("");
      setEndDate("");
      setApproverId("");
      setReason("");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="form-container">
      <div className="form-title-container">
        <h2 className="form-title">+ Request Work From Home</h2>
        <p className="form-subtitle">Submit a new WFH request</p>
      </div>

      <form onSubmit={handleSubmit} className="form-layout">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="approver">Approver</label>
          <select
            id="approver"
            value={approverId}
            onChange={(e) => setApproverId(e.target.value)}
            required
          >
            <option value="" disabled>
              Select your approver
            </option>
            {/* THE KEY CHANGE: Use the new column names from the "Employee" table */}
            {/* {managers.map((manager) => (
              <option key={manager.EmployeeID} value={manager.EmployeeID}>
                {manager.FirstName}
              </option>
            ))} */}



            {Array.isArray(managers) && managers.length > 0 ? (
  managers.map((manager) => (
    <option key={manager.employeeid} value={manager.employeeid}>
      {manager.firstname} {manager.lastname}
    </option>
  ))
) : (
  <option disabled>No managers available</option>
)}



          </select>
        </div>

        <div className="form-group">
          <label htmlFor="reason">Reason</label>
          <textarea
            id="reason"
            rows="5"
            placeholder="Briefly explain why you need to work from home"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          ></textarea>
        </div>

        {message && <p className="feedback-message success">{message}</p>}
        {error && <p className="feedback-message error">{error}</p>}

        <button type="submit" className="submit-button">
          Submit WFH Request
        </button>
      </form>
    </div>
  );
};

export default WFHRequestPage;
