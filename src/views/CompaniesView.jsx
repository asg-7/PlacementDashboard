import React, { useState } from 'react';

export default function CompaniesView({ state, mutateState, addToast }) {
  const [subView, setSubView] = useState('companies'); // 'companies' | 'referrals'
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all'); // 'all' | '0' | '1' | '2' | '3'
  const [editingCompany, setEditingCompany] = useState(null); // null if closed, company object for add/edit
  const [editingReferral, setEditingReferral] = useState(null); // null if closed, referral object for add/edit

  const s = state;
  const statuses = ['not applied', 'applied', 'under review', 'OA received', 'interview', 'accepted', 'rejected'];

  // Status counts
  const statusCounts = {};
  statuses.forEach(st => {
    statusCounts[st] = s.companies.filter(c => c.status === st).length;
  });

  // Filtered companies
  let filteredCompanies = s.companies;

  // Search filter
  if (search) {
    filteredCompanies = filteredCompanies.filter(c =>
      c.companyName.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase()) ||
      (c.notes || '').toLowerCase().includes(search.toLowerCase())
    );
  }

  // Status filter
  if (statusFilter !== 'all') {
    filteredCompanies = filteredCompanies.filter(c => c.status === statusFilter);
  }

  // Tier filter
  if (tierFilter !== 'all') {
    filteredCompanies = filteredCompanies.filter(c => String(c.tier) === tierFilter);
  }

  // Default sorting: Tier 0 first, Tier 1 second, Tier 2 third, Tier 3 fourth
  filteredCompanies.sort((a, b) => {
    const tA = a.tier !== undefined ? a.tier : 3;
    const tB = b.tier !== undefined ? b.tier : 3;
    return tA - tB; // Lower number (Tier 0) comes first
  });

  const handleUpdateStatus = (id, newStatus) => {
    mutateState(draft => {
      const c = draft.companies.find(x => x.id === id);
      if (c) c.status = newStatus;
    });
    addToast('Status updated ✓', 'success');
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this company?')) return;
    mutateState(draft => {
      draft.companies = draft.companies.filter(x => x.id !== id);
    });
    addToast('Company removed', 'warning');
  };

  const handleSave = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    if (!name) {
      addToast('Company name required', 'warning');
      return;
    }

    const role = form.role.value.trim();
    const ctc = form.ctc.value.trim();
    const windowVal = form.windowVal.value.trim();
    const status = form.status.value;
    const notes = form.notes.value.trim();
    const cgpa = Number(form.cgpa.value) || 6.0;
    const challenge = form.hiringChallenge.checked;
    const tier = Number(form.tier.value);

    mutateState(draft => {
      const obj = { companyName: name, role, ctc, window: windowVal, status, notes, cgpaCriteria: cgpa, hiringChallenge: challenge, tier };
      if (editingCompany.id) {
        const c = draft.companies.find(x => x.id === editingCompany.id);
        if (c) Object.assign(c, obj);
      } else {
        const newId = '_' + Math.random().toString(36).substr(2, 9);
        draft.companies.push({ id: newId, ...obj });
      }
    });

    setEditingCompany(null);
    addToast('Company saved ✓', 'success');
  };

  // Referral tracker logic
  const referralOutreaches = s.referralOutreach || [];
  
  // Weekly count logic (outreaches within past 7 days)
  const getWeeklyOutreachCount = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return referralOutreaches.filter(r => new Date(r.dateMessaged) >= oneWeekAgo).length;
  };

  const handleSaveReferral = (e) => {
    e.preventDefault();
    const form = e.target;
    const contactName = form.contactName.value.trim();
    const companyName = form.companyName.value.trim();
    const linkedinUrl = form.linkedinUrl.value.trim();
    const dateMessaged = form.dateMessaged.value;
    const response = form.response.value;
    const referred = form.referred.checked;

    if (!contactName || !companyName) {
      addToast('Name and Company required', 'warning');
      return;
    }

    mutateState(draft => {
      if (!draft.referralOutreach) draft.referralOutreach = [];
      const obj = { contactName, companyName, linkedinUrl, dateMessaged, response, referred };
      
      if (editingReferral.id) {
        const index = draft.referralOutreach.findIndex(x => x.id === editingReferral.id);
        if (index !== -1) draft.referralOutreach[index] = { id: editingReferral.id, ...obj };
      } else {
        const newId = 'ref_' + Date.now();
        draft.referralOutreach.push({ id: newId, ...obj });
      }
    });

    setEditingReferral(null);
    addToast('Referral log saved ✓', 'success');
  };

  const handleDeleteReferral = (id) => {
    if (!window.confirm('Delete this outreach record?')) return;
    mutateState(draft => {
      draft.referralOutreach = draft.referralOutreach.filter(x => x.id !== id);
    });
    addToast('Outreach record deleted', 'warning');
  };

  const getTierBadge = (tier) => {
    switch (tier) {
      case 0: return <span className="tier-badge tier-0">★ Tier 0 (Dream)</span>;
      case 1: return <span className="tier-badge tier-1">Tier 1 (Target)</span>;
      case 2: return <span className="tier-badge tier-2">Tier 2 (Safe)</span>;
      case 3: return <span className="tier-badge tier-3">Tier 3 (Fallback)</span>;
      default: return <span className="tier-badge tier-3">Tier 3</span>;
    }
  };

  return (
    <div style={{ animation: 'fade-in 0.4s ease-out' }}>
      <div className="ph">
        <div>
          <div className="ph-eyebrow">Target List</div>
          <div className="ph-title">{subView === 'companies' ? 'Companies Directory' : 'Referral Outreach Tracker'}</div>
          <div className="ph-sub">
            {subView === 'companies' 
              ? `${filteredCompanies.length} of ${s.companies.length} targets matching filters` 
              : `${referralOutreaches.length} outreach contacts recorded`
            }
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn btn-ghost" 
            onClick={() => setSubView(subView === 'companies' ? 'referrals' : 'companies')}
          >
            {subView === 'companies' ? '🤝 Open Referrals Tracker' : '🏢 Open Companies Directory'}
          </button>
          
          <button 
            className="btn btn-primary" 
            onClick={() => subView === 'companies' ? setEditingCompany({}) : setEditingReferral({})}
          >
            {subView === 'companies' ? '+ Add Company' : '+ Log Outreach'}
          </button>
        </div>
      </div>

      {subView === 'companies' ? (
        <>
          {/* PIPELINE STRIP */}
          <div className="g4" style={{ marginBottom: '20px' }}>
            {[
              ['Not Applied', statusCounts['not applied'] || 0, '#445570'],
              ['Applied', statusCounts['applied'] || 0, 'var(--electric)'],
              ['In Review', (statusCounts['under review'] || 0) + (statusCounts['OA received'] || 0), 'var(--amber)'],
              ['Interview / Offer', (statusCounts['interview'] || 0) + (statusCounts['accepted'] || 0), 'var(--volt)'],
            ].map(([lbl, cnt, color], i) => (
              <div className="metric" style={{ padding: '16px' }} key={i}>
                <div style={{ fontFamily: 'var(--display)', fontSize: '28px', fontWeight: '800', color: color, lineHeight: 1, letterSpacing: '-1px' }}>{cnt}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', fontWeight: 700, color: 'var(--t3)', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '6px' }}>{lbl}</div>
              </div>
            ))}
          </div>

          {/* FILTERS ROW */}
          <div className="sb" style={{ gap: '12px', flexWrap: 'wrap' }}>
            <input
              className="si"
              placeholder="Search company, role, notes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1 }}
            />
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Statuses</option>
                {statuses.map(st => (
                  <option value={st} key={st}>{st}</option>
                ))}
              </select>

              <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)}>
                <option value="all">All Tiers</option>
                <option value="0">Tier 0 (Dream)</option>
                <option value="1">Tier 1 (Target)</option>
                <option value="2">Tier 2 (Safe)</option>
                <option value="3">Tier 3 (Fallback)</option>
              </select>
            </div>
          </div>

          <div className="card">
            <div className="tw">
              <table>
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Tier</th>
                    <th>Role</th>
                    <th>CTC</th>
                    <th>CGPA Cutoff</th>
                    <th>Window</th>
                    <th>Status</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompanies.length === 0 ? (
                    <tr>
                      <td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: 'var(--t3)' }}>
                        No companies matching current criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredCompanies.map(c => {
                      const isEligible = 6.8 >= (c.cgpaCriteria || 0);
                      return (
                        <tr key={c.id}>
                          <td>
                            <div style={{ fontWeight: 700, color: 'var(--t1)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {c.companyName}
                              {c.hiringChallenge && <span className="badge b-rose" style={{ fontSize: '7px', padding: '1px 4px' }}>Challenge</span>}
                            </div>
                          </td>
                          <td>{getTierBadge(c.tier)}</td>
                          <td><div style={{ color: 'var(--t2)', fontSize: '12px' }}>{c.role}</div></td>
                          <td><div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--electric)' }}>{c.ctc}</div></td>
                          <td>
                            <span className={`badge ${isEligible ? 'b-green' : 'b-red'}`} style={{ fontSize: '9px' }}>
                              {c.cgpaCriteria || '6.0'}+ {isEligible ? '✅' : '⚠️'}
                            </span>
                          </td>
                          <td><div style={{ fontSize: '11px', color: 'var(--t3)', fontFamily: 'var(--mono)' }}>{c.window}</div></td>
                          <td>
                            <select className="ss" value={c.status} onChange={(e) => handleUpdateStatus(c.id, e.target.value)}>
                              {statuses.map(st => (
                                <option value={st} key={st}>{st}</option>
                              ))}
                            </select>
                          </td>
                          <td><div style={{ fontSize: '11px', color: 'var(--t3)', maxWidth: '180px', lineHeight: '1.4' }}>{c.notes || '—'}</div></td>
                          <td>
                            <div style={{ display: 'flex', gap: '5px' }}>
                              <button className="btn btn-ghost btn-xs" onClick={() => setEditingCompany(c)}>Edit</button>
                              <button className="btn btn-danger btn-xs" onClick={() => handleDelete(c.id)}>Del</button>
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
        </>
      ) : (
        <>
          {/* REFERRAL STATISTICS BOX */}
          <div className="card" style={{ marginBottom: '20px', borderLeft: '4px solid var(--gold-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, color: 'var(--t1)' }}>Weekly Referral Pipeline</h3>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--t3)' }}>Target: Message at least 5 professionals per week on LinkedIn.</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--gold-text)' }}>{getWeeklyOutreachCount()} / 5</span>
              <div style={{ fontSize: '11px', color: 'var(--t3)' }}>Messaged this week</div>
            </div>
          </div>

          {/* REFERRAL LOG LIST */}
          <div className="card">
            <div className="tw">
              <table>
                <thead>
                  <tr>
                    <th>Contact Name</th>
                    <th>Company</th>
                    <th>Date Messaged</th>
                    <th>Response Status</th>
                    <th>Referral Received?</th>
                    <th>LinkedIn Profile</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {referralOutreaches.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--t3)' }}>
                        No referral outreach entries logged. Start logging contacts to secure interviews!
                      </td>
                    </tr>
                  ) : (
                    referralOutreaches.map(ref => (
                      <tr key={ref.id}>
                        <td><strong>{ref.contactName}</strong></td>
                        <td>{ref.companyName}</td>
                        <td style={{ fontFamily: 'var(--mono)', fontSize: '11px' }}>{ref.dateMessaged}</td>
                        <td>
                          <span className={`badge ${ref.response === 'Yes' ? 'b-green' : ref.response === 'No' ? 'b-red' : 'b-amber'}`}>
                            {ref.response}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${ref.referred ? 'b-green' : 'b-red'}`}>
                            {ref.referred ? '✅ Yes' : '❌ No'}
                          </span>
                        </td>
                        <td>
                          {ref.linkedinUrl ? (
                            <a href={ref.linkedinUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-xs">
                              LinkedIn Profile ↗
                            </a>
                          ) : '—'}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button className="btn btn-ghost btn-xs" onClick={() => setEditingReferral(ref)}>Edit</button>
                            <button className="btn btn-danger btn-xs" onClick={() => handleDeleteReferral(ref.id)}>Del</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* COMPANY EDIT MODAL */}
      {editingCompany !== null && (
        <div className="moverlay" onClick={() => setEditingCompany(null)}>
          <div className="mbox" onClick={(e) => e.stopPropagation()}>
            <div className="mtitle">
              {editingCompany.id ? 'Edit Company Details' : 'Add New Company Target'}
              <button className="mclose" onClick={() => setEditingCompany(null)}>×</button>
            </div>
            <form onSubmit={handleSave} className="modal-scroll">
              <div className="fr">
                <div className="fg">
                  <label>Company Name</label>
                  <input name="name" defaultValue={editingCompany.companyName || ''} required />
                </div>
                <div className="fg">
                  <label>Company Tier</label>
                  <select name="tier" defaultValue={editingCompany.tier !== undefined ? editingCompany.tier : 2}>
                    <option value="0">Tier 0 (Dream / 20+ LPA)</option>
                    <option value="1">Tier 1 (Target / 10-20 LPA)</option>
                    <option value="2">Tier 2 (Safe / 6-10 LPA)</option>
                    <option value="3">Tier 3 (Fallback / &lt;6 LPA)</option>
                  </select>
                </div>
              </div>
              <div className="fr">
                <div className="fg">
                  <label>Role</label>
                  <input name="role" defaultValue={editingCompany.role || ''} />
                </div>
                <div className="fg">
                  <label>CTC</label>
                  <input name="ctc" defaultValue={editingCompany.ctc || ''} />
                </div>
              </div>
              <div className="fr">
                <div className="fg">
                  <label>Application Window</label>
                  <input name="windowVal" defaultValue={editingCompany.window || ''} />
                </div>
                <div className="fg">
                  <label>CGPA Cutoff</label>
                  <input name="cgpa" type="number" step="0.1" defaultValue={editingCompany.cgpaCriteria || 6.0} />
                </div>
              </div>
              <div className="fr">
                <div className="fg" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px', paddingTop: '20px' }}>
                  <input name="hiringChallenge" type="checkbox" defaultChecked={editingCompany.hiringChallenge || false} style={{ width: 'auto', cursor: 'pointer' }} />
                  <label style={{ margin: 0 }}>Hiring Challenge / Hackathon track</label>
                </div>
                <div className="fg">
                  <label>Application Status</label>
                  <select name="status" defaultValue={editingCompany.status || 'not applied'}>
                    {statuses.map(st => (
                      <option value={st} key={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="fg">
                <label>Notes / Resource Links</label>
                <textarea name="notes" rows="2" defaultValue={editingCompany.notes || ''}></textarea>
              </div>
              <div className="m-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setEditingCompany(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Company</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REFERRAL LOG EDIT MODAL */}
      {editingReferral !== null && (
        <div className="moverlay" onClick={() => setEditingReferral(null)}>
          <div className="mbox" onClick={(e) => e.stopPropagation()}>
            <div className="mtitle">
              {editingReferral.id ? 'Edit Outreach Entry' : 'Log Outreach Details'}
              <button className="mclose" onClick={() => setEditingReferral(null)}>×</button>
            </div>
            <form onSubmit={handleSaveReferral} className="modal-scroll">
              <div className="fr">
                <div className="fg">
                  <label>Contact Person Name</label>
                  <input name="contactName" defaultValue={editingReferral.contactName || ''} required />
                </div>
                <div className="fg">
                  <label>Company Name</label>
                  <input name="companyName" defaultValue={editingReferral.companyName || ''} required />
                </div>
              </div>
              <div className="fr">
                <div className="fg">
                  <label>LinkedIn Profile URL</label>
                  <input name="linkedinUrl" type="url" defaultValue={editingReferral.linkedinUrl || ''} placeholder="https://linkedin.com/in/..." />
                </div>
                <div className="fg">
                  <label>Date Messaged</label>
                  <input name="dateMessaged" type="date" defaultValue={editingReferral.dateMessaged || new Date().toISOString().slice(0, 10)} required />
                </div>
              </div>
              <div className="fr">
                <div className="fg">
                  <label>Response Status</label>
                  <select name="response" defaultValue={editingReferral.response || 'Pending'}>
                    <option value="Pending">⌛ Pending</option>
                    <option value="Yes">💬 Yes (Communicating)</option>
                    <option value="No">❌ No (No reply / Rejected)</option>
                  </select>
                </div>
                <div className="fg" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px', paddingTop: '20px' }}>
                  <input name="referred" type="checkbox" defaultChecked={editingReferral.referred || false} style={{ width: 'auto', cursor: 'pointer' }} />
                  <label style={{ margin: 0 }}>Referral Received Successfully</label>
                </div>
              </div>
              <div className="m-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setEditingReferral(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Outreach Log</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
