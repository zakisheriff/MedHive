// Home.jsx (UPDATED / COMPLETE)
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./css/Home.css";

const Home = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const hasStarted = messages.length > 0;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

const handleSend = async (e) => {
  e.preventDefault();
  if (!input.trim()) return;

  const currentMessage = input;

  const userMsg = { role: "user", text: currentMessage };

  // Build the history snapshot BEFORE setMessages (because state updates are async)
  const historyToSend = [...messages, userMsg].slice(-8);

  setMessages((prev) => [...prev, userMsg]);
  setInput("");
  setIsTyping(true);

  try {
    const response = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: currentMessage,
        history: historyToSend,
      }),
    });

   //Always parse JSON (even for 429/503)
    const data = await response.json().catch(() => ({}));

    // If server sends a reply on errors, show it
    if (!response.ok) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.reply || "Temporary error. Please try again." },
      ]);
      return;
    }

    setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
  } catch (error) {
    console.error("Chat Error:", error);
    setMessages((prev) => [
      ...prev,
      {
        role: "ai",
        text: "I’m having trouble connecting right now. Please try again.",
      },
    ]);
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
            {msg.role === "ai" && (
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

      <div className={`input-sticky-bottom ${hasStarted ? "has-started" : ""}`}>
        <form className="input-pill" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Enter a prompt here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
          />
          <button
            type="submit"
            className="send-btn"
            disabled={isTyping || !input.trim()}
          >
            <img
              src="/icons/send.png"
              alt="send"
              className={input.length > 0 ? "active" : ""}
            />
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