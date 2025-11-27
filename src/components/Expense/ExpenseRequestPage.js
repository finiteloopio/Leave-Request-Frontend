import React, { useState, useEffect } from "react";
import api from '../../services/api';

const ExpenseRequestPage = () => {
  // Form state
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [approverId, setApproverId] = useState("");
  const [reason, setReason] = useState("");
  const [receiptFile, setReceiptFile] = useState(null);

  const [managers, setManagers] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchManagers = async () => {
      try {

        // const response = await api.get('/users/managers');
        // setManagers(response.data);

        const response = await api.get('/users/managers');
console.log("Managers response:", response.data);
if (Array.isArray(response.data)) {
  setManagers(response.data);
} else if (response.data.data && Array.isArray(response.data.data)) {
  setManagers(response.data.data);
} else {
  setManagers([]);
}


      } catch (err) {
        setError('Could not fetch the list of managers.');
      }
    };
    fetchManagers();
  }, []);

  const handleFileChange = (e) => {
    setReceiptFile(e.target.files[0]);
  };

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      let receiptData = null;
      // THE FIX: Declare receiptMimeType here and initialize it to null.
      let receiptMimeType = null; 

      if (receiptFile) {
        receiptData = await toBase64(receiptFile);
        // THE FIX: Get the MIME type from the file object.
        receiptMimeType = receiptFile.type; 
      }

      const response = await api.post('/expenses/apply', { 
        date, 
        amount, 
        approverId, 
        reason,
        receiptData,
        receiptMimeType // Now this variable is correctly defined
      });

      setMessage(response.data.message);
      // Clear form on success
      setDate('');
      setAmount('');
      setApproverId('');
      setReason('');
      setReceiptFile(null);
      document.getElementById('receipt').value = null;

    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <div className="form-container">
      <div className="form-title-container">
        <h2 className="form-title">+ Submit an Expense</h2>
        <p className="form-subtitle">Fill in the details for your expense claim</p>
      </div>

      <form onSubmit={handleSubmit} className="form-layout">
        <div className="form-group">
          <label htmlFor="date">Date of Expense</label>
          <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input type="number" id="amount" placeholder="e.g., 150.50" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>

        <div className="form-group">
          <label htmlFor="approver">Approver</label>
          <select id="approver" value={approverId} onChange={(e) => setApproverId(e.target.value)} required>
            <option value="" disabled>Select your approver</option>
           

            {/* {managers.map((manager) => (
              <option key={manager.EmployeeID} value={manager.EmployeeID}>{manager.FirstName}</option>
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
          <label htmlFor="reason">Reason / Description</label>
          <textarea id="reason" rows="5" placeholder="e.g., Client lunch meeting" value={reason} onChange={(e) => setReason(e.target.value)} required></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="receipt">Attach Receipt (Optional)</label>
          <input type="file" id="receipt" onChange={handleFileChange} />
        </div>

        {message && <p className="feedback-message success">{message}</p>}
        {error && <p className="feedback-message error">{error}</p>}

        <button type="submit" className="submit-button">
          Submit Expense Claim
        </button>
      </form>
    </div>
  );
};

export default ExpenseRequestPage;

