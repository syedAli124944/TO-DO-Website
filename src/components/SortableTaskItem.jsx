import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { useTasks } from '../context/TaskContext.jsx';

export default function SortableTaskItem({ task, projects }) {
  const { toggleTask, deleteTask } = useTasks();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { task } });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 1,
    touchAction: 'none', // Critical for mobile dragging
  };

  const proj = projects.find(p => p.id === task.projectId);

  function getPriorityIcon(p) {
    if (p === 'high') return 'keyboard_double_arrow_up';
    if (p === 'med')  return 'drag_handle';
    return 'keyboard_double_arrow_down';
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ ease: [0.23, 1, 0.32, 1], duration: 0.4 }}
      className={`task-item ${task.completed ? 'completed' : ''} ${isDragging ? 'dragging' : ''}`}
      {...attributes}
      {...listeners}
    >
      {/* Checkbox */}
      <button
        className={`task-checkbox ${task.completed ? 'checked' : ''}`}
        onPointerDown={e => e.stopPropagation()} 
        onClick={(e) => {
          e.stopPropagation();
          toggleTask(task.id);
        }}
        title={task.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.completed && (
          <span className="material-icons-round">check</span>
        )}
      </button>

      {/* Content */}
      <div className="task-content">
        <div className="task-title">{task.title}</div>
        {task.description && (
          <div style={{ fontSize:'0.75rem', color:'var(--on-surface-variant)', marginBottom:'0.25rem', opacity:0.8 }}>
            {task.description}
          </div>
        )}
        <div className="task-meta">
          <span className={`task-priority ${task.priority}`}>
            <span className="material-icons-round" style={{ fontSize:'0.7rem' }}>{getPriorityIcon(task.priority)}</span>
            {task.priority}
          </span>
          <span className={`task-tag tag-${task.tag}`}>{task.tag}</span>
          {proj && (
            <span className="task-tag" style={{ background:`${proj.color}15`, color:proj.color }}>
              {proj.title.split(' ').length > 2 ? proj.title.substring(0,12) + '...' : proj.title}
            </span>
          )}
        </div>
      </div>

      {/* Delete */}
      <button
        className="icon-btn"
        style={{ flexShrink:0, width:30, height:30 }}
        onPointerDown={e => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          deleteTask(task.id);
        }}
      >
        <span className="material-icons-round" style={{ fontSize:'0.85rem' }}>delete_outline</span>
      </button>
    </motion.div>
  );
}
