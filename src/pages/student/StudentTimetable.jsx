// pages/student/StudentTimetable.jsx — Interactive timetable
import React, { useState } from 'react';
import { timetableData, subjectColors } from '../../data/mockData';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function StudentTimetable() {
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const [selected, setSelected] = useState(DAYS.includes(todayName) ? todayName : 'Monday');

  const classes      = timetableData[selected] || [];
  const currentHour  = new Date().getHours();

  const isNow = (timeStr) => {
    const startHour = parseInt(timeStr.split(':')[0]);
    return selected === todayName && currentHour >= startHour && currentHour < startHour + 1;
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
          {DAYS.map(day => (
            <button key={day} onClick={() => setSelected(day)} style={{
              padding: '.5rem 1.2rem', borderRadius: 8, cursor: 'pointer',
              border: selected === day ? 'none' : '1.5px solid var(--border)',
              background: selected === day ? '#059669' : 'transparent',
              color: selected === day ? '#fff' : 'var(--text-secondary)',
              fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '.85rem',
              position: 'relative'
            }}>
              {day.slice(0, 3)}
              {day === todayName && (
                <span style={{
                  position: 'absolute', top: -4, right: -4,
                  width: 8, height: 8, borderRadius: '50%',
                  background: selected === day ? '#fff' : '#059669',
                  border: '1.5px solid var(--bg-card)'
                }}></span>
              )}
            </button>
          ))}
        </div>
        {selected === todayName && (
          <p style={{ fontSize: '.75rem', color: '#059669', fontWeight: 600, margin: '.75rem 0 0', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 7, height: 7, background: '#059669', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
            Today's schedule
          </p>
        )}
      </div>

      {/* Schedule */}
      <div className="sca-card">
        <div className="sca-card-header">
          <h2 className="sca-card-title">{selected}'s Schedule</h2>
          <span style={{ fontSize: '.75rem', color: 'var(--text-muted)', fontWeight: 500, background: 'var(--bg-primary)', padding: '.25rem .75rem', borderRadius: 20, border: '1px solid var(--border)' }}>
            {classes.length} classes
          </span>
        </div>

        <div className="d-flex flex-column gap-3">
          {classes.map((cls, i) => {
            const color   = subjectColors[cls.subject] || '#9aa0b4';
            const current = isNow(cls.time);
            return (
              <div key={i} style={{
                display: 'flex', gap: '1rem', padding: '1rem', borderRadius: 10, alignItems: 'center',
                background: current ? `${color}08` : 'var(--bg-primary)',
                border: `1.5px solid ${current ? color : 'var(--border)'}`,
                position: 'relative'
              }}>
                {/* Live indicator */}
                {current && (
                  <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 4, height: '60%', background: color, borderRadius: '0 4px 4px 0' }}></div>
                )}

                {/* Time */}
                <div style={{ flexShrink: 0, width: 95 }}>
                  <p style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--text-muted)', margin: 0 }}>{cls.time}</p>
                  {current && <span style={{ fontSize: '.62rem', color, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ width: 6, height: 6, background: color, borderRadius: '50%', display: 'inline-block' }}></span>NOW</span>}
                </div>

                {/* Subject icon */}
                <div style={{ width: 42, height: 42, borderRadius: 8, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className="bi bi-journal-code" style={{ color, fontSize: '1rem' }}></i>
                </div>

                {/* Details */}
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: '.9rem', margin: 0, color: 'var(--text-primary)' }}>{cls.subject}</p>
                  <p style={{ fontSize: '.75rem', color: 'var(--text-muted)', margin: '.1rem 0 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <i className="bi bi-person"></i>{cls.faculty}
                  </p>
                </div>

                {/* Room */}
                <div style={{ padding: '.28rem .65rem', background: 'var(--bg-card)', borderRadius: 6, border: '1px solid var(--border)', fontSize: '.72rem', fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0 }}>
                  <i className="bi bi-geo-alt me-1"></i>{cls.room}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subject legend */}
      <div className="sca-card mt-4">
        <h2 className="sca-card-title mb-3">Subject Colour Key</h2>
        <div className="d-flex flex-wrap gap-2">
          {Object.entries(subjectColors).map(([sub, color]) => (
            <div key={sub} style={{ display: 'flex', alignItems: 'center', gap: '.4rem', padding: '.3rem .75rem', borderRadius: 20, background: `${color}10`, border: `1px solid ${color}25` }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }}></div>
              <span style={{ fontSize: '.72rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{sub}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
