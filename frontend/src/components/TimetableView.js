import React from 'react';
import DayCard from './DayCard';
import SuggestionPanel from './SuggestionPanel';

export default function TimetableView({ timetable, onDelete, onBack }) {
  if (!timetable) return null;

  const subjects = [...new Set(timetable.exams?.map(e => e.subject) || [])];
  const totalDays = timetable.schedule?.length || 0;
  const totalHours = timetable.schedule?.reduce((sum, d) => sum + (d.studyHours || 0), 0) || 0;

  return (
    <div style={tv.wrap}>
      {/* Back button */}
      <button onClick={onBack} style={tv.backBtn}>
        ← Back to Form
      </button>

      {/* Header card */}
      <div style={tv.headerCard}>
        <div style={tv.headerGrad} />
        <div style={tv.headerContent}>
          <div style={tv.headerTop}>
            <div>
              <div style={tv.headerBadge}>✅ Schedule Ready</div>
              <h1 style={tv.headerTitle}>{timetable.title}</h1>
              <p style={tv.headerSub}>
                Starting {new Date(timetable.startDate).toLocaleDateString('en-IN', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                })}
              </p>
            </div>
            <button onClick={onDelete} style={tv.deleteBtn}>🗑 Delete</button>
          </div>

          {/* Stats row */}
          <div style={tv.stats}>
            <div style={tv.stat}>
              <div style={tv.statVal}>{totalDays}</div>
              <div style={tv.statLabel}>Study Days</div>
            </div>
            <div style={tv.statDiv} />
            <div style={tv.stat}>
              <div style={tv.statVal}>{totalHours}h</div>
              <div style={tv.statLabel}>Total Hours</div>
            </div>
            <div style={tv.statDiv} />
            <div style={tv.stat}>
              <div style={tv.statVal}>{subjects.length}</div>
              <div style={tv.statLabel}>Subjects</div>
            </div>
            <div style={tv.statDiv} />
            <div style={tv.stat}>
              <div style={tv.statVal}>{timetable.generalSuggestions?.length || 0}</div>
              <div style={tv.statLabel}>Tips</div>
            </div>
          </div>

          {/* Subjects */}
          <div style={tv.subjectRow}>
            {subjects.map((sub, i) => (
              <span key={i} style={tv.subjectChip}>{sub}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <SuggestionPanel suggestions={timetable.generalSuggestions} />

      {/* Schedule */}
      <div style={tv.scheduleHeader}>
        <h2 style={tv.scheduleTitle}>📅 Day-by-Day Schedule</h2>
        <p style={tv.scheduleSub}>Click any day to expand tasks and tips</p>
      </div>

      <div>
        {timetable.schedule?.map((day, i) => (
          <DayCard key={i} day={day} />
        ))}
      </div>
    </div>
  );
}

const tv = {
  wrap: { width: '100%' },
  backBtn: {
    background: 'transparent',
    border: '1.5px solid var(--border)',
    borderRadius: 8,
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text2)',
    marginBottom: 16,
    transition: 'all 0.2s',
  },
  headerCard: {
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
    boxShadow: 'var(--shadow-lg)',
  },
  headerGrad: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 50%, #4f46e5 100%)',
  },
  headerContent: {
    position: 'relative',
    zIndex: 1,
    padding: '24px 20px',
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  headerBadge: {
    display: 'inline-block',
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
    padding: '4px 12px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
    marginBottom: 8,
    backdropFilter: 'blur(10px)',
  },
  headerTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(20px, 4vw, 28px)',
    fontWeight: 800,
    color: '#fff',
    marginBottom: 6,
    letterSpacing: '-0.5px',
  },
  headerSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  deleteBtn: {
    background: 'rgba(239,68,68,0.2)',
    color: '#fca5a5',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: 8,
    padding: '8px 14px',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
    flexShrink: 0,
    backdropFilter: 'blur(10px)',
  },
  stats: {
    display: 'flex',
    alignItems: 'center',
    gap: 0,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: '14px 16px',
    marginBottom: 14,
    flexWrap: 'wrap',
    rowGap: 12,
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.15)',
  },
  stat: { flex: 1, textAlign: 'center', minWidth: 60 },
  statVal: { fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: 1 },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 4 },
  statDiv: { width: 1, height: 32, background: 'rgba(255,255,255,0.2)' },
  subjectRow: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  subjectChip: {
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
    padding: '4px 12px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    border: '1px solid rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)',
  },
  scheduleHeader: { marginBottom: 14 },
  scheduleTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 20,
    fontWeight: 700,
    color: 'var(--text)',
    marginBottom: 4,
  },
  scheduleSub: { fontSize: 13, color: 'var(--text2)' },
};