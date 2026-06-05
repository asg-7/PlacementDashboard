import React, { useState, useEffect } from 'react';
import { SEED } from './data/seed';

// Views
import DashboardView from './views/DashboardView';
import CompaniesView from './views/CompaniesView';
import ApplicationsView from './views/ApplicationsView';
import HackathonsView from './views/HackathonsView';
import CertificationsView from './views/CertificationsView';
import DsaView from './views/DsaView';
import ProjectsView from './views/ProjectsView';
import YoutubeView from './views/YoutubeView';
import RoadmapView from './views/RoadmapView';
import AnalyticsView from './views/AnalyticsView';
import MLRoadmap from './views/MLRoadmap';
import DailyTasksView from './views/DailyTasksView';

const STORAGE_KEY = 'placementOS.v2';

// ------------------------------------------------------------------
//  STATE HELPERS (equivalent to legacy Store methods)
// ------------------------------------------------------------------
const getTodayISO = () => new Date().toISOString().slice(0, 10);

const getWeekNumber = (s) => {
  const start = new Date('2026-06-02');
  const today = new Date(getTodayISO());
  const diff = Math.floor((today - start) / (7 * 24 * 3600 * 1000));
  return Math.max(0, diff);
};

const getActiveWeek = (s) => {
  const today = getTodayISO();
  const todayDate = new Date(today);
  const weeks = s.roadmapWeeks || [];
  const current = weeks.find(w => {
    if (!w.dates) return false;
    const isoMatch = w.dates.match(/(\d{4}-\d{2}-\d{2})\s*[–—-]+\s*(\d{4}-\d{2}-\d{2})/);
    if (isoMatch) {
      try {
        const start = new Date(isoMatch[1]);
        const end = new Date(isoMatch[2]);
        return todayDate >= start && todayDate <= end;
      } catch(e) { return false; }
    }
    const match = w.dates.match(/(\w+ \d+)[^–—-]*[–—-]\s*(\w+ \d+,?\s*\d{4})/);
    if (!match) return false;
    try {
      const year = match[2].match(/\d{4}/)?.[0] || '2026';
      const start = new Date(match[1] + ' ' + year);
      const end = new Date(match[2]);
      return todayDate >= start && todayDate <= end;
    } catch (e) { return false; }
  });
  if (current) return current;
  return weeks.find(w => {
    const tasks = w.tasks || [];
    const wt = s.weekTasks || {};
    const done = wt[w.id] || new Array(tasks.length).fill(false);
    return !done.every(Boolean);
  }) || weeks[0];
};

const getOpenNowCompanies = (s) => {
  const todayDate = new Date(getTodayISO());
  const month = todayDate.getMonth();
  return (s.companies || []).filter(c => {
    if (c.status !== 'not applied') return false;
    const w = (c.window || '').toLowerCase();
    if (w.includes('rolling') || w.includes('now')) return true;
    const months = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
    for (const [abbr, num] of Object.entries(months)) {
      if (w.includes(abbr) && num === month) return true;
    }
    return false;
  });
};

