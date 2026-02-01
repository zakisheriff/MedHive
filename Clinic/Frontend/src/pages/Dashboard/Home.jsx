import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './css/Home.css';

const Home = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const hasStarted = messages.length > 0;

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    
    // Trigger Gemini-style loading state
    setIsTyping(true);

    setTimeout(() => {
      const aiReply = { role: 'ai', text: "Faaaahhhhhhh" };
      setMessages(prev => [...prev, aiReply]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="home-container">
      <AnimatePresence>
        {messages.length === 0 && (
          <motion.header 
            exit={{ opacity: 0, y: -20 }}
            className="home-hero"
          >
            <h1 className="greeting-text">Hi, MedHive Clinic</h1>
            <p className="sub-greeting">Any medical assistance?</p>
          </motion.header>
        )}
      </AnimatePresence>

      <div className="chat-content">
        {messages.map((msg, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`message-row ${msg.role}`}
          >
            {msg.role === 'ai' && (
              <div className="avatar-container">
                <img src="/MedHiveLogo.png" className="chat-avatar" alt="AI" />
              </div>
            )}
            <div className="message-text">{msg.text}</div>
          </motion.div>
        ))}
        
        {/* Gemini-style Loading State */}
        {isTyping && (
          <div className="message-row ai">
            <div className="avatar-container loading">
              <img src="/MedHiveLogo.png" className="chat-avatar" alt="AI" />
            </div>
            <div className="loading-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
      </div>

      <div className={`input-sticky-bottom ${hasStarted ? 'has-started' : ''}`}>
        <form className="input-pill" onSubmit={handleSend}>
          <input 
            type="text" 
            placeholder="Enter a prompt here..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className={"send-btn"}>
            <img src="/icons/send.png" alt="send" className={input.length > 0? 'active' : ''} />
          </button>
        </form>
        <p className="footer-note">
          MedHive may display inaccurate info, so double-check its responses.
        </p>
      </div>
    </div>
  );
};

export default Home;