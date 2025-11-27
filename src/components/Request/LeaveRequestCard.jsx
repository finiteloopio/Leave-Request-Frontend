import React, { useEffect, useState } from 'react';
import { Check, X, Clock } from 'lucide-react';
import api from '../../services/api';
import './Requests.css';

const LeaveRequestCard = () => {
  const [requests, setRequests] = useState([]);

  const loadPending = async () => {
    try {
      const res = await api.get('/leave/manager/pending');
      const data = res.data?.data || [];
      setRequests(
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
    } catch (err) {
      setRequests([]);
    }
  };

  useEffect(() => { loadPending(); }, []);

  const handleApprove = async (id) => {
    try {
      await api.post(`/leave/manager/requests/${id}/decide`, { decision: 'APPROVED' });
      await loadPending();
    } catch (_err) {}
  };

  const handleReject = async (id) => {
    try {
      await api.post(`/leave/manager/requests/${id}/decide`, { decision: 'REJECTED' });
      await loadPending();
    } catch (_err) {}
  };

  return (
    <div className="request-section">
      <h2 className="section-title">Leave Requests</h2>
      <div className="requests-list">
        {requests.map((request) => (
          <div key={request.id} className="request-card">
            <div className="request-header">
              <div className="request-title-section">
                <h3 className="request-type">{request.type}</h3>
                <span className={`status-badge ${request.status}`}>
                  {request.status === 'pending' ? <Clock size={14} /> : 
                   request.status === 'approved' ? <Check size={14} /> : <X size={14} />}
                  {request.status}
                </span>
              </div>
              {request.status === 'pending' && (
                <div className="action-buttons">
                  <button 
                    className="action-btn approve-btn"
                    onClick={() => handleApprove(request.id)}
                  >
                    <Check size={20} />
                  </button>
                  <button 
                    className="action-btn reject-btn"
                    onClick={() => handleReject(request.id)}
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>
            
            <div className="request-body">
              <p className="employee-name">{request.employee}</p>
              <p className="request-date">{request.startDate} - {request.endDate}</p>
              <p className="duration">{request.duration}</p>
              <p className="request-reason">{request.reason}</p>
            </div>
          </div>
        ))}

        {requests.length === 0 && (
          <div className="empty-state">
            <Clock size={48} />
            <p>No pending leave requests</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveRequestCard;