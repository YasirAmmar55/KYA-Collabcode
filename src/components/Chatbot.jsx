import React, { useState } from 'react';
import { FaRobot, FaTimes, FaQuestionCircle } from 'react-icons/fa';
import './Chatbot.css';

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const faqs = [
    { question: "How to use CollabCode?", answer: "CollabCode is a collaborative coding platform. You can create or join rooms, write code together, use video calls, and chat with team members." },
    { question: "How to create a room?", answer: "As a teacher, log in and select 'Teacher' role. Then fill in room details and permissions, and click 'Create Room'." },
    { question: "How to share code?", answer: "Code is automatically shared in real-time when you're in a room. All participants can see and edit code based on permissions." },
    { question: "How to use video call?", answer: "Click the video icon in the top panel to open video call. Use the controls at the bottom to manage audio/video and screen sharing." },
    { question: "How to run code?", answer: "Write your code in the editor and click the 'Run Code' button. Output will appear in the right panel. For HTML, it renders in an iframe." },
    { question: "Supported languages?", answer: "Currently supports JavaScript, TypeScript, HTML, CSS, Python, Java, C++, and C# with syntax highlighting and IntelliSense." },
    { question: "How to invite others?", answer: "Click the 'Invite' button in the header to get a room code and share link. You can share via WhatsApp, email, or copy link." },
    { question: "What are permissions?", answer: "Teachers can set permissions for students: edit code, view only, use microphone, use camera, share screen, and download code." }
  ];

  const handleSendMessage = (question) => {
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: question,
      sender: 'user'
    };
    setMessages(prev => [...prev, userMessage]);

    // Find answer
    const faq = faqs.find(f => f.question.toLowerCase() === question.toLowerCase());
    const answer = faq ? faq.answer : "I'm sorry, I don't have an answer for that question. Please try asking something else or contact support.";

    // Add bot response after delay
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: answer,
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      handleSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="chatbot-modal">
      <div className="chatbot-header">
        <h3>
          <FaRobot /> AI Assistant
        </h3>
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      <div className="chatbot-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            <div className="message-content">{msg.text}</div>
          </div>
        ))}
      </div>

      <div className="chatbot-faqs">
        <div className="faq-title">
          <FaQuestionCircle /> Suggested Questions:
        </div>
        <div className="faq-list">
          {faqs.slice(0, 4).map((faq, index) => (
            <button
              key={index}
              className="faq-btn"
              onClick={() => handleSendMessage(faq.question)}
            >
              {faq.question}
            </button>
          ))}
        </div>
      </div>

      <div className="chatbot-input">
        <input
          type="text"
          placeholder="Type your question..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button 
          className="btn btn-primary"
          onClick={() => {
            if (inputValue.trim()) {
              handleSendMessage(inputValue);
              setInputValue('');
            }
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;