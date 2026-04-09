import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import SortableTaskItem from './SortableTaskItem';

export default function TaskColumn({ id, title, tasks, projects, icon, color }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="task-column">
      <div className="column-header">
        <div className="column-header-left">
          <span className="material-icons-round" style={{ color }}>{icon}</span>
          <h3 className="column-title">{title}</h3>
          <span className="column-count">{tasks.length}</span>
        </div>
      </div>

      <div ref={setNodeRef} className="column-content">
        <SortableContext id={id} items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', minHeight:'200px' }}>
            {tasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="column-empty"
              >
                <span className="material-icons-round">drag_indicator</span>
                <p>No tasks here</p>
              </motion.div>
            ) : (
              tasks.map((task) => (
                <SortableTaskItem key={task.id} task={task} projects={projects} />
              ))
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
