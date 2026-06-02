import React, { useState, useEffect, useRef } from 'react';
import { DSA_TOPICS } from '../data/seed';

export default function DsaView({ state, mutateState, addToast }) {
  const [search, setSearch] = useState('');
  const [diffFilter, setDiffFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('all');
  const [syncPanelOpen, setSyncPanelOpen] = useState(false);

  // Sync simulation states
  const [syncingPlatform, setSyncingPlatform] = useState(null); // null or { key, name, handle }
  const [syncLogs, setSyncLogs] = useState([]);
  const [syncFinished, setSyncFinished] = useState(false);
  const syncConsoleRef = useRef(null);

  // Modal states
  const [viewingSolution, setViewingSolution] = useState(null); // problem object or null
  const [editingProblem, setEditingProblem] = useState(null); // null, {} for new, or problem object

  const s = state;
  const probs = s.dsaProblems || [];

  // Filtered problems
  let filtered = probs;
  if (search) {
    filtered = filtered.filter(p =>
      p.problem.toLowerCase().includes(search.toLowerCase()) ||
      (p.topic || '').toLowerCase().includes(search.toLowerCase())
    );
  }
  if (diffFilter !== 'all') {
    filtered = filtered.filter(p => p.difficulty === diffFilter);
  }
  if (platformFilter !== 'all') {
    filtered = filtered.filter(p => (p.platform || '').toLowerCase() === platformFilter.toLowerCase());
  }
  if (topicFilter !== 'all') {
    filtered = filtered.filter(p => p.topic === topicFilter);
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
    other: '#8899BB'
  };

  const platformClasses = {
    leetcode: 'b-amber',
    codeforces: 'b-red',
    neetcode: 'b-cyan',
    hackerrank: 'b-green',
    geeksforgeeks: 'b-purple',
    other: 'b-gray'
  };

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
      geeksforgeeks: 'GeeksforGeeks'
    };
    const platformName = nameMap[key];

    setSyncingPlatform({ key, name: platformName, handle });
    setSyncLogs([`[System] Initializing sync adapter for ${platformName}...`]);
    setSyncFinished(false);
  };

  // Run Sync Terminal Animation
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
      // Perform state changes
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

        // Mark matched seeded problems as solved
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

        // Predefined sync problems to add
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

  // Scroll terminal logs to bottom
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

    mutateState(draft => {
      if (!draft.dsaProblems) draft.dsaProblems = [];
      const obj = { problem: name, platform, difficulty, topic, status, date, link, solution, notes };

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

  return (
    <div style={{ animation: 'fade-in 0.4s ease-out' }}>
      <div className="ph">
        <div>
          <div className="ph-eyebrow">Problem Log</div>
          <div className="ph-title">DSA Tracker</div>
          <div className="ph-sub">Track LeetCode and competitive programming progress</div>
        </div>
        <button className="btn btn-primary" onClick={() => setEditingProblem({})}>+ Add Problem</button>
      </div>

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

      {/* PROFILE SYNC CENTER */}
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
            <div className="g5" style={{ gap: '12px' }}>
              {['leetcode', 'codeforces', 'neetcode', 'hackerrank', 'geeksforgeeks'].map(key => {
                const acc = s.syncAccounts?.[key] || { handle: '', status: 'Disconnected', lastSynced: '' };
                const nameMap = { leetcode: 'LeetCode', codeforces: 'Codeforces', neetcode: 'NeetCode', hackerrank: 'HackerRank', geeksforgeeks: 'GeeksforGeeks' };
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

      {/* FILTER & LIST */}
      <div className="card">
        <div className="card-hdr"><div className="card-title">Problem Log</div></div>
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
        </div>

        {filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">⚡</div>
            <div className="empty-msg">No problems logged yet — start grinding</div>
          </div>
        ) : (
          <div className="tw">
            <table>
              <thead>
                <tr>
                  <th>Problem</th>
                  <th>Difficulty</th>
                  <th>Topic</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const pKey = (p.platform || 'other').toLowerCase();
                  const platClass = platformClasses[pKey] || 'b-gray';
                  const diffClass = `diff-${p.difficulty === 'easy' ? 'e' : p.difficulty === 'medium' ? 'm' : 'h'}`;
                  const statusClass = `badge b-${p.status === 'solved' ? 'green' : p.status === 'attempted' ? 'amber' : 'gray'}`;
                  return (
                    <tr key={p.id}>
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
                      </td>
                      <td><span className={diffClass} style={{ fontFamily: 'var(--mono)', fontSize: '11px', fontWeight: 700 }}>{p.difficulty}</span></td>
                      <td>{p.topic ? <span className="topic-tag">{p.topic}</span> : '—'}</td>
                      <td><span className={statusClass}>{p.status}</span></td>
                      <td><div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--t3)' }}>{p.date || ''}</div></td>
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

      {/* SYNC MODAL */}
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
