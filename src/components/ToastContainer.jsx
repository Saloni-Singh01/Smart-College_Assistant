import React from 'react';
import { useApp } from '../context/AppContext';
const icons={success:'bi-check-circle-fill',error:'bi-x-circle-fill',info:'bi-info-circle-fill',warning:'bi-exclamation-triangle-fill'};
export default function ToastContainer(){
  const{toasts}=useApp();
  return(<div className="toast-container-custom">{toasts.map(t=>(<div key={t.id} className={`sca-toast ${t.type}`}><i className={`bi ${icons[t.type]||icons.info}`} style={{fontSize:'1.1rem'}}></i><span style={{fontSize:'.875rem',fontWeight:500,color:'var(--text-primary)'}}>{t.message}</span></div>))}</div>);
}
