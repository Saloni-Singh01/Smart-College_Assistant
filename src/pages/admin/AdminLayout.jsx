// pages/admin/AdminLayout.jsx — Admin shell with sidebar + navbar
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import ToastContainer from '../../components/ToastContainer';

const NAV = [
  { label:'Main', items:[
    { path:'/admin/dashboard',     icon:'bi-grid-fill',        label:'Dashboard' },
  ]},
  { label:'Management', items:[
    { path:'/admin/announcements', icon:'bi-megaphone-fill',   label:'Announcements' },
    { path:'/admin/events',        icon:'bi-calendar-event-fill', label:'Events' },
    { path:'/admin/users',         icon:'bi-people-fill',      label:'Manage Users' },
    { path:'/admin/chatbot',       icon:'bi-robot',            label:'Chatbot Settings' },
  ]},
];

const ROLE_COLOR = '#ff5c35';

function AdminSidebar() {
  const { user, logout, sidebarOpen, setSidebarOpen, theme, toggleTheme } = useApp();
  const navigate = useNavigate();
  const initials = user?.name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() || 'AD';

  return (
    <>
      {sidebarOpen && <div className="position-fixed top-0 start-0 w-100 h-100" style={{background:'rgba(0,0,0,.5)',zIndex:999}} onClick={()=>setSidebarOpen(false)} />}
      <aside className={`sidebar ${sidebarOpen?'open':''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon" style={{background:ROLE_COLOR}}><i className="bi bi-shield-fill"></i></div>
          <h6>Smart College</h6>
          <small>Admin Panel</small>
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
          <NavLink to="/admin/profile" className="user-chip mb-2" style={{textDecoration:'none'}} onClick={()=>setSidebarOpen(false)}>
            <div className="user-avatar" style={{background:ROLE_COLOR}}>{initials}</div>
            <div className="user-info">
              <span>{user?.name||'Admin'}</span>
              <div className="role-pill" style={{background:'rgba(255,92,53,.15)',color:ROLE_COLOR}}><i className="bi bi-shield-fill" style={{fontSize:'.55rem'}}></i>Administrator</div>
            </div>
          </NavLink>
          <button className="sidebar-link" style={{color:'#ef4444',background:'rgba(239,68,68,.08)'}}
            onClick={()=>{logout();navigate('/login');}}>
            <i className="bi bi-box-arrow-left"></i>Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

function AdminNavbar({ title }) {
  const { theme, toggleTheme, setSidebarOpen } = useApp();
  return (
    <header className="top-navbar">
      <div className="d-flex align-items-center gap-3">
        <button className="d-md-none border-0 bg-transparent" style={{color:'var(--text-primary)',fontSize:'1.25rem',cursor:'pointer'}} onClick={()=>setSidebarOpen(true)}>
          <i className="bi bi-list"></i>
        </button>
        <div>
          <p className="navbar-title mb-0">{title}</p>
          <small style={{color:ROLE_COLOR,fontSize:'.72rem',fontWeight:700}}><i className="bi bi-shield-fill me-1"></i>Administrator</small>
        </div>
      </div>
      <div className="navbar-right">
        <button className="icon-btn" onClick={toggleTheme} title="Toggle theme"><i className={`bi bi-${theme==='light'?'moon-fill':'sun-fill'}`}></i></button>
        <NavLink to="/admin/profile" className="icon-btn" title="Profile"><i className="bi bi-person-circle"></i></NavLink>
      </div>
    </header>
  );
}

const PAGE_TITLES = {
  '/admin/dashboard':'Dashboard','/admin/announcements':'Announcements',
  '/admin/events':'Events','/admin/users':'Manage Users',
  '/admin/chatbot':'Chatbot Settings','/admin/profile':'My Profile',
};

export default function AdminLayout() {
  const path = window.location.pathname;
  const title = PAGE_TITLES[path] || 'Admin Panel';
  return (
    <div className="app-layout">
      <AdminSidebar />
      <div className="main-content">
        <AdminNavbar title={title} />
        <main className="page-wrapper"><Outlet /></main>
      </div>
      <ToastContainer />
    </div>
  );
}
