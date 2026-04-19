// pages/faculty/FacultyResults.jsx — Upload and manage student results
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const SUBJECTS = ['Data Structures', 'Operating Systems', 'Mathematics III', 'Computer Networks', 'Elective', 'Project Work'];
const EXAMS    = ['Mid Term', 'End Term', 'Quiz', 'Assignment', 'Practical'];

const getGrade = (marks, total) => {
  const pct = (marks / total) * 100;
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B';
  if (pct >= 60) return 'C';
  if (pct >= 50) return 'D';
  return 'F';
};

const gradeColor = { 'A+': '#059669', A: '#2563eb', B: '#d97706', C: '#f97316', D: '#ef4444', F: '#7f1d1d' };

const blank = () => ({ studentName: '', rollNo: '', subject: SUBJECTS[0], marks: '', total: 100, exam: 'Mid Term', date: '' });

export default function FacultyResults() {
  const { results, addResult, updateResult, deleteResult, users, showToast } = useApp();
  const students = users.filter(u => u.role === 'student');

  const [form, setForm]       = useState(blank());
  const [editing, setEditing] = useState(null);
  const [errors, setErrors]   = useState({});
  const [confirm, setConfirm] = useState(null);
  const [filterSub, setFilterSub] = useState('All');
  const [search, setSearch]   = useState('');

  const validate = () => {
    const e = {};
    if (!form.studentName.trim()) e.studentName = 'Student name required';
    if (!form.rollNo.trim())      e.rollNo = 'Roll no. required';
    if (form.marks === '' || isNaN(form.marks)) e.marks = 'Enter valid marks';
    else if (Number(form.marks) > Number(form.total)) e.marks = `Marks cannot exceed ${form.total}`;
    if (!form.date) e.date = 'Date required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const marks = Number(form.marks);
    const total = Number(form.total);
    const data = { ...form, marks, total, grade: getGrade(marks, total) };
    if (editing) { updateResult(editing, data); showToast('Result updated ✅', 'info'); }
    else         { addResult(data);              showToast('Result added ✅', 'success'); }
    setForm(blank()); setEditing(null); setErrors({});
  };

  const startEdit = (r) => {
    setForm({ studentName: r.studentName, rollNo: r.rollNo, subject: r.subject, marks: r.marks, total: r.total, exam: r.exam, date: r.date });
    setEditing(r.id);
  };

  const fillStudent = (s) => {
    setForm(p => ({ ...p, studentName: s.name, rollNo: s.rollNo || '' }));
  };

  const ch = (k, v) => { setForm(p => ({ ...p, [k]: v })); if (errors[k]) setErrors(p => ({ ...p, [k]: '' })); };

  const filtered = results.filter(r => {
    const matchSub = filterSub === 'All' || r.subject === filterSub;
    const matchSearch = !search || r.studentName.toLowerCase().includes(search.toLowerCase()) || r.rollNo.toLowerCase().includes(search.toLowerCase());
    return matchSub && matchSearch;
  });

  return (
    <div>
      <div className="mb-4">
        <h1 className="page-title">Results & Marks</h1>
        <p className="page-subtitle">Upload and manage student examination results</p>
      </div>

      <div className="row g-4">
        {/* Form */}
        <div className="col-lg-4">
          <div className="sca-card">
            <h2 className="sca-card-title mb-4">
              <i className={`bi bi-${editing ? 'pencil-fill' : 'plus-circle-fill'} me-2`} style={{ color: '#d97706' }}></i>
              {editing ? 'Edit Result' : 'Add Result'}
            </h2>

            {/* Quick fill from student list */}
            {!editing && students.length > 0 && (
              <div className="mb-3">
                <label className="form-label">Quick Fill — Select Student</label>
                <select className="form-select" onChange={e => { const s = students.find(st => st.id === Number(e.target.value)); if (s) fillStudent(s); }} defaultValue="">
                  <option value="" disabled>Select student…</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name} {s.rollNo ? `(${s.rollNo})` : ''}</option>)}
                </select>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label">Student Name *</label>
                <input className={`form-control ${errors.studentName ? 'is-invalid' : ''}`} placeholder="Full name" value={form.studentName} onChange={e => ch('studentName', e.target.value)} />
                {errors.studentName && <div className="invalid-feedback">{errors.studentName}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Roll No. *</label>
                <input className={`form-control ${errors.rollNo ? 'is-invalid' : ''}`} placeholder="e.g. BT22CS045" value={form.rollNo} onChange={e => ch('rollNo', e.target.value)} />
                {errors.rollNo && <div className="invalid-feedback">{errors.rollNo}</div>}
              </div>
              <div className="row g-2 mb-3">
                <div className="col">
                  <label className="form-label">Subject</label>
                  <select className="form-select" value={form.subject} onChange={e => ch('subject', e.target.value)}>
                    {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col">
                  <label className="form-label">Exam Type</label>
                  <select className="form-select" value={form.exam} onChange={e => ch('exam', e.target.value)}>
                    {EXAMS.map(x => <option key={x}>{x}</option>)}
                  </select>
                </div>
              </div>
              <div className="row g-2 mb-3">
                <div className="col">
                  <label className="form-label">Marks Obtained *</label>
                  <input type="number" className={`form-control ${errors.marks ? 'is-invalid' : ''}`} min={0} max={form.total} placeholder="e.g. 78" value={form.marks} onChange={e => ch('marks', e.target.value)} />
                  {errors.marks && <div className="invalid-feedback">{errors.marks}</div>}
                </div>
                <div className="col">
                  <label className="form-label">Out Of</label>
                  <input type="number" className="form-control" min={1} value={form.total} onChange={e => ch('total', e.target.value)} />
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label">Exam Date *</label>
                <input type="date" className={`form-control ${errors.date ? 'is-invalid' : ''}`} value={form.date} onChange={e => ch('date', e.target.value)} />
                {errors.date && <div className="invalid-feedback">{errors.date}</div>}
              </div>

              {/* Live grade preview */}
              {form.marks !== '' && !isNaN(form.marks) && (
                <div style={{ padding: '.75rem', borderRadius: 8, background: 'var(--bg-primary)', border: '1px solid var(--border)', marginBottom: '1rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '.78rem', color: 'var(--text-muted)' }}>Predicted Grade: </span>
                  <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.4rem', fontWeight: 800, color: gradeColor[getGrade(Number(form.marks), Number(form.total))] }}>
                    {getGrade(Number(form.marks), Number(form.total))}
                  </span>
                  <span style={{ fontSize: '.78rem', color: 'var(--text-muted)', marginLeft: '.5rem' }}>
                    ({Math.round((Number(form.marks) / Number(form.total)) * 100)}%)
                  </span>
                </div>
              )}

              <div className="d-flex gap-2">
                <button type="submit" className="btn-accent" style={{ flex: 1, padding: '.6rem', borderRadius: 8 }}>
                  {editing ? 'Update' : 'Save Result'}
                </button>
                {editing && (
                  <button type="button" className="btn-outline-accent" style={{ padding: '.6rem .9rem', borderRadius: 8 }}
                    onClick={() => { setForm(blank()); setEditing(null); setErrors({}); }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Results table */}
        <div className="col-lg-8">
          <div className="sca-card">
            <div className="sca-card-header">
              <h2 className="sca-card-title">
                All Results
                <span style={{ fontSize: '.75rem', background: '#d97706', color: '#fff', borderRadius: 20, padding: '.1rem .5rem', marginLeft: '.4rem' }}>{results.length}</span>
              </h2>
              <input className="form-control" style={{ width: 180 }} placeholder="Search student…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {/* Subject filter */}
            <div className="d-flex gap-2 flex-wrap mb-3">
              {['All', ...SUBJECTS].map(s => (
                <button key={s} onClick={() => setFilterSub(s)} style={{
                  padding: '.25rem .7rem', borderRadius: 20, cursor: 'pointer', border: filterSub === s ? 'none' : '1.5px solid var(--border)',
                  background: filterSub === s ? '#d97706' : 'transparent', color: filterSub === s ? '#fff' : 'var(--text-secondary)',
                  fontWeight: 600, fontSize: '.72rem'
                }}>{s === 'All' ? 'All Subjects' : s}</button>
              ))}
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="table admin-table mb-0">
                <thead>
                  <tr><th>Student</th><th>Roll No</th><th>Subject</th><th>Exam</th><th>Marks</th><th>Grade</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} className="text-center py-4" style={{ color: 'var(--text-muted)' }}>No results found</td></tr>
                  )}
                  {filtered.map(r => {
                    const pct = Math.round((r.marks / r.total) * 100);
                    const gc = gradeColor[r.grade] || '#9aa0b4';
                    return (
                      <tr key={r.id}>
                        <td style={{ fontWeight: 600, fontSize: '.875rem' }}>{r.studentName}</td>
                        <td style={{ fontSize: '.8rem', color: 'var(--text-secondary)' }}>{r.rollNo}</td>
                        <td><span className="sca-badge" style={{ background: 'rgba(37,99,235,.1)', color: '#2563eb', fontSize: '.68rem' }}>{r.subject}</span></td>
                        <td style={{ fontSize: '.8rem', color: 'var(--text-secondary)' }}>{r.exam}</td>
                        <td>
                          <div style={{ fontSize: '.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{r.marks}/{r.total}</div>
                          <div style={{ fontSize: '.68rem', color: 'var(--text-muted)' }}>{pct}%</div>
                        </td>
                        <td>
                          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1rem', color: gc }}>{r.grade}</span>
                        </td>
                        <td>
                          {confirm === r.id ? (
                            <div className="d-flex gap-1">
                              <button onClick={() => { deleteResult(r.id); showToast('Result deleted', 'info'); setConfirm(null); }}
                                style={{ background: '#ef4444', border: 'none', color: '#fff', borderRadius: 6, padding: '.2rem .45rem', cursor: 'pointer', fontSize: '.75rem' }}>Del</button>
                              <button onClick={() => setConfirm(null)}
                                style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 6, padding: '.2rem .45rem', cursor: 'pointer', fontSize: '.75rem' }}>No</button>
                            </div>
                          ) : (
                            <div className="d-flex gap-1">
                              <button onClick={() => startEdit(r)} style={{ background: 'rgba(37,99,235,.1)', border: 'none', color: '#2563eb', borderRadius: 6, padding: '.25rem .45rem', cursor: 'pointer' }}><i className="bi bi-pencil"></i></button>
                              <button onClick={() => setConfirm(r.id)} style={{ background: 'rgba(239,68,68,.1)', border: 'none', color: '#ef4444', borderRadius: 6, padding: '.25rem .45rem', cursor: 'pointer' }}><i className="bi bi-trash"></i></button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
