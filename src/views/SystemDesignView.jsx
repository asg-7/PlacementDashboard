import React, { useState, useEffect, useRef } from 'react';
import { useProgress } from '../hooks/useProgress';
import { hldSystems, lldProblems } from '../data/systemDesignData';

export default function SystemDesignView({ state, mutateState, addToast }) {
  const [activeTab, setActiveTab] = useState('hld'); // 'hld' | 'lld' | 'mock'
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [selectedLld, setSelectedLld] = useState(null);

  // useProgress hooks for persistence
  const { done: systemDesignProgress, toggle: toggleCheckpoint } = useProgress('system_design');

  // Notes state from global state to keep it persistent
  const notes = state.systemDesignNotes || {};

  // Mock Timer states
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(2700); // 45 minutes in seconds
  const [mockSystemId, setMockSystemId] = useState(hldSystems[0].id);
  const [mockType, setMockType] = useState('HLD'); // 'HLD' or 'LLD'
  const [rating, setRating] = useState(3);
  const [mockFeedback, setMockFeedback] = useState('');
  
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Format time remaining
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Start / Stop Timer
  const startTimer = () => {
    if (timerRunning) {
      clearInterval(timerRef.current);
      setTimerRunning(false);
    } else {
      setTimerRunning(true);
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimerRunning(false);
            addToast('Mock Interview Timer Finished!', 'info');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerRunning(false);
    setTimeRemaining(2700);
  };

  // Save notes handler
  const handleNoteChange = (key, val) => {
    mutateState((draft) => {
      if (!draft.systemDesignNotes) draft.systemDesignNotes = {};
      draft.systemDesignNotes[key] = val;
    });
  };

  // Log Mock Session
  const saveMockSession = () => {
    const systemName = mockType === 'HLD' 
      ? hldSystems.find(s => s.id === mockSystemId)?.name 
      : lldProblems.find(p => p.id === mockSystemId)?.name;

    const logEntry = {
      id: `mock-${Date.now()}`,
      systemId: mockSystemId,
      systemName,
      type: mockType,
      date: new Date().toLocaleDateString(),
      timeTaken: `${Math.floor((2700 - timeRemaining) / 60)}m ${(2700 - timeRemaining) % 60}s`,
      rating,
      feedback: mockFeedback
    };

    mutateState((draft) => {
      if (!draft.systemDesignMockLog) draft.systemDesignMockLog = [];
      draft.systemDesignMockLog.unshift(logEntry);
    });

    addToast(`Saved mock session for ${systemName}!`, 'success');
    setMockFeedback('');
    resetTimer();
  };

  // Progress Calculations
  const totalHldCheckpoints = hldSystems.length * 7;
  const completedHldCheckpoints = hldSystems.reduce((acc, sys) => {
    return acc + sys.checklist.filter((_, idx) => systemDesignProgress.has(`${sys.id}-step-${idx}`)).length;
  }, 0);

  const totalLldCheckpoints = lldProblems.length * 5;
  const completedLldCheckpoints = lldProblems.reduce((acc, prob) => {
    return acc + prob.checklist.filter((_, idx) => systemDesignProgress.has(`${prob.id}-step-${idx}`)).length;
  }, 0);

  return (
    <div className="system-design-container">
      <div className="view-header">
        <div>
          <h2>System Design & Architecture Vault</h2>
          <p className="subtitle">High-Level & Low-Level design patterns, capacity estimations, and mock session simulator.</p>
        </div>
        <div className="overall-stats-pill">
          <span>HLD: <strong>{completedHldCheckpoints}/{totalHldCheckpoints}</strong> ({Math.round(completedHldCheckpoints/totalHldCheckpoints*100) || 0}%)</span>
          <span style={{ marginLeft: '12px' }}>LLD: <strong>{completedLldCheckpoints}/{totalLldCheckpoints}</strong> ({Math.round(completedLldCheckpoints/totalLldCheckpoints*100) || 0}%)</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="sd-tabs-nav">
        <button className={`sd-tab-btn ${activeTab === 'hld' ? 'active' : ''}`} onClick={() => setActiveTab('hld')}>🏗️ High-Level Design (HLD)</button>
        <button className={`sd-tab-btn ${activeTab === 'lld' ? 'active' : ''}`} onClick={() => setActiveTab('lld')}>🧩 Low-Level Design (LLD)</button>
        <button className={`sd-tab-btn ${activeTab === 'mock' ? 'active' : ''}`} onClick={() => setActiveTab('mock')}>⏱️ 45-Min Mock Simulator</button>
      </div>

      {/* HLD TAB */}
      {activeTab === 'hld' && (
        <div className="sd-tab-content">
          {!selectedSystem ? (
            <div className="systems-grid">
              {hldSystems.map((sys) => {
                const sysCompleted = sys.checklist.filter((_, idx) => systemDesignProgress.has(`${sys.id}-step-${idx}`)).length;
                return (
                  <div key={sys.id} className="system-card" onClick={() => setSelectedSystem(sys)}>
                    <div className="card-top">
                      <span className="system-icon">{sys.icon}</span>
                      <span className={`difficulty-badge ${sys.difficulty}`}>{sys.difficulty}</span>
                    </div>
                    <h3>{sys.name}</h3>
                    <div className="progress-mini-bar">
                      <div className="fill" style={{ width: `${(sysCompleted / 7) * 100}%` }}></div>
                    </div>
                    <div className="card-footer">
                      <span>{sysCompleted}/7 Steps Completed</span>
                      <span className="arrow-btn">➔</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="system-detail-view">
              <button className="back-btn" onClick={() => setSelectedSystem(null)}>← Back to System List</button>
              
              <div className="detail-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="system-icon-large">{selectedSystem.icon}</span>
                  <div>
                    <h3>{selectedSystem.name} Design Guide</h3>
                    <span className={`difficulty-badge ${selectedSystem.difficulty}`}>{selectedSystem.difficulty}</span>
                  </div>
                </div>
                
                {/* Resources list */}
                <div className="system-resources">
                  <h4>Prep Resources</h4>
                  <div className="resource-links">
                    {selectedSystem.resources.map((res, i) => (
                      <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="res-pill">
                        {res.type === 'video' ? '📺' : '📖'} {res.title}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="steps-container">
                {selectedSystem.checklist.map((step, idx) => {
                  const stepId = `${selectedSystem.id}-step-${idx}`;
                  const isChecked = systemDesignProgress.has(stepId);
                  return (
                    <div key={idx} className={`step-row ${isChecked ? 'completed' : ''}`}>
                      <div className="step-main">
                        <label className="checkbox-container">
                          <input 
                            type="checkbox" 
                            checked={isChecked} 
                            onChange={() => toggleCheckpoint(stepId)} 
                          />
                          <span className="checkmark"></span>
                        </label>
                        <span className="step-text">{step}</span>
                      </div>
                      
                      {/* Note Area */}
                      <div className="note-section">
                        <textarea 
                          placeholder="Write down capacity estimations, DB design notes, schemas or trade-offs here..."
                          value={notes[stepId] || ''}
                          onChange={(e) => handleNoteChange(stepId, e.target.value)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* LLD TAB */}
      {activeTab === 'lld' && (
        <div className="sd-tab-content">
          {!selectedLld ? (
            <div className="systems-grid">
              {lldProblems.map((prob) => {
                const probCompleted = prob.checklist.filter((_, idx) => systemDesignProgress.has(`${prob.id}-step-${idx}`)).length;
                return (
                  <div key={prob.id} className="system-card lld" onClick={() => setSelectedLld(prob)}>
                    <div className="card-top">
                      <span className="system-icon">🧩</span>
                      <div className="patterns-list">
                        {prob.designPatterns.map((pat, i) => (
                          <span key={i} className="pattern-tag">{pat}</span>
                        ))}
                      </div>
                    </div>
                    <h3>{prob.name}</h3>
                    <div className="progress-mini-bar">
                      <div className="fill" style={{ width: `${(probCompleted / 5) * 100}%` }}></div>
                    </div>
                    <div className="card-footer">
                      <span>{probCompleted}/5 Steps Completed</span>
                      <span className="arrow-btn">➔</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="system-detail-view">
              <button className="back-btn" onClick={() => setSelectedLld(null)}>← Back to Problem List</button>
              
              <div className="detail-header">
                <div>
                  <h3>{selectedLld.name} Low Level Design</h3>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    {selectedLld.designPatterns.map((pat, i) => (
                      <span key={i} className="pattern-tag-large">{pat}</span>
                    ))}
                  </div>
                </div>
                
                <div className="system-resources">
                  <h4>Prep Resources</h4>
                  <div className="resource-links">
                    {selectedLld.resources.map((res, i) => (
                      <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="res-pill">
                        📺 {res.title}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="steps-container">
                {selectedLld.checklist.map((step, idx) => {
                  const stepId = `${selectedLld.id}-step-${idx}`;
                  const isChecked = systemDesignProgress.has(stepId);
                  return (
                    <div key={idx} className={`step-row ${isChecked ? 'completed' : ''}`}>
                      <div className="step-main">
                        <label className="checkbox-container">
                          <input 
                            type="checkbox" 
                            checked={isChecked} 
                            onChange={() => toggleCheckpoint(stepId)} 
                          />
                          <span className="checkmark"></span>
                        </label>
                        <span className="step-text">{step}</span>
                      </div>
                      
                      {/* Note Area */}
                      <div className="note-section">
                        <textarea 
                          placeholder="Write SOLID design considerations, Class list, or patterns details..."
                          value={notes[stepId] || ''}
                          onChange={(e) => handleNoteChange(stepId, e.target.value)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MOCK SIMULATOR TAB */}
      {activeTab === 'mock' && (
        <div className="sd-tab-content mock-simulator-view">
          <div className="simulator-grid">
            {/* Live Timer Control Card */}
            <div className="card timer-card">
              <h3>Design Interview Mock Timer</h3>
              <p>Simulate a live design presentation. Pick a topic, outline requirements, draft architectural layouts, and explain database tables.</p>
              
              <div className="timer-config-row">
                <div>
                  <label>Type</label>
                  <select value={mockType} onChange={(e) => { setMockType(e.target.value); setMockSystemId(e.target.value === 'HLD' ? hldSystems[0].id : lldProblems[0].id); }}>
                    <option value="HLD">High-Level Design (HLD)</option>
                    <option value="LLD">Low-Level Design (LLD)</option>
                  </select>
                </div>
                
                <div>
                  <label>Select System</label>
                  <select value={mockSystemId} onChange={(e) => setMockSystemId(e.target.value)}>
                    {mockType === 'HLD' 
                      ? hldSystems.map(s => <option key={s.id} value={s.id}>{s.name}</option>)
                      : lldProblems.map(p => <option key={p.id} value={p.id}>{p.name}</option>)
                    }
                  </select>
                </div>
              </div>

              <div className={`countdown-display ${timeRemaining < 300 ? 'alarm' : ''}`}>
                {formatTime(timeRemaining)}
              </div>

              <div className="timer-controls">
                <button className={`btn-primary ${timerRunning ? 'pause' : 'start'}`} onClick={startTimer}>
                  {timerRunning ? '⏸️ Pause' : '▶️ Start 45-Min Mock'}
                </button>
                <button className="btn-secondary" onClick={resetTimer}>🔄 Reset</button>
              </div>

              {/* Self-Rating Form */}
              <div className="self-rating-section">
                <h4>Self-Assessment</h4>
                <div className="stars-rating">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button 
                      key={num} 
                      className={`star-btn ${rating >= num ? 'filled' : ''}`}
                      onClick={() => setRating(num)}
                    >
                      ★
                    </button>
                  ))}
                </div>
                
                <textarea 
                  placeholder="Record your feedback here: What did you miss? (e.g. Capacity calculations, failure mitigation, specific SOLID violations)"
                  value={mockFeedback}
                  onChange={(e) => setMockFeedback(e.target.value)}
                />
                
                <button 
                  className="btn-primary" 
                  onClick={saveMockSession}
                  disabled={timeRemaining === 2700}
                >
                  💾 Save Mock Session & Feedback
                </button>
              </div>
            </div>

            {/* Mock Session Log Card */}
            <div className="card log-card">
              <h3>Mock Session History</h3>
              <div className="history-list">
                {(!state.systemDesignMockLog || state.systemDesignMockLog.length === 0) ? (
                  <p className="no-history">No mock sessions completed yet. Start your first 45-minute timed design trial above.</p>
                ) : (
                  state.systemDesignMockLog.map((log) => (
                    <div key={log.id} className="log-item">
                      <div className="log-header">
                        <div>
                          <strong>{log.systemName}</strong> <span className="log-type-tag">{log.type}</span>
                        </div>
                        <span className="log-date">{log.date}</span>
                      </div>
                      <div className="log-stats">
                        <span>Duration: {log.timeTaken}</span>
                        <span>Score: {'★'.repeat(log.rating)}{'☆'.repeat(5-log.rating)}</span>
                      </div>
                      {log.feedback && <p className="log-feedback">💡 {log.feedback}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
