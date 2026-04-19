// pages/student/StudentEvents.jsx — Events with working registration
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const categoryColors = { Tech: '#2563eb', Placement: '#ff5c35', Social: '#059669', Cultural: '#7c3aed', Academic: '#d97706', Sports: '#0891b2' };
const categoryIcons  = { Tech: 'bi-cpu-fill', Placement: 'bi-briefcase-fill', Social: 'bi-heart-fill', Cultural: 'bi-music-note-beamed', Academic: 'bi-book-fill', Sports: 'bi-trophy-fill' };
const CATEGORIES = ['All', 'Tech', 'Placement', 'Social', 'Cultural', 'Academic', 'Sports'];

export default function StudentEvents() {
  const { user, events, eventRegistrations, registerForEvent, showToast } = useApp();
  const [filter, setFilter] = useState('All');

  const myRegIds = eventRegistrations.filter((r) => r.studentId === user?.id).map((r) => r.eventId);
  const filtered = filter === 'All' ? events : events.filter(e => e.category === filter);

  const handleRegister = (ev) => {
    const isReg = myRegIds.includes(ev.id);
    if (isReg) {
      registerForEvent({
        eventId: ev.id,
        eventTitle: ev.title,
        studentId: user.id,
        studentName: user.name,
        email: user.email,
        rollNo: user.rollNo || '—',
      });
      showToast(`Unregistered from "${ev.title}"`, 'info');
    } else {
      registerForEvent({
        eventId: ev.id,
        eventTitle: ev.title,
        studentId: user.id,
        studentName: user.name,
        email: user.email,
        rollNo: user.rollNo || '—',
      });
      showToast(`Registered for "${ev.title}" ✅`, 'success');
    }
  };

  return (
    <div>
      <div className="mb-4 d-flex align-items-start justify-content-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Upcoming Events</h1>
          <p className="page-subtitle mb-0">{events.length} events · {myRegIds.length} registered by you</p>
        </div>
        {myRegIds.length > 0 && (
          <div style={{ padding: '.5rem .9rem', borderRadius: 20, background: 'rgba(5,150,105,.12)', border: '1px solid rgba(5,150,105,.25)', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <i className="bi bi-check-circle-fill" style={{ color: '#059669', fontSize: '.85rem' }}></i>
            <span style={{ fontSize: '.8rem', fontWeight: 700, color: '#059669' }}>{myRegIds.length} registered</span>
          </div>
        )}
      </div>

      {/* Category filter */}
      <div className="sca-card mb-4">
        <div className="d-flex gap-2 flex-wrap align-items-center">
          <span style={{ fontSize: '.78rem', fontWeight: 600, color: 'var(--text-muted)', marginRight: '.25rem' }}>Filter:</span>
          {CATEGORIES.map(cat => {
            const color = categoryColors[cat] || '#059669';
            const isActive = filter === cat;
            return (
              <button key={cat} onClick={() => setFilter(cat)} style={{
                padding: '.32rem .85rem', borderRadius: 20, cursor: 'pointer',
                border: isActive ? 'none' : '1.5px solid var(--border)',
                background: isActive ? (cat === 'All' ? '#059669' : color) : 'transparent',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                fontWeight: 600, fontSize: '.78rem',
                display: 'flex', alignItems: 'center', gap: '.35rem'
              }}>
                {cat !== 'All' && <i className={`bi ${categoryIcons[cat]}`} style={{ fontSize: '.72rem' }}></i>}
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
          <p style={{ color: 'var(--text-muted)', marginTop: '.75rem' }}>No events in this category</p>
        </div>
      ) : (
        <div className="row g-4">
          {filtered.map(ev => {
            const color      = categoryColors[ev.category] || '#059669';
            const icon       = categoryIcons[ev.category]  || 'bi-calendar-event';
            const isReg      = myRegIds.includes(ev.id);
            return (
              <div key={ev.id} className="col-md-6 col-xl-4">
                <div className="sca-card h-100" style={{
                  borderTop: `3px solid ${color}`,
                  transition: 'transform .2s, box-shadow .2s',
                  display: 'flex', flexDirection: 'column'
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}>

                  {/* Category badge */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="sca-badge" style={{ background: `${color}15`, color, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <i className={`bi ${icon}`} style={{ fontSize: '.72rem' }}></i>{ev.category}
                    </span>
                    {isReg && (
                      <span style={{ fontSize: '.68rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <i className="bi bi-check-circle-fill"></i>Registered
                      </span>
                    )}
                  </div>

                  {/* Date + title */}
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="event-date-badge" style={{ background: color, borderRadius: 10, width: 52, height: 56, flexShrink: 0 }}>
                      <span className="day" style={{ fontSize: '1.4rem' }}>{ev.day}</span>
                      <span className="month">{ev.month}</span>
                    </div>
                    <p style={{ fontWeight: 700, fontSize: '.95rem', margin: 0, color: 'var(--text-primary)', lineHeight: 1.3 }}>{ev.title}</p>
                  </div>

                  {ev.description && (
                    <p style={{ fontSize: '.8rem', color: 'var(--text-secondary)', margin: '0 0 .75rem', lineHeight: 1.55 }}>
                      {ev.description.length > 90 ? ev.description.slice(0, 90) + '…' : ev.description}
                    </p>
                  )}

                  <div className="divider" style={{ margin: '.75rem 0' }}></div>

                  {/* Details */}
                  <div className="d-flex flex-column gap-2 mb-3 flex-1">
                    {[
                      { icon: 'bi-clock',   text: ev.time },
                      { icon: 'bi-geo-alt', text: ev.location },
                    ].map(d => (
                      <div key={d.icon} className="d-flex align-items-center gap-2">
                        <div style={{ width: 26, height: 26, borderRadius: 6, background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className={`bi ${d.icon}`} style={{ fontSize: '.72rem', color: 'var(--text-muted)' }}></i>
                        </div>
                        <span style={{ fontSize: '.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{d.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Register button — FULLY WORKING */}
                  <button
                    onClick={() => handleRegister(ev)}
                    style={{
                      width: '100%', padding: '.55rem', borderRadius: 8,
                      border: isReg ? 'none' : `1.5px solid ${color}`,
                      background: isReg ? `${color}18` : color,
                      color: isReg ? color : '#fff',
                      fontWeight: 700, fontSize: '.82rem', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem',
                      transition: 'all .2s'
                    }}
                    onMouseEnter={e => { if (!isReg) { e.currentTarget.style.filter = 'brightness(0.9)'; } }}
                    onMouseLeave={e => { e.currentTarget.style.filter = 'none'; }}
                  >
                    <i className={`bi bi-${isReg ? 'check-circle-fill' : 'calendar-plus'}`}></i>
                    {isReg ? 'Registered ✓' : 'Register Interest'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Registered events summary */}
      {myRegIds.length > 0 && (
        <div className="sca-card mt-4" style={{ borderLeft: '4px solid #059669' }}>
          <h3 style={{ fontSize: '.9rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
            <i className="bi bi-check-circle-fill me-2" style={{ color: '#059669' }}></i>Your Registered Events ({myRegIds.length})
          </h3>
          <div className="d-flex flex-wrap gap-2">
            {events.filter(e => myRegIds.includes(e.id)).map(ev => (
              <div key={ev.id} style={{ padding: '.35rem .85rem', borderRadius: 20, background: 'rgba(5,150,105,.1)', border: '1px solid rgba(5,150,105,.25)', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                <span style={{ fontSize: '.78rem', fontWeight: 600, color: '#059669' }}>{ev.title.split('—')[0].trim()}</span>
                <span style={{ fontSize: '.7rem', color: 'rgba(5,150,105,.7)' }}>{ev.day} {ev.month}</span>
                <button onClick={() => handleRegister(ev)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '.75rem', padding: 0 }} title="Unregister">
                  <i className="bi bi-x-circle"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
