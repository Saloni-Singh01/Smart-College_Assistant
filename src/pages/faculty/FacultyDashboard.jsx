import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function FacultyDashboard(){
  const{user,quizzes,results,users}=useApp();
  const students=users.filter(u=>u.role==='student');
  const myQuizzes=quizzes.filter(q=>q.facultyId===user?.id);
  const myResults=results.filter(r=>myQuizzes.some(q=>q.subject===r.subject));
  const avgMark=myResults.length?Math.round(myResults.reduce((s,r)=>s+r.marks,0)/myResults.length):0;

  const stats=[
    {label:'My Quizzes',     value:myQuizzes.length,  icon:'bi-patch-question-fill', color:'#2563eb', bg:'rgba(37,99,235,.12)'},
    {label:'Active Quizzes', value:myQuizzes.filter(q=>q.status==='active').length, icon:'bi-play-circle-fill', color:'#059669', bg:'rgba(5,150,105,.12)'},
    {label:'Results Entered',value:myResults.length,  icon:'bi-bar-chart-fill',      color:'#d97706', bg:'rgba(217,119,6,.12)'},
    {label:'Avg Score',      value:`${avgMark}%`,     icon:'bi-trophy-fill',         color:'#7c3aed', bg:'rgba(124,58,237,.12)'},
  ];

  const qlinks=[
    {to:'/faculty/quiz',     icon:'bi-patch-question-fill', label:'Quiz Manager', color:'#2563eb'},
    {to:'/faculty/results',  icon:'bi-bar-chart-fill',      label:'Results',      color:'#d97706'},
    {to:'/faculty/students', icon:'bi-people-fill',         label:'Students',     color:'#059669'},
  ];

  return(
    <div>
      <div className="mb-4">
        <h1 className="page-title">Faculty Dashboard</h1>
        <p className="page-subtitle">{user?.dept} · {new Date().toLocaleDateString('en-IN',{weekday:'long',month:'long',day:'numeric'})}</p>
      </div>

      <div className="row g-3 mb-4">
        {stats.map((s,i)=>(
          <div key={i} className="col-sm-6 col-xl-3">
            <div className="stat-card" style={{'--accent-color':s.color}}>
              <div className="stat-icon" style={{background:s.bg,color:s.color}}><i className={`bi ${s.icon}`}></i></div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="sca-card">
            <div className="sca-card-header">
              <h2 className="sca-card-title"><i className="bi bi-patch-question-fill me-2" style={{color:'#2563eb'}}></i>My Quizzes</h2>
              <Link to="/faculty/quiz" style={{fontSize:'.8rem',fontWeight:600}}>Manage <i className="bi bi-arrow-right"></i></Link>
            </div>
            {myQuizzes.length===0&&<p style={{color:'var(--text-muted)',fontSize:'.875rem'}}>No quizzes yet. Create one!</p>}
            {myQuizzes.map(q=>(
              <div key={q.id} className="announcement-item">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <p style={{fontWeight:700,fontSize:'.875rem',margin:0}}>{q.title}</p>
                    <p style={{fontSize:'.75rem',color:'var(--text-muted)',margin:0}}>{q.subject} · {q.questions} Qs · {q.totalMarks} marks · Due {q.dueDate}</p>
                  </div>
                  <span className="sca-badge" style={{background:q.status==='active'?'rgba(5,150,105,.12)':'rgba(154,160,180,.12)',color:q.status==='active'?'#059669':'#9aa0b4'}}>
                    {q.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-5">
          <div className="sca-card mb-4">
            <h2 className="sca-card-title mb-3"><i className="bi bi-lightning-fill me-2" style={{color:'#d97706'}}></i>Quick Actions</h2>
            <div className="d-flex flex-column gap-2">
              {qlinks.map(q=>(
                <Link key={q.to} to={q.to} style={{display:'flex',alignItems:'center',gap:'.75rem',padding:'.75rem 1rem',borderRadius:10,textDecoration:'none',background:'var(--bg-primary)',border:'1px solid var(--border)',transition:'all .2s'}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=q.color} onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
                  <div style={{width:36,height:36,borderRadius:8,background:`${q.color}18`,display:'flex',alignItems:'center',justifyContent:'center',color:q.color,flexShrink:0}}><i className={`bi ${q.icon}`}></i></div>
                  <span style={{fontWeight:600,fontSize:'.875rem',color:'var(--text-primary)'}}>{q.label}</span>
                  <i className="bi bi-arrow-right ms-auto" style={{color:'var(--text-muted)',fontSize:'.8rem'}}></i>
                </Link>
              ))}
            </div>
          </div>

          <div className="sca-card">
            <h2 className="sca-card-title mb-3"><i className="bi bi-people-fill me-2" style={{color:'#059669'}}></i>Student Summary</h2>
            <div className="d-flex align-items-center gap-3">
              <div style={{width:56,height:56,borderRadius:12,background:'rgba(5,150,105,.12)',display:'flex',alignItems:'center',justifyContent:'center',color:'#059669',fontSize:'1.4rem',flexShrink:0}}><i className="bi bi-mortarboard-fill"></i></div>
              <div>
                <div style={{fontFamily:'Syne,sans-serif',fontSize:'2rem',fontWeight:800,color:'var(--text-primary)',lineHeight:1}}>{students.length}</div>
                <div style={{fontSize:'.82rem',color:'var(--text-muted)'}}>total students enrolled</div>
              </div>
            </div>
            <Link to="/faculty/students" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'.5rem',marginTop:'1rem',padding:'.55rem',borderRadius:8,border:'1.5px solid #059669',color:'#059669',fontSize:'.82rem',fontWeight:600,textDecoration:'none',transition:'all .2s'}}
              onMouseEnter={e=>{e.currentTarget.style.background='#059669';e.currentTarget.style.color='#fff';}} onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='#059669';}}>
              <i className="bi bi-arrow-right-circle"></i>View All Students
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
