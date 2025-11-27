import React from "react";
import "./RequestDetailsModal.css"; // We'll create this CSS file

const RequestDetailsModal = ({ request, onClose }) => {
  // Don't render anything if no request is selected
  if (!request) return null;

  // Helper to format dates consistently
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    // The overlay covers the whole screen
    <div className="modal-overlay" onClick={onClose}>
      {/* Prevent clicks inside the modal from closing it */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Request Details (ID: {request.RequestID})</h2>
          <button onClick={onClose} className="close-button">
            &times;
          </button>
        </div>

        <div className="modal-body">
          {/* Conditionally display fields based on what's available in the request object */}
          {request.EmployeeName && (
            <p>
              <strong>Employee:</strong> {request.EmployeeName}
            </p>
          )}
          <p>
            <strong>Approver:</strong> {request.ManagerName}
          </p>
          <p>
            <strong>Request Type:</strong>{" "}
            <span className="detail-value">{request.RequestType}</span>
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className={`status-badge status-${request.Status}`}>
              {request.Status}
            </span>
          </p>

          {request.LeaveType && (
            <p>
              <strong>Leave Type:</strong>{" "}
              <span className="detail-value">{request.LeaveType}</span>
            </p>
          )}

          {/* Display Dates */}
          {request.RequestType === "expense" && request.StartDate && (
            <p>
              <strong>Date:</strong> {formatDate(request.StartDate)}
            </p>
          )}
          {(request.RequestType === "leave" || request.RequestType === "wfh") &&
            request.StartDate && (
              <p>
                <strong>Dates:</strong> {formatDate(request.StartDate)} -{" "}
                {formatDate(request.EndDate)}
              </p>
            )}

          {/* Display Duration/Amount */}
          {request.TotalDays && (
            <p>
              <strong>Calculated Days:</strong>{" "}
              {parseInt(request.TotalDays, 10)}
            </p>
          )}
          {request.Amount && (
            <p>
              <strong>Amount:</strong> Rs. {request.Amount}
            </p>
          )}

          {request.Description && (
            <p>
              <strong>Reason:</strong> {request.Description}
            </p>
          )}

          {/* We might add a View Receipt button here later for expense modals */}
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsModal;
