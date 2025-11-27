import React, { useState, useEffect, useCallback } from "react"; // Added useCallback
import api from "../../services/api";
import "./Requests.css";
import Spinner from "../common/Spinner"; // 1. Import Spinner

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true); // For initial load
  const [actionLoadingId, setActionLoadingId] = useState(null); // Tracks ID of item being actioned
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const fetchTeamRequests = useCallback(async () => {
    // Use useCallback
    try {
      setInitialLoading(true); // Use initialLoading
      setError("");
      const response = await api.get("/manager/team-requests");
      setRequests(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch team requests.");
    } finally {
      setInitialLoading(false); // Set initialLoading false
    }
  }, []); // Empty dependency array

  useEffect(() => {
    fetchTeamRequests();
  }, [fetchTeamRequests]); // Depend on memoized function

  const handleAction = async (requestId, action) => {
    setError("");
    setFeedback("");
    setActionLoadingId(requestId); // 2. Set loading state for this item
    try {
      const response = await api.put(
        `/manager/requests/${requestId}/${action}`
      );
      setFeedback(response.data.message);
      fetchTeamRequests(); // Refresh list
    } catch (err) {
      setError(
        err.response?.data?.message || `Failed to ${action} the request.`
      );
    } finally {
      setActionLoadingId(null); // 3. Clear loading state
    }
  };

  const handleViewReceipt = async (requestId) => {
    setActionLoadingId(requestId); // 2. Set loading state
    setError("");
    try {
      const response = await api.get(`/expenses/${requestId}/receipt`, {
        responseType: "blob",
      });
      const imageUrl = URL.createObjectURL(response.data);
      window.open(imageUrl, "_blank");
    } catch (err) {
      setError("Could not retrieve the receipt file.");
    } finally {
      setActionLoadingId(null); // 3. Clear loading state
    }
  };

  // 4. Show spinner container for initial load
  if (initialLoading) {
    return (
      <div className="spinner-container">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="requests-container">
      {error && <p className="feedback-message error">{error}</p>}
      {feedback && <p className="feedback-message success">{feedback}</p>}

      {requests.length === 0 && !error ? (
        <p className="empty-state">You have no pending team requests.</p>
      ) : (
        <ul className="requests-list">
          {requests.map((request) => {
            // Check if the current item is the one being actioned
            const isItemLoading = actionLoadingId === request.RequestID;
            return (
              // 5. Add loading class to list item if it's being actioned
              <li
                key={request.RequestID}
                className={`request-item ${
                  isItemLoading ? "loading-item" : ""
                }`}
              >
                <div className="request-details">
                  <span
                    className={`request-type-badge type-${request.RequestType}`}
                  >
                    {request.RequestType}
                  </span>
                  <p>
                    <strong>Employee:</strong> {request.EmployeeName}
                  </p>
                  {request.RequestType === "expense" ? (
                    <>
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(request.StartDate).toLocaleDateString(
                          "en-IN"
                        )}
                      </p>
                      <p>
                        <strong>Amount:</strong> Rs. {request.Amount}
                      </p>
                    </>
                  ) : (
                    <p>
                      <strong>Dates:</strong>{" "}
                      {new Date(request.StartDate).toLocaleDateString("en-IN")}{" "}
                      - {new Date(request.EndDate).toLocaleDateString("en-IN")}
                    </p>
                  )}
                  <p>
                    <strong>Reason:</strong> {request.Description}
                  </p>
                </div>
                <div className="request-actions">
                  {/* 6. Conditionally show spinner in buttons */}
                  {request.RequestType === "expense" && request.HasDocument && (
                    <button
                      onClick={() => handleViewReceipt(request.RequestID)}
                      className="action-btn view-receipt-btn"
                      disabled={isItemLoading} // Disable button while loading
                    >
                      {isItemLoading ? (
                        <Spinner size="small" />
                      ) : (
                        "View Receipt"
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => handleAction(request.RequestID, "approve")}
                    className="action-btn approve-btn"
                    disabled={isItemLoading}
                  >
                    {isItemLoading ? <Spinner size="small" /> : "Approve"}
                  </button>
                  <button
                    onClick={() => handleAction(request.RequestID, "reject")}
                    className="action-btn reject-btn"
                    disabled={isItemLoading}
                  >
                    {isItemLoading ? <Spinner size="small" /> : "Reject"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Requests;
