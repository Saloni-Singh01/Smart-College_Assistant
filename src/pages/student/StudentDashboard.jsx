// pages/student/StudentDashboard.jsx — Student home dashboard
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { timetableData } from '../../data/mockData';

function StatCard({ label, value, icon, color, bg, link }) {
  const [count, setCount] = useState(0);
  const target = parseInt(String(value).replace(/\D/g, '')) || 0;
  useEffect(() => {
    let s = 0;
    const t = setInterval(() => { s += Math.ceil(target / 40); if (s >= target) { setCount(target); clearInterval(t); } else setCount(s); }, 30);
    return () => clearInterval(t);
  }, [target]);
  const display = String(value).includes('%') ? `${count}%` : String(value).includes('.') ? value : count;
  return (
    <div className="stat-card" style={{ '--accent-color': color }}>
      <div className="stat-icon" style={{ background: bg, color }}><i className={`bi ${icon}`}></i></div>
      <div className="stat-value">{display}</div>
      <div className="stat-label">{label}</div>
      {link && <Link to={link} style={{ fontSize: '.72rem', color, fontWeight: 600, marginTop: '.4rem', display: 'block', textDecoration: 'none' }}>View details →</Link>}
    </div>
  );
}

export default function StudentDashboard() {
  const { user, announcements, events, quizzes, results, eventRegistrations } = useApp();
  const myEventCount = eventRegistrations.filter((r) => r.studentId === user?.id).length;

  const myResults  = results.filter(r => r.studentId === user?.id || r.studentName === user?.name);
  const avgScore   = myResults.length ? Math.round(myResults.reduce((s, r) => s + (r.marks / r.total) * 100, 0) / myResults.length) : 0;
  const todayDay   = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayClasses = timetableData[todayDay] || [];
  const activeQuizzes = quizzes.filter(q => q.status === 'active');

  const qlinks = [
    { to: '/student/chat',          icon: 'bi-robot',              label: 'AI Chatbot',     color: '#ff5c35' },
    { to: '/student/timetable',     icon: 'bi-calendar3',          label: 'Timetable',      color: '#2563eb' },
    { to: '/student/events',        icon: 'bi-calendar-event-fill',label: 'Events',         color: '#059669' },
    { to: '/student/quizzes',       icon: 'bi-patch-question-fill', label: 'Quizzes',     color: '#d97706' },
    { to: '/student/results',       icon: 'bi-bar-chart-fill',     label: 'My Results',     color: '#7c3aed' },
  ];

  return (
    <div>
      <div className="mb-4">
        <h1 className="page-title">
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'},{' '}
          {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="page-subtitle">{user?.dept} · {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3">
          <StatCard label="My Results"      value={myResults.length}       icon="bi-clipboard-check"      color="#2563eb" bg="rgba(37,99,235,.12)"  link="/student/results" />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard label="Average Score"   value={avgScore ? `${avgScore}%` : '—'} icon="bi-bar-chart-fill" color="#059669" bg="rgba(5,150,105,.12)"  link="/student/results" />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard label="Active Quizzes"  value={activeQuizzes.length}   icon="bi-patch-question-fill"  color="#d97706" bg="rgba(217,119,6,.12)"   link="/student/quizzes" />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard label="Registered Events" value={myEventCount} icon="bi-calendar-check-fill" color="#7c3aed" bg="rgba(124,58,237,.12)" link="/student/events" />
        </div>
      </div>

      <div className="row g-4">
        {/* Left col */}
        <div className="col-lg-7">
          {/* Today's classes */}
          <div className="sca-card mb-4">
            <div className="sca-card-header">
              <h2 className="sca-card-title"><i className="bi bi-calendar3 me-2" style={{ color: '#2563eb' }}></i>Today's Classes — {todayDay}</h2>
              <Link to="/student/timetable" style={{ fontSize: '.8rem', fontWeight: 600 }}>Full Timetable →</Link>
            </div>
            {todayClasses.length === 0 ? (
              <div className="text-center py-3">
                <i className="bi bi-cup-hot" style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}></i>
                <p style={{ color: 'var(--text-muted)', margin: '.5rem 0 0', fontSize: '.875rem' }}>No classes today! Enjoy your day 🎉</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {todayClasses.map((cls, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '.85rem', padding: '.65rem .85rem', borderRadius: 8, background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--text-muted)', width: 75, flexShrink: 0 }}>{cls.time}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: '.82rem', margin: 0 }}>{cls.subject}</p>
                      <p style={{ fontSize: '.7rem', color: 'var(--text-muted)', margin: 0 }}>{cls.faculty} · {cls.room}</p>
                    </div>
                    <span style={{ padding: '.2rem .55rem', borderRadius: 6, background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: '.68rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{cls.room}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Announcements */}
          <div className="sca-card">
            <div className="sca-card-header">
              <h2 className="sca-card-title"><i className="bi bi-megaphone-fill me-2" style={{ color: '#ff5c35' }}></i>Latest Announcements</h2>
              <Link to="/student/announcements" style={{ fontSize: '.8rem', fontWeight: 600 }}>View all →</Link>
            </div>
            {announcements.slice(0, 3).map(a => (
              <div key={a.id} className="announcement-item">
                <span className="announcement-tag" style={{ background: `${a.tagColor}18`, color: a.tagColor }}>{a.tag}</span>
                <p style={{ fontWeight: 600, fontSize: '.875rem', margin: '.2rem 0', color: 'var(--text-primary)' }}>{a.title}</p>
                <p style={{ fontSize: '.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{a.content.slice(0, 100)}…</p>
                <p style={{ fontSize: '.7rem', color: 'var(--text-muted)', margin: '.3rem 0 0' }}>{a.author} · {a.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right col */}
        <div className="col-lg-5">
          {/* Quick links */}
          <div className="sca-card mb-4">
            <h2 className="sca-card-title mb-3"><i className="bi bi-lightning-fill me-2" style={{ color: '#d97706' }}></i>Quick Access</h2>
            <div className="row g-2">
              {qlinks.map(q => (
                <div key={q.to} className="col-6">
                  <Link to={q.to} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '.85rem .5rem', borderRadius: 10, textDecoration: 'none', background: 'var(--bg-primary)', border: '1px solid var(--border)', gap: '.4rem', transition: 'all .2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = q.color; e.currentTarget.style.background = `${q.color}08`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-primary)'; }}>
                    <i className={`bi ${q.icon}`} style={{ fontSize: '1.2rem', color: q.color }}></i>
                    <span style={{ fontSize: '.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{q.label}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming events */}
          <div className="sca-card mb-4">
            <div className="sca-card-header">
              <h2 className="sca-card-title"><i className="bi bi-calendar-event-fill me-2" style={{ color: '#059669' }}></i>Upcoming Events</h2>
              <Link to="/student/events" style={{ fontSize: '.8rem', fontWeight: 600 }}>Register →</Link>
            </div>
            {events.slice(0, 3).map(ev => (
              <div key={ev.id} className="event-card">
                <div className="event-date-badge" style={{ background: '#059669', borderRadius: 8 }}>
                  <span className="day">{ev.day}</span>
                  <span className="month">{ev.month}</span>
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '.82rem', margin: 0 }}>{ev.title}</p>
                  <p style={{ fontSize: '.72rem', color: 'var(--text-muted)', margin: '.15rem 0 0' }}><i className="bi bi-clock me-1"></i>{ev.time} · {ev.location}</p>
                  {eventRegistrations.some((r) => r.studentId === user?.id && r.eventId === ev.id) && (
                    <span style={{ fontSize: '.65rem', color: '#059669', fontWeight: 700 }}><i className="bi bi-check-circle-fill me-1"></i>Registered</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Active quizzes */}
          <div className="sca-card">
            <div className="sca-card-header">
              <h2 className="sca-card-title"><i className="bi bi-patch-question-fill me-2" style={{ color: '#d97706' }}></i>Active Quizzes</h2>
            </div>
            {activeQuizzes.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '.875rem' }}>No active quizzes right now.</p>
            ) : (
              activeQuizzes.map(q => (
                <div key={q.id} style={{ padding: '.65rem 0', borderBottom: '1px solid var(--border)' }}>
                  <p style={{ fontWeight: 600, fontSize: '.82rem', margin: 0 }}>{q.title}</p>
                  <p style={{ fontSize: '.72rem', color: 'var(--text-muted)', margin: '.1rem 0 0' }}>
                    {q.subject} · {q.questions} Qs · Due: {q.dueDate}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
