import React, { useState } from 'react';

export default function ProjectsView({ state, mutateState, addToast, resetProjectsOnly }) {
  const [editingProj, setEditingProj] = useState(null); // null if closed, {} for new, or project object for edit
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'completed', 'in progress', 'not started'

  const s = state;
  const statusColors = {
    'not started': 'var(--t3)',
    'in progress': 'var(--electric)',
    'completed': 'var(--volt)',
    'paused': 'var(--amber)'
  };
  const checkpoints = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  const hasOldProjects = s.projects && s.projects.some(p => 
    p.name.includes('LangChain RAG Chatbot') || 
    p.name.includes('Time Series Forecasting') || 
    p.name.includes('Tata Steel ML Work') || 
    p.name.includes('Salary Predictor – Streamlit App') ||
    p.name.includes('Salary Predictor - Streamlit App')
  );

  const filteredProjects = s.projects.filter(p => {
    if (statusFilter === 'all') return true;
    return p.status === statusFilter;
  });

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
    const liveUrl = form.liveUrl.value.trim();
    const notes = form.notes.value.trim();
    const deploymentStatus = liveUrl ? 'Deployed' : 'Not Deployed';

    mutateState(draft => {
      const obj = { name, description, tech, status, githubLink, liveUrl, notes, deploymentStatus };
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

      {hasOldProjects && (
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)', 
          border: '1px dashed var(--electric)', 
          borderRadius: '12px',
          padding: '16px 20px', 
          marginBottom: '24px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: '16px',
          animation: 'fade-in 0.3s ease-out'
        }}>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--t1)', fontSize: '14px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🚀</span> Sync GitHub Portfolio Projects
            </div>
            <div style={{ color: 'var(--t2)', fontSize: '12.5px', lineHeight: '1.4' }}>
              Your dashboard is currently showing outdated placeholder projects. Click <strong>Sync Now</strong> to load your actual projects from GitHub (ResumeIQ, EV Battery Diagnostics, Machine Delay Breakdown System, etc.) with completed statuses.
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={resetProjectsOnly} style={{ whiteSpace: 'nowrap' }}>
            Sync Now
          </button>
        </div>
      )}

      {/* Warning banner for missing live URLs */}
      {s.projects.filter(p => p.status === 'completed' && !p.liveUrl).length > 0 && (
        <div style={{ background: 'var(--amber-dim)', border: '1px solid rgba(255, 184, 0, 0.25)', borderRadius: '12px', padding: '12px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ fontSize: '20px' }}>⚠️</div>
          <div style={{ flex: 1, fontSize: '12.5px', color: 'var(--t1)' }}>
            <strong>Missing Live Deployment URLs:</strong> You have completed projects without live links. Recruiters prioritize projects they can interact with!
          </div>
        </div>
      )}

      {/* Status Filter Tab Bar */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        gap: '8px', 
        marginBottom: '20px', 
        borderBottom: '1px solid rgba(255,255,255,0.08)', 
        paddingBottom: '12px',
        alignItems: 'center'
      }}>
        <span style={{ fontSize: '10px', color: 'var(--t3)', marginRight: '8px', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'var(--mono)' }}>Filter:</span>
        {['all', 'completed', 'in progress', 'not started'].map(status => {
          const count = status === 'all' 
            ? s.projects.length 
            : s.projects.filter(p => p.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{
                background: statusFilter === status ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                border: '1px solid',
                borderColor: statusFilter === status ? 'var(--electric)' : 'rgba(255,255,255,0.08)',
                color: statusFilter === status ? 'var(--electric)' : 'var(--t3)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: statusFilter === status ? '700' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
              className="filter-btn"
            >
              {status} ({count})
            </button>
          );
        })}
      </div>

      <div className="g2">
        {filteredProjects.length === 0 ? (
          <div className="card" style={{ gridColumn: 'span 2', textAlign: 'center', padding: '40px', color: 'var(--t3)' }}>
            {statusFilter === 'all' 
              ? 'No projects logged yet. Click "+ Add Project" to record your work!' 
              : `No projects marked as "${statusFilter}" yet.`}
          </div>
        ) : (
          filteredProjects.map(p => (
            <div className="proj-card" key={p.id}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                <div className="proj-name">{p.name}</div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span className={getStatusBadgeClass(p.status)}>{p.status}</span>
                  <span className={`badge ${p.liveUrl ? 'b-green' : 'b-amber'}`} style={{ fontSize: '10px' }}>
                    {p.liveUrl ? '🟢 Deployed' : '🟡 In Progress'}
                  </span>
                </div>
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
              
              {!p.liveUrl && p.status === 'completed' && (
                <div style={{ marginTop: '10px', fontSize: '11px', display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--t3)' }}>Deploy Now:</span>
                  <a href="https://vercel.com/new" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-xs" style={{ padding: '2px 6px', fontSize: '10px' }}>Vercel</a>
                  <a href="https://render.com/" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-xs" style={{ padding: '2px 6px', fontSize: '10px' }}>Render</a>
                  <a href="https://huggingface.co/spaces" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-xs" style={{ padding: '2px 6px', fontSize: '10px' }}>HF Spaces</a>
                </div>
              )}

              {p.notes && (
                <div style={{ fontSize: '12px', color: 'var(--t3)', lineHeight: '1.4' }}>{p.notes}</div>
              )}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '10px' }}>
                {p.githubLink && (
                  <a href={p.githubLink} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none' }}>
                    GitHub ↗
                  </a>
                )}
                {p.liveUrl ? (
                  <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                    Live Demo ↗
                  </a>
                ) : (
                  <button className="btn btn-ghost btn-sm" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                    (in progress)
                  </button>
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
                <label>Live Demo URL (Deployment URL)</label>
                <input name="liveUrl" placeholder="https://..." defaultValue={editingProj.liveUrl || ''} />
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
