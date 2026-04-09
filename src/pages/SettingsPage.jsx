import { useTheme } from '../context/ThemeContext';
import { useTasks } from '../context/TaskContext';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { tasks, projects } = useTasks();

  const totalDone = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks ? Math.round((totalDone / totalTasks) * 100) : 0;

  function clearData() {
    if (window.confirm('This will reset all projects and tasks. Are you sure?')) {
      localStorage.removeItem('ef-projects');
      localStorage.removeItem('ef-tasks');
      window.location.reload();
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Personalize your Editorial Focus workspace.</p>
      </div>

      {/* Appearance */}
      <div className="settings-section stagger-item" style={{ animationDelay:'0ms' }}>
        <div className="settings-section-title">Appearance</div>

        <div className="settings-item">
          <div className="settings-item-left">
            <div className="settings-item-icon">
              <span className="material-icons-round">{theme === 'dark' ? 'dark_mode' : 'light_mode'}</span>
            </div>
            <div>
              <div className="settings-item-title">Theme</div>
              <div className="settings-item-subtitle">{theme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled'}</div>
            </div>
          </div>
          <button className={`theme-toggle ${theme === 'dark' ? 'dark' : ''}`} onClick={toggleTheme} title="Toggle theme">
            <div className="theme-toggle-thumb">
              <span className="material-icons-round">{theme === 'dark' ? 'dark_mode' : 'light_mode'}</span>
            </div>
          </button>
        </div>

        <div className="settings-item">
          <div className="settings-item-left">
            <div className="settings-item-icon">
              <span className="material-icons-round">palette</span>
            </div>
            <div>
              <div className="settings-item-title">Design System</div>
              <div className="settings-item-subtitle">The Editorial Architect — Blue Tonal Spot</div>
            </div>
          </div>
          <span style={{
            background:'var(--primary)', width:20, height:20,
            borderRadius:'50%', display:'inline-block',
            boxShadow:'0 0 0 3px var(--surface-container-highest)',
          }} />
        </div>

        <div className="settings-item">
          <div className="settings-item-left">
            <div className="settings-item-icon">
              <span className="material-icons-round">font_download</span>
            </div>
            <div>
              <div className="settings-item-title">Typography</div>
              <div className="settings-item-subtitle">Manrope (headlines) · Inter (body)</div>
            </div>
          </div>
          <span style={{ fontSize:'0.75rem', color:'var(--outline)', fontFamily:'var(--font-headline)', fontWeight:700 }}>Aa</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="settings-section stagger-item" style={{ animationDelay:'60ms' }}>
        <div className="settings-section-title">Your Stats</div>

        <div className="settings-item">
          <div className="settings-item-left">
            <div className="settings-item-icon">
              <span className="material-icons-round">folder</span>
            </div>
            <div>
              <div className="settings-item-title">Total Projects</div>
              <div className="settings-item-subtitle">All workstreams in your workspace</div>
            </div>
          </div>
          <span style={{ fontFamily:'var(--font-headline)', fontWeight:800, fontSize:'1.25rem', color:'var(--primary)' }}>
            {projects.length}
          </span>
        </div>

        <div className="settings-item">
          <div className="settings-item-left">
            <div className="settings-item-icon">
              <span className="material-icons-round">task_alt</span>
            </div>
            <div>
              <div className="settings-item-title">Tasks Completed</div>
              <div className="settings-item-subtitle">{totalDone} of {totalTasks} total tasks</div>
            </div>
          </div>
          <span style={{ fontFamily:'var(--font-headline)', fontWeight:800, fontSize:'1.25rem', color:'#16a34a' }}>
            {completionRate}%
          </span>
        </div>

        <div className="settings-item">
          <div className="settings-item-left">
            <div className="settings-item-icon" style={{ background:'rgba(255,215,0,0.15)', color:'#d97706' }}>
              <span className="material-icons-round">star</span>
            </div>
            <div>
              <div className="settings-item-title">Completed Projects</div>
              <div className="settings-item-subtitle">Projects with 100% tasks done</div>
            </div>
          </div>
          <span style={{ fontFamily:'var(--font-headline)', fontWeight:800, fontSize:'1.25rem', color:'#d97706' }}>
            {projects.filter(p => {
              const pts = tasks.filter(t => t.projectId === p.id);
              return pts.length > 0 && pts.every(t => t.completed);
            }).length}
          </span>
        </div>

        {/* Mini Progress Bar */}
        <div style={{ padding:'1rem 1.5rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.5rem' }}>
            <span style={{ fontSize:'0.8rem', color:'var(--on-surface-variant)', fontWeight:500 }}>Overall Completion</span>
            <span style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--primary)' }}>{completionRate}%</span>
          </div>
          <div className="progress-bar-bg">
            <div
              className={`progress-bar-fill ${completionRate === 100 ? 'complete' : ''}`}
              style={{ width:`${completionRate}%`, height:6 }}
            />
          </div>
        </div>
      </div>

      {/* About */}
      <div className="settings-section stagger-item" style={{ animationDelay:'120ms' }}>
        <div className="settings-section-title">About</div>

        <div className="settings-item">
          <div className="settings-item-left">
            <div className="settings-item-icon">
              <span className="material-icons-round">info</span>
            </div>
            <div>
              <div className="settings-item-title">Editorial Focus</div>
              <div className="settings-item-subtitle">Version 1.0.0 · Powered by React + Vite</div>
            </div>
          </div>
        </div>

        <div className="settings-item">
          <div className="settings-item-left">
            <div className="settings-item-icon">
              <span className="material-icons-round">brush</span>
            </div>
            <div>
              <div className="settings-item-title">Design by Stitch</div>
              <div className="settings-item-subtitle">The Editorial Architect design system</div>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="settings-section stagger-item" style={{ animationDelay:'180ms', border:'1px solid rgba(168,56,54,0.15)', borderRadius:'var(--radius-lg)', overflow:'hidden' }}>
        <div className="settings-section-title" style={{ color:'var(--error)' }}>Danger Zone</div>
        <div className="settings-item">
          <div className="settings-item-left">
            <div className="settings-item-icon" style={{ background:'rgba(168,56,54,0.1)', color:'var(--error)' }}>
              <span className="material-icons-round">delete_forever</span>
            </div>
            <div>
              <div className="settings-item-title">Reset All Data</div>
              <div className="settings-item-subtitle">Permanently removes all projects and tasks</div>
            </div>
          </div>
          <button className="btn btn-danger" style={{ fontSize:'0.8rem' }} onClick={clearData}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
