import React from 'react';

export default function RoadmapView({ state, mutateState, todayContext, addToast }) {
  const s = state;
  const wt = s.weekTasks || {};
  const activeWeek = todayContext.activeWeek;
  const today = todayContext.today;

  const handleToggleTask = (weekId, idx) => {
    mutateState(draft => {
      if (!draft.weekTasks) draft.weekTasks = {};
      const w = draft.roadmapWeeks.find(x => x.id === weekId);
      const taskLen = w ? (w.tasks || []).length : 0;
      if (!draft.weekTasks[weekId]) {
        draft.weekTasks[weekId] = new Array(taskLen).fill(false);
      }
      draft.weekTasks[weekId][idx] = !draft.weekTasks[weekId][idx];

      const todayStr = new Date().toISOString().slice(0, 10);
      if (!draft.activity) draft.activity = {};
      if (draft.weekTasks[weekId][idx]) {
        draft.activity[todayStr] = (draft.activity[todayStr] || 0) + 1;
      } else {
        draft.activity[todayStr] = Math.max(0, (draft.activity[todayStr] || 0) - 1);
      }
    });
  };

  const renderProgressBar = (pct) => {
    const safe = Math.max(0, Math.min(100, Number(pct || 0)));
    return (
      <div className="pbar">
        <div className="pfill" style={{ width: `${safe}%` }}></div>
      </div>
    );
  };

  return (
    <div style={{ animation: 'fade-in 0.4s ease-out' }}>
      <div className="ph">
        <div>
          <div className="ph-eyebrow">30-Week Plan</div>
          <div className="ph-title">Roadmap</div>
          <div className="ph-sub">{activeWeek ? 'Currently: ' + activeWeek.title : 'Not started yet'}</div>
        </div>
      </div>

      {s.roadmapWeeks.map(w => {
        const tasks = w.tasks || [];
        const done = wt[w.id] || new Array(tasks.length).fill(false);
        const doneCount = done.filter(Boolean).length;
        const isActive = activeWeek && w.id === activeWeek.id;

        let weekStatus = 'future';
        if (w.dates) {
          try {
            const isoMatch = w.dates.match(/(\d{4}-\d{2}-\d{2})\s*[–—-]+\s*(\d{4}-\d{2}-\d{2})/);
            if (isoMatch) {
              const startDate = new Date(isoMatch[1]);
              const endDate = new Date(isoMatch[2]);
              const todayDate = new Date(today + 'T00:00:00');
              if (endDate < todayDate) weekStatus = 'past';
              else if (todayDate >= startDate && todayDate <= endDate) weekStatus = 'current';
            }
          } catch (e) {
            console.error('Roadmap week dates parsing error', e);
          }
        }

        const statusLabel = isActive ? (
          <span className="badge b-blue">▶ CURRENT</span>
        ) : weekStatus === 'past' ? (
          <span className="badge b-green">✓ PAST</span>
        ) : (
          <span className="badge b-gray">UPCOMING</span>
        );

        return (
          <div className={`week-card week-${weekStatus}`} key={w.id}>
            <div className="week-hdr">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '3px' }}>
                  <span className="week-num">Week {w.week}</span>
                  <span className="week-title">{w.title}</span>
                  {statusLabel}
                </div>
                <div className="week-dates">{w.dates}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--t2)', fontWeight: 700 }}>
                  {doneCount}/{tasks.length}
                </div>
                <div style={{ width: '100px', marginTop: '4px' }}>
                  {renderProgressBar(tasks.length ? (doneCount / tasks.length * 100) : 0)}
                </div>
              </div>
            </div>

            {w.milestone && (
              <div style={{ background: 'var(--electric-dim)', borderLeft: '2px solid var(--electric)', padding: '9px 13px', borderRadius: '0 var(--rs) var(--rs) 0', marginBottom: '14px', marginLeft: '12px', fontSize: '12px', color: 'var(--t2)', lineHeight: 1.4 }}>
                {w.milestone}
              </div>
            )}

            <div>
              {tasks.map((task, i) => (
                <div
                  className={`week-task ${done[i] ? 'done' : ''}`}
                  onClick={() => handleToggleTask(w.id, i)}
                  key={i}
                >
                  <div className="wt-dot"></div>
                  <span className="wt-lbl">{task}</span>
                  {done[i] && (
                    <span style={{ fontSize: '10px', color: 'var(--volt)', flexShrink: 0, fontFamily: 'var(--mono)' }}>✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
