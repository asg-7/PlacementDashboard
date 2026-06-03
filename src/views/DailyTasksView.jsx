import React, { useState, useEffect } from 'react';
import { useProgress } from '../hooks/useProgress';
import { striverTopics } from '../data/striverSheet';

export default function DailyTasksView({ state, mutateState, addToast }) {
  const s = state;

  // hooks for tracking progress
  const { done: striverDone, toggle: toggleStriver } = useProgress('striver_a2z');
  const { done: dailyAppsDone, toggle: toggleDailyApp } = useProgress('daily_applications');

  // Find today's weekday for Pillar 4
  const today = new Date();
  const dayIndex = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
  const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayIndex];
  
  // Weekly application task list
  const dailyAppTasks = [
    { day: 'Sunday', task: 'Plan next week\'s target companies, research 2-3 companies you\'re excited about.' },
    { day: 'Monday', task: 'Apply to 20 companies (LinkedIn Easy Apply + Naukri).' },
    { day: 'Tuesday', task: 'Apply to 10 companies + check application statuses.' },
    { day: 'Wednesday', task: 'Apply to 10 companies + follow up on pending OAs.' },
    { day: 'Thursday', task: 'Apply to 10 startups on Wellfound + 10 on LinkedIn.' },
    { day: 'Friday', task: 'Apply to 10 companies + update Dashboard status.' },
    { day: 'Saturday', task: 'Weekly review: update all statuses in dashboard, check new openings.' }
  ];
  
  const todayAppTask = dailyAppTasks[dayIndex];

  // Pillar 1: Find first unsolved DSA problem from Striver's sheet
  let recommendedProblem = null;
  for (const topic of striverTopics) {
    const unsolved = topic.problems.find(p => !striverDone.has(p.id));
    if (unsolved) {
      recommendedProblem = { ...unsolved, topicTitle: topic.title };
      break;
    }
  }

  // Pillar 2: Find first incomplete certification
  const incompleteCert = (s.certifications || []).find(c => c.progress < 100);

  // Pillar 3: Get recommended YouTube resource based on current weekday / focus
  // We can select one of the youtubeResources from seed state
  const ytResources = s.youtubeResources || [];
  const recommendedYt = ytResources[(dayIndex * 2) % ytResources.length] || ytResources[0];

  const handleUpdateCertProgress = (certId, val) => {
    mutateState(draft => {
      const c = draft.certifications.find(x => x.id === certId);
      if (c) {
        c.progress = Number(val);
        if (c.progress >= 100) {
          c.status = 'completed';
        } else if (c.progress > 0) {
          c.status = 'in progress';
        } else {
          c.status = 'not started';
        }
      }
    });
    addToast('Certification progress updated ✓');
  };

  return (
    <div style={{ animation: 'fade-in 0.4s ease-out' }}>
      
      {/* PAGE HEADER */}
      <div className="ph" style={{ marginBottom: '24px' }}>
        <div>
          <div className="ph-eyebrow">Daily Routines · {dayName}</div>
          <div className="ph-title">Daily Execution Cockpit</div>
          <div className="ph-sub">Your non-negotiable 4-pillar schedule. Complete before 10 PM.</div>
        </div>
      </div>

      {/* CGPA REMINDER NOTE */}
      <div className="card" style={{ background: 'var(--amber-dim)', border: '1px solid rgba(255, 184, 0, 0.25)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ fontSize: '24px' }}>⚡</div>
        <div>
          <div style={{ fontWeight: 700, color: 'var(--amber)', fontSize: '13px', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            KIIT 2026 Candidate CGPA Reframe
          </div>
          <div style={{ fontSize: '12px', color: 'var(--t1)', marginTop: '2px', lineHeight: 1.4 }}>
            Your CGPA is <strong>6.8</strong> — Eligible for TCS, Infosys, HCLTech, Cognizant, Accenture.
            Compensate for higher-tier filters with: <strong>3+ live project deployments</strong> • <strong>3+ hackathon team submissions</strong> • <strong>IBM/Google certifications</strong>.
          </div>
        </div>
      </div>

      {/* 4 PILLARS GRID */}
      <div className="g2" style={{ gap: '20px', marginBottom: '24px' }}>
        
        {/* PILLAR 1: DSA */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', borderLeft: '4px solid var(--electric)' }}>
          <div className="card-hdr" style={{ marginBottom: '14px' }}>
            <div>
              <div className="card-title" style={{ color: 'var(--electric)' }}>Pillar 1</div>
              <div className="card-label" style={{ fontSize: '15px' }}>DSA Routine</div>
            </div>
            <span className="badge b-cyan" style={{ fontSize: '8px' }}>45-60 min</span>
          </div>

          {recommendedProblem ? (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ marginBottom: '10px' }}>
                <span className="topic-tag" style={{ fontSize: '8px', marginBottom: '4px', display: 'inline-block' }}>
                  {recommendedProblem.topicTitle}
                </span>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--t1)', marginBottom: '6px' }}>
                  {recommendedProblem.title}
                </h4>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span className={`badge ${recommendedProblem.difficulty === 'easy' ? 'b-green' : recommendedProblem.difficulty === 'medium' ? 'b-amber' : 'b-red'}`} style={{ fontSize: '8px' }}>
                    {recommendedProblem.difficulty}
                  </span>
                  {recommendedProblem.patterns && recommendedProblem.patterns.map(pat => (
                    <span key={pat} className="badge b-gray" style={{ fontSize: '8px', textTransform: 'lowercase' }}>#{pat}</span>
                  ))}
                </div>
              </div>

              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '10px 12px', fontSize: '12px', color: 'var(--t2)', lineHeight: 1.5, marginBottom: '16px', flex: 1 }}>
                <strong>Approach Tip:</strong> {recommendedProblem.approach || 'Think about optimal data structures and time complexity bounds.'}
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                {recommendedProblem.link && (
                  <a href={recommendedProblem.link} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-xs" style={{ flex: 1, padding: '8px 12px', justifyContent: 'center' }}>
                    Solve on Platform ↗
                  </a>
                )}
                <button
                  className="btn btn-primary btn-xs"
                  onClick={() => {
                    toggleStriver(recommendedProblem.id);
                    addToast(`Solved: ${recommendedProblem.title}!`);
                  }}
                  style={{ flex: 1, padding: '8px 12px', justifyContent: 'center' }}
                >
                  Mark as Solved ✓
                </button>
              </div>
            </div>
          ) : (
            <div className="note-box" style={{ textAlign: 'center', padding: '20px', margin: 'auto' }}>
              🎉 Incredible! You've completed all problems in the Striver sheet!
            </div>
          )}
        </div>

        {/* PILLAR 2: CERTIFICATIONS & PROJECTS */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', borderLeft: '4px solid var(--volt)' }}>
          <div className="card-hdr" style={{ marginBottom: '14px' }}>
            <div>
              <div className="card-title" style={{ color: 'var(--volt)' }}>Pillar 2</div>
              <div className="card-label" style={{ fontSize: '15px' }}>Certs & Projects</div>
            </div>
            <span className="badge b-green" style={{ fontSize: '8px' }}>60-90 min</span>
          </div>

          {incompleteCert ? (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ marginBottom: '14px' }}>
                <span className="badge b-blue" style={{ fontSize: '8px', marginBottom: '4px', display: 'inline-block' }}>
                  Target Certification
                </span>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--t1)', marginBottom: '4px' }}>
                  {incompleteCert.name}
                </h4>
                <div style={{ fontSize: '11px', color: 'var(--t3)', fontFamily: 'var(--mono)' }}>
                  Provider: {incompleteCert.provider} · Deadline: {incompleteCert.deadline}
                </div>
              </div>

              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '12px 14px', marginBottom: '16px', flex: 1 }}>
                <label style={{ fontSize: '9px', color: 'var(--t3)', marginBottom: '8px' }}>
                  Update Progress: {incompleteCert.progress}%
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={incompleteCert.progress}
                    onChange={(e) => handleUpdateCertProgress(incompleteCert.id, e.target.value)}
                    style={{ flex: 1, padding: 0, height: '4px', cursor: 'pointer' }}
                  />
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--t2)', fontWeight: 700, width: '35px', textAlign: 'right' }}>
                    {incompleteCert.progress}%
                  </span>
                </div>
              </div>

              <button
                className="btn btn-ghost btn-xs"
                onClick={() => {
                  handleUpdateCertProgress(incompleteCert.id, 100);
                  addToast(`Completed: ${incompleteCert.name}!`);
                }}
                style={{ width: '100%', padding: '8px 12px', justifyContent: 'center', marginTop: 'auto' }}
              >
                Complete Certificate (100%) ✓
              </button>
            </div>
          ) : (
            <div className="note-box" style={{ textAlign: 'center', padding: '20px', margin: 'auto' }}>
              🏆 All certifications completed! Focus entirely on portfolio project deployments.
            </div>
          )}
        </div>

        {/* PILLAR 3: YOUTUBE FOCUSED LEARNING */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', borderLeft: '4px solid var(--violet)' }}>
          <div className="card-hdr" style={{ marginBottom: '14px' }}>
            <div>
              <div className="card-title" style={{ color: 'var(--violet)' }}>Pillar 3</div>
              <div className="card-label" style={{ fontSize: '15px' }}>Focused Video</div>
            </div>
            <span className="badge b-purple" style={{ fontSize: '8px' }}>30-45 min</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ marginBottom: '12px' }}>
              <span className="badge b-rose" style={{ fontSize: '8px', marginBottom: '4px', display: 'inline-block' }}>
                Recommended Playlist
              </span>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--t1)', marginBottom: '4px' }}>
                {recommendedYt.topic}
              </h4>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '2px' }}>
                <span className="badge b-gray" style={{ fontSize: '8px' }}>
                  Channel: {recommendedYt.channel}
                </span>
                <span className="badge b-purple" style={{ fontSize: '8px' }}>
                  Domain: {recommendedYt.skill}
                </span>
              </div>
            </div>

            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '10px 12px', fontSize: '12px', color: 'var(--t2)', lineHeight: 1.5, marginBottom: '16px', flex: 1 }}>
              <strong>Description:</strong> {recommendedYt.notes || 'Code along with this resource. Do not passively watch.'}
            </div>

            {recommendedYt.link && (
              <a
                href={recommendedYt.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-xs"
                style={{ width: '100%', padding: '8px 12px', justifyContent: 'center', marginTop: 'auto' }}
              >
                Watch Video on YouTube ↗
              </a>
            )}
          </div>
        </div>

        {/* PILLAR 4: APPLICATIONS TIMELINE */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', borderLeft: '4px solid var(--rose)' }}>
          <div className="card-hdr" style={{ marginBottom: '14px' }}>
            <div>
              <div className="card-title" style={{ color: 'var(--rose)' }}>Pillar 4</div>
              <div className="card-label" style={{ fontSize: '15px' }}>Applications Tracker</div>
            </div>
            <span className="badge b-rose" style={{ fontSize: '8px' }}>30-45 min</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ marginBottom: '12px' }}>
              <span className="badge b-amber" style={{ fontSize: '8px', marginBottom: '4px', display: 'inline-block' }}>
                Weekday Schedule: {dayName}
              </span>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--t1)', lineHeight: 1.4 }}>
                {todayAppTask.task}
              </p>
            </div>

            {/* Checkbox tracker for daily applications task */}
            <div
              className={`chk-item ${dailyAppsDone.has(todayAppTask.day) ? 'done' : ''}`}
              onClick={() => toggleDailyApp(todayAppTask.day)}
              style={{ padding: '12px', marginTop: 'auto', background: 'var(--bg3)' }}
            >
              <div className="chk-box">{dailyAppsDone.has(todayAppTask.day) ? '✓' : ''}</div>
              <span className="chk-lbl" style={{ fontSize: '12px' }}>
                Completed today's application task
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
