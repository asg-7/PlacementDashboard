import React from 'react';

export default function DashboardView({ state, mutateState, onNavigate, todayContext }) {
  const s = state;
  const ctx = todayContext;
  const wt = s.weekTasks || {};

  const appSent = s.companies.filter(c => c.status !== 'not applied').length;
  const certDone = s.certifications.filter(c => c.progress >= 100).length;
  const certTotal = s.certifications.length;
  const dsaSolved = (s.dsaProblems || []).filter(d => d.status === 'solved').length;
  const hackReg = s.hackathons.filter(h => h.reg === 'registered' || h.reg === 'submitted').length;
  const activeWeek = ctx.activeWeek;
  const weekTasks = activeWeek ? (activeWeek.tasks || []) : [];
  const weekDoneArr = activeWeek ? (wt[activeWeek.id] || new Array(weekTasks.length).fill(false)) : [];
  const weekPct = weekTasks.length ? Math.round(weekDoneArr.filter(Boolean).length / weekTasks.length * 100) : 0;
  const openNow = ctx.openNow.slice(0, 5);
  const study = ctx.studyPlan;
  const overdueCount = ctx.overdueTasks.length;

  const certProgress = certTotal ? s.certifications.reduce((sum, c) => sum + (c.progress || 0), 0) / certTotal : 0;

  const pending = s.companies.filter(c => c.status === 'applied').slice(0, 6);

  const today2 = ctx.today;
  const allDeadlines = [
    ...s.hackathons.filter(h => h.deadline >= today2).slice(0, 4).map(h => ({ label: h.name, date: h.deadline, type: 'hackathon' })),
    ...s.certifications.filter(c => c.deadline >= today2 && c.progress < 100).slice(0, 3).map(c => ({ label: c.name, date: c.deadline, type: 'cert' }))
  ].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 7);

  const handleToggleTask = (weekId, idx) => {
    mutateState(draft => {
      if (!draft.weekTasks) draft.weekTasks = {};
      if (!draft.weekTasks[weekId]) {
        const w = draft.roadmapWeeks.find(x => x.id === weekId);
        const taskLen = w ? (w.tasks || []).length : 0;
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

  const getStatusBadgeClass = (val) => {
    return `badge b-${String(val || 'gray').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  };

  const renderProgressBar = (pct, color = 'var(--electric)') => {
    const safe = Math.max(0, Math.min(100, Number(pct || 0)));
    return (
      <div style={{ marginTop: '8px' }}>
        <div className="pbar" aria-label="Progress">
          <div className="pfill" style={{ width: `${safe}%`, backgroundColor: color }}></div>
        </div>
        <small style={{ display: 'block', marginTop: '4px', fontSize: '10px', color: 'var(--t3)', fontFamily: 'var(--mono)' }}>{safe}%</small>
      </div>
    );
  };

  return (
    <div style={{ animation: 'fade-in 0.4s ease-out' }}>
      <div className="ph" style={{ marginBottom: '20px' }}>
        <div>
          <div className="ph-eyebrow">Week {ctx.weekNum + 1} · {ctx.dayName}</div>
          <div className="ph-title">Mission Control</div>
          <div className="ph-sub">{activeWeek ? activeWeek.title : 'Placement Execution OS'} {activeWeek ? `· ${activeWeek.dates}` : ''}</div>
        </div>
        {overdueCount > 0 && (
          <div className="badge b-red" style={{ fontSize: '11px', padding: '8px 14px' }}>
            ⚠ {overdueCount} overdue task{overdueCount > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* TODAY'S BRIEFING */}
      <div className="briefing">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '2px', color: 'var(--electric)', textTransform: 'uppercase', marginBottom: '4px' }}>Today's Focus</div>
            <div style={{ fontFamily: 'var(--display)', fontSize: '17px', fontWeight: '700', color: 'var(--t1)', letterSpacing: '-.3px' }}>{study.topic}</div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {study.resources.map((r, i) => (
              <span className="stat-chip" key={i}>📺 {r}</span>
            ))}
          </div>
        </div>
        <div style={{ background: 'rgba(0,0,0,.25)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '10px 14px', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--t2)' }}>
          <span style={{ color: 'var(--volt)', marginRight: '6px' }}>▶</span>{study.action}
        </div>
        {openNow.length > 0 && (
          <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '2px', color: 'var(--amber)', textTransform: 'uppercase', marginBottom: '8px' }}>
              {openNow.length} Application Window{openNow.length > 1 ? 's' : ''} Open Now
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {openNow.map((c, i) => (
                <span className="stat-chip" style={{ color: 'var(--amber)', borderColor: 'rgba(255,184,0,.2)' }} key={i}>🏢 {c.companyName}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* KPI STRIP */}
      <div className="g5" style={{ marginBottom: '20px' }}>
        <div className="metric">
          <div className="metric-icon">📤</div>
          <div className="metric-val" style={{ color: 'var(--electric)' }}>{appSent}</div>
          <div className="metric-lbl">Applications</div>
          <div className="metric-sub">{s.companies.length} targets</div>
          <div className="metric-glow" style={{ background: 'var(--electric)' }}></div>
          {renderProgressBar(appSent / s.companies.length * 100)}
        </div>
        <div className="metric">
          <div className="metric-icon">🏆</div>
          <div className="metric-val" style={{ color: 'var(--volt)' }}>{certDone}</div>
          <div className="metric-lbl">Certs Done</div>
          <div className="metric-sub">{certTotal} total · {Math.round(certProgress)}% avg</div>
          <div className="metric-glow" style={{ background: 'var(--volt)' }}></div>
          {renderProgressBar(certDone / certTotal * 100, 'var(--volt)')}
        </div>
        <div className="metric">
          <div className="metric-icon">⚡</div>
          <div className="metric-val" style={{ color: 'var(--amber)' }}>{dsaSolved}</div>
          <div className="metric-lbl">DSA Solved</div>
          <div className="metric-sub">{(s.dsaProblems || []).length} total logged</div>
          <div className="metric-glow" style={{ background: 'var(--amber)' }}></div>
          {renderProgressBar(Math.min(dsaSolved, 100), 'var(--amber)')}
        </div>
        <div className="metric">
          <div className="metric-icon">🔥</div>
          <div className="metric-val" style={{ color: 'var(--violet)' }}>{hackReg}</div>
          <div className="metric-lbl">Hackathons</div>
          <div className="metric-sub">{s.hackathons.length} total</div>
          <div className="metric-glow" style={{ background: 'var(--violet)' }}></div>
          {renderProgressBar(hackReg / s.hackathons.length * 100, 'var(--violet)')}
        </div>
        <div className="metric">
          <div className="metric-icon">🗓</div>
          <div className="metric-val" style={{ color: 'var(--rose)' }}>{weekPct}%</div>
          <div className="metric-lbl">Week Progress</div>
          <div className="metric-sub">{weekDoneArr.filter(Boolean).length} / {weekTasks.length} tasks</div>
          <div className="metric-glow" style={{ background: 'var(--rose)' }}></div>
          {renderProgressBar(weekPct, 'var(--rose)')}
        </div>
      </div>

      <div className="g2">
        <div>
          {/* THIS WEEK'S TASKS */}
          <div className="card" style={{ marginBottom: '16px' }}>
            <div className="card-hdr">
              <div>
                <div className="card-title">This Week's Tasks</div>
                <div className="card-label" style={{ fontSize: '14px', marginTop: '2px' }}>{activeWeek ? activeWeek.title : 'No active week'}</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('roadmap')}>Open →</button>
            </div>
            {weekTasks.length > 0 && (
              <div className="week-dots" style={{ marginBottom: '14px' }}>
                {weekTasks.map((_, i) => (
                  <div className={`week-dot ${weekDoneArr[i] ? 'done' : ''}`} key={i}></div>
                ))}
              </div>
            )}
            <div>
              {weekTasks.length === 0 ? (
                <div className="note-box">No tasks for this week yet.</div>
              ) : (
                weekTasks.map((task, i) => (
                  <div
                    className={`chk-item ${weekDoneArr[i] ? 'done' : ''}`}
                    onClick={() => handleToggleTask(activeWeek.id, i)}
                    key={i}
                  >
                    <div className="chk-box">{weekDoneArr[i] ? '✓' : ''}</div>
                    <span className="chk-lbl">{task}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* PENDING APPLICATIONS */}
          <div className="card">
            <div className="card-hdr">
              <div>
                <div className="card-title">Pending Applications</div>
                <div className="card-label" style={{ fontSize: '14px', marginTop: '2px' }}>Follow up after 7 days</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('applications')}>Tracker →</button>
            </div>
            {pending.length === 0 ? (
              <div className="note-box">No pending applications. Start applying!</div>
            ) : (
              pending.map((c, i) => (
                <div className="dl-row" key={c.id || i}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--t1)' }}>{c.companyName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--t3)', fontFamily: 'var(--mono)' }}>{c.role} · {c.ctc}</div>
                  </div>
                  <span className={getStatusBadgeClass(c.status)}>{c.status}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          {/* UPCOMING DEADLINES */}
          <div className="card" style={{ marginBottom: '16px' }}>
            <div className="card-hdr">
              <div>
                <div className="card-title">Upcoming Deadlines</div>
                <div className="card-label" style={{ fontSize: '14px', marginTop: '2px' }}>Hackathons + Certs</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('hackathons')}>All →</button>
            </div>
            {allDeadlines.length ? (
              allDeadlines.map((d, i) => (
                <div className="dl-row" key={i}>
                  <span className="dl-date">{d.date}</span>
                  <span className="dl-label">{d.label}</span>
                  <span className={`badge ${d.type === 'hackathon' ? 'b-purple' : 'b-cyan'}`}>{d.type}</span>
                </div>
              ))
            ) : (
              <div className="note-box">No upcoming deadlines!</div>
            )}
          </div>

          {/* CURRENT MILESTONE */}
          <div className="card">
            <div className="card-hdr">
              <div>
                <div className="card-title">Current Milestone</div>
                <div className="card-label" style={{ fontSize: '14px', marginTop: '2px' }}>{activeWeek ? activeWeek.title : '—'}</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('roadmap')}>Roadmap →</button>
            </div>
            {activeWeek ? (
              <>
                <div style={{ background: 'var(--electric-dim)', border: '1px solid rgba(0,229,255,.15)', borderRadius: 'var(--rs)', padding: '12px 14px', marginBottom: '14px', fontSize: '13px', color: 'var(--t2)', lineHeight: '1.5' }}>
                  {activeWeek.milestone || activeWeek.dates || ''}
                </div>
                {(activeWeek.tasks || []).slice(0, 4).map((m, i) => (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '5px 0' }} key={i}>
                    <span style={{ color: 'var(--electric)', fontSize: '10px', marginTop: '3px', flexShrink: 0 }}>◆</span>
                    <span style={{ fontSize: '12px', color: 'var(--t2)', lineHeight: '1.4' }}>{m}</span>
                  </div>
                ))}
              </>
            ) : (
              <div className="note-box">No active week found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
