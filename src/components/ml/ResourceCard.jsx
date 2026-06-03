import React from 'react';

export default function ResourceCard({ resource, isCompleted, onToggle }) {
  const getTypeEmoji = (type) => {
    switch (String(type).toLowerCase()) {
      case 'video': return '📺';
      case 'course': return '🎓';
      case 'reading': return '📖';
      case 'interactive': return '💻';
      default: return '🔗';
    }
  };

  const getTypeBadgeClass = (type) => {
    switch (String(type).toLowerCase()) {
      case 'video': return 'b-cyan';
      case 'course': return 'b-purple';
      case 'reading': return 'b-blue';
      case 'interactive': return 'b-rose';
      default: return 'b-gray';
    }
  };

  return (
    <div
      className={`card ${isCompleted ? 'done' : ''}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '16px',
        opacity: isCompleted ? 0.65 : 1,
        borderColor: isCompleted ? 'rgba(0, 229, 255, 0.08)' : 'var(--border)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <div
          className={`chk-box ${isCompleted ? 'done' : ''}`}
          onClick={onToggle}
          style={{ cursor: 'pointer', flexShrink: 0, marginTop: '2px' }}
        >
          {isCompleted ? '✓' : ''}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
            <span className={`badge ${getTypeBadgeClass(resource.type)}`} style={{ fontSize: '8px', padding: '1px 5px' }}>
              {getTypeEmoji(resource.type)} {resource.type}
            </span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--t3)' }}>
              {resource.provider}
            </span>
          </div>
          <h4
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--t1)',
              lineHeight: 1.4,
              textDecoration: isCompleted ? 'line-through' : 'none'
            }}
          >
            {resource.title}
          </h4>
        </div>
      </div>

      {resource.notes && (
        <p style={{ fontSize: '11px', color: 'var(--t3)', lineHeight: 1.5, background: 'rgba(0,0,0,0.15)', padding: '6px 10px', borderRadius: 'var(--rs)' }}>
          {resource.notes}
        </p>
      )}

      {resource.link && (
        <div style={{ marginTop: 'auto', alignSelf: 'flex-end' }}>
          <a
            href={resource.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-xs"
            style={{ padding: '3px 8px' }}
          >
            Access Resource ↗
          </a>
        </div>
      )}
    </div>
  );
}
