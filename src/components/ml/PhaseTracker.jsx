import React from 'react';

export default function PhaseTracker({ phases, activePhaseId, completedMap, onSelectPhase }) {
  const getPhaseDoneCount = (phase) => {
    return phase.resources.filter(r => completedMap.has(r.id)).length;
  };

  const getPhasePct = (phase) => {
    const done = getPhaseDoneCount(phase);
    const total = phase.resources.length;
    return total > 0 ? Math.round((done / total) * 100) : 0;
  };

  return (
    <div className="g5" style={{ marginBottom: '24px' }}>
      {phases.map(p => {
        const done = getPhaseDoneCount(p);
        const total = p.resources.length;
        const pct = getPhasePct(p);
        const isActive = activePhaseId === p.id;
        const isDone = pct === 100;

        return (
          <div
            key={p.id}
            className="metric"
            onClick={() => onSelectPhase(p.id)}
            style={{
              cursor: 'pointer',
              borderColor: isActive ? 'var(--electric)' : isDone ? 'var(--volt-dim)' : 'var(--border)',
              background: isActive ? 'rgba(0, 229, 255, 0.03)' : 'var(--bg2)',
              padding: '12px 14px',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', fontWeight: 700, color: isActive ? 'var(--electric)' : 'var(--t3)' }}>
                PHASE {p.id}
              </span>
              {isDone && <span style={{ color: 'var(--volt)', fontSize: '10px' }}>✓</span>}
            </div>
            <div
              style={{
                fontFamily: 'var(--display)',
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--t1)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                marginBottom: '4px'
              }}
            >
              {p.subtitle}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--t3)', fontFamily: 'var(--mono)', marginTop: '6px' }}>
              <span>{done}/{total}</span>
              <span>{pct}%</span>
            </div>
            <div className="pbar" style={{ marginTop: '6px' }}>
              <div
                className="pfill"
                style={{
                  width: `${pct}%`,
                  backgroundColor: isDone ? 'var(--volt)' : isActive ? 'var(--electric)' : 'var(--t2)'
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
