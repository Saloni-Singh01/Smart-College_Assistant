import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { generateQuestionsForQuiz } from '../../utils/quizQuestions';

export default function StudentQuizTake() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user, quizzes, quizSubmissions, submitQuizAttempt, showToast } = useApp();
  const qid = Number(quizId);
  const quiz = quizzes.find((x) => x.id === qid);

  const existing = quizSubmissions.find((s) => s.studentId === user?.id && s.quizId === qid);

  const questions = useMemo(() => (quiz ? generateQuestionsForQuiz(quiz) : []), [quiz]);
  const [answers, setAnswers] = useState(() => (existing ? questions.map(() => 0) : questions.map(() => null)));

  if (!quiz) {
    return (
      <div className="sca-card text-center py-5">
        <p>Quiz not found.</p>
        <Link to="/student/quizzes">Back to quizzes</Link>
      </div>
    );
  }

  if (quiz.status !== 'active') {
    return (
      <div className="sca-card text-center py-5">
        <p>This quiz is not open for attempts.</p>
        <Link to="/student/quizzes">Back</Link>
      </div>
    );
  }

  if (existing) {
    return (
      <div className="sca-card">
        <h1 className="page-title">{quiz.title}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>You already submitted this quiz.</p>
        <p style={{ fontWeight: 700, color: '#059669' }}>Score: {existing.score}/{existing.maxScore}</p>
        <Link to="/student/quizzes" className="btn-accent mt-3" style={{ display: 'inline-block', padding: '.5rem 1rem', borderRadius: 8, textDecoration: 'none' }}>Back to quizzes</Link>
      </div>
    );
  }

  const answered = answers.filter((a) => a !== null).length;
  const setAns = (qi, optIdx) => {
    setAnswers((prev) => {
      const n = [...prev];
      n[qi] = optIdx;
      return n;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answered < questions.length) {
      showToast('Answer all questions before submitting.', 'info');
      return;
    }
    let score = 0;
    questions.forEach((ques, i) => {
      if (answers[i] === ques.correctIndex) score += quiz.totalMarks / questions.length;
    });
    const rounded = Math.round(score * 10) / 10;
    const maxScore = quiz.totalMarks;
    submitQuizAttempt({
      studentId: user.id,
      studentName: user.name,
      rollNo: user.rollNo,
      quizId: quiz.id,
      quizTitle: quiz.title,
      subject: quiz.subject,
      score: rounded,
      maxScore,
    });
    showToast('Quiz submitted successfully', 'success');
    navigate('/student/quizzes');
  };

  return (
    <div>
      <div className="mb-4">
        <Link to="/student/quizzes" style={{ fontSize: '.82rem', color: 'var(--text-secondary)' }}>← Back to quizzes</Link>
        <h1 className="page-title mt-2">{quiz.title}</h1>
        <p className="page-subtitle">{quiz.subject} · {questions.length} questions · {quiz.duration}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="d-flex flex-column gap-4">
          {questions.map((ques, qi) => (
            <div key={ques.id} className="sca-card">
              <p style={{ fontWeight: 600, fontSize: '.9rem', marginBottom: '1rem' }}>{ques.prompt}</p>
              <div className="d-flex flex-column gap-2">
                {ques.options.map((opt, oi) => (
                  <label
                    key={oi}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '.65rem',
                      padding: '.65rem .85rem',
                      borderRadius: 8,
                      border: answers[qi] === oi ? '2px solid #2563eb' : '1px solid var(--border)',
                      background: answers[qi] === oi ? 'rgba(37,99,235,.06)' : 'var(--bg-primary)',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name={`q-${qi}`}
                      checked={answers[qi] === oi}
                      onChange={() => setAns(qi, oi)}
                      style={{ marginTop: 3 }}
                    />
                    <span style={{ fontSize: '.85rem', color: 'var(--text-secondary)' }}>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="sca-card mt-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
          <span style={{ fontSize: '.85rem', color: 'var(--text-muted)' }}>{answered}/{questions.length} answered</span>
          <button type="submit" className="btn-accent" style={{ padding: '.65rem 1.5rem', borderRadius: 8 }}>
            Submit quiz
          </button>
        </div>
      </form>
    </div>
  );
}
