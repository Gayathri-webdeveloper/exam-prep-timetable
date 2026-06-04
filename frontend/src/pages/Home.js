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
        <div style={styles.navInner}>
          <div style={styles.logoWrap}>
            <div style={styles.logoIcon}>📖</div>
            <span style={styles.logoText}>ExamPrep</span>
          </div>

          {/* Desktop links */}
          <div style={styles.navLinks} className="hide-mobile">
            <button
              onClick={() => setView('form')}
              style={view === 'form' ? styles.navLinkActive : styles.navLink}
            >
              ✏️ New Timetable
            </button>
            <button
              onClick={() => setView('list')}
              style={view === 'list' ? styles.navLinkActive : styles.navLink}
            >
              📚 Saved
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="show-mobile"
            style={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={styles.mobileMenu}>
            <button onClick={() => { setView('form'); setMenuOpen(false); }} style={styles.mobileItem}>
              ✏️ New Timetable
            </button>
            <button onClick={() => { setView('list'); setMenuOpen(false); }} style={styles.mobileItem}>
              📚 Saved Timetables
            </button>
          </div>
        )}
      </nav>

      {/* Hero banner - only on form view */}
      {view === 'form' && (
        <div style={styles.hero}>
          <div style={styles.heroBg} />
          <div style={styles.heroContent}>
            <div style={styles.heroBadge}>✨ AI-Powered Scheduler</div>
            <h1 style={styles.heroTitle}>
              Study Smarter,<br />Not Harder
            </h1>
            <p style={styles.heroSub}>
              Enter your exams below and get a personalized day-by-day preparation plan with smart tips.
            </p>
          </div>
        </div>
      )}

      {/* Main content */}
      <main style={styles.main}>
        {error && (
          <div style={styles.errorBox}>
            ⚠️ {error}
            <button onClick={() => setError('')} style={styles.errorClose}>✕</button>
          </div>
        )}

        <div className="animate-fadeUp">
          {view === 'form' && <ExamForm onSubmit={handleCreate} loading={loading} />}
          {view === 'result' && (
            <TimetableView
              timetable={timetable}
              onDelete={() => handleDelete(timetable._id)}
              onBack={() => setView('form')}
            />
          )}
          {view === 'list' && (
            <SavedList
              timetables={allTimetables}
              onView={(tt) => { setTimetable(tt); setView('result'); }}
              onDelete={handleDelete}
              onCreate={() => setView('form')}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>Built with ❤️ using MERN Stack · MongoDB · Express · React · Node.js</p>
      </footer>
    </div>
  );
}

