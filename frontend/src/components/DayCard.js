import React, { useState } from 'react';

export default function DayCard({ day }) {
  const [expanded, setExpanded] = useState(false);

  const difficultyColor = {
    easy: '#16a34a', medium: '#d97706', hard: '#dc2626',
  };

  return (
    <div style={styles.card} onClick={() => setExpanded(!expanded)}>
      <div style={styles.header}>
        <div>
          <span style={styles.dayNum}>Day {day.dayNumber}</span>
          <span style={styles.date}> — {day.date}</span>
        </div>
        <div style={styles.right}>
          <span style={styles.subject}>{day.subject}</span>
          <span style={styles.hours}>⏰ {day.studyHours}h</span>
          <span>{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div style={styles.body}>
          <div style={styles.section}>
            <strong>📋 Today's Tasks</strong>
            <ul>
              {day.tasks.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>
          <div style={styles.section}>
            <strong>☕ Break Schedule</strong>
            <p>{day.breakSchedule}</p>
          </div>
          {day.tips?.length > 0 && (
            <div style={{ ...styles.section, background: '#fef3c7', borderRadius: 6, padding: 10 }}>
              <strong>💡 Tips</strong>
              <ul>
                {day.tips.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  card: { border: '1px solid #e0e0e0', borderRadius: 8, marginBottom: 10, cursor: 'pointer', overflow: 'hidden' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8f9fa' },
  dayNum: { fontWeight: 600 },
  date: { color: '#666', fontSize: 13 },
  right: { display: 'flex', gap: 12, alignItems: 'center' },
  subject: { background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: 4, fontSize: 13, fontWeight: 500 },
  hours: { color: '#555', fontSize: 13 },
  body: { padding: 16, borderTop: '1px solid #eee' },
  section: { marginBottom: 14 },
};