import React, { useState, useEffect, useRef } from 'react';
import { FaWindowMinimize, FaTimes, FaPaperPlane, FaUsers, FaComment, FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaCode, FaDesktop, FaUserMinus, FaCheck, FaVolumeUp, FaVolumeMute, FaCrown, FaCircle, FaChevronDown, FaRegSmile } from 'react-icons/fa';
import './SidebarPanel.css';

const SidebarPanel = ({ role, showToast, user, participants }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState('participants');
  const [messages, setMessages] = useState([{ id: 1, sender: 'System', content: 'Welcome to the chat!', time: new Date().toLocaleTimeString(), isOwn: false }]);
  const [newMessage, setNewMessage] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const isHost = role === 'teacher' || role === 'host';

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, {
      id: messages.length + 1,
      sender: user?.name || 'You',
      content: newMessage,
      time: new Date().toLocaleTimeString(),
      isOwn: true
    }]);
    setNewMessage('');
  };

  const handleKeyPress = (e) => { if (e.key === 'Enter') sendMessage(); };
  const insertEmoji = (emoji) => { setNewMessage(prev => prev + emoji); setShowEmojiPicker(false); };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) setShowEmojiPicker(false);
      if (openDropdownId !== null) {
        const dropdown = document.querySelector('.permission-dropdown');
        const trigger = event.target.closest('.permission-btn');
        if (dropdown && !dropdown.contains(event.target) && !trigger) setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdownId]);

  const onlineCount = participants?.filter(p => p.isOnline !== false).length || 0;

  return (
    <div className={`sidebar-panel ${isMinimized ? 'minimized' : ''}`} style={{ width: isMinimized ? 56 : 280 }}>
      <div className="panel-header">
        <h3><FaUsers /> Collaboration</h3>
        <div className="panel-controls">
          <button className="panel-btn" onClick={() => setIsMinimized(true)}><FaWindowMinimize /></button>
          <button className="panel-btn"><FaTimes /></button>
        </div>
      </div>
      {!isMinimized ? (
        <>
          <div className="panel-tabs">
            <div className={`tab ${activeTab === 'participants' ? 'active' : ''}`} onClick={() => setActiveTab('participants')}>
              <FaUsers /> Participants <span className="count">{onlineCount}</span>
            </div>
            <div className={`tab ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
              <FaComment /> Chat
            </div>
          </div>
          <div className="tab-content">
            {activeTab === 'participants' && (
              <div className="participants-scroll">
                {isHost && (
                  <div className="section-header">
                    <h4>Manage Session</h4>
                    <div className="action-buttons">
                      <button className="action-btn" onClick={() => showToast('Mute all')}><FaVolumeMute size={10} /> Mute All</button>
                      <button className="action-btn" onClick={() => showToast('Unmute all')}><FaVolumeUp size={10} /> Unmute All</button>
                    </div>
                  </div>
                )}
                <div className="participants-list">
                  {participants?.map(p => (
                    <div key={p.id} className="participant-item">
                      <div className="avatar">
                        {p.avatar || p.name?.charAt(0).toUpperCase() || 'U'}
                        <div className={`status-dot ${p.isOnline !== false ? 'online' : 'offline'}`} />
                      </div>
                      <div className="participant-info">
                        <div className="participant-name">
                          {p.name}
                          {p.role === 'host' && <span className="host-badge"><FaCrown size={8} /> Host</span>}
                          {p.id === user?.id && <span className="you-badge">(You)</span>}
                        </div>
                        <div className="participant-status"><FaCircle size={5} className={p.isOnline !== false ? 'online' : 'offline'} /> {p.isOnline !== false ? 'Active' : 'Offline'}</div>
                      </div>
                      {isHost && p.role !== 'host' && (
                        <button className="permission-btn" onClick={() => setOpenDropdownId(openDropdownId === p.id ? null : p.id)}>
                          3/4 <FaChevronDown size={8} />
                        </button>
                      )}
                      {openDropdownId === p.id && isHost && p.role !== 'host' && (
                        <div className="permission-dropdown">
                          <div className="dropdown-header"><span>Permissions</span><button onClick={() => setOpenDropdownId(null)}><FaTimes size={10} /></button></div>
                          <div className="permission-row" onClick={() => showToast('Toggle microphone permission')}>
                            <div className="permission-info"><FaMicrophone /><span>Microphone</span></div>
                            <div className="permission-status enabled"><FaCheck size={10} /></div>
                          </div>
                          <div className="permission-row" onClick={() => showToast('Toggle camera permission')}>
                            <div className="permission-info"><FaVideo /><span>Camera</span></div>
                            <div className="permission-status disabled"><FaTimes size={10} /></div>
                          </div>
                          <div className="dropdown-divider" />
                          <div className="remove-action" onClick={() => showToast('Remove participant')}>
                            <span>Remove Participant</span><FaUserMinus size={12} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'chat' && (
              <div className="chat-panel">
                <div className="chat-messages">
                  {messages.map(msg => (
                    <div key={msg.id} className={`message ${msg.isOwn ? 'sent' : 'received'}`}>
                      <div className="message-sender">{msg.sender}</div>
                      <div className="message-content">{msg.content}</div>
                      <div className="message-time">{msg.time}</div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="chat-input">
                  <div className="input-wrapper">
                    <button className="emoji-btn" onClick={() => setShowEmojiPicker(!showEmojiPicker)}><FaRegSmile /></button>
                    {showEmojiPicker && (<div className="emoji-picker" ref={emojiPickerRef}>{[ '😀','😂','😊','😍','🎉','👍','❤️','🔥','🚀','✨','💡','🎨','💻','📚' ].map(e => <button key={e} onClick={() => insertEmoji(e)}>{e}</button>)}</div>)}
                    <input type="text" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={handleKeyPress} />
                    <button className={`send-btn ${newMessage.trim() ? 'active' : ''}`} onClick={sendMessage} disabled={!newMessage.trim()}><FaPaperPlane /></button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="minimized-icons">
          <div className="minimized-icon" onClick={() => { setIsMinimized(false); setActiveTab('participants'); }}><FaUsers /><span>{onlineCount}</span></div>
          <div className="minimized-icon" onClick={() => { setIsMinimized(false); setActiveTab('chat'); }}><FaComment /><span>Chat</span></div>
        </div>
      )}
    </div>
  );
};

export default SidebarPanel;