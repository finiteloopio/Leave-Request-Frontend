import React, { useState, useEffect, useCallback } from "react";
import { Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../services/api";
import Spinner from "../common/Spinner";
import ConfirmationModal from "../common/ConfirmationModal";
import "./RequestHistory.css";

const RequestHistory = () => {
  const [history, setHistory] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestToCancelId, setRequestToCancelId] = useState(null);

  const fetchHistory = useCallback(async () => {
    try {
      setInitialLoading(true);
      setError("");
      const response = await api.get("/manager/team-requests/history");
      setHistory(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch request history."
      );
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleManagerCancelClick = (requestId) => {
    setRequestToCancelId(requestId);
    setIsModalOpen(true);
  };

  const confirmManagerCancel = async () => {
    if (!requestToCancelId) return;
    setActionLoadingId(requestToCancelId);
    setError("");
    setFeedback("");
    try {
      const response = await api.put(
        `/manager/requests/${requestToCancelId}/cancel`
      );
      setFeedback(response.data.message);
      closeModal();
      fetchHistory();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel the request.");
      closeModal();
    } finally {
      setActionLoadingId(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setRequestToCancelId(null);
  };

  const handleViewReceipt = async (requestId) => {
    setActionLoadingId(requestId);
    setError("");
    try {
      const response = await api.get(`/expenses/${requestId}/receipt`, {
        responseType: "blob",
      });
      const imageUrl = URL.createObjectURL(response.data);
      window.open(imageUrl, "_blank");
    } catch (err) {
      console.error("Failed to fetch receipt:", err);
      setError("Could not retrieve the receipt file.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const totalPages = Math.ceil(history.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = history.slice(startIndex, endIndex);

  if (initialLoading) {
    return (
      <div className="spinner-container">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <>
      <div className="history-container">
        {error && <p className="feedback-message error">{error}</p>}
        {feedback && <p className="feedback-message success">{feedback}</p>}

        {currentItems.length === 0 ? (
          <p className="empty-state">
            There is no request history for your team.
          </p>
        ) : (
          <div className="history-list">
            {currentItems.map((item) => {
              const isItemLoading = actionLoadingId === item.RequestID;
              return (
                <div
                  key={item.RequestID}
                  className={`history-card ${
                    isItemLoading ? "loading-item" : ""
                  }`}
                >
                  <div className="history-card-header">
                    <div className="history-title-section">
                      <h3 className="history-type">{item.RequestType}</h3>
                      <span className={`history-status-badge ${item.Status}`}>
                        {item.Status === "approved" ? (
                          <Check size={14} />
                        ) : (
                          <X size={14} />
                        )}
                        {item.Status}
                      </span>
                    </div>
                  </div>

                  <div className="history-card-body">
                    <p className="history-employee-name">{item.EmployeeName}</p>

                    {/* Conditional details for Expense */}
                    {item.RequestType === "expense" ? (
                      <>
                        <p className="history-date">
                          Date:{" "}
                          {new Date(item.StartDate).toLocaleDateString("en-IN")}
                        </p>
                        <p className="history-amount">
                          Amount: Rs. {item.Amount}
                        </p>
                      </>
                    ) : (
                      // Conditional details for Leave/WFH
                      <>
                        <p className="history-date">
                          Dates:{" "}
                          {new Date(item.StartDate).toLocaleDateString("en-IN")}
                          {item.EndDate &&
                            ` - ${new Date(item.EndDate).toLocaleDateString(
                              "en-IN"
                            )}`}
                        </p>
                        {item.TotalDays && (
                          <p className="history-duration">
                            Duration: {parseInt(item.TotalDays, 10)} day(s)
                          </p>
                        )}
                      </>
                    )}

                    {/* Reason for all types */}
                    {item.Description && (
                      <p className="history-reason">
                        Reason: {item.Description}
                      </p>
                    )}

                    <div className="history-actions">
                      {item.RequestType === "expense" && item.HasDocument && (
                        <button
                          onClick={() => handleViewReceipt(item.RequestID)}
                          className="action-btn view-receipt-btn"
                          disabled={isItemLoading}
                        >
                          {isItemLoading ? (
                            <Spinner size="small" />
                          ) : (
                            "View Receipt"
                          )}
                        </button>
                      )}
                      {item.Status === "approved" && (
                        <button
                          onClick={() =>
                            handleManagerCancelClick(item.RequestID)
                          }
                          className="action-btn cancel-btn"
                          disabled={isItemLoading}
                        >
                          {isItemLoading ? <Spinner size="small" /> : "Cancel"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <div className="pagination-info">
              Showing {startIndex + 1} to {Math.min(endIndex, history.length)}{" "}
              of {history.length} requests
            </div>
            <div className="pagination-controls">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="pagination-numbers">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`page-number ${
                      currentPage === i + 1 ? "active" : ""
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        message="Are you sure you want to cancel this approved request?"
        onConfirm={confirmManagerCancel}
        onCancel={closeModal}
        isLoading={actionLoadingId === requestToCancelId}
      />
    </>
  );
};

export default RequestHistory;
