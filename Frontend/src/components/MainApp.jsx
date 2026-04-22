import React, { useState, useEffect, useRef } from 'react';
import { FaUsers, FaTerminal, FaVideo, FaRobot, FaUserPlus, FaStop, FaDownload, FaUpload } from 'react-icons/fa';
import io from 'socket.io-client';  // 🆕 Socket.io import
import SidebarPanel from './SidebarPanel';
import Editor from './Editor';
import OutputPanel from './OutputPanel';
import VideoPanel from './VideoPanel';
import Chatbot from './Chatbot';
import InviteModal from './InviteModal';
import './MainApp.css';

const MainApp = ({ user, role, onLogout, showToast }) => {
  // ========== EXISTING STATES ==========
  const [panels, setPanels] = useState({
    sidebar: true,
    output: true,
    video: true
  });
  const [showChatbot, setShowChatbot] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  
  // 🆕 OLD participants state (replace with real-time)
  // const [participants, setParticipants] = useState([...]); // ← Remove this
  
  // ========== 🆕 NEW STATES FOR REAL-TIME ==========
  const [socket, setSocket] = useState(null);           // Socket connection instance
  const [isConnected, setIsConnected] = useState(false); // Connection status
  const [participants, setParticipants] = useState([]);  // Real-time participants from server
  const [code, setCode] = useState('');                  // Shared code from server
  
  // Refs
  const editorRef = useRef(null);        // Editor component reference
  const fileInputRef = useRef(null);     // Hidden file input reference

  // ========== 🆕 LOAD ROOM FROM LOCALSTORAGE ==========
  useEffect(() => {
    const savedRoom = localStorage.getItem('currentRoom');
    if (savedRoom) {
      setCurrentRoom(JSON.parse(savedRoom));
    }
  }, []);

  // ========== 🆕 SOCKET CONNECTION FOR REAL-TIME COLLABORATION ==========
  // Kyun: Real-time sync ke liye backend server se connect karna
  useEffect(() => {
    if (!currentRoom?.id) return;

    // Connect to backend server (change URL in production)
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5
    });

    // Connection established
    newSocket.on('connect', () => {
      setIsConnected(true);
      showToast('Connected to collaboration server');
      
      // Join the room
      newSocket.emit('join-room', {
        roomId: currentRoom.id,
        user: {
          id: user?.id || Date.now(),
          name: user?.name || 'User',
          role: role,
          avatar: user?.avatar || (role === 'teacher' ? 'T' : 'S')
        }
      });
    });

    // Connection lost
    newSocket.on('disconnect', () => {
      setIsConnected(false);
      showToast('Disconnected from server', 'error');
    });

    // Reconnection
    newSocket.on('reconnect', () => {
      setIsConnected(true);
      showToast('Reconnected to server');
      
      // Rejoin room
      newSocket.emit('join-room', {
        roomId: currentRoom.id,
        user: {
          id: user?.id || Date.now(),
          name: user?.name || 'User',
          role: role
        }
      });
    });

    // 📡 Receive initial room data (code and participants)
    newSocket.on('room-data', (data) => {
      setCode(data.code);
      setParticipants(data.participants || []);
      if (editorRef.current) {
        editorRef.current.setValue(data.code);
      }
      showToast(`Loaded shared code from server`);
    });

    // 👥 Participants list update
    newSocket.on('participants-update', (data) => {
      setParticipants(data.participants);
    });

    // 👤 User joined notification
    newSocket.on('user-joined', (data) => {
      setParticipants(prev => [...prev, data.user]);
      showToast(`${data.user.name} joined the room`);
    });

    // 👤 User left notification
    newSocket.on('user-left', (data) => {
      setParticipants(prev => prev.filter(p => p.id !== data.userId));
      showToast('A user left the room');
    });

    // 📝 Code update from other users (broadcast)
    newSocket.on('code-update', (data) => {
      setCode(data.code);
      if (editorRef.current && data.userId !== newSocket.id) {
        editorRef.current.setValue(data.code);
      }
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      if (newSocket) {
        newSocket.emit('leave-room', { roomId: currentRoom.id, userId: newSocket.id });
        newSocket.close();
      }
    };
  }, [currentRoom, user, role, showToast]);

  // ========== EXISTING FUNCTIONS ==========
  const togglePanel = (panel) => {
    setPanels(prev => ({
      ...prev,
      [panel]: !prev[panel]
    }));
  };

  // ========== 🆕 MODIFIED: handleEndRoom with socket ==========
  const handleEndRoom = () => {
    if (window.confirm('Are you sure you want to end this room? All participants will be disconnected.')) {
      // Notify server to end room
      if (socket && isConnected) {
        socket.emit('end-room', { roomId: currentRoom?.id });
      }
      localStorage.removeItem('currentRoom');
      onLogout();
      showToast('Room ended successfully');
    }
  };

  // ========== 🆕 DOWNLOAD CURRENT SHARED CODE ==========
  // Kyun: User current shared code (jo sab dekh rahe hain) download kar sake
  const handleDownloadCode = () => {
    // Get latest code from editor (which is synced with all users)
    const currentCode = editorRef.current?.getValue() || code;
    
    if (!currentCode) {
      showToast('No code to download');
      return;
    }

    try {
      const blob = new Blob([currentCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `collabcode_${currentRoom?.id || 'code'}_${Date.now()}.js`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showToast('✅ Code downloaded from shared session');
    } catch (error) {
      console.error('Download failed:', error);
      showToast('Failed to download code');
    }
  };

  // ========== 🆕 UPLOAD FILE TO SHARE WITH ALL USERS ==========
  // Kyun: User apni local file upload kare aur sab users ke saath share kare
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Allowed file types
    const allowedExtensions = ['.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.json', '.txt', '.py', '.java', '.cpp', '.c'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      showToast(`Please upload a code file (${allowedExtensions.join(', ')})`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const uploadedCode = e.target.result;
      
      // Update local editor
      setCode(uploadedCode);
      if (editorRef.current) {
        editorRef.current.setValue(uploadedCode);
      }
      
      // Broadcast to all users in room via socket
      if (socket && isConnected && currentRoom?.id) {
        socket.emit('code-change', {
          roomId: currentRoom.id,
          code: uploadedCode,
          userId: socket.id,
          userName: user?.name || 'User',
          fileName: file.name
        });
        
        showToast(`📤 "${file.name}" uploaded and shared with ${participants.length} users`);
      } else {
        showToast('Not connected to server. Code saved locally only.');
      }
    };
    
    reader.onerror = () => {
      showToast('Error reading file');
    };
    
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // ========== RENDER COMPONENT ==========
  return (
    <div className="main-app">
      <header className="app-header">
        <div className="logo">
          <i className="fas fa-code"></i>
          <span>CollabCode {currentRoom ? `- ${currentRoom.name}` : ''}</span>
        </div>

        <div className="header-controls">
          {/* 🆕 CONNECTION STATUS WITH PARTICIPANTS COUNT */}
          <div className="connection-status">
            <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></span>
            <span>{isConnected ? 'Live' : 'Offline'}</span>
            {isConnected && participants.length > 0 && (
              <span className="participants-count">👥 {participants.length}</span>
            )}
          </div>

          {/* Panel toggle buttons */}
          <div className="panel-controls">
            <button 
              className={`panel-toggle ${panels.sidebar ? 'active' : ''}`}
              onClick={() => togglePanel('sidebar')}
              title="Toggle Sidebar"
            >
              <FaUsers />
            </button>
            <button 
              className={`panel-toggle ${panels.output ? 'active' : ''}`}
              onClick={() => togglePanel('output')}
              title="Toggle Output"
            >
              <FaTerminal />
            </button>
            <button 
              className={`panel-toggle ${panels.video ? 'active' : ''}`}
              onClick={() => togglePanel('video')}
              title="Toggle Video"
            >
              <FaVideo />
            </button>
            <button 
              className={`panel-toggle ${showChatbot ? 'active' : ''}`}
              onClick={() => setShowChatbot(!showChatbot)}
              title="AI Assistant"
            >
              <FaRobot />
            </button>
          </div>

          <button className="btn btn-outline" onClick={() => setShowInviteModal(true)}>
            <FaUserPlus /> Invite
          </button>
          
          <button className="btn btn-danger" onClick={handleEndRoom}>
            <FaStop /> End Room
          </button>
          
          {/* 🆕 UPDATED: Download button now works */}
          <button className="btn btn-outline" onClick={handleDownloadCode}>
            <FaDownload /> Download
          </button>
          
          {/* 🆕 UPDATED: Upload button now works */}
          <button className="btn btn-outline" onClick={handleUploadClick}>
            <FaUpload /> Upload
          </button>

          <div className="user-info">
            <div className="user-avatar">{user?.avatar || 'U'}</div>
            <span className="user-name">{user?.name || 'User'}</span>
            <div className="user-dropdown">
              <div className="dropdown-item" onClick={() => showToast('Profile coming soon')}>
                <i className="fas fa-user"></i> Profile
              </div>
              <div className="dropdown-item" onClick={() => showToast('Settings coming soon')}>
                <i className="fas fa-cog"></i> Settings
              </div>
              <div className="dropdown-item" onClick={onLogout}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 🆕 HIDDEN FILE INPUT FOR UPLOAD */}
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        accept=".js,.jsx,.ts,.tsx,.html,.css,.json,.txt,.py,.java,.cpp,.c"
        onChange={handleFileUpload}
      />

      <div className="main-container">
        {panels.sidebar && (
          <SidebarPanel 
            participants={participants}
            role={role}
            showToast={showToast}
            socket={socket}           // 🆕 Pass socket for real-time chat
            roomId={currentRoom?.id}  // 🆕 Pass room ID
            user={user}               // 🆕 Pass user for chat messages
          />
        )}

        <Editor 
          ref={editorRef}             // 🆕 Add ref for parent access
          user={user}
          role={role}
          showToast={showToast}
          socket={socket}             // 🆕 Pass socket for real-time sync
          roomId={currentRoom?.id}    // 🆕 Pass room ID
        />

        {panels.output && (
          <OutputPanel showToast={showToast} />
        )}

        {panels.video && (
          <VideoPanel 
            participants={participants}
            role={role}
            showToast={showToast}
          />
        )}
      </div>

      <div className="app-footer">
        <div className="connection-status">
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></span>
          <span>{isConnected ? 'Connected' : 'Connecting...'}</span>
          {isConnected && participants.length > 0 && (
            <span style={{ marginLeft: '8px' }}>👥 {participants.length} online</span>
          )}
        </div>
        <div className="copyright">
          &copy; 2024 CollabCode - Real-Time Collaborative Editor
        </div>
      </div>

      {showChatbot && (
        <Chatbot onClose={() => setShowChatbot(false)} />
      )}

      {showInviteModal && (
        <InviteModal 
          room={currentRoom}
          onClose={() => setShowInviteModal(false)}
          showToast={showToast}
        />
      )}
    </div>
  );
};

export default MainApp;