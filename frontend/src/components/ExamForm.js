import React, { useState } from 'react';

const emptyExam = {
  subject: '',
  examDate: '',
  difficulty: 'medium',
  topics: '',
  hoursPerDay: 4,
};

const difficultyConfig = {
  easy: { label: '🟢 Easy', color: '#10b981', bg: '#d1fae5' },
  medium: { label: '🟡 Medium', color: '#f59e0b', bg: '#fef3c7' },
  hard: { label: '🔴 Hard', color: '#ef4444', bg: '#fee2e2' },
};

export default function ExamForm({ onSubmit, loading }) {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [exams, setExams] = useState([{ ...emptyExam }]);

  const addExam = () => setExams([...exams, { ...emptyExam }]);
  const removeExam = (i) => setExams(exams.filter((_, idx) => idx !== i));
  const updateExam = (i, field, value) => {
    const updated = [...exams];
    updated[i][field] = value;
    setExams(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      startDate,
      exams: exams.map((ex) => ({
        ...ex,
        topics: ex.topics ? ex.topics.split(',').map(t => t.trim()).filter(Boolean) : [],
        hoursPerDay: Number(ex.hoursPerDay),
      })),
    });
  };

  return (
    <div style={s.wrap}>
      {/* Steps indicator */}
      <div style={s.steps}>
        <div style={s.step}>
          <div style={{ ...s.stepDot, background: 'var(--primary)', color: '#fff' }}>1</div>
          <span style={s.stepLabel}>Plan Details</span>
        </div>
        <div style={s.stepLine} />
        <div style={s.step}>
          <div style={{ ...s.stepDot, background: 'var(--primary-light)', color: 'var(--primary)' }}>2</div>
          <span style={s.stepLabel}>Add Exams</span>
        </div>
        <div style={s.stepLine} />
        <div style={s.step}>
          <div style={{ ...s.stepDot, background: 'var(--primary-light)', color: 'var(--primary)' }}>3</div>
          <span style={s.stepLabel}>Generate</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Card 1: Plan details */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <div style={s.cardIcon}>📋</div>
            <div>
              <h2 style={s.cardTitle}>Plan Details</h2>
              <p style={s.cardSub}>Name your timetable and set your start date</p>
            </div>
          </div>

          <div style={s.grid2}>
            <div style={s.field}>
              <label style={s.label}>Timetable Title *</label>
              <input
                style={s.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Semester 5 Finals"
                required
              />
            </div>
            <div style={s.field}>
              <label style={s.label}>Study Start Date *</label>
              <input
                style={s.input}
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Card 2: Exams */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <div style={s.cardIcon}>📚</div>
            <div>
              <h2 style={s.cardTitle}>Your Exams</h2>
              <p style={s.cardSub}>Add all subjects you need to prepare for</p>
            </div>
          </div>

          {exams.map((exam, i) => (
            <div key={i} style={s.examCard}>
              <div style={s.examTop}>
                <div style={s.examBadge}>
                  <span style={s.examNum}>{i + 1}</span>
                  <span>Exam</span>
                </div>
                {exams.length > 1 && (
                  <button type="button" onClick={() => removeExam(i)} style={s.removeBtn}>
                    ✕ Remove
                  </button>
                )}
              </div>

              <div style={s.grid2}>
                <div style={s.field}>
                  <label style={s.label}>Subject *</label>
                  <input
                    style={s.input}
                    value={exam.subject}
                    onChange={(e) => updateExam(i, 'subject', e.target.value)}
                    placeholder="e.g. Mathematics"
                    required
                  />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Exam Date *</label>
                  <input
                    style={s.input}
                    type="date"
                    value={exam.examDate}
                    onChange={(e) => updateExam(i, 'examDate', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={s.grid2}>
                <div style={s.field}>
                  <label style={s.label}>Difficulty Level</label>
                  <div style={s.diffRow}>
                    {Object.entries(difficultyConfig).map(([key, cfg]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => updateExam(i, 'difficulty', key)}
                        style={{
                          ...s.diffBtn,
                          background: exam.difficulty === key ? cfg.bg : '#f8fafc',
                          color: exam.difficulty === key ? cfg.color : 'var(--text2)',
                          border: exam.difficulty === key
                            ? `2px solid ${cfg.color}`
                            : '2px solid transparent',
                          fontWeight: exam.difficulty === key ? 700 : 400,
                        }}
                      >
                        {cfg.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Study Hours / Day: <strong style={{ color: 'var(--primary)' }}>{exam.hoursPerDay}h</strong></label>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={exam.hoursPerDay}
                    onChange={(e) => updateExam(i, 'hoursPerDay', e.target.value)}
                    style={s.slider}
                  />
                  <div style={s.sliderLabels}>
                    <span>1h</span><span>6h</span><span>12h</span>
                  </div>
                </div>
              </div>

              <div style={s.field}>
                <label style={s.label}>Topics (comma-separated)</label>
                <input
                  style={s.input}
                  value={exam.topics}
                  onChange={(e) => updateExam(i, 'topics', e.target.value)}
                  placeholder="e.g. Algebra, Calculus, Statistics, Trigonometry"
                />
                <span style={s.hint}>Separate topics with commas for a more detailed schedule</span>
              </div>
            </div>
          ))}

          <button type="button" onClick={addExam} style={s.addBtn}>
            <span style={s.addIcon}>+</span> Add Another Exam
          </button>
        </div>

        {/* Submit */}
        <button type="submit" style={s.submitBtn} disabled={loading}>
          {loading ? (
            <>
              <span className="spinner" />
              Generating your schedule...
            </>
          ) : (
            '🗓️ Generate Smart Timetable'
          )}
        </button>
      </form>
    </div>
  );
}

const s = {
  wrap: { width: '100%' },
  steps: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    gap: 0,
    flexWrap: 'wrap',
    rowGap: 8,
  },
  step: { display: 'flex', alignItems: 'center', gap: 8, flexDirection: 'column' },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 700,
    transition: 'all 0.3s',
  },
  stepLabel: { fontSize: 11, color: 'var(--text2)', fontWeight: 500, whiteSpace: 'nowrap' },
  stepLine: { width: 40, height: 2, background: 'var(--border)', margin: '0 4px', marginBottom: 16 },
  card: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    padding: '24px 20px',
    marginBottom: 16,
    boxShadow: 'var(--shadow)',
    border: '1px solid var(--border)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottom: '1px solid var(--border)',
  },
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
  cardTitle: { fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 2 },
  cardSub: { fontSize: 13, color: 'var(--text2)' },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 14,
  },
  field: { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 },
  label: { fontSize: 13, fontWeight: 600, color: 'var(--text2)' },
  input: {
    padding: '11px 14px',
    borderRadius: 10,
    border: '1.5px solid var(--border)',
    fontSize: 14,
    width: '100%',
    boxSizing: 'border-box',
    background: '#fafafe',
    color: 'var(--text)',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  hint: { fontSize: 11, color: 'var(--text3)' },
  examCard: {
    background: 'var(--surface2)',
    borderRadius: 12,
    padding: '18px',
    marginBottom: 14,
    border: '1.5px solid var(--border)',
  },
  examTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  examBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--primary)',
  },
  examNum: {
    width: 24,
    height: 24,
    background: 'var(--primary)',
    color: '#fff',
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 700,
  },
  removeBtn: {
    background: 'var(--danger-light)',
    color: 'var(--danger)',
    border: 'none',
    borderRadius: 8,
    padding: '6px 12px',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 600,
  },
  diffRow: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  diffBtn: {
    flex: 1,
    minWidth: 70,
    padding: '8px 4px',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 500,
    transition: 'all 0.2s',
    textAlign: 'center',
  },
  slider: { width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' },
  sliderLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 11,
    color: 'var(--text3)',
  },
  addBtn: {
    width: '100%',
    background: 'transparent',
    border: '2px dashed var(--primary-light)',
    borderRadius: 10,
    padding: '13px',
    cursor: 'pointer',
    fontSize: 14,
    color: 'var(--primary)',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'all 0.2s',
  },
  addIcon: {
    width: 22,
    height: 22,
    background: 'var(--primary)',
    color: '#fff',
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    lineHeight: 1,
  },
  submitBtn: {
    width: '100%',
    background: 'linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '16px',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 8,
    letterSpacing: 0.3,
    boxShadow: '0 4px 20px rgba(79,70,229,0.4)',
    transition: 'opacity 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
};