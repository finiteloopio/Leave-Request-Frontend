import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./ExpenseHistoryPage.css";

const ExpenseHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewRequest, setViewRequest] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/expenses/history");
        const historyWithDocs = response.data.map((item) => ({
          ...item,
          Document: item.Document !== null,
        }));
        setHistory(historyWithDocs);
      } catch (err) {
        setError("Failed to fetch expense history.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleViewReceipt = async (requestId) => {
    try {
      const response = await api.get(`/expenses/${requestId}/receipt`, {
        responseType: "blob",
      });
      const imageUrl = URL.createObjectURL(response.data);
      window.open(imageUrl, "_blank");
    } catch (err) {
      console.error("Failed to fetch receipt:", err);
      setError("Could not retrieve the receipt file.");
    }
  };

  const handleEdit = (request) => {
    // Navigate to expense request page with request data for editing
    navigate("/expense-request", { state: { editRequest: request } });
  };

  const handleDelete = async (requestId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this expense request?");
    
    if (!confirmDelete) return;

    try {
      await api.delete(`/expenses/delete/${requestId}`);
      
      setHistory(history.filter(request => request.RequestID !== requestId));
      
      alert("Expense request deleted successfully!");
    } catch (err) {
      console.error("Error deleting expense request:", err);
      alert(err.response?.data?.message || "Failed to delete expense request.");
    }
  };

  const handleView = (request) => {
    setViewRequest(request);
  };

  const closeModal = () => {
    setViewRequest(null);
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading history...</p>;
  if (error) return <p className="feedback-message error">{error}</p>;

  return (
    <>
      <div className="history-container">
        {history.length === 0 ? (
          <p style={{ textAlign: "center", color: "#6b7280" }}>
            You have no submitted expense requests.
          </p>
        ) : (
          <ul className="history-list">
            {history.map((request) => (
              <li key={request.RequestID} className="history-item">
                <div className="item-details">
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(request.ExpenseDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Amount:</strong> ${request.Amount}
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
                  {request.Document && (
                    <button
                      onClick={() => handleViewReceipt(request.RequestID)}
                      className="view-receipt-link"
                    >
                      View Receipt
                    </button>
                  )}
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
                      onClick={() => handleDelete(request.RequestID)}
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
                      title="View Details"
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
        )}
      </div>

      {/* Modal for viewing expense request details */}
      {viewRequest && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Expense Request Details</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="modal-field">
                <strong>Expense Date:</strong>
                <span>{new Date(viewRequest.ExpenseDate).toLocaleDateString()}</span>
              </div>
              <div className="modal-field">
                <strong>Amount:</strong>
                <span>${viewRequest.Amount}</span>
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
                  <strong>Description:</strong>
                  <p>{viewRequest.Description}</p>
                </div>
              )}
              {viewRequest.Document && (
                <div className="modal-field modal-field-full">
                  <strong>Receipt:</strong>
                  <button
                    onClick={() => handleViewReceipt(viewRequest.RequestID)}
                    className="view-receipt-modal-btn"
                  >
                    View Receipt
                  </button>
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

export default ExpenseHistoryPage;