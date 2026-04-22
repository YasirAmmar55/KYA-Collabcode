import React, { useState } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash, FaWindowMinimize, FaTimes } from 'react-icons/fa';
import './VideoPanel.css';

const VideoPanel = ({ participants, role, showToast, currentUser }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // video feeds - static for prototype
  const videoFeeds = [
    { id: currentUser?.id || 'local', name: currentUser?.name || 'You', isLocal: true, isVideoOff: isVideoOff, isMuted: isAudioMuted },
    ...participants.filter(p => p.id !== currentUser?.id).map(p => ({ id: p.id, name: p.name, isLocal: false, isVideoOff: false, isMuted: !p.permissions?.mic }))
  ].slice(0, 4);

  const toggleAudio = () => {
    setIsAudioMuted(!isAudioMuted);
    showToast(isAudioMuted ? 'Microphone unmuted ' : 'Microphone muted ');
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    showToast(isVideoOff ? 'Camera turned on ' : 'Camera turned off ');
  };

  const leaveCall = () => {
    showToast('Left video call ');
  };

  return (
    <div className={`video-panel ${isMinimized ? 'minimized' : ''}`}>
      <div className="panel-header">
        <h3><i className="fas fa-video"></i> Video Call </h3>
        <div className="panel-controls">
          <button className="panel-btn" onClick={() => setIsMinimized(true)}><FaWindowMinimize /></button>
          <button className="panel-btn" onClick={() => setIsMinimized(true)}><FaTimes /></button>
        </div>
      </div>
      {!isMinimized ? (
        <div className="panel-content">
          <div className="video-grid">
            {videoFeeds.map(feed => (
              <div key={feed.id} className="video-feed">
                {feed.isLocal ? (
                  feed.isVideoOff ? (
                    <div className="no-video"><i className="fas fa-user"></i><span>Camera off</span></div>
                  ) : (
                    <div className="no-video"><i className="fas fa-video"></i><span>Camera Preview </span></div>
                  )
                ) : (
                  <div className="no-video"><i className="fas fa-user"></i><span>Video Stream </span></div>
                )}
                <div className="participant-label">
                  <span>{feed.name}{feed.isLocal && ' (You)'}{(feed.isLocal && isAudioMuted) || (!feed.isLocal && feed.isMuted) ? <FaMicrophoneSlash className="mute-icon" /> : <FaMicrophone className="mute-icon" style={{ opacity: 0.3 }} />}</span>
                </div>
              </div>
            ))}
            {videoFeeds.length < 3 && Array(3 - videoFeeds.length).fill().map((_, i) => (
              <div key={`empty-${i}`} className="video-feed empty-feed"><div className="no-video"><i className="fas fa-user-plus"></i><span>Waiting</span></div></div>
            ))}
          </div>
          <div className="video-controls">
            <button className={`control-btn ${isAudioMuted ? 'muted' : ''}`} onClick={toggleAudio} title={isAudioMuted ? 'Unmute' : 'Mute'}>
              {isAudioMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
            </button>
            <button className={`control-btn ${isVideoOff ? 'off' : ''}`} onClick={toggleVideo} title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}>
              {isVideoOff ? <FaVideoSlash /> : <FaVideo />}
            </button>
            <button className="control-btn leave-btn" onClick={leaveCall} title="Leave video call"><FaPhoneSlash /></button>
          </div>
        </div>
      ) : (
        <div className="panel-icons">
          <div className="panel-icon" onClick={() => setIsMinimized(false)} title="Open video"><i className="fas fa-video"></i></div>
          {isAudioMuted && <div className="panel-icon muted-indicator" title="Microphone muted"><FaMicrophoneSlash /></div>}
        </div>
      )}
    </div>
  );
};

export default VideoPanel;