import React, { useState, useEffect } from 'react';
import ExamForm from '../components/ExamForm';
import TimetableView from '../components/TimetableView';
import { createTimetable, getAllTimetables, deleteTimetable } from '../api/api';

export default function Home() {
  const [view, setView] = useState('form');
  const [loading, setLoading] = useState(false);
  const [timetable, setTimetable] = useState(null);
  const [allTimetables, setAllTimetables] = useState([]);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

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
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.nav}>
        <span style={styles.logo}>📖 ExamPrep</span>

        {/* Desktop nav links */}
        <div style={styles.navLinks}>
          <button onClick={() => setView('form')} style={navBtn(view === 'form')}>
            New Timetable
          </button>
          <button onClick={() => setView('list')} style={navBtn(view === 'list')}>
            Saved Timetables
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          style={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          <button onClick={() => { setView('form'); setMenuOpen(false); }} style={styles.mobileMenuItem}>
            📝 New Timetable
          </button>
          <button onClick={() => { setView('list'); setMenuOpen(false); }} style={styles.mobileMenuItem}>
            📚 Saved Timetables
          </button>
        </div>
      )}

      {/* Content */}
      <div style={styles.content}>
        {error && (
          <div style={styles.error}>{error}</div>
        )}

        {view === 'form' && (
          <ExamForm onSubmit={handleCreate} loading={loading} />
        )}

        {view === 'result' && (
          <TimetableView
            timetable={timetable}
            onDelete={() => handleDelete(timetable._id)}
          />
        )}

        {view === 'list' && (
          <div style={styles.listContainer}>
            <h2 style={styles.listTitle}>Saved Timetables</h2>
            {allTimetables.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={{ fontSize: 48 }}>📭</p>
                <p>No timetables yet. Create one!</p>
                <button
                  onClick={() => setView('form')}
                  style={styles.createBtn}
                >
                  Create Timetable
                </button>
              </div>
            ) : (
              allTimetables.map((tt) => (
                <div key={tt._id} style={styles.listCard}>
                  <div style={styles.listCardInfo}>
                    <strong style={styles.listCardTitle}>{tt.title}</strong>
                    <p style={styles.listCardMeta}>
                      {tt.schedule?.length} days • {tt.exams?.map(e => e.subject).join(', ')}
                    </p>
                  </div>
                  <div style={styles.listCardActions}>
                    <button
                      onClick={() => { setTimetable(tt); setView('result'); }}
                      style={styles.viewBtn}
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(tt._id)}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
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
  color: '#fff',
  border: 'none',
  borderRadius: 4,
  padding: '8px 16px',
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: active ? 600 : 400,
});

const styles = {
  page: {
    fontFamily: 'sans-serif',
    minHeight: '100vh',
    background: '#f1f5f9',
  },
  nav: {
    background: '#1e40af',
    color: '#fff',
    padding: '14px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontWeight: 700,
    fontSize: 20,
  },
  navLinks: {
    display: 'flex',
    gap: 8,
    '@media (max-width: 600px)': {
      display: 'none',
    },
  },
  hamburger: {
    display: 'none',
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: 22,
    cursor: 'pointer',
    padding: '4px 8px',
    // shown via media query in index.css
  },
  mobileMenu: {
    background: '#1e3a8a',
    display: 'flex',
    flexDirection: 'column',
    padding: '8px 0',
  },
  mobileMenuItem: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    padding: '14px 20px',
    textAlign: 'left',
    fontSize: 15,
    cursor: 'pointer',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  content: {
    padding: '20px 16px',
    maxWidth: 800,
    margin: '0 auto',
  },
  error: {
    background: '#fee2e2',
    color: '#991b1b',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 14,
  },
  listContainer: {
    maxWidth: 800,
    margin: '0 auto',
  },
  listTitle: {
    fontSize: 22,
    marginBottom: 16,
    color: '#1e293b',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    background: '#fff',
    borderRadius: 12,
    color: '#64748b',
  },
  createBtn: {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '12px 24px',
    fontSize: 15,
    cursor: 'pointer',
    marginTop: 12,
  },
  listCard: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 10,
    padding: '16px',
    marginBottom: 12,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  listCardInfo: {
    flex: 1,
    minWidth: 0,
  },
  listCardTitle: {
    fontSize: 16,
    color: '#1e293b',
    display: 'block',
    marginBottom: 4,
  },
  listCardMeta: {
    color: '#64748b',
    fontSize: 13,
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  listCardActions: {
    display: 'flex',
    gap: 8,
    flexShrink: 0,
  },
  viewBtn: {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: 14,
  },
  deleteBtn: {
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: 14,
  },
};