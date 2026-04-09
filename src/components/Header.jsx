import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useTasks } from '../context/TaskContext';

export default function Header({ page, setSidebarOpen }) {
  const { theme, toggleTheme } = useTheme();
  const { user, notifications, clearNotifications } = useTasks();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const PAGE_TITLES = {
    projects: 'Projects',
    tasks: 'Task Board',
    settings: 'Settings',
  };

  const PAGE_ICONS = {
    projects: 'folder',
    tasks: 'dashboard',
    settings: 'settings',
  };

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfile(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="topbar">
      {/* Mobile Menu Trigger */}
      <button className="icon-btn mobile-only" onClick={() => setSidebarOpen(true)}>
        <span className="material-icons-round">menu</span>
      </button>

      <div className="topbar-left">
        <span className="material-icons-round topbar-icon">{PAGE_ICONS[page]}</span>
        <h2 className="topbar-title">{PAGE_TITLES[page]}</h2>
      </div>

      <div className="topbar-actions">
        {/* Search simulation */}
        <div className="header-search desktop-only">
          <span className="material-icons-round">search</span>
          <input type="text" placeholder="Search everything..." />
        </div>

        {/* Theme Toggle */}
        <button 
          className={`theme-toggle ${theme === 'dark' ? 'dark' : ''}`}
          onClick={toggleTheme}
          title="Toggle Theme"
        >
          <div className="theme-toggle-thumb">
            <span className="material-icons-round">
              {theme === 'dark' ? 'dark_mode' : 'light_mode'}
            </span>
          </div>
        </button>

        {/* Notifications */}
        <div className="header-dropdown-container" ref={notifRef}>
          <button 
            className={`icon-btn ${notifications.some(n => !n.read) ? 'has-unread' : ''}`} 
            onClick={() => setShowNotifs(!showNotifs)}
          >
            <span className="material-icons-round">notifications</span>
            {notifications.length > 0 && <span className="notif-badge">{notifications.length}</span>}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="dropdown-panel notifications-panel"
              >
                <div className="dropdown-header  ">
                  <h3>Notifications</h3>
                  <button onClick={clearNotifications}>Clear all</button>
                </div>
                <div className="dropdown-content">
                  {notifications.length === 0 ? (
                    <div className="dropdown-empty">
                      <span className="material-icons-round">notifications_off</span>
                      <p>All caught up!</p>
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className={`notif-item ${n.type}`}>
                        <div className="notif-dot" />
                        <div className="notif-body">
                          <p>{n.message}</p>
                          <span>{n.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="header-dropdown-container" ref={profileRef}>
          <div 
            className="header-avatar" 
            onClick={() => setShowProfile(!showProfile)}
            style={{ backgroundImage: user.avatar ? `url(${user.avatar})` : 'none' }}
          >
            {!user.avatar && user.name.charAt(0)}
          </div>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="dropdown-panel profile-panel"
              >
                <div className="profile-dropdown-info">
                  <div className="profile-large-avatar" style={{ backgroundImage: user.avatar ? `url(${user.avatar})` : 'none' }}>
                    {!user.avatar && user.name.charAt(0)}
                  </div>
                  <div className="profile-text">
                    <h4>{user.name}</h4>
                    <p>{user.email}</p>
                  </div>
                </div>
                <div className="dropdown-divider" />
                <button className="dropdown-action" onClick={() => {
                  setShowProfile(false);
                  window.dispatchEvent(new CustomEvent('open-profile-modal'));
                }}>
                  <span className="material-icons-round">person_outline</span>
                  Edit Profile
                </button>
                <button className="dropdown-action">
                  <span className="material-icons-round">help_outline</span>
                  Support
                </button>
                <div className="dropdown-divider" />
                <button className="dropdown-action logout">
                  <span className="material-icons-round">logout</span>
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
