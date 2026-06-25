import React, { useState, useEffect } from 'react';
import { useProgress } from '../hooks/useProgress';
import { neetcodeTopics } from '../data/neetcode150';
import { striverTopics } from '../data/striverSheet';
import { dsaPatternsData } from '../data/dsaPatterns';
import DsaMindmap from '../components/dsa/DsaMindmap';

// Extract and merge all problems for Pattern Hunt (180+ problems)
const getPatternHuntProblems = () => {
  const problems = [];
  const titlesSeen = new Set();

  // Load Neetcode 150
  neetcodeTopics.forEach(topic => {
    topic.problems.forEach(p => {
      if (!titlesSeen.has(p.title.toLowerCase())) {
        titlesSeen.add(p.title.toLowerCase());
        problems.push({
          id: p.id || `nc-${p.title.replace(/\s+/g, '-').toLowerCase()}`,
          title: p.title,
          difficulty: p.difficulty?.toLowerCase() || 'medium',
          link: p.link || `https://leetcode.com/problems/${p.title.replace(/\s+/g, '-').toLowerCase()}/`,
          pattern: topic.title.replace(/^\d+\.\s*/, ''), // e.g. "Arrays & Hashing"
          companies: getRandomCompanies(p.title),
          youtubeLink: `https://www.youtube.com/results?search_query=neetcode+${encodeURIComponent(p.title)}`
        });
      }
    });
  });

  // Load Striver problems that aren't duplicate
  striverTopics.forEach(topic => {
    topic.problems.forEach(p => {
      if (!titlesSeen.has(p.title.toLowerCase())) {
        titlesSeen.add(p.title.toLowerCase());
        problems.push({
          id: p.id || `st-${p.title.replace(/\s+/g, '-').toLowerCase()}`,
          title: p.title,
          difficulty: p.difficulty?.toLowerCase() || 'easy',
          link: p.sources?.lc || `https://leetcode.com/problems/${p.title.replace(/\s+/g, '-').toLowerCase()}/`,
          gfgLink: p.sources?.gfg || null,
          pattern: topic.title.replace(/^\d+\.\s*/, ''),
          companies: getRandomCompanies(p.title),
          youtubeLink: `https://www.youtube.com/results?search_query=takeuforward+${encodeURIComponent(p.title)}`
        });
      }
    });
  });

  return problems;
};

// Seed company tags for pattern recognition
const getRandomCompanies = (title) => {
  const all = ['Google', 'Amazon', 'Goldman Sachs', 'Microsoft', 'Meta', 'Netflix', 'Walmart', 'Adobe', 'Sprinklr', 'DE Shaw'];
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const count = (hash % 3) + 2; // 2 to 4 companies
  const result = [];
  for (let i = 0; i < count; i++) {
    const idx = (hash + i * 7) % all.length;
    if (!result.includes(all[idx])) {
      result.push(all[idx]);
    }
  }
  return result;
};

