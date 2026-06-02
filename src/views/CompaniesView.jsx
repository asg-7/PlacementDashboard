import React, { useState } from 'react';

export default function CompaniesView({ state, mutateState, addToast }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingCompany, setEditingCompany] = useState(null); // null if closed, {} for new, or company object for edit

  const s = state;
  const statuses = ['not applied', 'applied', 'under review', 'OA received', 'interview', 'accepted', 'rejected'];

  // Status counts
  const statusCounts = {};
  statuses.forEach(st => {
    statusCounts[st] = s.companies.filter(c => c.status === st).length;
  });

  // Filtered companies
  let companies = s.companies;
  if (search) {
    companies = companies.filter(c =>
      c.companyName.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase()) ||
      (c.notes || '').toLowerCase().includes(search.toLowerCase())
    );
  }
  if (statusFilter !== 'all') {
    companies = companies.filter(c => c.status === statusFilter);
  }

  const handleUpdateStatus = (id, newStatus) => {
    mutateState(draft => {
      const c = draft.companies.find(x => x.id === id);
      if (c) c.status = newStatus;
    });
    addToast('Status updated ✓');
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this company?')) return;
    mutateState(draft => {
      draft.companies = draft.companies.filter(x => x.id !== id);
    });
    addToast('Company removed', 'var(--coral)');
  };

  const handleSave = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    if (!name) {
      addToast('Company name required', 'var(--coral)');
      return;
    }

    const role = form.role.value.trim();
    const ctc = form.ctc.value.trim();
    const windowVal = form.windowVal.value.trim();
    const status = form.status.value;
    const notes = form.notes.value.trim();

    mutateState(draft => {
      const obj = { companyName: name, role, ctc, window: windowVal, status, notes };
      if (editingCompany.id) {
        const c = draft.companies.find(x => x.id === editingCompany.id);
        if (c) Object.assign(c, obj);
      } else {
        const newId = '_' + Math.random().toString(36).substr(2, 9);
        draft.companies.push({ id: newId, ...obj });
      }
    });

    setEditingCompany(null);
    addToast('Company saved ✓');
  };

  return (
    <div style={{ animation: 'fade-in 0.4s ease-out' }}>
      <div className="ph">
        <div>
          <div className="ph-eyebrow">Target List</div>
          <div className="ph-title">Companies</div>
          <div className="ph-sub">{companies.length} / {s.companies.length} shown</div>
        </div>
        <button className="btn btn-primary" onClick={() => setEditingCompany({})}>+ Add Company</button>
      </div>

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

      <div className="sb">
        <input
          className="si"
          placeholder="Search company, role, notes…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select style={{ width: '170px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All statuses</option>
          {statuses.map(st => (
            <option value={st} key={st}>{st}</option>
          ))}
        </select>
      </div>

      <div className="card">
        <div className="tw">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>CTC</th>
                <th>Window</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--t3)' }}>
                    No companies matching current criteria.
                  </td>
                </tr>
              ) : (
                companies.map(c => (
                  <tr key={c.id}>
                    <td><div style={{ fontWeight: 700, color: 'var(--t1)', fontSize: '13px' }}>{c.companyName}</div></td>
                    <td><div style={{ color: 'var(--t2)', fontSize: '12px' }}>{c.role}</div></td>
                    <td><div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--electric)' }}>{c.ctc}</div></td>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingCompany !== null && (
        <div className="moverlay" onClick={() => setEditingCompany(null)}>
          <div className="mbox" onClick={(e) => e.stopPropagation()}>
            <div className="mtitle">
              {editingCompany.id ? 'Edit Company' : 'Add Company'}
              <button className="mclose" onClick={() => setEditingCompany(null)}>×</button>
            </div>
            <form onSubmit={handleSave} className="modal-scroll">
              <div className="fr">
                <div className="fg">
                  <label>Company Name</label>
                  <input name="name" defaultValue={editingCompany.companyName || ''} required />
                </div>
                <div className="fg">
                  <label>Role</label>
                  <input name="role" defaultValue={editingCompany.role || ''} />
                </div>
              </div>
              <div className="fr">
                <div className="fg">
                  <label>CTC</label>
                  <input name="ctc" defaultValue={editingCompany.ctc || ''} />
                </div>
                <div className="fg">
                  <label>Application Window</label>
                  <input name="windowVal" defaultValue={editingCompany.window || ''} />
                </div>
              </div>
              <div className="fg">
                <label>Status</label>
                <select name="status" defaultValue={editingCompany.status || 'not applied'}>
                  {statuses.map(st => (
                    <option value={st} key={st}>{st}</option>
                  ))}
                </select>
              </div>
              <div className="fg">
                <label>Notes / Link</label>
                <textarea name="notes" rows="2" defaultValue={editingCompany.notes || ''}></textarea>
              </div>
              <div className="m-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setEditingCompany(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
