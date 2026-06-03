import React, { useState } from 'react';

const emptyExam = {
  subject: '',
  examDate: '',
  difficulty: 'medium',
  topics: '',
  hoursPerDay: 4,
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
    const payload = {
      title,
      startDate,
      exams: exams.map((ex) => ({
        ...ex,
        topics: ex.topics
          ? ex.topics.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
        hoursPerDay: Number(ex.hoursPerDay),
      })),
    };
    onSubmit(payload);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.heading}>📚 Create Exam Timetable</h2>
        <p style={styles.subtext}>Fill in your exam details and we'll generate a smart study schedule.</p>

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Timetable Title *</label>
            <input
              style={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Semester 5 Exams"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Study Start Date *</label>
            <input
              style={styles.input}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <h3 style={styles.subheading}>📋 Your Exams</h3>

          {exams.map((exam, i) => (
            <div key={i} style={styles.examCard}>
              <div style={styles.examHeader}>
                <span style={styles.examBadge}>Exam {i + 1}</span>
                {exams.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExam(i)}
                    style={styles.removeBtn}
                  >
                    ✕ Remove
                  </button>
                )}
              </div>

              <div style={styles.grid2}>
                <div style={styles.field}>
                  <label style={styles.label}>Subject *</label>
                  <input
                    style={styles.input}
                    value={exam.subject}
                    onChange={(e) => updateExam(i, 'subject', e.target.value)}
                    placeholder="e.g. Mathematics"
                    required
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Exam Date *</label>
                  <input
                    style={styles.input}
                    type="date"
                    value={exam.examDate}
                    onChange={(e) => updateExam(i, 'examDate', e.target.value)}
                    required
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Difficulty</label>
                  <select
                    style={styles.input}
                    value={exam.difficulty}
                    onChange={(e) => updateExam(i, 'difficulty', e.target.value)}
                  >
                    <option value="easy">🟢 Easy</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="hard">🔴 Hard</option>
                  </select>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Study Hours/Day</label>
                  <input
                    style={styles.input}
                    type="number"
                    min="1"
                    max="12"
                    value={exam.hoursPerDay}
                    onChange={(e) => updateExam(i, 'hoursPerDay', e.target.value)}
                  />
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Topics (comma-separated)</label>
                <input
                  style={styles.input}
                  value={exam.topics}
                  onChange={(e) => updateExam(i, 'topics', e.target.value)}
                  placeholder="e.g. Algebra, Calculus, Statistics"
                />
              </div>
            </div>
          ))}

          <button type="button" onClick={addExam} style={styles.addBtn}>
            + Add Another Exam
          </button>

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? '⏳ Generating...' : '🗓️ Generate Timetable'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    width: '100%',
  },
  card: {
    background: '#fff',
    borderRadius: 12,
    padding: '24px 20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  heading: {
    fontSize: 22,
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: 6,
    marginTop: 0,
  },
  subtext: {
    color: '#64748b',
    fontSize: 14,
    marginBottom: 20,
    marginTop: 0,
  },
  subheading: {
    fontSize: 16,
    fontWeight: 600,
    color: '#1e293b',
    marginTop: 24,
    marginBottom: 12,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: '#475569',
  },
  input: {
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid #cbd5e1',
    fontSize: 14,
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
    background: '#f8fafc',
  },
  examCard: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 10,
    padding: '16px',
    marginBottom: 16,
  },
  examHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  examBadge: {
    background: '#dbeafe',
    color: '#1e40af',
    padding: '4px 12px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 600,
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: 12,
  },
  removeBtn: {
    background: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: 6,
    padding: '6px 12px',
    cursor: 'pointer',
    fontSize: 13,
  },
  addBtn: {
    background: '#fff',
    border: '2px dashed #94a3b8',
    borderRadius: 8,
    padding: '12px 20px',
    cursor: 'pointer',
    fontSize: 14,
    color: '#475569',
    width: '100%',
    marginBottom: 14,
    fontWeight: 500,
  },
  submitBtn: {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '14px 24px',
    fontSize: 16,
    cursor: 'pointer',
    width: '100%',
    fontWeight: 600,
    letterSpacing: 0.3,
  },
};