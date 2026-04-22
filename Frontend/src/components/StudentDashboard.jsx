import React, { useState } from 'react';
import { FaSignInAlt, FaArrowLeft, FaSignOutAlt } from 'react-icons/fa';
import './StudentDashboard.css';

const StudentDashboard = ({ user, onJoinRoom, onBack, onLogout, showToast }) => {
  const [roomCode, setRoomCode] = useState('');
  const [availableRooms] = useState([
    { id: 'ROOM1', name: 'JavaScript Basics', description: 'Learn the fundamentals of JavaScript', teacher: 'Yasir Abdullah', students: 12 },
    { id: 'ROOM2', name: 'Web Development', description: 'Build modern web applications', teacher: 'Waheed Hassan', students: 8 },
    { id: 'ROOM3', name: 'React Workshop', description: 'Advanced React patterns and practices', teacher: 'Muhammad Abdullah', students: 15 }
  ]);

  const handleJoinWithCode = () => {
    if (!roomCode.trim()) {
      showToast('Please enter a room code', 'warning');
      return;
    }

    const room = availableRooms.find(r => r.id === roomCode.toUpperCase());
    
    if (room) {
      onJoinRoom(room);
      showToast(`Joined room: ${room.name}`);
    } else {
      showToast('Room not found. Please check the code.', 'error');
    }
  };

  const handleJoinRoom = (room) => {
    onJoinRoom(room);
    showToast(`Joined room: ${room.name}`);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="logo">
          <i className="fas fa-code"></i>
          <span>CollabCode - Student</span>
        </div>
        <div className="header-controls">
          <button className="btn btn-outline" onClick={onBack}>
            <FaArrowLeft /> Back
          </button>
          <div className="user-info">
            <div className="user-avatar">{user?.avatar || 'S'}</div>
            <span className="user-name">{user?.name || 'Student'}</span>
          </div>
          <button className="btn btn-outline" onClick={onLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>Join a Room</h2>
          
          <div className="join-room-form">
            <div className="form-group">
              <label>Room Code</label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Enter room code (e.g., ROOM123)"
                maxLength="8"
              />
            </div>
            
            <button 
              className="btn btn-primary btn-lg"
              onClick={handleJoinWithCode}
            >
              <FaSignInAlt /> Join Room
            </button>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Available Rooms</h2>
          
          <div className="room-grid">
            {availableRooms.map(room => (
              <div key={room.id} className="room-card">
                <div className="room-card-header">
                  <h3>{room.name}</h3>
                  <span className="room-status">{room.students} students</span>
                </div>
                <div className="room-card-body">
                  <p>{room.description}</p>
                  <div className="room-details">
                    <p><strong>Teacher:</strong> {room.teacher}</p>
                    <p><strong>Code:</strong> {room.id}</p>
                  </div>
                </div>
                <div className="room-card-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleJoinRoom(room)}
                  >
                    <FaSignInAlt /> Join Room
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;