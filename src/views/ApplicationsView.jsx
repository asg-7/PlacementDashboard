import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

export default function ApplicationsView({ state, mutateState, addToast }) {
  const [filter, setFilter] = useState('all');
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const s = state;
  const statuses = ['not applied', 'applied', 'under review', 'OA received', 'interview', 'accepted', 'rejected'];
  
  const counts = {};
  statuses.forEach(st => { counts[st] = s.companies.filter(c => c.status === st).length; });

  const appSent = s.companies.filter(c => c.status !== 'not applied').length;
  const underReview = (counts['under review'] || 0) + (counts['OA received'] || 0) + (counts['interview'] || 0);
  const accepted = counts['accepted'] || 0;
  const rejected = counts['rejected'] || 0;
  const responseRate = appSent > 0 ? Math.round((underReview + accepted + rejected) / appSent * 100) : 0;

  // Filtered list
  const filteredCompanies = s.companies.filter(c => filter === 'all' || c.status === filter);

  const handleUpdateStatus = (id, newStatus) => {
    mutateState(draft => {
      const c = draft.companies.find(x => x.id === id);
      if (c) c.status = newStatus;
    });
    addToast('Status updated ✓');
  };

  const handleAddCompanyShortcut = () => {
    // Navigate to companies tab to add a company, or trigger a modal
    // For simplicity, we can let them add in the companies tab, or we can add it here.
    addToast('Go to Companies view to add targets', 'var(--electric)');
  };

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if (canvasRef.current) {
      const countsArr = statuses.map(st => s.companies.filter(c => c.status === st).length);
      const colors = ['#445570', '#00E5FF', '#FFB800', '#FFB800', '#B04AFF', '#ADFF2F', '#FF4757'];

      chartInstanceRef.current = new Chart(canvasRef.current, {
        type: 'doughnut',
        data: {
          labels: statuses,
          datasets: [{
            data: countsArr,
            backgroundColor: colors,
            borderColor: '#0C1220',
            borderWidth: 3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          cutout: '68%'
        }
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [s.companies]);

  return (
    <div style={{ animation: 'fade-in 0.4s ease-out' }}>
      <div className="ph">
        <div>
          <div className="ph-eyebrow">Pipeline Tracker</div>
          <div className="ph-title">Applications</div>
          <div className="ph-sub">Across {s.companies.length} target companies</div>
        </div>
        <button className="btn btn-primary" onClick={handleAddCompanyShortcut}>+ Add Company</button>
      </div>

      <div className="g4" style={{ marginBottom: '20px' }}>
        <div className="metric">
          <div className="metric-val" style={{ color: 'var(--electric)' }}>{appSent}</div>
          <div className="metric-lbl">Sent</div>
          <div className="metric-sub">{s.companies.length} targets</div>
        </div>
        <div className="metric">
          <div className="metric-val" style={{ color: 'var(--amber)' }}>{underReview}</div>
          <div className="metric-lbl">In Review</div>
          <div className="metric-sub">OA / interview queue</div>
        </div>
        <div className="metric">
          <div className="metric-val" style={{ color: 'var(--volt)' }}>{accepted}</div>
          <div className="metric-lbl">Accepted</div>
          <div className="metric-sub">Offers received</div>
        </div>
        <div className="metric">
          <div className="metric-val" style={{ color: 'var(--violet)' }}>{responseRate}%</div>
          <div className="metric-lbl">Response Rate</div>
          <div className="metric-sub">Of applications sent</div>
        </div>
      </div>

      <div className="g2">
        <div className="card">
          <div className="card-hdr"><div class="card-title">Pipeline Breakdown</div></div>
          <div style={{ position: 'relative', height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <canvas ref={canvasRef}></canvas>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px', justifyContent: 'center' }}>
            {[
              ['Not applied', '#445570'], ['Applied', 'var(--electric)'], ['Under review', 'var(--amber)'],
              ['OA received', 'var(--amber)'], ['Interview', 'var(--violet)'], ['Accepted', 'var(--volt)'], ['Rejected', 'var(--coral)']
            ].map(([lbl, clr], i) => (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} key={i}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: clr }}></div>
                <span style={{ fontSize: '10px', color: 'var(--t2)', fontFamily: 'var(--mono)' }}>{lbl}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-hdr">
            <div><div className="card-title">Status Tracker</div></div>
            <select style={{ width: '160px' }} value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All statuses</option>
              {statuses.map(st => (
                <option value={st} key={st}>{st}</option>
              ))}
            </select>
          </div>
          <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
            {filteredCompanies.length === 0 ? (
              <div className="note-box" style={{ textAlign: 'center', padding: '20px' }}>
                No applications matching this filter.
              </div>
            ) : (
              filteredCompanies.map(c => (
                <div className="dl-row" key={c.id}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--t1)' }}>{c.companyName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--t3)', fontFamily: 'var(--mono)' }}>{c.role} · {c.ctc}</div>
                  </div>
                  <select className="ss" value={c.status} onChange={(e) => handleUpdateStatus(c.id, e.target.value)}>
                    {statuses.map(st => (
                      <option value={st} key={st}>{st}</option>
                    ))}
                  </select>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
