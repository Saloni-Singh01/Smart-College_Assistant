// pages/Announcements.jsx — Full announcements list
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const TAGS = ['All', 'Exam', 'Placement', 'Event', 'Finance', 'General'];
const PRIORITIES = ['All', 'high', 'medium', 'low'];

export default function Announcements() {
  const { announcements } = useApp();
  const [filterTag, setFilterTag] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = announcements.filter(ann => {
    const matchTag = filterTag === 'All' || ann.tag === filterTag;
    const matchPriority = filterPriority === 'All' || ann.priority === filterPriority;
    const matchSearch = !search ||
      ann.title.toLowerCase().includes(search.toLowerCase()) ||
      ann.content.toLowerCase().includes(search.toLowerCase());
    return matchTag && matchPriority && matchSearch;
  });

  const priorityColor = { high: '#ef4444', medium: '#d97706', low: '#059669' };
  const priorityIcon = { high: 'bi-exclamation-circle-fill', medium: 'bi-dash-circle-fill', low: 'bi-check-circle-fill' };

  return (
    <div>
      <div className="mb-4">
        <h1 className="page-title">Announcements</h1>
        <p className="page-subtitle">{announcements.length} total announcements</p>
      </div>

      {/* Filters */}
      <div className="sca-card mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-4">
            <div style={{ position: 'relative' }}>
              <i className="bi bi-search" style={{
                position: 'absolute', left: '0.75rem', top: '50%',
                transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.85rem'
              }}></i>
              <input
                className="form-control"
                style={{ paddingLeft: '2.25rem' }}
                placeholder="Search announcements..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-5">
            <div className="d-flex gap-2 flex-wrap">
              {TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(tag)}
                  style={{
                    padding: '0.3rem 0.75rem', borderRadius: 20, cursor: 'pointer',
                    border: filterTag === tag ? 'none' : '1.5px solid var(--border)',
                    background: filterTag === tag ? 'var(--accent)' : 'transparent',
                    color: filterTag === tag ? '#fff' : 'var(--text-secondary)',
                    fontWeight: 600, fontSize: '0.75rem'
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <div className="col-md-3">
            <select className="form-select" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
              {PRIORITIES.map(p => (
                <option key={p} value={p}>{p === 'All' ? 'All Priorities' : `${p.charAt(0).toUpperCase() + p.slice(1)} Priority`}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        Showing <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> announcements
      </p>

      {/* Announcements list */}
      {filtered.length === 0 ? (
        <div className="sca-card text-center py-5">
          <i className="bi bi-megaphone" style={{ fontSize: '2rem', color: 'var(--text-muted)' }}></i>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem' }}>No announcements match your filters</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filtered.map(ann => (
            <div key={ann.id} className="sca-card" style={{ borderLeft: `4px solid ${ann.tagColor}` }}>
              <div className="d-flex align-items-start justify-content-between gap-3">
                <div className="flex-1">
                  <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                    <span
                      className="announcement-tag"
                      style={{ background: `${ann.tagColor}15`, color: ann.tagColor }}
                    >
                      {ann.tag}
                    </span>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 600, color: priorityColor[ann.priority],
                      display: 'flex', alignItems: 'center', gap: 4
                    }}>
                      <i className={`bi ${priorityIcon[ann.priority]}`}></i>
                      {ann.priority.toUpperCase()}
                    </span>
                  </div>

                  <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                    {ann.title}
                  </h3>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.65 }}>
                    {ann.content}
                  </p>
                </div>
              </div>

              <div className="divider"></div>

              <div className="d-flex align-items-center gap-3" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span><i className="bi bi-person-circle me-1"></i>{ann.author}</span>
                <span><i className="bi bi-calendar3 me-1"></i>
                  {new Date(ann.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
