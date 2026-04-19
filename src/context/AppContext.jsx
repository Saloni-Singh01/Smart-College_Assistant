// context/AppContext.jsx — Global state management (RBAC version)
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AppContext = createContext(null);

const LS_USERS = 'sca_users';
const LS_EVENT_REGS = 'sca_event_registrations';
const LS_QUIZ_SUB = 'sca_quiz_submissions';

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return fallback;
}

/** Persisted user row may include password; session user must never include it. */
export function sessionUser(u) {
  if (!u) return null;
  const { password: _p, ...safe } = u;
  return safe;
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const seedUsers = [
  { id: 1, name: 'Dr. Priya Mehta',   email: 'admin@college.edu',   password: 'admin123',   role: 'admin',   dept: 'Administration', phone: '+91-98100-00001', joinDate: '2018-07-01', avatar: 'PM' },
  { id: 2, name: 'Prof. Ramesh Kumar', email: 'faculty@college.edu', password: 'faculty123', role: 'faculty', dept: 'Computer Science', phone: '+91-98100-00002', joinDate: '2019-08-15', avatar: 'RK' },
  { id: 3, name: 'Arjun Sharma',       email: 'student@college.edu', password: 'student123', role: 'student', dept: 'B.Tech CS – Sem 5',  phone: '+91-98100-00003', joinDate: '2022-07-20', avatar: 'AS', rollNo: 'BT22CS045', cgpa: '8.7' },
  { id: 4, name: 'Sneha Patel',        email: 'sneha@college.edu',   password: 'student123', role: 'student', dept: 'B.Tech CS – Sem 5',  phone: '+91-98100-00004', joinDate: '2022-07-20', avatar: 'SP', rollNo: 'BT22CS046', cgpa: '9.1' },
  { id: 5, name: 'Prof. Anita Singh',  email: 'anita@college.edu',   password: 'faculty123', role: 'faculty', dept: 'Mathematics',        phone: '+91-98100-00005', joinDate: '2020-01-10', avatar: 'AS' },
];

const seedAnnouncements = [
  { id: 1, title: 'End Semester Examination Schedule Released', content: 'The timetable for End Semester Examinations (Nov–Dec 2024) has been published. Students can check their hall tickets from the student portal.', tag: 'Exam', tagColor: '#ef4444', date: '2024-11-15', author: 'Examination Cell', priority: 'high' },
  { id: 2, title: 'Campus Placement Drive — Infosys', content: 'Infosys will be visiting for campus recruitment on Nov 22nd. Eligible: All B.Tech 2025 batch students with 60%+ aggregate. Register by Nov 18.', tag: 'Placement', tagColor: '#2563eb', date: '2024-11-12', author: 'Placement Cell', priority: 'high' },
  { id: 3, title: 'Annual Tech Fest — TechNova 2024', content: 'Register now for TechNova 2024 happening on Dec 5–7. Events: Hackathon, Robotics, Paper Presentation, and more. Prizes worth ₹2 Lakhs!', tag: 'Event', tagColor: '#059669', date: '2024-11-10', author: 'Student Council', priority: 'medium' },
  { id: 4, title: 'Library Hours Extended During Exam Season', content: 'Central Library will remain open till 11 PM from November 20th to December 10th.', tag: 'General', tagColor: '#7c3aed', date: '2024-11-08', author: 'Library Committee', priority: 'low' },
  { id: 5, title: 'Fee Payment Deadline — December 1st', content: 'Last date to pay second semester fees is December 1st, 2024. Late fee fine of ₹500/week will be applicable after the due date.', tag: 'Finance', tagColor: '#d97706', date: '2024-11-05', author: 'Finance Office', priority: 'high' },
];

const seedEvents = [
  { id: 1, title: 'TechNova 2024 — Annual Tech Fest', day: '05', month: 'Dec', time: '9:00 AM', location: 'Main Auditorium', category: 'Tech',      description: 'Annual college tech festival with Hackathon, Robotics and more. Prizes worth ₹2 Lakhs!' },
  { id: 2, title: 'Infosys Campus Placement Drive',   day: '22', month: 'Nov', time: '10:00 AM', location: 'Seminar Hall',   category: 'Placement', description: 'Campus drive for B.Tech 2025 batch. Eligibility: 60%+ aggregate.' },
  { id: 3, title: 'Blood Donation Camp',               day: '28', month: 'Nov', time: '11:00 AM', location: 'Sports Ground',  category: 'Social',    description: 'Voluntary blood donation camp organized by NSS unit.' },
  { id: 4, title: 'Cultural Evening — Swaranjali',    day: '10', month: 'Dec', time: '6:00 PM',  location: 'Open Air Theater', category: 'Cultural', description: 'Annual cultural evening featuring music, dance, and drama performances.' },
];

const seedQuizzes = [
  { id: 1, title: 'Data Structures — Unit 2 Quiz', subject: 'Data Structures', facultyId: 2, totalMarks: 20, duration: '30 mins', dueDate: '2024-11-20', questions: 10, status: 'active' },
  { id: 2, title: 'OS Concepts — Mid Term', subject: 'Operating Systems', facultyId: 2, totalMarks: 50, duration: '60 mins', dueDate: '2024-11-25', questions: 25, status: 'active' },
  { id: 3, title: 'Maths — Calculus Test', subject: 'Mathematics III', facultyId: 5, totalMarks: 30, duration: '45 mins', dueDate: '2024-11-18', questions: 15, status: 'closed' },
];

const seedResults = [
  { id: 1, studentId: 3, studentName: 'Arjun Sharma',  rollNo: 'BT22CS045', subject: 'Data Structures',  marks: 78, total: 100, grade: 'A',  exam: 'Mid Term', date: '2024-10-15' },
  { id: 2, studentId: 4, studentName: 'Sneha Patel',   rollNo: 'BT22CS046', subject: 'Data Structures',  marks: 91, total: 100, grade: 'A+', exam: 'Mid Term', date: '2024-10-15' },
  { id: 3, studentId: 3, studentName: 'Arjun Sharma',  rollNo: 'BT22CS045', subject: 'Mathematics III',  marks: 65, total: 100, grade: 'B',  exam: 'Mid Term', date: '2024-10-16' },
  { id: 4, studentId: 4, studentName: 'Sneha Patel',   rollNo: 'BT22CS046', subject: 'Mathematics III',  marks: 88, total: 100, grade: 'A',  exam: 'Mid Term', date: '2024-10-16' },
  { id: 5, studentId: 3, studentName: 'Arjun Sharma',  rollNo: 'BT22CS045', subject: 'Operating Systems', marks: 82, total: 100, grade: 'A',  exam: 'Mid Term', date: '2024-10-17' },
  { id: 6, studentId: 4, studentName: 'Sneha Patel',   rollNo: 'BT22CS046', subject: 'Operating Systems', marks: 95, total: 100, grade: 'A+', exam: 'Mid Term', date: '2024-10-17' },
];

const seedBotResponses = [
  { id: 1,  keywords: ['admission', 'apply', 'enroll', 'join', 'application'], reply: '🎓 Admissions are open! Apply online at our portal. Required: 10th & 12th marksheets, ID proof, passport photos. Deadline: June 30th.' },
  { id: 2,  keywords: ['fee', 'fees', 'cost', 'tuition', 'payment', 'pay'],    reply: '💰 Fee structure 2024-25:\n• B.Tech: ₹1,20,000/year\n• BCA: ₹60,000/year\n• MBA: ₹1,50,000/year\nPay online via student portal or at finance office.' },
  { id: 3,  keywords: ['course', 'courses', 'program', 'subjects', 'department'], reply: '📚 Programs: B.Tech (CS/IT/ECE/ME/CE), BCA & MCA, MBA & BBA, B.Sc. All AICTE & UGC approved!' },
  { id: 4,  keywords: ['hostel', 'accommodation', 'stay', 'dorm', 'room'],      reply: '🏠 Hostel for boys & girls. Capacity: 500 students. Wi-Fi, laundry, mess, 24/7 security. Contact: hostel@college.edu' },
  { id: 5,  keywords: ['library', 'books', 'study', 'reading'],                 reply: '📖 50,000+ books, e-journals, 200 reading seats. Mon–Sat 8AM–9PM, Sun 10AM–5PM.' },
  { id: 6,  keywords: ['placement', 'job', 'career', 'recruit', 'campus'],      reply: '💼 95%+ placement. Top recruiters: TCS, Infosys, Amazon, Google. Avg CTC: ₹6.5 LPA. Highest: ₹42 LPA.' },
  { id: 7,  keywords: ['scholarship', 'merit', 'financial', 'aid'],             reply: '🏆 Merit: Top 5% (50% waiver). Govt SC/ST/OBC schemes. Sports scholarship for national players.' },
  { id: 8,  keywords: ['exam', 'result', 'grade', 'mark', 'test'],              reply: '📝 Schedule posted 4 weeks before exams. Results within 30 days. Revaluation: apply within 10 days.' },
  { id: 9,  keywords: ['timing', 'time', 'schedule', 'hours', 'timetable'],     reply: '⏰ College: 8AM–5PM Mon–Sat. Admin office: 9AM–5PM. Cafeteria: 7:30AM–6:30PM.' },
  { id: 10, keywords: ['contact', 'phone', 'email', 'address', 'location'],     reply: '📞 +91-172-XXXXXXX | info@smartcollege.edu | Sector 26, Chandigarh – 160019' },
  { id: 11, keywords: ['hello', 'hi', 'hey', 'greet'],                          reply: '👋 Hello! I am Aria, your Smart College Assistant. Ask me about admissions, fees, courses, placements, and more!' },
  { id: 12, keywords: ['bye', 'goodbye', 'thanks', 'thank you'],                reply: '😊 You\'re welcome! Have a great day! 🎓' },
];

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }) {
  const [user, setUser]               = useState(() => { try { return JSON.parse(localStorage.getItem('sca_user')); } catch { return null; } });
  const [theme, setTheme]             = useState(() => localStorage.getItem('sca_theme') || 'light');
  const [users, setUsers]             = useState(() => loadJson(LS_USERS, seedUsers));
  const [announcements, setAnn]       = useState(seedAnnouncements);
  const [events, setEvents]           = useState(seedEvents);
  const [quizzes, setQuizzes]         = useState(seedQuizzes);
  const [results, setResults]         = useState(seedResults);
  const [botResponses, setBotResp]    = useState(seedBotResponses);
  const [messages, setMessages]       = useState([{ id: 1, from: 'bot', text: '👋 Hi! I\'m Aria, your Smart College Assistant. Ask me about admissions, fees, courses, placements, and more!', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
  const [eventRegistrations, setEventRegistrations] = useState(() => loadJson(LS_EVENT_REGS, []));
  const [quizSubmissions, setQuizSubmissions]       = useState(() => loadJson(LS_QUIZ_SUB, []));
  const [toasts, setToasts]           = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { localStorage.setItem(LS_USERS, JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem(LS_EVENT_REGS, JSON.stringify(eventRegistrations)); }, [eventRegistrations]);
  useEffect(() => { localStorage.setItem(LS_QUIZ_SUB, JSON.stringify(quizSubmissions)); }, [quizSubmissions]);

  // Theme apply
  React.useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

  const toggleTheme = useCallback(() => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('sca_theme', next);
  }, [theme]);

  // Auth — never persist password in sca_user
  const login = useCallback((userData) => {
    const safe = sessionUser(userData) || userData;
    setUser(safe);
    localStorage.setItem('sca_user', JSON.stringify(safe));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('sca_user');
    setMessages([{ id: 1, from: 'bot', text: '👋 Hi! I\'m Aria, your Smart College Assistant.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
  }, []);

  const updateProfile = useCallback((data) => {
    const updated = { ...user, ...data };
    const safe = sessionUser(updated);
    setUser(safe);
    localStorage.setItem('sca_user', JSON.stringify(safe));
    setUsers(prev => prev.map(u => u.id === updated.id ? { ...u, ...data } : u));
  }, [user]);

  // Toast
  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  // Chatbot
  const sendMessage = useCallback((text) => {
    const userMsg = { id: Date.now(), from: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setTimeout(() => {
      const lower = text.toLowerCase();
      const match = botResponses.find(r => r.keywords.some(kw => lower.includes(kw)));
      setMessages(prev => [...prev, {
        id: Date.now() + 1, from: 'bot',
        text: match?.reply ?? "🤔 I'm not sure about that. Contact us at info@smartcollege.edu or +91-172-XXXXXXX.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1100);
  }, [botResponses]);

  // Announcements CRUD
  const addAnnouncement    = useCallback((a) => setAnn(p => [{ ...a, id: Date.now() }, ...p]), []);
  const updateAnnouncement = useCallback((id, data) => setAnn(p => p.map(a => a.id === id ? { ...a, ...data } : a)), []);
  const deleteAnnouncement = useCallback((id) => setAnn(p => p.filter(a => a.id !== id)), []);

  // Events CRUD
  const addEvent    = useCallback((e) => setEvents(p => [{ ...e, id: Date.now() }, ...p]), []);
  const updateEvent = useCallback((id, data) => setEvents(p => p.map(e => e.id === id ? { ...e, ...data } : e)), []);
  const deleteEvent = useCallback((id) => setEvents(p => p.filter(e => e.id !== id)), []);

  /** Toggle registration for the current student; includes student + event details for the admin dashboard. */
  const registerForEvent = useCallback((payload) => {
    setEventRegistrations((prev) => {
      const exists = prev.some((r) => r.eventId === payload.eventId && r.studentId === payload.studentId);
      if (exists) return prev.filter((r) => !(r.eventId === payload.eventId && r.studentId === payload.studentId));
      return [...prev, { id: Date.now(), registeredAt: new Date().toISOString(), ...payload }];
    });
  }, []);

  // Quizzes CRUD
  const addQuiz    = useCallback((q) => setQuizzes(p => [{ ...q, id: Date.now() }, ...p]), []);
  const updateQuiz = useCallback((id, data) => setQuizzes(p => p.map(q => q.id === id ? { ...q, ...data } : q)), []);
  const deleteQuiz = useCallback((id) => setQuizzes(p => p.filter(q => q.id !== id)), []);

  // Results CRUD
  const addResult    = useCallback((r) => setResults(p => [{ ...r, id: Date.now() }, ...p]), []);
  const updateResult = useCallback((id, data) => setResults(p => p.map(r => r.id === id ? { ...r, ...data } : r)), []);
  const deleteResult = useCallback((id) => setResults(p => p.filter(r => r.id !== id)), []);

  // Bot CRUD
  const addBotResponse    = useCallback((r) => setBotResp(p => [...p, { ...r, id: Date.now() }]), []);
  const deleteBotResponse = useCallback((id) => setBotResp(p => p.filter(r => r.id !== id)), []);

  // User management (admin / faculty signup)
  const addUser = useCallback((u) => {
    setUsers((p) => [...p, { ...u, id: u.id ?? Date.now() }]);
  }, []);
  const deleteUser = useCallback((id) => setUsers((p) => p.filter((x) => x.id !== id)), []);

  const submitQuizAttempt = useCallback((row) => {
    setQuizSubmissions((prev) => {
      const next = prev.filter((s) => !(s.studentId === row.studentId && s.quizId === row.quizId));
      return [...next, { ...row, id: Date.now(), submittedAt: new Date().toISOString() }];
    });
  }, []);

  return (
    <AppContext.Provider value={{
      user, login, logout, updateProfile,
      theme, toggleTheme,
      users, addUser, deleteUser,
      announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement,
      events, addEvent, updateEvent, deleteEvent,
      eventRegistrations, registerForEvent,
      quizSubmissions, submitQuizAttempt,
      quizzes, addQuiz, updateQuiz, deleteQuiz,
      results, addResult, updateResult, deleteResult,
      botResponses, addBotResponse, deleteBotResponse,
      messages, sendMessage,
      toasts, showToast,
      sidebarOpen, setSidebarOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
