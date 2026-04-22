import React, { useState } from 'react';
import { FaPlus, FaCog, FaPlay, FaSignOutAlt, FaArrowLeft } from 'react-icons/fa';
import './TeacherDashboard.css';

const TeacherDashboard = ({ user, onJoinRoom, onBack, onLogout, showToast }) => {
  const [rooms, setRooms] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRoom, setNewRoom] = useState({
    name: '',
    description: '',
    permissions: {
      editCode: true,
      viewOnly: false,
      useMicrophone: true,
      useCamera: true,
      shareScreen: false,
      downloadCode: true
    }
  });

  const handleCreateRoom = () => {
    if (!newRoom.name.trim()) {
      showToast('Please enter a room name', 'warning');
      return;
    }

    const roomId = 'ROOM' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const room = {
      id: roomId,
      ...newRoom,
      students: 0,
      createdAt: new Date().toISOString()
    };

    setRooms([...rooms, room]);
    setShowCreateForm(false);
    setNewRoom({
      name: '',
      description: '',
      permissions: {
        editCode: true,
        viewOnly: false,
        useMicrophone: true,
        useCamera: true,
        shareScreen: false,
        downloadCode: true
      }
    });
    
    showToast(`Room "${newRoom.name}" created successfully! Code: ${roomId}`);
  };

  const handleStartRoom = (room) => {
    onJoinRoom(room);
    showToast(`Starting room: ${room.name}`);
  };

  const handlePermissionChange = (permission) => {
    setNewRoom({
      ...newRoom,
      permissions: {
        ...newRoom.permissions,
        [permission]: !newRoom.permissions[permission]
      }
    });
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="logo">
          <i className="fas fa-code"></i>
          <span>CollabCode - Teacher</span>
        </div>
        <div className="header-controls">
          <button className="btn btn-outline" onClick={onBack}>
            <FaArrowLeft /> Back
          </button>
          <div className="user-info">
            <div className="user-avatar">{user?.avatar || 'T'}</div>
            <span className="user-name">{user?.name || 'Teacher'}</span>
          </div>
          <button className="btn btn-outline" onClick={onLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>Create New Room</h2>
          
          {!showCreateForm ? (
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => setShowCreateForm(true)}
            >
              <FaPlus /> Create New Room
            </button>
          ) : (
            <div className="create-room-form">
              <div className="form-group">
                <label>Room Name *</label>
                <input
                  type="text"
                  value={newRoom.name}
                  onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
                  placeholder="Enter room name"
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newRoom.description}
                  onChange={(e) => setNewRoom({...newRoom, description: e.target.value})}
                  placeholder="Enter room description"
                  rows="3"
                />
              </div>

              <h3>Student Permissions</h3>
              <div className="permissions-grid">
                <label className="permission-item">
                  <input
                    type="checkbox"
                    checked={newRoom.permissions.editCode}
                    onChange={() => handlePermissionChange('editCode')}
                  />
                  <span>Edit Code</span>
                </label>
                <label className="permission-item">
                  <input
                    type="checkbox"
                    checked={newRoom.permissions.viewOnly}
                    onChange={() => handlePermissionChange('viewOnly')}
                  />
                  <span>View Only</span>
                </label>
                <label className="permission-item">
                  <input
                    type="checkbox"
                    checked={newRoom.permissions.useMicrophone}
                    onChange={() => handlePermissionChange('useMicrophone')}
                  />
                  <span>Use Microphone</span>
                </label>
                <label className="permission-item">
                  <input
                    type="checkbox"
                    checked={newRoom.permissions.useCamera}
                    onChange={() => handlePermissionChange('useCamera')}
                  />
                  <span>Use Camera</span>
                </label>
                <label className="permission-item">
                  <input
                    type="checkbox"
                    checked={newRoom.permissions.shareScreen}
                    onChange={() => handlePermissionChange('shareScreen')}
                  />
                  <span>Share Screen</span>
                </label>
                <label className="permission-item">
                  <input
                    type="checkbox"
                    checked={newRoom.permissions.downloadCode}
                    onChange={() => handlePermissionChange('downloadCode')}
                  />
                  <span>Download Code</span>
                </label>
              </div>

              <div className="form-actions">
                <button 
                  className="btn btn-outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleCreateRoom}
                >
                  Create Room
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="dashboard-card">
          <h2>My Rooms</h2>
          {rooms.length === 0 ? (
            <p className="empty-message">No rooms created yet. Create your first room to get started!</p>
          ) : (
            <div className="room-grid">
              {rooms.map(room => (
                <div key={room.id} className="room-card">
                  <div className="room-card-header">
                    <h3>{room.name}</h3>
                    <span className="room-status">Active</span>
                  </div>
                  <div className="room-card-body">
                    <p>{room.description || 'No description'}</p>
                    <div className="room-details">
                      <p><strong>Code:</strong> {room.id}</p>
                      <p><strong>Students:</strong> {room.students}</p>
                    </div>
                  </div>
                  <div className="room-card-actions">
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleStartRoom(room)}
                    >
                      <FaPlay /> Start
                    </button>
                    <button className="btn btn-outline">
                      <FaCog /> Settings
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;