const getTodayStudyPlan = (weekNum) => {
  const studyPlan = [
    { topic: 'Python OOP + Pandas basics', resources: ['Corey Schafer OOP', 'Keith Galli Pandas'], action: 'Practice groupby, merge, pivot on a dataset' },
    { topic: 'SQL window functions (RANK, LAG, LEAD)', resources: ['techTFQ SQL playlist', 'HackerRank SQL'], action: 'Solve 3 HackerRank SQL problems + earn gold badge' },
    { topic: 'Scikit-learn Pipelines + Feature Engineering', resources: ['NeuralNine Scikit-learn', 'Krish Naik Feature Engineering'], action: 'Build a full pipeline on Titanic or housing dataset' },
    { topic: 'Random Forest + SHAP interpretability', resources: ['StatQuest SHAP', 'StatQuest Random Forest'], action: 'Add SHAP plots + feature importance to Tata Steel model' },
    { topic: 'Statistics: hypothesis testing, p-values, A/B tests', resources: ['StatQuest statistics', 'Khan Academy stats'], action: 'Do 5 hypothesis testing exercises in a notebook' },
    { topic: 'Streamlit deployment + PDP plots', resources: ['Data Professor Streamlit'], action: 'Deploy Salary Predictor app publicly with live URL' },
    { topic: 'DSA: Arrays + Hashing (LeetCode)', resources: ['NeetCode 150 playlist'], action: 'Solve 2 easy LeetCode array problems; publish Kaggle EDA notebook' },
    { topic: 'DSA: Linked Lists + Stacks; Time Series (ARIMA + Prophet)', resources: ['NeetCode 150', 'Krish Naik Time Series'], action: 'Solve 2 LeetCode problems + ARIMA notebook on stock data' },
    { topic: 'DSA: Binary Search + Python OOP design patterns', resources: ['NeetCode 150', 'Corey Schafer OOP'], action: 'Solve 3 binary search problems + build ML experiment tracker class' },
    { topic: 'DSA: Trees (BFS/DFS) + Ensemble methods (XGBoost/LightGBM)', resources: ['NeetCode 150', 'StatQuest ensembles'], action: 'Tree traversal LeetCode + Voting Classifier vs RF notebook' },
    { topic: 'Deep Learning: CNN + Transfer Learning (Fast.ai)', resources: ['Fast.ai Lesson 1-2', 'DL Specialization Week 2'], action: 'Train a CNN on MNIST + HuggingFace sentiment pipeline' },
    { topic: 'LangChain RAG: build a Q&A chatbot over your PDFs', resources: ['Sam Witteveen LangChain', 'DeepLearning.AI short course'], action: 'RAG demo over project PDF using FAISS vector store' },
    { topic: 'DS Interview Prep: STAR stories + SQL query optimisation', resources: ['Ken Jee DS Interview', 'techTFQ query optimisation'], action: 'Write 6 STAR stories; practice SQL EXPLAIN plans' },
    { topic: 'XGBoost/LightGBM tuning + TCS NQT prep (aptitude + reasoning)', resources: ['Krish Naik XGBoost/LightGBM', 'TCS NQT mock tests'], action: 'Kaggle XGBoost submission + TCS NQT timed mock' },
    { topic: 'Hyperparameter tuning with Optuna + Flipkart GRiD strategy', resources: ['Krish Naik XGBoost', 'Featuretools demo'], action: 'Kaggle notebook with Optuna + register GRiD team' },
    { topic: 'AWS Cloud Practitioner exam prep + ML System Design', resources: ['Exponent ML System Design', 'AWS prep modules'], action: 'AWS mock exam + record one timed SQL+Python mock interview' },
    { topic: 'MLflow experiment tracking + AWS Cloud Practitioner exam', resources: ['Krish Naik MLflow', 'AWS exam guide'], action: 'Add MLflow to Tata Steel project + attempt AWS exam' },
    { topic: 'Docker for ML: containerise Streamlit app', resources: ['Nicholas Renotte Docker'], action: 'Dockerize Streamlit app + push to DockerHub; submit GRiD main round' },
    { topic: 'DS Interview Simulation: mock marathon + SQL advanced', resources: ['Ken Jee DS Interview final', 'StatQuest A/B testing'], action: '2 full mock interviews + SQL advanced (CTEs, window functions)' },
    { topic: 'RAG chatbot v2 + LeetCode medium sprint (30 total)', resources: ['Sam Witteveen LangChain advanced', 'LLM Zoomcamp Module 3'], action: 'Build RAG chatbot over project PDFs; LeetCode mediums sprint' },
    { topic: 'Transformers/Attention intuition + Power BI dashboard v2', resources: ['3Blue1Brown Attention', 'Guy in a Cube Power BI'], action: 'Top 50 ML Q&A document + Power BI dashboard v2 published' },
    { topic: 'Portfolio consolidation: GitHub README + portfolio video', resources: ['Complete TensorFlow Developer', 'IBM ML final modules'], action: 'Record 10-minute portfolio walkthrough video (Loom)' },
    { topic: 'Company-specific interview prep + capstone EDA', resources: ['Krish Naik NLP', 'Complete IBM ML Professional'], action: 'Glassdoor research + capstone data collection + EDA notebook' },
    { topic: 'Capstone: modelling + MLflow + SHAP + A/B testing', resources: ['Exponent ML System Design', 'LLM Zoomcamp final module'], action: 'Capstone model trained + cross-validation + MLflow tracking' },
    { topic: 'Capstone deployment + full interview simulation', resources: ['Complete MLOps Zoomcamp'], action: 'Deploy capstone publicly + 2-hour full DS interview simulation' },
    { topic: 'Salary negotiation tactics + CTC breakdown research', resources: ['Ken Jee final DS interview review'], action: 'Negotiate CTC (anchor at 6+ LPA); send thank-you emails post-interview' },
    { topic: 'December drive applications + final DSA sprint (40 Mediums)', resources: ['Any pending Coursera cert final push'], action: 'Apply Dec cohort + LeetCode medium sprint + negotiate if offer' },
    { topic: 'Final round prep: ML system design + walk-in drives', resources: ['Exponent ML System Design final review'], action: 'Company-specific final prep + walk-in drive identification' },
    { topic: 'Offer evaluation + negotiation + LinkedIn update', resources: ['Archive final READMEs'], action: 'Accept best offer ≥6 LPA after negotiation + update LinkedIn' },
    { topic: 'Pre-joining research + 90-day plan + network thank-you', resources: ['Complete pending certs'], action: 'Write 90-day pre-joining action plan + thank your network' },
  ];
  const idx = Math.min(Math.max(0, weekNum), studyPlan.length - 1);
  return studyPlan[idx];
};

const getTodayContext = (s) => {
  const today = getTodayISO();
  const todayDate = new Date(today);
  const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][todayDate.getDay()];
  const weekNum = getWeekNumber(s);
  const activeWeek = getActiveWeek(s);
  const wt = s.weekTasks || {};
  const weekTasks = activeWeek ? (activeWeek.tasks || []) : [];
  const weekDone = activeWeek ? (wt[activeWeek.id] || new Array(weekTasks.length).fill(false)) : [];
  const todayTasks = weekTasks.map((t, i) => ({ text: t, done: weekDone[i] || false, idx: i, weekId: activeWeek?.id }));
  
  const overdueTasks = [];
  (s.roadmapWeeks || []).forEach(w => {
    if (w.id === activeWeek?.id) return;
    const isoMatch = w.dates && w.dates.match(/(\d{4}-\d{2}-\d{2})\s*[–—-]+\s*(\d{4}-\d{2}-\d{2})/);
    const isLikelyPast = isoMatch ? (() => { try { return new Date(isoMatch[2]) < todayDate; } catch(e) { return false; } })() : false;
    if (!isLikelyPast) return;
    const tasks = w.tasks || [];
    const done = wt[w.id] || new Array(tasks.length).fill(false);
    tasks.forEach((t, i) => { if (!done[i]) overdueTasks.push({ text: t, week: w.title, weekId: w.id, idx: i }); });
  });

  const urgentDeadlines = [];
  const in14 = new Date(todayDate.getTime() + 14 * 24 * 3600 * 1000);
  (s.hackathons || []).forEach(h => {
    if (!h.deadline) return;
    const d = new Date(h.deadline);
    if (d >= todayDate && d <= in14) urgentDeadlines.push({ label: h.name, date: h.deadline, type: 'hackathon', urgent: (d - todayDate) < 3 * 24 * 3600 * 1000 });
  });
  (s.certifications || []).forEach(c => {
    if (!c.deadline || c.progress >= 100) return;
    const d = new Date(c.deadline);
    if (d >= todayDate && d <= in14) urgentDeadlines.push({ label: c.name, date: c.deadline, type: 'cert', urgent: (d - todayDate) < 3 * 24 * 3600 * 1000 });
  });
  urgentDeadlines.sort((a, b) => a.date.localeCompare(b.date));
  
  const openNow = getOpenNowCompanies(s);
  const studyPlan = getTodayStudyPlan(weekNum);
  
  return { today, dayName, weekNum, activeWeek, todayTasks, overdueTasks, urgentDeadlines, openNow, studyPlan };
};

