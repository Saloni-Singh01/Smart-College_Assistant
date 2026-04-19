import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

function AnimCounter({ target, suffix='' }) {
  const [val, setVal] = useState(0);
  useEffect(()=>{
    let s=0; const n=parseInt(String(target).replace(/\D/g,'')); if(!n){setVal(target);return;}
    const t=setInterval(()=>{ s+=Math.ceil(n/40); if(s>=n){setVal(n);clearInterval(t);}else setVal(s); },30);
    return()=>clearInterval(t);
  },[target]);
  return <>{val}{suffix}</>;
}

export default function AdminDashboard() {
  const { users, announcements, events, quizzes, results, eventRegistrations } = useApp();
  const students = users.filter(u=>u.role==='student');
  const faculty  = users.filter(u=>u.role==='faculty');

  const stats = [
    { label:'Total Users',     value:users.length,          suffix:'',  icon:'bi-people-fill',        color:'#ff5c35', bg:'rgba(255,92,53,.12)'  },
    { label:'Students',        value:students.length,       suffix:'',  icon:'bi-mortarboard-fill',   color:'#059669', bg:'rgba(5,150,105,.12)'  },
    { label:'Faculty Members', value:faculty.length,        suffix:'',  icon:'bi-person-workspace',   color:'#2563eb', bg:'rgba(37,99,235,.12)'  },
    { label:'Announcements',   value:announcements.length,  suffix:'',  icon:'bi-megaphone-fill',     color:'#7c3aed', bg:'rgba(124,58,237,.12)' },
    { label:'Active Events',   value:events.length,         suffix:'',  icon:'bi-calendar-event-fill',color:'#d97706', bg:'rgba(217,119,6,.12)'  },
    { label:'Quizzes',         value:quizzes.length,        suffix:'',  icon:'bi-patch-question-fill',color:'#059669', bg:'rgba(5,150,105,.12)'  },
  ];

  const qlinks = [
    { to:'/admin/announcements', icon:'bi-megaphone-fill',    label:'Announcements', color:'#ff5c35' },
    { to:'/admin/events',        icon:'bi-calendar-event-fill',label:'Events',       color:'#2563eb' },
    { to:'/admin/users',         icon:'bi-people-fill',        label:'Users',        color:'#059669' },
    { to:'/admin/chatbot',       icon:'bi-robot',              label:'Chatbot',      color:'#7c3aed' },
  ];

  return (
    <div>
      <div className="mb-4">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">{new Date().toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {stats.map((s,i)=>(
          <div key={i} className="col-6 col-xl-4">
            <div className="stat-card" style={{'--accent-color':s.color}}>
              <div className="stat-icon" style={{background:s.bg,color:s.color}}><i className={`bi ${s.icon}`}></i></div>
              <div className="stat-value"><AnimCounter target={s.value} suffix={s.suffix} /></div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Recent announcements */}
        <div className="col-lg-7">
          <div className="sca-card">
            <div className="sca-card-header">
              <h2 className="sca-card-title"><i className="bi bi-megaphone-fill me-2" style={{color:'#ff5c35'}}></i>Recent Announcements</h2>
              <Link to="/admin/announcements" style={{fontSize:'.8rem',fontWeight:600}}>Manage <i className="bi bi-arrow-right"></i></Link>
            </div>
            {announcements.slice(0,4).map(a=>(
              <div key={a.id} className="announcement-item">
                <span className="announcement-tag" style={{background:`${a.tagColor}18`,color:a.tagColor}}>{a.tag}</span>
                <p style={{fontWeight:600,fontSize:'.875rem',margin:'.2rem 0',color:'var(--text-primary)'}}>{a.title}</p>
                <p style={{fontSize:'.78rem',color:'var(--text-muted)',margin:0}}>{a.author} · {a.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right col */}
        <div className="col-lg-5 d-flex flex-column gap-4">
          {/* Quick actions */}
          <div className="sca-card">
            <h2 className="sca-card-title mb-3"><i className="bi bi-lightning-fill me-2" style={{color:'#d97706'}}></i>Quick Actions</h2>
            <div className="row g-2">
              {qlinks.map(q=>(
                <div key={q.to} className="col-6">
                  <Link to={q.to} style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'1rem .5rem',borderRadius:10,textDecoration:'none',background:'var(--bg-primary)',border:'1px solid var(--border)',gap:'.4rem',transition:'all .2s'}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=q.color} onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
                    <i className={`bi ${q.icon}`} style={{fontSize:'1.2rem',color:q.color}}></i>
                    <span style={{fontSize:'.75rem',fontWeight:600,color:'var(--text-secondary)'}}>{q.label}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* User breakdown */}
          <div className="sca-card">
            <h2 className="sca-card-title mb-3"><i className="bi bi-pie-chart-fill me-2" style={{color:'#7c3aed'}}></i>User Breakdown</h2>
            {[{label:'Students',count:students.length,color:'#059669'},{label:'Faculty',count:faculty.length,color:'#2563eb'},{label:'Admins',count:users.filter(u=>u.role==='admin').length,color:'#ff5c35'}].map(r=>{
              const pct = users.length ? Math.round(r.count/users.length*100) : 0;
              return(
                <div key={r.label} className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span style={{fontSize:'.82rem',fontWeight:600,color:'var(--text-secondary)'}}>{r.label}</span>
                    <span style={{fontSize:'.78rem',color:'var(--text-muted)'}}>{r.count} ({pct}%)</span>
                  </div>
                  <div className="progress" style={{height:6}}>
                    <div className="progress-bar" style={{width:`${pct}%`,background:r.color}}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Event registrations (students) */}
        <div className="col-12 mt-2">
          <div className="sca-card">
            <div className="sca-card-header">
              <h2 className="sca-card-title"><i className="bi bi-calendar-check-fill me-2" style={{ color: '#059669' }}></i>Student event registrations</h2>
              <span style={{ fontSize: '.78rem', color: 'var(--text-muted)' }}>{eventRegistrations.length} total</span>
            </div>
            {eventRegistrations.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '.875rem', margin: 0 }}>No registrations yet. When students register for events, they appear here.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="table admin-table mb-0">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Roll No.</th>
                      <th>Email</th>
                      <th>Event</th>
                      <th>Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...eventRegistrations].sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt)).slice(0, 25).map((r) => (
                      <tr key={r.id}>
                        <td style={{ fontSize: '.82rem', fontWeight: 600 }}>{r.studentName}</td>
                        <td style={{ fontSize: '.78rem', color: 'var(--text-muted)' }}>{r.rollNo || '—'}</td>
                        <td style={{ fontSize: '.75rem', color: 'var(--text-secondary)' }}>{r.email}</td>
                        <td style={{ fontSize: '.8rem' }}>{r.eventTitle}</td>
                        <td style={{ fontSize: '.72rem', color: 'var(--text-muted)' }}>{r.registeredAt ? new Date(r.registeredAt).toLocaleString() : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
