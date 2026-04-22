import React, { useState } from 'react';
import { FaCopy, FaTimes } from 'react-icons/fa';
import './InviteModal.css';

const InviteModal = ({ room, onClose, showToast }) => {
  // Generate room code once when modal opens
  const [roomCode] = useState(room?.id || 'ROOM' + Math.random().toString(36).substring(2, 8).toUpperCase());
  const inviteLink = `${window.location.origin}?room=${roomCode}`;

  const handleCopy = (text, message) => {
    navigator.clipboard.writeText(text);
    showToast(message);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="invite-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="invite-modal-header">
          <i className="fas fa-share-alt"></i>
          <h2>Invite to Room</h2>
        </div>

        <p className="invite-description">
          Share this room code or link with others to join your coding session.
        </p>

        <div className="room-code-section">
          <label>Room Code</label>
          <div className="code-display">
            <span className="code">{roomCode}</span>
            <button 
              className="btn btn-outline btn-sm"
              onClick={() => handleCopy(roomCode, 'Room code copied!')}
            >
              <FaCopy /> Copy
            </button>
          </div>
        </div>

        <div className="invite-link-section">
          <label>Invite Link</label>
          <div className="link-display">
            <input 
              type="text" 
              value={inviteLink} 
              readOnly 
              onClick={e => e.target.select()}
            />
            <button 
              className="btn btn-primary"
              onClick={() => handleCopy(inviteLink, 'Link copied to clipboard!')}
            >
              <FaCopy />
            </button>
          </div>
        </div>

        <div className="invite-modal-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;