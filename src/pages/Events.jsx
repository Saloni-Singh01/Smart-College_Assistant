// pages/Events.jsx — Upcoming college events
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const categoryColors = {
  Tech: '#2563eb',
  Placement: '#ff5c35',
  Social: '#059669',
  Cultural: '#7c3aed'
};

const categoryIcons = {
  Tech: 'bi-cpu-fill',
  Placement: 'bi-briefcase-fill',
  Social: 'bi-heart-fill',
  Cultural: 'bi-music-note-beamed'
};

const CATEGORIES = ['All', 'Tech', 'Placement', 'Social', 'Cultural'];

export default function Events() {
  const { events } = useApp();
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? events : events.filter(e => e.category === filter);

  return (
    <div>
      <div className="mb-4">
        <h1 className="page-title">Upcoming Events</h1>
        <p className="page-subtitle">{events.length} events this semester</p>
      </div>

      {/* Category filter */}
      <div className="sca-card mb-4">
        <div className="d-flex gap-2 flex-wrap align-items-center">
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginRight: '0.25rem' }}>
            Filter by:
          </span>
          {CATEGORIES.map(cat => {
            const color = categoryColors[cat] || 'var(--accent)';
            const isActive = filter === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  padding: '0.35rem 0.9rem',
                  borderRadius: 20,
                  border: isActive ? 'none' : `1.5px solid var(--border)`,
                  background: isActive ? (cat === 'All' ? 'var(--accent)' : color) : 'transparent',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                {cat !== 'All' && <i className={`bi ${categoryIcons[cat]}`} style={{ fontSize: '0.75rem' }}></i>}
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events grid */}
      {filtered.length === 0 ? (
        <div className="sca-card text-center py-5">
          <i className="bi bi-calendar-x" style={{ fontSize: '2rem', color: 'var(--text-muted)' }}></i>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem' }}>No events in this category</p>
        </div>
      ) : (
        <div className="row g-4">
          {filtered.map(ev => {
            const color = categoryColors[ev.category] || '#9aa0b4';
            const icon = categoryIcons[ev.category] || 'bi-calendar-event';
            return (
              <div key={ev.id} className="col-md-6 col-xl-4">
                <div
                  className="sca-card h-100"
                  style={{
                    borderTop: `3px solid ${color}`,
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow)';
                  }}
                >
                  {/* Category badge */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span
                      className="sca-badge"
                      style={{ background: `${color}15`, color, display: 'flex', alignItems: 'center', gap: 5 }}
                    >
                      <i className={`bi ${icon}`} style={{ fontSize: '0.75rem' }}></i>
                      {ev.category}
                    </span>
                    <div
                      style={{
                        width: 36, height: 36, borderRadius: 8,
                        background: `${color}15`, display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: '1rem', color
                      }}
                    >
                      <i className={`bi ${icon}`}></i>
                    </div>
                  </div>

                  {/* Date badge */}
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div
                      className="event-date-badge"
                      style={{ background: color, borderRadius: 10, width: 52, height: 56 }}
                    >
                      <span className="day" style={{ fontSize: '1.4rem' }}>{ev.day}</span>
                      <span className="month">{ev.month}</span>
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '1rem', margin: 0, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                        {ev.title}
                      </p>
                    </div>
                  </div>

                  <div className="divider"></div>

                  {/* Details */}
                  <div className="d-flex flex-column gap-2">
                    <div className="d-flex align-items-center gap-2">
                      <div style={{
                        width: 26, height: 26, borderRadius: 6,
                        background: 'var(--bg-primary)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center'
                      }}>
                        <i className="bi bi-clock" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}></i>
                      </div>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                        {ev.time}
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <div style={{
                        width: 26, height: 26, borderRadius: 6,
                        background: 'var(--bg-primary)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center'
                      }}>
                        <i className="bi bi-geo-alt" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}></i>
                      </div>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                        {ev.location}
                      </span>
                    </div>
                  </div>

                  {/* Register button */}
                  <button
                    style={{
                      marginTop: '1rem',
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: 8,
                      border: `1.5px solid ${color}`,
                      background: 'transparent',
                      color: color,
                      fontWeight: 600,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = color;
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = color;
                    }}
                  >
                    <i className="bi bi-calendar-check me-2"></i>Register Interest
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Calendar hint */}
      <div className="sca-card mt-4" style={{ borderLeft: '4px solid var(--accent-2, #2563eb)' }}>
        <div className="d-flex align-items-center gap-3">
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            background: 'rgba(37,99,235,0.1)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: '#2563eb', fontSize: '1.2rem', flexShrink: 0
          }}>
            <i className="bi bi-info-circle-fill"></i>
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.875rem', margin: 0, color: 'var(--text-primary)' }}>
              Stay Updated
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0' }}>
              Check the Announcements board regularly for event updates, venue changes, and registration deadlines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
