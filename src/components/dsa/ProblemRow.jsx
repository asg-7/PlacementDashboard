import React from 'react';
import SourceBadge from './SourceBadge';

export default function ProblemRow({ problem, isCompleted, onToggle, onClick }) {
  const getDiffColor = (diff) => {
    switch (String(diff).toLowerCase()) {
      case 'easy': return 'var(--volt)';
      case 'medium': return 'var(--amber)';
      case 'hard': return 'var(--coral)';
      default: return 'var(--t2)';
    }
  };

  const getDiffClass = (diff) => {
    switch (String(diff).toLowerCase()) {
      case 'easy': return 'diff-e';
      case 'medium': return 'diff-m';
      case 'hard': return 'diff-h';
      default: return '';
    }
  };

  return (
    <tr style={{ cursor: 'pointer' }} onClick={onClick}>
      <td onClick={(e) => e.stopPropagation()} style={{ width: '40px' }}>
        <div
          className={`chk-box ${isCompleted ? 'done' : ''}`}
          onClick={onToggle}
          style={{ cursor: 'pointer', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {isCompleted ? '✓' : ''}
        </div>
      </td>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600, color: isCompleted ? 'var(--t3)' : 'var(--t1)', textDecoration: isCompleted ? 'line-through' : 'none' }}>
            {problem.title}
          </span>
          {problem.patterns && problem.patterns.map(pat => (
            <span key={pat} className="topic-tag" style={{ fontSize: '8px', padding: '1px 5px', margin: 0 }}>
              {pat}
            </span>
          ))}
        </div>
      </td>
      <td>
        <span className={getDiffClass(problem.difficulty)} style={{ fontFamily: 'var(--mono)', fontSize: '11px', fontWeight: 700, textTransform: 'capitalize' }}>
          {problem.difficulty}
        </span>
      </td>
      <td>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {/* If the problem is formatted with sources as an array or object */}
          {Array.isArray(problem.sources) ? (
            problem.sources.map(src => <SourceBadge key={src} source={src} />)
          ) : problem.sources && typeof problem.sources === 'object' ? (
            Object.keys(problem.sources).map(src => {
              if (problem.sources[src]) {
                return <SourceBadge key={src} source={src} url={problem.sources[src]} />;
              }
              return null;
            })
          ) : (
            <SourceBadge source={problem.platform || 'LeetCode'} />
          )}
        </div>
      </td>
      <td>
        <div style={{ display: 'flex', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
          {problem.link ? (
            <a
              href={problem.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-xs"
              style={{ padding: '3px 8px' }}
            >
              Solve ↗
            </a>
          ) : problem.sources && typeof problem.sources === 'object' ? (
            Object.entries(problem.sources).map(([key, val]) => {
              if (val) {
                return (
                  <a
                    key={key}
                    href={val}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-xs"
                    style={{ padding: '3px 6px', textTransform: 'capitalize' }}
                  >
                    {key} ↗
                  </a>
                );
              }
              return null;
            })
          ) : (
            <span style={{ fontSize: '11px', color: 'var(--t3)' }}>—</span>
          )}
        </div>
      </td>
    </tr>
  );
}
