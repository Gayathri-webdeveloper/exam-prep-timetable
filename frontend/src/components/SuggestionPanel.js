import React from 'react';

export default function SuggestionPanel({ suggestions }) {
  if (!suggestions?.length) return null;

  return (
    <div style={styles.panel}>
      <h3 style={styles.heading}>🎯 Smart Suggestions</h3>
      <div style={styles.grid}>
        {suggestions.map((s, i) => (
          <div key={i} style={styles.item}>
            <span style={styles.icon}>✓</span>
            <span style={styles.text}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  panel: {
    background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
    border: '1px solid #a7f3d0',
    borderRadius: 12,
    padding: '20px',
    marginBottom: 20,
  },
  heading: {
    color: '#065f46',
    marginBottom: 14,
    marginTop: 0,
    fontSize: 16,
    fontWeight: 700,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 10,
  },
  item: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    background: 'rgba(255,255,255,0.6)',
    borderRadius: 8,
    padding: '10px 12px',
  },
  icon: {
    color: '#10b981',
    fontWeight: 700,
    fontSize: 14,
    flexShrink: 0,
    marginTop: 1,
  },
  text: {
    color: '#064e3b',
    fontSize: 13,
    lineHeight: 1.5,
  },
};