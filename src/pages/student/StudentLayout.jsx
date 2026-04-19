import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import ToastContainer from '../../components/ToastContainer';

const NAV = [
  { label:'Main', items:[
    { path:'/student/dashboard',     icon:'bi-grid-fill',           label:'Dashboard' },
    { path:'/student/chat',          icon:'bi-chat-dots-fill',      label:'AI Chatbot' },
  ]},
  { label:'Academic', items:[
    { path:'/student/timetable',     icon:'bi-calendar3',           label:'Timetable' },
    { path:'/student/announcements', icon:'bi-megaphone-fill',      label:'Announcements' },
    { path:'/student/events',        icon:'bi-calendar-event-fill', label:'Events' },
    { path:'/student/quizzes',       icon:'bi-patch-question-fill',  label:'Quizzes' },
    { path:'/student/results',       icon:'bi-bar-chart-fill',      label:'My Results' },
  ]},
];

const ROLE_COLOR = '#059669';

function StudentSidebar() {
  const { user, logout, sidebarOpen, setSidebarOpen } = useApp();
  const navigate = useNavigate();
  const initials = user?.name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() || 'ST';

  return (
    <>
      {sidebarOpen && <div className="position-fixed top-0 start-0 w-100 h-100" style={{background:'rgba(0,0,0,.5)',zIndex:999}} onClick={()=>setSidebarOpen(false)} />}
      <aside className={`sidebar ${sidebarOpen?'open':''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon" style={{background:ROLE_COLOR}}><i className="bi bi-mortarboard-fill"></i></div>
          <h6>Smart College</h6>
          <small>Student Portal</small>
        </div>
        <nav className="sidebar-nav">
          {NAV.map(sec=>(
            <div key={sec.label} className="mb-3">
              <span className="nav-label">{sec.label}</span>
              {sec.items.map(item=>(
                <NavLink key={item.path} to={item.path} className={({isActive})=>`sidebar-link ${isActive?'active':''}`}
                  style={({isActive})=>isActive?{background:ROLE_COLOR}:{}} onClick={()=>setSidebarOpen(false)}>
                  <i className={`bi ${item.icon}`}></i>{item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <NavLink to="/student/profile" className="user-chip mb-2" style={{textDecoration:'none'}} onClick={()=>setSidebarOpen(false)}>
            <div className="user-avatar" style={{background:ROLE_COLOR}}>{initials}</div>
            <div className="user-info">
              <span>{user?.name||'Student'}</span>
              <div className="role-pill" style={{background:'rgba(5,150,105,.15)',color:ROLE_COLOR}}><i className="bi bi-mortarboard-fill" style={{fontSize:'.55rem'}}></i>Student</div>
            </div>
          </NavLink>
          <button className="sidebar-link" style={{color:'#ef4444',background:'rgba(239,68,68,.08)'}} onClick={()=>{logout();navigate('/login');}}>
            <i className="bi bi-box-arrow-left"></i>Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

function StudentNavbar({ title }) {
  const { theme, toggleTheme, setSidebarOpen } = useApp();
  return (
    <header className="top-navbar">
      <div className="d-flex align-items-center gap-3">
        <button className="d-md-none border-0 bg-transparent" style={{color:'var(--text-primary)',fontSize:'1.25rem',cursor:'pointer'}} onClick={()=>setSidebarOpen(true)}><i className="bi bi-list"></i></button>
        <div>
          <p className="navbar-title mb-0">{title}</p>
          <small style={{color:ROLE_COLOR,fontSize:'.72rem',fontWeight:700}}><i className="bi bi-mortarboard-fill me-1"></i>Student</small>
        </div>
      </div>
      <div className="navbar-right">
        <button className="icon-btn" onClick={toggleTheme}><i className={`bi bi-${theme==='light'?'moon-fill':'sun-fill'}`}></i></button>
        <NavLink to="/student/profile" className="icon-btn"><i className="bi bi-person-circle"></i></NavLink>
      </div>
    </header>
  );
}

const PAGE_TITLES={'/student/dashboard':'Dashboard','/student/chat':'AI Chatbot — Aria','/student/timetable':'Timetable','/student/announcements':'Announcements','/student/events':'Events','/student/quizzes':'Quizzes','/student/results':'My Results','/student/profile':'My Profile'};
export default function StudentLayout(){
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] || (pathname.startsWith('/student/quizzes/') ? 'Take Quiz' : 'Student Portal');
  return(<div className="app-layout"><StudentSidebar/><div className="main-content"><StudentNavbar title={title}/><main className="page-wrapper"><Outlet/></main></div><ToastContainer/></div>);
}
