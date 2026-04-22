import React, { useState, useEffect } from 'react';
import './LoadingPage.css';

const LoadingPage = () => {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  const statusMessages = [
    "Initializing AI code analysis engine...",
    "Loading syntax parsers...",
    "Preparing collaboration tools...",
    "Establishing secure connection...",
    "Compiling neural networks...",
    "Optimizing algorithms...",
    "Building AST trees...",
    "Loading machine learning models...",
    "Finalizing code analysis modules...",
    "Ready to launch!"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex(prev => {
        if (prev < statusMessages.length - 1) {
          setProgress((prev + 1) * 10);
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-page">
      <div className="loading-floating-elements">
        <div className="loading-element loading-element-1">function analyze()</div>
        <div className="loading-element loading-element-2">const matrix = []</div>
        <div className="loading-element loading-element-3">if (code.length)</div>
        <div className="loading-element loading-element-4">export default</div>
        <div className="loading-element loading-element-5">async await</div>
      </div>

      <div className="loading-container">
        <div className="loading-logo">
          <div className="loading-logo-text">CollabCode</div>
        </div>
        
        <div className="loading-tagline">
          Advanced Code Analysis & AI-Powered Collaboration Platform
        </div>
        
        <div className="loading-loader">
          <div className="loading-brackets">&lt;</div>
          <div className="loading-dots">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
          </div>
          <div className="loading-brackets">/&gt;</div>
        </div>
        
        <div className="loading-progress-container">
          <div className="loading-progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        
        <div className="loading-status-text">{statusMessages[statusIndex]}</div>
      </div>
    </div>
  );
};

export default LoadingPage;