import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const CATS=['Tech','Placement','Social','Cultural','Academic','Sports'];
const catColors={Tech:'#2563eb',Placement:'#ff5c35',Social:'#059669',Cultural:'#7c3aed',Academic:'#d97706',Sports:'#0891b2'};
const blank=()=>({title:'',day:'',month:'Jan',time:'',location:'',category:'Tech',description:''});
const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AdminEvents(){
  const{events,addEvent,updateEvent,deleteEvent,showToast}=useApp();
  const[form,setForm]=useState(blank());
  const[editing,setEditing]=useState(null);
  const[errors,setErrors]=useState({});
  const[confirm,setConfirm]=useState(null);

  const validate=()=>{const e={};if(!form.title.trim())e.title='Required';if(!form.day||isNaN(form.day)||form.day<1||form.day>31)e.day='Enter 1–31';if(!form.time.trim())e.time='Required';if(!form.location.trim())e.location='Required';return e;};

  const handleSubmit=(e)=>{
    e.preventDefault();const errs=validate();if(Object.keys(errs).length){setErrors(errs);return;}
    const data={...form,day:String(form.day).padStart(2,'0')};
    if(editing){updateEvent(editing,data);showToast('Event updated','info');}
    else{addEvent(data);showToast('Event added ✅','success');}
    setForm(blank());setEditing(null);setErrors({});
  };

  const startEdit=(ev)=>{setForm({title:ev.title,day:ev.day,month:ev.month,time:ev.time,location:ev.location,category:ev.category,description:ev.description||''});setEditing(ev.id);};
  const cancelEdit=()=>{setForm(blank());setEditing(null);setErrors({});};
  const ch=(k,v)=>{setForm(p=>({...p,[k]:v}));if(errors[k])setErrors(p=>({...p,[k]:''}));};

  return(
    <div>
      <div className="mb-4"><h1 className="page-title">Events</h1><p className="page-subtitle">Create and manage college events</p></div>
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="sca-card">
            <h2 className="sca-card-title mb-4"><i className={`bi bi-${editing?'pencil-fill':'plus-circle-fill'} me-2`} style={{color:'#2563eb'}}></i>{editing?'Edit':'New'} Event</h2>
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label">Event Title *</label>
                <input className={`form-control ${errors.title?'is-invalid':''}`} value={form.title} onChange={e=>ch('title',e.target.value)} placeholder="Event name" />
                {errors.title&&<div className="invalid-feedback">{errors.title}</div>}
              </div>
              <div className="row g-2 mb-3">
                <div className="col-4">
                  <label className="form-label">Day *</label>
                  <input type="number" className={`form-control ${errors.day?'is-invalid':''}`} min={1} max={31} value={form.day} onChange={e=>ch('day',e.target.value)} placeholder="DD" />
                  {errors.day&&<div className="invalid-feedback">{errors.day}</div>}
                </div>
                <div className="col-4">
                  <label className="form-label">Month</label>
                  <select className="form-select" value={form.month} onChange={e=>ch('month',e.target.value)}>{MONTHS.map(m=><option key={m}>{m}</option>)}</select>
                </div>
                <div className="col-4">
                  <label className="form-label">Time *</label>
                  <input className={`form-control ${errors.time?'is-invalid':''}`} value={form.time} onChange={e=>ch('time',e.target.value)} placeholder="9:00 AM" />
                  {errors.time&&<div className="invalid-feedback">{errors.time}</div>}
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Location *</label>
                <input className={`form-control ${errors.location?'is-invalid':''}`} value={form.location} onChange={e=>ch('location',e.target.value)} placeholder="Venue" />
                {errors.location&&<div className="invalid-feedback">{errors.location}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Category</label>
                <select className="form-select" value={form.category} onChange={e=>ch('category',e.target.value)}>{CATS.map(c=><option key={c}>{c}</option>)}</select>
              </div>
              <div className="mb-4">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows={3} value={form.description} onChange={e=>ch('description',e.target.value)} placeholder="Brief description…" />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn-accent" style={{flex:1,padding:'.6rem',borderRadius:8}}>{editing?'Update':'Add Event'}</button>
                {editing&&<button type="button" className="btn-outline-accent" style={{padding:'.6rem .9rem',borderRadius:8}} onClick={cancelEdit}>Cancel</button>}
              </div>
            </form>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="sca-card">
            <div className="sca-card-header">
              <h2 className="sca-card-title">All Events <span style={{fontSize:'.75rem',background:'#2563eb',color:'#fff',borderRadius:20,padding:'.1rem .5rem',marginLeft:'.4rem'}}>{events.length}</span></h2>
            </div>
            <div className="row g-3">
              {events.map(ev=>{
                const color=catColors[ev.category]||'#9aa0b4';
                return(
                  <div key={ev.id} className="col-12">
                    <div style={{display:'flex',alignItems:'center',gap:'1rem',padding:'.85rem 1rem',borderRadius:10,background:'var(--bg-primary)',border:'1px solid var(--border)'}}>
                      <div style={{width:44,height:48,borderRadius:8,background:color,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'#fff',flexShrink:0}}>
                        <span style={{fontFamily:'Syne,sans-serif',fontSize:'1.1rem',fontWeight:800,lineHeight:1}}>{ev.day}</span>
                        <span style={{fontSize:'.58rem',fontWeight:600,textTransform:'uppercase',opacity:.85}}>{ev.month}</span>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <p style={{fontWeight:700,fontSize:'.875rem',margin:0,color:'var(--text-primary)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{ev.title}</p>
                        <p style={{fontSize:'.75rem',color:'var(--text-muted)',margin:0}}><i className="bi bi-clock me-1"></i>{ev.time} · <i className="bi bi-geo-alt me-1"></i>{ev.location}</p>
                      </div>
                      <span className="sca-badge" style={{background:`${color}15`,color,flexShrink:0}}>{ev.category}</span>
                      <div className="d-flex gap-1 flex-shrink-0">
                        {confirm===ev.id?(
                          <>
                            <button onClick={()=>{deleteEvent(ev.id);showToast('Event deleted','info');setConfirm(null);}} style={{background:'#ef4444',border:'none',color:'#fff',borderRadius:6,padding:'.2rem .5rem',cursor:'pointer',fontSize:'.75rem'}}>Delete</button>
                            <button onClick={()=>setConfirm(null)} style={{background:'var(--bg-card)',border:'1px solid var(--border)',color:'var(--text-secondary)',borderRadius:6,padding:'.2rem .5rem',cursor:'pointer',fontSize:'.75rem'}}>Cancel</button>
                          </>
                        ):(
                          <>
                            <button onClick={()=>startEdit(ev)} style={{background:'rgba(37,99,235,.1)',border:'none',color:'#2563eb',borderRadius:6,padding:'.3rem .5rem',cursor:'pointer'}}><i className="bi bi-pencil"></i></button>
                            <button onClick={()=>setConfirm(ev.id)} style={{background:'rgba(239,68,68,.1)',border:'none',color:'#ef4444',borderRadius:6,padding:'.3rem .5rem',cursor:'pointer'}}><i className="bi bi-trash"></i></button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {events.length===0&&<div className="col-12 text-center py-4" style={{color:'var(--text-muted)'}}>No events yet.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
