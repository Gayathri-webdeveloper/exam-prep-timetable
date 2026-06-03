import React, { useState } from 'react';

export default function DayCard({ day }) {
  const [expanded, setExpanded] = useState(false);

  const difficultyColors = {
    1: '#dcfce7',
    2: '#fef9c3',
    3: '#fee2e2',
  };

  return (
    <div style={styles.card}>
      <div style={styles.header} onClick={() => setExpanded(!expanded)}>
        <div style={styles.left}>
          <span style={styles.dayNum}>Day {day.dayNumber}</span>
          <span style={styles.date}>{day.date}</span>
        </div>
        <div style={styles.right}>
          <span style={styles.subject}>{day.subject}</span>
          <span style={styles.hours}>⏰ {day.studyHours}h</span>
          <span style={styles.arrow}>{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div style={styles.body}>
          <div style={styles.section}>
            <p style={styles.sectionTitle}>📋 Today's Tasks</p>
            <ul style={styles.list}>
              {day.tasks.map((t, i) => (
                <li key={i} style={styles.listItem}>
                  <span style={styles.checkIcon}>✓</span> {t}
                </li>
              ))}
            </ul>
          </div>

          <div style={styles.breakBox}>
            <p style={styles.sectionTitle}>☕ Break Schedule</p>
            <p style={styles.breakText}>{day.breakSchedule}</p>
          </div>

          {day.tips?.length > 0 && (
            <div style={styles.tipsBox}>
              <p style={styles.sectionTitle}>💡 Tips for Today</p>
              <ul style={styles.list}>
                {day.tips.map((t, i) => (
                  <li key={i} style={styles.tipItem}>{t}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px',
    cursor: 'pointer',
    background: '#f8fafc',
    flexWrap: 'wrap',
    gap: 8,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  dayNum: {
    fontWeight: 700,
    color: '#1e293b',
    fontSize: 15,
  },
  date: {
    color: '#94a3b8',
    fontSize: 12,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  subject: {
    background: '#dbeafe',
    color: '#1e40af',
    padding: '3px 10px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  hours: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: 500,
  },
  arrow: {
    color: '#94a3b8',
    fontSize: 12,
  },
  body: {
    padding: '16px',
    borderTop: '1px solid #f1f5f9',
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: 8,
    marginTop: 0,
    fontSize: 14,
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    padding: '6px 0',
    borderBottom: '1px solid #f8fafc',
    fontSize: 14,
    color: '#334155',
  },
  checkIcon: {
    color: '#22c55e',
    fontWeight: 700,
    flexShrink: 0,
  },
  breakBox: {
    background: '#f0fdf4',
    borderRadius: 8,
    padding: '12px',
    marginBottom: 14,
  },
  breakText: {
    color: '#166534',
    fontSize: 13,
    margin: 0,
  },
  tipsBox: {
    background: '#fefce8',
    borderRadius: 8,
    padding: '12px',
  },
  tipItem: {
    color: '#713f12',
    fontSize: 13,
    padding: '4px 0',
    listStyle: 'none',
  },
};