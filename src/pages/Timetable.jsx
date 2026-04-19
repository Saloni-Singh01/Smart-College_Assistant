// pages/Timetable.jsx — Weekly timetable view
import React, { useState } from 'react';
import { timetableData, subjectColors } from '../data/mockData';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function Timetable() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const [selectedDay, setSelectedDay] = useState(days.includes(today) ? today : 'Monday');

  const classes = timetableData[selectedDay] || [];
  const currentHour = new Date().getHours();

  const isCurrentClass = (timeStr) => {
    const startHour = parseInt(timeStr.split(':')[0]);
    return selectedDay === today && currentHour >= startHour && currentHour < startHour + 1;
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="page-title">Timetable</h1>
        <p className="page-subtitle">B.Tech CS — Semester 5 · Academic Year 2024–25</p>
      </div>

      {/* Day selector */}
      <div className="sca-card mb-4">
        <div className="d-flex gap-2 flex-wrap">
          {days.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: 8,
                border: selectedDay === day ? 'none' : '1.5px solid var(--border)',
                background: selectedDay === day ? 'var(--accent)' : 'transparent',
                color: selectedDay === day ? '#fff' : 'var(--text-secondary)',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              {day.slice(0, 3)}
              {day === today && (
                <span style={{
                  position: 'absolute', top: -4, right: -4, width: 8, height: 8,
                  background: selectedDay === day ? '#fff' : 'var(--accent)',
                  borderRadius: '50%'
                }}></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Timetable */}
      <div className="sca-card">
        <div className="sca-card-header">
          <h2 className="sca-card-title">{selectedDay}'s Schedule</h2>
          <span style={{
            fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500,
            background: 'var(--bg-primary)', padding: '0.25rem 0.75rem',
            borderRadius: 20, border: '1px solid var(--border)'
          }}>
            {classes.length} classes
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {classes.map((cls, i) => {
            const color = subjectColors[cls.subject] || '#9aa0b4';
            const isCurrent = isCurrentClass(cls.time);
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '1rem',
                  borderRadius: 10,
                  background: isCurrent ? `${color}12` : 'var(--bg-primary)',
                  border: `1.5px solid ${isCurrent ? color : 'var(--border)'}`,
                  position: 'relative',
                  alignItems: 'center'
                }}
              >
                {isCurrent && (
                  <div style={{
                    position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                    width: 4, height: '60%', background: color, borderRadius: '0 4px 4px 0'
                  }}></div>
                )}

                {/* Time */}
                <div style={{ flexShrink: 0, width: 90 }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', margin: 0 }}>
                    {cls.time}
                  </p>
                  {isCurrent && (
                    <span style={{ fontSize: '0.62rem', color, fontWeight: 700 }}>● NOW</span>
                  )}
                </div>

                {/* Subject color bar */}
                <div style={{
                  width: 40, height: 40, borderRadius: 8,
                  background: `${color}20`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <i className="bi bi-journal-code" style={{ color, fontSize: '1rem' }}></i>
                </div>

                {/* Details */}
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: '0.875rem', margin: 0, color: 'var(--text-primary)' }}>
                    {cls.subject}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' }}>
                    <i className="bi bi-person me-1"></i>{cls.faculty}
                  </p>
                </div>

                {/* Room */}
                <div style={{
                  padding: '0.25rem 0.65rem',
                  background: 'var(--bg-card)',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--text-secondary)'
                }}>
                  <i className="bi bi-geo me-1"></i>{cls.room}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subject legend */}
      <div className="sca-card mt-4">
        <h2 className="sca-card-title mb-3">Subject Color Key</h2>
        <div className="d-flex flex-wrap gap-2">
          {Object.entries(subjectColors).map(([sub, color]) => (
            <div key={sub} style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.3rem 0.75rem', borderRadius: 20,
              background: `${color}15`, border: `1px solid ${color}30`
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }}></div>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{sub}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
