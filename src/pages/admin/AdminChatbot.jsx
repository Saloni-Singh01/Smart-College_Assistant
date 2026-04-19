import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function AdminChatbot(){
  const{botResponses,addBotResponse,deleteBotResponse,showToast}=useApp();
  const[form,setForm]=useState({keywords:'',reply:''});
  const[errors,setErrors]=useState({});

  const validate=()=>{const e={};if(!form.keywords.trim())e.keywords='Enter at least one keyword';if(!form.reply.trim())e.reply='Reply text required';return e;};

  const handleAdd=(e)=>{
    e.preventDefault();const errs=validate();if(Object.keys(errs).length){setErrors(errs);return;}
    addBotResponse({keywords:form.keywords.split(',').map(k=>k.trim().toLowerCase()).filter(Boolean),reply:form.reply});
    showToast('Bot response added 🤖','success');setForm({keywords:'',reply:''});setErrors({});
  };

  const ch=(k,v)=>{setForm(p=>({...p,[k]:v}));if(errors[k])setErrors(p=>({...p,[k]:''}));};

  return(
    <div>
      <div className="mb-4"><h1 className="page-title">Chatbot Settings</h1><p className="page-subtitle">Manage Aria's keyword-based response database</p></div>
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="sca-card">
            <h2 className="sca-card-title mb-4"><i className="bi bi-plus-circle-fill me-2" style={{color:'#7c3aed'}}></i>Add Response</h2>
            <form onSubmit={handleAdd} noValidate>
              <div className="mb-3">
                <label className="form-label">Keywords (comma-separated) *</label>
                <input className={`form-control ${errors.keywords?'is-invalid':''}`} placeholder="e.g. sports, gym, fitness" value={form.keywords} onChange={e=>ch('keywords',e.target.value)} />
                {errors.keywords&&<div className="invalid-feedback">{errors.keywords}</div>}
                <div className="form-text">When any keyword matches the user's message, this reply is sent.</div>
              </div>
              <div className="mb-4">
                <label className="form-label">Bot Reply *</label>
                <textarea className={`form-control ${errors.reply?'is-invalid':''}`} rows={5} placeholder="Type the chatbot reply… Use emoji 🎓" value={form.reply} onChange={e=>ch('reply',e.target.value)} />
                {errors.reply&&<div className="invalid-feedback">{errors.reply}</div>}
              </div>
              <button type="submit" className="btn-accent w-100" style={{padding:'.65rem',borderRadius:8}}><i className="bi bi-robot me-2"></i>Add Response</button>
            </form>
          </div>

          <div className="sca-card mt-4" style={{borderLeft:'4px solid #7c3aed'}}>
            <h3 style={{fontSize:'.85rem',fontWeight:700,marginBottom:'.75rem'}}><i className="bi bi-info-circle me-2" style={{color:'#7c3aed'}}></i>How It Works</h3>
            <ul style={{paddingLeft:'1.1rem',margin:0,fontSize:'.78rem',color:'var(--text-secondary)',lineHeight:1.9}}>
              <li>Keywords match against user messages (case-insensitive)</li>
              <li>First match wins — order your responses carefully</li>
              <li>Supports partial matches (e.g. "fee" matches "fees")</li>
              <li>Use commas to separate multiple trigger words</li>
            </ul>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="sca-card">
            <div className="sca-card-header">
              <h2 className="sca-card-title">Response Database <span style={{fontSize:'.75rem',background:'#7c3aed',color:'#fff',borderRadius:20,padding:'.1rem .5rem',marginLeft:'.4rem'}}>{botResponses.length}</span></h2>
            </div>
            <div style={{overflowX:'auto'}}>
              <table className="table admin-table mb-0">
                <thead><tr><th>Keywords</th><th>Reply Preview</th><th>Delete</th></tr></thead>
                <tbody>
                  {botResponses.map(r=>(
                    <tr key={r.id}>
                      <td style={{maxWidth:200}}>
                        <div className="d-flex flex-wrap gap-1">
                          {r.keywords.slice(0,4).map(k=><span key={k} className="sca-badge" style={{background:'rgba(124,58,237,.1)',color:'#7c3aed'}}>{k}</span>)}
                          {r.keywords.length>4&&<span style={{fontSize:'.7rem',color:'var(--text-muted)',fontWeight:600}}>+{r.keywords.length-4}</span>}
                        </div>
                      </td>
                      <td style={{fontSize:'.8rem',color:'var(--text-secondary)',maxWidth:300}}>{r.reply.slice(0,90)}{r.reply.length>90?'…':''}</td>
                      <td>
                        <button onClick={()=>{deleteBotResponse(r.id);showToast('Response deleted','info');}} style={{background:'rgba(239,68,68,.1)',border:'none',color:'#ef4444',borderRadius:6,padding:'.25rem .55rem',cursor:'pointer'}}>
                          <i className="bi bi-trash"></i>
                        </button>
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
