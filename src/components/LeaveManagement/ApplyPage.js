import React, { useState, useEffect } from "react";
import api from "../../services/api"; // Your API service
import { useLocation } from "react-router-dom";


const ApplyPage = () => {
  // --- State variables ---
  const [leaveType, setLeaveType] = useState("");
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [approverId, setApproverId] = useState("");

  const [managers, setManagers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
const editRequest = location.state?.editRequest;

// Calculate minimum date (1 month ago from today)
const getMinDate = () => {
  const today = new Date();
  today.setMonth(today.getMonth() - 1);
  return today.toISOString().split('T')[0];
};


  // --- Fetch managers and leave types ---
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await api.get("/users/managers"); // Backend endpoint
        if (response.data && response.data.success) {
          setManagers(response.data.data);
        } else if (Array.isArray(response.data)) {
          // fallback if backend returns raw rows
          setManagers(response.data);
        }
      } catch (err) {
        setError("Could not fetch the list of managers.");
      }
    };
    const fetchLeaveTypes = async () => {
      try {
        const response = await api.get("/leave/types");
        if (response.data && response.data.success) {
          setLeaveTypes(response.data.data);
        }
      } catch (err) {
        // Leave silently; UI can still allow manual typing if needed
      }
    };
    

    fetchManagers();
    fetchLeaveTypes();
  }, []);

  // Populate form if editing



useEffect(() => {
  if (editRequest && managers.length > 0) {
    setLeaveType(editRequest.LeaveType);
    
    // Fix timezone issue by using UTC
    const formatDateForInput = (dateString) => {
      const date = new Date(dateString);
      // Add timezone offset to get the correct local date
      const offsetDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
      return offsetDate.toISOString().split('T')[0];
    };
    
    setStartDate(formatDateForInput(editRequest.StartDate));
    setEndDate(formatDateForInput(editRequest.EndDate));
    setReason(editRequest.Description || editRequest.Reason || "");
    setApproverId(editRequest.ApproverID || editRequest.approverid || editRequest.managerid || "");
  }
}, [editRequest, managers]);










  // --- Handle form submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (new Date(endDate) < new Date(startDate)) {
      setError("End date cannot be before the start date.");
      return;
    }

    try {
      const normalize = (d) => {
        // Ensure YYYY-MM-DD
        const dt = new Date(d);
        return isNaN(dt.getTime()) ? d : dt.toISOString().split("T")[0];
      };

      const response = await api.post("/leave/apply", {
        leaveTypeName: leaveType,
        startDate: normalize(startDate),
        endDate: normalize(endDate),
        reason,
        approverId, // This is manager EmployeeID
        employeeId: 1, // TEMP: until auth provides logged-in user id
      });

      setMessage(response.data.message);

      // Clear form on success
      setLeaveType("");
      setStartDate("");
      setEndDate("");
      setReason("");
      setApproverId("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "An error occurred."
      );
    }
  };

  return (
    <div className="form-container">
      <div className="form-title-container">
        <h2 className="form-title">+ Apply for Leave</h2>
        <p className="form-subtitle">Submit a new leave request</p>
      </div>

      <form onSubmit={handleSubmit} className="form-layout">
        {/* Leave Type */}
        <div className="form-group">
          <label htmlFor="leaveType">Leave Type</label>
          <select
            id="leaveType"
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            required
          >
            <option value="" disabled>Select leave type</option>
            {leaveTypes.map((t) => (
              <option key={t.leavetypeid} value={t.typename}>
                {t.typename}
              </option>
            ))}
          </select>
        </div>

       

        {/* Start & End Dates */}
<div className="form-row">
  <div className="form-group">
    <label htmlFor="startDate">Start Date</label>
    <input
      type="date"
      id="startDate"
      value={startDate}
      min={getMinDate()}  // ADD THIS LINE
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
      min={startDate || getMinDate()}  // ADD THIS LINE
      onChange={(e) => setEndDate(e.target.value)}
      required
    />
  </div>
</div>


      
        {/* Approver (Managers Only) */}
        <div className="form-group">
          <label htmlFor="approver">Approver</label>
          <select
            id="approver"
            value={approverId}
            onChange={(e) => setApproverId(e.target.value)}
            required
          >
            <option value="">--Select Manager--</option>
            {managers.map((manager) => (
              <option key={manager.employeeid} value={manager.employeeid}>
                {manager.firstname}
              </option>
            ))}
          </select>
        </div>

        {/* Reason */}
        <div className="form-group">
          <label htmlFor="reason">Reason</label>
          <textarea
            id="reason"
            rows="5"
            placeholder="Briefly explain the reason for your leave"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Messages */}
        {message && <p className="feedback-message success">{message}</p>}
        {error && <p className="feedback-message error">{error}</p>}

        {/* Submit */}
        <button type="submit" className="submit-button">
          Submit Leave Request
        </button>
      </form>
    </div>
  );
};

export default ApplyPage;
