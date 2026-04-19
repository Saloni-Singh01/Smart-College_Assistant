// pages/student/StudentAnnouncements.jsx — View-only announcements for students
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const TAGS = ['All', 'Exam', 'Placement', 'Event', 'Finance', 'General'];

export default function StudentAnnouncements() {
  const { announcements } = useApp();
  const [filterTag, setFilterTag]           = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [search, setSearch]                 = useState('');

  const filtered = announcements.filter(a => {
    const matchTag      = filterTag === 'All'      || a.tag === filterTag;
    const matchPriority = filterPriority === 'All' || a.priority === filterPriority;
    const matchSearch   = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.content.toLowerCase().includes(search.toLowerCase());
    return matchTag && matchPriority && matchSearch;
  });

  const priorityColor = { high: '#ef4444', medium: '#d97706', low: '#059669' };
  const priorityIcon  = { high: 'bi-exclamation-circle-fill', medium: 'bi-dash-circle-fill', low: 'bi-check-circle-fill' };

  return (
    <div>
      <div className="mb-4">
        <h1 className="page-title">Announcements</h1>
        <p className="page-subtitle">{announcements.length} announcements posted</p>
      </div>

      {/* Filters */}
      <div className="sca-card mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-4">
            <div style={{ position: 'relative' }}>
              <i className="bi bi-search" style={{ position: 'absolute', left: '.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '.85rem' }}></i>
              <input className="form-control" style={{ paddingLeft: '2.25rem' }} placeholder="Search announcements…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="col-md-5">
            <div className="d-flex gap-2 flex-wrap">
              {TAGS.map(t => (
                <button key={t} onClick={() => setFilterTag(t)} style={{
                  padding: '.28rem .7rem', borderRadius: 20, cursor: 'pointer',
                  border: filterTag === t ? 'none' : '1.5px solid var(--border)',
                  background: filterTag === t ? '#059669' : 'transparent',
                  color: filterTag === t ? '#fff' : 'var(--text-secondary)',
                  fontWeight: 600, fontSize: '.75rem'
                }}>{t}</button>
              ))}
            </div>
          </div>
          <div className="col-md-3">
            <select className="form-select" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
              <option value="All">All Priorities</option>
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </div>
        </div>
      </div>

      <p style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        Showing <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> of {announcements.length} announcements
      </p>

      {filtered.length === 0 ? (
        <div className="sca-card text-center py-5">
          <i className="bi bi-megaphone" style={{ fontSize: '2rem', color: 'var(--text-muted)' }}></i>
          <p style={{ color: 'var(--text-muted)', marginTop: '.75rem' }}>No announcements match your filters</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filtered.map(a => (
            <div key={a.id} className="sca-card" style={{ borderLeft: `4px solid ${a.tagColor}` }}>
              <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap">
                <div className="flex-1">
                  <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                    <span className="announcement-tag" style={{ background: `${a.tagColor}15`, color: a.tagColor }}>{a.tag}</span>
                    <span style={{ fontSize: '.72rem', fontWeight: 700, color: priorityColor[a.priority], display: 'flex', alignItems: 'center', gap: 4 }}>
                      <i className={`bi ${priorityIcon[a.priority]}`}></i>{a.priority?.toUpperCase()} PRIORITY
                    </span>
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '.5rem', color: 'var(--text-primary)' }}>{a.title}</h3>
                  <p style={{ fontSize: '.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.65 }}>{a.content}</p>
                </div>
              </div>
              <div className="divider"></div>
              <div className="d-flex align-items-center gap-3" style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>
                <span><i className="bi bi-person-circle me-1"></i>{a.author}</span>
                <span><i className="bi bi-calendar3 me-1"></i>{new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
