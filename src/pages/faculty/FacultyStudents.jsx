// pages/faculty/FacultyStudents.jsx — Student list view for faculty
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function FacultyStudents() {
  const { users, results } = useApp();
  const students = users.filter(u => u.role === 'student');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = students.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.rollNo || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const getStudentResults = (studentId, studentName) =>
    results.filter(r => r.studentId === studentId || r.studentName === studentName);

  const getAvgMarks = (res) =>
    res.length ? Math.round(res.reduce((s, r) => s + (r.marks / r.total) * 100, 0) / res.length) : null;

  const gradeColor = { 'A+': '#059669', A: '#2563eb', B: '#d97706', C: '#f97316', D: '#ef4444', F: '#7f1d1d' };

  return (
    <div>
      <div className="mb-4">
        <h1 className="page-title">My Students</h1>
        <p className="page-subtitle">{students.length} students enrolled this semester</p>
      </div>

      <div className="row g-4">
        {/* Student list */}
        <div className={selected ? 'col-lg-5' : 'col-12'}>
          <div className="sca-card">
            <div className="sca-card-header">
              <h2 className="sca-card-title">
                Student Directory
                <span style={{ fontSize: '.75rem', background: '#059669', color: '#fff', borderRadius: 20, padding: '.1rem .5rem', marginLeft: '.4rem' }}>{filtered.length}</span>
              </h2>
              <input className="form-control" style={{ width: 200 }} placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-people" style={{ fontSize: '2rem', color: 'var(--text-muted)' }}></i>
                <p style={{ color: 'var(--text-muted)', marginTop: '.75rem' }}>No students found</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {filtered.map(s => {
                  const res = getStudentResults(s.id, s.name);
                  const avg = getAvgMarks(res);
                  const isSelected = selected?.id === s.id;
                  return (
                    <div key={s.id}
                      onClick={() => setSelected(isSelected ? null : s)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '1rem',
                        padding: '.85rem 1rem', borderRadius: 10, cursor: 'pointer',
                        background: isSelected ? 'rgba(5,150,105,.06)' : 'var(--bg-primary)',
                        border: `1.5px solid ${isSelected ? '#059669' : 'var(--border)'}`,
                        transition: 'all .15s'
                      }}>
                      {/* Avatar */}
                      <div style={{
                        width: 42, height: 42, borderRadius: '50%', background: '#059669',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '.85rem', fontWeight: 700, color: '#fff', flexShrink: 0
                      }}>
                        {s.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 700, fontSize: '.875rem', margin: 0, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</p>
                        <p style={{ fontSize: '.72rem', color: 'var(--text-muted)', margin: 0 }}>
                          {s.rollNo || 'No roll no.'} · {s.dept || 'Dept. unknown'}
                        </p>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        {avg !== null ? (
                          <>
                            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '.95rem', color: avg >= 75 ? '#059669' : avg >= 50 ? '#d97706' : '#ef4444' }}>{avg}%</div>
                            <div style={{ fontSize: '.65rem', color: 'var(--text-muted)' }}>avg score</div>
                          </>
                        ) : (
                          <span style={{ fontSize: '.72rem', color: 'var(--text-muted)' }}>No results</span>
                        )}
                      </div>

                      <i className={`bi bi-chevron-${isSelected ? 'left' : 'right'}`} style={{ color: 'var(--text-muted)', fontSize: '.8rem', flexShrink: 0 }}></i>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Student detail panel */}
        {selected && (() => {
          const res = getStudentResults(selected.id, selected.name);
          const avg = getAvgMarks(res);
          return (
            <div className="col-lg-7">
              <div className="sca-card">
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                    {selected.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>{selected.name}</h3>
                    <p style={{ fontSize: '.8rem', color: 'var(--text-muted)', margin: '.15rem 0 0' }}>{selected.email}</p>
                    <div className="d-flex gap-2 mt-1 flex-wrap">
                      {selected.rollNo && <span className="sca-badge" style={{ background: 'rgba(5,150,105,.1)', color: '#059669' }}>{selected.rollNo}</span>}
                      {selected.dept   && <span className="sca-badge" style={{ background: 'rgba(37,99,235,.1)', color: '#2563eb' }}>{selected.dept}</span>}
                      {selected.cgpa   && <span className="sca-badge" style={{ background: 'rgba(217,119,6,.1)', color: '#d97706' }}>CGPA {selected.cgpa}</span>}
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem' }}>
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>

                {/* Stats row */}
                <div className="row g-3 mb-4">
                  {[
                    { label: 'Exams Taken', value: res.length,           color: '#2563eb' },
                    { label: 'Avg Score',   value: avg !== null ? `${avg}%` : '—', color: '#059669' },
                    { label: 'Best Grade',  value: res.length ? [...res].sort((a, b) => b.marks / b.total - a.marks / a.total)[0].grade : '—', color: '#d97706' },
                  ].map(s => (
                    <div key={s.label} className="col-4">
                      <div style={{ textAlign: 'center', padding: '.75rem', borderRadius: 10, background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: '.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Results list */}
                <h3 style={{ fontSize: '.9rem', fontWeight: 700, marginBottom: '1rem' }}>Examination Results</h3>
                {res.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="bi bi-clipboard-x" style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}></i>
                    <p style={{ color: 'var(--text-muted)', marginTop: '.5rem', fontSize: '.875rem' }}>No results recorded for this student yet.</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {res.map(r => {
                      const pct = Math.round((r.marks / r.total) * 100);
                      const gc = gradeColor[r.grade] || '#9aa0b4';
                      return (
                        <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '.75rem 1rem', borderRadius: 8, background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: 600, fontSize: '.82rem', margin: 0 }}>{r.subject}</p>
                            <p style={{ fontSize: '.72rem', color: 'var(--text-muted)', margin: 0 }}>{r.exam} · {r.date}</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 700, fontSize: '.875rem' }}>{r.marks}/{r.total}</div>
                            <div className="progress" style={{ height: 4, width: 80, margin: '.2rem 0' }}>
                              <div className="progress-bar" style={{ width: `${pct}%`, background: gc }}></div>
                            </div>
                          </div>
                          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.25rem', fontWeight: 800, color: gc, width: 32, textAlign: 'center' }}>{r.grade}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
