import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./WFHHistoryPage.css"; // You'll need to create this CSS file

const WFHHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewRequest, setViewRequest] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/wfh/history");
        console.log("WFH History response:", response.data);
        setHistory(response.data);
      } catch (err) {
        console.error("Error fetching WFH history:", err);
        setError("Failed to fetch WFH history.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleEdit = (request) => {
    // Navigate to WFH apply page with request data for editing
    navigate("/wfh-apply", { state: { editRequest: request } });
  };

  const handleDelete = async (requestId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this WFH request?");
    
    if (!confirmDelete) return;

    try {
      await api.delete(`/wfh/delete/${requestId}`);
      
      setHistory(history.filter(request => request.requestid !== requestId));
      
      alert("WFH request deleted successfully!");
    } catch (err) {
      console.error("Error deleting WFH request:", err);
      alert(err.response?.data?.message || "Failed to delete WFH request.");
    }
  };

  const handleView = (request) => {
    setViewRequest(request);
  };

  const closeModal = () => {
    setViewRequest(null);
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "40px" }}>Loading history...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red", marginTop: "40px" }}>{error}</p>;

  return (
    <>
      <div className="wfh-history-container">
        {history.length === 0 ? (
          <p style={{ textAlign: "center", color: "#6b7280", marginTop: "40px" }}>
            You have no submitted WFH requests.
          </p>
        ) : (
          <div>
            <h2>Your WFH Request History</h2>
            <ul className="wfh-history-list">
              {history.map((request) => (
                <li key={request.requestid} className="wfh-history-item">
                  <div className="wfh-item-details">
                    <p>
                      <strong>Start Date:</strong> {new Date(request.StartDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>End Date:</strong> {new Date(request.EndDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Total Days:</strong> {request.TotalDays}
                    </p>
                    <p>
                      <strong>Reason:</strong> {request.Description}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span className={`status-badge status-${request.Status}`}>
                        {request.Status}
                      </span>
                    </p>
                    <p>
                      <strong>Approver:</strong> {request.ManagerName}
                    </p>
                  </div>
                  
                  {/* Show edit/delete buttons only if status is PENDING */}
                  {request.Status === 'PENDING' && (
                    <div className="action-buttons">
                      <button 
                        className="edit-btn" 
                        title="Edit"
                        onClick={() => handleEdit(request)}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button 
                        className="delete-btn" 
                        title="Delete"
                        onClick={() => handleDelete(request.requestid)}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Show view button only if status is APPROVED or REJECTED */}
                  {(request.Status === 'APPROVED' || request.Status === 'REJECTED') && (
                    <div className="action-buttons">
                      <button 
                        className="view-btn" 
                        title="View"
                        onClick={() => handleView(request)}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Modal for viewing WFH request details */}
      {viewRequest && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>WFH Request Details</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="modal-field">
                <strong>Start Date:</strong>
                <span>{new Date(viewRequest.StartDate).toLocaleDateString()}</span>
              </div>
              <div className="modal-field">
                <strong>End Date:</strong>
                <span>{new Date(viewRequest.EndDate).toLocaleDateString()}</span>
              </div>
              <div className="modal-field">
                <strong>Total Days:</strong>
                <span>{viewRequest.TotalDays}</span>
              </div>
              <div className="modal-field">
                <strong>Status:</strong>
                <span className={`status-badge status-${viewRequest.Status}`}>
                  {viewRequest.Status}
                </span>
              </div>
              <div className="modal-field">
                <strong>Approver:</strong>
                <span>{viewRequest.ManagerName}</span>
              </div>
              {viewRequest.Description && (
                <div className="modal-field modal-field-full">
                  <strong>Reason:</strong>
                  <p>{viewRequest.Description}</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="modal-close-btn" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WFHHistoryPage;