// ------------------------------------------------------------------
//  MAIN APP
// ------------------------------------------------------------------
export default function App() {
  const [view, setView] = useState('dashboard');
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Merge with seed just in case keys are missing
        const merged = Object.assign({}, JSON.parse(JSON.stringify(SEED)), parsed);
        if (!merged.weekTasks) merged.weekTasks = {};
        if (!merged.activity) merged.activity = {};
        if (!merged.internships) merged.internships = JSON.parse(JSON.stringify(SEED.internships || []));
        if (!merged.retro) merged.retro = JSON.parse(JSON.stringify(SEED.retro || {}));
        
        // Automatic migration: update to the user's actual projects if "ResumeIQ" is not in the projects list or old placeholder projects are found
        const hasResumeIQ = merged.projects && merged.projects.some(p => p.githubLink && p.githubLink.includes('resumeiq'));
        const hasOldPlaceholder = merged.projects && merged.projects.some(p => p.name.includes('LangChain RAG Chatbot') || p.name.includes('Time Series Forecasting') || p.name.includes('Tata Steel ML Work') || p.name.includes('Salary Predictor – Streamlit App') || p.name.includes('Salary Predictor - Streamlit App'));
        if (!hasResumeIQ || hasOldPlaceholder) {
          merged.projects = JSON.parse(JSON.stringify(SEED.projects));
        }
        
        // Automatic migration: connect HackerRank and Unstop profiles
        if (merged.syncAccounts) {
          if (!merged.syncAccounts.hackerrank || merged.syncAccounts.hackerrank.handle !== 'anubhav_sengupt1') {
            merged.syncAccounts.hackerrank = { handle: 'anubhav_sengupt1', status: 'Connected', lastSynced: '2026-06-05 09:30' };
          }
          if (!merged.syncAccounts.unstop || merged.syncAccounts.unstop.handle !== 'anubhsen98694') {
            merged.syncAccounts.unstop = { handle: 'anubhsen98694', status: 'Connected', lastSynced: '2026-06-05 09:30' };
          }
        }

        // Automatic migration: update hackathons with links and Goldman Sachs AI Hackathon
        if (merged.hackathons) {
          const hasGoldman = merged.hackathons.some(h => h.id === 'h_gs');
          if (!hasGoldman) {
            merged.hackathons.unshift({ 
              id: 'h_gs', 
              name: 'Goldman Sachs AI Hackathon', 
              platform: 'Unstop', 
              deadline: '2026-06-05', 
              priority: 'high',   
              reg: 'registered', 
              submission: 'submitted', 
              result: 'shortlisted', 
              hiringChallenge: true,  
              teamSize: '1-3', 
              outcome: 'Shortlisted for Interview', 
              notes: 'Shortlisted! Technical interview is ongoing right now.', 
              link: 'https://unstop.com' 
            });
          }
          merged.hackathons.forEach(h => {
            const seedH = SEED.hackathons.find(x => x.id === h.id);
            if (seedH && seedH.link && !h.link) {
              h.link = seedH.link;
            }
          });
        }

        // Automatic migration: update certifications with links
        if (merged.certifications) {
          merged.certifications.forEach(c => {
            const seedC = SEED.certifications.find(x => x.id === c.id);
            if (seedC && seedC.link && !c.link) {
              c.link = seedC.link;
            }
          });
        }

        // Automatic migration: add Goldman Sachs to companies list
        if (merged.companies) {
          const hasGoldmanComp = merged.companies.some(c => c.id === 'c_gs');
          if (!hasGoldmanComp) {
            merged.companies.push({ 
              id: 'c_gs', 
              companyName: 'Goldman Sachs', 
              role: 'AI / Software Engineering Intern', 
              ctc: 'Rs.20-25 LPA (equivalent)', 
              window: 'June 2026',        
              status: 'interview', 
              cgpaCriteria: 6.0, 
              hiringChallenge: true,  
              notes: 'Interviewing via Goldman Sachs AI Hackathon shortlist.' 
            });
          }
        }
        
        return merged;
      }
    } catch (e) {
      console.error('Failed to load initial localStorage state', e);
    }
    return JSON.parse(JSON.stringify(SEED));
  });

  const [toast, setToast] = useState(null); // null or { message, color }
  const [clock, setClock] = useState({ time: '', dateStr: '' });

  // Sync to localstorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Live Clock Effect
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      const s = now.getSeconds().toString().padStart(2, '0');
      
      setClock({
        time: `${h}:${m}:${s}`,
        dateStr: `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`
      });
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const addToast = (message, color = 'var(--electric)') => {
    setToast({ message, color });
  };

  // Auto-hide toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // Force App reactivity when localStorage progress updates
  const [, setProgressTick] = useState(0);
  useEffect(() => {
    const handleProgressChange = () => setProgressTick(tick => tick + 1);
    window.addEventListener('progress_change_event', handleProgressChange);
    return () => window.removeEventListener('progress_change_event', handleProgressChange);
  }, []);

  const mutateState = (fn) => {
    setState(prev => {
      const clone = JSON.parse(JSON.stringify(prev));
      fn(clone);
      return clone;
    });
  };

  const todayContext = getTodayContext(state);

  const VIEWS = [
    { id: 'dashboard',     label: 'Dashboard',    icon: '⬡' },
    { id: 'daily',         label: 'Daily Tasks',  icon: '📆' },
    { id: 'companies',     label: 'Companies',    icon: '◈' },
    { id: 'applications',  label: 'Applications', icon: '◇' },
    { id: 'hackathons',    label: 'Hackathons',   icon: '◆' },
    { id: 'certifications',label: 'Certs',        icon: '◉' },
    { id: 'dsa',           label: 'DSA',          icon: '⟨⟩' },
    { id: 'ml',            label: 'ML Roadmap',   icon: '🧠' },
    { id: 'projects',      label: 'Projects',     icon: '▣' },
    { id: 'youtube',       label: 'YouTube',      icon: '📺' },
    { id: 'roadmap',       label: 'Roadmap',      icon: '▷' },
    { id: 'analytics',     label: 'Analytics',    icon: '◎' },
  ];

  // Calculate overall Execution Score
  const appSent = state.companies.filter(c => c.status !== 'not applied').length;
  const certDone = state.certifications.filter(c => c.progress >= 100).length;
  const dsaSolved = (state.dsaProblems || []).filter(d => d.status === 'solved').length;
  let tasksDone = 0, totalTasks = 0;
  Object.values(state.weekTasks || {}).forEach(arr => {
    arr.forEach(v => {
      totalTasks++;
      if (v) tasksDone++;
    });
  });
  const execScore = Math.round(
    ((state.companies.length ? (appSent / state.companies.length) : 0) * 25) +
    ((state.certifications.length ? (certDone / state.certifications.length) : 0) * 25) +
    (Math.min(dsaSolved, 100) / 100 * 25) +
    (totalTasks > 0 ? (tasksDone / totalTasks * 25) : 0)
  );

  // Backup handlers
  const handleExportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `placement-os-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    addToast('Data exported ✓');
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        // Basic validation
        if (data.companies && data.roadmapWeeks) {
          setState(data);
          addToast('Data imported ✓');
        } else {
          addToast('Import failed – invalid schema', 'var(--coral)');
        }
      } catch (err) {
        addToast('Import failed – invalid JSON', 'var(--coral)');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetData = () => {
    if (!window.confirm('Reset all data to seed? This cannot be undone.')) return;
    setState(JSON.parse(JSON.stringify(SEED)));
    addToast('Data reset to defaults');
  };

  const handleResetProjectsOnly = () => {
    mutateState(draft => {
      draft.projects = JSON.parse(JSON.stringify(SEED.projects));
    });
    addToast('Projects synced with GitHub portfolio ✓');
  };

  // Render correct subview
  const renderViewContent = () => {
    switch (view) {
      case 'dashboard':
        return (
          <DashboardView
            state={state}
            mutateState={mutateState}
            onNavigate={setView}
            todayContext={todayContext}
            addToast={addToast}
          />
        );
      case 'daily':
        return (
          <DailyTasksView
            state={state}
            mutateState={mutateState}
            addToast={addToast}
          />
        );
      case 'companies':
        return (
          <CompaniesView
            state={state}
            mutateState={mutateState}
            addToast={addToast}
          />
        );
      case 'applications':
        return (
          <ApplicationsView
            state={state}
            mutateState={mutateState}
            addToast={addToast}
          />
        );
      case 'hackathons':
        return (
          <HackathonsView
            state={state}
            mutateState={mutateState}
            addToast={addToast}
          />
        );
      case 'certifications':
        return (
          <CertificationsView
            state={state}
            mutateState={mutateState}
            addToast={addToast}
          />
        );
      case 'dsa':
        return (
          <DsaView
            state={state}
            mutateState={mutateState}
            addToast={addToast}
          />
        );
      case 'ml':
        return (
          <MLRoadmap />
        );
      case 'projects':
        return (
          <ProjectsView
            state={state}
            mutateState={mutateState}
            addToast={addToast}
            resetProjectsOnly={handleResetProjectsOnly}
          />
        );
      case 'youtube':
        return (
          <YoutubeView
            state={state}
            mutateState={mutateState}
            addToast={addToast}
          />
        );
      case 'roadmap':
        return (
          <RoadmapView
            state={state}
            mutateState={mutateState}
            todayContext={todayContext}
            addToast={addToast}
          />
        );
      case 'analytics':
        return (
          <AnalyticsView
            state={state}
          />
        );
      default:
        return <div>View not found</div>;
    }
  };

  return (
    <div className="shell">
      {/* HEADER */}
      <header className="hdr">
        <div className="brand">
          <div className="brand-mark">P.OS</div>
          <div>
            <div className="brand-name">Placement OS</div>
            <div className="brand-sub">Execution cockpit</div>
          </div>
        </div>

        <div className="hdr-center">
          <div id="live-clock">
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--t1)', letterSpacing: '2px' }}>{clock.time}</span>
            <span style={{ fontSize: '9px', color: 'var(--t3)', letterSpacing: '.5px' }}>{clock.dateStr}</span>
          </div>
        </div>

        <div className="hdr-actions">
          <span id="score-badge" style={{ marginRight: '8px' }}>Exec Score: {execScore}%</span>
          <button className="btn btn-ghost btn-xs" onClick={handleExportData}>Export</button>
          <label className="btn btn-ghost btn-xs" style={{ cursor: 'pointer', margin: 0, display: 'inline-flex', alignItems: 'center' }}>
            Import
            <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleImportData} />
          </label>
          <button className="btn btn-danger btn-xs" onClick={handleResetData}>Reset</button>
        </div>
      </header>

      {/* NAVIGATION BAR */}
      <nav className="nav">
        {VIEWS.map(v => (
          <button
            className={`ntab ${view === v.id ? 'active' : ''}`}
            onClick={() => setView(v.id)}
            key={v.id}
          >
            <span style={{ marginRight: '6px' }}>{v.icon}</span>
            {v.label}
          </button>
        ))}
      </nav>

      {/* MAIN CONTAINER */}
      <main className="main">
        {renderViewContent()}
      </main>

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="toast" style={{ borderLeftColor: toast.color }}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
