// pages/Login.jsx — Role-aware login with role selector cards
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp, sessionUser } from '../context/AppContext';

const DEMO = [
  { role: 'admin',   email: 'admin@college.edu',   pass: 'admin123',   label: 'Administrator', icon: 'bi-shield-fill',        color: '#ff5c35', bg: 'rgba(255,92,53,.08)' },
  { role: 'faculty', email: 'faculty@college.edu', pass: 'faculty123', label: 'Faculty',        icon: 'bi-person-workspace',   color: '#2563eb', bg: 'rgba(37,99,235,.08)' },
  { role: 'student', email: 'student@college.edu', pass: 'student123', label: 'Student',        icon: 'bi-mortarboard-fill',   color: '#059669', bg: 'rgba(5,150,105,.08)' },
];

export default function Login() {
  const [form,    setForm]    = useState({ email:'', password:'' });
  const [errors,  setErrors]  = useState({});
  const [serverErr, setSErr]  = useState('');
  const [loading, setLoading] = useState(false);
  const { login, showToast, users }  = useApp();
  const navigate = useNavigate();

  const fillDemo = (d) => { setForm({ email: d.email, password: d.pass }); setSErr(''); setErrors({}); };

  const validate = () => {
    const e = {};
    if (!form.email)                          e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email  = 'Enter a valid email';
    if (!form.password)                       e.password = 'Password is required';
    else if (form.password.length < 6)        e.password = 'Min 6 characters';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setLoading(true);
    setTimeout(() => {
      const email = form.email.trim().toLowerCase();
      const found = users.find(
        (u) => u.email?.toLowerCase() === email && u.password === form.password
      );
      if (found) {
        login(sessionUser(found));
        showToast(`Welcome back, ${found.name.split(' ')[0]}! 🎉`, 'success');
        const dest = found.role === 'admin' ? '/admin/dashboard' : found.role === 'faculty' ? '/faculty/dashboard' : '/student/dashboard';
        navigate(dest);
      } else {
        setSErr('Invalid credentials. Use a demo account or the credentials issued by your administrator.');
      }
      setLoading(false);
    }, 700);
  };

  const ch = (e) => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: '' })); setSErr(''); };

  return (
    <div className="auth-page">
      {/* Left panel */}
      <div className="auth-left">
        <div>
          <div style={{ width:52,height:52,background:'var(--accent)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem',color:'#fff',marginBottom:'1rem' }}>
            <i className="bi bi-mortarboard-fill"></i>
          </div>
          <h2 style={{ color:'#fff',fontFamily:'Syne,sans-serif',fontSize:'1.5rem',marginBottom:'.5rem' }}>Smart College<br/>Assistant 2.0</h2>
          <p style={{ color:'rgba(255,255,255,.45)',fontSize:'.875rem',lineHeight:1.7 }}>Role-based college management system for Admins, Faculty & Students.</p>

          <div style={{ marginTop:'1.5rem',borderTop:'1px solid rgba(255,255,255,.08)',paddingTop:'1.25rem' }}>
            <p style={{ color:'rgba(255,255,255,.3)',fontSize:'.65rem',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',marginBottom:'.75rem' }}>Demo Accounts</p>
            {DEMO.map(d => (
              <button key={d.role} onClick={() => fillDemo(d)} style={{ display:'flex',alignItems:'center',gap:'.75rem',width:'100%',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:8,padding:'.6rem .85rem',marginBottom:'.4rem',cursor:'pointer',textAlign:'left' }}>
                <div style={{ width:30,height:30,borderRadius:'50%',background:d.bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                  <i className={`bi ${d.icon}`} style={{ color:d.color,fontSize:'.85rem' }}></i>
                </div>
                <div>
                  <p style={{ margin:0,color:'rgba(255,255,255,.75)',fontSize:'.78rem',fontWeight:600 }}>{d.label}</p>
                  <p style={{ margin:0,color:'rgba(255,255,255,.3)',fontSize:'.68rem' }}>{d.email}</p>
                </div>
                <i className="bi bi-arrow-right-circle ms-auto" style={{ color:'rgba(255,255,255,.2)',fontSize:'.9rem' }}></i>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <div className="auth-form-box">
          <h2>Welcome back</h2>
          <p>Sign in to your college account</p>

          {serverErr && (
            <div style={{ background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.2)',borderRadius:8,padding:'.75rem 1rem',color:'#ef4444',fontSize:'.85rem',marginBottom:'1.25rem',display:'flex',alignItems:'center',gap:'.5rem' }}>
              <i className="bi bi-exclamation-circle"></i>{serverErr}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input type="email" name="email" className={`form-control ${errors.email?'is-invalid':''}`} placeholder="you@college.edu" value={form.email} onChange={ch} />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            <div className="mb-4">
              <label className="form-label">Password</label>
              <input type="password" name="password" className={`form-control ${errors.password?'is-invalid':''}`} placeholder="Min. 6 characters" value={form.password} onChange={ch} />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            <div className="d-flex justify-content-end mb-4">
              <Link to="/forgot-password" style={{ fontSize:'.85rem' }}>Forgot password?</Link>
            </div>
            <button type="submit" className="btn-accent w-100" style={{ padding:'.75rem',fontSize:'.95rem',borderRadius:10 }} disabled={loading}>
              {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Signing in…</> : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign:'center',marginTop:'1.5rem',fontSize:'.875rem',color:'var(--text-secondary)' }}>
            Student accounts are created by an administrator. Faculty and staff can{' '}
            <Link to="/signup" style={{ fontWeight:600 }}>register here</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
