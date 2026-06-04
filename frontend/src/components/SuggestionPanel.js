import React from 'react';

export default function SuggestionPanel({ suggestions }) {
  if (!suggestions?.length) return null;

  const icons = ['🎯', '⚡', '🧠', '😴', '💧', '🗣️', '📝', '🏃'];

  return (
    <div style={sp.panel}>
      <div style={sp.header}>
        <div style={sp.headerLeft}>
          <div style={sp.headerIcon}>🎯</div>
          <div>
            <h3 style={sp.title}>Smart Suggestions</h3>
            <p style={sp.sub}>Personalized tips for your study plan</p>
          </div>
        </div>
        <div style={sp.badge}>{suggestions.length} tips</div>
      </div>

      <div style={sp.grid}>
        {suggestions.map((s, i) => (
          <div key={i} style={sp.item} className="animate-fadeUp">
            <div style={sp.itemIcon}>{icons[i % icons.length]}</div>
            <p style={sp.itemText}>{s}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const sp = {
  panel: {
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    borderRadius: 'var(--radius)',
    padding: '24px 20px',
    marginBottom: 20,
    color: '#fff',
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 12,
  },
  headerLeft: { display: 'flex', gap: 12, alignItems: 'center' },
  headerIcon: {
    width: 44,
    height: 44,
    background: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
    backdropFilter: 'blur(10px)',
  },
  title: {
    fontSize: 17,
    fontWeight: 700,
    color: '#fff',
    marginBottom: 2,
  },
  sub: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  badge: {
    background: 'rgba(255,255,255,0.2)',
    color: '#fff',
    padding: '4px 12px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    backdropFilter: 'blur(10px)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 10,
  },
  item: {
    display: 'flex',
    gap: 10,
    alignItems: 'flex-start',
    background: 'rgba(255,255,255,0.12)',
    borderRadius: 10,
    padding: '12px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.15)',
  },
  itemIcon: { fontSize: 18, flexShrink: 0 },
  itemText: { fontSize: 13, color: 'rgba(255,255,255,0.92)', lineHeight: 1.5, margin: 0 },
};