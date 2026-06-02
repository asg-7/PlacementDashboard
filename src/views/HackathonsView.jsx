import React, { useState } from 'react';

export default function HackathonsView({ state, mutateState, addToast }) {
  const [filter, setFilter] = useState('all');
  const [editingHack, setEditingHack] = useState(null); // null if closed, {} for new, or hackathon object for edit

  const s = state;
  const regStatuses = ['not registered', 'registered', 'submitted'];
  const subStatuses = ['not started', 'in progress', 'submitted'];
  const resStatuses = ['pending', 'won', 'lost'];

  let hacks = s.hackathons || [];
  if (filter !== 'all') {
    hacks = hacks.filter(h => h.priority === filter);
  }

  const handleUpdateField = (id, field, value) => {
    mutateState(draft => {
      const h = draft.hackathons.find(x => x.id === id);
      if (h) h[field] = value;
    });
    addToast('Status updated ✓');
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this hackathon?')) return;
    mutateState(draft => {
      draft.hackathons = draft.hackathons.filter(x => x.id !== id);
    });
    addToast('Hackathon removed', 'var(--coral)');
  };

  const handleSave = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    if (!name) {
      addToast('Name required', 'var(--coral)');
      return;
    }

    const platform = form.platform.value.trim();
    const deadline = form.deadline.value;
    const priority = form.priority.value;
    const notes = form.notes.value.trim();

    mutateState(draft => {
      const obj = { name, platform, deadline, priority, notes };
      if (editingHack.id) {
        const h = draft.hackathons.find(x => x.id === editingHack.id);
        if (h) Object.assign(h, obj);
      } else {
        const newId = '_' + Math.random().toString(36).substr(2, 9);
        draft.hackathons.push({ id: newId, reg: 'not registered', submission: 'not started', result: 'pending', ...obj });
      }
    });

    setEditingHack(null);
    addToast('Hackathon saved ✓');
  };

  const getPriorityBadgeClass = (priority) => {
    return `badge b-${priority === 'high' ? 'red' : priority === 'medium' ? 'amber' : 'gray'}`;
  };

  return (
    <div style={{ animation: 'fade-in 0.4s ease-out' }}>
      <div className="ph">
        <div>
          <div className="ph-eyebrow">Competition Tracker</div>
          <div className="ph-title">Hackathons</div>
          <div className="ph-sub">{s.hackathons.length} competitions tracked</div>
        </div>
        <button className="btn btn-primary" onClick={() => setEditingHack({})}>+ Add Hackathon</button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {['all', 'high', 'medium', 'low'].map(p => (
          <button
            className={`btn ${filter === p ? 'btn-primary' : 'btn-ghost'} btn-sm`}
            onClick={() => setFilter(p)}
            key={p}
          >
            {p === 'all' ? 'All' : p.charAt(0).toUpperCase() + p.slice(1) + ' Priority'}
          </button>
        ))}
      </div>

      <div className="g2">
        {hacks.length === 0 ? (
          <div className="card" style={{ gridColumn: 'span 2', textAlign: 'center', padding: '40px', color: 'var(--t3)' }}>
            No hackathons match the active filter.
          </div>
        ) : (
          hacks.map(h => (
            <div className="hk-card" key={h.id}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                <div className="hk-name">{h.name}</div>
                <span className={getPriorityBadgeClass(h.priority)}>{h.priority}</span>
              </div>
              <div className="hk-meta">
                <span className="hk-det">📍 {h.platform}</span>
                <span className="hk-det" style={{ color: 'var(--electric)' }}>🗓 {h.deadline}</span>
              </div>
              {h.notes && (
                <div style={{ fontSize: '12px', color: 'var(--t3)', lineHeight: '1.4' }}>{h.notes}</div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <div>
                  <div style={{ fontSize: '9px', fontFamily: 'var(--mono)', color: 'var(--t3)', marginBottom: '4px', letterSpacing: '.8px', textTransform: 'uppercase' }}>Registration</div>
                  <select
                    className="ss"
                    style={{ width: '100%' }}
                    value={h.reg || 'not registered'}
                    onChange={(e) => handleUpdateField(h.id, 'reg', e.target.value)}
                  >
                    {regStatuses.map(r => (
                      <option value={r} key={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize: '9px', fontFamily: 'var(--mono)', color: 'var(--t3)', marginBottom: '4px', letterSpacing: '.8px', textTransform: 'uppercase' }}>Submission</div>
                  <select
                    className="ss"
                    style={{ width: '100%' }}
                    value={h.submission || 'not started'}
                    onChange={(e) => handleUpdateField(h.id, 'submission', e.target.value)}
                  >
                    {subStatuses.map(r => (
                      <option value={r} key={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize: '9px', fontFamily: 'var(--mono)', color: 'var(--t3)', marginBottom: '4px', letterSpacing: '.8px', textTransform: 'uppercase' }}>Result</div>
                  <select
                    className="ss"
                    style={{ width: '100%' }}
                    value={h.result || 'pending'}
                    onChange={(e) => handleUpdateField(h.id, 'result', e.target.value)}
                  >
                    {resStatuses.map(r => (
                      <option value={r} key={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button className="btn btn-ghost btn-xs" onClick={() => setEditingHack(h)}>Edit</button>
                <button className="btn btn-danger btn-xs" onClick={() => handleDelete(h.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* EDIT MODAL */}
      {editingHack !== null && (
        <div className="moverlay" onClick={() => setEditingHack(null)}>
          <div className="mbox" onClick={(e) => e.stopPropagation()}>
            <div className="mtitle">
              {editingHack.id ? 'Edit Hackathon' : 'Add Hackathon'}
              <button className="mclose" onClick={() => setEditingHack(null)}>×</button>
            </div>
            <form onSubmit={handleSave} className="modal-scroll">
              <div className="fg">
                <label>Hackathon Name</label>
                <input name="name" defaultValue={editingHack.name || ''} required />
              </div>
              <div className="fr">
                <div className="fg">
                  <label>Platform</label>
                  <input name="platform" defaultValue={editingHack.platform || ''} />
                </div>
                <div className="fg">
                  <label>Deadline</label>
                  <input name="deadline" type="date" defaultValue={editingHack.deadline || ''} />
                </div>
              </div>
              <div className="fg">
                <label>Priority</label>
                <select name="priority" defaultValue={editingHack.priority || 'medium'}>
                  {['high', 'medium', 'low'].map(p => (
                    <option value={p} key={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="fg">
                <label>Notes</label>
                <textarea name="notes" rows="2" defaultValue={editingHack.notes || ''}></textarea>
              </div>
              <div className="m-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setEditingHack(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
