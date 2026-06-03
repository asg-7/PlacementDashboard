import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

export default function ApplicationsView({ state, mutateState, addToast }) {
  const [filter, setFilter] = useState('all');
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Internship modal state
  const [editingInternship, setEditingInternship] = useState(null); // null or {} for edit/add

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
  
  // Internships list
  const internships = s.internships || [];

  const handleUpdateStatus = (id, newStatus) => {
    mutateState(draft => {
      const c = draft.companies.find(x => x.id === id);
      if (c) c.status = newStatus;
    });
    addToast('Status updated ✓');
  };

  // Internship Handlers
  const handleUpdateInternshipStatus = (id, newStatus) => {
    mutateState(draft => {
      const intern = draft.internships.find(x => x.id === id);
      if (intern) intern.status = newStatus;
    });
    addToast('Internship status updated ✓');
  };

  const handleDeleteInternship = (id) => {
    if (!window.confirm('Delete this internship record?')) return;
    mutateState(draft => {
      draft.internships = (draft.internships || []).filter(x => x.id !== id);
    });
    addToast('Internship record removed', 'var(--coral)');
  };

  const handleSaveInternship = (e) => {
    e.preventDefault();
    const form = e.target;
    const company = form.companyName.value.trim();
    const role = form.role.value.trim();
    const platform = form.platform.value.trim();
    const appliedDate = form.appliedDate.value;
    const status = form.status.value;
    const stipend = form.stipend.value.trim();
    const notes = form.notes.value.trim();

    mutateState(draft => {
      if (!draft.internships) draft.internships = [];
      const obj = { companyName: company, role, platform, appliedDate, status, stipend, notes };
      
      if (editingInternship.id) {
        const target = draft.internships.find(x => x.id === editingInternship.id);
        if (target) Object.assign(target, obj);
      } else {
        const newId = '_' + Math.random().toString(36).substr(2, 9);
        draft.internships.push({ id: newId, ...obj });
      }
    });

    setEditingInternship(null);
    addToast('Internship saved ✓');
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
      
      {/* PAGE HEADER */}
      <div className="ph">
        <div>
          <div className="ph-eyebrow">Pipeline Tracker</div>
          <div className="ph-title">Applications</div>
          <div className="ph-sub">Across {s.companies.length} target companies</div>
        </div>
      </div>

      {/* METRIC STRIP */}
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

      {/* CHARTS AND LIST SECTION */}
      <div className="g2" style={{ marginBottom: '24px' }}>
        <div className="card">
          <div className="card-hdr"><div className="card-title">Pipeline Breakdown</div></div>
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
          <div style={{ maxHeight: '330px', overflowY: 'auto' }}>
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

      {/* INTERNSHIP FALLBACK PIPELINE SECTION */}
      <div className="card" style={{ borderLeft: '4px solid var(--amber)' }}>
        <div className="card-hdr" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <div className="card-title" style={{ color: 'var(--amber)' }}>Parallel Track (Fallback Plan)</div>
            <div className="card-label" style={{ fontSize: '16px' }}>Internships Pipeline</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setEditingInternship({})}>+ Add Internship</button>
        </div>

        {internships.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🎒</div>
            <div className="empty-msg">No internships logged yet. Build fallbacks for volume safety.</div>
          </div>
        ) : (
          <div className="tw">
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Platform</th>
                  <th>Applied Date</th>
                  <th>Stipend</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {internships.map(intern => (
                  <tr key={intern.id}>
                    <td><strong>{intern.companyName}</strong></td>
                    <td>{intern.role}</td>
                    <td><span className="badge b-blue" style={{ fontSize: '8px' }}>{intern.platform}</span></td>
                    <td><div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--t3)' }}>{intern.appliedDate}</div></td>
                    <td><span style={{ color: 'var(--volt)', fontWeight: 700, fontFamily: 'var(--mono)', fontSize: '11px' }}>{intern.stipend || '—'}</span></td>
                    <td>
                      <select className="ss" style={{ minWidth: '100px' }} value={intern.status} onChange={(e) => handleUpdateInternshipStatus(intern.id, e.target.value)}>
                        {statuses.map(st => (
                          <option value={st} key={st}>{st}</option>
                        ))}
                      </select>
                    </td>
                    <td><div style={{ fontSize: '11px', color: 'var(--t3)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={intern.notes}>{intern.notes || '—'}</div></td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button className="btn btn-ghost btn-xs" onClick={() => setEditingInternship(intern)}>Edit</button>
                        <button className="btn btn-danger btn-xs" onClick={() => handleDeleteInternship(intern.id)}>Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* INTERNSHIP EDIT / ADD MODAL */}
      {editingInternship !== null && (
        <div className="moverlay" onClick={() => setEditingInternship(null)}>
          <div className="mbox" onClick={(e) => e.stopPropagation()}>
            <div className="mtitle">
              {editingInternship.id ? 'Edit Internship Record' : 'Add Internship Record'}
              <button className="mclose" onClick={() => setEditingInternship(null)}>×</button>
            </div>
            <form onSubmit={handleSaveInternship} className="modal-scroll">
              <div className="fr">
                <div className="fg">
                  <label>Company Name</label>
                  <input name="companyName" defaultValue={editingInternship.companyName || ''} required />
                </div>
                <div className="fg">
                  <label>Role</label>
                  <input name="role" defaultValue={editingInternship.role || ''} placeholder="e.g. AI Intern" required />
                </div>
              </div>
              <div className="fr">
                <div className="fg">
                  <label>Platform</label>
                  <input name="platform" defaultValue={editingInternship.platform || ''} placeholder="e.g. Internshala, LinkedIn" />
                </div>
                <div className="fg">
                  <label>Applied Date</label>
                  <input name="appliedDate" type="date" defaultValue={editingInternship.appliedDate || new Date().toISOString().slice(0, 10)} required />
                </div>
              </div>
              <div className="fr">
                <div className="fg">
                  <label>Stipend</label>
                  <input name="stipend" defaultValue={editingInternship.stipend || ''} placeholder="e.g. Rs.20,000/month" />
                </div>
                <div className="fg">
                  <label>Status</label>
                  <select name="status" defaultValue={editingInternship.status || 'applied'}>
                    {statuses.map(st => (
                      <option value={st} key={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="fg">
                <label>Notes / Links</label>
                <textarea name="notes" rows="2" defaultValue={editingInternship.notes || ''}></textarea>
              </div>
              <div className="m-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setEditingInternship(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
