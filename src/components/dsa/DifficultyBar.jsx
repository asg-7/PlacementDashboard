import React from 'react';

export default function DifficultyBar({ easyCount, mediumCount, hardCount }) {
  const total = easyCount + mediumCount + hardCount;
  const easyPct = total > 0 ? (easyCount / total) * 100 : 0;
  const mediumPct = total > 0 ? (mediumCount / total) * 100 : 0;
  const hardPct = total > 0 ? (hardCount / total) * 100 : 0;

  if (total === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
      <div style={{ display: 'flex', height: '4px', borderRadius: '2px', overflow: 'hidden', background: 'var(--border)' }}>
        <div style={{ width: `${easyPct}%`, background: 'var(--volt)' }} title={`Easy: ${easyCount}`} />
        <div style={{ width: `${mediumPct}%`, background: 'var(--amber)' }} title={`Medium: ${mediumCount}`} />
        <div style={{ width: `${hardPct}%`, background: 'var(--coral)' }} title={`Hard: ${hardCount}`} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: '8px', color: 'var(--t3)' }}>
        <span style={{ color: 'var(--volt)' }}>E: {easyCount}</span>
        <span style={{ color: 'var(--amber)' }}>M: {mediumCount}</span>
        <span style={{ color: 'var(--coral)' }}>H: {hardCount}</span>
      </div>
    </div>
  );
}
