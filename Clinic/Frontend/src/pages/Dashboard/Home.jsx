import React, {useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import './css/Home.css';

const Home = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const handleSend = (e) => {
      e.preventDefault();
      if (!input.trim()) return;

      const userMsg = {role: 'user', text: input};
      setMessages(prev => [...prev, userMsg]);
      setInput('');

      setTimeout( () => {
        const AiReply = {role: 'ai', text: "Poda punda!"};
        setMessages(prev => [...prev, userMsg]);
      }, 3000 )
    }

    return (
          <div className="home-container">
            
            {/* 1. HERO SECTION: Only visible before the first message */}
            <AnimatePresence>
              {messages.length === 0 && (
                <motion.header 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="home-hero"
                >
                  <h1 className="greeting-text">Hi, MedHive Clinic</h1>
                  <p className="sub-greeting">Any medical assistance?</p>
                </motion.header>
              )}
            </AnimatePresence>

            {/* 2. CHAT HISTORY: Visible only after the first message */}
            <div className="chat-content">
              {messages.map((msg, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`message-row ${msg.role}`}
                >
                  {msg.role === 'ai' && <img src="/MedHiveLogo.png" className="chat-avatar" alt="AI" />}
                  <div className="message-text">{msg.text}</div>
                </motion.div>
              ))}
            </div>

            {/* 3. GEMINI-STYLE INPUT PILL */}
            <div className="input-sticky-bottom">
              <form className="input-pill" onSubmit={handleSend}>
                <input 
                  type="text" 
                  placeholder="Enter a prompt here..." 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <div className="input-actions">
                  <button type="submit" className="send-btn">
                    <img src="/icons/search.png" alt="send" />
                  </button>
                </div>
              </form>
              <p className="footer-note">
                MedHive may display inaccurate info, so double-check its responses.
              </p>
            </div>
          </div>
        );
      };

      export default Home;