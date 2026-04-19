import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const roleColor={admin:'#ff5c35',faculty:'#2563eb',student:'#059669'};
const roleIcon={admin:'bi-shield-fill',faculty:'bi-person-workspace',student:'bi-mortarboard-fill'};

export default function AdminUsers(){
  const{users,addUser,deleteUser,showToast}=useApp();
  const[filter,setFilter]=useState('all');
  const[search,setSearch]=useState('');
  const[confirm,setConfirm]=useState(null);
  const[showForm,setShowForm]=useState(false);
  const[form,setForm]=useState({name:'',email:'',role:'student',dept:'',phone:'',password:'',rollNo:'',cgpa:''});
  const[errors,setErrors]=useState({});

  const filtered=users.filter(u=>{
    const matchRole=filter==='all'||u.role===filter;
    const matchSearch=!search||u.name.toLowerCase().includes(search.toLowerCase())||u.email.toLowerCase().includes(search.toLowerCase())||(u.rollNo&&u.rollNo.toLowerCase().includes(search.toLowerCase()));
    return matchRole&&matchSearch;
  });

  const validate=()=>{
    const e={};
    if(!form.name.trim())e.name='Required';
    if(!/\S+@\S+\.\S+/.test(form.email))e.email='Valid email required';
    if(users.some(u=>u.email.toLowerCase()===form.email.trim().toLowerCase()))e.email='Email already in use';
    if(!form.password||form.password.length<6)e.password='Password min 6 characters';
    if(form.role==='student'&&!form.rollNo?.trim())e.rollNo='Roll number required';
    return e;
  };

  const handleAdd=(e)=>{
    e.preventDefault();const errs=validate();if(Object.keys(errs).length){setErrors(errs);return;}
    const base={
      name:form.name.trim(),
      email:form.email.trim().toLowerCase(),
      role:form.role,
      dept:form.dept.trim()||'—',
      phone:form.phone.trim(),
      password:form.password,
      joinDate:new Date().toISOString().split('T')[0],
      avatar:form.name.slice(0,2).toUpperCase(),
      id:Date.now(),
    };
    if(form.role==='student'){
      base.rollNo=form.rollNo.trim();
      base.cgpa=form.cgpa.trim()||'—';
    }
    addUser(base);
    showToast('User added ✅','success');setForm({name:'',email:'',role:'student',dept:'',phone:'',password:'',rollNo:'',cgpa:''});setShowForm(false);setErrors({});
  };

  const ch=(k,v)=>{setForm(p=>({...p,[k]:v}));if(errors[k])setErrors(p=>({...p,[k]:''}));};

  const tabs=['all','student','faculty','admin'];

  return(
    <div>
      <div className="mb-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div><h1 className="page-title">Manage Users</h1><p className="page-subtitle mb-0">{users.length} total users registered</p></div>
        <button className="btn-accent" style={{borderRadius:8,padding:'.55rem 1.1rem'}} onClick={()=>setShowForm(!showForm)}>
          <i className={`bi bi-${showForm?'x-lg':'plus-lg'} me-2`}></i>{showForm?'Cancel':'Add User'}
        </button>
      </div>

      {showForm&&(
        <div className="sca-card mb-4">
          <h2 className="sca-card-title mb-4"><i className="bi bi-person-plus-fill me-2" style={{color:'#ff5c35'}}></i>Add New User</h2>
          <form onSubmit={handleAdd} noValidate>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Full Name *</label>
                <input className={`form-control ${errors.name?'is-invalid':''}`} value={form.name} onChange={e=>ch('name',e.target.value)} placeholder="Full name" />
                {errors.name&&<div className="invalid-feedback">{errors.name}</div>}
              </div>
              <div className="col-md-4">
                <label className="form-label">Email *</label>
                <input type="email" className={`form-control ${errors.email?'is-invalid':''}`} value={form.email} onChange={e=>ch('email',e.target.value)} placeholder="email@college.edu" />
                {errors.email&&<div className="invalid-feedback">{errors.email}</div>}
              </div>
              <div className="col-md-2">
                <label className="form-label">Role</label>
                <select className="form-select" value={form.role} onChange={e=>ch('role',e.target.value)}>
                  <option value="student">Student</option><option value="faculty">Faculty</option><option value="admin">Admin</option>
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label">Department</label>
                <input className="form-control" value={form.dept} onChange={e=>ch('dept',e.target.value)} placeholder="Dept." />
              </div>
            </div>
            <div className="row g-3 mt-1">
              <div className="col-md-3">
                <label className="form-label">Login password *</label>
                <input type="password" autoComplete="new-password" className={`form-control ${errors.password?'is-invalid':''}`} value={form.password} onChange={e=>ch('password',e.target.value)} placeholder="Min 6 characters" />
                {errors.password&&<div className="invalid-feedback">{errors.password}</div>}
              </div>
              <div className="col-md-3">
                <label className="form-label">Phone</label>
                <input className="form-control" value={form.phone} onChange={e=>ch('phone',e.target.value)} placeholder="+91…" />
              </div>
              {form.role==='student'&&(
                <>
                  <div className="col-md-3">
                    <label className="form-label">Roll number *</label>
                    <input className={`form-control ${errors.rollNo?'is-invalid':''}`} value={form.rollNo} onChange={e=>ch('rollNo',e.target.value)} placeholder="e.g. BT22CS045" />
                    {errors.rollNo&&<div className="invalid-feedback">{errors.rollNo}</div>}
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">CGPA</label>
                    <input className="form-control" value={form.cgpa} onChange={e=>ch('cgpa',e.target.value)} placeholder="Optional" />
                  </div>
                </>
              )}
            </div>
            <div className="mt-3">
              <button type="submit" className="btn-accent" style={{borderRadius:8,padding:'.55rem 1.25rem'}}>Add User</button>
            </div>
          </form>
        </div>
      )}

      <div className="sca-card">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
          <div className="d-flex gap-2 flex-wrap">
            {tabs.map(t=>(
              <button key={t} onClick={()=>setFilter(t)} style={{padding:'.35rem .85rem',borderRadius:20,cursor:'pointer',border:filter===t?'none':'1.5px solid var(--border)',background:filter===t?'var(--accent)':'transparent',color:filter===t?'#fff':'var(--text-secondary)',fontWeight:600,fontSize:'.78rem',textTransform:'capitalize'}}>
                {t==='all'?`All (${users.length})`:`${t.charAt(0).toUpperCase()+t.slice(1)}s (${users.filter(u=>u.role===t).length})`}
              </button>
            ))}
          </div>
          <input className="form-control" style={{width:200}} placeholder="Search users…" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>

        <div style={{overflowX:'auto'}}>
          <table className="table admin-table mb-0">
            <thead><tr><th>User</th><th>Email</th><th>Roll No.</th><th>Role</th><th>Department</th><th>Joined</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.length===0&&<tr><td colSpan={7} className="text-center py-4" style={{color:'var(--text-muted)'}}>No users found</td></tr>}
              {filtered.map(u=>(
                <tr key={u.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div style={{width:32,height:32,borderRadius:'50%',background:roleColor[u.role],display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.72rem',fontWeight:700,color:'#fff',flexShrink:0}}>{u.avatar||u.name?.slice(0,2).toUpperCase()}</div>
                      <span style={{fontWeight:600,fontSize:'.875rem'}}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{fontSize:'.8rem',color:'var(--text-secondary)'}}>{u.email}</td>
                  <td style={{fontSize:'.78rem',color:'var(--text-muted)'}}>{u.rollNo||'—'}</td>
                  <td><span className="sca-badge" style={{background:`${roleColor[u.role]}18`,color:roleColor[u.role],display:'inline-flex',alignItems:'center',gap:4}}><i className={`bi ${roleIcon[u.role]}`} style={{fontSize:'.65rem'}}></i>{u.role}</span></td>
                  <td style={{fontSize:'.8rem',color:'var(--text-secondary)'}}>{u.dept||'—'}</td>
                  <td style={{fontSize:'.75rem',color:'var(--text-muted)'}}>{u.joinDate||'—'}</td>
                  <td>
                    {confirm===u.id?(
                      <div className="d-flex gap-1">
                        <button onClick={()=>{deleteUser(u.id);showToast('User removed','info');setConfirm(null);}} style={{background:'#ef4444',border:'none',color:'#fff',borderRadius:6,padding:'.2rem .5rem',cursor:'pointer',fontSize:'.75rem'}}>Delete</button>
                        <button onClick={()=>setConfirm(null)} style={{background:'var(--bg-primary)',border:'1px solid var(--border)',color:'var(--text-secondary)',borderRadius:6,padding:'.2rem .5rem',cursor:'pointer',fontSize:'.75rem'}}>Cancel</button>
                      </div>
                    ):(
                      <button onClick={()=>setConfirm(u.id)} style={{background:'rgba(239,68,68,.1)',border:'none',color:'#ef4444',borderRadius:6,padding:'.25rem .5rem',cursor:'pointer'}}><i className="bi bi-person-x"></i></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
