// pages/Chat.jsx — AI Chatbot interface
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const QUICK_REPLIES = ['Admission', 'Fees', 'Courses', 'Placement', 'Hostel', 'Scholarship'];

function ChatMessage({ msg }) {
  const isBot = msg.from === 'bot';

  return (
    <div className={`msg-row ${isBot ? 'bot' : 'user'}`}>
      {isBot && (
        <div className="bot-avatar" style={{ width: 30, height: 30, fontSize: '0.85rem', flexShrink: 0 }}>
          <i className="bi bi-robot"></i>
        </div>
      )}
      <div>
        <div className={`msg-bubble ${isBot ? 'bot' : 'user'}`}>
          {msg.text.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line.replace(/\*\*(.*?)\*\*/g, '$1')}
              {i < msg.text.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
        <div className="msg-time">{msg.time}</div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="msg-row bot">
      <div className="bot-avatar" style={{ width: 30, height: 30, fontSize: '0.85rem', flexShrink: 0 }}>
        <i className="bi bi-robot"></i>
      </div>
      <div className="msg-bubble bot" style={{ padding: '0.6rem 0.75rem' }}>
        <div className="typing-indicator">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
        </div>
      </div>
    </div>
  );
}

export default function Chat() {
  const { messages, sendMessage } = useApp();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setIsTyping(true);
    sendMessage(msg);
    setTimeout(() => setIsTyping(false), 1250);
    inputRef.current?.focus();
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="page-title">AI Chatbot — Aria</h1>
        <p className="page-subtitle">Ask anything about admissions, fees, courses, events, and more</p>
      </div>

      <div className="chat-layout">
        {/* Chat header */}
        <div className="chat-header">
          <div className="bot-avatar">
            <i className="bi bi-robot"></i>
          </div>
          <div>
            <p style={{ fontWeight: 700, margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Aria</p>
            <p style={{ fontSize: '0.72rem', color: '#059669', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, background: '#059669', borderRadius: '50%', display: 'inline-block' }}></span>
              Online · College AI Assistant
            </p>
          </div>
          <div className="ms-auto d-flex gap-2">
            <button
              className="theme-toggle"
              onClick={() => window.location.reload()}
              title="Clear chat"
              style={{ fontSize: '0.85rem' }}
            >
              <i className="bi bi-arrow-counterclockwise"></i>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map(msg => (
            <ChatMessage key={msg.id} msg={msg} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={bottomRef}></div>
        </div>

        {/* Quick replies */}
        <div className="quick-replies">
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginRight: '0.25rem' }}>
            Quick ask:
          </span>
          {QUICK_REPLIES.map(qr => (
            <button key={qr} className="quick-reply-btn" onClick={() => handleSend(qr)}>
              {qr}
            </button>
          ))}
        </div>

        {/* Input area */}
        <div className="chat-input-area">
          <input
            ref={inputRef}
            className="chat-input"
            placeholder="Ask about admissions, fees, courses..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
          <button className="send-btn" onClick={() => handleSend()}>
            <i className="bi bi-send-fill" style={{ fontSize: '0.85rem' }}></i>
          </button>
        </div>
      </div>
    </div>
  );
}
