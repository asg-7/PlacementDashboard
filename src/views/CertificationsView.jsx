import React, { useState } from 'react';

export default function CertificationsView({ state, mutateState, addToast }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingCert, setEditingCert] = useState(null); // null if closed, {} for new, or cert object for edit

  const s = state;
  const statuses = ['not started', 'in progress', 'completed', 'paused'];
  const checkpoints = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  let certs = s.certifications || [];
  if (search) {
    certs = certs.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.provider || '').toLowerCase().includes(search.toLowerCase())
    );
  }
  if (filter !== 'all') {
    certs = certs.filter(c => c.status === filter);
  }

  const handleSetProgress = (id, pct) => {
    mutateState(draft => {
      const c = draft.certifications.find(x => x.id === id);
      if (c) {
        c.progress = pct;
        if (pct === 100) c.status = 'completed';
        else if (pct > 0) c.status = 'in progress';
        else c.status = 'not started';
      }
    });
    addToast('Progress updated ✓');
  };

  const handleUpdateStatus = (id, status) => {
    mutateState(draft => {
      const c = draft.certifications.find(x => x.id === id);
      if (c) {
        c.status = status;
        if (status === 'completed') c.progress = 100;
        else if (status === 'not started') c.progress = 0;
      }
    });
    addToast('Status updated ✓');
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this certification?')) return;
    mutateState(draft => {
      draft.certifications = draft.certifications.filter(x => x.id !== id);
    });
    addToast('Certification removed', 'var(--coral)');
  };

  const handleSave = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    if (!name) {
      addToast('Name required', 'var(--coral)');
      return;
    }

    const provider = form.provider.value.trim();
    const duration = form.duration.value.trim();
    const status = form.status.value;
    const deadline = form.deadline.value;
    const notes = form.notes.value.trim();
    const link = form.link ? form.link.value.trim() : '';

    mutateState(draft => {
      const obj = { name, provider, duration, status, deadline, notes, link };
      if (editingCert.id) {
        const c = draft.certifications.find(x => x.id === editingCert.id);
        if (c) {
          Object.assign(c, obj);
          if (status === 'completed') c.progress = 100;
          else if (status === 'not started') c.progress = 0;
        }
      } else {
        const newId = '_' + Math.random().toString(36).substr(2, 9);
        draft.certifications.push({ id: newId, progress: status === 'completed' ? 100 : 0, ...obj });
      }
    });

    setEditingCert(null);
    addToast('Certification saved ✓');
  };

  return (
    <div style={{ animation: 'fade-in 0.4s ease-out' }}>
      <div className="ph">
        <div>
          <div className="ph-eyebrow">Learning Tracker</div>
          <div className="ph-title">Certifications</div>
          <div className="ph-sub">{certs.length} / {s.certifications.length} shown</div>
        </div>
        <button className="btn btn-primary" onClick={() => setEditingCert({})}>+ Add Cert</button>
      </div>

      <div className="sb">
        <input
          className="si"
          placeholder="Search certifications, providers…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select style={{ width: '160px' }} value={filter} onChange={(e) => setFilter(e.target.value)}>
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
                <th>Certification</th>
                <th>Provider</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Deadline</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {certs.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: 'var(--t3)' }}>
                    No certifications match active filters.
                  </td>
                </tr>
              ) : (
                certs.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 700, color: 'var(--t1)' }}>{c.name}</span>
                        {c.link && (
                          <a href={c.link} target="_blank" rel="noopener noreferrer" title="Go to course" style={{ textDecoration: 'none', color: 'var(--electric)', fontSize: '11px', fontWeight: 'bold' }}>
                            ↗
                          </a>
                        )}
                      </div>
                    </td>
                    <td><div style={{ color: 'var(--t2)', fontSize: '12px' }}>{c.provider || ''}</div></td>
                    <td><div style={{ fontSize: '11px', color: 'var(--t3)', fontFamily: 'var(--mono)' }}>{c.duration || ''}</div></td>
                    <td>
                      <select className="ss" value={c.status} onChange={(e) => handleUpdateStatus(c.id, e.target.value)}>
                        {statuses.map(st => (
                          <option value={st} key={st}>{st}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ minWidth: '220px' }}>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', fontWeight: 700, color: c.progress >= 100 ? 'var(--volt)' : c.progress > 0 ? 'var(--electric)' : 'var(--t3)', marginBottom: '6px' }}>{c.progress}%</div>
                      <div className="cp-row">
                        {checkpoints.map(cp => (
                          <button
                            className={`cp ${c.progress === cp ? 'active' : c.progress > cp ? 'filled' : ''}`}
                            onClick={() => handleSetProgress(c.id, cp)}
                            key={cp}
                          >
                            {cp}%
                          </button>
                        ))}
                      </div>
                    </td>
                    <td><div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--t2)' }}>{c.deadline || ''}</div></td>
                    <td><div style={{ fontSize: '11px', color: 'var(--t3)', maxWidth: '160px', lineHeight: '1.4' }}>{c.notes || '—'}</div></td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        {c.link && (
                          <a href={c.link} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-xs" style={{ textDecoration: 'none', color: 'var(--volt)', borderColor: 'rgba(0,255,136,0.3)' }}>
                            Go ↗
                          </a>
                        )}
                        <button className="btn btn-ghost btn-xs" onClick={() => setEditingCert(c)}>Edit</button>
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
      {editingCert !== null && (
        <div className="moverlay" onClick={() => setEditingCert(null)}>
          <div className="mbox" onClick={(e) => e.stopPropagation()}>
            <div className="mtitle">
              {editingCert.id ? 'Edit Certification' : 'Add Certification'}
              <button className="mclose" onClick={() => setEditingCert(null)}>×</button>
            </div>
            <form onSubmit={handleSave} className="modal-scroll">
              <div className="fg">
                <label>Certification Name</label>
                <input name="name" defaultValue={editingCert.name || ''} required />
              </div>
              <div className="fg">
                <label>Course / Exam URL</label>
                <input name="link" placeholder="https://..." defaultValue={editingCert.link || ''} />
              </div>
              <div className="fr">
                <div className="fg">
                  <label>Provider</label>
                  <input name="provider" defaultValue={editingCert.provider || ''} />
                </div>
                <div className="fg">
                  <label>Duration</label>
                  <input name="duration" defaultValue={editingCert.duration || ''} />
                </div>
              </div>
              <div className="fr">
                <div className="fg">
                  <label>Status</label>
                  <select name="status" defaultValue={editingCert.status || 'not started'}>
                    {statuses.map(st => (
                      <option value={st} key={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div className="fg">
                  <label>Deadline</label>
                  <input name="deadline" type="date" defaultValue={editingCert.deadline || ''} />
                </div>
              </div>
              <div className="fg">
                <label>Notes</label>
                <textarea name="notes" rows="2" defaultValue={editingCert.notes || ''}></textarea>
              </div>
              <div className="m-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setEditingCert(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
