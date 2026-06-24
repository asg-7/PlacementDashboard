import React, { useState, useEffect, useRef } from 'react';
import { useProgress } from '../hooks/useProgress';
import { dsaTopicsData } from '../data/dsaTopics';
import { striverTopics } from '../data/striverSheet';
import { neetcodeTopics } from '../data/neetcode150';
import { DSA_TOPICS } from '../data/seed';

// Reusable Components
import TopicCard from '../components/dsa/TopicCard';
import ProblemRow from '../components/dsa/ProblemRow';
import SourceBadge from '../components/dsa/SourceBadge';
import DifficultyBar from '../components/dsa/DifficultyBar';

export default function DsaView({ state, mutateState, addToast }) {
  // Tab State
  const [tab, setTab] = useState('roadmap'); // 'roadmap', 'striver', 'neetcode', 'mock', 'aptitude', 'kits'

  // Source Filter Chips State
  const [activeSources, setActiveSources] = useState(new Set(['leetcode', 'neetcode', 'striver', 'geeksforgeeks', 'hackerrank']));

  // Nested Views Navigation State
  const [selectedTopicId, setSelectedTopicId] = useState(null); // String ID for active topic
  const [striverTopicView, setStriverTopicView] = useState(false); // boolean flag to toggle Striver topic view vs Custom Roadmap topic view
  const [selectedProblem, setSelectedProblem] = useState(null); // problem object or null for single problem page

  // Progress Hooks
  const { done: dsaRoadmapProgress, toggle: toggleRoadmapProblem } = useProgress('dsa_roadmap');
  const { done: striverProgress, toggle: toggleStriverProblem } = useProgress('striver_a2z');
  const { done: neetcodeProgress, toggle: toggleNeetcodeProblem } = useProgress('neetcode_150');

  // Mock Interview States
  const [mockRunning, setMockRunning] = useState(false);
  const [mockTimeRemaining, setMockTimeRemaining] = useState(1800); // 30 minutes in seconds
  const [mockTopic, setMockTopic] = useState('Arrays');
  const [mockProb, setMockProb] = useState(null);
  const mockTimerRef = useRef(null);

  // Aptitude States
  const [aptitudeRunning, setAptitudeRunning] = useState(false);
  const [aptitudeTimeRemaining, setAptitudeTimeRemaining] = useState(1800); // 30 minutes
  const aptitudeTimerRef = useRef(null);

  // Existing Profile Sync Simulation States
  const [syncPanelOpen, setSyncPanelOpen] = useState(false);
  const [syncingPlatform, setSyncingPlatform] = useState(null);
  const [syncLogs, setSyncLogs] = useState([]);
  const [syncFinished, setSyncFinished] = useState(false);
  const syncConsoleRef = useRef(null);

  // Modals for the existing Company Kits table
  const [viewingSolution, setViewingSolution] = useState(null);
  const [editingProblem, setEditingProblem] = useState(null);

  // Search & Filters for Company Kits (Existing Tracker)
  const [search, setSearch] = useState('');
  const [diffFilter, setDiffFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');

  const s = state;
  const probs = s.dsaProblems || [];

  // Filter chips handler
  const toggleSourceFilter = (source) => {
    setActiveSources(prev => {
      const next = new Set(prev);
      if (next.has(source)) {
        if (next.size > 1) { // keep at least one source selected
          next.delete(source);
        }
      } else {
        next.add(source);
      }
      return next;
    });
  };

  // Helper to check if a problem matches the active source filters
  const matchesSourceFilter = (problem) => {
    // If problem specifies sources (Roadmap or Striver sheet)
    if (problem.sources) {
      if (Array.isArray(problem.sources)) {
        return problem.sources.some(src => activeSources.has(src.toLowerCase()));
      }
      if (typeof problem.sources === 'object') {
        return Object.keys(problem.sources).some(src => problem.sources[src] !== null && activeSources.has(src.toLowerCase()));
      }
    }
    // If it only has platform (Existing tracker)
    const plat = (problem.platform || 'LeetCode').toLowerCase();
    if (plat === 'geeksforgeeks' || plat === 'gfg') return activeSources.has('geeksforgeeks');
    if (plat === 'neetcode' || plat === 'nc') return activeSources.has('neetcode');
    if (plat === 'hackerrank' || plat === 'hr') return activeSources.has('hackerrank');
    if (plat === 'striver' || plat === 'tuf') return activeSources.has('striver');
    return activeSources.has('leetcode') || activeSources.has(plat);
  };

  // Company Kits (Existing Table) Filter logic
  let filteredKits = probs.filter(matchesSourceFilter);
  if (search) {
    filteredKits = filteredKits.filter(p =>
      p.problem.toLowerCase().includes(search.toLowerCase()) ||
      (p.topic || '').toLowerCase().includes(search.toLowerCase())
    );
  }
  if (diffFilter !== 'all') {
    filteredKits = filteredKits.filter(p => p.difficulty === diffFilter);
  }
  if (platformFilter !== 'all') {
    filteredKits = filteredKits.filter(p => (p.platform || '').toLowerCase() === platformFilter.toLowerCase());
  }
  if (topicFilter !== 'all') {
    filteredKits = filteredKits.filter(p => p.topic === topicFilter);
  }
  if (companyFilter !== 'all') {
    filteredKits = filteredKits.filter(p => 
      (p.company || '').toLowerCase() === companyFilter.toLowerCase() ||
      (p.problem || '').toLowerCase().includes(companyFilter.toLowerCase()) ||
      (p.notes || '').toLowerCase().includes(companyFilter.toLowerCase())
    );
  }

  const easy = probs.filter(p => p.difficulty === 'easy').length;
  const medium = probs.filter(p => p.difficulty === 'medium').length;
  const hard = probs.filter(p => p.difficulty === 'hard').length;
  const solved = probs.filter(p => p.status === 'solved').length;
  const topics = [...new Set(probs.map(p => p.topic).filter(Boolean))];

  const platformColors = {
    leetcode: '#FFA116',
    codeforces: '#FF5555',
    neetcode: '#00E5FF',
    hackerrank: '#2EC866',
    geeksforgeeks: '#2F8D46',
    unstop: '#00E5FF',
    other: '#8899BB'
  };

  const platformClasses = {
    leetcode: 'b-amber',
    codeforces: 'b-red',
    neetcode: 'b-cyan',
    hackerrank: 'b-green',
    geeksforgeeks: 'b-purple',
    unstop: 'b-cyan',
    other: 'b-gray'
  };

  // Profile sync accounts update
  const handleUpdateHandle = (key, value) => {
    mutateState(draft => {
      if (!draft.syncAccounts) draft.syncAccounts = {};
      if (!draft.syncAccounts[key]) {
        draft.syncAccounts[key] = { handle: '', status: 'Disconnected', lastSynced: '' };
      }
      draft.syncAccounts[key].handle = value;
    });
  };

  const triggerSync = (key) => {
    const acc = s.syncAccounts?.[key] || { handle: '', status: 'Disconnected', lastSynced: '' };
    const handle = acc.handle ? acc.handle.trim() : '';
    if (!handle) {
      addToast('Please enter a valid handle/username', 'var(--coral)');
      return;
    }

    const nameMap = {
      leetcode: 'LeetCode',
      codeforces: 'Codeforces',
      neetcode: 'NeetCode',
      hackerrank: 'HackerRank',
      geeksforgeeks: 'GeeksforGeeks',
      unstop: 'Unstop'
    };
    const platformName = nameMap[key];

    setSyncingPlatform({ key, name: platformName, handle });
    setSyncLogs([`[System] Initializing sync adapter for ${platformName}...`]);
    setSyncFinished(false);
  };

  // Profile Sync Simulation effect
  useEffect(() => {
    if (!syncingPlatform) return;

    const { key, name, handle } = syncingPlatform;
    const addLog = (text) => setSyncLogs(prev => [...prev, text]);

    const timeouts = [];

    // Step 1: Connect
    timeouts.push(setTimeout(() => addLog(`[Info] Connecting to ${name} scraper server...`), 300));
    timeouts.push(setTimeout(() => addLog(`[Info] Sending HTTP GET to user endpoint for "${handle}"...`), 900));
    timeouts.push(setTimeout(() => addLog(`[Info] Server response code: 200 OK`), 1500));

    // Step 2: Stats
    let easyCount = Math.floor(Math.random() * 20) + 10;
    let medCount = Math.floor(Math.random() * 15) + 5;
    let hardCount = Math.floor(Math.random() * 5);
    timeouts.push(setTimeout(() => {
      addLog(`[Data] Scraped profiles successfully:`);
      addLog(`       - Solved Easy: ${easyCount}`);
      addLog(`       - Solved Medium: ${medCount}`);
      addLog(`       - Solved Hard: ${hardCount}`);
    }, 2100));

    // Step 3: Database updates
    timeouts.push(setTimeout(() => addLog(`[Sync] Updating local database state and syncing matched problems...`), 2800));

    timeouts.push(setTimeout(() => {
      mutateState(draft => {
        if (!draft.syncAccounts) draft.syncAccounts = {};
        const now = new Date();
        const timeStr = now.getFullYear() + '-' +
          String(now.getMonth() + 1).padStart(2, '0') + '-' +
          String(now.getDate()).padStart(2, '0') + ' ' +
          String(now.getHours()).padStart(2, '0') + ':' +
          String(now.getMinutes()).padStart(2, '0');

        draft.syncAccounts[key] = {
          handle: handle,
          status: 'Connected',
          lastSynced: timeStr
        };

        if (draft.dsaProblems) {
          draft.dsaProblems.forEach(p => {
            if ((p.platform || '').toLowerCase() === key) {
              if (p.status !== 'solved') {
                p.status = 'solved';
                p.date = now.toISOString().slice(0, 10);
              }
            }
          });
        }

        const importedProblems = {
          leetcode: [
            { problem: 'Valid Parentheses', difficulty: 'easy', topic: 'Stacks & Queues', link: 'https://leetcode.com/problems/valid-parentheses/' },
            { problem: 'Binary Tree Inorder Traversal', difficulty: 'easy', topic: 'Trees', link: 'https://leetcode.com/problems/binary-tree-inorder-traversal/' },
            { problem: 'Reverse Linked List', difficulty: 'easy', topic: 'Linked Lists', link: 'https://leetcode.com/problems/reverse-linked-list/' }
          ],
          codeforces: [
            { problem: 'Way Too Long Words', difficulty: 'easy', topic: 'Strings', link: 'https://codeforces.com/problemset/problem/71/A' },
            { problem: 'Theatre Square', difficulty: 'medium', topic: 'Math', link: 'https://codeforces.com/problemset/problem/1/A' }
          ],
          neetcode: [
            { problem: 'Valid Anagram', difficulty: 'easy', topic: 'Hashing', link: 'https://neetcode.io/problems/valid-anagram' },
            { problem: 'Group Anagrams', difficulty: 'medium', topic: 'Hashing', link: 'https://neetcode.io/problems/group-anagrams' }
          ],
          hackerrank: [
            { problem: 'Compare the Triplets', difficulty: 'easy', topic: 'Arrays', link: 'https://www.hackerrank.com/challenges/compare-the-triplets/problem' },
            { problem: 'SQL Query Projects', difficulty: 'medium', topic: 'SQL', link: 'https://www.hackerrank.com/challenges/projects/problem' }
          ],
          geeksforgeeks: [
            { problem: 'Sort an array of 0s, 1s and 2s', difficulty: 'medium', topic: 'Sorting', link: 'https://www.geeksforgeeks.org/problems/sort-an-array-of-0s-1s-and-2s4231/1' },
            { problem: 'Subarray with given sum', difficulty: 'medium', topic: 'Arrays', link: 'https://www.geeksforgeeks.org/problems/subarray-with-given-sum-1587115621/1' }
          ]
        };

        const candidates = importedProblems[key] || [];
        candidates.forEach(cand => {
          const exists = draft.dsaProblems.some(p => p.problem.toLowerCase() === cand.problem.toLowerCase());
          if (!exists) {
            draft.dsaProblems.unshift({
              id: '_' + Math.random().toString(36).substr(2, 9),
              problem: cand.problem,
              difficulty: cand.difficulty,
              topic: cand.topic,
              platform: name,
              status: 'solved',
              date: now.toISOString().slice(0, 10),
              link: cand.link,
              solution: '// Imported via Profile Sync\n// Solution verified successfully on ' + name,
              notes: 'Problem automatically imported and synced from profile: ' + handle
            });
          }
        });

        if (!draft.activity) draft.activity = {};
        draft.activity[now.toISOString().slice(0, 10)] = (draft.activity[now.toISOString().slice(0, 10)] || 0) + 2;
      });

      addLog(`[Success] Sync finalized!`);
      addLog(`          - Updated local matched problems`);
      addLog(`          - Added new verified solved problems`);
      addLog(`[System] Connection closed safely.`);
      setSyncFinished(true);
      addToast(`Synced ${name} account successfully!`);
    }, 3500));

    return () => timeouts.forEach(clearTimeout);
  }, [syncingPlatform]);

  useEffect(() => {
    if (syncConsoleRef.current) {
      syncConsoleRef.current.scrollTop = syncConsoleRef.current.scrollHeight;
    }
  }, [syncLogs]);

  const handleDelete = (id) => {
    if (!window.confirm('Delete this problem?')) return;
    mutateState(draft => {
      draft.dsaProblems = (draft.dsaProblems || []).filter(x => x.id !== id);
    });
    addToast('Problem removed', 'var(--coral)');
  };

  const handleSaveProblem = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.problemName.value.trim();
    if (!name) {
      addToast('Problem name required', 'var(--coral)');
      return;
    }

    const platform = form.platform.value;
    const difficulty = form.difficulty.value;
    const topic = form.topic.value;
    const status = form.status.value;
    const link = form.link.value.trim();
    const date = form.date.value;
    const solution = form.solution.value;
    const notes = form.notes.value.trim();
    const company = form.company.value;

    mutateState(draft => {
      if (!draft.dsaProblems) draft.dsaProblems = [];
      const obj = { problem: name, platform, difficulty, topic, status, date, link, solution, notes, company };

      if (editingProblem.id) {
        const p = draft.dsaProblems.find(x => x.id === editingProblem.id);
        if (p) Object.assign(p, obj);
      } else {
        const newId = '_' + Math.random().toString(36).substr(2, 9);
        draft.dsaProblems.unshift({ id: newId, ...obj });
      }
    });

    setEditingProblem(null);
    addToast('Problem saved ✓');
  };

  // Helper calculation for lock logic
  const isStriverTopicLocked = (index) => {
    if (index === 0) return false;
    const prevTopic = striverTopics[index - 1];
    const prevSolved = prevTopic.problems.filter(p => striverProgress.has(p.id)).length;
    const prevPct = prevTopic.problems.length > 0 ? prevSolved / prevTopic.problems.length : 0;
    return prevPct < 0.7; // Lock if previous topic is less than 70% complete
  };

  const getStriverTopicStats = (topic) => {
    const solvedCount = topic.problems.filter(p => striverProgress.has(p.id)).length;
    const totalCount = topic.problems.length;
    const pct = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;
    return { solvedCount, totalCount, pct };
  };

  // NeetCode 150 lock logic (60% gating)
  const isNeetcodeTopicLocked = (index) => {
    if (index === 0) return false;
    const prevTopic = neetcodeTopics[index - 1];
    const prevSolved = prevTopic.problems.filter(p => neetcodeProgress.has(p.id)).length;
    const prevPct = prevTopic.problems.length > 0 ? prevSolved / prevTopic.problems.length : 0;
    return prevPct < 0.6; // Lock if previous topic is less than 60% complete
  };

  const getNeetcodeTopicStats = (topic) => {
    const solvedCount = topic.problems.filter(p => neetcodeProgress.has(p.id)).length;
    const totalCount = topic.problems.length;
    const pct = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;
    return { solvedCount, totalCount, pct };
  };

  // Mock Timer Handlers
  const toggleMockTimer = () => {
    if (mockRunning) {
      clearInterval(mockTimerRef.current);
      setMockRunning(false);
    } else {
      // Pick a random problem under mockTopic from striverTopics/dsaProblems
      let potentialProbs = [];
      neetcodeTopics.forEach(t => {
        if (t.title.toLowerCase().includes(mockTopic.toLowerCase())) {
          potentialProbs.push(...t.problems);
        }
      });
      if (potentialProbs.length === 0) {
        striverTopics.forEach(t => {
          if (t.title.toLowerCase().includes(mockTopic.toLowerCase())) {
            potentialProbs.push(...t.problems);
          }
        });
      }
      
      const p = potentialProbs.length > 0 
        ? potentialProbs[Math.floor(Math.random() * potentialProbs.length)]
        : { id: 'mock-custom', title: `Random ${mockTopic} Interview Challenge`, difficulty: 'medium', link: 'https://leetcode.com/' };

      setMockProb(p);
      setMockRunning(true);
      mockTimerRef.current = setInterval(() => {
        setMockTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(mockTimerRef.current);
            setMockRunning(false);
            addToast('Mock interview time is up!', 'warning');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const saveMockResult = (status) => {
    if (mockTimerRef.current) clearInterval(mockTimerRef.current);
    mutateState(draft => {
      if (!draft.mockInterviewLog) draft.mockInterviewLog = [];
      draft.mockInterviewLog.unshift({
        id: `mock-dsa-${Date.now()}`,
        topic: mockTopic,
        problem: mockProb?.title || mockProb?.problem || 'Unknown Problem',
        status, // 'solved', 'partial', 'failed'
        date: new Date().toLocaleDateString(),
        timeTaken: `${Math.floor((1800 - mockTimeRemaining)/60)}m`
      });
    });
    addToast('Mock session saved to log!', 'success');
    setMockRunning(false);
    setMockTimeRemaining(1800);
    setMockProb(null);
  };

  // Aptitude practice timer
  const toggleAptitudeTimer = () => {
    if (aptitudeRunning) {
      clearInterval(aptitudeTimerRef.current);
      setAptitudeRunning(false);
    } else {
      setAptitudeRunning(true);
      aptitudeTimerRef.current = setInterval(() => {
        setAptitudeTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(aptitudeTimerRef.current);
            setAptitudeRunning(false);
            addToast('Aptitude practice session done!', 'success');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const resetAptitudeTimer = () => {
    if (aptitudeTimerRef.current) clearInterval(aptitudeTimerRef.current);
    setAptitudeRunning(false);
    setAptitudeTimeRemaining(1800);
  };

  const resetMockTimer = () => {
    if (mockTimerRef.current) clearInterval(mockTimerRef.current);
    setMockRunning(false);
    setMockTimeRemaining(1800);
    setMockProb(null);
  };

  const getRoadmapTopicStats = (topic) => {
    const solvedCount = topic.problems.filter(p => dsaRoadmapProgress.has(p.id)).length;
    const totalCount = topic.problems.length;
    const pct = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;
    
    const easyCount = topic.problems.filter(p => p.difficulty === 'easy').length;
    const mediumCount = topic.problems.filter(p => p.difficulty === 'medium').length;
    const hardCount = topic.problems.filter(p => p.difficulty === 'hard').length;

    return { solvedCount, totalCount, pct, easyCount, mediumCount, hardCount };
  };

  // -------------------------------------------------------------
  // RENDER CONDITIONAL NESTED SUBVIEWS (Topic View or Problem View)
  // -------------------------------------------------------------

  // SINGLE PROBLEM DETAIL VIEW
  if (selectedProblem) {
    const sourcesMap = selectedProblem.sources || {};
    const hasCode = selectedProblem.id.startsWith('dr-') 
      ? dsaRoadmapProgress.has(selectedProblem.id) 
      : selectedProblem.id.startsWith('nc-')
        ? neetcodeProgress.has(selectedProblem.id)
        : striverProgress.has(selectedProblem.id);
    return (
      <div style={{ animation: 'fade-in 0.3s ease-out' }}>
        <div style={{ marginBottom: '16px' }}>
          <button className="btn btn-ghost btn-xs" onClick={() => setSelectedProblem(null)}>
            ◀ Back to List
          </button>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--electric)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className={`badge ${selectedProblem.difficulty === 'easy' ? 'b-green' : selectedProblem.difficulty === 'medium' ? 'b-amber' : 'b-red'}`}>
              {selectedProblem.difficulty}
            </span>
            {selectedProblem.patterns && selectedProblem.patterns.map(p => (
              <span className="topic-tag" key={p}>{p}</span>
            ))}
          </div>

          <h2 style={{ fontFamily: 'var(--display)', fontSize: '24px', fontWeight: 800, color: 'var(--t1)', marginBottom: '12px' }}>
            {selectedProblem.title}
          </h2>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {/* Status toggle action */}
            <button
              className={`btn ${hasCode ? 'btn-success' : 'btn-primary'}`}
              onClick={() => {
                if (selectedProblem.id.startsWith('dr-')) {
                  toggleRoadmapProblem(selectedProblem.id);
                } else if (selectedProblem.id.startsWith('nc-')) {
                  toggleNeetcodeProblem(selectedProblem.id);
                } else {
                  toggleStriverProblem(selectedProblem.id);
                }
              }}
            >
              {hasCode ? '✓ Solved (Click to Reset)' : 'Mark as Solved'}
            </button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
              English Plain Text Approach
            </h4>
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '14px', fontSize: '13px', color: 'var(--t2)', lineHeight: 1.5 }}>
              {selectedProblem.approach || 'For this problem, analyze constraints, search space, and key properties. Choose an optimal data structure to balance time complexity (e.g. hash map for O(1) lookups, or two pointers for O(1) space).'}
            </div>
          </div>

          <div>
            <h4 style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
              Practice & Solution Deep Links
            </h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {/* Render links */}
              {selectedProblem.link && (
                <a href={selectedProblem.link} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                  Solve on Platform ↗
                </a>
              )}
              {Object.entries(sourcesMap).map(([key, val]) => {
                if (val) {
                  return (
                    <a key={key} href={val} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ textTransform: 'capitalize' }}>
                      {key === 'striver' ? 'Striver TUF' : key.toUpperCase()} Reference ↗
                    </a>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DETAILED TOPIC LIST PAGE
  if (selectedTopicId) {
    let activeTopic, activeProgress, activeToggler, badgeText;
    if (tab === 'neetcode') {
      activeTopic = neetcodeTopics.find(t => t.id === selectedTopicId);
      activeProgress = neetcodeProgress;
      activeToggler = toggleNeetcodeProblem;
      badgeText = 'NeetCode 150';
    } else if (striverTopicView) {
      activeTopic = striverTopics.find(t => t.id === selectedTopicId);
      activeProgress = striverProgress;
      activeToggler = toggleStriverProblem;
      badgeText = 'Striver A2Z';
    } else {
      activeTopic = dsaTopicsData.find(t => t.id === selectedTopicId);
      activeProgress = dsaRoadmapProgress;
      activeToggler = toggleRoadmapProblem;
      badgeText = 'Roadmap Topic';
    }

    const filteredProblems = activeTopic 
      ? (tab === 'neetcode' ? activeTopic.problems : activeTopic.problems.filter(matchesSourceFilter)) 
      : [];

    return (
      <div style={{ animation: 'fade-in 0.3s ease-out' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <button className="btn btn-ghost btn-xs" onClick={() => setSelectedTopicId(null)}>
            ◀ Back to Dashboard
          </button>
          <span className="badge b-purple">{badgeText}</span>
        </div>

        <div className="card" style={{ marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'var(--display)', fontSize: '22px', fontWeight: 800, color: 'var(--t1)', marginBottom: '4px' }}>
            {activeTopic?.title}
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--t3)' }}>
            {activeTopic?.description || 'Deep dive topic study and problems to solve.'}
          </p>
        </div>

        <div className="card">
          <div className="card-hdr">
            <div className="card-title">Problem Set ({filteredProblems.length} filtered)</div>
          </div>

          {filteredProblems.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">❄</div>
              <div className="empty-msg">No problems match the current Source Filter Chips.</div>
            </div>
          ) : (
            <div className="tw">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: '40px', textAlign: 'center' }}>Done</th>
                    <th>Problem Name</th>
                    <th>Difficulty</th>
                    <th>Platform Sources</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProblems.map(p => (
                    <ProblemRow
                      key={p.id}
                      problem={p}
                      isCompleted={activeProgress.has(p.id)}
                      onToggle={() => activeToggler(p.id)}
                      onClick={() => setSelectedProblem(p)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER MAIN VIEW (Dashboard Grid with the 3 Tabs)
  // -------------------------------------------------------------
  return (
    <div style={{ animation: 'fade-in 0.4s ease-out' }}>
      {/* PAGE HEADER */}
      <div className="ph" style={{ marginBottom: '20px' }}>
        <div>
          <div className="ph-eyebrow">DSA Preparation</div>
          <div className="ph-title">Data Structures & Algorithms</div>
          <div className="ph-sub">Solve curated sheets, track progress, and sync verified submissions</div>
        </div>
      </div>

      {/* TOP TAB NAVIGATION BAR */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setTab('roadmap')}
          className={`ntab ${tab === 'roadmap' ? 'active' : ''}`}
          style={{ paddingBottom: '12px', flex: 1, minWidth: '120px' }}
        >
          Structured Roadmap
        </button>
        <button
          onClick={() => setTab('striver')}
          className={`ntab ${tab === 'striver' ? 'active' : ''}`}
          style={{ paddingBottom: '12px', flex: 1, minWidth: '120px' }}
        >
          Striver A2Z Sheet
        </button>
        <button
          onClick={() => setTab('neetcode')}
          className={`ntab ${tab === 'neetcode' ? 'active' : ''}`}
          style={{ paddingBottom: '12px', flex: 1, minWidth: '120px' }}
        >
          🚀 NeetCode 150
        </button>
        <button
          onClick={() => setTab('mock')}
          className={`ntab ${tab === 'mock' ? 'active' : ''}`}
          style={{ paddingBottom: '12px', flex: 1, minWidth: '120px' }}
        >
          ⏱️ Mock Interview
        </button>
        <button
          onClick={() => setTab('aptitude')}
          className={`ntab ${tab === 'aptitude' ? 'active' : ''}`}
          style={{ paddingBottom: '12px', flex: 1, minWidth: '120px' }}
        >
          🧠 OA/Aptitude
        </button>
        <button
          onClick={() => setTab('kits')}
          className={`ntab ${tab === 'kits' ? 'active' : ''}`}
          style={{ paddingBottom: '12px', flex: 1, minWidth: '120px' }}
        >
          Company Kits
        </button>
      </div>

      {/* SOURCE FILTER CHIPS ROW */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: '20px', background: 'var(--bg2)', padding: '10px 14px', borderRadius: 'var(--rs)', border: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', marginRight: '6px' }}>
          Filters:
        </span>
        {[
          { key: 'leetcode', label: 'LeetCode', color: '#FFA116' },
          { key: 'neetcode', label: 'NeetCode', color: '#00E5FF' },
          { key: 'striver', label: 'Striver TUF', color: '#B04AFF' },
          { key: 'geeksforgeeks', label: 'GFG', color: '#2F8D46' },
          { key: 'hackerrank', label: 'HackerRank', color: '#2EC866' }
        ].map(chip => {
          const isActive = activeSources.has(chip.key);
          return (
            <button
              key={chip.key}
              onClick={() => toggleSourceFilter(chip.key)}
              style={{
                background: isActive ? 'var(--surface)' : 'transparent',
                color: isActive ? 'var(--t1)' : 'var(--t3)',
                border: isActive ? `1.5px solid ${chip.color}` : '1.5px solid var(--border)',
                borderRadius: '20px',
                padding: '4px 12px',
                fontSize: '10px',
                fontWeight: 700,
                fontFamily: 'var(--mono)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.15s'
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: chip.color }}></span>
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: ROADMAP (GRID OF TOPIC CARDS WITH RADIAL PROGRESS) */}
      {tab === 'roadmap' && (
        <div className="g3" style={{ gap: '16px' }}>
          {dsaTopicsData.map(topic => {
            const stats = getRoadmapTopicStats(topic);
            return (
              <div key={topic.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <TopicCard
                  topic={topic}
                  doneCount={stats.solvedCount}
                  totalCount={stats.totalCount}
                  onSelect={() => {
                    setSelectedTopicId(topic.id);
                    setStriverTopicView(false);
                  }}
                />
                <div style={{ padding: '0 8px' }}>
                  <DifficultyBar
                    easyCount={stats.easyCount}
                    mediumCount={stats.mediumCount}
                    hardCount={stats.hardCount}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: STRIVER A2Z SHEET (LIST VIEW WITH GATED LOCKS) */}
      {tab === 'striver' && (
        <div className="card">
          <div className="card-hdr" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '16px' }}>
            <div>
              <div className="card-title">Striver A2Z Curriculum</div>
              <div className="card-label" style={{ fontSize: '14px', marginTop: '2px' }}>
                Unlock sections sequentially (70% pass gate)
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {striverTopics.map((topic, index) => {
              const locked = isStriverTopicLocked(index);
              const { solvedCount, totalCount, pct } = getStriverTopicStats(topic);

              return (
                <div
                  key={topic.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--bg3)',
                    border: locked ? '1px dashed var(--border)' : '1px solid var(--border)',
                    borderRadius: 'var(--rs)',
                    padding: '14px 18px',
                    opacity: locked ? 0.45 : 1,
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ flex: 1, marginRight: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--t3)', fontWeight: 700 }}>
                        Step {index + 1}
                      </span>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, color: locked ? 'var(--t3)' : 'var(--t1)' }}>
                        {topic.title}
                      </h4>
                      {locked && <span style={{ fontSize: '12px' }}>🔒</span>}
                      {pct === 100 && <span className="badge b-green" style={{ fontSize: '8px' }}>Passed</span>}
                    </div>

                    {!locked && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', maxWidth: '280px' }}>
                        <div className="pbar" style={{ flex: 1, margin: 0 }}>
                          <div className="pfill" style={{ width: `${pct}%`, backgroundColor: pct === 100 ? 'var(--volt)' : 'var(--electric)' }}></div>
                        </div>
                        <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--t2)', fontWeight: 700 }}>
                          {solvedCount}/{totalCount} ({pct}%)
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    {locked ? (
                      <button className="btn btn-ghost btn-sm" disabled style={{ cursor: 'not-allowed' }}>
                        Locked
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setSelectedTopicId(topic.id);
                          setStriverTopicView(true);
                        }}
                      >
                        {pct > 0 ? 'Resume' : 'Start'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: NEETCODE 150 */}
      {tab === 'neetcode' && (
        <div className="card">
          <div className="card-hdr" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '16px' }}>
            <div>
              <div className="card-title">NeetCode 150 Roadmap</div>
              <div className="card-label" style={{ fontSize: '14px', marginTop: '2px' }}>
                Unlock sections sequentially (60% gating threshold)
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {neetcodeTopics.map((topic, index) => {
              const locked = isNeetcodeTopicLocked(index);
              const { solvedCount, totalCount, pct } = getNeetcodeTopicStats(topic);

              return (
                <div
                  key={topic.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--bg3)',
                    border: locked ? '1px dashed var(--border)' : '1px solid var(--border)',
                    borderRadius: 'var(--rs)',
                    padding: '14px 18px',
                    opacity: locked ? 0.55 : 1,
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ flex: 1, marginRight: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h4 style={{ margin: 0, fontSize: '15px', color: locked ? 'var(--t3)' : 'var(--t1)' }}>
                        {topic.title}
                      </h4>
                      {locked && <span style={{ fontSize: '11px', color: 'var(--t3)' }}>🔒 Locked</span>}
                    </div>

                    {!locked && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                        <div style={{ flex: 1, height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: 'var(--electric)' }}></div>
                        </div>
                        <span style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--t3)' }}>
                          {solvedCount}/{totalCount} ({pct}%)
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    {locked ? (
                      <button className="btn btn-ghost btn-sm" disabled style={{ cursor: 'not-allowed' }}>
                        Locked
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setSelectedTopicId(topic.id);
                        }}
                      >
                        {pct > 0 ? 'Resume' : 'Start'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: MOCK INTERVIEW */}
      {tab === 'mock' && (
        <div className="mock-simulator-view">
          <div className="simulator-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
            <div className="card">
              <h3>DSA Mock Interview Practice</h3>
              <p className="subtitle">Simulate a live coding round. Pick a topic, hit start, and solve the random problem under pressure.</p>

              <div style={{ display: 'flex', gap: '16px', margin: '20px 0', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'var(--t2)' }}>Select Topic Focus</label>
                  <select 
                    value={mockTopic} 
                    onChange={(e) => setMockTopic(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--t1)', borderRadius: 'var(--rs)' }}
                    disabled={mockRunning}
                  >
                    {DSA_TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <button 
                    onClick={toggleMockTimer} 
                    className={`btn ${mockRunning ? 'btn-danger' : 'btn-primary'}`}
                    style={{ height: '38px', padding: '0 20px' }}
                  >
                    {mockRunning ? '⏸️ Stop Mock' : '▶️ Start 30-Min Timer'}
                  </button>
                </div>
                {mockRunning && (
                  <button onClick={resetMockTimer} className="btn btn-ghost" style={{ height: '38px' }}>
                    Reset
                  </button>
                )}
              </div>

              {mockRunning && mockProb && (
                <div className="mock-problem-card" style={{ padding: '16px', background: 'var(--bg2)', borderLeft: '4px solid var(--amber)', borderRadius: 'var(--rs)', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={`badge ${mockProb.difficulty === 'easy' ? 'b-green' : mockProb.difficulty === 'medium' ? 'b-amber' : 'b-red'}`}>{mockProb.difficulty}</span>
                    <span style={{ fontSize: '11px', color: 'var(--t3)', fontFamily: 'var(--mono)' }}>ID: {mockProb.id}</span>
                  </div>
                  <h4 style={{ margin: '10px 0', fontSize: '18px' }}>{mockProb.title || mockProb.problem}</h4>
                  {mockProb.link && (
                    <a href={mockProb.link} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-xs" style={{ display: 'inline-block', marginTop: '6px' }}>
                      Solve on Platform ↗
                    </a>
                  )}
                </div>
              )}

              {mockRunning && (
                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                  <div style={{ fontSize: '48px', fontWeight: 800, fontFamily: 'var(--mono)', color: mockTimeRemaining < 300 ? 'var(--rose)' : 'var(--t1)' }}>
                    {Math.floor(mockTimeRemaining / 60).toString().padStart(2, '0')}:{(mockTimeRemaining % 60).toString().padStart(2, '0')}
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--t3)' }}>Timer keeps running even if you switch tabs.</p>
                </div>
              )}

              {mockRunning && (
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '15px', marginTop: '15px' }}>
                  <h4 style={{ margin: '0 0 10px' }}>Self-Rate Your Performance</h4>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => saveMockResult('solved')} className="btn btn-success" style={{ flex: 1 }}>✅ Solved (Optimal)</button>
                    <button onClick={() => saveMockResult('partial')} className="btn btn-warning" style={{ flex: 1 }}>🟡 Partial / Brute Force</button>
                    <button onClick={() => saveMockResult('failed')} className="btn btn-danger" style={{ flex: 1 }}>❌ Failed / Time Out</button>
                  </div>
                </div>
              )}
            </div>

            <div className="card">
              <h3>Mock History Log</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '350px', overflowY: 'auto' }}>
                {(!state.mockInterviewLog || state.mockInterviewLog.length === 0) ? (
                  <p style={{ color: 'var(--t3)', fontSize: '12px', textAlign: 'center', marginTop: '20px' }}>No mock interview attempts recorded yet.</p>
                ) : (
                  state.mockInterviewLog.map(log => (
                    <div key={log.id} style={{ padding: '10px 14px', background: 'var(--bg3)', borderRadius: 'var(--rs)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>{log.problem}</strong>
                        <div style={{ fontSize: '11px', color: 'var(--t3)' }}>Topic: {log.topic} · {log.date}</div>
                      </div>
                      <span className={`badge ${log.status === 'solved' ? 'b-green' : log.status === 'partial' ? 'b-amber' : 'b-red'}`}>{log.status}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: OA / APTITUDE */}
      {tab === 'aptitude' && (
        <div className="card">
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
            <div>
              <h3>Online Assessment (OA) & Quantitative Aptitude</h3>
              <p className="subtitle">Daily 30-minute practice is mandatory for company OA rounds (Goldman Sachs, TCS, Infosys).</p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '20px 0' }}>
                <div style={{ fontSize: '36px', fontWeight: 800, fontFamily: 'var(--mono)', color: 'var(--volt)' }}>
                  {Math.floor(aptitudeTimeRemaining / 60).toString().padStart(2, '0')}:{(aptitudeTimeRemaining % 60).toString().padStart(2, '0')}
                </div>
                <button onClick={toggleAptitudeTimer} className={`btn ${aptitudeRunning ? 'btn-danger' : 'btn-primary'}`}>
                  {aptitudeRunning ? '⏸️ Pause Timer' : '▶️ Start Daily 30-Min Focus'}
                </button>
                <button onClick={resetAptitudeTimer} className="btn btn-ghost">Reset</button>
              </div>

              <div className="aptitude-topics" style={{ marginTop: '20px' }}>
                <h4>Core OA Topics</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ padding: '10px', background: 'var(--bg2)', borderRadius: 'var(--rs)', border: '1px solid var(--border)' }}>
                    <strong>🎲 Probability & Permutations</strong>
                    <div style={{ fontSize: '11px', color: 'var(--t3)' }}>Highly asked in GS Quant round</div>
                  </div>
                  <div style={{ padding: '10px', background: 'var(--bg2)', borderRadius: 'var(--rs)', border: '1px solid var(--border)' }}>
                    <strong>🔢 Number Theory & Modular Arithmetic</strong>
                    <div style={{ fontSize: '11px', color: 'var(--t3)' }}>Core cryptography/math filters</div>
                  </div>
                  <div style={{ padding: '10px', background: 'var(--bg2)', borderRadius: 'var(--rs)', border: '1px solid var(--border)' }}>
                    <strong>⏱️ Time, Speed & Distance / Time & Work</strong>
                    <div style={{ fontSize: '11px', color: 'var(--t3)' }}>TCS NQT and Infosys foundations</div>
                  </div>
                  <div style={{ padding: '10px', background: 'var(--bg2)', borderRadius: 'var(--rs)', border: '1px solid var(--border)' }}>
                    <strong>🧩 Logical Reasoning / Puzzles</strong>
                    <div style={{ fontSize: '11px', color: 'var(--t3)' }}>Deductive & inductive test segments</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '20px' }}>
              <h4>Company OA Specific Notes</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                <div style={{ background: 'var(--gold-bg)', border: '1px solid var(--gold-border)', padding: '10px 14px', borderRadius: 'var(--rs)' }}>
                  <span className="gs-finalist-badge" style={{ fontSize: '9px' }}>Goldman Sachs</span>
                  <p style={{ margin: '5px 0 0', fontSize: '12px', color: 'var(--gold-text)', lineHeight: 1.4 }}>
                    Prepare for the GS Quant round consisting of 8-10 advanced probability and statistics questions.
                  </p>
                </div>
                <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: '10px 14px', borderRadius: 'var(--rs)' }}>
                  <strong>TCS Prime / Digital (NQT)</strong>
                  <p style={{ margin: '5px 0 0', fontSize: '12px', color: 'var(--t2)', lineHeight: 1.4 }}>
                    Advanced quantitative aptitude section is heavily speed-based. Do weekly mocks.
                  </p>
                </div>
              </div>

              <h4 style={{ marginTop: '20px' }}>Aptitude Practice Resources</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                <a href="https://www.indiabix.com/" target="_blank" rel="noopener noreferrer" className="gs-ref-link" style={{ fontSize: '13px' }}>🔗 IndiaBix Aptitude</a>
                <a href="https://prepinsta.com/" target="_blank" rel="noopener noreferrer" className="gs-ref-link" style={{ fontSize: '13px' }}>🔗 PrepInsta Placement Prep</a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COMPANY KITS (ORIGINAL DSA TRACKER TABLE + PROFILE SYNC) */}
      {tab === 'kits' && (
        <>
          {/* STATS SECTION */}
          <div className="dsa-stats" style={{ marginBottom: '16px' }}>
            <div className="metric">
              <div className="metric-val">{probs.length}</div>
              <div className="metric-lbl">Total Logged</div>
              <div className="metric-sub">{solved} solved</div>
            </div>
            <div className="metric">
              <div className="metric-val diff-e">{easy}</div>
              <div className="metric-lbl">Easy</div>
            </div>
            <div className="metric">
              <div className="metric-val diff-m">{medium}</div>
              <div className="metric-lbl">Medium</div>
            </div>
            <div className="metric">
              <div className="metric-val diff-h">{hard}</div>
              <div className="metric-lbl">Hard</div>
            </div>
          </div>

          {/* SYNC CENTER */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <div
              className="card-hdr"
              onClick={() => setSyncPanelOpen(!syncPanelOpen)}
              style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
            >
              <div>
                <div className="card-title">Profile Sync Center</div>
                <div className="card-label" style={{ fontSize: '14px', marginTop: '2px' }}>Connect handles to sync solved counts automatically</div>
              </div>
              <button className="btn btn-ghost btn-sm">
                {syncPanelOpen ? 'Hide Sync Settings ▲' : 'Configure Handles ▾'}
              </button>
            </div>
            {syncPanelOpen && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <div className="g5" style={{ gap: '12px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
                  {['leetcode', 'codeforces', 'neetcode', 'hackerrank', 'geeksforgeeks', 'unstop'].map(key => {
                    const acc = s.syncAccounts?.[key] || { handle: '', status: 'Disconnected', lastSynced: '' };
                    const nameMap = { leetcode: 'LeetCode', codeforces: 'Codeforces', neetcode: 'NeetCode', hackerrank: 'HackerRank', geeksforgeeks: 'GeeksforGeeks', unstop: 'Unstop' };
                    const badgeClass = acc.status === 'Connected' ? 'b-green' : 'b-gray';
                    return (
                      <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }} key={key}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                          <span style={{ fontWeight: 700, color: platformColors[key], fontSize: '12px' }}>{nameMap[key]}</span>
                          <span className={`badge ${badgeClass}`} style={{ fontSize: '8px', padding: '2px 5px' }}>{acc.status}</span>
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--t3)', fontFamily: 'var(--mono)' }}>
                          {acc.lastSynced ? `Synced: ${acc.lastSynced}` : 'Never synced'}
                        </div>
                        <input
                          className="si"
                          style={{ padding: '5px 8px', fontSize: '12px' }}
                          placeholder="Username"
                          value={acc.handle || ''}
                          onChange={(e) => handleUpdateHandle(key, e.target.value)}
                        />
                        <button className="btn btn-primary btn-xs" style={{ width: '100%' }} onClick={() => triggerSync(key)}>
                          {acc.status === 'Connected' ? 'Re-Sync' : 'Sync Account'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* PROBLEM LOG TABLE SECTION */}
          <div className="card">
            <div className="card-hdr" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="card-title">Problem Log</div>
              <button className="btn btn-primary btn-sm" onClick={() => setEditingProblem({})}>+ Add Problem</button>
            </div>
            
            <div className="sb" style={{ flexWrap: 'wrap', gap: '8px' }}>
              <input
                className="si"
                style={{ flex: 1, minWidth: '150px' }}
                placeholder="Search problems, topics…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select style={{ width: '130px' }} value={diffFilter} onChange={(e) => setDiffFilter(e.target.value)}>
                <option value="all">All difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <select style={{ width: '140px' }} value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)}>
                <option value="all">All platforms</option>
                {['LeetCode', 'Codeforces', 'NeetCode', 'HackerRank', 'GeeksforGeeks', 'Other'].map(pl => (
                  <option value={pl} key={pl}>{pl}</option>
                ))}
              </select>
              <select style={{ width: '150px' }} value={topicFilter} onChange={(e) => setTopicFilter(e.target.value)}>
                <option value="all">All topics</option>
                {[...new Set([...DSA_TOPICS, ...topics])].map(t => (
                  <option value={t} key={t}>{t}</option>
                ))}
              </select>
              <select style={{ width: '150px' }} value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)}>
                <option value="all">All Companies</option>
                {s.companies.map(c => (
                  <option value={c.companyName} key={c.id}>{c.companyName}</option>
                ))}
              </select>
            </div>

            {filteredKits.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">⚡</div>
                <div className="empty-msg">No problems logged yet — start grinding</div>
              </div>
            ) : (
              <div className="tw">
                <table>
                  <thead>
                    <tr>
                      <th>Done</th>
                      <th>Problem</th>
                      <th>Difficulty</th>
                      <th>Topic</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredKits.map(p => {
                      const pKey = (p.platform || 'other').toLowerCase();
                      const platClass = platformClasses[pKey] || 'b-gray';
                      const diffClass = `diff-${p.difficulty === 'easy' ? 'e' : p.difficulty === 'medium' ? 'm' : 'h'}`;
                      const statusClass = `badge b-${p.status === 'solved' ? 'green' : p.status === 'attempted' ? 'amber' : 'gray'}`;
                      return (
                        <tr key={p.id}>
                          <td style={{ width: '40px' }}>
                            <div className={`chk-box ${p.status === 'solved' ? 'done' : ''}`} style={{ cursor: 'default' }}>
                              {p.status === 'solved' ? '✓' : ''}
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${platClass}`} style={{ fontSize: '8px', padding: '2px 5px', marginRight: '6px', verticalAlign: 'middle', textTransform: 'none' }}>{p.platform || 'Other'}</span>
                            {p.link ? (
                              <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--electric)', fontWeight: 600, decoration: 'none' }}>{p.problem}</a>
                            ) : (
                              <span style={{ fontWeight: 600 }}>{p.problem}</span>
                            )}
                            {p.notes && (
                              <div style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '2px' }}>{p.notes}</div>
                            )}
                            {p.company && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                                <span className="badge b-gray" style={{ fontSize: '8px', padding: '1px 4px', textTransform: 'none' }}>
                                  🏢 {p.company}
                                </span>
                                {(() => {
                                  const comp = s.companies.find(c => c.companyName.toLowerCase() === p.company.toLowerCase());
                                  if (comp) {
                                    const isEligible = 6.8 >= (comp.cgpaCriteria || 0);
                                    return (
                                      <>
                                        <span className={`badge ${isEligible ? 'b-green' : 'b-red'}`} style={{ fontSize: '8px', padding: '1px 4px' }}>
                                          CGPA: {comp.cgpaCriteria || '6.0'}+ {isEligible ? '✅' : '⚠️'}
                                        </span>
                                        {comp.hiringChallenge && (
                                          <span className="badge b-rose" style={{ fontSize: '8px', padding: '1px 4px' }}>
                                            Challenge
                                          </span>
                                        )}
                                      </>
                                    );
                                  }
                                  return null;
                                })()}
                              </div>
                            )}
                          </td>
                          <td><span className={diffClass} style={{ fontFamily: 'var(--mono)', fontSize: '11px', fontWeight: 700 }}>{p.difficulty}</span></td>
                          <td>{p.topic ? <span className="topic-tag">{p.topic}</span> : '—'}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '5px' }}>
                              <button className="btn btn-ghost btn-xs" onClick={() => setViewingSolution(p)}>View Sol</button>
                              <button className="btn btn-ghost btn-xs" onClick={() => setEditingProblem(p)}>Edit</button>
                              <button className="btn btn-danger btn-xs" onClick={() => handleDelete(p.id)}>Del</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* SYNC TERMINAL PANEL MODAL */}
      {syncingPlatform !== null && (
        <div className="moverlay">
          <div className="mbox" style={{ maxWidth: '440px' }}>
            <div className="mtitle">Syncing {syncingPlatform.name}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div
                ref={syncConsoleRef}
                style={{ background: '#020408', border: '1px solid var(--border2)', borderRadius: 'var(--rs)', padding: '16px', fontFamily: 'var(--mono)', fontSize: '11px', color: '#00E5FF', minHeight: '220px', maxHeight: '300px', overflowY: 'auto', lineHeight: '1.6' }}
              >
                {syncLogs.map((log, i) => {
                  let color = '#00E5FF';
                  if (log.includes('Success') || log.includes('Solved Easy') || log.includes('200 OK')) color = 'var(--volt)';
                  else if (log.includes('Solved Medium')) color = 'var(--amber)';
                  else if (log.includes('Solved Hard')) color = 'var(--coral)';
                  else if (log.includes('[Info]') || log.includes('[Sync]')) color = 'var(--t2)';
                  else if (log.includes('[System]')) color = 'var(--t3)';

                  return (
                    <div style={{ color }} key={i}>{log}</div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className={syncFinished ? 'btn btn-primary' : 'btn btn-ghost'}
                  disabled={!syncFinished}
                  onClick={() => setSyncingPlatform(null)}
                >
                  {syncFinished ? 'Close Console' : 'Syncing...'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CODE SOLUTION DETAILS MODAL */}
      {viewingSolution !== null && (
        <div className="moverlay" onClick={() => setViewingSolution(null)}>
          <div className="mbox" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="mtitle">
              DSA Problem Details
              <button className="mclose" onClick={() => setViewingSolution(null)}>×</button>
            </div>
            <div className="modal-scroll" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`badge ${platformClasses[(viewingSolution.platform || 'other').toLowerCase()] || 'b-gray'}`}>{viewingSolution.platform || 'Other'}</span>
                  <span className={`badge ${viewingSolution.difficulty === 'easy' ? 'b-green' : viewingSolution.difficulty === 'medium' ? 'b-amber' : 'b-red'}`}>{viewingSolution.difficulty}</span>
                  <span className="badge b-purple">{viewingSolution.topic || 'General'}</span>
                  {viewingSolution.company && (
                    <span className="badge b-gray" style={{ textTransform: 'none' }}>🏢 {viewingSolution.company}</span>
                  )}
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--t3)' }}>
                  Status: <span className={`badge b-${viewingSolution.status === 'solved' ? 'green' : viewingSolution.status === 'attempted' ? 'amber' : 'gray'}`}>{viewingSolution.status}</span>
                </div>
              </div>

              <div style={{ marginTop: '4px' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--t3)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '.8px' }}>Problem Title</div>
                <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--t1)' }}>{viewingSolution.problem}</div>
              </div>

              {viewingSolution.notes && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--t3)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '.8px' }}>Notes & Analysis</div>
                  <div style={{ fontSize: '13px', color: 'var(--t2)', lineHeight: 1.5, background: 'var(--bg3)', padding: '10px 14px', borderRadius: 'var(--rs)', border: '1px solid var(--border)' }}>{viewingSolution.notes}</div>
                </div>
              )}

              {viewingSolution.solution ? (
                <div style={{ marginTop: '14px' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--t3)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '.8px' }}>My Solution</div>
                  <pre style={{ background: '#020408', border: '1px solid var(--border2)', borderRadius: 'var(--rs)', padding: '14px', overflowX: 'auto', maxHeight: '300px', margin: 0 }}>
                    <code style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--t1)', lineHeight: 1.5, whiteSpace: 'pre' }}>{viewingSolution.solution}</code>
                  </pre>
                </div>
              ) : (
                <div className="note-box" style={{ marginTop: '14px', textAlign: 'center', padding: '20px', borderStyle: 'dashed' }}>
                  No solution code recorded yet. Click Edit to add your code!
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
                <div>
                  {viewingSolution.link && (
                    <a href={viewingSolution.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                      Solve on {viewingSolution.platform} ↗
                    </a>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-ghost" onClick={() => { setEditingProblem(viewingSolution); setViewingSolution(null); }}>Edit</button>
                  <button className="btn btn-ghost" onClick={() => setViewingSolution(null)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT / ADD DIALOG */}
      {editingProblem !== null && (
        <div className="moverlay" onClick={() => setEditingProblem(null)}>
          <div className="mbox" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div className="mtitle">
              {editingProblem.id ? 'Edit Problem' : 'Add Problem'}
              <button className="mclose" onClick={() => setEditingProblem(null)}>×</button>
            </div>
            <form onSubmit={handleSaveProblem} className="modal-scroll">
              <div className="fg">
                <label>Problem Name</label>
                <input name="problemName" defaultValue={editingProblem.problem || ''} required />
              </div>
              <div className="fg">
                <label>Target Company (optional)</label>
                <select name="company" defaultValue={editingProblem.company || ''}>
                  <option value="">None / General</option>
                  {s.companies.map(c => (
                    <option value={c.companyName} key={c.id}>{c.companyName}</option>
                  ))}
                </select>
              </div>
              <div className="fr">
                <div className="fg">
                  <label>Platform</label>
                  <select name="platform" defaultValue={editingProblem.platform || 'LeetCode'}>
                    {['LeetCode', 'Codeforces', 'NeetCode', 'HackerRank', 'GeeksforGeeks', 'Other'].map(pl => (
                      <option value={pl} key={pl}>{pl}</option>
                    ))}
                  </select>
                </div>
                <div className="fg">
                  <label>Difficulty</label>
                  <select name="difficulty" defaultValue={editingProblem.difficulty || 'easy'}>
                    {['easy', 'medium', 'hard'].map(d => (
                      <option value={d} key={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="fr">
                <div className="fg">
                  <label>Topic</label>
                  <select name="topic" defaultValue={editingProblem.topic || 'Arrays'}>
                    {DSA_TOPICS.map(t => (
                      <option value={t} key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="fg">
                  <label>Status</label>
                  <select name="status" defaultValue={editingProblem.status || 'todo'}>
                    {['todo', 'attempted', 'solved'].map(st => (
                      <option value={st} key={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="fr">
                <div className="fg">
                  <label>Problem Link (optional)</label>
                  <input name="link" placeholder="https://leetcode.com/..." defaultValue={editingProblem.link || ''} />
                </div>
                <div className="fg">
                  <label>Date Solved/Attempted</label>
                  <input name="date" type="date" defaultValue={editingProblem.date || new Date().toISOString().slice(0, 10)} />
                </div>
              </div>
              <div className="fg">
                <label>My Solution Code (optional)</label>
                <textarea
                  name="solution"
                  rows="6"
                  style={{ fontFamily: 'var(--mono)', background: '#020408', color: 'var(--t1)', borderColor: 'var(--border2)', fontSize: '12px', lineHeight: 1.5 }}
                  placeholder="// Paste your C++, Python or Java code here..."
                  defaultValue={editingProblem.solution || ''}
                ></textarea>
              </div>
              <div className="fg">
                <label>Notes / Analysis</label>
                <textarea name="notes" rows="2" defaultValue={editingProblem.notes || ''}></textarea>
              </div>
              <div className="m-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setEditingProblem(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
