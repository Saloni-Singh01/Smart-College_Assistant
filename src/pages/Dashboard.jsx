// pages/Dashboard.jsx — Main dashboard with stats, announcements, events
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { quickStats } from '../data/mockData';

function StatCard({ stat }) {
  const [count, setCount] = useState(0);
  const target = parseInt(stat.value.replace(/[^0-9]/g, '')) || 0;

  useEffect(() => {
    if (!target) return;
    let start = 0;
    const duration = 1200;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);

  const displayValue = stat.value.includes('%') ? `${count}%`
    : stat.value.includes(',') ? count.toLocaleString()
    : count;

  return (
    <div className="stat-card" style={{ '--accent-color': stat.color }}>
      <div className="stat-icon" style={{ background: stat.bg, color: stat.color }}>
        <i className={`bi ${stat.icon}`}></i>
      </div>
      <div className="stat-value">{displayValue}</div>
      <div className="stat-label">{stat.label}</div>
      <div className="stat-change" style={{ color: stat.color }}>
        <i className="bi bi-arrow-up-right me-1"></i>{stat.change}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
      <div className="skeleton" style={{ height: 12, width: '60%', marginBottom: 8 }}></div>
      <div className="skeleton" style={{ height: 10, width: '90%', marginBottom: 6 }}></div>
      <div className="skeleton" style={{ height: 10, width: '75%' }}></div>
    </div>
  );
}

export default function Dashboard() {
  const { announcements, events, user } = useApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  const priorityColor = { high: '#ef4444', medium: '#d97706', low: '#059669' };

  return (
    <div>
      {/* Page header */}
      <div className="mb-4">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Quick stats */}
      <div className="row g-3 mb-4">
        {quickStats.map((stat, i) => (
          <div key={i} className="col-6 col-xl-3">
            <StatCard stat={stat} />
          </div>
        ))}
      </div>

      {/* Main content row */}
      <div className="row g-4">
        {/* Announcements */}
        <div className="col-lg-7">
          <div className="sca-card h-100">
            <div className="sca-card-header">
              <h2 className="sca-card-title">
                <i className="bi bi-megaphone-fill me-2" style={{ color: 'var(--accent)' }}></i>
                Announcements
              </h2>
              <Link to="/announcements" style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600 }}>
                View all <i className="bi bi-arrow-right"></i>
              </Link>
            </div>

            {loading ? (
              [1,2,3].map(i => <SkeletonCard key={i} />)
            ) : (
              announcements.slice(0, 4).map(ann => (
                <div key={ann.id} className="announcement-item">
                  <div className="d-flex align-items-start justify-content-between gap-2">
                    <div className="flex-1">
                      <span
                        className="announcement-tag"
                        style={{ background: `${ann.tagColor}18`, color: ann.tagColor }}
                      >
                        {ann.tag}
                      </span>
                      <p style={{ fontWeight: 600, fontSize: '0.875rem', margin: '0.25rem 0', color: 'var(--text-primary)' }}>
                        {ann.title}
                      </p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                        {ann.content.slice(0, 100)}...
                      </p>
                    </div>
                    <div
                      className="sca-badge flex-shrink-0"
                      style={{
                        background: `${priorityColor[ann.priority]}18`,
                        color: priorityColor[ann.priority]
                      }}
                    >
                      {ann.priority}
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2 mt-2">
                    <i className="bi bi-person-circle" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}></i>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{ann.author}</span>
                    <span style={{ color: 'var(--border)' }}>·</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {new Date(ann.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="col-lg-5">
          {/* Events */}
          <div className="sca-card mb-4">
            <div className="sca-card-header">
              <h2 className="sca-card-title">
                <i className="bi bi-calendar-event-fill me-2" style={{ color: '#2563eb' }}></i>
                Upcoming Events
              </h2>
              <Link to="/events" style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600 }}>
                All <i className="bi bi-arrow-right"></i>
              </Link>
            </div>

            {loading ? (
              [1,2].map(i => <SkeletonCard key={i} />)
            ) : (
              events.slice(0, 3).map(ev => (
                <div key={ev.id} className="event-card">
                  <div className="event-date-badge">
                    <span className="day">{ev.day}</span>
                    <span className="month">{ev.month}</span>
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.85rem', margin: 0, color: 'var(--text-primary)' }}>
                      {ev.title}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                      <i className="bi bi-clock me-1"></i>{ev.time} · {ev.location}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick actions */}
          <div className="sca-card">
            <h2 className="sca-card-title mb-3">
              <i className="bi bi-lightning-fill me-2" style={{ color: '#d97706' }}></i>
              Quick Actions
            </h2>
            <div className="row g-2">
              {[
                { label: 'AI Chatbot', icon: 'bi-robot', path: '/chat', color: 'var(--accent)' },
                { label: 'Timetable', icon: 'bi-calendar3', path: '/timetable', color: '#2563eb' },
                { label: 'Announcements', icon: 'bi-megaphone', path: '/announcements', color: '#059669' },
                { label: 'Admin Panel', icon: 'bi-shield', path: '/admin', color: '#7c3aed' },
              ].map(action => (
                <div key={action.label} className="col-6">
                  <Link
                    to={action.path}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      padding: '1rem 0.5rem', borderRadius: 10, textDecoration: 'none',
                      background: 'var(--bg-primary)', border: '1px solid var(--border)',
                      gap: '0.4rem', transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = action.color}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    <i className={`bi ${action.icon}`} style={{ fontSize: '1.2rem', color: action.color }}></i>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{action.label}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
