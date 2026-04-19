// pages/faculty/FacultyQuiz.jsx — Quiz Management for Faculty
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const SUBJECTS = ['Data Structures', 'Operating Systems', 'Mathematics III', 'Computer Networks', 'Elective', 'Project Work'];
const blank = () => ({ title: '', subject: SUBJECTS[0], totalMarks: 20, duration: '30 mins', dueDate: '', questions: 10, status: 'active' });

export default function FacultyQuiz() {
  const { user, quizzes, addQuiz, updateQuiz, deleteQuiz, showToast } = useApp();
  const [form, setForm]       = useState(blank());
  const [editing, setEditing] = useState(null);
  const [errors, setErrors]   = useState({});
  const [confirm, setConfirm] = useState(null);

  // Only show quizzes created by this faculty
  const myQuizzes = quizzes.filter(q => q.facultyId === user?.id);

  const validate = () => {
    const e = {};
    if (!form.title.trim())  e.title   = 'Title is required';
    if (!form.dueDate)       e.dueDate = 'Due date is required';
    if (form.questions < 1)  e.questions = 'At least 1 question';
    if (form.totalMarks < 1) e.totalMarks = 'Marks must be > 0';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const data = { ...form, facultyId: user?.id, questions: Number(form.questions), totalMarks: Number(form.totalMarks) };
    if (editing) { updateQuiz(editing, data); showToast('Quiz updated ✅', 'info'); }
    else         { addQuiz(data);              showToast('Quiz created ✅', 'success'); }
    setForm(blank()); setEditing(null); setErrors({});
  };

  const startEdit = (q) => {
    setForm({ title: q.title, subject: q.subject, totalMarks: q.totalMarks, duration: q.duration, dueDate: q.dueDate, questions: q.questions, status: q.status });
    setEditing(q.id);
  };

  const ch = (k, v) => { setForm(p => ({ ...p, [k]: v })); if (errors[k]) setErrors(p => ({ ...p, [k]: '' })); };

  const statusColor = { active: '#059669', closed: '#9aa0b4', draft: '#d97706' };

  return (
    <div>
      <div className="mb-4">
        <h1 className="page-title">Quiz Management</h1>
        <p className="page-subtitle">Create and manage quizzes for your students</p>
      </div>

      <div className="row g-4">
        {/* Form */}
        <div className="col-lg-4">
          <div className="sca-card">
            <h2 className="sca-card-title mb-4">
              <i className={`bi bi-${editing ? 'pencil-fill' : 'plus-circle-fill'} me-2`} style={{ color: '#2563eb' }}></i>
              {editing ? 'Edit Quiz' : 'New Quiz'}
            </h2>
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label">Quiz Title *</label>
                <input className={`form-control ${errors.title ? 'is-invalid' : ''}`} placeholder="e.g. Data Structures — Unit 2" value={form.title} onChange={e => ch('title', e.target.value)} />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Subject</label>
                <select className="form-select" value={form.subject} onChange={e => ch('subject', e.target.value)}>
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="row g-2 mb-3">
                <div className="col">
                  <label className="form-label">Questions *</label>
                  <input type="number" className={`form-control ${errors.questions ? 'is-invalid' : ''}`} min={1} value={form.questions} onChange={e => ch('questions', e.target.value)} />
                  {errors.questions && <div className="invalid-feedback">{errors.questions}</div>}
                </div>
                <div className="col">
                  <label className="form-label">Total Marks *</label>
                  <input type="number" className={`form-control ${errors.totalMarks ? 'is-invalid' : ''}`} min={1} value={form.totalMarks} onChange={e => ch('totalMarks', e.target.value)} />
                  {errors.totalMarks && <div className="invalid-feedback">{errors.totalMarks}</div>}
                </div>
              </div>
              <div className="row g-2 mb-3">
                <div className="col">
                  <label className="form-label">Duration</label>
                  <input className="form-control" placeholder="30 mins" value={form.duration} onChange={e => ch('duration', e.target.value)} />
                </div>
                <div className="col">
                  <label className="form-label">Due Date *</label>
                  <input type="date" className={`form-control ${errors.dueDate ? 'is-invalid' : ''}`} value={form.dueDate} onChange={e => ch('dueDate', e.target.value)} />
                  {errors.dueDate && <div className="invalid-feedback">{errors.dueDate}</div>}
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status} onChange={e => ch('status', e.target.value)}>
                  <option value="draft">📝 Draft</option>
                  <option value="active">✅ Active</option>
                  <option value="closed">🔒 Closed</option>
                </select>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn-accent" style={{ flex: 1, padding: '.6rem', borderRadius: 8 }}>
                  {editing ? 'Update Quiz' : 'Create Quiz'}
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

        {/* Quiz list */}
        <div className="col-lg-8">
          <div className="sca-card">
            <div className="sca-card-header">
              <h2 className="sca-card-title">
                My Quizzes
                <span style={{ fontSize: '.75rem', background: '#2563eb', color: '#fff', borderRadius: 20, padding: '.1rem .5rem', marginLeft: '.4rem' }}>{myQuizzes.length}</span>
              </h2>
            </div>

            {myQuizzes.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-patch-question" style={{ fontSize: '2.5rem', color: 'var(--text-muted)' }}></i>
                <p style={{ color: 'var(--text-muted)', marginTop: '.75rem' }}>No quizzes yet. Create your first quiz!</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {myQuizzes.map(q => (
                  <div key={q.id} style={{ padding: '1.1rem', borderRadius: 10, background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                    <div className="d-flex align-items-start justify-content-between gap-3">
                      <div className="flex-1" style={{ minWidth: 0 }}>
                        <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                          <span className="sca-badge" style={{ background: 'rgba(37,99,235,.12)', color: '#2563eb' }}>{q.subject}</span>
                          <span className="sca-badge" style={{ background: `${statusColor[q.status]}18`, color: statusColor[q.status] }}>{q.status}</span>
                        </div>
                        <p style={{ fontWeight: 700, fontSize: '.9rem', margin: '.25rem 0', color: 'var(--text-primary)' }}>{q.title}</p>
                        <div className="d-flex gap-3 flex-wrap">
                          {[
                            { icon: 'bi-question-circle', text: `${q.questions} questions` },
                            { icon: 'bi-award',            text: `${q.totalMarks} marks` },
                            { icon: 'bi-clock',            text: q.duration },
                            { icon: 'bi-calendar-check',   text: `Due: ${q.dueDate}` },
                          ].map(d => (
                            <span key={d.icon} style={{ fontSize: '.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                              <i className={`bi ${d.icon}`}></i>{d.text}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="d-flex gap-1 flex-shrink-0">
                        {confirm === q.id ? (
                          <>
                            <button onClick={() => { deleteQuiz(q.id); showToast('Quiz deleted', 'info'); setConfirm(null); }}
                              style={{ background: '#ef4444', border: 'none', color: '#fff', borderRadius: 6, padding: '.25rem .55rem', cursor: 'pointer', fontSize: '.78rem' }}>Delete</button>
                            <button onClick={() => setConfirm(null)}
                              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 6, padding: '.25rem .55rem', cursor: 'pointer', fontSize: '.78rem' }}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(q)} style={{ background: 'rgba(37,99,235,.1)', border: 'none', color: '#2563eb', borderRadius: 6, padding: '.3rem .55rem', cursor: 'pointer' }} title="Edit"><i className="bi bi-pencil"></i></button>
                            <button onClick={() => { updateQuiz(q.id, { status: q.status === 'active' ? 'closed' : 'active' }); showToast(`Quiz ${q.status === 'active' ? 'closed' : 'activated'}`, 'info'); }}
                              style={{ background: 'rgba(5,150,105,.1)', border: 'none', color: '#059669', borderRadius: 6, padding: '.3rem .55rem', cursor: 'pointer' }} title="Toggle status">
                              <i className={`bi bi-${q.status === 'active' ? 'lock' : 'unlock'}`}></i>
                            </button>
                            <button onClick={() => setConfirm(q.id)} style={{ background: 'rgba(239,68,68,.1)', border: 'none', color: '#ef4444', borderRadius: 6, padding: '.3rem .55rem', cursor: 'pointer' }} title="Delete"><i className="bi bi-trash"></i></button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
