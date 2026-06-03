import React, { useState, useEffect } from 'react';
import { useProgress } from '../hooks/useProgress';
import { mlPhasesData, mlInterviewQA } from '../data/mlResources';
import PhaseTracker from '../components/ml/PhaseTracker';
import ResourceCard from '../components/ml/ResourceCard';

export default function MLRoadmap() {
  const [activePhaseId, setActivePhaseId] = useState(1);
  const { done: completedResources, toggle: toggleResource } = useProgress('ml_roadmap');
  
  // Q&A accordion states
  const [openQAIndex, setOpenQAIndex] = useState(null);

  const activePhase = mlPhasesData.find(p => p.id === activePhaseId) || mlPhasesData[0];

  const toggleQA = (idx) => {
    setOpenQAIndex(prev => (prev === idx ? null : idx));
  };

  // Calculate total ML roadmap progress
  const totalResources = mlPhasesData.reduce((sum, p) => sum + p.resources.length, 0);
  const totalCompleted = mlPhasesData.reduce((sum, p) => {
    return sum + p.resources.filter(r => completedResources.has(r.id)).length;
  }, 0);
  const overallPct = totalResources > 0 ? Math.round((totalCompleted / totalResources) * 100) : 0;

  return (
    <div style={{ animation: 'fade-in 0.4s ease-out' }}>
      {/* PAGE HEADER */}
      <div className="ph" style={{ marginBottom: '20px' }}>
        <div>
          <div className="ph-eyebrow">Interactive curriculum</div>
          <div className="ph-title">ML & AIML Roadmap</div>
          <div className="ph-sub">Master foundational mathematics, classical models, deep learning architectures, and engineering operations</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--t2)', fontWeight: 700, marginBottom: '4px' }}>
            Overall Curriculum Progress
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--electric)', fontFamily: 'var(--display)' }}>
              {overallPct}%
            </span>
            <div style={{ width: '120px' }}>
              <div className="pbar-lg">
                <div className="pfill" style={{ width: `${overallPct}%`, backgroundColor: 'var(--electric)' }}></div>
              </div>
            </div>
          </div>
          <span style={{ fontSize: '10px', color: 'var(--t3)', fontFamily: 'var(--mono)' }}>
            {totalCompleted} of {totalResources} items completed
          </span>
        </div>
      </div>

      {/* PHASE TRACKER LIST */}
      <PhaseTracker
        phases={mlPhasesData}
        activePhaseId={activePhaseId}
        completedMap={completedResources}
        onSelectPhase={setActivePhaseId}
      />

      {/* TWO COLUMN CONTENT SECTION */}
      <div className="g3" style={{ gap: '20px', alignItems: 'start' }}>
        {/* LEFT COLUMN: PHASE SUMMARY & RESOURCES (2/3 width) */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* SELECTED PHASE CARD */}
          <div className="card" style={{ borderLeft: '4px solid var(--electric)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
              <div>
                <span className="badge b-blue" style={{ fontSize: '9px', marginBottom: '6px' }}>
                  Active Module
                </span>
                <h2 style={{ fontFamily: 'var(--display)', fontSize: '20px', fontWeight: 800, color: 'var(--t1)' }}>
                  {activePhase.title}: {activePhase.subtitle}
                </h2>
              </div>
              {activePhase.milestone && (
                <div style={{ background: 'var(--volt-dim)', border: '1px solid rgba(173, 255, 47, 0.2)', padding: '6px 12px', borderRadius: 'var(--rs)' }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '8px', color: 'var(--volt)', textTransform: 'uppercase', display: 'block', letterSpacing: '1px', marginBottom: '2px' }}>
                    Milestone Goal
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--t1)', fontWeight: 600 }}>
                    🎯 {activePhase.milestone}
                  </span>
                </div>
              )}
            </div>
            <p style={{ fontSize: '13px', color: 'var(--t2)', lineHeight: 1.6 }}>
              {activePhase.description}
            </p>
          </div>

          {/* RESOURCES GRID */}
          <div>
            <h3 style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '14px' }}>
              Study Material & Deliverables ({activePhase.resources.length} items)
            </h3>
            <div className="g2" style={{ gap: '14px' }}>
              {activePhase.resources.map(res => (
                <ResourceCard
                  key={res.id}
                  resource={res}
                  isCompleted={completedResources.has(res.id)}
                  onToggle={() => toggleResource(res.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERVIEW PREP BANK (1/3 width) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ borderTop: '4px solid var(--violet)' }}>
            <div className="card-hdr" style={{ marginBottom: '12px' }}>
              <div>
                <div className="card-title" style={{ color: 'var(--violet)' }}>Placement Prep</div>
                <div className="card-label" style={{ fontSize: '15px' }}>ML Interview Q&A</div>
              </div>
              <span className="badge b-purple" style={{ fontSize: '8px' }}>
                Theory
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--t3)', lineHeight: 1.5, marginBottom: '16px' }}>
              Frequently asked interview questions on core ML theory, deep learning models, and system design patterns.
            </p>

            {/* QA ACCORDION */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {mlInterviewQA.map((qa, index) => {
                const isOpen = openQAIndex === index;
                return (
                  <div
                    key={index}
                    style={{
                      background: 'var(--bg3)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--rs)',
                      overflow: 'hidden',
                      transition: 'all 0.2s'
                    }}
                  >
                    <button
                      onClick={() => toggleQA(index)}
                      style={{
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        padding: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '10px',
                        alignItems: 'center'
                      }}
                    >
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--t1)', lineHeight: 1.4 }}>
                        {qa.question}
                      </span>
                      <span style={{ fontSize: '14px', color: isOpen ? 'var(--violet)' : 'var(--t3)', transition: 'transform 0.2s', transform: isOpen ? 'rotate(90deg)' : 'none' }}>
                        ❯
                      </span>
                    </button>
                    {isOpen && (
                      <div
                        style={{
                          padding: '12px',
                          borderTop: '1px solid var(--border)',
                          fontSize: '12px',
                          color: 'var(--t2)',
                          lineHeight: 1.6,
                          background: 'rgba(0,0,0,0.15)',
                          animation: 'fade-in 0.2s ease-out'
                        }}
                      >
                        {qa.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
