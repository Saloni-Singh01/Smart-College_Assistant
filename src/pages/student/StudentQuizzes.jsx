import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function StudentQuizzes() {
  const { user, quizzes, quizSubmissions } = useApp();
  const active = quizzes.filter((q) => q.status === 'active');

  const submission = (quizId) =>
    quizSubmissions.find((s) => s.studentId === user?.id && s.quizId === quizId);

  return (
    <div>
      <div className="mb-4">
        <h1 className="page-title">Quizzes</h1>
        <p className="page-subtitle">Take active quizzes published by your faculty</p>
      </div>

      {active.length === 0 ? (
        <div className="sca-card text-center py-5">
          <i className="bi bi-patch-question" style={{ fontSize: '2.5rem', color: 'var(--text-muted)' }}></i>
          <p style={{ color: 'var(--text-muted)', marginTop: '.75rem' }}>No active quizzes right now.</p>
        </div>
      ) : (
        <div className="row g-4">
          {active.map((q) => {
            const sub = submission(q.id);
            return (
              <div key={q.id} className="col-md-6 col-xl-4">
                <div className="sca-card h-100" style={{ borderTop: '3px solid #d97706' }}>
                  <span className="sca-badge mb-2" style={{ background: 'rgba(37,99,235,.12)', color: '#2563eb' }}>{q.subject}</span>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '.5rem 0' }}>{q.title}</h3>
                  <p style={{ fontSize: '.78rem', color: 'var(--text-muted)', marginBottom: '.75rem' }}>
                    {q.questions} questions · {q.totalMarks} marks · {q.duration} · Due {q.dueDate}
                  </p>
                  {sub ? (
                    <div>
                      <p style={{ fontSize: '.82rem', color: '#059669', fontWeight: 600, margin: 0 }}>
                        Submitted · Score {sub.score}/{sub.maxScore}
                      </p>
                      <p style={{ fontSize: '.72rem', color: 'var(--text-muted)', margin: '.25rem 0 0' }}>
                        {new Date(sub.submittedAt).toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <Link to={`/student/quizzes/${q.id}`} className="btn-accent" style={{ display: 'inline-block', padding: '.5rem 1rem', borderRadius: 8, textDecoration: 'none', marginTop: '.25rem' }}>
                      Start quiz
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
