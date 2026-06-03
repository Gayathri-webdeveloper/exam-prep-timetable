import React from 'react';
import DayCard from './DayCard';
import SuggestionPanel from './SuggestionPanel';

export default function TimetableView({ timetable, onDelete }) {
  if (!timetable) return null;
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>{timetable.title}</h2>
        {onDelete && (
          <button
            onClick={onDelete}
            style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer' }}
          >
            Delete
          </button>
        )}
      </div>

      <div style={{ color: '#666', marginBottom: 16, fontSize: 14 }}>
        <span>📅 Starting: {new Date(timetable.startDate).toLocaleDateString()}</span>
        <span style={{ marginLeft: 16 }}>📚 Subjects: {timetable.exams?.map(e => e.subject).join(', ')}</span>
        <span style={{ marginLeft: 16 }}>🗓️ {timetable.schedule?.length} days planned</span>
      </div>

      <SuggestionPanel suggestions={timetable.generalSuggestions} />

      <h3>Daily Schedule</h3>
      {timetable.schedule?.map((day, i) => <DayCard key={i} day={day} />)}
    </div>
  );
}