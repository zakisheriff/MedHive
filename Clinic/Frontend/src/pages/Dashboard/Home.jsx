import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './css/Home.css';

const Home = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  const hasStarted = messages.length > 0;

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // ADDED 'async' here
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Capture the input BEFORE clearing state
    const currentMessage = input; 
    
    const userMsg = { role: 'user', text: currentMessage };
    setMessages(prev => [...prev, userMsg]);
    
    setInput(''); // Clear the input box
    setIsTyping(true); // Start loading animation

    try {
      // 2. Send 'currentMessage' (not the empty 'input')
      const response = await fetch('http://localhost:5000/api/chat', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentMessage }), 
      });

      if (!response.ok) throw new Error("API Error");

      const data = await response.json();

      const aiReply = { role: 'ai', text: data.reply };
      setMessages(prev => [...prev, aiReply]);

    } catch (error) {
      console.error("Chat Error:", error);
      const errorReply = { 
        role: 'ai', 
        text: "I'm sorry, I'm having trouble connecting to the MedHive server. Please try again later." 
      };
      setMessages(prev => [...prev, errorReply]);
    } finally {
      setIsTyping(false);
    }
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
        <div ref={messagesEndRef} />
      </div>

      <div className={`input-sticky-bottom ${hasStarted ? 'has-started' : ''}`}>
        <form className="input-pill" onSubmit={handleSend}>
          <input 
            type="text" 
            placeholder="Enter a prompt here..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
          />
          <button type="submit" className="send-btn" disabled={isTyping || !input.trim()}>
            <img src="/icons/send.png" alt="send" className={input.length > 0 ? 'active' : ''} />
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