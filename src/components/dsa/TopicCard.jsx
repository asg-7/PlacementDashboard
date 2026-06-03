import React from 'react';

export default function TopicCard({ topic, doneCount, totalCount, onSelect }) {
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
  
  // SVG Ring Calculations
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <div className="card" onClick={onSelect} style={{ cursor: 'pointer', display: 'flex', gap: '16px', alignItems: 'center' }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="topic-tag" style={{ textTransform: 'uppercase', fontSize: '8px' }}>Roadmap</span>
          {pct === 100 && <span className="badge b-green" style={{ fontSize: '8px', padding: '2px 5px' }}>Completed</span>}
        </div>
        <h3 style={{ fontFamily: 'var(--display)', fontSize: '16px', fontWeight: 700, color: 'var(--t1)', marginBottom: '4px' }}>
          {topic.title}
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--t3)', lineHeight: 1.4, marginBottom: '10px' }}>
          {topic.description}
        </p>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--t2)' }}>
          {doneCount} / {totalCount} Problems Solved
        </div>
      </div>

      {/* Circular Progress Ring */}
      <div style={{ position: 'relative', width: '56px', height: '56px', flexShrink: 0 }}>
        <svg width="56" height="56" viewBox="0 0 56 56" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx="28"
            cy="28"
            r={radius}
            fill="transparent"
            stroke="var(--border)"
            strokeWidth="3.5"
          />
          {/* Progress circle */}
          <circle
            cx="28"
            cy="28"
            r={radius}
            fill="transparent"
            stroke="var(--electric)"
            strokeWidth="3.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.4s ease' }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--mono)',
          fontSize: '11px',
          fontWeight: 700,
          color: pct > 0 ? 'var(--electric)' : 'var(--t3)'
        }}>
          {pct}%
        </div>
      </div>
    </div>
  );
}
