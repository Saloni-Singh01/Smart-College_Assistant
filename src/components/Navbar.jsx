// components/Navbar.jsx — Top navigation bar
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/chat': 'AI Chatbot — Aria',
  '/timetable': 'Timetable',
  '/announcements': 'Announcements',
  '/events': 'Events',
  '/admin': 'Admin Panel',
};

export default function Navbar() {
  const { theme, toggleTheme, setSidebarOpen, user } = useApp();
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Smart College';

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="top-navbar">
      <div className="d-flex align-items-center gap-3">
        {/* Mobile hamburger */}
        <button
          className="d-md-none border-0 bg-transparent"
          style={{ color: 'var(--text-primary)', fontSize: '1.25rem', cursor: 'pointer' }}
          onClick={() => setSidebarOpen(true)}
        >
          <i className="bi bi-list"></i>
        </button>

        <div>
          <p className="navbar-title mb-0">{title}</p>
          <small style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
            {greeting()}, {user?.name?.split(' ')[0] || 'Student'} 👋
          </small>
        </div>
      </div>

      <div className="navbar-right">
        {/* Notifications */}
        <button
          className="theme-toggle position-relative"
          title="Notifications"
          style={{ cursor: 'pointer' }}
        >
          <i className="bi bi-bell"></i>
          <span
            className="position-absolute"
            style={{
              top: 6, right: 6, width: 7, height: 7,
              background: 'var(--accent)', borderRadius: '50%',
              border: '1.5px solid var(--bg-secondary)'
            }}
          />
        </button>

        {/* Theme toggle */}
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          <i className={`bi bi-${theme === 'light' ? 'moon-fill' : 'sun-fill'}`}></i>
        </button>

        {/* Avatar */}
        <div
          className="user-avatar"
          style={{ width: 34, height: 34, fontSize: '0.8rem', cursor: 'pointer' }}
          title={user?.name}
        >
          {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
}
