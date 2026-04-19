// components/Layout.jsx — Main layout wrapper with sidebar + navbar
import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import ToastContainer from './ToastContainer';

export default function Layout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="page-wrapper">
          {children}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
