// pages/Admin.jsx — Admin control panel
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const TAG_OPTIONS = [
  { label: 'General', color: '#9aa0b4' },
  { label: 'Exam', color: '#ef4444' },
  { label: 'Placement', color: '#2563eb' },
  { label: 'Event', color: '#059669' },
  { label: 'Finance', color: '#d97706' },
];

const priorityColors = { high: '#ef4444', medium: '#d97706', low: '#059669' };

function AnnForm({ onAdd, showToast }) {
  const [form, setForm] = useState({
    title: '', content: '', tag: 'General', tagColor: '#9aa0b4',
    priority: 'medium', author: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.content.trim()) e.content = 'Content is required';
    if (!form.author.trim()) e.author = 'Author is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onAdd({ ...form, date: new Date().toISOString().split('T')[0] });
    showToast('✅ Announcement added successfully!', 'success');
    setForm({ title: '', content: '', tag: 'General', tagColor: '#9aa0b4', priority: 'medium', author: '' });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'tag') {
      const found = TAG_OPTIONS.find(t => t.label === value);
      setForm(p => ({ ...p, tag: value, tagColor: found?.color || '#9aa0b4' }));
    } else {
      setForm(p => ({ ...p, [name]: value }));
    }
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-3">
        <label className="form-label">Announcement Title *</label>
        <input
          name="title"
          className={`form-control ${errors.title ? 'is-invalid' : ''}`}
          placeholder="e.g. End Semester Exam Schedule Released"
          value={form.title}
          onChange={handleChange}
        />
        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Content *</label>
        <textarea
          name="content"
          className={`form-control ${errors.content ? 'is-invalid' : ''}`}
          rows={4}
          placeholder="Full announcement details..."
          value={form.content}
          onChange={handleChange}
        />
        {errors.content && <div className="invalid-feedback">{errors.content}</div>}
      </div>

      <div className="row g-3 mb-3">
        <div className="col-6">
          <label className="form-label">Category Tag</label>
          <select name="tag" className="form-select" value={form.tag} onChange={handleChange}>
            {TAG_OPTIONS.map(t => <option key={t.label} value={t.label}>{t.label}</option>)}
          </select>
        </div>
        <div className="col-6">
          <label className="form-label">Priority Level</label>
          <select name="priority" className="form-select" value={form.priority} onChange={handleChange}>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="form-label">Author / Department *</label>
        <input
          name="author"
          className={`form-control ${errors.author ? 'is-invalid' : ''}`}
          placeholder="e.g. Examination Cell"
          value={form.author}
          onChange={handleChange}
        />
        {errors.author && <div className="invalid-feedback">{errors.author}</div>}
      </div>

      <button type="submit" className="btn-accent w-100" style={{ padding: '0.65rem', borderRadius: 10 }}>
        <i className="bi bi-plus-lg me-2"></i>Publish Announcement
      </button>
    </form>
  );
}

function BotForm({ onAdd, showToast }) {
  const [form, setBotForm] = useState({ keywords: '', reply: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.keywords.trim()) e.keywords = 'At least one keyword is required';
    if (!form.reply.trim()) e.reply = 'Reply text is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onAdd({
      keywords: form.keywords.split(',').map(k => k.trim().toLowerCase()).filter(Boolean),
      reply: form.reply
    });
    showToast('🤖 Bot response added!', 'success');
    setBotForm({ keywords: '', reply: '' });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-3">
        <label className="form-label">Trigger Keywords *</label>
        <input
          className={`form-control ${errors.keywords ? 'is-invalid' : ''}`}
          placeholder="e.g. sports, gym, fitness, exercise"
          value={form.keywords}
          onChange={e => { setBotForm(p => ({ ...p, keywords: e.target.value })); if (errors.keywords) setErrors(p => ({ ...p, keywords: '' })); }}
        />
        {errors.keywords && <div className="invalid-feedback">{errors.keywords}</div>}
        <div className="form-text">Separate multiple keywords with commas. These trigger the response.</div>
      </div>

      <div className="mb-4">
        <label className="form-label">Bot's Reply *</label>
        <textarea
          className={`form-control ${errors.reply ? 'is-invalid' : ''}`}
          rows={5}
          placeholder="Type the chatbot's response here. Use emoji for a friendlier tone!"
          value={form.reply}
          onChange={e => { setBotForm(p => ({ ...p, reply: e.target.value })); if (errors.reply) setErrors(p => ({ ...p, reply: '' })); }}
        />
        {errors.reply && <div className="invalid-feedback">{errors.reply}</div>}
      </div>

      <button type="submit" className="btn-accent w-100" style={{ padding: '0.65rem', borderRadius: 10 }}>
        <i className="bi bi-robot me-2"></i>Add Bot Response
      </button>
    </form>
  );
}

export default function Admin() {
  const {
    user,
    announcements, addAnnouncement, deleteAnnouncement,
    botResponses, addBotResponse, deleteBotResponse,
    showToast
  } = useApp();

  const [tab, setTab] = useState('announcements');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleDeleteAnn = (id) => {
    deleteAnnouncement(id);
    showToast('Announcement deleted', 'info');
    setDeleteConfirm(null);
  };

  const handleDeleteBot = (id) => {
    deleteBotResponse(id);
    showToast('Bot response deleted', 'info');
  };

  const tabs = [
    { key: 'announcements', label: 'Announcements', icon: 'bi-megaphone-fill' },
    { key: 'chatbot', label: 'Chatbot Responses', icon: 'bi-robot' },
    { key: 'overview', label: 'Overview', icon: 'bi-bar-chart-fill' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-4 d-flex align-items-start justify-content-between gap-3 flex-wrap">
        <div>
          <h1 className="page-title">Admin Panel</h1>
          <p className="page-subtitle">Manage college data, announcements and chatbot responses</p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '0.6rem 1rem', background: 'var(--bg-card)',
          border: '1px solid var(--border)', borderRadius: 10
        }}>
          <div className="user-avatar" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>
            {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-primary)' }}>{user?.name}</p>
            <p style={{ margin: 0, fontSize: '0.68rem', color: 'var(--accent)', fontWeight: 600 }}>
              <i className="bi bi-shield-fill me-1"></i>Administrator
            </p>
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: 10,
              border: tab === t.key ? 'none' : '1.5px solid var(--border)',
              background: tab === t.key ? 'var(--accent)' : 'var(--bg-card)',
              color: tab === t.key ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.4rem'
            }}
          >
            <i className={`bi ${t.icon}`}></i>
            {t.label}
          </button>
        ))}
      </div>

      {/* ANNOUNCEMENTS TAB */}
      {tab === 'announcements' && (
        <div className="row g-4">
          {/* Add form */}
          <div className="col-lg-4">
            <div className="sca-card">
              <h2 className="sca-card-title mb-4">
                <i className="bi bi-plus-circle-fill me-2" style={{ color: 'var(--accent)' }}></i>
                New Announcement
              </h2>
              <AnnForm onAdd={addAnnouncement} showToast={showToast} />
            </div>
          </div>

          {/* Table */}
          <div className="col-lg-8">
            <div className="sca-card">
              <div className="sca-card-header">
                <h2 className="sca-card-title">
                  All Announcements
                  <span style={{
                    marginLeft: '0.5rem', background: 'var(--accent)', color: '#fff',
                    borderRadius: 20, padding: '0.1rem 0.55rem', fontSize: '0.7rem'
                  }}>
                    {announcements.length}
                  </span>
                </h2>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="table admin-table mb-0">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Priority</th>
                      <th>Author</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {announcements.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-4" style={{ color: 'var(--text-muted)' }}>
                          No announcements yet. Add one!
                        </td>
                      </tr>
                    ) : (
                      announcements.map(a => (
                        <tr key={a.id}>
                          <td style={{ maxWidth: 200 }}>
                            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                              {a.title.length > 35 ? a.title.slice(0, 35) + '…' : a.title}
                            </span>
                          </td>
                          <td>
                            <span className="sca-badge" style={{ background: `${a.tagColor}18`, color: a.tagColor }}>
                              {a.tag}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: priorityColors[a.priority] }}>
                              {a.priority?.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{a.author}</td>
                          <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{a.date}</td>
                          <td>
                            {deleteConfirm === a.id ? (
                              <div className="d-flex gap-1">
                                <button
                                  onClick={() => handleDeleteAnn(a.id)}
                                  style={{ background: '#ef4444', border: 'none', color: '#fff', borderRadius: 6, padding: '0.2rem 0.55rem', cursor: 'pointer', fontSize: '0.75rem' }}
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 6, padding: '0.2rem 0.55rem', cursor: 'pointer', fontSize: '0.75rem' }}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirm(a.id)}
                                style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', borderRadius: 6, padding: '0.25rem 0.6rem', cursor: 'pointer' }}
                                title="Delete"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHATBOT TAB */}
      {tab === 'chatbot' && (
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="sca-card">
              <h2 className="sca-card-title mb-4">
                <i className="bi bi-plus-circle-fill me-2" style={{ color: '#2563eb' }}></i>
                New Bot Response
              </h2>
              <BotForm onAdd={addBotResponse} showToast={showToast} />
            </div>

            {/* How it works info */}
            <div className="sca-card mt-4" style={{ borderLeft: '4px solid #2563eb' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                <i className="bi bi-info-circle me-2" style={{ color: '#2563eb' }}></i>
                How Keywords Work
              </h3>
              <ul style={{ paddingLeft: '1.1rem', margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                <li>Keywords are matched against the user's chat message</li>
                <li>If ANY keyword matches, the bot sends this reply</li>
                <li>Keywords are case-insensitive</li>
                <li>Use comma to separate multiple triggers</li>
              </ul>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="sca-card">
              <div className="sca-card-header">
                <h2 className="sca-card-title">
                  Bot Responses
                  <span style={{
                    marginLeft: '0.5rem', background: '#2563eb', color: '#fff',
                    borderRadius: 20, padding: '0.1rem 0.55rem', fontSize: '0.7rem'
                  }}>
                    {botResponses.length}
                  </span>
                </h2>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="table admin-table mb-0">
                  <thead>
                    <tr>
                      <th style={{ width: 200 }}>Keywords</th>
                      <th>Reply Preview</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {botResponses.map(r => (
                      <tr key={r.id}>
                        <td>
                          <div className="d-flex flex-wrap gap-1">
                            {r.keywords.slice(0, 4).map(k => (
                              <span key={k} className="sca-badge" style={{ background: 'rgba(37,99,235,0.1)', color: '#2563eb' }}>
                                {k}
                              </span>
                            ))}
                            {r.keywords.length > 4 && (
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                +{r.keywords.length - 4} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: 300 }}>
                          {r.reply.length > 80 ? r.reply.slice(0, 80) + '…' : r.reply}
                        </td>
                        <td>
                          <button
                            onClick={() => handleDeleteBot(r.id)}
                            style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', borderRadius: 6, padding: '0.25rem 0.6rem', cursor: 'pointer' }}
                            title="Delete response"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OVERVIEW TAB */}
      {tab === 'overview' && (
        <div className="row g-4">
          {/* Stats overview */}
          {[
            { label: 'Total Announcements', value: announcements.length, icon: 'bi-megaphone-fill', color: 'var(--accent)' },
            { label: 'High Priority', value: announcements.filter(a => a.priority === 'high').length, icon: 'bi-exclamation-circle-fill', color: '#ef4444' },
            { label: 'Bot Responses', value: botResponses.length, icon: 'bi-robot', color: '#2563eb' },
            { label: 'Bot Keywords', value: botResponses.reduce((s, r) => s + r.keywords.length, 0), icon: 'bi-key-fill', color: '#059669' },
          ].map((s, i) => (
            <div key={i} className="col-sm-6 col-xl-3">
              <div className="sca-card" style={{ borderTop: `3px solid ${s.color}` }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 10,
                  background: `${s.color}18`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem', color: s.color, marginBottom: '1rem'
                }}>
                  <i className={`bi ${s.icon}`}></i>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '0.15rem' }}>
                  {s.label}
                </div>
              </div>
            </div>
          ))}

          {/* Announcements by tag breakdown */}
          <div className="col-md-6">
            <div className="sca-card">
              <h2 className="sca-card-title mb-4">Announcements by Category</h2>
              {TAG_OPTIONS.map(tag => {
                const count = announcements.filter(a => a.tag === tag.label).length;
                const pct = announcements.length ? Math.round((count / announcements.length) * 100) : 0;
                return (
                  <div key={tag.label} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{tag.label}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--bg-primary)', borderRadius: 6, overflow: 'hidden' }}>
                      <div style={{
                        width: `${pct}%`, height: '100%',
                        background: tag.color, borderRadius: 6,
                        transition: 'width 0.8s ease'
                      }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Priority breakdown */}
          <div className="col-md-6">
            <div className="sca-card">
              <h2 className="sca-card-title mb-4">Announcements by Priority</h2>
              {['high', 'medium', 'low'].map(priority => {
                const count = announcements.filter(a => a.priority === priority).length;
                const pct = announcements.length ? Math.round((count / announcements.length) * 100) : 0;
                const color = priorityColors[priority];
                return (
                  <div key={priority} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                        {priority} Priority
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--bg-primary)', borderRadius: 6, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 6, transition: 'width 0.8s ease' }}></div>
                    </div>
                  </div>
                );
              })}

              <div className="divider"></div>

              <h2 className="sca-card-title mb-3" style={{ fontSize: '0.9rem' }}>Recent Activity</h2>
              {announcements.slice(0, 3).map(a => (
                <div key={a.id} className="d-flex align-items-center gap-2 mb-2">
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.tagColor, flexShrink: 0 }}></div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', flex: 1 }}>
                    {a.title.slice(0, 42)}{a.title.length > 42 ? '…' : ''}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{a.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
