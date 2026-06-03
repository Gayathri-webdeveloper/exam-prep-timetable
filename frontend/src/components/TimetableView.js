import React from 'react';
import DayCard from './DayCard';
import SuggestionPanel from './SuggestionPanel';

export default function TimetableView({ timetable, onDelete }) {
  if (!timetable) return null;

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>{timetable.title}</h2>
          <div style={styles.meta}>
            <span style={styles.metaBadge}>
              📅 {new Date(timetable.startDate).toLocaleDateString()}
            </span>
            <span style={styles.metaBadge}>
              📚 {timetable.exams?.map(e => e.subject).join(', ')}
            </span>
            <span style={styles.metaBadge}>
              🗓️ {timetable.schedule?.length} days
            </span>
          </div>
        </div>
        {onDelete && (
          <button onClick={onDelete} style={styles.deleteBtn}>
            🗑️ Delete
          </button>
        )}
      </div>

      <SuggestionPanel suggestions={timetable.generalSuggestions} />

      <h3 style={styles.scheduleTitle}>📅 Daily Schedule</h3>
      {timetable.schedule?.map((day, i) => (
        <DayCard key={i} day={day} />
      ))}
    </div>
  );
}

const styles = {
  wrapper: {
    width: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
    background: '#fff',
    borderRadius: 12,
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: '#1e293b',
    margin: '0 0 10px 0',
  },
  meta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaBadge: {
    background: '#f1f5f9',
    color: '#475569',
    padding: '4px 10px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 500,
  },
  deleteBtn: {
    background: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: 8,
    padding: '10px 16px',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500,
    flexShrink: 0,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: 12,
  },
};