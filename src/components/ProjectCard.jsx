import { useState } from 'react';
import ProjectTasksList from './ProjectTasksList';

export default function ProjectCard({ project, stats, tasks, idx, isExpanded, onToggleExpand, onDelete, onAddTask }) {
  const [quickTitle, setQuickTitle] = useState('');
  const isComplete = stats.pct === 100 && stats.total > 0;
  const projectTasks = tasks.filter(t => t.projectId === project.id);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    onAddTask({
      title: quickTitle.trim(),
      projectId: project.id,
      priority: 'med',
      tag: project.category.toLowerCase(),
      completed: false
    });
    setQuickTitle('');
  };

  return (
    <div
      className="project-card stagger-item"
      style={{ animationDelay: `${idx * 60}ms` }}
    >
      {isComplete && (
        <div style={{
          position:'absolute', top:12, right:12,
          background:'linear-gradient(135deg,#FFD700,#FFA500)',
          borderRadius:'99px', padding:'0.2rem 0.6rem',
          fontSize:'0.65rem', fontWeight:700, color:'#000',
          display:'flex', alignItems:'center', gap:4,
          zIndex: 2
        }}>
          <span className="material-icons-round" style={{ fontSize:'0.75rem' }}>star</span>
          Complete
        </div>
      )}

      <div className="project-card-header">
        <div className="project-card-icon" style={{ background: `${project.color}18`, color: project.color }}>
          <span className="material-icons-round">{project.icon}</span>
        </div>
        <span className="project-card-badge">{project.category}</span>
      </div>

      <div className="project-card-title">{project.title}</div>
      <div className="project-card-desc">{project.description}</div>

      <div className="project-progress">
        <div className="progress-bar-bg">
          <div
            className={`progress-bar-fill ${isComplete ? 'complete' : ''}`}
            style={{ width:`${stats.pct}%` }}
          />
        </div>
        <div className="progress-meta">
          <span className="progress-text">{stats.done}/{stats.total} tasks</span>
          <span className="progress-percent" style={{ color: isComplete ? '#16a34a' : undefined }}>
            {stats.pct}%
          </span>
        </div>
      </div>

      <form className="project-quick-add" onSubmit={handleQuickAdd}>
        <input 
          placeholder="Quick add pending task..." 
          value={quickTitle}
          onChange={e => setQuickTitle(e.target.value)}
        />
        <button type="submit" className="project-quick-add-btn">
          <span className="material-icons-round" style={{ fontSize: '1rem' }}>add</span>
        </button>
      </form>

      {isExpanded && (
        <ProjectTasksList tasks={projectTasks} color={project.color} />
      )}

      <div className="project-card-footer">
        <button
          className="btn btn-ghost"
          style={{ fontSize:'0.75rem', padding:'0.35rem 0.6rem', gap:'0.25rem' }}
          onClick={() => onToggleExpand(project.id)}
        >
          <span className="material-icons-round" style={{ fontSize:'1rem' }}>
            {isExpanded ? 'expand_less' : 'expand_more'}
          </span>
          {isExpanded ? 'Show Accomplishments' : `View Completed (${stats.done})`}
        </button>

        <button
          className="btn btn-danger"
          style={{ fontSize:'0.75rem', padding:'0.35rem 0.75rem', gap:'0.25rem' }}
          onClick={(e) => { e.stopPropagation(); onDelete(project.id); }}
        >
          <span className="material-icons-round" style={{ fontSize:'0.9rem' }}>delete</span>
        </button>
      </div>
    </div>
  );
}
