import { useTasks } from '../context/TaskContext';

const NAV = [
  { key: 'projects', icon: 'folder', label: 'Projects' },
  { key: 'tasks',    icon: 'check_circle', label: 'Tasks' },
  { key: 'settings', icon: 'settings', label: 'Settings' },
];

export default function Sidebar({ page, setPage, isOpen, setIsOpen }) {
  const { tasks } = useTasks();
  const pendingCount = tasks.filter(t => !t.completed).length;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',zIndex:99 }}
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <span className="material-icons-round" style={{ fontSize:'1.1rem' }}>edit_note</span>
          </div>
          <span  className="sidebar-logo-text" style={{cursor : 'pointer' }} >Vision Focus</span>
        </div>

        {/* Nav */}
        <p className="sidebar-section-label">Navigation</p>
        <nav className="sidebar-nav">
          {NAV.map(item => (
            <button
              key={item.key}
              className={`sidebar-nav-item ${page === item.key ? 'active' : ''}`}
              onClick={() => { setPage(item.key); setIsOpen(false); }}
            >
              <span className="material-icons-round">{item.icon}</span>
              {item.label}
              {item.key === 'tasks' && pendingCount > 0 && (
                <span style={{
                  marginLeft:'auto', background:'var(--primary)',
                  color:'var(--on-primary)', borderRadius:'99px',
                  fontSize:'0.65rem', fontWeight:700,
                  padding:'0.1rem 0.45rem', minWidth:'18px', textAlign:'center'
                }}>{pendingCount}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom stats */}
        <div className="sidebar-bottom">
          <div style={{
            background:'var(--surface-container)',
            borderRadius:'var(--radius-md)',
            padding:'0.875rem',
            fontSize:'0.8rem',
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.5rem' }}>
              <span style={{ color:'var(--on-surface-variant)' }}>Overall Progress</span>
              <span style={{ color:'var(--primary)', fontWeight:700 }}>
                {tasks.length ? Math.round((tasks.filter(t=>t.completed).length/tasks.length)*100) : 0}%
              </span>
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width:`${tasks.length ? (tasks.filter(t=>t.completed).length/tasks.length)*100 : 0}%` }}
              />
            </div>
            <div style={{ marginTop:'0.5rem', color:'var(--on-surface-variant)', fontSize:'0.72rem' }}>
              {tasks.filter(t=>t.completed).length} of {tasks.length} tasks done
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
