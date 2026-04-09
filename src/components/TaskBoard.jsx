import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import TaskColumn from './TaskColumn';
import SortableTaskItem from './SortableTaskItem';
import { useTasks } from '../context/TaskContext.jsx';

export default function TaskBoard({ tasks, projects }) {
  const { toggleTask, updateTask, setTasks, addNotification } = useTasks();
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const pendingTasks = tasks.filter(t => !t.completed);
  const doneTasks = tasks.filter(t => t.completed);

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  function handleDragOver(event) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTask = tasks.find(t => t.id === activeId);
    const overTask = tasks.find(t => t.id === overId);

    if (!activeTask) return;

    // Handle dropping over a column container (id 'pending' or 'done')
    if ((overId === 'pending' || overId === 'done') && activeTask.completed !== (overId === 'done')) {
      toggleTask(activeId);
      return;
    }

    // Handle dropping over another task item in a different column
    if (overTask && activeTask.completed !== overTask.completed) {
      toggleTask(activeId);
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Handle sorting within columns
    const oldIndex = tasks.findIndex(t => t.id === activeId);
    const newIndex = tasks.findIndex(t => t.id === overId);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      
      const movedTask = newTasks[newIndex];
      const groupTasks = newTasks.filter(t => t.completed === movedTask.completed);
      const indexInGroup = groupTasks.findIndex(t => t.id === movedTask.id);

      // Smart Priority: Promote to HIGH if placed at the absolute top of Pending
      if (!movedTask.completed && indexInGroup === 0 && movedTask.priority !== 'high') {
        movedTask.priority = 'high';
        addNotification(`"${movedTask.title}" promoted!`, 'success');
      }

      setTasks(newTasks);
    }
  }

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: '0.5' } },
    }),
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="task-board">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="board-column-wrapper"
        >
          <TaskColumn
            id="pending"
            title="Pending or New Tasks"
            icon="pending_actions"
            color="var(--primary)"
            tasks={pendingTasks}
            projects={projects}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
          className="board-column-wrapper"
        >
          <TaskColumn
            id="done"
            title="Completed Tasks"
            icon="check_circle"
            color="#16a34a"
            tasks={doneTasks}
            projects={projects}
          />
        </motion.div>
      </div>

      <DragOverlay dropAnimation={dropAnimation}>
        <AnimatePresence>
          {activeTask && (
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.05, rotate: 2 }}
              className="task-item dragging-overlay"
              style={{ width: 340 }}
            >
              <div className="task-content">
                <div className="task-title">{activeTask.title}</div>
                <div className="task-meta">
                  <span className={`task-tag tag-${activeTask.tag}`}>{activeTask.tag}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DragOverlay>
    </DndContext>
  );
}
