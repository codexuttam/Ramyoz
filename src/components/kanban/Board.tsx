'use client';

import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { useState } from 'react';
import { useKanbanStore } from '@/lib/store';
import { Status, Task } from '@/types';
import Column from './Column';
import TaskModal from './TaskModal';
import Card from './Card';
import AuroraBackground from '../AuroraBackground';
import { 
  Search, Plus, Sparkles, Trash2, 
  CheckCircle2, Clock, PlayCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Board() {
  const { tasks, searchTerm, setSearchTerm, clearCompleted, updateTask, reorderTasks } = useKanbanStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [activeStatus, setActiveStatus] = useState<Status>('pending');
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTasksByStatus = (status: Status) => 
    filteredTasks.filter((task) => task.status === status);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === 'Task';
    const isOverATask = over.data.current?.type === 'Task';

    if (!isActiveATask) return;

    // Dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      const activeTask = tasks.find(t => t.id === activeId);
      const overTask = tasks.find(t => t.id === overId);

      if (activeTask && overTask && activeTask.status !== overTask.status) {
        updateTask(String(activeId), { status: overTask.status });
      }
    }

    // Dropping a Task over a Column
    const isOverAColumn = over.data.current?.type === 'Column';
    if (isActiveATask && isOverAColumn) {
      const activeTask = tasks.find(t => t.id === activeId);
      if (activeTask && activeTask.status !== overId) {
        updateTask(String(activeId), { status: overId as Status });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeIndex = tasks.findIndex((t) => t.id === activeId);
    const overIndex = tasks.findIndex((t) => t.id === overId);

    if (activeIndex !== overIndex) {
      reorderTasks(arrayMove(tasks, activeIndex, overIndex));
    }
  };

  const handleAddTask = (status: Status) => {
    setActiveStatus(status);
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const statusList: Status[] = ['pending', 'in-progress', 'completed'];

  return (
    <div className="relative min-h-screen flex flex-col max-w-[1400px] mx-auto px-6 py-8">
      <AuroraBackground />
      
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/20 rounded-xl backdrop-blur-md">
              <Sparkles className="text-primary" size={20} />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">Master Dashboard</span>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter">
            Kanban<span className="text-primary uppercase text-xs ml-2 tracking-widest bg-primary/10 px-3 py-1 rounded-full">Pro</span>
          </h1>
          
          <div className="flex gap-4 mt-4">
            {statusList.map((status) => {
              const count = tasks.filter(t => t.status === status).length;
              const config = {
                pending: { icon: Clock, color: 'text-slate-400', label: 'Queued' },
                'in-progress': { icon: PlayCircle, color: 'text-primary', label: 'Active' },
                completed: { icon: CheckCircle2, color: 'text-green-500', label: 'Done' },
              }[status];
              return (
                <div key={status} className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl">
                  <config.icon className={config.color} size={14} />
                  <span className="text-sm font-black text-white">{count}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{config.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative group w-full sm:w-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search universe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-slate-200 placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all w-full sm:w-72 backdrop-blur-xl font-bold"
            />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            {tasks.some(t => t.status === 'completed') && (
              <button
                onClick={() => { if (window.confirm('Wipe completed history?')) clearCompleted(); }}
                className="p-4 bg-white/5 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded-2xl border border-white/10 transition-all backdrop-blur-xl group"
              >
                <Trash2 size={22} className="group-hover:rotate-12 transition-transform" />
              </button>
            )}
            <button
              onClick={() => handleAddTask('pending')}
              className="flex-1 flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-2xl shadow-primary/30 hover:scale-[1.05] active:scale-95"
            >
              <Plus size={22} />
              NEW MISSION
            </button>
          </div>
        </div>
      </motion.header>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 flex flex-col md:flex-row gap-8 overflow-x-auto pb-10 scrollbar-hide">
          {statusList.map((status) => (
            <Column
              key={status}
              status={status}
              tasks={getTasksByStatus(status)}
              onAddTask={handleAddTask}
              onEditTask={setEditingTask}
              setIsModalOpen={setIsModalOpen}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: '0.5',
              },
            },
          }),
        }}>
          {activeTask ? (
            <div className="opacity-90 scale-105 pointer-events-none rotate-3">
              <Card task={activeTask} onEdit={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <AnimatePresence>
        {isModalOpen && (
          <TaskModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            editingTask={editingTask}
            defaultStatus={activeStatus}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
