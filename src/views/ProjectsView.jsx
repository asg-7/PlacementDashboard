import React, { useState } from 'react';

export default function ProjectsView({ state, mutateState, addToast }) {
  const [editingProj, setEditingProj] = useState(null); // null if closed, {} for new, or project object for edit

  const s = state;
  const statusColors = {
    'not started': 'var(--t3)',
    'in progress': 'var(--electric)',
    'completed': 'var(--volt)',
    'paused': 'var(--amber)'
  };
  const checkpoints = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  const handleSetProgress = (id, pct) => {
    mutateState(draft => {
      const p = draft.projects.find(x => x.id === id);
      if (p) {
        p.progress = pct;
        if (pct === 100) p.status = 'completed';
        else if (pct > 0) p.status = 'in progress';
        else p.status = 'not started';
      }
    });
    addToast('Progress updated ✓');
  };

  const handleUpdateStatus = (id, status) => {
    mutateState(draft => {
      const p = draft.projects.find(x => x.id === id);
      if (p) {
        p.status = status;
        if (status === 'completed') p.progress = 100;
        else if (status === 'not started') p.progress = 0;
      }
    });
    addToast('Status updated ✓');
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this project?')) return;
    mutateState(draft => {
      draft.projects = draft.projects.filter(x => x.id !== id);
    });
    addToast('Project removed', 'var(--coral)');
  };

  const handleSave = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.projectName.value.trim();
    if (!name) {
      addToast('Name required', 'var(--coral)');
      return;
    }

    const description = form.description.value.trim();
    const tech = form.tech.value.trim();
    const status = form.status.value;
    const githubLink = form.githubLink.value.trim();
    const notes = form.notes.value.trim();

    mutateState(draft => {
      const obj = { name, description, tech, status, githubLink, notes };
      if (editingProj.id) {
        const p = draft.projects.find(x => x.id === editingProj.id);
        if (p) {
          Object.assign(p, obj);
          if (status === 'completed') p.progress = 100;
          else if (status === 'not started') p.progress = 0;
        }
      } else {
        const newId = '_' + Math.random().toString(36).substr(2, 9);
        draft.projects.push({ id: newId, progress: status === 'completed' ? 100 : 0, ...obj });
      }
    });

    setEditingProj(null);
    addToast('Project saved ✓');
  };

  const getStatusBadgeClass = (status) => {
    return `badge b-${String(status || 'gray').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  };

  return (
    <div style={{ animation: 'fade-in 0.4s ease-out' }}>
      <div className="ph">
        <div>
          <div className="ph-eyebrow">Portfolio</div>
          <div className="ph-title">Projects</div>
          <div className="ph-sub">{s.projects.filter(p => p.status === 'completed').length} completed · {s.projects.length} total</div>
        </div>
        <button className="btn btn-primary" onClick={() => setEditingProj({})}>+ Add Project</button>
      </div>

      <div className="g2">
        {s.projects.length === 0 ? (
          <div className="card" style={{ gridColumn: 'span 2', textAlign: 'center', padding: '40px', color: 'var(--t3)' }}>
            No projects logged yet. Click "+ Add Project" to record your work!
          </div>
        ) : (
          s.projects.map(p => (
            <div className="proj-card" key={p.id}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                <div className="proj-name">{p.name}</div>
                <span className={getStatusBadgeClass(p.status)}>{p.status}</span>
              </div>
              <div className="proj-desc">{p.description}</div>
              <div>
                {p.tech.split(',').map((t, i) => (
                  <span className="tech-tag" key={i}>{t.trim()}</span>
                ))}
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--t3)', fontFamily: 'var(--mono)', letterSpacing: '.8px', textTransform: 'uppercase' }}>Progress</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', fontWeight: 700, color: statusColors[p.status] || 'var(--t2)' }}>{p.progress}%</span>
                </div>
                <div className="cp-row">
                  {checkpoints.map(cp => (
                    <button
                      className={`cp ${p.progress === cp ? 'active' : p.progress > cp ? 'filled' : ''}`}
                      onClick={() => handleSetProgress(p.id, cp)}
                      key={cp}
                    >
                      {cp}%
                    </button>
                  ))}
                </div>
              </div>
              {p.notes && (
                <div style={{ fontSize: '12px', color: 'var(--t3)', lineHeight: '1.4' }}>{p.notes}</div>
              )}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {p.githubLink && (
                  <a href={p.githubLink} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none' }}>
                    GitHub ↗
                  </a>
                )}
                <button className="btn btn-ghost btn-xs" onClick={() => setEditingProj(p)}>Edit</button>
                <button className="btn btn-danger btn-xs" onClick={() => handleDelete(p.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* EDIT MODAL */}
      {editingProj !== null && (
        <div className="moverlay" onClick={() => setEditingProj(null)}>
          <div className="mbox" onClick={(e) => e.stopPropagation()}>
            <div className="mtitle">
              {editingProj.id ? 'Edit Project' : 'Add Project'}
              <button className="mclose" onClick={() => setEditingProj(null)}>×</button>
            </div>
            <form onSubmit={handleSave} className="modal-scroll">
              <div className="fg">
                <label>Project Name</label>
                <input name="projectName" defaultValue={editingProj.name || ''} required />
              </div>
              <div className="fg">
                <label>Description</label>
                <textarea name="description" rows="2" defaultValue={editingProj.description || ''}></textarea>
              </div>
              <div className="fg">
                <label>Tech Stack (comma separated)</label>
                <input name="tech" placeholder="Python, Scikit-learn, Streamlit, Pandas" defaultValue={editingProj.tech || ''} />
              </div>
              <div className="fr">
                <div className="fg">
                  <label>Status</label>
                  <select name="status" defaultValue={editingProj.status || 'not started'} onChange={(e) => handleUpdateStatus(editingProj.id, e.target.value)}>
                    {['not started', 'in progress', 'completed', 'paused'].map(st => (
                      <option value={st} key={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div className="fg">
                  <label>GitHub Link</label>
                  <input name="githubLink" placeholder="https://github.com/..." defaultValue={editingProj.githubLink || ''} />
                </div>
              </div>
              <div className="fg">
                <label>Notes</label>
                <textarea name="notes" rows="2" defaultValue={editingProj.notes || ''}></textarea>
              </div>
              <div className="m-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setEditingProj(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
