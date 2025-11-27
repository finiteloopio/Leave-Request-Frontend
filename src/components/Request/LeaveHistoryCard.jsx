import React, { useEffect, useState } from 'react';
import { Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import './RequestHistory.css';

const LeaveHistoryCard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [history, setHistory] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/leave/manager/history');
        const data = res.data?.data || [];
        setHistory(
          data.map(r => ({
            id: r.requestid,
            type: r.typename,
            employee: r.employeename,
            startDate: new Date(r.startdate).toLocaleDateString(),
            endDate: new Date(r.enddate).toLocaleDateString(),
            duration: `${r.totaldays} day${r.totaldays === 1 ? '' : 's'}`,
            reason: r.description,
            status: r.status.toLowerCase()
          }))
        );
      } catch (_err) {}
    };
    fetchHistory();
  }, []);

  const handleCancelClick = (item) => {
    setSelectedRequest(item);
    setShowConfirmDialog(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedRequest) return;

    try {
      await api.post('/leave/cancel', { requestId: selectedRequest.id });
      
      setHistory(prevHistory =>
        prevHistory.map(item =>
          item.id === selectedRequest.id
            ? { ...item, status: 'cancelled' }
            : item
        )
      );
      
      setShowConfirmDialog(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Failed to cancel request:', error);
      alert('Failed to cancel the request. Please try again.');
    }
  };

  const handleCloseDialog = () => {
    setShowConfirmDialog(false);
    setSelectedRequest(null);
  };

  const totalPages = Math.ceil(history.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = history.slice(startIndex, endIndex);

  return (
    <div className="history-section">
      <h2 className="section-title">Leave History</h2>
      <div className="history-list">
        {currentItems.map((item) => (
          <div key={item.id} className="history-card">
            <div className="history-card-header">
              <div className="history-title-section">
                <h3 className="history-type">{item.type}</h3>
                <span className={`history-status-badge ${item.status}`}>
                  {item.status === 'approved' ? <Check size={14} /> : <X size={14} />}
                  {item.status}
                </span>
              </div>
            </div>
            
            <div className="history-card-body">
              <p className="history-employee-name">{item.employee}</p>
              <p className="history-date">{item.startDate} - {item.endDate}</p>
              <p className="history-duration">{item.duration}</p>
              <p className="history-reason">{item.reason}</p>
              
              {item.status === 'approved' && (
                <button 
                  className="cancel-request-button"
                  onClick={() => handleCancelClick(item)}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <div className="pagination-info">
            Showing {startIndex + 1} to {Math.min(endIndex, history.length)} of {history.length} requests
          </div>
          <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                  className={`page-number ${currentPage === i + 1 ? 'active' : ''}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {showConfirmDialog && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Cancel Request</h3>
            <p>Are you sure you want to cancel this approved leave request?</p>
            <div className="modal-employee-info">
              <strong>{selectedRequest?.employee}</strong>
              <span>{selectedRequest?.type}</span>
              <span>{selectedRequest?.startDate} - {selectedRequest?.endDate}</span>
            </div>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={handleCloseDialog}>
                No, Keep It
              </button>
              <button className="modal-btn confirm" onClick={handleConfirmCancel}>
                Yes, Cancel Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveHistoryCard;