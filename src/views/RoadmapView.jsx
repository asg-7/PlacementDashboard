import React from 'react';

const PHASES = [
  { id: 'p1', name: "Phase 1: Foundation Lock", weeks: [1, 2, 3], icon: "🔒", description: "Consolidate core languages, set up professional portfolios, and secure standard certification footprints." },
  { id: 'p2', name: "Phase 2: System Design Ignition", weeks: [4, 5, 6], icon: "🔥", description: "Kickstart High-Level and Low-Level design practices, establish persistent scaling concepts, and deploy first Streamlit projects." },
  { id: 'p3', name: "Phase 3: Hard Skills Sprint", weeks: [7, 8, 9, 10, 11, 12], icon: "🏃", description: "Accelerate daily DSA coding, delve into ML/DL modeling, and build the initial retrieval augmented generation (RAG) prototype." },
  { id: 'p4', name: "Phase 4: Application Blitz", weeks: [13, 14, 15, 16, 17, 18, 19, 20], icon: "⚡", description: "Mass applications target, secure employee referrals, execute mock interview cycles, and begin cloud deployments." },
  { id: 'p5', name: "Phase 5: Close It Out", weeks: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30], icon: "🎓", description: "Final round interview simulated trials, salary package negotiations, and pre-joining professional preparation." }
];

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

  const renderProgressBar = (pct, color = 'var(--electric)') => {
    const safe = Math.max(0, Math.min(100, Number(pct || 0)));
    return (
      <div className="pbar">
        <div className="pfill" style={{ width: `${safe}%`, backgroundColor: color }}></div>
      </div>
    );
  };

  // Helper to determine if text has a resource link
  const renderTaskText = (text) => {
    // If text contains a resource name in parentheses, or we can suggest links based on keywords
    if (text.includes("Andrew Ng")) {
      return (
        <span>
          {text}{" "}
          <a href="https://www.coursera.org/specializations/machine-learning-introduction" target="_blank" rel="noopener noreferrer" className="task-resource-link" onClick={e => e.stopPropagation()}>
            [Resource ↗]
          </a>
        </span>
      );
    }
    if (text.includes("NeetCode 150") || text.includes("LeetCode")) {
      return (
        <span>
          {text}{" "}
          <a href="https://neetcode.io/practice" target="_blank" rel="noopener noreferrer" className="task-resource-link" onClick={e => e.stopPropagation()}>
            [Solve ↗]
          </a>
        </span>
      );
    }
    if (text.includes("Concept && Coding") || text.includes("Christopher Okhravi")) {
      return (
        <span>
          {text}{" "}
          <a href="https://www.youtube.com/@ConceptCoding" target="_blank" rel="noopener noreferrer" className="task-resource-link" onClick={e => e.stopPropagation()}>
            [Video ↗]
          </a>
        </span>
      );
    }
    return <span>{text}</span>;
  };

  return (
    <div style={{ animation: 'fade-in 0.4s ease-out' }}>
      <div className="ph">
        <div>
          <div className="ph-eyebrow">Placement 30-Week War Plan</div>
          <div className="ph-title">Sequential Execution Roadmap</div>
          <div className="ph-sub">{activeWeek ? 'Active Sprint: Week ' + activeWeek.week + ' · ' + activeWeek.title : 'Not started yet'}</div>
        </div>
      </div>

      {PHASES.map((phase) => {
        // Collect all weeks belonging to this phase
        const phaseWeeks = s.roadmapWeeks.filter(w => phase.weeks.includes(w.week));
        
        // Calculate cumulative progress for this phase
        let totalPhaseTasks = 0;
        let completedPhaseTasks = 0;
        
        phaseWeeks.forEach(w => {
          const tasks = w.tasks || [];
          totalPhaseTasks += tasks.length;
          const done = wt[w.id] || [];
          completedPhaseTasks += done.filter(Boolean).length;
        });
        
        const phasePct = totalPhaseTasks > 0 ? Math.round((completedPhaseTasks / totalPhaseTasks) * 100) : 0;
        
        // Determine phase active status
        const isPhaseActive = activeWeek && phase.weeks.includes(activeWeek.week);
        const isPhaseCompleted = phasePct === 100 && totalPhaseTasks > 0;
        
        let phaseColor = 'var(--t3)';
        let phaseStatusClass = 'phase-future';
        if (isPhaseCompleted) {
          phaseColor = 'var(--volt)';
          phaseStatusClass = 'phase-completed';
        } else if (isPhaseActive) {
          phaseColor = 'var(--electric)';
          phaseStatusClass = 'phase-active';
        }

        return (
          <div key={phase.id} className={`phase-section ${phaseStatusClass}`} style={{ marginBottom: '30px' }}>
            {/* Phase Header Card */}
            <div className="phase-header-card" style={{ borderLeft: `4px solid ${phaseColor}`, padding: '16px', background: 'var(--bg2)', borderRadius: 'var(--rs)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{phase.icon}</span> {phase.name}
                    {isPhaseActive && <span className="badge b-blue" style={{ fontSize: '9px' }}>IN PROGRESS</span>}
                    {isPhaseCompleted && <span className="badge b-green" style={{ fontSize: '9px' }}>COMPLETED</span>}
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--t2)', maxWidth: '650px', lineHeight: 1.4 }}>{phase.description}</p>
                </div>
                <div style={{ textAlign: 'right', minWidth: '120px' }}>
                  <span style={{ fontFamily: 'var(--mono)', fontWeight: 800, color: phaseColor }}>{phasePct}% Done</span>
                  <div style={{ marginTop: '6px' }}>
                    {renderProgressBar(phasePct, phaseColor)}
                  </div>
                </div>
              </div>
            </div>

            {/* Weeks belonging to this phase */}
            <div className="weeks-list" style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingLeft: '12px' }}>
              {phaseWeeks.map(w => {
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
                  <span className="badge b-blue">▶ CURRENT SPRINT</span>
                ) : weekStatus === 'past' ? (
                  <span className="badge b-green">✓ PAST</span>
                ) : (
                  <span className="badge b-gray">UPCOMING</span>
                );

                return (
                  <div className={`week-card week-${weekStatus}`} key={w.id} style={{ borderLeft: isActive ? '3px solid var(--electric)' : '1px solid var(--border)' }}>
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
                          {renderProgressBar(tasks.length ? (doneCount / tasks.length * 100) : 0, isActive ? 'var(--electric)' : 'var(--t3)')}
                        </div>
                      </div>
                    </div>

                    {w.milestone && (
                      <div style={{ background: 'var(--electric-dim)', borderLeft: '2px solid var(--electric)', padding: '9px 13px', borderRadius: '0 var(--rs) var(--rs) 0', marginBottom: '14px', marginLeft: '12px', fontSize: '12px', color: 'var(--t2)', lineHeight: 1.4 }}>
                        🎯 <strong>Milestone:</strong> {w.milestone}
                      </div>
                    )}

                    <div className="week-tasks-list">
                      {tasks.map((task, i) => (
                        <div
                          className={`week-task ${done[i] ? 'done' : ''}`}
                          onClick={() => handleToggleTask(w.id, i)}
                          key={i}
                          style={{ cursor: 'pointer', transition: 'all 0.15s' }}
                        >
                          <div className="wt-dot"></div>
                          <span className="wt-lbl">{renderTaskText(task)}</span>
                          {done[i] && (
                            <span style={{ fontSize: '10px', color: 'var(--volt)', flexShrink: 0, fontFamily: 'var(--mono)' }}>✓ Done</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
