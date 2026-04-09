import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { SkeletonProjectCard } from '../components/SkeletonCard';
import ProjectCard from '../components/ProjectCard';

const ICONS = ['account_balance','eco','home_work','memory','work','school','fitness_center','shopping_cart','beach_access','code'];
const CATEGORIES = ['Work','Personal','Health','Finance','Learning'];

export default function ProjectsPage() {
  const { projects, tasks, isLoading, getProjectStats, addProject, deleteProject, addTask } = useTasks();
  const [search, setSearch]     = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]         = useState({ title:'', description:'', category:'Work', icon:'folder', color:'#005eb6' });
  const [expandedProjects, setExpandedProjects] = useState({});

  const toggleExpand = (id) => {
    setExpandedProjects(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalDone  = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => {
    const s = getProjectStats(p.id);
    return s.pct < 100;
  }).length;

  function handleAdd(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    addProject(form);
    setForm({ title:'', description:'', category:'Work', icon:'folder', color:'#005eb6' });
    setShowModal(false);
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Projects</h1>
        <p>A curated overview of your architectural and design workstreams.</p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {isLoading ? (
          [0,1,2,3].map(i => (
            <div key={i} className="stat-card">
              <div className="skeleton" style={{ width:60, height:32, borderRadius:'var(--radius-sm)', marginBottom:8 }} />
              <div className="skeleton skeleton-line" style={{ width:'60%', height:10 }} />
            </div>
          ))
        ) : (
          <>
            <div className="stat-card stagger-item" style={{ animationDelay:'0ms' }}>
              <div className="stat-value">{totalProjects}</div>
              <div className="stat-label">Total Projects</div>
            </div>
            <div className="stat-card stagger-item" style={{ animationDelay:'60ms' }}>
              <div className="stat-value">{activeProjects}</div>
              <div className="stat-label">Active</div>
            </div>
            <div className="stat-card stagger-item" style={{ animationDelay:'120ms' }}>
              <div className="stat-value">{totalDone}</div>
              <div className="stat-label">Tasks Done</div>
            </div>
            <div className="stat-card stagger-item" style={{ animationDelay:'180ms' }}>
              <div className="stat-value">{totalTasks ? Math.round(totalDone/totalTasks*100) : 0}%</div>
              <div className="stat-label">Completion</div>
            </div>
          </>
        )}
      </div>

      {/* Search */}
      <div className="search-bar">
        <span className="material-icons-round">search</span>
        <input
          placeholder="Search projects…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{ border:'none',background:'none',cursor:'pointer',color:'var(--outline)',display:'flex' }}>
            <span className="material-icons-round" style={{ fontSize:'1rem' }}>close</span>
          </button>
        )}
      </div>

      <p className="section-title">All Projects</p>

      {isLoading ? (
        <div className="cards-grid">
          {[0,1,2,3].map(i => <SkeletonProjectCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span className="material-icons-round">folder_off</span>
          <h3>No projects found</h3>
          <p>Try a different search term or create a new project.</p>
        </div>
      ) : (
        <div className="cards-grid">
          {filtered.map((project, idx) => (
            <ProjectCard 
              key={project.id}
              project={project}
              idx={idx}
              stats={getProjectStats(project.id)}
              tasks={tasks}
              isExpanded={expandedProjects[project.id]}
              onToggleExpand={toggleExpand}
              onDelete={deleteProject}
              onAddTask={addTask}
            />
          ))}
        </div>
      )}

      {/* FAB */}
      <button className="fab" onClick={() => setShowModal(true)} title="New Project">
        <span className="material-icons-round">add</span>
      </button>

      {/* Add Project Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">New Project</h2>
              <button className="icon-btn" onClick={() => setShowModal(false)}>
                <span className="material-icons-round">close</span>
              </button>
            </div>
            <form onSubmit={handleAdd}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Project Name</label>
                  <input className="form-input" placeholder="e.g. Metro Library 2025" value={form.title} onChange={e => setForm(f => ({ ...f, title:e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" placeholder="Briefly describe this project…" value={form.description} onChange={e => setForm(f => ({ ...f, description:e.target.value }))} />
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category:e.target.value }))}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Color</label>
                    <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color:e.target.value }))}
                      style={{ width:'100%', height:42, border:'none', borderRadius:'var(--radius-md)', cursor:'pointer', background:'var(--surface-container-highest)', padding:'2px 4px' }} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Icon</label>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
                    {ICONS.map(icon => (
                      <button key={icon} type="button"
                        onClick={() => setForm(f => ({ ...f, icon }))}
                        style={{
                          width:38, height:38, borderRadius:'var(--radius-md)', border:'2px solid',
                          borderColor: form.icon === icon ? 'var(--primary)' : 'transparent',
                          background: form.icon === icon ? 'var(--secondary-container)' : 'var(--surface-container)',
                          color: form.icon === icon ? 'var(--primary)' : 'var(--on-surface-variant)',
                          cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                        }}
                      >
                        <span className="material-icons-round" style={{ fontSize:'1.1rem' }}>{icon}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <span className="material-icons-round" style={{ fontSize:'1rem' }}>add</span>
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
