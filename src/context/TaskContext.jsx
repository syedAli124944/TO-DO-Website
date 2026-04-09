/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const TaskContext = createContext(null);

const INITIAL_PROJECTS = [
  {
    id: 'p1',
    title: 'Metropolitan Library 2024',
    description: 'Public Infrastructure & Civic Design — a landmark architectural project for the city.',
    category: 'Work',
    icon: 'account_balance',
    color: '#005eb6',
  },
  {
    id: 'p2',
    title: 'Eco-Sustainable Resort Identity',
    description: 'Redefining luxury travel through carbon-neutral branding and visual language.',
    category: 'Work',
    icon: 'eco',
    color: '#16a34a',
  },
  {
    id: 'p3',
    title: 'Heritage Loft Restoration',
    description: 'Archive and research phase for the historic district revitalization project.',
    category: 'Personal',
    icon: 'home_work',
    color: '#7c3aed',
  },
  {
    id: 'p4',
    title: 'Quantum Tech Campus',
    description: 'Master planning and digital wayfinding systems for next-gen tech hub.',
    category: 'Work',
    icon: 'memory',
    color: '#d97706',
  },
];

const INITIAL_TASKS = [
  { id: 't1', projectId: 'p1', title: 'Site Analysis Report', description: 'Complete geotechnical survey review', priority: 'high', due: '2026-04-15', tag: 'work', completed: false },
  { id: 't2', projectId: 'p1', title: 'Stakeholder Presentation', description: 'Prepare slides for city council', priority: 'high', due: '2026-04-18', tag: 'work', completed: false },
  { id: 't3', projectId: 'p1', title: 'Budget Finalization', description: 'Review contractor bids', priority: 'med', due: '2026-04-20', tag: 'finance', completed: true },
  { id: 't4', projectId: 'p2', title: 'Brand Identity Moodboard', description: 'Create visual direction for resort', priority: 'med', due: '2026-04-12', tag: 'work', completed: false },
  { id: 't5', projectId: 'p2', title: 'Logo Concept Drafts', description: 'Present 3 logo directions', priority: 'high', due: '2026-04-14', tag: 'work', completed: true },
  { id: 't6', projectId: 'p3', title: 'Historical Records Review', description: 'Archive documents from 1920s', priority: 'low', due: '2026-04-25', tag: 'personal', completed: false },
  { id: 't7', projectId: 'p4', title: 'Campus Master Plan v2', description: 'Incorporate feedback from Phase 1', priority: 'high', due: '2026-04-16', tag: 'work', completed: false },
  { id: 't8', projectId: 'p4', title: 'Digital Wayfinding Prototype', description: 'Build interactive demo', priority: 'med', due: '2026-04-22', tag: 'learning', completed: false },
];

export function TaskProvider({ children }) {
  const [projects, setProjects] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ef-projects')) || INITIAL_PROJECTS; }
    catch { return INITIAL_PROJECTS; }
  });

  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ef-tasks')) || INITIAL_TASKS; }
    catch { return INITIAL_TASKS; }
  });

  const [celebration, setCelebration] = useState(null); // { projectId, type }
  const [isLoading, setIsLoading] = useState(true);

  // User Profile State
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ef-user')) || { name: 'Editorial Architect', email: 'architect@editorial.com', avatar: null }; }
    catch { return { name: 'Editorial Architect', email: 'architect@editorial.com', avatar: null }; }
  });

  // Notifications State
  const [notifications, setNotifications] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ef-notifications')) || []; }
    catch { return []; }
  });

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => { localStorage.setItem('ef-projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('ef-tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('ef-user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('ef-notifications', JSON.stringify(notifications)); }, [notifications]);

  const addNotification = useCallback((message, type = 'info') => {
    setNotifications(prev => [{
      id: Date.now(),
      message,
      type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    }, ...prev].slice(0, 10)); // Keep only last 10
  }, []);

  const addProject = useCallback((project) => {
    setProjects(prev => [...prev, { ...project, id: `p${Date.now()}` }]);
    addNotification(`Project "${project.title}" created.`, 'success');
  }, [addNotification]);

  const addTask = useCallback((task) => {
    setTasks(prev => [...prev, { ...task, id: `t${Date.now()}`, completed: false }]);
    addNotification(`Task "${task.title}" added to queue.`, 'info');
  }, [addNotification]);

  const toggleTask = useCallback((taskId) => {
    setTasks(prev => {
      const task = prev.find(t => t.id === taskId);
      const updated = prev.map(t =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      
      if (task) {
        if (!task.completed) {
          addNotification(`Task "${task.title}" completed.`, 'success');
          // Check if project is now 100% complete
          const projectTasks = updated.filter(t => t.projectId === task.projectId);
          const allDone = projectTasks.length > 0 && projectTasks.every(t => t.completed);
          if (allDone) {
            setCelebration({ projectId: task.projectId, type: 'gold' });
            setTimeout(() => setCelebration(null), 4000);
          }
        } else {
          addNotification(`Task "${task.title}" moved back to pending.`, 'info');
        }
      }
      return updated;
    });
  }, [addNotification]);

  const deleteTask = useCallback((taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  }, []);

  const updateTask = useCallback((taskId, updates) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
  }, []);

  const deleteProject = useCallback((projectId) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setTasks(prev => prev.filter(t => t.projectId !== projectId));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const getProjectStats = useCallback((projectId) => {
    const ptasks = tasks.filter(t => t.projectId === projectId);
    const done   = ptasks.filter(t => t.completed).length;
    return { total: ptasks.length, done, pct: ptasks.length ? Math.round((done / ptasks.length) * 100) : 0 };
  }, [tasks]);

  return (
    <TaskContext.Provider value={{
      projects, tasks, setTasks, isLoading, celebration, user, setUser, notifications, addNotification, clearNotifications,
      addProject, addTask, toggleTask, updateTask, deleteTask, deleteProject, getProjectStats,
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => useContext(TaskContext);
