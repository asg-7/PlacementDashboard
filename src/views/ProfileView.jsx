import React, { useState } from 'react';
import { gsPuzzles, gsFinanceBasics, gsSTARQuestions, gsResources, gsInterviewPatterns } from '../data/gsData';

export default function ProfileView({ state, mutateState, addToast }) {
  const [activeTab, setActiveTab] = useState('resume'); // 'resume' | 'linkedin' | 'github' | 'star'
  const [revealedPuzzles, setRevealedPuzzles] = useState(new Set());
  const [puzzleHints, setPuzzleHints] = useState(new Set());

  // Local state helper for state syncing
  const profileData = state.profileData || {
    resume: { gsFinalist: false, quantifiedImpact: false, actionVerbs: false, onePageMax: false, atsFriendly: false, resumeWorded: false, customSummary: false },
    linkedin: { headline: false, photo: false, connections500: false, featuredSection: false, postsWeekly: false, skillsEndorsed: false, recommendations: false, connectionsCount: 0, posts: [] },
    github: { reposPinned: false, readmesPolished: false, deployed: false, noEmptyRepos: false, commitStreak: false, descriptiveNames: false, commitStreakCount: 0, qualityScore: 0 },
    starBank: {}
  };

  const handleCheckboxChange = (section, key) => {
    mutateState((draft) => {
      if (!draft.profileData) draft.profileData = { resume: {}, linkedin: {}, github: {}, starBank: {} };
      if (!draft.profileData[section]) draft.profileData[section] = {};
      draft.profileData[section][key] = !draft.profileData[section][key];
    });
  };

  const handleInputChange = (section, key, value) => {
    mutateState((draft) => {
      if (!draft.profileData) draft.profileData = { resume: {}, linkedin: {}, github: {}, starBank: {} };
      if (!draft.profileData[section]) draft.profileData[section] = {};
      draft.profileData[section][key] = value;
    });
  };

  const handleStarChange = (qId, field, value) => {
    mutateState((draft) => {
      if (!draft.profileData) draft.profileData = { resume: {}, linkedin: {}, github: {}, starBank: {} };
      if (!draft.profileData.starBank) draft.profileData.starBank = {};
      if (!draft.profileData.starBank[qId]) draft.profileData.starBank[qId] = {};
      draft.profileData.starBank[qId][field] = value;
    });
  };

  // Toggle reveal puzzle solution
  const togglePuzzleSolution = (id) => {
    const next = new Set(revealedPuzzles);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setRevealedPuzzles(next);
  };

  // Toggle puzzle hint
  const togglePuzzleHint = (id) => {
    const next = new Set(puzzleHints);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setPuzzleHints(next);
  };

  // Toggle Finance concepts done via local storage progress namespaces
  const [financeProgress, setFinanceProgress] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('placement_os_gs_finance') || '[]'));
    } catch(e) {
      return new Set();
    }
  });

  const toggleFinanceConcept = (conceptId) => {
    const next = new Set(financeProgress);
    if (next.has(conceptId)) next.delete(conceptId);
    else next.add(conceptId);
    localStorage.setItem('placement_os_gs_finance', JSON.stringify([...next]));
    setFinanceProgress(next);
    window.dispatchEvent(new Event('progress_change_event'));
    addToast('Finance concept status updated!', 'success');
  };

  return (
    <div className="profile-view-container">
      <div className="view-header">
        <div>
          <h2>Profile & Interview Arsenal</h2>
          <p className="subtitle">ATS Resume check, LinkedIn/GitHub optimization trackers, and Goldman Sachs preparation hub.</p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="sd-tabs-nav">
        <button className={`sd-tab-btn ${activeTab === 'resume' ? 'active' : ''}`} onClick={() => setActiveTab('resume')}>📄 ATS Resume Auditor</button>
        <button className={`sd-tab-btn ${activeTab === 'linkedin' ? 'active' : ''}`} onClick={() => setActiveTab('linkedin')}>🔗 LinkedIn Branding</button>
        <button className={`sd-tab-btn ${activeTab === 'github' ? 'active' : ''}`} onClick={() => setActiveTab('github')}>💻 GitHub Showcase</button>
        <button className={`sd-tab-btn ${activeTab === 'star' ? 'active' : ''}`} onClick={() => setActiveTab('star')}>🌟 STAR Bank & Puzzles</button>
      </div>

      {/* RESUME AUDIT TAB */}
      {activeTab === 'resume' && (
        <div className="sd-tab-content">
          <div className="profile-grid">
            <div className="card checklist-card">
              <h3>Resume Quality Audit Checklist</h3>
              <p className="description">Audit your current PDF resume against standard ATS rules and KIIT placement norms.</p>
              
              <div className="checklist-list">
                <label className="profile-checkbox-row">
                  <input 
                    type="checkbox" 
                    checked={profileData.resume.gsFinalist || false} 
                    onChange={() => handleCheckboxChange('resume', 'gsFinalist')}
                  />
                  <div>
                    <strong>GS Finalist status prominently highlighted</strong>
                    <span className="info-sub text-gold">Must be under Honors/Achievements or top summary.</span>
                  </div>
                </label>

                <label className="profile-checkbox-row">
                  <input 
                    type="checkbox" 
                    checked={profileData.resume.quantifiedImpact || false} 
                    onChange={() => handleCheckboxChange('resume', 'quantifiedImpact')}
                  />
                  <div>
                    <strong>Quantified impact on every work/project experience</strong>
                    <span className="info-sub">e.g., 'Reduced machine delay by 14%', 'Achieved 98% accuracy'.</span>
                  </div>
                </label>

                <label className="profile-checkbox-row">
                  <input 
                    type="checkbox" 
                    checked={profileData.resume.actionVerbs || false} 
                    onChange={() => handleCheckboxChange('resume', 'actionVerbs')}
                  />
                  <div>
                    <strong>Strong Action Verbs starting bullets</strong>
                    <span className="info-sub">Led, Engineered, Automated, Developed (Avoid: 'worked on', 'assisted').</span>
                  </div>
                </label>

                <label className="profile-checkbox-row">
                  <input 
                    type="checkbox" 
                    checked={profileData.resume.onePageMax || false} 
                    onChange={() => handleCheckboxChange('resume', 'onePageMax')}
                  />
                  <div>
                    <strong>Strictly one page limit</strong>
                    <span className="info-sub">No margins spill-over or half-filled pages.</span>
                  </div>
                </label>

                <label className="profile-checkbox-row">
                  <input 
                    type="checkbox" 
                    checked={profileData.resume.atsFriendly || false} 
                    onChange={() => handleCheckboxChange('resume', 'atsFriendly')}
                  />
                  <div>
                    <strong>ATS-friendly layout & typography</strong>
                    <span className="info-sub">Single column, standard font sizes, no tables, icons or text-boxes.</span>
                  </div>
                </label>

                <label className="profile-checkbox-row">
                  <input 
                    type="checkbox" 
                    checked={profileData.resume.resumeWorded || false} 
                    onChange={() => handleCheckboxChange('resume', 'resumeWorded')}
                  />
                  <div>
                    <strong>Resume Score &gt; 80 on ResumeWorded</strong>
                    <span className="info-sub">Run free audit check to scan for keyword density.</span>
                  </div>
                </label>

                <label className="profile-checkbox-row">
                  <input 
                    type="checkbox" 
                    checked={profileData.resume.customSummary || false} 
                    onChange={() => handleCheckboxChange('resume', 'customSummary')}
                  />
                  <div>
                    <strong>Custom resume variants created per Tier</strong>
                    <span className="info-sub">Tailor keywords for core Software Engineer roles (Tier 0) vs ML roles.</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="card guide-card">
              <h3>KIIT Resume Writing Guidelines</h3>
              <div className="guideline-block">
                <span className="g-badge badge-p0">P0 Rule</span>
                <h4>Quantifying Metrics Formula</h4>
                <p className="code-formula">Accomplished [X] as measured by [Y], by doing [Z]</p>
                <p className="example-text"><strong>Example:</strong> Improved classification speed by 40% as benchmarked against traditional KNN by optimizing PyTorch custom dataloaders.</p>
              </div>

              <div className="guideline-block">
                <span className="g-badge badge-p1">P1 Rule</span>
                <h4>Star Achievements Highlight</h4>
                <p className="example-text">Add the following line under achievements: <em>"National Finalist (Top 0.5% out of 20,000+ teams) in Goldman Sachs AI Hackathon."</em></p>
              </div>

              <div className="guideline-block">
                <span className="g-badge badge-p2">ATS Alert</span>
                <h4>Keywords to Include</h4>
                <div className="keywords-flex">
                  <span>FastAPI</span><span>LangChain</span><span>PyTorch</span><span>SOLID Principles</span><span>Consistent Hashing</span><span>Redis Caching</span><span>Cassandra DB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LINKEDIN TAB */}
      {activeTab === 'linkedin' && (
        <div className="sd-tab-content">
          <div className="profile-grid">
            <div className="card checklist-card">
              <h3>LinkedIn Branding Audit</h3>
              
              <div className="connections-input-row">
                <div>
                  <label>Current Connections Count</label>
                  <input 
                    type="number" 
                    value={profileData.linkedin.connectionsCount || ''} 
                    onChange={(e) => handleInputChange('linkedin', 'connectionsCount', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="prog-pill">
                  {profileData.linkedin.connectionsCount >= 500 ? '🟢 500+ achieved' : `🟡 Need ${500 - (profileData.linkedin.connectionsCount || 0)} more`}
                </div>
              </div>

              <div className="checklist-list" style={{ marginTop: '20px' }}>
                <label className="profile-checkbox-row">
                  <input 
                    type="checkbox" 
                    checked={profileData.linkedin.headline || false} 
                    onChange={() => handleCheckboxChange('linkedin', 'headline')}
                  />
                  <div>
                    <strong>Headline optimized with formula</strong>
                    <span className="info-sub text-gold">"Data Science & ML | GS Hackathon National Finalist | KIIT 2027"</span>
                  </div>
                </label>

                <label className="profile-checkbox-row">
                  <input 
                    type="checkbox" 
                    checked={profileData.linkedin.photo || false} 
                    onChange={() => handleCheckboxChange('linkedin', 'photo')}
                  />
                  <div>
                    <strong>Professional high-quality profile photo & background banner</strong>
                    <span className="info-sub">Clean professional lighting, solid background, coding-related banner.</span>
                  </div>
                </label>

                <label className="profile-checkbox-row">
                  <input 
                    type="checkbox" 
                    checked={profileData.linkedin.featuredSection || false} 
                    onChange={() => handleCheckboxChange('linkedin', 'featuredSection')}
                  />
                  <div>
                    <strong>Featured section set up with top projects</strong>
                    <span className="info-sub">Link to deployed ResumeIQ and TSDPL dashboards, and hackathon certificates.</span>
                  </div>
                </label>

                <label className="profile-checkbox-row">
                  <input 
                    type="checkbox" 
                    checked={profileData.linkedin.postsWeekly || false} 
                    onChange={() => handleCheckboxChange('linkedin', 'postsWeekly')}
                  />
                  <div>
                    <strong>Active post consistency (2 posts / week)</strong>
                    <span className="info-sub">Share code snippets, tech insights or learning logs weekly.</span>
                  </div>
                </label>

                <label className="profile-checkbox-row">
                  <input 
                    type="checkbox" 
                    checked={profileData.linkedin.skillsEndorsed || false} 
                    onChange={() => handleCheckboxChange('linkedin', 'skillsEndorsed')}
                  />
                  <div>
                    <strong>Core skills endorsed (Python, ML, React, FastAPI)</strong>
                    <span className="info-sub">Ask batchmates or project team partners to endorse your skill set.</span>
                  </div>
                </label>

                <label className="profile-checkbox-row">
                  <input 
                    type="checkbox" 
                    checked={profileData.linkedin.recommendations || false} 
                    onChange={() => handleCheckboxChange('linkedin', 'recommendations')}
                  />
                  <div>
                    <strong>Have 2+ professional recommendations</strong>
                    <span className="info-sub">Request references from college mentors or former internship leads.</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="card guide-card">
              <h3>Post & Network Tracker</h3>
              <p className="description">Schedule and log your professional updates to build industry visibility.</p>
              
              <div className="posting-idea-box">
                <h4>Suggested Post Formats</h4>
                <ul>
                  <li>💡 <strong>Project Spotlight:</strong> Brief Loom demo of ResumeIQ explaining FastAPI + RAG backend structure.</li>
                  <li>🏆 <strong>Hackathon Retrospective:</strong> Key lessons, scaling trade-offs, and algorithms used in the GS Hackathon.</li>
                  <li>✍️ <strong>DSA Learnings:</strong> Solving a hard LeetCode problem using a unique sliding window approach.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GITHUB TAB */}
      {activeTab === 'github' && (
        <div className="sd-tab-content">
          <div className="profile-grid">
            <div className="card checklist-card">
              <h3>GitHub Showcase Audit</h3>
              <div className="connections-input-row" style={{ gap: '15px' }}>
                <div>
                  <label>Commit Streak (Days)</label>
                  <input 
                    type="number" 
                    value={profileData.github.commitStreakCount || ''} 
                    onChange={(e) => handleInputChange('github', 'commitStreakCount', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label>Repository Quality Score</label>
                  <input 
                    type="number" 
                    max="10" 
                    min="0"
                    value={profileData.github.qualityScore || ''} 
                    onChange={(e) => handleInputChange('github', 'qualityScore', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="checklist-list" style={{ marginTop: '20px' }}>
                <label className="profile-checkbox-row">
                  <input 
                    type="checkbox" 
                    checked={profileData.github.reposPinned || false} 
                    onChange={() => handleCheckboxChange('github', 'reposPinned')}
                  />
                  <div>
                    <strong>Best projects pinned prominently</strong>
                    <span className="info-sub">Pin ResumeIQ, TSDPL Delay breakdown, EV battery thermal forecasting.</span>
                  </div>
                </label>

                <label className="profile-checkbox-row">
                  <input 
                    type="checkbox" 
                    checked={profileData.github.readmesPolished || false} 
                    onChange={() => handleCheckboxChange('github', 'readmesPolished')}
                  />
                  <div>
                    <strong>Comprehensive READMEs with architecture diagrams</strong>
                    <span className="info-sub">Include screenshots, quickstart guides, backend API structures.</span>
                  </div>
                </label>

                <label className="profile-checkbox-row">
                  <input 
                    type="checkbox" 
                    checked={profileData.github.deployed || false} 
                    onChange={() => handleCheckboxChange('github', 'deployed')}
                  />
                  <div>
                    <strong>Deployed live URLs attached to repository summaries</strong>
                    <span className="info-sub">Vercel, Streamlit Cloud, or Render badges clearly visible.</span>
                  </div>
                </label>

                <label className="profile-checkbox-row">
                  <input 
                    type="checkbox" 
                    checked={profileData.github.noEmptyRepos || false} 
                    onChange={() => handleCheckboxChange('github', 'noEmptyRepos')}
                  />
                  <div>
                    <strong>No empty or placeholder repos</strong>
                    <span className="info-sub">Clean up fork clones that are untouched, or private templates.</span>
                  </div>
                </label>

                <label className="profile-checkbox-row">
                  <input 
                    type="checkbox" 
                    checked={profileData.github.commitStreak || false} 
                    onChange={() => handleCheckboxChange('github', 'commitStreak')}
                  />
                  <div>
                    <strong>Active contribution graph</strong>
                    <span className="info-sub">Maintain daily green commit streaks. Commits should match meaningful updates.</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="card guide-card">
              <h3>Repository Showcase Guidelines</h3>
              <p>KIIT placement cell scans GitHub profiles for target tech companies. Your repo must look like production software:</p>
              
              <div className="repo-audit-tips">
                <div className="tip-item">
                  <strong>💡 Setup configs:</strong> Always commit clean `.gitignore`, `requirements.txt` / `package.json`, and clear setup instructions.
                </div>
                <div className="tip-item">
                  <strong>🎨 Visual proof:</strong> READMEs must have GIFs or embedded PNG images demonstrating how the application works.
                </div>
                <div className="tip-item">
                  <strong>🧱 Modular code:</strong> Move python scripts out of raw notebooks. Group them inside `src/` packages to show clean design skills.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAR BANK & PUZZLES (GOLDMAN SACHS PREP HUB) */}
      {activeTab === 'star' && (
        <div className="sd-tab-content star-bank-view">
          {/* Goldman Sachs Interview Prep Section */}
          <div className="gs-prep-banner">
            <h3>⭐ GOLDMAN SACHS INTERVIEW HUB</h3>
            <p>Your National Finalist rank is locked. Follow this plan to absolute victory. Practice financial concepts, behavioral queries, and probability logic puzzles.</p>
          </div>

          <div className="gs-prep-sections-grid">
            {/* GS Puzzles Vault */}
            <div className="card puzzles-vault-card">
              <h3>GS Probability & Logic Puzzles</h3>
              <p className="description">Most common puzzles asked during GS technical rounds.</p>
              
              <div className="puzzles-list">
                {gsPuzzles.map((puz) => {
                  const isRevealed = revealedPuzzles.has(puz.id);
                  const isHintRevealed = puzzleHints.has(puz.id);
                  return (
                    <div key={puz.id} className="puzzle-item">
                      <div className="puz-header">
                        <span className={`puz-category ${puz.category}`}>{puz.category}</span>
                        <span className={`puz-difficulty ${puz.difficulty}`}>{puz.difficulty}</span>
                      </div>
                      <h4>{puz.title}</h4>
                      
                      <div className="puz-actions">
                        <button className="puz-btn hint" onClick={() => togglePuzzleHint(puz.id)}>
                          {isHintRevealed ? 'Hide Hint' : '💡 Reveal Hint'}
                        </button>
                        <button className="puz-btn solution" onClick={() => togglePuzzleSolution(puz.id)}>
                          {isRevealed ? 'Hide Solution' : '🔑 Reveal Solution'}
                        </button>
                      </div>

                      {isHintRevealed && <p className="puzzle-hint"><strong>Hint:</strong> {puz.hint}</p>}
                      {isRevealed && <div className="puzzle-solution"><strong>Solution:</strong> {puz.solution}</div>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* GS Finance & Behavior Vault */}
            <div className="gs-behavioral-finance-col">
              {/* Finance basics check */}
              <div className="card finance-basics-card">
                <h3>Finance Basics Check</h3>
                <p className="description">Concepts checked in GS quantitative/analyst interviews.</p>
                <div className="finance-checklist">
                  {gsFinanceBasics.map((fin) => {
                    const isCompleted = financeProgress.has(fin.id);
                    return (
                      <div key={fin.id} className="finance-check-row">
                        <label className="checkbox-container">
                          <input 
                            type="checkbox" 
                            checked={isCompleted} 
                            onChange={() => toggleFinanceConcept(fin.id)} 
                          />
                          <span className="checkmark"></span>
                        </label>
                        <div className="fin-info">
                          <strong>{fin.concept}</strong>
                          <p>{fin.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* STAR Answer Bank */}
              <div className="card star-questions-card">
                <h3>Behavioral STAR Bank</h3>
                <p className="description">Fill out custom Situation, Task, Action, Result answers matching GS competencies.</p>
                
                <div className="star-list">
                  {gsSTARQuestions.map((q) => {
                    const savedState = profileData.starBank[q.id] || {};
                    return (
                      <div key={q.id} className="star-question-block">
                        <h4>{q.question}</h4>
                        
                        <div className="star-row">
                          <label>Situation</label>
                          <textarea 
                            value={savedState.situation ?? q.prefill.situation}
                            onChange={(e) => handleStarChange(q.id, 'situation', e.target.value)}
                          />
                        </div>

                        <div className="star-row">
                          <label>Task</label>
                          <textarea 
                            value={savedState.task ?? q.prefill.task}
                            onChange={(e) => handleStarChange(q.id, 'task', e.target.value)}
                          />
                        </div>

                        <div className="star-row">
                          <label>Action</label>
                          <textarea 
                            value={savedState.action ?? q.prefill.action}
                            onChange={(e) => handleStarChange(q.id, 'action', e.target.value)}
                          />
                        </div>

                        <div className="star-row">
                          <label>Result</label>
                          <textarea 
                            value={savedState.result ?? q.prefill.result}
                            onChange={(e) => handleStarChange(q.id, 'result', e.target.value)}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Resources & Patterns */}
              <div className="card gs-extra-info-card">
                <h3>GS Interview Patterns & Resources</h3>
                
                <div className="resources-section-block">
                  <h4>Common DSA Topics Asked</h4>
                  <div className="dsa-patterns-list">
                    {gsInterviewPatterns.map((pat, i) => (
                      <div key={i} className="pattern-desc-item">
                        <strong>{pat.topic}:</strong> {pat.reason}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="resources-section-block" style={{ marginTop: '20px' }}>
                  <h4>Reference Links</h4>
                  <div className="ref-list">
                    {gsResources.map((res, i) => (
                      <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="gs-ref-link">
                        🔗 {res.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
