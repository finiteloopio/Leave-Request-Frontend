import React from "react";
import { Check, X } from "lucide-react"; // Import icons
import Spinner from "./Spinner"; // Import Spinner for loading state
import "./ConfirmationModal.css";

const ConfirmationModal = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
  isLoading,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    // Use a more specific class for the overlay
    <div className="confirmation-modal-overlay" onClick={onCancel}>
      <div
        className="confirmation-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="confirmation-modal-message">{message}</p>
        <div className="confirmation-modal-actions">
          {/* "No" Button */}
          <button
            onClick={onCancel}
            className="modal-btn cancel-btn"
            disabled={isLoading} // Disable while loading
          >
            <X size={16} /> No
          </button>
          {/* "Yes" Button */}
          <button
            onClick={onConfirm}
            className="modal-btn confirm-btn"
            disabled={isLoading} // Disable while loading
          >
            {/* Show spinner or icon+text */}
            {isLoading ? (
              <Spinner size="small" />
            ) : (
              <>
                <Check size={16} /> Yes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
