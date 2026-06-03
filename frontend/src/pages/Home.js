import React, { useState, useEffect } from 'react';
import ExamForm from '../components/ExamForm';
import TimetableView from '../components/TimetableView';
import { createTimetable, getAllTimetables, deleteTimetable } from '../api/api';

export default function Home() {
  const [view, setView] = useState('form'); // 'form' | 'result' | 'list'
  const [loading, setLoading] = useState(false);
  const [timetable, setTimetable] = useState(null);
  const [allTimetables, setAllTimetables] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (view === 'list') loadAll();
  }, [view]);

  const loadAll = async () => {
    try {
      const res = await getAllTimetables();
      setAllTimetables(res.data);
    } catch {
      setError('Failed to load timetables');
    }
  };

  const handleCreate = async (data) => {
    setLoading(true);
    setError('');
    try {
      const res = await createTimetable(data);
      setTimetable(res.data);
      setView('result');
    } catch (e) {
      setError(e.response?.data?.error || 'Error generating timetable');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteTimetable(id);
    if (view === 'list') loadAll();
    else { setTimetable(null); setView('form'); }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#f1f5f9' }}>
      {/* Nav */}
      <div style={{ background: '#1e40af', color: '#fff', padding: '14px 24px', display: 'flex', gap: 20 }}>
        <span style={{ fontWeight: 700, fontSize: 18 }}>📖 ExamPrep</span>
        <button onClick={() => setView('form')} style={navBtn(view === 'form')}>New Timetable</button>
        <button onClick={() => setView('list')} style={navBtn(view === 'list')}>Saved Timetables</button>
      </div>

      <div style={{ padding: 24 }}>
        {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: 12, borderRadius: 6, marginBottom: 16 }}>{error}</div>}

        {view === 'form' && <ExamForm onSubmit={handleCreate} loading={loading} />}
        {view === 'result' && <TimetableView timetable={timetable} onDelete={() => handleDelete(timetable._id)} />}
        {view === 'list' && (
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2>Saved Timetables</h2>
            {allTimetables.length === 0 ? (
              <p>No timetables yet. Create one!</p>
            ) : (
              allTimetables.map((tt) => (
                <div key={tt._id} style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8, padding: 16, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{tt.title}</strong>
                    <p style={{ color: '#666', fontSize: 13, margin: '4px 0 0' }}>
                      {tt.schedule?.length} days • {tt.exams?.map(e => e.subject).join(', ')}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => { setTimetable(tt); setView('result'); }} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer' }}>View</button>
                    <button onClick={() => handleDelete(tt._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer' }}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const navBtn = (active) => ({
  background: active ? 'rgba(255,255,255,0.2)' : 'transparent',
  color: '#fff', border: 'none', borderRadius: 4, padding: '6px 14px', cursor: 'pointer', fontSize: 14,
});