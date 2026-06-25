import React, { useState } from 'react';
import { useProgress } from '../hooks/useProgress';
import { dsaTopicsData } from '../data/dsaTopics';
import { striverTopics } from '../data/striverSheet';
import { mlPhasesData } from '../data/mlResources';
import { dsaPatternsData } from '../data/dsaPatterns';
import DsaMindmap from '../components/dsa/DsaMindmap';

export default function DashboardView({ state, mutateState, onNavigate, todayContext, addToast, clearOverdueTasks }) {
  const s = state;
  const ctx = todayContext;
  const wt = s.weekTasks || {};

  const [retro, setRetro] = useState(s.retro || { appsThisWeek: '', dsaThisWeek: '', wentWell: '', toImprove: '' });

  const appSent = s.companies.filter(c => c.status !== 'not applied').length;
  const certDone = s.certifications.filter(c => c.progress >= 100).length;
  const certTotal = s.certifications.length;
  const patternSolvedCount = (() => {
    try {
      return JSON.parse(localStorage.getItem('placement_os_dsaPatterns_v1') || "[]").length;
    } catch(e) {
      return 0;
    }
  })();
  const realLcSolved = Number(localStorage.getItem('leetcode_solved_count_v1') || '0');
  const realCfSolved = Number(localStorage.getItem('codeforces_solved_count_v1') || '0');
  const realGfgSolved = Number(localStorage.getItem('geeksforgeeks_solved_count_v1') || '0');
  const dsaSolved = Math.max(realLcSolved + realCfSolved + realGfgSolved, patternSolvedCount + (s.dsaProblems || []).filter(d => d.status === 'solved').length);
  const hackReg = s.hackathons.filter(h => h.reg === 'registered' || h.reg === 'submitted').length;
  const activeWeek = ctx.activeWeek;
  const weekTasks = activeWeek ? (activeWeek.tasks || []) : [];
  const weekDoneArr = activeWeek ? (wt[activeWeek.id] || new Array(weekTasks.length).fill(false)) : [];
  const weekPct = weekTasks.length ? Math.round(weekDoneArr.filter(Boolean).length / weekTasks.length * 100) : 0;
  const openNow = ctx.openNow.slice(0, 5);
  const study = ctx.studyPlan;
  const overdueCount = ctx.overdueTasks.length;

  const certProgress = certTotal ? s.certifications.reduce((sum, c) => sum + (c.progress || 0), 0) / certTotal : 0;

  // Curriculum Metrics
  const { count: dsaRoadmapCount, done: dsaRoadmapProgress, toggle: toggleRoadmapProblem } = useProgress('dsa_roadmap');
  const { count: striverCount, done: striverProgress, toggle: toggleStriverProblem } = useProgress('striver_a2z');
  const { count: neetcodeCount, done: neetcodeProgress, toggle: toggleNeetcodeProblem } = useProgress('neetcode_150');
  const { count: systemDesignCount } = useProgress('system_design');
  const { count: mlCount } = useProgress('ml_roadmap');
  const { count: gsPuzzlesCount } = useProgress('gs_puzzles');

  const [selectedLeafPattern, setSelectedLeafPattern] = useState(null);
  const [parentBreadcrumbs, setParentBreadcrumbs] = useState([]);

  const isProblemSolved = (prob) => {
    if (prob.id) {
      if (prob.id.startsWith('nc-')) return neetcodeProgress.has(prob.id);
      if (prob.id.startsWith('s-')) return striverProgress.has(prob.id);
      if (prob.id.startsWith('d-') || prob.id.startsWith('d1') || prob.id.startsWith('d2') || prob.id.startsWith('d3')) return dsaRoadmapProgress.has(prob.id);
    }
    const foundInKits = (s.dsaProblems || []).some(
      x => x.problem.toLowerCase() === prob.title.toLowerCase() && x.status === 'solved'
    );
    if (foundInKits) return true;
    return dsaRoadmapProgress.has(prob.id || prob.title);
  };

  const togglePatternProblem = (prob) => {
    if (prob.id) {
      if (prob.id.startsWith('nc-')) toggleNeetcodeProblem(prob.id);
      else if (prob.id.startsWith('s-')) toggleStriverProblem(prob.id);
      else toggleRoadmapProblem(prob.id);
    } else {
      const kitProb = (s.dsaProblems || []).find(x => x.problem.toLowerCase() === prob.title.toLowerCase());
      if (kitProb) {
        mutateState(draft => {
          const p = draft.dsaProblems.find(x => x.id === kitProb.id);
          if (p) p.status = p.status === 'solved' ? 'attempted' : 'solved';
        });
      } else {
        toggleRoadmapProblem(prob.title);
      }
    }
    addToast(`Updated status for: ${prob.title}`);
  };

  const handleLeafClick = (leafNode, breadcrumbs) => {
    setSelectedLeafPattern(leafNode);
    setParentBreadcrumbs(breadcrumbs);
  };

  // GS Finance count from localStorage
  const gsFinanceCount = (() => {
    try {
      return JSON.parse(localStorage.getItem('placement_os_gs_finance') || "[]").length;
    } catch(e) {
      return 0;
    }
  })();

  const totalDsaRoadmapProblems = dsaTopicsData.reduce((sum, t) => sum + t.problems.length, 0);
  const totalStriverProblems = striverTopics.reduce((sum, t) => sum + t.problems.length, 0);
  const totalNeetcodeProblems = 150;
  const totalSystemDesignCheckpoints = 12 * 7 + 8 * 5; // 84 HLD + 40 LLD = 124
  const totalMlResources = mlPhasesData.reduce((sum, p) => sum + p.resources.length, 0);

  const dsaRoadmapPct = totalDsaRoadmapProblems > 0 ? Math.round((dsaRoadmapCount / totalDsaRoadmapProblems) * 100) : 0;
  const striverPct = totalStriverProblems > 0 ? Math.round((striverCount / totalStriverProblems) * 100) : 0;
  const neetcodePct = Math.round((neetcodeCount / totalNeetcodeProblems) * 100);
  const systemDesignPct = Math.round((systemDesignCount / totalSystemDesignCheckpoints) * 100);
  const mlPct = totalMlResources > 0 ? Math.round((mlCount / totalMlResources) * 100) : 0;

  const profile = s.profileData || {};
  const resumeDone = Object.values(profile.resume || {}).filter(Boolean).length;
  const linkedinDone = Object.values(profile.linkedin || {}).filter(v => v === true).length;
  const githubDone = Object.values(profile.github || {}).filter(v => v === true).length;
  const profilePct = Math.round(((resumeDone + linkedinDone + githubDone) / 20) * 100) || 0;

  const projectsCount = s.projects.length;
  const projectsCompleted = s.projects.filter(p => p.progress >= 100 || p.status === 'completed').length;
  const projectsPct = projectsCount > 0 ? Math.round((projectsCompleted / projectsCount) * 100) : 0;

  // GS Outreach stats
  const gsReferrals = (s.referralOutreach || []).filter(r => String(r.companyName).toLowerCase().includes('goldman'));
  const gsReferralsYes = gsReferrals.filter(r => r.response === 'Yes' || r.referred === true).length;
  const gsReferralsPending = gsReferrals.filter(r => r.response === 'Pending').length;

  // Date countdown calculation
  const getGSCountdown = () => {
    if (!s.gsInterviewDate) return 'Set Date';
    const diff = new Date(s.gsInterviewDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (isNaN(days)) return 'Invalid Date';
    if (days < 0) return 'Passed';
    if (days === 0) return 'TODAY';
    return `${days} Days Left`;
  };

  // Target Counts
  const projectsDeployed = s.projects.filter(p => p.progress >= 100 || p.status === 'completed').length;
  const hackathonsSubmitted = s.hackathons.filter(h => h.submission === 'submitted').length;

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

  const handleSaveRetro = () => {
    mutateState(draft => {
      draft.retro = retro;
    });
    addToast('Weekly retrospective saved ✓');
  };

  return (
    <div style={{ animation: 'fade-in 0.4s ease-out' }}>
      {/* GOLDMAN SACHS HERO BANNER */}
      <div className="card gs-hero-banner-main" style={{ 
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(0,0,0,0.3) 100%)', 
        border: '1px solid #D4AF37', 
        borderRadius: 'var(--rs)', 
        padding: '16px 20px', 
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 4px 20px rgba(212, 175, 55, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ fontSize: '32px' }}>🏆</div>
          <div>
            <div style={{ fontWeight: 700, color: '#D4AF37', fontSize: '14px', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Goldman Sachs India Hackathon Finalist 2025
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--t2)', marginTop: '2px', lineHeight: 1.4 }}>
              National Finalist (Top ~1% nationally) • Tata Steel Production Dashboard deployed • Target: DS/ML/SDE Roles by Dec 2026
            </div>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" style={{ borderColor: '#D4AF37', color: '#D4AF37' }} onClick={() => onNavigate('profile')}>
          MD Playbook Leverage →
        </button>
      </div>

      <div className="ph" style={{ marginBottom: '20px' }}>
        <div>
          <div className="ph-eyebrow">Week {ctx.weekNum + 1} · {ctx.dayName}</div>
          <div className="ph-title">Mission Control</div>
          <div className="ph-sub">{activeWeek ? activeWeek.title : 'Placement Execution OS'} {activeWeek ? `· ${activeWeek.dates}` : ''}</div>
        </div>
        {overdueCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="badge b-red" style={{ fontSize: '11px', padding: '8px 14px' }}>
              ⚠ {overdueCount} overdue task{overdueCount > 1 ? 's' : ''}
            </div>
            <button className="btn btn-danger btn-xs" onClick={clearOverdueTasks} style={{ padding: '6px 12px' }}>
              Reset Overdue Tasks
            </button>
          </div>
        )}
      </div>

      {/* CGPA REMINDER NOTE */}
      <div className="card" style={{ background: 'var(--amber-dim)', border: '1px solid rgba(255, 184, 0, 0.25)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ fontSize: '24px' }}>⚡</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: 'var(--amber)', fontSize: '13px', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            KIIT 2026 Candidate CGPA Reframe
          </div>
          <div style={{ fontSize: '12px', color: 'var(--t1)', marginTop: '2px', lineHeight: 1.4 }}>
            Your CGPA is <strong>6.8</strong> — Eligible for TCS, Infosys, HCLTech, Cognizant, Accenture.
            Compensate for higher-tier filters with: <strong>3+ live project deployments</strong> • <strong>3+ hackathon team submissions</strong> • <strong>IBM/Google certifications</strong>.
          </div>
        </div>
      </div>

      {/* GOLDMAN SACHS PREP CARD, APPLICATION COUNTER, & EXECUTION SCORE CONTAINER */}
      <div className="g3" style={{ marginBottom: '20px', gap: '20px' }}>
        {/* Goldman Sachs Prep Card */}
        <div className="card gs-prep-card-gold" style={{ position: 'relative', overflow: 'hidden', border: '1px solid var(--gold-border)', background: 'var(--gold-bg)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="gs-finalist-badge">★ GS FINALIST</span>
                <h3 style={{ margin: '8px 0 4px', color: 'var(--gold-text)', fontSize: '18px' }}>Goldman Sachs Prep</h3>
                <p style={{ fontSize: '11px', color: 'var(--t2)', margin: 0 }}>National AI Hackathon Shortlist</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="countdown-pill">{getGSCountdown()}</div>
                <input 
                  type="date" 
                  value={s.gsInterviewDate || ''} 
                  onChange={(e) => mutateState(draft => { draft.gsInterviewDate = e.target.value; })}
                  style={{ fontSize: '10px', marginTop: '4px', padding: '2px 4px', width: '105px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', color: 'var(--t1)', borderRadius: '4px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '14px', borderTop: '1px solid rgba(255,215,0,0.15)', paddingTop: '10px' }}>
              <div style={{ fontSize: '11px', color: 'var(--t2)' }}>
                <div>🧩 Puzzles: <strong>{gsPuzzlesCount}/30</strong></div>
                <div>💼 Finance: <strong>{gsFinanceCount}/5</strong></div>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--t2)' }}>
                <div>🤝 Outreach: <strong>{gsReferralsYes} Ref / {gsReferralsPending} Pend</strong></div>
                <div>📖 <a href="https://www.goldmansachs.com/careers/students/programs/engineering-blog.html" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-text)', textDecoration: 'underline' }}>GS Eng Blog</a></div>
              </div>
            </div>
          </div>
          <button 
            className="btn btn-gold btn-sm" 
            onClick={() => onNavigate('profile')}
            style={{ width: '100%', marginTop: '10px' }}
          >
            🌟 Open GS Prep Hub
          </button>
        </div>

        {/* Application Daily Counter & Pace Bar */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '14px', margin: 0, fontFamily: 'var(--mono)', textTransform: 'uppercase', color: 'var(--t2)' }}>Application Speedometer</h3>
              <span className={`badge ${appSent >= 100 ? 'b-green' : 'b-amber'}`} style={{ fontSize: '10px' }}>
                {appSent >= 100 ? 'On Track' : 'Behind Pace'}
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '20px', margin: '14px 0' }}>
              <div>
                <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--volt)' }}>{appSent}</span>
                <span style={{ fontSize: '11px', color: 'var(--t3)', block: 'inline', marginLeft: '6px' }}>/ 100 goal</span>
              </div>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--t2)', marginBottom: '8px' }}>
              Pace bar: Dec target is 100 applications. Current pace: {Math.round(appSent/100*100)}%
            </div>
            {renderProgressBar(Math.min(100, appSent), 'var(--volt)')}
          </div>

          <button 
            className="btn btn-primary btn-sm" 
            onClick={() => onNavigate('companies')}
            style={{ width: '100%', marginTop: '10px' }}
          >
            🚀 Apply to More Companies
          </button>
        </div>

        {/* Unified Execution Score Widget */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '14px', margin: 0, fontFamily: 'var(--mono)', textTransform: 'uppercase', color: 'var(--t2)' }}>Execution Score</h3>
              <span className="badge b-electric" style={{ fontSize: '10px' }}>Unified Progress</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--electric)' }}>
                {(() => {
                  const dsaPct = Math.min(100, Math.round((dsaSolved / 196) * 100));
                  const sysDesignPct = Math.round((systemDesignCount / totalSystemDesignCheckpoints) * 100);
                  const appPct = Math.min(100, Math.round((appSent / 100) * 100));
                  const certPct = certTotal ? Math.round((certDone / certTotal) * 100) : 0;
                  
                  let tDone = 0, tTotal = 0;
                  Object.values(s.weekTasks || {}).forEach(arr => {
                    arr.forEach(v => {
                      tTotal++;
                      if (v) tDone++;
                    });
                  });
                  const taskPct = tTotal > 0 ? Math.round((tDone / tTotal) * 100) : 0;

                  return Math.round(
                    (dsaPct * 0.25) +
                    (sysDesignPct * 0.20) +
                    (appPct * 0.20) +
                    (certPct * 0.15) +
                    (taskPct * 0.20)
                  );
                })()}%
              </span>
              <span style={{ fontSize: '11px', color: 'var(--t3)' }}>Goal: 100% Placed</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--t2)' }}>
                  <span>DSA (Unified Solve Count)</span>
                  <span>{Math.min(100, Math.round((dsaSolved / 196) * 100))}%</span>
                </div>
                {renderProgressBar(Math.min(100, Math.round((dsaSolved / 196) * 100)), 'var(--electric)')}
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--t2)' }}>
                  <span>System Design</span>
                  <span>{systemDesignPct}%</span>
                </div>
                {renderProgressBar(systemDesignPct, 'var(--amber)')}
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--t2)' }}>
                  <span>Applications</span>
                  <span>{Math.min(100, Math.round((appSent / 100) * 100))}%</span>
                </div>
                {renderProgressBar(Math.min(100, Math.round((appSent / 100) * 100)), 'var(--volt)')}
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--t2)' }}>
                  <span>Profile Audit</span>
                  <span>{profilePct}%</span>
                </div>
                {renderProgressBar(profilePct, 'var(--violet)')}
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--t2)' }}>
                  <span>Projects</span>
                  <span>{projectsPct}%</span>
                </div>
                {renderProgressBar(projectsPct, 'var(--rose)')}
              </div>
            </div>
          </div>
        </div>
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

      {/* CURRICULUM MODULES PROGRESS */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', fontWeight: 700, color: 'var(--t3)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>
          Curriculum Cockpit
        </div>
        <div className="g5">
          <div className="metric" onClick={() => onNavigate('dsa')} style={{ cursor: 'pointer' }}>
            <div className="metric-icon">⟨⟩</div>
            <div className="metric-val" style={{ color: 'var(--electric)' }}>{dsaRoadmapPct}%</div>
            <div className="metric-lbl">DSA Roadmap</div>
            <div className="metric-sub">{dsaRoadmapCount} of {totalDsaRoadmapProblems} solved</div>
            <div className="metric-glow" style={{ background: 'var(--electric)' }}></div>
            {renderProgressBar(dsaRoadmapPct, 'var(--electric)')}
          </div>
          <div className="metric" onClick={() => onNavigate('dsa')} style={{ cursor: 'pointer' }}>
            <div className="metric-icon">🏆</div>
            <div className="metric-val" style={{ color: 'var(--violet)' }}>{striverPct}%</div>
            <div className="metric-lbl">Striver Sheet</div>
            <div className="metric-sub">{striverCount} of {totalStriverProblems} solved</div>
            <div className="metric-glow" style={{ background: 'var(--violet)' }}></div>
            {renderProgressBar(striverPct, 'var(--violet)')}
          </div>
          <div className="metric" onClick={() => onNavigate('dsa')} style={{ cursor: 'pointer' }}>
            <div className="metric-icon">🚀</div>
            <div className="metric-val" style={{ color: 'var(--volt)' }}>{neetcodePct}%</div>
            <div className="metric-lbl">NeetCode 150</div>
            <div className="metric-sub">{neetcodeCount} of {totalNeetcodeProblems} solved</div>
            <div className="metric-glow" style={{ background: 'var(--volt)' }}></div>
            {renderProgressBar(neetcodePct, 'var(--volt)')}
          </div>
          <div className="metric" onClick={() => onNavigate('systemDesign')} style={{ cursor: 'pointer' }}>
            <div className="metric-icon">🏗️</div>
            <div className="metric-val" style={{ color: 'var(--amber)' }}>{systemDesignPct}%</div>
            <div className="metric-lbl">Sys Design</div>
            <div className="metric-sub">{systemDesignCount} of {totalSystemDesignCheckpoints} completed</div>
            <div className="metric-glow" style={{ background: 'var(--amber)' }}></div>
            {renderProgressBar(systemDesignPct, 'var(--amber)')}
          </div>
          <div className="metric" onClick={() => onNavigate('ml')} style={{ cursor: 'pointer' }}>
            <div className="metric-icon">🧠</div>
            <div className="metric-val" style={{ color: 'var(--rose)' }}>{mlPct}%</div>
            <div className="metric-lbl">ML Roadmap</div>
            <div className="metric-sub">{mlCount} of {totalMlResources} completed</div>
            <div className="metric-glow" style={{ background: 'var(--rose)' }}></div>
            {renderProgressBar(mlPct, 'var(--rose)')}
          </div>
        </div>
      </div>

      {/* DSA PATTERNS MINDMAP */}
      <div className="card" style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--electric)' }}>DSA Pattern Mindmap Explorer</h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--t2)' }}>
              Track patterns and solved/total ratios horizontally. Click leaf nodes to practice.
            </p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('dsa')}>Full Sheet →</button>
        </div>

        <DsaMindmap 
          dsaPatternsData={dsaPatternsData}
          isProblemSolved={isProblemSolved}
          togglePatternProblem={togglePatternProblem}
          onLeafClick={handleLeafClick}
        />
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
          {/* PLACEMENT SUCCESS TARGETS */}
          <div className="card" style={{ marginBottom: '16px', borderLeft: '4px solid var(--violet)' }}>
            <div className="card-hdr">
              <div>
                <div className="card-title" style={{ color: 'var(--violet)' }}>Success Target Counters</div>
                <div className="card-label" style={{ fontSize: '14px', marginTop: '2px' }}>KIIT 2026 Benchmarks</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--t2)' }}>Applications Sent</span>
                  <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--electric)' }}>{appSent} / 500</span>
                </div>
                {renderProgressBar(appSent / 500 * 100, 'var(--electric)')}
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--t2)' }}>DSA Problems Solved</span>
                  <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--amber)' }}>{striverCount} / 250</span>
                </div>
                {renderProgressBar(striverCount / 250 * 100, 'var(--amber)')}
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--t2)' }}>Projects Deployed</span>
                  <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--volt)' }}>{projectsDeployed} / 5</span>
                </div>
                {renderProgressBar(projectsDeployed / 5 * 100, 'var(--volt)')}
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--t2)' }}>Hackathons Submitted</span>
                  <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--rose)' }}>{hackathonsSubmitted} / 3</span>
                </div>
                {renderProgressBar(hackathonsSubmitted / 3 * 100, 'var(--rose)')}
              </div>
            </div>
          </div>

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

      {/* WEEKLY RETROSPECTIVE */}
      <div className="card" style={{ marginTop: '20px', borderTop: '2px solid var(--border)' }}>
        <div className="card-hdr" style={{ marginBottom: '14px' }}>
          <div>
            <div className="card-title">Continuous Improvement</div>
            <div className="card-label" style={{ fontSize: '16px' }}>Weekly Retrospective</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleSaveRetro}>Save Retro ✓</button>
        </div>
        <div className="fr" style={{ gap: '16px', marginBottom: '14px' }}>
          <div className="fg">
            <label>Applications Sent This Week</label>
            <input
              type="number"
              value={retro.appsThisWeek || ''}
              onChange={(e) => setRetro(prev => ({ ...prev, appsThisWeek: e.target.value }))}
              placeholder="e.g. 24"
            />
          </div>
          <div className="fg">
            <label>DSA Problems Solved This Week</label>
            <input
              type="number"
              value={retro.dsaThisWeek || ''}
              onChange={(e) => setRetro(prev => ({ ...prev, dsaThisWeek: e.target.value }))}
              placeholder="e.g. 15"
            />
          </div>
        </div>
        <div className="fr" style={{ gap: '16px' }}>
          <div className="fg">
            <label>What Went Well?</label>
            <textarea
              rows="3"
              value={retro.wentWell || ''}
              onChange={(e) => setRetro(prev => ({ ...prev, wentWell: e.target.value }))}
              placeholder="Notes on what strategies worked..."
            />
          </div>
          <div className="fg">
            <label>What to Improve Next Week?</label>
            <textarea
              rows="3"
              value={retro.toImprove || ''}
              onChange={(e) => setRetro(prev => ({ ...prev, toImprove: e.target.value }))}
              placeholder="Action items for next week..."
            />
          </div>
        </div>
      </div>

      {/* Drawer Overlay for Detail Drawer in Dashboard */}
      {selectedLeafPattern && (
        <div 
          style={{
            position: 'fixed',
            top: 0, right: 0, bottom: 0,
            width: '100%', maxWidth: '450px',
            background: 'var(--bg1)',
            borderLeft: '1px solid var(--border)',
            boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
            zIndex: 1000,
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            animation: 'slide-in 0.3s ease-out'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--t3)', textTransform: 'uppercase' }}>
                {parentBreadcrumbs.join(' > ')}
              </div>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '18px', color: 'var(--electric)' }}>
                {selectedLeafPattern.name}
              </h3>
            </div>
            <button 
              className="btn btn-ghost" 
              onClick={() => setSelectedLeafPattern(null)}
              style={{ fontSize: '20px', padding: '4px 8px', minWidth: 'auto', height: 'auto', lineHeight: 1 }}
            >
              ×
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', textTransform: 'uppercase', color: 'var(--t2)', fontFamily: 'var(--mono)' }}>
                Representative Problems
              </h4>
              {(!selectedLeafPattern.problems || selectedLeafPattern.problems.length === 0) ? (
                <div className="note-box" style={{ fontSize: '12px' }}>
                  No predefined problems logged for this sub-pattern yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedLeafPattern.problems.map(prob => {
                    const solved = isProblemSolved(prob);
                    return (
                      <div 
                        key={prob.id || prob.title}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          background: 'var(--bg2)',
                          padding: '10px 14px',
                          borderRadius: 'var(--rs)',
                          border: '1px solid var(--border)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, marginRight: '10px' }}>
                          <input 
                            type="checkbox" 
                            checked={solved} 
                            onChange={() => togglePatternProblem(prob)}
                            style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                          />
                          <span style={{ fontSize: '13px', color: solved ? 'var(--t3)' : 'var(--t1)', textDecoration: solved ? 'line-through' : 'none' }}>
                            {prob.title}
                          </span>
                        </div>
                        {prob.link && (
                          <a 
                            href={prob.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="btn btn-ghost btn-xs"
                            style={{ textDecoration: 'none', padding: '4px 8px' }}
                          >
                            Solve ↗
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <button 
            className="btn btn-primary" 
            onClick={() => setSelectedLeafPattern(null)}
            style={{ width: '100%' }}
          >
            Close Drawer
          </button>
        </div>
      )}
    </div>
  );
}
