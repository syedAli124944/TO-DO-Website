import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectTasksList({ tasks, color }) {
  const completedTasks = tasks.filter(t => t.completed);

  if (completedTasks.length === 0) {
    return (
      <div className="project-tasks-empty">
        <span className="material-icons-round">history</span>
        No completed tasks yet.
      </div>
    );
  }

  return (
    <div className="project-tasks-list">
      {completedTasks.map((task, idx) => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
          className={`project-task-mini-item ${task.completed ? 'completed' : ''}`}
        >
          <div className="task-mini-check" style={{ borderColor: task.completed ? '#16a34a' : 'var(--outline-variant)' }}>
            {task.completed && <span className="material-icons-round" style={{ color: '#16a34a', fontSize: '0.8rem' }}>check</span>}
          </div>
          <span className="task-mini-title">{task.title}</span>
          {task.priority === 'high' && <div className="task-mini-dot" style={{ backgroundColor: 'var(--error)' }} />}
        </motion.div>
      ))}
    </div>
  );
}
