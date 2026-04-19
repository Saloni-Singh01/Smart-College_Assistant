import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const TAGS=[{label:'General',color:'#9aa0b4'},{label:'Exam',color:'#ef4444'},{label:'Placement',color:'#2563eb'},{label:'Event',color:'#059669'},{label:'Finance',color:'#d97706'}];
const pColor={high:'#ef4444',medium:'#d97706',low:'#059669'};

const blank=()=>({title:'',content:'',tag:'General',tagColor:'#9aa0b4',priority:'medium',author:''});

export default function AdminAnnouncements(){
  const{announcements,addAnnouncement,updateAnnouncement,deleteAnnouncement,showToast}=useApp();
  const[form,setForm]=useState(blank());
  const[editing,setEditing]=useState(null);
  const[errors,setErrors]=useState({});
  const[confirm,setConfirm]=useState(null);
  const[search,setSearch]=useState('');

  const validate=()=>{ const e={}; if(!form.title.trim())e.title='Required'; if(!form.content.trim())e.content='Required'; if(!form.author.trim())e.author='Required'; return e; };

  const handleSubmit=(e)=>{
    e.preventDefault(); const errs=validate(); if(Object.keys(errs).length){setErrors(errs);return;}
    const data={...form,date:new Date().toISOString().split('T')[0]};
    if(editing){updateAnnouncement(editing,data);showToast('Announcement updated','info');}
    else{addAnnouncement(data);showToast('Announcement published ✅','success');}
    setForm(blank());setEditing(null);setErrors({});
  };

  const startEdit=(a)=>{ setForm({title:a.title,content:a.content,tag:a.tag,tagColor:a.tagColor,priority:a.priority,author:a.author}); setEditing(a.id); };
  const cancelEdit=()=>{ setForm(blank()); setEditing(null); setErrors({}); };
  const chTag=(v)=>{ const f=TAGS.find(t=>t.label===v); setForm(p=>({...p,tag:v,tagColor:f?.color||'#9aa0b4'})); };
  const ch=(k,v)=>{ setForm(p=>({...p,[k]:v})); if(errors[k])setErrors(p=>({...p,[k]:''})); };

  const filtered=announcements.filter(a=>!search||a.title.toLowerCase().includes(search.toLowerCase()));

  return(
    <div>
      <div className="mb-4"><h1 className="page-title">Announcements</h1><p className="page-subtitle">Create and manage college announcements</p></div>
      <div className="row g-4">
        {/* Form */}
        <div className="col-lg-4">
          <div className="sca-card">
            <h2 className="sca-card-title mb-4"><i className={`bi bi-${editing?'pencil-fill':'plus-circle-fill'} me-2`} style={{color:'#ff5c35'}}></i>{editing?'Edit':'New'} Announcement</h2>
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label">Title *</label>
                <input className={`form-control ${errors.title?'is-invalid':''}`} placeholder="Announcement title" value={form.title} onChange={e=>ch('title',e.target.value)} />
                {errors.title&&<div className="invalid-feedback">{errors.title}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Content *</label>
                <textarea className={`form-control ${errors.content?'is-invalid':''}`} rows={4} value={form.content} onChange={e=>ch('content',e.target.value)} />
                {errors.content&&<div className="invalid-feedback">{errors.content}</div>}
              </div>
              <div className="row g-2 mb-3">
                <div className="col">
                  <label className="form-label">Tag</label>
                  <select className="form-select" value={form.tag} onChange={e=>chTag(e.target.value)}>
                    {TAGS.map(t=><option key={t.label}>{t.label}</option>)}
                  </select>
                </div>
                <div className="col">
                  <label className="form-label">Priority</label>
                  <select className="form-select" value={form.priority} onChange={e=>ch('priority',e.target.value)}>
                    <option value="high">🔴 High</option><option value="medium">🟡 Medium</option><option value="low">🟢 Low</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label">Author *</label>
                <input className={`form-control ${errors.author?'is-invalid':''}`} placeholder="e.g. Examination Cell" value={form.author} onChange={e=>ch('author',e.target.value)} />
                {errors.author&&<div className="invalid-feedback">{errors.author}</div>}
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn-accent flex-1" style={{flex:1,padding:'.6rem',borderRadius:8}}>{editing?'Update':'Publish'}</button>
                {editing&&<button type="button" className="btn-outline-accent" style={{padding:'.6rem .9rem',borderRadius:8}} onClick={cancelEdit}>Cancel</button>}
              </div>
            </form>
          </div>
        </div>

        {/* Table */}
        <div className="col-lg-8">
          <div className="sca-card">
            <div className="sca-card-header">
              <h2 className="sca-card-title">All Announcements <span style={{fontSize:'.75rem',background:'#ff5c35',color:'#fff',borderRadius:20,padding:'.1rem .5rem',marginLeft:'.4rem'}}>{announcements.length}</span></h2>
              <input className="form-control" style={{width:200}} placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)} />
            </div>
            <div style={{overflowX:'auto'}}>
              <table className="table admin-table mb-0">
                <thead><tr><th>Title</th><th>Tag</th><th>Priority</th><th>Author</th><th>Date</th><th>Actions</th></tr></thead>
                <tbody>
                  {filtered.length===0&&<tr><td colSpan={6} className="text-center py-4" style={{color:'var(--text-muted)'}}>No announcements found</td></tr>}
                  {filtered.map(a=>(
                    <tr key={a.id}>
                      <td style={{maxWidth:200,fontWeight:600,fontSize:'.85rem'}}>{a.title.slice(0,38)}{a.title.length>38?'…':''}</td>
                      <td><span className="sca-badge" style={{background:`${a.tagColor}18`,color:a.tagColor}}>{a.tag}</span></td>
                      <td><span style={{fontSize:'.75rem',fontWeight:700,color:pColor[a.priority]}}>{a.priority?.toUpperCase()}</span></td>
                      <td style={{fontSize:'.8rem',color:'var(--text-secondary)'}}>{a.author}</td>
                      <td style={{fontSize:'.75rem',color:'var(--text-muted)',whiteSpace:'nowrap'}}>{a.date}</td>
                      <td>
                        {confirm===a.id?(
                          <div className="d-flex gap-1">
                            <button onClick={()=>{deleteAnnouncement(a.id);showToast('Deleted','info');setConfirm(null);}} style={{background:'#ef4444',border:'none',color:'#fff',borderRadius:6,padding:'.2rem .5rem',cursor:'pointer',fontSize:'.75rem'}}>Yes</button>
                            <button onClick={()=>setConfirm(null)} style={{background:'var(--bg-primary)',border:'1px solid var(--border)',color:'var(--text-secondary)',borderRadius:6,padding:'.2rem .5rem',cursor:'pointer',fontSize:'.75rem'}}>No</button>
                          </div>
                        ):(
                          <div className="d-flex gap-1">
                            <button onClick={()=>startEdit(a)} style={{background:'rgba(37,99,235,.1)',border:'none',color:'#2563eb',borderRadius:6,padding:'.25rem .5rem',cursor:'pointer'}}><i className="bi bi-pencil"></i></button>
                            <button onClick={()=>setConfirm(a.id)} style={{background:'rgba(239,68,68,.1)',border:'none',color:'#ef4444',borderRadius:6,padding:'.25rem .5rem',cursor:'pointer'}}><i className="bi bi-trash"></i></button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
