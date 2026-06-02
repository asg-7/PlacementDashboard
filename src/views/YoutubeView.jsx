import React, { useState } from 'react';

export default function YoutubeView({ state, mutateState, addToast }) {
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState('all');
  const [skillFilter, setSkillFilter] = useState('all');
  const [editingResource, setEditingResource] = useState(null); // null if closed, {} for new, or resource object for edit

  const s = state;
  const allResources = s.youtubeResources || [];

  // Sort resources by sequence
  const sortedResources = [...allResources].sort((a, b) => (a.sequence || 0) - (b.sequence || 0));

  // Compute unique channels and skills for filtering
  const channels = [...new Set(sortedResources.map(r => r.channel).filter(Boolean))].sort();
  const skills = [...new Set(sortedResources.map(r => r.skill).filter(Boolean))].sort();

  // Apply filters
  let filtered = sortedResources;
  if (search) {
    filtered = filtered.filter(r =>
      r.topic.toLowerCase().includes(search.toLowerCase()) ||
      r.channel.toLowerCase().includes(search.toLowerCase()) ||
      (r.notes || '').toLowerCase().includes(search.toLowerCase())
    );
  }
  if (channelFilter !== 'all') {
    filtered = filtered.filter(r => r.channel === channelFilter);
  }
  if (skillFilter !== 'all') {
    filtered = filtered.filter(r => r.skill === skillFilter);
  }

  const watchedStatuses = ['not started', 'watching', 'completed'];

  const totalCount = allResources.length;
  const completedCount = allResources.filter(r => r.status === 'completed').length;
  const watchingCount = allResources.filter(r => r.status === 'watching').length;

  const skillColors = {
    'ML': 'b-blue',
    'AI': 'b-purple',
    'DSA': 'b-rose',
    'System Design': 'b-amber',
    'Data Engineering': 'b-cyan',
    'Web Dev': 'b-green',
    'Python': 'b-cyan',
    'Automation': 'b-purple',
    'Placement Strategy': 'b-gray'
  };

  const handleUpdateStatus = (id, newStatus) => {
    mutateState(draft => {
      const r = draft.youtubeResources.find(x => x.id === id);
      if (r) {
        r.status = newStatus;
        const todayStr = new Date().toISOString().slice(0, 10);
        if (!draft.activity) draft.activity = {};
        if (newStatus === 'completed') {
          draft.activity[todayStr] = (draft.activity[todayStr] || 0) + 1;
        }
      }
    });
    addToast('Watch status updated ✓');
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this YouTube resource?')) return;
    mutateState(draft => {
      draft.youtubeResources = draft.youtubeResources.filter(x => x.id !== id);
    });
    addToast('Resource removed', 'var(--coral)');
  };

  const handleSave = (e) => {
    e.preventDefault();
    const form = e.target;
    const topic = form.topic.value.trim();
    if (!topic) {
      addToast('Topic name required', 'var(--coral)');
      return;
    }

    const channel = form.channel.value.trim();
    const skill = form.skill.value.trim();
    const playlist = form.playlist.value.trim();
    const sequence = parseInt(form.sequence.value) || (allResources.length + 1);
    const link = form.link.value.trim();
    const status = form.status.value;
    const notes = form.notes.value.trim();

    mutateState(draft => {
      if (!draft.youtubeResources) draft.youtubeResources = [];
      const obj = { topic, channel, skill, playlist, sequence, link, status, notes };

      if (editingResource.id) {
        const r = draft.youtubeResources.find(x => x.id === editingResource.id);
        if (r) Object.assign(r, obj);
      } else {
        const newId = '_' + Math.random().toString(36).substr(2, 9);
        draft.youtubeResources.push({ id: newId, ...obj });
      }
    });

    setEditingResource(null);
    addToast('Resource saved ✓');
  };

  return (
    <div style={{ animation: 'fade-in 0.4s ease-out' }}>
      <div className="ph">
        <div>
          <div className="ph-eyebrow">Learning Curriculum</div>
          <div className="ph-title">YouTube Resource Tracker</div>
          <div className="ph-sub">Sequenced video lists for placement preparation</div>
        </div>
        <button className="btn btn-primary" onClick={() => setEditingResource({})}>+ Add Resource</button>
      </div>

      <div className="g3" style={{ marginBottom: '20px' }}>
        <div className="metric">
          <div className="metric-val" style={{ color: 'var(--electric)' }}>{totalCount}</div>
          <div className="metric-lbl">Total Playlists</div>
          <div className="metric-sub">Sequenced for your profile</div>
        </div>
        <div className="metric">
          <div className="metric-val" style={{ color: 'var(--amber)' }}>{watchingCount}</div>
          <div className="metric-lbl">In Progress</div>
          <div className="metric-sub">Currently watching</div>
        </div>
        <div className="metric">
          <div className="metric-val" style={{ color: 'var(--volt)' }}>{completedCount}</div>
          <div className="metric-lbl">Completed</div>
          <div className="metric-sub">{totalCount > 0 ? Math.round(completedCount / totalCount * 100) : 0}% completion</div>
        </div>
      </div>

      <div className="sb" style={{ flexWrap: 'wrap', gap: '8px' }}>
        <input
          className="si"
          style={{ flex: 1, minWidth: '180px' }}
          placeholder="Search topics, channels, notes…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select style={{ width: '170px' }} value={channelFilter} onChange={(e) => setChannelFilter(e.target.value)}>
          <option value="all">All Channels</option>
          {channels.map(ch => (
            <option value={ch} key={ch}>{ch}</option>
          ))}
        </select>
        <select style={{ width: '160px' }} value={skillFilter} onChange={(e) => setFilter => setSkillFilter(e.target.value)}>
          <option value="all">All Skills</option>
          {skills.map(sk => (
            <option value={sk} key={sk}>{sk}</option>
          ))}
        </select>
      </div>

      <div className="card">
        <div className="tw">
          <table>
            <thead>
              <tr>
                <th style={{ width: '50px' }}>Seq</th>
                <th>Topic</th>
                <th>Channel</th>
                <th>Skill</th>
                <th>Playlist / Video</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: 'var(--t3)' }}>
                    No YouTube resources match the active filters.
                  </td>
                </tr>
              ) : (
                filtered.map(r => {
                  const skillCls = skillColors[r.skill] || 'b-gray';
                  return (
                    <tr key={r.id}>
                      <td><span className="badge b-cyan" style={{ fontFamily: 'var(--mono)' }}>#{r.sequence || '-'}</span></td>
                      <td><div style={{ fontWeight: 700, color: 'var(--t1)', fontSize: '13px' }}>{r.topic}</div></td>
                      <td><div style={{ fontFamily: 'var(--mono)', color: 'var(--t2)', fontSize: '12px' }}>{r.channel}</div></td>
                      <td><span className={`badge ${skillCls}`}>{r.skill || 'Other'}</span></td>
                      <td>
                        {r.link ? (
                          <a href={r.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--electric)', fontWeight: 600, decoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            {r.playlist || 'Watch Video'} <span style={{ fontSize: '10px' }}>↗</span>
                          </a>
                        ) : (
                          <span style={{ color: 'var(--t2)' }}>{r.playlist || '—'}</span>
                        )}
                      </td>
                      <td>
                        <select className="ss" value={r.status || 'not started'} onChange={(e) => handleUpdateStatus(r.id, e.target.value)}>
                          {watchedStatuses.map(st => (
                            <option value={st} key={st}>{st}</option>
                          ))}
                        </select>
                      </td>
                      <td><div style={{ fontSize: '11px', color: 'var(--t3)', maxWidth: '200px', lineHeight: '1.4' }}>{r.notes || '—'}</div></td>
                      <td>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button className="btn btn-ghost btn-xs" onClick={() => setEditingResource(r)}>Edit</button>
                          <button className="btn btn-danger btn-xs" onClick={() => handleDelete(r.id)}>Del</button>
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

      {/* EDIT MODAL */}
      {editingResource !== null && (
        <div className="moverlay" onClick={() => setEditingResource(null)}>
          <div className="mbox" onClick={(e) => e.stopPropagation()}>
            <div className="mtitle">
              {editingResource.id ? 'Edit YouTube Resource' : 'Add YouTube Resource'}
              <button className="mclose" onClick={() => setEditingResource(null)}>×</button>
            </div>
            <form onSubmit={handleSave} className="modal-scroll">
              <div className="fg">
                <label>Topic Name</label>
                <input name="topic" defaultValue={editingResource.topic || ''} required />
              </div>
              <div className="fr">
                <div className="fg">
                  <label>Channel</label>
                  <input name="channel" defaultValue={editingResource.channel || ''} />
                </div>
                <div className="fg">
                  <label>Skill Domain</label>
                  <input name="skill" placeholder="ML, AI, DSA, Web Dev..." defaultValue={editingResource.skill || ''} />
                </div>
              </div>
              <div className="fr">
                <div className="fg">
                  <label>Playlist/Video Title</label>
                  <input name="playlist" defaultValue={editingResource.playlist || ''} />
                </div>
                <div className="fg">
                  <label>Sequence (Recommended Order)</label>
                  <input name="sequence" type="number" min="1" defaultValue={editingResource.sequence || (allResources.length + 1)} />
                </div>
              </div>
              <div className="fr">
                <div className="fg">
                  <label>External Link (URL)</label>
                  <input name="link" placeholder="https://youtube.com/..." defaultValue={editingResource.link || ''} />
                </div>
                <div className="fg">
                  <label>Watched Status</label>
                  <select name="status" defaultValue={editingResource.status || 'not started'}>
                    {watchedStatuses.map(st => (
                      <option value={st} key={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="fg">
                <label>Notes</label>
                <textarea name="notes" rows="2" defaultValue={editingResource.notes || ''}></textarea>
              </div>
              <div className="m-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setEditingResource(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