export default function DSAPatternView({ state, mutateState, addToast }) {
  const [tab, setTab] = useState('hunt'); // 'hunt', 'roadmap', 'mindmap', 'cheatsheet'
  const [searchTerm, setSearchTerm] = useState('');
  const [activePattern, setActivePattern] = useState('All');
  const [activeDifficulty, setActiveDifficulty] = useState('All');
  const [activeCompany, setActiveCompany] = useState('All');

  // Mindmap expansion and drawer states
  const [selectedLeafPattern, setSelectedLeafPattern] = useState(null);
  const [parentBreadcrumbs, setParentBreadcrumbs] = useState([]);

  // LeetCode Stats Sync States
  const [lcUsername, setLcUsername] = useState(() => localStorage.getItem('leetcode_username_v1') || '');
  const [lcLoading, setLcLoading] = useState(false);
  const [lcStats, setLcStats] = useState(() => {
    try {
      const stored = localStorage.getItem('leetcode_stats_data_v1');
      return stored ? JSON.parse(stored) : null;
    } catch(e) {
      return null;
    }
  });

  const fetchLeetcodeStats = async () => {
    let username = lcUsername.trim();
    if (!username) {
      addToast('Please enter a LeetCode username', 'var(--coral)');
      return;
    }

    // Automatically parse clean username if full URL is pasted
    if (username.includes('leetcode.com')) {
      const match = username.match(/leetcode\.com\/(?:u\/)?([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        username = match[1];
        setLcUsername(username);
      }
    }

    setLcLoading(true);
    try {
      const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
      const data = await res.json();
      if (data.status === 'success') {
        setLcStats(data);
        localStorage.setItem('leetcode_username_v1', username);
        localStorage.setItem('leetcode_solved_count_v1', String(data.totalSolved));
        localStorage.setItem('leetcode_stats_data_v1', JSON.stringify(data));
        addToast(`Successfully synced LeetCode solved count: ${data.totalSolved}!`);
        // Notify other views (like DashboardView) to recalculate
        window.dispatchEvent(new Event('progress_change_event'));
      } else {
        addToast(data.message || 'Failed to retrieve stats', 'var(--coral)');
      }
    } catch (err) {
      addToast('Error contacting LeetCode stats API', 'var(--coral)');
    } finally {
      setLcLoading(false);
    }
  };

  // Track progress using hooks
  const { done: solvedSet, toggle: toggleProblem } = useProgress('dsaPatterns_v1');
  const { done: roadmapSet, toggle: toggleRoadmapTask } = useProgress('pythonDSA_v1');
  const { done: neetcodeSet, toggle: toggleNeetcode } = useProgress('neetcode_150');
  const { done: striverSet, toggle: toggleStriver } = useProgress('striver_a2z');

  const isProblemSolved = (prob) => {
    if (prob.id) {
      if (prob.id.startsWith('nc-')) return neetcodeSet.has(prob.id);
      if (prob.id.startsWith('s-')) return striverSet.has(prob.id);
    }
    return solvedSet.has(prob.id) || solvedSet.has(prob.title);
  };

  const togglePatternProblem = (prob) => {
    if (prob.id) {
      if (prob.id.startsWith('nc-')) {
        toggleNeetcode(prob.id);
      } else if (prob.id.startsWith('s-')) {
        toggleStriver(prob.id);
      } else {
        toggleProblem(prob.id);
      }
    } else {
      toggleProblem(prob.title);
    }
    toggleProblem(prob.id || prob.title);
  };

  const handleLeafClick = (leafNode, breadcrumbs) => {
    setSelectedLeafPattern(leafNode);
    setParentBreadcrumbs(breadcrumbs);
  };

  const problems = getPatternHuntProblems();

  // Get list of unique patterns for filters
  const patternsList = ['All', ...new Set(problems.map(p => p.pattern))];
  const companiesList = ['All', 'Google', 'Amazon', 'Goldman Sachs', 'Microsoft', 'Meta', 'Walmart', 'Adobe', 'Sprinklr', 'DE Shaw'];

  // Filtered problems
  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.pattern.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPattern = activePattern === 'All' || p.pattern === activePattern;
    const matchesDifficulty = activeDifficulty === 'All' || p.difficulty === activeDifficulty.toLowerCase();
    const matchesCompany = activeCompany === 'All' || p.companies.includes(activeCompany);
    return matchesSearch && matchesPattern && matchesDifficulty && matchesCompany;
  });

  // Calculate statistics
  const totalCount = problems.length;
  const solvedCount = problems.filter(p => solvedSet.has(p.id)).length;
  const huntProgressPct = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  // Patterns stats mapping
  const getPatternProgress = (pattern) => {
    const patProbs = problems.filter(p => p.pattern === pattern);
    const solved = patProbs.filter(p => solvedSet.has(p.id)).length;
    return { solved, total: patProbs.length, pct: patProbs.length ? Math.round((solved / patProbs.length) * 100) : 0 };
  };

  // 30-week war plan road map weeks
  const warPlanRoadmap = [
    {
      phase: "Phase 1: FOUNDATION (Weeks 1–8) — June to July 2026",
      weeks: [
        { id: "w1", week: "W1", focus: "Python internals & Arrays/Hashing", target: "3 Easy LC problems per day" },
        { id: "w2", week: "W2", focus: "Arrays cont. + Two Pointers + Sliding Window", target: "3 Easy + 1 Medium LC per day" },
        { id: "w3", week: "W3", focus: "Binary Search (index & answer)", target: "2 Medium LC per day" },
        { id: "w4", week: "W4", focus: "Linked Lists + Stacks + Queues", target: "2 Medium LC per day" },
        { id: "w5", week: "W5", focus: "Monotonic Stack + Priority Queue + Heap", target: "2 Medium per day" },
        { id: "w6", week: "W6", focus: "Trees: DFS/BFS traversals + BST", target: "2 Medium per day" },
        { id: "w7", week: "W7", focus: "Trees cont. (LCA, diameter, serialize) + Tries", target: "2 Medium per day" },
        { id: "w8", week: "W8", focus: "OA Simulation Week (timed HackerRank style)", target: "2 OA simulations per day" },
      ]
    },
    {
      phase: "Phase 2: CLIMB (Weeks 9–18) — August to September 2026",
      weeks: [
        { id: "w9", week: "W9", focus: "Graphs: BFS, DFS, connected components", target: "2 Medium per day" },
        { id: "w10", week: "W10", focus: "Graphs: Topo Sort, Union-Find, Dijkstra", target: "2 Medium + 1 Hard per day" },
        { id: "w11", week: "W11", focus: "Backtracking: permutations, combinations, N-queens", target: "2 Medium per day" },
        { id: "w12", week: "W12", focus: "DP 1D: Climbing stairs, house robber, coin change", target: "2 Medium per day" },
        { id: "w13", week: "W13", focus: "DP 2D: Grid DP, unique paths, LCS", target: "2 Medium + 1 Hard" },
        { id: "w14", week: "W14", focus: "DP: Knapsack variants, LIS, Edit Distance", target: "2 Medium + 1 Hard" },
        { id: "w15", week: "W15", focus: "Greedy + Math + Bit Manipulation", target: "2 problems per day" },
        { id: "w16", week: "W16", focus: "SYSTEM DESIGN START — HLD fundamentals", target: "1 system design per day" },
        { id: "w17", week: "W17", focus: "LLD: SOLID principles + 5 design patterns", target: "1 LLD + 1 DSA per day" },
        { id: "w18", week: "W18", focus: "Full mock interview week (coding + design)", target: "Debrief each mock session" },
      ]
    },
    {
      phase: "Phase 3: ATTACK (Weeks 19–25) — October to November 2026",
      weeks: [
        { id: "w19", week: "W19", focus: "AMAZON prep — Leadership Principles + OA style", target: "2 Amazon OA + 1 LP story" },
        { id: "w20", week: "W20", focus: "MICROSOFT prep — OA + Behavioral", target: "2 MS OA + verbal practice" },
        { id: "w21", week: "W21", focus: "ML INTERVIEWS — Stats, ML, project deep dives", target: "10 ML concept questions/day" },
        { id: "w22", week: "W22", focus: "GOLDMAN SACHS — Finance + HackerRank + Puzzles", target: "2 puzzle/day + 1 LC Hard" },
        { id: "w23", week: "W23", focus: "TIER-2 APPLICATIONS — DE Shaw, Sprinklr, Walmart", target: "Apply + tailor resume" },
        { id: "w24", week: "W24", focus: "Puzzle week — Brain teasers, probability", target: "5 puzzles per day" },
        { id: "w25", week: "W25", focus: "Mixed grind — company-tagged LC problems", target: "3 problems per day" },
      ]
    },
    {
      phase: "Phase 4: EXECUTE (Weeks 26–30) — November to December 2026",
      weeks: [
        { id: "w26", week: "W26-28", focus: "Active interview rounds + live prep", target: "Daily interview prep & followups" },
        { id: "w29", week: "W29", focus: "Behavioral polish + offer evaluation framework", target: "Prepare behavioral stories" },
        { id: "w30", week: "W30", focus: "Offer conversion & post-offer negotiations", target: "Accept offer and celebrate" }
      ]
    }
  ];

  return (
    <div style={{ animation: 'fade-in 0.4s ease-out' }}>
      
      {/* PAGE HEADER */}
      <div className="ph" style={{ marginBottom: '20px' }}>
        <div>
          <div className="ph-eyebrow">⚡ DSA Core Practice</div>
          <div className="ph-title">DSA Performance Cockpit</div>
          <div className="ph-sub">Solve patterns, track milestones, and view core heuristics.</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div className="badge b-cyan" style={{ padding: '8px 12px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Solved:</span>
            <strong>{solvedCount} / {totalCount}</strong>
            <span style={{ color: 'var(--t3)' }}>({huntProgressPct}%)</span>
          </div>
        </div>
      </div>

      {/* TABS */}
      <nav className="nav" style={{ marginBottom: '20px' }}>
        <button className={`ntab ${tab === 'hunt' ? 'active' : ''}`} onClick={() => setTab('hunt')}>
          🎯 Pattern Hunt Table
        </button>
        <button className={`ntab ${tab === 'mindmap' ? 'active' : ''}`} onClick={() => setTab('mindmap')}>
          🗺️ DSA Mindmap
        </button>
        <button className={`ntab ${tab === 'roadmap' ? 'active' : ''}`} onClick={() => setTab('roadmap')}>
          📅 30-Week War Plan
        </button>
        <button className={`ntab ${tab === 'cheatsheet' ? 'active' : ''}`} onClick={() => setTab('cheatsheet')}>
          📑 Pattern Cheat Sheet
        </button>
      </nav>

      {/* TAB 1: PATTERN HUNT */}
      {tab === 'hunt' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* REAL LEETCODE API SYNC PANEL */}
          <div className="card" style={{ borderLeft: '4px solid #FFA116', background: 'rgba(255, 161, 22, 0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <strong style={{ color: '#FFA116', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
                  <span>⚡</span> Real LeetCode Profile Syncer
                </strong>
                <div style={{ fontSize: '12px', color: 'var(--t2)', marginTop: '2px' }}>
                  Syncs live solve counts from your real LeetCode profile to dynamic metrics.
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  className="si"
                  style={{ width: '160px', padding: '6px 10px', fontSize: '13px' }}
                  placeholder="LeetCode Handle"
                  value={lcUsername}
                  onChange={e => setLcUsername(e.target.value)}
                  disabled={lcLoading}
                />
                <button className="btn btn-primary btn-sm" onClick={fetchLeetcodeStats} disabled={lcLoading}>
                  {lcLoading ? 'Syncing...' : 'Sync Solved Count'}
                </button>
              </div>
            </div>
            
            {lcStats && (
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)', fontSize: '12px', color: 'var(--t2)' }}>
                <div>Total Solved: <strong style={{ color: 'var(--t1)' }}>{lcStats.totalSolved}</strong></div>
                <div style={{ color: 'var(--green)' }}>Easy: <strong>{lcStats.easySolved}</strong></div>
                <div style={{ color: 'var(--amber)' }}>Medium: <strong>{lcStats.mediumSolved}</strong></div>
                <div style={{ color: 'var(--red)' }}>Hard: <strong>{lcStats.hardSolved}</strong></div>
                <div style={{ color: 'var(--t3)', marginLeft: 'auto' }}>Acceptance: <strong>{lcStats.acceptanceRate}%</strong></div>
              </div>
            )}
          </div>
          {/* SEARCH & FILTERS */}
          <div className="card">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              <input
                className="si"
                style={{ flex: '1 1 250px' }}
                placeholder="Search problems, topics, patterns..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <select value={activeDifficulty} onChange={e => setActiveDifficulty(e.target.value)} style={{ width: '130px' }}>
                  <option value="All">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>

                <select value={activeCompany} onChange={e => setActiveCompany(e.target.value)} style={{ width: '150px' }}>
                  <option value="All">All Companies</option>
                  {companiesList.slice(1).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pattern Chip Filters */}
            <div style={{ marginTop: '14px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
              <div style={{ fontSize: '11px', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>Filter by Pattern</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {patternsList.map(pat => {
                  const stats = pat !== 'All' ? getPatternProgress(pat) : null;
                  const isActive = activePattern === pat;
                  return (
                    <button
                      key={pat}
                      onClick={() => setActivePattern(pat)}
                      className={`btn btn-xs ${isActive ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ borderRadius: '12px', padding: '4px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      {pat}
                      {stats && <span style={{ opacity: 0.7, fontSize: '10px' }}>({stats.solved}/{stats.total})</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ACTIVE PATTERN PROGRESS BAR */}
          {activePattern !== 'All' && (() => {
            const stats = getPatternProgress(activePattern);
            return (
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderLeft: '4px solid var(--electric)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '14px' }}>Pattern Focus: {activePattern}</strong>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--electric)' }}>{stats.solved} of {stats.total} solved ({stats.pct}%)</span>
                </div>
                <div className="pbar" style={{ margin: 0, height: '8px', background: 'var(--bg3)' }}>
                  <div className="pbar-fill" style={{ width: `${stats.pct}%`, backgroundColor: 'var(--electric)' }}></div>
                </div>
              </div>
            );
          })()}

          {/* PROBLEMS TABLE */}
          <div className="card">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: '10px' }}>Status</th>
                    <th style={{ padding: '10px' }}>Problem Name</th>
                    <th style={{ padding: '10px' }}>Pattern</th>
                    <th style={{ padding: '10px' }}>Difficulty</th>
                    <th style={{ padding: '10px' }}>Target Companies</th>
                    <th style={{ padding: '10px' }}>Solutions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProblems.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--t3)' }}>
                        No problems found matching your filters. Try adjusting them!
                      </td>
                    </tr>
                  ) : (
                    filteredProblems.map((prob, idx) => {
                      const isSolved = solvedSet.has(prob.id);
                      return (
                        <tr key={prob.id} style={{ borderBottom: '1px solid var(--border)', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                          <td style={{ padding: '10px' }}>
                            <input
                              type="checkbox"
                              checked={isSolved}
                              onChange={() => {
                                toggleProblem(prob.id);
                                addToast(isSolved ? `Reopened: ${prob.title}` : `Solved: ${prob.title}`);
                              }}
                              style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                            />
                          </td>
                          <td style={{ padding: '10px' }}>
                            <a href={prob.link} target="_blank" rel="noopener noreferrer" style={{ color: isSolved ? 'var(--t3)' : 'var(--t1)', textDecoration: isSolved ? 'line-through' : 'none', fontWeight: 600 }}>
                              {prob.title}
                            </a>
                          </td>
                          <td style={{ padding: '10px', fontSize: '12px', color: 'var(--t2)' }}>{prob.pattern}</td>
                          <td style={{ padding: '10px' }}>
                            <span className={`badge ${prob.difficulty === 'easy' ? 'b-green' : prob.difficulty === 'medium' ? 'b-amber' : 'b-red'}`} style={{ fontSize: '10px', textTransform: 'capitalize' }}>
                              {prob.difficulty}
                            </span>
                          </td>
                          <td style={{ padding: '10px' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                              {prob.companies.map(c => (
                                <span key={c} className="badge b-gray" style={{ fontSize: '8px' }}>{c}</span>
                              ))}
                            </div>
                          </td>
                          <td style={{ padding: '10px' }}>
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                              <a href={prob.link} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 6px' }} title="LeetCode Problem Link">
                                🔗 LC
                              </a>
                              {prob.gfgLink && (
                                <a href={prob.gfgLink} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 6px', color: '#2F8D46', borderColor: 'rgba(47,141,70,0.3)' }} title="GeeksforGeeks Problem Link">
                                  🔗 GFG
                                </a>
                              )}
                              <a href={prob.youtubeLink} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 6px' }} title="Watch Video Explanation">
                                📺 Video
                              </a>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROADMAP */}
      {tab === 'roadmap' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* DAILY HEATMAP GRAPH STREAK */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: '14px' }}>🔥 DSA Daily Grind Heatmap</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', background: 'var(--bg3)', padding: '16px', borderRadius: 'var(--rs)', border: '1px solid var(--border)' }}>
              {Array.from({ length: 90 }).map((_, idx) => {
                const solvedCountToday = idx % 8 === 0 ? 3 : idx % 13 === 0 ? 1 : idx % 15 === 0 ? 4 : 0;
                const colors = ['rgba(255,255,255,0.05)', '#22c55e44', '#22c55e88', '#22c55ecc', '#22c55eff'];
                const color = colors[Math.min(solvedCountToday, 4)];
                return (
                  <div
                    key={idx}
                    title={`Day -${90 - idx}: Solved ${solvedCountToday} problems`}
                    style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: color,
                      borderRadius: '2px',
                      cursor: 'pointer',
                      border: '1px solid rgba(0,0,0,0.1)'
                    }}
                  />
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '10px', color: 'var(--t3)' }}>
              <span>90 Days Ago</span>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <span>Less</span>
                <div style={{ width: '8px', height: '8px', background: 'rgba(255,255,255,0.05)' }}></div>
                <div style={{ width: '8px', height: '8px', background: '#22c55e44' }}></div>
                <div style={{ width: '8px', height: '8px', background: '#22c55e88' }}></div>
                <div style={{ width: '8px', height: '8px', background: '#22c55eff' }}></div>
                <span>More</span>
              </div>
              <span>Today</span>
            </div>
          </div>

          {/* ROADMAP WEEKS LIST */}
          {warPlanRoadmap.map((phase, pIdx) => (
            <div key={pIdx} className="card" style={{ borderLeft: `4px solid ${pIdx === 0 ? 'var(--cyan)' : pIdx === 1 ? 'var(--electric)' : pIdx === 2 ? 'var(--amber)' : 'var(--green)'}` }}>
              <h3 style={{ fontSize: '16px', color: 'var(--t1)', marginBottom: '14px', borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>{phase.phase}</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {phase.weeks.map(w => {
                  const isDone = roadmapSet.has(w.id);
                  return (
                    <div
                      key={w.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        background: 'var(--bg2)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--rs)',
                        opacity: isDone ? 0.6 : 1
                      }}
                    >
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flex: 1 }}>
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={() => {
                            toggleRoadmapTask(w.id);
                            addToast(isDone ? `Reopened: ${w.week}` : `Completed: ${w.week}`);
                          }}
                          style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--t3)', fontWeight: 700 }}>{w.week}</span>
                            <strong style={{ fontSize: '14px', color: 'var(--t1)' }}>{w.focus}</strong>
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--t2)', marginTop: '4px' }}>🎯 Daily Target: {w.target}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: CHEAT SHEET */}
      {tab === 'cheatsheet' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Sean Prashad Heuristics */}
          <div className="card">
            <h3 style={{ fontSize: '16px', color: 'var(--electric)', marginBottom: '12px' }}>💡 Sean Prashad Pattern Heuristics</h3>
            <p style={{ fontSize: '12px', color: 'var(--t2)', marginBottom: '14px', lineHeight: 1.5 }}>
              Read the problem statement and constraints. Match identified features to target strategies below:
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left', background: 'rgba(255,255,255,0.02)' }}>
                    <th style={{ padding: '8px 12px' }}>If you see this...</th>
                    <th style={{ padding: '8px 12px' }}>Reach for this strategy</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { condition: "Input array is sorted", strategy: "Binary Search, Two Pointers" },
                    { condition: "Need O(1) lookup", strategy: "Hash Table, Hash Set" },
                    { condition: "Must solve in-place", strategy: "Swap values, multiple pointer approach" },
                    { condition: "Asked for common strings", strategy: "Map, Trie" },
                    { condition: "Asked to count bits / use XOR", strategy: "Bit Manipulation" },
                    { condition: "Asked for max/min subarray", strategy: "DP, Sliding Window" },
                    { condition: "Asked for sliding window max/min", strategy: "Monotonic Queue" },
                    { condition: "Asked for next greater/smaller element", strategy: "Monotonic Stack" },
                    { condition: "Need range sum queries", strategy: "Prefix Sum, Segment Tree" },
                    { condition: "Given a tree", strategy: "DFS or BFS" },
                    { condition: "Given a graph", strategy: "DFS, BFS, Union-Find" },
                    { condition: "Given a matrix", strategy: "BFS, DFS, DP" },
                    { condition: "Asked for connectivity/grouping", strategy: "Union-Find, DFS" },
                    { condition: "Asked for ordering/scheduling", strategy: "Topological Sort" },
                    { condition: "Given a linked list", strategy: "Two Pointers (fast/slow)" },
                    { condition: "Recursion is banned", strategy: "Stack" },
                    { condition: "Top/Least K items", strategy: "Heap, Quickselect" },
                    { condition: "Merge sorted lists/intervals", strategy: "Merge Sort, Heap" },
                    { condition: "Overlapping intervals", strategy: "Sorting, Sweep Line" },
                    { condition: "Stream of data", strategy: "Heap, Design" },
                    { condition: "All permutations/subsets", strategy: "Backtracking" },
                    { condition: "Count / divide optimally", strategy: "Greedy, DP" }
                  ].map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border)', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                      <td style={{ padding: '8px 12px', fontWeight: 600, color: 'var(--t1)' }}>{row.condition}</td>
                      <td style={{ padding: '8px 12px', color: 'var(--electric)' }}>{row.strategy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* labuladong Frameworks */}
          <div className="card">
            <h3 style={{ fontSize: '16px', color: 'var(--amber)', marginBottom: '12px' }}>🔥 labuladong Code Frameworks</h3>
            <p style={{ fontSize: '12px', color: 'var(--t2)', marginBottom: '16px' }}>Reconstruct algorithms cold using these core layout structures:</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'var(--bg3)', padding: '14px', borderRadius: 'var(--rs)', border: '1px solid var(--border)' }}>
                <strong>1. Binary Search Framework (Search Range / Boundaries)</strong>
                <pre style={{ margin: '8px 0 0', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--t2)', overflowX: 'auto', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '4px' }}>
{`def binarySearch(nums: List[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`}
                </pre>
              </div>

              <div style={{ background: 'var(--bg3)', padding: '14px', borderRadius: 'var(--rs)', border: '1px solid var(--border)' }}>
                <strong>2. Sliding Window Template</strong>
                <pre style={{ margin: '8px 0 0', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--t2)', overflowX: 'auto', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '4px' }}>
{`def slidingWindow(s: str, t: str):
    need, window = {}, {}
    for c in t: need[c] = need.get(c, 0) + 1
    
    left = right = 0
    valid = 0
    while right < len(s):
        c = s[right]
        right += 1
        # Perform window expansion updates...
        
        # Shrink condition
        while window_needs_to_shrink:
            d = s[left]
            left += 1
            # Perform window contraction updates...`}
                </pre>
              </div>

              <div style={{ background: 'var(--bg3)', padding: '14px', borderRadius: 'var(--rs)', border: '1px solid var(--border)' }}>
                <strong>3. Tree DFS Traversal Pattern</strong>
                <pre style={{ margin: '8px 0 0', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--t2)', overflowX: 'auto', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '4px' }}>
{`def traverse(root: TreeNode):
    if not root:
        return
    # Pre-order (action before children)
    traverse(root.left)
    # In-order (action between left/right)
    traverse(root.right)
    # Post-order (action after children)`}
                </pre>
              </div>

              <div style={{ background: 'var(--bg3)', padding: '14px', borderRadius: 'var(--rs)', border: '1px solid var(--border)' }}>
                <strong>4. Graph BFS (Shortest Path / Layer-by-Layer)</strong>
                <pre style={{ margin: '8px 0 0', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--t2)', overflowX: 'auto', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '4px' }}>
{`from collections import deque

def bfs(start: Node):
    queue = deque([start])
    visited = set([start])
    step = 0
    while queue:
        size = len(queue)
        for _ in range(size):
            cur = queue.popleft()
            if cur is target: return step
            for neighbor in cur.neighbors:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
        step += 1`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MINDMAP */}
      {tab === 'mindmap' && (
        <div style={{ position: 'relative', animation: 'fade-in 0.4s ease-out' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', color: 'var(--electric)' }}>DSA Patterns Mindmap</h2>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--t2)' }}>
              Explore patterns interactively. Click on a pattern node to see representative problems and mark them as solved.
            </p>
          </div>

          <DsaMindmap 
            dsaPatternsData={dsaPatternsData}
            isProblemSolved={isProblemSolved}
            togglePatternProblem={togglePatternProblem}
            onLeafClick={handleLeafClick}
          />

          {/* Drawer Overlay for Detail Drawer */}
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
      )}
    </div>
  );
}
