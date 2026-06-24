import React, { useState } from 'react';

export default function DsaMindmap({ 
  dsaPatternsData, 
  isProblemSolved, 
  togglePatternProblem,
  onLeafClick 
}) {
  const [selectedCatId, setSelectedCatId] = useState(dsaPatternsData[0]?.id || 'recursion');

  // Calculate stats for a node recursively
  const getStats = (node) => {
    let solved = 0;
    let total = 0;
    const recurse = (n) => {
      if (n.problems) {
        n.problems.forEach(p => {
          total++;
          if (isProblemSolved(p)) solved++;
        });
      }
      if (n.children) {
        n.children.forEach(c => recurse(c));
      }
    };
    recurse(node);
    return { solved, total };
  };

  const selectedCategory = dsaPatternsData.find(cat => cat.id === selectedCatId) || dsaPatternsData[0];
  const activeColor = selectedCategory?.color || '#00E5FF';

  // Recursive component to render tree nodes horizontally
  const TreeNode = ({ node, isRoot = false, depth = 0 }) => {
    const { solved, total } = getStats(node);
    const hasChildren = node.children && node.children.length > 0;
    const isLeaf = !hasChildren;

    const nodeStyle = {
      display: 'flex',
      alignItems: 'center',
      padding: '8px 12px',
      borderRadius: '8px',
      background: isRoot ? `${activeColor}15` : 'var(--bg2)',
      border: `1px solid ${isRoot ? activeColor : 'var(--border)'}`,
      boxShadow: isRoot ? `0 0 10px ${activeColor}30` : 'none',
      color: isRoot ? activeColor : 'var(--t1)',
      cursor: isLeaf ? 'pointer' : 'default',
      transition: 'all 0.2s ease',
      fontSize: '12px',
      fontWeight: isRoot || !isLeaf ? '600' : '400',
      whiteSpace: 'nowrap',
      gap: '8px',
      position: 'relative',
      zIndex: 2,
    };

    const nodeHoverStyle = isLeaf ? {
      transform: 'translateY(-1px)',
      boxShadow: `0 4px 12px ${activeColor}30`,
      borderColor: activeColor,
      background: 'rgba(255,255,255,0.05)',
    } : {};

    const [hover, setHover] = useState(false);

    return (
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          margin: '8px 0',
        }}
      >
        {/* Node box itself */}
        <div 
          style={{ ...nodeStyle, ...(hover ? nodeHoverStyle : {}) }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => {
            if (isLeaf && onLeafClick) {
              onLeafClick(node, [selectedCategory.name, node.name]);
            }
          }}
        >
          <span>{node.name}</span>
          <span 
            style={{ 
              fontSize: '10px', 
              fontFamily: 'var(--mono)',
              background: solved === total && total > 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.1)',
              color: solved === total && total > 0 ? '#22C55E' : 'var(--t3)',
              padding: '2px 6px',
              borderRadius: '4px'
            }}
          >
            {solved}/{total}
          </span>
          {isLeaf && (
            <span style={{ fontSize: '10px', opacity: 0.6 }}>↗</span>
          )}
        </div>

        {/* Children node column */}
        {hasChildren && (
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              paddingLeft: '32px', // Space for connecting lines
              position: 'relative',
            }}
          >
            {/* Draw connecting lines using CSS flex structure and SVGs */}
            <div 
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: '32px',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            >
              {node.children.map((child, idx) => {
                const totalChildren = node.children.length;
                // Calculate height offsets for layout line connectors
                const topPct = `${((idx + 0.5) / totalChildren) * 100}%`;
                return (
                  <svg
                    key={child.id}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '32px',
                      height: '100%',
                      overflow: 'visible'
                    }}
                  >
                    <path
                      d={`M 0,50% C 16,50% 16,${topPct} 32,${topPct}`}
                      fill="none"
                      stroke={activeColor}
                      strokeWidth="2"
                      opacity="0.6"
                    />
                  </svg>
                );
              })}
            </div>

            {node.children.map(child => (
              <TreeNode key={child.id} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Category selector */}
      <div 
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          scrollbarWidth: 'thin',
          borderBottom: '1px solid var(--border)'
        }}
      >
        {dsaPatternsData.map(cat => {
          const { solved, total } = getStats(cat);
          const isSelected = cat.id === selectedCatId;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCatId(cat.id)}
              style={{
                flexShrink: 0,
                background: isSelected ? `${cat.color}20` : 'transparent',
                color: isSelected ? cat.color : 'var(--t2)',
                border: `1px solid ${isSelected ? cat.color : 'var(--border)'}`,
                padding: '6px 12px',
                borderRadius: '16px',
                fontSize: '11px',
                fontFamily: 'var(--mono)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color }}></span>
              <span style={{ fontWeight: isSelected ? 700 : 400 }}>{cat.name}</span>
              <span style={{ fontSize: '10px', opacity: 0.8 }}>({solved}/{total})</span>
            </button>
          );
        })}
      </div>

      {/* Mindmap display area */}
      <div 
        style={{
          background: 'var(--bg1)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '24px',
          overflowX: 'auto',
          minHeight: '260px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          position: 'relative'
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
          <TreeNode node={selectedCategory} isRoot={true} />
        </div>
      </div>
    </div>
  );
}
