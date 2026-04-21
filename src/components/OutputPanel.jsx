import React, { useState } from 'react';
import { FaWindowMinimize, FaTimes } from 'react-icons/fa';
import './OutputPanel.css';

const OutputPanel = ({ showToast }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [output, setOutput] = useState('// Output will appear here after running code\n// Click "Run Code" to execute your code');

  const handleClose = () => {
    setIsMinimized(true);
  };

  return (
    <div className={`output-panel ${isMinimized ? 'minimized' : ''}`}>
      <div className="panel-header">
        <h3>
          <i className="fas fa-terminal"></i> 
          Output
        </h3>
        <div className="panel-controls">
          <button className="panel-btn" onClick={() => setIsMinimized(true)} title="Minimize">
            <FaWindowMinimize />
          </button>
          <button className="panel-btn" onClick={handleClose} title="Close">
            <FaTimes />
          </button>
        </div>
      </div>

      {!isMinimized ? (
        <div className="panel-content">
          <div className="output-content-wrapper">
            <pre 
              id="output-content" 
              className="output-content"
              dangerouslySetInnerHTML={{ __html: output }}
            />
          </div>

          <iframe 
            id="output-frame" 
            className="output-frame"
            title="Output Frame"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      ) : (
        <div className="panel-icons">
          <div className="panel-icon" title="Show Output" onClick={() => setIsMinimized(false)}>
            <i className="fas fa-terminal"></i>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutputPanel;