// pages/Profile.jsx — Shared profile page for all roles
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const roleConfig = {
  admin:   { label: 'Administrator', color: '#ff5c35', icon: 'bi-shield-fill',       bg: 'rgba(255,92,53,.12)'  },
  faculty: { label: 'Faculty',       color: '#2563eb', icon: 'bi-person-workspace',   bg: 'rgba(37,99,235,.12)'  },
  student: { label: 'Student',       color: '#059669', icon: 'bi-mortarboard-fill',   bg: 'rgba(5,150,105,.12)'  },
};

export default function Profile() {
  const { user, updateProfile, logout, showToast } = useApp();
  const navigate = useNavigate();

  const rc = roleConfig[user?.role] || roleConfig.student;

  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', dept: user?.dept || '' });
  const [errors, setErrors]   = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 3) e.name = 'Name must be at least 3 characters';
    if (!/\S+@\S+\.\S+/.test(form.email))                 e.email = 'Enter a valid email';
    return e;
  };

  const handleSave = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    updateProfile({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), dept: form.dept.trim() });
    showToast('Profile updated successfully ✅', 'success');
    setEditing(false);
    setErrors({});
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  const infoRows = [
    { label: 'Full Name',   value: user?.name,     icon: 'bi-person-fill' },
    { label: 'Email',       value: user?.email,    icon: 'bi-envelope-fill' },
    { label: 'Role',        value: rc.label,       icon: rc.icon },
    { label: 'Department',  value: user?.dept,     icon: 'bi-building' },
    { label: 'Phone',       value: user?.phone,    icon: 'bi-telephone-fill' },
    { label: 'Joined',      value: user?.joinDate, icon: 'bi-calendar-check' },
    ...(user?.rollNo ? [{ label: 'Roll No.', value: user.rollNo, icon: 'bi-hash' }] : []),
    ...(user?.cgpa   ? [{ label: 'CGPA',     value: user.cgpa,  icon: 'bi-star-fill' }] : []),
  ].filter(r => r.value);

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      {/* Hero banner */}
      <div className="profile-hero" style={{ '--role-color': rc.color }}>
        <div className="d-flex align-items-center gap-4 flex-wrap">
          <div className="profile-avatar-lg" style={{ background: rc.color }}>
            {initials}
          </div>
          <div>
            <h2 style={{ color: '#fff', fontFamily: 'Syne, sans-serif', fontSize: '1.4rem', margin: 0 }}>{user?.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginTop: '.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.35rem', padding: '.25rem .7rem', borderRadius: 20, background: `${rc.color}30`, border: `1px solid ${rc.color}50` }}>
                <i className={`bi ${rc.icon}`} style={{ color: rc.color, fontSize: '.8rem' }}></i>
                <span style={{ color: rc.color, fontWeight: 700, fontSize: '.8rem' }}>{rc.label}</span>
              </div>
              {user?.dept && <span style={{ color: 'rgba(255,255,255,.5)', fontSize: '.82rem' }}>{user.dept}</span>}
            </div>
          </div>
          <div className="ms-auto d-flex gap-2 flex-wrap">
            <button onClick={() => { setEditing(!editing); setErrors({}); if (!editing) setForm({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', dept: user?.dept || '' }); }}
              style={{ padding: '.5rem 1rem', borderRadius: 8, border: '1.5px solid rgba(255,255,255,.2)', background: editing ? 'rgba(255,255,255,.12)' : 'transparent', color: '#fff', fontWeight: 600, fontSize: '.82rem', cursor: 'pointer' }}>
              <i className={`bi bi-${editing ? 'x-lg' : 'pencil-fill'} me-2`}></i>{editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Info panel */}
        <div className="col-md-6">
          <div className="sca-card h-100">
            <h2 className="sca-card-title mb-4"><i className="bi bi-person-circle me-2" style={{ color: rc.color }}></i>Profile Information</h2>
            {infoRows.map(row => (
              <div key={row.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '.85rem', padding: '.65rem 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: rc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className={`bi ${row.icon}`} style={{ color: rc.color, fontSize: '.82rem' }}></i>
                </div>
                <div>
                  <p style={{ fontSize: '.68rem', fontWeight: 700, color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase', letterSpacing: '.05em' }}>{row.label}</p>
                  <p style={{ fontSize: '.875rem', fontWeight: 600, color: 'var(--text-primary)', margin: '.1rem 0 0' }}>{row.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit / Actions */}
        <div className="col-md-6">
          {editing ? (
            <div className="sca-card">
              <h2 className="sca-card-title mb-4"><i className="bi bi-pencil-fill me-2" style={{ color: rc.color }}></i>Edit Profile</h2>
              <form onSubmit={handleSave} noValidate>
                <div className="mb-3">
                  <label className="form-label">Full Name *</label>
                  <input className={`form-control ${errors.name ? 'is-invalid' : ''}`} value={form.name} onChange={e => { setForm(p => ({ ...p, name: e.target.value })); if (errors.name) setErrors(p => ({ ...p, name: '' })); }} />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Email *</label>
                  <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} value={form.email} onChange={e => { setForm(p => ({ ...p, email: e.target.value })); if (errors.email) setErrors(p => ({ ...p, email: '' })); }} />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Department</label>
                  <input className="form-control" value={form.dept} onChange={e => setForm(p => ({ ...p, dept: e.target.value }))} placeholder="e.g. Computer Science" />
                </div>
                <div className="mb-4">
                  <label className="form-label">Phone</label>
                  <input className="form-control" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91-XXXXXXXXXX" />
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn-accent" style={{ flex: 1, padding: '.65rem', borderRadius: 8 }}>Save Changes</button>
                  <button type="button" className="btn-outline-accent" style={{ padding: '.65rem 1rem', borderRadius: 8 }} onClick={() => setEditing(false)}>Cancel</button>
                </div>
              </form>
            </div>
          ) : (
            <div className="sca-card">
              <h2 className="sca-card-title mb-4"><i className="bi bi-gear-fill me-2" style={{ color: 'var(--text-muted)' }}></i>Account Settings</h2>

              {/* Role badge */}
              <div style={{ padding: '1rem', borderRadius: 10, background: rc.bg, border: `1px solid ${rc.color}25`, marginBottom: '1.5rem' }}>
                <div className="d-flex align-items-center gap-3">
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: `${rc.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: rc.color, fontSize: '1.2rem' }}>
                    <i className={`bi ${rc.icon}`}></i>
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '.9rem', margin: 0, color: 'var(--text-primary)' }}>Role: {rc.label}</p>
                    <p style={{ fontSize: '.78rem', color: 'var(--text-secondary)', margin: '.1rem 0 0' }}>
                      {user?.role === 'admin'   ? 'Full system access — manage all data' :
                       user?.role === 'faculty' ? 'Manage quizzes, results, and students' :
                       'View content, register for events, use chatbot'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Settings actions */}
              <div className="d-flex flex-column gap-2">
                <button onClick={() => setEditing(true)} style={{
                  display: 'flex', alignItems: 'center', gap: '.75rem',
                  padding: '.75rem 1rem', borderRadius: 10, cursor: 'pointer',
                  background: 'var(--bg-primary)', border: '1px solid var(--border)',
                  color: 'var(--text-primary)', textAlign: 'left', transition: 'all .15s'
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = rc.color}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                  <i className="bi bi-pencil-fill" style={{ color: rc.color, width: 18 }}></i>
                  <span style={{ fontWeight: 600, fontSize: '.875rem' }}>Edit Profile Information</span>
                  <i className="bi bi-chevron-right ms-auto" style={{ color: 'var(--text-muted)', fontSize: '.8rem' }}></i>
                </button>

                <button style={{
                  display: 'flex', alignItems: 'center', gap: '.75rem',
                  padding: '.75rem 1rem', borderRadius: 10, cursor: 'pointer',
                  background: 'var(--bg-primary)', border: '1px solid var(--border)',
                  color: 'var(--text-primary)', textAlign: 'left'
                }}>
                  <i className="bi bi-lock-fill" style={{ color: '#7c3aed', width: 18 }}></i>
                  <span style={{ fontWeight: 600, fontSize: '.875rem' }}>Change Password</span>
                  <i className="bi bi-chevron-right ms-auto" style={{ color: 'var(--text-muted)', fontSize: '.8rem' }}></i>
                </button>

                <div style={{ height: 1, background: 'var(--border)', margin: '.25rem 0' }}></div>

                <button onClick={handleLogout} style={{
                  display: 'flex', alignItems: 'center', gap: '.75rem',
                  padding: '.75rem 1rem', borderRadius: 10, cursor: 'pointer',
                  background: 'rgba(239,68,68,.06)', border: '1px solid rgba(239,68,68,.15)',
                  color: '#ef4444', textAlign: 'left', fontWeight: 600, fontSize: '.875rem'
                }}>
                  <i className="bi bi-box-arrow-left" style={{ width: 18 }}></i>
                  Sign Out of Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
