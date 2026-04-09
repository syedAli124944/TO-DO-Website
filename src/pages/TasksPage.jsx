import { useState, useMemo } from 'react';
import { useTasks } from '../context/TaskContext';
import { SkeletonTaskItem } from '../components/SkeletonCard';
import TaskBoard from '../components/TaskBoard';

const PRIORITIES = ['all', 'high', 'med', 'low'];
const TAGS = ['all','work','personal','health','finance','learning'];

export default function TasksPage() {
  const { tasks, projects, isLoading, addTask } = useTasks();
  const [priority, setPriority] = useState('all');
  const [tag, setTag]           = useState('all');
  const [search, setSearch]     = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title:'', description:'', projectId:'', priority:'med', tag:'work', due:'' });

  // Simplified filtering for the board view - made extremely robust
  const processedTasks = useMemo(() => {
    if (!Array.isArray(tasks)) return [];
    
    return tasks
      .filter(t => {
        const matchesPriority = priority === 'all' || t.priority === priority;
        const matchesTag = tag === 'all' || t.tag === tag;
        const matchesSearch = !search || (t.title && t.title.toLowerCase().includes(search.toLowerCase()));
        return matchesPriority && matchesTag && matchesSearch;
      })
      .sort((a, b) => {
        const pOrder = { high: 0, med: 1, low: 2 };
        return (pOrder[a.priority] ?? 2) - (pOrder[b.priority] ?? 2);
      });
  }, [tasks, priority, tag, search]);

  function handleAdd(e) {
    e.preventDefault();
    if (!form.title || !form.title.trim()) return;
    addTask({
      ...form,
      title: form.title.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    });
    setForm({ title:'', description:'', projectId:'', priority:'med', tag:'work', due:'' });
    setShowModal(false);
  }

  return (
    <div className="page" style={{ height: 'calc(100vh - 72px)', display: 'flex', flexDirection: 'column' }}>
      <div className="page-header" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
          <div>
            <h1>Task Board</h1>
            <p>
              {processedTasks.length === tasks.length 
                ? `Showing all ${tasks.length} tasks`
                : `Showing ${processedTasks.length} of ${tasks.length} tasks filtered`
              }
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <span className="material-icons-round">add</span>
            New Task
          </button>
        </div>
      </div>

      {/* Search + Priority Filters */}
      <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap', marginBottom:'1.5rem', alignItems:'center' }}>
        <div className="search-bar" style={{ margin:0, flex:'1', minWidth:250 }}>
          <span className="material-icons-round">search</span>
          <input placeholder="Search tasks by name…" value={search} onChange={e => setSearch(e.target.value)} />
          {search && (
            <button onClick={() => setSearch('')} style={{ border:'none',background:'none',cursor:'pointer',color:'var(--outline)',display:'flex' }}>
              <span className="material-icons-round" style={{ fontSize:'1rem' }}>close</span>
            </button>
          )}
        </div>

        <select
          className="form-select"
          style={{ width:'auto', padding:'0.55rem 0.875rem' }}
          value={priority}
          onChange={e => setPriority(e.target.value)}
        >
          {PRIORITIES.map(p => <option key={p} value={p}>{p === 'all' ? 'Priority: All' : p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
        </select>

        <select
          className="form-select"
          style={{ width:'auto', padding:'0.55rem 0.875rem' }}
          value={tag}
          onChange={e => setTag(e.target.value)}
        >
          {TAGS.map(t => <option key={t} value={t}>{t === 'all' ? 'Category: All' : t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
        </select>
      </div>

      {/* Board Layout */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '3rem', position:'relative' }}>
        {isLoading ? (
          <div className="task-board">
            <div className="task-column">
              <div className="column-content">{[0,1,2].map(i => <SkeletonTaskItem key={i} />)}</div>
            </div>
            <div className="task-column">
              <div className="column-content">{[0,1].map(i => <SkeletonTaskItem key={i} />)}</div>
            </div>
          </div>
        ) : (
          <>
            {processedTasks.length === 0 && (
              <div className="empty-state" style={{ padding:'6rem 1rem' }}>
                <span className="material-icons-round" style={{ fontSize:'4rem', opacity:0.3 }}>task_alt</span>
                <h3>No tasks match your filters</h3>
                <p>Try clearing your search or switching priority/categories.</p>
                <button className="btn btn-ghost" onClick={() => { setPriority('all'); setTag('all'); setSearch(''); }}>Clear All Filters</button>
              </div>
            )}
            <TaskBoard tasks={processedTasks} projects={projects} />
          </>
        )}
      </div>

      {/* Add Task Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create New Task</h2>
              <button className="icon-btn" onClick={() => setShowModal(false)}>
                <span className="material-icons-round">close</span>
              </button>
            </div>
            <form onSubmit={handleAdd}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Task Title</label>
                  <input className="form-input" placeholder="e.g. Finalize building section" value={form.title} onChange={e => setForm(f => ({ ...f, title:e.target.value }))} autoFocus required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" placeholder="Detailed instructions..." value={form.description} onChange={e => setForm(f => ({ ...f, description:e.target.value }))} />
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Priority Level</label>
                    <select className="form-select" value={form.priority} onChange={e => setForm(f => ({ ...f, priority:e.target.value }))}>
                      <option value="high">High Priority</option>
                      <option value="med">Medium</option>
                      <option value="low">Low Priority</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={form.tag} onChange={e => setForm(f => ({ ...f, tag:e.target.value }))}>
                      {['work','personal','health','finance','learning'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Project</label>
                    <select className="form-select" value={form.projectId} onChange={e => setForm(f => ({ ...f, projectId:e.target.value }))}>
                      <option value="">Independent Task</option>
                      {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Target Date</label>
                    <input type="date" className="form-input" value={form.due} onChange={e => setForm(f => ({ ...f, due:e.target.value }))} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
