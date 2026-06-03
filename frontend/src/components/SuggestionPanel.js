import React from 'react';

export default function SuggestionPanel({ suggestions }) {
  if (!suggestions?.length) return null;
  return (
    <div style={styles.panel}>
      <h3 style={styles.heading}>🎯 Smart Suggestions</h3>
      <ul style={styles.list}>
        {suggestions.map((s, i) => (
          <li key={i} style={styles.item}>
            <span style={styles.bullet}>✓</span> {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  panel: { background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10, padding: 20, marginBottom: 24 },
  heading: { color: '#065f46', marginBottom: 12 },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  item: { display: 'flex', gap: 8, marginBottom: 8, color: '#064e3b', fontSize: 14 },
  bullet: { color: '#10b981', fontWeight: 700 },
};