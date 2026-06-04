// ─── DayCard.js ────────────────────────────────────────────────────────────
import React, { useState } from 'react';

const subjectColors = [
  { bg: '#ede9fe', color: '#6d28d9', dot: '#7c3aed' },
  { bg: '#dbeafe', color: '#1d4ed8', dot: '#2563eb' },
  { bg: '#d1fae5', color: '#065f46', dot: '#10b981' },
  { bg: '#fef3c7', color: '#92400e', dot: '#f59e0b' },
  { bg: '#fce7f3', color: '#9d174d', dot: '#ec4899' },
];

let subjectColorMap = {};
let colorIndex = 0;

function getSubjectColor(subject) {
  if (!subjectColorMap[subject]) {
    subjectColorMap[subject] = subjectColors[colorIndex % subjectColors.length];
    colorIndex++;
  }
  return subjectColorMap[subject];
}

export function DayCard({ day }) {
  const [expanded, setExpanded] = useState(false);
  const sc = getSubjectColor(day.subject);

  return (
    <div style={dc.card}>
      <div style={dc.header} onClick={() => setExpanded(!expanded)}>
        <div style={dc.left}>
          <div style={dc.dayBadge}>
            <span style={dc.dayNum}>Day</span>
            <span style={dc.dayVal}>{day.dayNumber}</span>
          </div>
          <div>
            <div style={{ ...dc.subject, background: sc.bg, color: sc.color }}>
              <span style={{ ...dc.dot, background: sc.dot }} />
              {day.subject}
            </div>
            <div style={dc.date}>{day.date}</div>
          </div>
        </div>
        <div style={dc.right}>
          <div style={dc.hoursBadge}>⏱ {day.studyHours}h</div>
          <div style={{ ...dc.arrow, transform: expanded ? 'rotate(180deg)' : 'rotate(0)' }}>
            ▼
          </div>
        </div>
      </div>

      {expanded && (
        <div style={dc.body} className="animate-fadeIn">
          {/* Tasks */}
          <div style={dc.section}>
            <div style={dc.sectionHead}>
              <span style={dc.sectionIcon}>📋</span>
              <span style={dc.sectionTitle}>Today's Tasks</span>
            </div>
            <div style={dc.taskList}>
              {day.tasks.map((t, i) => (
                <div key={i} style={dc.task}>
                  <div style={dc.taskCheck}>✓</div>
                  <span style={dc.taskText}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Break */}
          <div style={dc.breakBox}>
            <span style={dc.breakIcon}>☕</span>
            <div>
              <div style={dc.breakTitle}>Break Schedule</div>
              <div style={dc.breakText}>{day.breakSchedule}</div>
            </div>
          </div>

          {/* Tips */}
          {day.tips?.length > 0 && (
            <div style={dc.tipsBox}>
              <div style={dc.sectionHead}>
                <span style={dc.sectionIcon}>💡</span>
                <span style={dc.sectionTitle}>Pro Tips</span>
              </div>
              {day.tips.map((t, i) => (
                <div key={i} style={dc.tip}>
                  <span style={dc.tipBullet}>→</span>
                  <span style={dc.tipText}>{t}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const dc = {
  card: {
    background: 'var(--surface)',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(79,70,229,0.07)',
    border: '1px solid var(--border)',
    transition: 'box-shadow 0.2s',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px',
    cursor: 'pointer',
    flexWrap: 'wrap',
    gap: 10,
  },
  left: { display: 'flex', alignItems: 'center', gap: 12 },
  dayBadge: {
    width: 44,
    height: 44,
    background: 'linear-gradient(135deg, var(--primary), #7c3aed)',
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dayNum: { fontSize: 9, color: 'rgba(255,255,255,0.8)', fontWeight: 600, letterSpacing: 0.5 },
  dayVal: { fontSize: 16, color: '#fff', fontWeight: 800, lineHeight: 1 },
  subject: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 10px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 2,
  },
  dot: { width: 6, height: 6, borderRadius: '50%', flexShrink: 0 },
  date: { fontSize: 11, color: 'var(--text3)' },
  right: { display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' },
  hoursBadge: {
    background: 'var(--accent-light)',
    color: '#92400e',
    padding: '4px 10px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  arrow: {
    color: 'var(--text3)',
    fontSize: 11,
    transition: 'transform 0.25s',
  },
  body: {
    padding: '0 16px 16px',
    borderTop: '1px solid var(--border)',
  },
  section: { paddingTop: 14, marginBottom: 14 },
  sectionHead: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionIcon: { fontSize: 16 },
  sectionTitle: { fontSize: 13, fontWeight: 700, color: 'var(--text)' },
  taskList: { display: 'flex', flexDirection: 'column', gap: 8 },
  task: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    padding: '8px 12px',
    background: 'var(--surface2)',
    borderRadius: 8,
  },
  taskCheck: {
    width: 20,
    height: 20,
    background: 'var(--success-light)',
    color: 'var(--success)',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 800,
    flexShrink: 0,
  },
  taskText: { fontSize: 13, color: 'var(--text)', lineHeight: 1.5 },
  breakBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: 10,
    padding: '12px',
    marginBottom: 12,
  },
  breakIcon: { fontSize: 20, flexShrink: 0 },
  breakTitle: { fontSize: 12, fontWeight: 700, color: '#065f46', marginBottom: 2 },
  breakText: { fontSize: 12, color: '#166534', lineHeight: 1.5 },
  tipsBox: {
    background: '#fffbeb',
    border: '1px solid #fde68a',
    borderRadius: 10,
    padding: '12px',
  },
  tip: {
    display: 'flex',
    gap: 8,
    padding: '4px 0',
  },
  tipBullet: { color: '#f59e0b', fontWeight: 700, flexShrink: 0, fontSize: 13 },
  tipText: { fontSize: 12, color: '#78350f', lineHeight: 1.5 },
};

export default DayCard;