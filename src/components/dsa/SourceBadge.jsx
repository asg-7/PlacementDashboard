import React from 'react';

const sourceConfig = {
  leetcode: { label: 'LC', class: 'b-amber', color: '#FFA116' },
  lc: { label: 'LC', class: 'b-amber', color: '#FFA116' },
  neetcode: { label: 'NC', class: 'b-cyan', color: '#00E5FF' },
  nc: { label: 'NC', class: 'b-cyan', color: '#00E5FF' },
  striver: { label: 'Striver', class: 'b-purple', color: '#B04AFF' },
  tuf: { label: 'Striver', class: 'b-purple', color: '#B04AFF' },
  geeksforgeeks: { label: 'GFG', class: 'b-green', color: '#2F8D46' },
  gfg: { label: 'GFG', class: 'b-green', color: '#2F8D46' },
  hackerrank: { label: 'HR', class: 'b-blue', color: '#2EC866' },
  hr: { label: 'HR', class: 'b-blue', color: '#2EC866' }
};

export default function SourceBadge({ source, url }) {
  const normKey = String(source).toLowerCase().trim();
  const conf = sourceConfig[normKey] || { label: source, class: 'b-gray', color: '#8899BB' };

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`badge ${conf.class}`}
        style={{
          fontSize: '8px',
          padding: '2px 6px',
          textDecoration: 'none',
          border: `1px solid rgba(255,255,255,0.05)`,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '2px'
        }}
      >
        <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: conf.color }}></span>
        {conf.label}
      </a>
    );
  }

  return (
    <span
      className={`badge ${conf.class}`}
      style={{
        fontSize: '8px',
        padding: '2px 6px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '2px'
      }}
    >
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: conf.color }}></span>
      {conf.label}
    </span>
  );
}
