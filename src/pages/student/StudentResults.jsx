// pages/student/StudentResults.jsx — Student's own results dashboard
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const gradeColor = { 'A+': '#059669', A: '#2563eb', B: '#d97706', C: '#f97316', D: '#ef4444', F: '#7f1d1d' };
const gradeBg    = { 'A+': 'rgba(5,150,105,.1)', A: 'rgba(37,99,235,.1)', B: 'rgba(217,119,6,.1)', C: 'rgba(249,115,22,.1)', D: 'rgba(239,68,68,.1)', F: 'rgba(127,29,29,.1)' };

export default function StudentResults() {
  const { user, results, quizzes, quizSubmissions } = useApp();
  const [filterSub, setFilterSub] = useState('All');

  // Filter results belonging to this student
  const myResults = results.filter(r => r.studentId === user?.id || r.studentName === user?.name);
  const subjects  = [...new Set(myResults.map(r => r.subject))];

  const filtered  = filterSub === 'All' ? myResults : myResults.filter(r => r.subject === filterSub);

  const avgScore  = myResults.length ? Math.round(myResults.reduce((s, r) => s + (r.marks / r.total) * 100, 0) / myResults.length) : 0;
  const bestGrade = myResults.length ? [...myResults].sort((a, b) => b.marks / b.total - a.marks / a.total)[0] : null;
  const activeQuizzes = quizzes.filter(q => q.status === 'active');

  const getPerformanceLabel = (pct) => {
    if (pct >= 85) return { label: 'Excellent', color: '#059669' };
    if (pct >= 70) return { label: 'Good',      color: '#2563eb' };
    if (pct >= 55) return { label: 'Average',   color: '#d97706' };
    return { label: 'Needs Improvement', color: '#ef4444' };
  };

  const perf = getPerformanceLabel(avgScore);

  const quizDone = (qid) => quizSubmissions.some((s) => s.studentId === user?.id && s.quizId === qid);

  return (
    <div>
      <div className="mb-4">
        <h1 className="page-title">My Results</h1>
        <p className="page-subtitle">{myResults.length} exam results · {user?.name}</p>
      </div>

      {myResults.length > 0 && (
        <div className="row g-3 mb-4">
          {[
            { label: 'Exams Taken',  value: myResults.length, icon: 'bi-clipboard-check', color: '#2563eb', bg: 'rgba(37,99,235,.12)' },
            { label: 'Average Score',value: `${avgScore}%`,   icon: 'bi-bar-chart-fill',  color: perf.color, bg: `${perf.color}18` },
            { label: 'Best Score',   value: bestGrade ? `${Math.round((bestGrade.marks / bestGrade.total) * 100)}%` : '—', icon: 'bi-trophy-fill', color: '#d97706', bg: 'rgba(217,119,6,.12)' },
            { label: 'Performance',  value: perf.label,       icon: 'bi-star-fill',       color: perf.color, bg: `${perf.color}18` },
          ].map((s, i) => (
            <div key={i} className="col-6 col-xl-3">
              <div className="stat-card" style={{ '--accent-color': s.color }}>
                <div className="stat-icon" style={{ background: s.bg, color: s.color }}><i className={`bi ${s.icon}`}></i></div>
                <div className="stat-value" style={{ fontSize: typeof s.value === 'string' && s.value.length > 5 ? '1.3rem' : '2rem' }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-8">
          {myResults.length === 0 ? (
            <div className="sca-card text-center py-5">
              <i className="bi bi-clipboard-x" style={{ fontSize: '2.5rem', color: 'var(--text-muted)' }}></i>
              <p style={{ color: 'var(--text-muted)', marginTop: '1rem', fontSize: '.95rem' }}>No examination results yet.</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '.85rem' }}>Your faculty will publish marks after exams. You can still take online quizzes from the panel on the right.</p>
            </div>
          ) : (
            <div className="sca-card">
              <div className="sca-card-header">
                <h2 className="sca-card-title">Examination Results</h2>
              </div>

              <div className="d-flex gap-2 flex-wrap mb-3">
                {['All', ...subjects].map(s => (
                  <button key={s} onClick={() => setFilterSub(s)} style={{
                    padding: '.28rem .7rem', borderRadius: 20, cursor: 'pointer',
                    border: filterSub === s ? 'none' : '1.5px solid var(--border)',
                    background: filterSub === s ? '#2563eb' : 'transparent',
                    color: filterSub === s ? '#fff' : 'var(--text-secondary)',
                    fontWeight: 600, fontSize: '.72rem'
                  }}>{s}</button>
                ))}
              </div>

              <div className="d-flex flex-column gap-3">
                {filtered.map(r => {
                  const pct = Math.round((r.marks / r.total) * 100);
                  const gc  = gradeColor[r.grade] || '#9aa0b4';
                  const gb  = gradeBg[r.grade]    || 'rgba(154,160,180,.1)';
                  return (
                    <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: 10, background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                      <div style={{ width: 52, height: 52, borderRadius: 10, background: gb, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.4rem', fontWeight: 800, color: gc }}>{r.grade}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 700, fontSize: '.875rem', margin: 0, color: 'var(--text-primary)' }}>{r.subject}</p>
                        <p style={{ fontSize: '.72rem', color: 'var(--text-muted)', margin: '.15rem 0 .4rem' }}>{r.exam} · {r.date}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                          <div className="progress" style={{ height: 5, flex: 1 }}>
                            <div className="progress-bar" style={{ width: `${pct}%`, background: gc }}></div>
                          </div>
                          <span style={{ fontSize: '.7rem', fontWeight: 700, color: gc, minWidth: 30 }}>{pct}%</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{r.marks}</div>
                        <div style={{ fontSize: '.7rem', color: 'var(--text-muted)' }}>/{r.total}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="col-lg-4">
          {subjects.length > 0 && (
            <div className="sca-card mb-4">
              <h2 className="sca-card-title mb-3">Subject Performance</h2>
              {subjects.map(sub => {
                const subRes = myResults.filter(r => r.subject === sub);
                const avg    = Math.round(subRes.reduce((s, r) => s + (r.marks / r.total) * 100, 0) / subRes.length);
                const color  = avg >= 75 ? '#059669' : avg >= 55 ? '#d97706' : '#ef4444';
                return (
                  <div key={sub} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span style={{ fontSize: '.78rem', fontWeight: 600, color: 'var(--text-secondary)', flex: 1, marginRight: '.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</span>
                      <span style={{ fontSize: '.75rem', fontWeight: 700, color, flexShrink: 0 }}>{avg}%</span>
                    </div>
                    <div className="progress" style={{ height: 6 }}>
                      <div className="progress-bar" style={{ width: `${avg}%`, background: color }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="sca-card mb-3">
            <div className="sca-card-header">
              <h2 className="sca-card-title mb-0"><i className="bi bi-patch-question-fill me-2" style={{ color: '#d97706' }}></i>Online quizzes</h2>
              <Link to="/student/quizzes" style={{ fontSize: '.8rem', fontWeight: 600 }}>Open quiz hub →</Link>
            </div>
            {activeQuizzes.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '.85rem', margin: 0 }}>No active quizzes.</p>
            ) : (
              activeQuizzes.map(q => {
                const done = quizDone(q.id);
                const sub = quizSubmissions.find((s) => s.studentId === user?.id && s.quizId === q.id);
                return (
                  <div key={q.id} style={{ padding: '.65rem 0', borderBottom: '1px solid var(--border)' }}>
                    <div className="d-flex align-items-start justify-content-between gap-2">
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '.82rem', margin: 0 }}>{q.title}</p>
                        <p style={{ fontSize: '.7rem', color: 'var(--text-muted)', margin: '.1rem 0 0' }}>{q.questions} Qs · Due {q.dueDate}</p>
                        {done && sub && (
                          <p style={{ fontSize: '.72rem', color: '#059669', margin: '.25rem 0 0' }}>Score {sub.score}/{sub.maxScore}</p>
                        )}
                      </div>
                      {done ? (
                        <span className="sca-badge" style={{ background: 'rgba(5,150,105,.1)', color: '#059669', flexShrink: 0 }}>Done</span>
                      ) : (
                        <Link to={`/student/quizzes/${q.id}`} className="sca-badge" style={{ background: 'rgba(37,99,235,.12)', color: '#2563eb', flexShrink: 0, textDecoration: 'none' }}>Take</Link>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
