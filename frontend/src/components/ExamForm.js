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
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.heading}>📚 Create Exam Timetable</h2>

      <div style={styles.field}>
        <label>Timetable Title</label>
        <input
          style={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Semester 5 Exams"
          required
        />
      </div>

      <div style={styles.field}>
        <label>Study Start Date</label>
        <input
          style={styles.input}
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>

      <h3 style={styles.subheading}>Exams</h3>

      {exams.map((exam, i) => (
        <div key={i} style={styles.examCard}>
          <div style={styles.examHeader}>
            <strong>Exam {i + 1}</strong>
            {exams.length > 1 && (
              <button
                type="button"
                onClick={() => removeExam(i)}
                style={styles.removeBtn}
              >
                Remove
              </button>
            )}
          </div>

          <div style={styles.grid2}>
            <div style={styles.field}>
              <label>Subject *</label>
              <input
                style={styles.input}
                value={exam.subject}
                onChange={(e) => updateExam(i, 'subject', e.target.value)}
                placeholder="e.g. Mathematics"
                required
              />
            </div>
            <div style={styles.field}>
              <label>Exam Date *</label>
              <input
                style={styles.input}
                type="date"
                value={exam.examDate}
                onChange={(e) => updateExam(i, 'examDate', e.target.value)}
                required
              />
            </div>
            <div style={styles.field}>
              <label>Difficulty</label>
              <select
                style={styles.input}
                value={exam.difficulty}
                onChange={(e) => updateExam(i, 'difficulty', e.target.value)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div style={styles.field}>
              <label>Study Hours/Day</label>
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
            <label>Topics (comma-separated)</label>
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
        {loading ? 'Generating...' : '🗓️ Generate Timetable'}
      </button>
    </form>
  );
}

const styles = {
  form: { maxWidth: 720, margin: '0 auto', padding: 24, fontFamily: 'sans-serif' },
  heading: { fontSize: 24, marginBottom: 20 },
  subheading: { fontSize: 18, marginTop: 24, marginBottom: 12 },
  field: { display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 },
  input: { padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', fontSize: 14 },
  examCard: { background: '#f8f9fa', border: '1px solid #e0e0e0', borderRadius: 8, padding: 16, marginBottom: 16 },
  examHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 12 },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  removeBtn: { background: '#ff4d4d', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' },
  addBtn: { background: '#fff', border: '1px dashed #999', borderRadius: 6, padding: '10px 20px', cursor: 'pointer', marginRight: 12 },
  submitBtn: { background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '12px 24px', fontSize: 15, cursor: 'pointer' },
};