function SavedList({ timetables, onView, onDelete, onCreate }) {
  return (
    <div style={saved.wrap}>
      <div style={saved.header}>
        <div>
          <h2 style={saved.title}>Your Timetables</h2>
          <p style={saved.sub}>{timetables.length} saved plans</p>
        </div>
        <button onClick={onCreate} style={saved.createBtn}>+ New</button>
      </div>

      {timetables.length === 0 ? (
        <div style={saved.empty}>
          <div style={saved.emptyIcon}>📭</div>
          <h3 style={saved.emptyTitle}>No timetables yet</h3>
          <p style={saved.emptySub}>Create your first exam prep plan</p>
          <button onClick={onCreate} style={saved.emptyBtn}>Create Timetable</button>
        </div>
      ) : (
        <div style={saved.grid}>
          {timetables.map((tt, i) => (
            <div key={tt._id} style={{ ...saved.card, animationDelay: `${i * 0.08}s` }} className="animate-fadeUp">
              <div style={saved.cardTop}>
                <div style={saved.cardIcon}>
                  {['📘', '📗', '📙', '📕'][i % 4]}
                </div>
                <div style={saved.cardInfo}>
                  <h3 style={saved.cardTitle}>{tt.title}</h3>
                  <p style={saved.cardMeta}>
                    {tt.schedule?.length} days · {tt.exams?.map(e => e.subject).join(', ')}
                  </p>
                </div>
              </div>
              <div style={saved.cardDate}>
                Created {new Date(tt.createdAt).toLocaleDateString()}
              </div>
              <div style={saved.cardActions}>
                <button onClick={() => onView(tt)} style={saved.viewBtn}>View Plan</button>
                <button onClick={() => onDelete(tt._id)} style={saved.delBtn}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--bg)',
  },
  nav: {
    background: 'var(--surface)',
    borderBottom: '1px solid var(--border)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 12px rgba(79,70,229,0.07)',
  },
  navInner: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '0 20px',
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 36,
    height: 36,
    background: 'var(--primary)',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
  },
  logoText: {
    fontFamily: 'var(--font-display)',
    fontSize: 20,
    fontWeight: 800,
    color: 'var(--primary)',
    letterSpacing: '-0.5px',
  },
  navLinks: {
    display: 'flex',
    gap: 6,
  },
  navLink: {
    background: 'transparent',
    border: 'none',
    padding: '8px 16px',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--text2)',
    transition: 'all 0.2s',
  },
  navLinkActive: {
    background: 'var(--primary-light)',
    border: 'none',
    padding: '8px 16px',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--primary)',
    transition: 'all 0.2s',
  },
  hamburger: {
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '6px 12px',
    cursor: 'pointer',
    fontSize: 18,
    color: 'var(--text)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileMenu: {
    borderTop: '1px solid var(--border)',
    animation: 'slideDown 0.2s ease',
  },
  mobileItem: {
    display: 'block',
    width: '100%',
    background: 'transparent',
    border: 'none',
    padding: '14px 20px',
    textAlign: 'left',
    fontSize: 15,
    color: 'var(--text)',
    cursor: 'pointer',
    borderBottom: '1px solid var(--border)',
    fontWeight: 500,
  },
  hero: {
    position: 'relative',
    overflow: 'hidden',
    padding: '48px 20px 40px',
    textAlign: 'center',
  },
  heroBg: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)',
    zIndex: 0,
  },
  heroContent: {
    position: 'relative',
    zIndex: 1,
    maxWidth: 600,
    margin: '0 auto',
  },
  heroBadge: {
    display: 'inline-block',
    background: 'rgba(255,255,255,0.2)',
    color: '#fff',
    padding: '6px 16px',
    borderRadius: 99,
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 16,
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.3)',
  },
  heroTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(28px, 5vw, 46px)',
    fontWeight: 800,
    color: '#fff',
    lineHeight: 1.15,
    marginBottom: 14,
    letterSpacing: '-1px',
  },
  heroSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 16,
    lineHeight: 1.6,
    maxWidth: 480,
    margin: '0 auto',
  },
  main: {
    flex: 1,
    maxWidth: 900,
    width: '100%',
    margin: '0 auto',
    padding: '32px 16px',
  },
  errorBox: {
    background: 'var(--danger-light)',
    color: '#b91c1c',
    padding: '14px 16px',
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 14,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #fca5a5',
  },
  errorClose: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#b91c1c',
    fontSize: 16,
    fontWeight: 700,
  },
  footer: {
    textAlign: 'center',
    padding: '20px',
    color: 'var(--text3)',
    fontSize: 13,
    borderTop: '1px solid var(--border)',
    background: 'var(--surface)',
  },
};

const saved = {
  wrap: { width: '100%' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 12,
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 26,
    color: 'var(--text)',
    fontWeight: 700,
  },
  sub: { color: 'var(--text2)', fontSize: 14, marginTop: 2 },
  createBtn: {
    background: 'var(--primary)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '10px 20px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    border: '2px dashed var(--border)',
  },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 6 },
  emptySub: { color: 'var(--text2)', fontSize: 14, marginBottom: 20 },
  emptyBtn: {
    background: 'var(--primary)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '12px 24px',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 16,
  },
  card: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    padding: '20px',
    boxShadow: 'var(--shadow)',
    border: '1px solid var(--border)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  cardTop: { display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 },
  cardIcon: {
    width: 44,
    height: 44,
    background: 'var(--primary-light)',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
    flexShrink: 0,
  },
  cardInfo: { flex: 1, minWidth: 0 },
  cardTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: 'var(--text)',
    marginBottom: 4,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  cardMeta: {
    fontSize: 12,
    color: 'var(--text2)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  cardDate: {
    fontSize: 11,
    color: 'var(--text3)',
    marginBottom: 14,
    paddingTop: 10,
    borderTop: '1px solid var(--border)',
  },
  cardActions: { display: 'flex', gap: 8 },
  viewBtn: {
    flex: 1,
    background: 'var(--primary)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '9px 0',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  delBtn: {
    background: 'var(--danger-light)',
    color: 'var(--danger)',
    border: 'none',
    borderRadius: 8,
    padding: '9px 12px',
    fontSize: 14,
    cursor: 'pointer',
  },
};