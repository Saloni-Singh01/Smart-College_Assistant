// components/Sidebar.jsx — Sidebar navigation
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const navItems = [
  { label: 'Main', items: [
    { path: '/dashboard', icon: 'bi-grid-fill', label: 'Dashboard' },
    { path: '/chat', icon: 'bi-chat-dots-fill', label: 'AI Chatbot' },
  ]},
  { label: 'Academic', items: [
    { path: '/timetable', icon: 'bi-calendar3', label: 'Timetable' },
    { path: '/announcements', icon: 'bi-megaphone-fill', label: 'Announcements' },
    { path: '/events', icon: 'bi-calendar-event-fill', label: 'Events' },
  ]},
  { label: 'System', items: [
    { path: '/admin', icon: 'bi-shield-fill', label: 'Admin Panel' },
  ]}
];

export default function Sidebar() {
  const { user, logout, sidebarOpen, setSidebarOpen } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ background: 'rgba(0,0,0,0.5)', zIndex: 999 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-icon">
            <i className="bi bi-mortarboard-fill"></i>
          </div>
          <h6>Smart College</h6>
          <small>Assistant 2.0</small>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map(section => (
            <div key={section.label} className="mb-3">
              <span className="nav-label">{section.label}</span>
              {section.items.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <i className={`bi ${item.icon}`}></i>
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="user-chip mb-2">
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <span>{user?.name || 'Guest'}</span>
              <small>{user?.role === 'admin' ? 'Administrator' : 'Student'}</small>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="sidebar-link w-100 border-0 text-start"
            style={{ color: '#ef4444', background: 'rgba(239,68,68,0.08)', cursor: 'pointer' }}
          >
            <i className="bi bi-box-arrow-left"></i>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
