import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp, sessionUser } from '../context/AppContext';

const ROLES = [
  { value:'faculty', label:'Faculty',       icon:'bi-person-workspace', color:'#2563eb', bg:'rgba(37,99,235,.08)' },
  { value:'admin',   label:'Administrator', icon:'bi-shield-fill',      color:'#ff5c35', bg:'rgba(255,92,53,.08)' },
];

export default function Signup() {
  const [form,    setForm]    = useState({ name:'', email:'', password:'', confirm:'', role:'faculty' });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const { login, showToast, addUser, users }  = useApp();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 3) e.name = 'Name must be at least 3 characters';
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (users.some((u) => u.email.toLowerCase() === form.email.trim().toLowerCase())) e.email = 'This email is already registered';
    if (form.password.length < 6) e.password = 'Min 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => {
      const id = Date.now();
      const row = {
        id,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
        dept: form.role === 'faculty' ? 'Faculty' : 'Administration',
        phone: '',
        joinDate: new Date().toISOString().split('T')[0],
        avatar: form.name.slice(0, 2).toUpperCase(),
      };
      addUser(row);
      login(sessionUser(row));
      showToast('Account created! Welcome 🎓', 'success');
      const dest = form.role === 'admin' ? '/admin/dashboard' : '/faculty/dashboard';
      navigate(dest);
      setLoading(false);
    }, 800);
  };

  const ch = (e) => { setForm(p=>({...p,[e.target.name]:e.target.value})); if(errors[e.target.name]) setErrors(p=>({...p,[e.target.name]:''})); };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div style={{ width:52,height:52,background:'var(--accent)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem',color:'#fff',marginBottom:'1rem' }}><i className="bi bi-mortarboard-fill"></i></div>
        <h2 style={{ color:'#fff',fontFamily:'Syne,sans-serif',fontSize:'1.4rem' }}>Join Smart College<br/>Assistant 2.0</h2>
        <p style={{ color:'rgba(255,255,255,.4)',fontSize:'.875rem',lineHeight:1.7,marginTop:'.75rem' }}>Students receive login details from the administrator. This page is for faculty and administrative staff only.</p>
        <div style={{ marginTop:'1.5rem' }}>
          {ROLES.map(r => (
            <div key={r.value} style={{ display:'flex',alignItems:'center',gap:'.75rem',marginBottom:'.75rem' }}>
              <div style={{ width:32,height:32,borderRadius:'50%',background:r.bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                <i className={`bi ${r.icon}`} style={{ color:r.color,fontSize:'.85rem' }}></i>
              </div>
              <div>
                <p style={{ margin:0,color:'rgba(255,255,255,.75)',fontSize:'.82rem',fontWeight:700 }}>{r.label}</p>
                <p style={{ margin:0,color:'rgba(255,255,255,.35)',fontSize:'.72rem' }}>
                  {r.value==='admin'?'Full system control':'Manage quizzes, students & results'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-box">
          <h2>Create an account</h2>
          <p>Faculty or administrator — students are added by an admin</p>

          {/* Role selector */}
          <div className="row g-2 mb-4">
            {ROLES.map(r => (
              <div key={r.value} className="col-6">
                <div className={`role-card ${form.role===r.value?'selected':''}`}
                  style={{ '--rc':r.color,'--rc-bg':r.bg }}
                  onClick={() => setForm(p=>({...p,role:r.value}))}>
                  <i className={`bi ${r.icon}`} style={{ color:form.role===r.value?r.color:'var(--text-muted)' }}></i>
                  <span style={{ color:form.role===r.value?r.color:'var(--text-secondary)' }}>{r.label}</span>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input name="name" type="text" className={`form-control ${errors.name?'is-invalid':''}`} placeholder="Your full name" value={form.name} onChange={ch} />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input name="email" type="email" className={`form-control ${errors.email?'is-invalid':''}`} placeholder="you@college.edu" value={form.email} onChange={ch} />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            <div className="row g-3 mb-4">
              <div className="col">
                <label className="form-label">Password</label>
                <input name="password" type="password" className={`form-control ${errors.password?'is-invalid':''}`} placeholder="Min. 6 chars" value={form.password} onChange={ch} />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>
              <div className="col">
                <label className="form-label">Confirm</label>
                <input name="confirm" type="password" className={`form-control ${errors.confirm?'is-invalid':''}`} placeholder="Repeat" value={form.confirm} onChange={ch} />
                {errors.confirm && <div className="invalid-feedback">{errors.confirm}</div>}
              </div>
            </div>
            <button type="submit" className="btn-accent w-100" style={{ padding:'.75rem',borderRadius:10 }} disabled={loading}>
              {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Creating…</> : 'Create Account'}
            </button>
          </form>
          <p style={{ textAlign:'center',marginTop:'1.5rem',fontSize:'.875rem',color:'var(--text-secondary)' }}>
            Already have an account? <Link to="/login" style={{ fontWeight:600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
