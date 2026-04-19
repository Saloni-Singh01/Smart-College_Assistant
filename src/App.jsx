// App.jsx — Role-Based Access Control Router
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

// Auth pages
import Login          from './pages/Login';
import Signup         from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';

// Shared pages (accessed by all roles via their own layout)
import Profile from './pages/Profile';
import Chat    from './pages/Chat';

// Admin pages
import AdminLayout       from './pages/admin/AdminLayout';
import AdminDashboard    from './pages/admin/AdminDashboard';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminEvents       from './pages/admin/AdminEvents';
import AdminUsers        from './pages/admin/AdminUsers';
import AdminChatbot      from './pages/admin/AdminChatbot';

// Faculty pages
import FacultyLayout    from './pages/faculty/FacultyLayout';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import FacultyQuiz      from './pages/faculty/FacultyQuiz';
import FacultyResults   from './pages/faculty/FacultyResults';
import FacultyStudents  from './pages/faculty/FacultyStudents';

// Student pages
import StudentLayout       from './pages/student/StudentLayout';
import StudentDashboard    from './pages/student/StudentDashboard';
import StudentAnnouncements from './pages/student/StudentAnnouncements';
import StudentEvents       from './pages/student/StudentEvents';
import StudentTimetable    from './pages/student/StudentTimetable';
import StudentResults      from './pages/student/StudentResults';
import StudentQuizzes      from './pages/student/StudentQuizzes';
import StudentQuizTake     from './pages/student/StudentQuizTake';
import StudentChat         from './pages/student/StudentChat';

// ── Guards ────────────────────────────────────────────────────────────────────
function RequireRole({ role, children }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) {
    const dest = user.role === 'admin' ? '/admin/dashboard'
               : user.role === 'faculty' ? '/faculty/dashboard'
               : '/student/dashboard';
    return <Navigate to={dest} replace />;
  }
  return children;
}

function RoleRedirect() {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin')   return <Navigate to="/admin/dashboard"   replace />;
  if (user.role === 'faculty') return <Navigate to="/faculty/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
}

// ── Routes ────────────────────────────────────────────────────────────────────
function AppRoutes() {
  const { user } = useApp();
  return (
    <Routes>
      {/* Public */}
      <Route path="/login"           element={user ? <RoleRedirect /> : <Login />} />
      <Route path="/signup"          element={user ? <RoleRedirect /> : <Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/"                element={<RoleRedirect />} />

      {/* ── ADMIN ── */}
      <Route path="/admin" element={<RequireRole role="admin"><AdminLayout /></RequireRole>}>
        <Route index                 element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"      element={<AdminDashboard />} />
        <Route path="announcements"  element={<AdminAnnouncements />} />
        <Route path="events"         element={<AdminEvents />} />
        <Route path="users"          element={<AdminUsers />} />
        <Route path="chatbot"        element={<AdminChatbot />} />
        <Route path="profile"        element={<Profile />} />
      </Route>

      {/* ── FACULTY ── */}
      <Route path="/faculty" element={<RequireRole role="faculty"><FacultyLayout /></RequireRole>}>
        <Route index            element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<FacultyDashboard />} />
        <Route path="quiz"      element={<FacultyQuiz />} />
        <Route path="results"   element={<FacultyResults />} />
        <Route path="students"  element={<FacultyStudents />} />
        <Route path="profile"   element={<Profile />} />
      </Route>

      {/* ── STUDENT ── */}
      <Route path="/student" element={<RequireRole role="student"><StudentLayout /></RequireRole>}>
        <Route index                element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"     element={<StudentDashboard />} />
        <Route path="announcements" element={<StudentAnnouncements />} />
        <Route path="events"        element={<StudentEvents />} />
        <Route path="timetable"     element={<StudentTimetable />} />
        <Route path="results"       element={<StudentResults />} />
        <Route path="quizzes"       element={<StudentQuizzes />} />
        <Route path="quizzes/:quizId" element={<StudentQuizTake />} />
        <Route path="chat"          element={<StudentChat />} />
        <Route path="profile"       element={<Profile />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<RoleRedirect />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
