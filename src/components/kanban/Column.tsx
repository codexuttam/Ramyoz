'use client';

import { Status, Task } from '@/types';
import Card from './Card';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreVertical, Layers } from 'lucide-react';
import SortableCard from './SortableCard';

interface ColumnProps {
  status: Status;
  tasks: Task[];
  onAddTask: (status: Status) => void;
  onEditTask: (task: Task) => void;
  setIsModalOpen: (open: boolean) => void;
}

const statusConfig = {
  pending: {
    title: 'Pending',
    color: 'text-slate-500',
    dot: 'bg-slate-500',
    headerBg: 'bg-slate-500/5',
    accent: 'bg-slate-500/20'
  },
  'in-progress': {
    title: 'In Progress',
    color: 'text-primary',
    dot: 'bg-primary shadow-[0_0_15px_rgba(139,92,246,0.6)]',
    headerBg: 'bg-primary/5',
    accent: 'bg-primary/20'
  },
  completed: {
    title: 'Completed',
    color: 'text-green-500',
    dot: 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]',
    headerBg: 'bg-green-500/5',
    accent: 'bg-green-500/20'
  }
};

export default function Column({ status, tasks, onAddTask, onEditTask, setIsModalOpen }: ColumnProps) {
  const config = statusConfig[status];
  const { setNodeRef } = useDroppable({
    id: status,
    data: {
      type: 'Column',
    },
  });

  return (
    <div className="flex flex-col w-full md:w-[380px] h-[calc(100vh-18rem)] flex-shrink-0 group">
      <div className={`flex items-center justify-between p-6 mb-6 rounded-3xl ${config.headerBg} border border-white/5 backdrop-blur-md group-hover:border-white/10 transition-all`}>
        <div className="flex items-center gap-4">
          <div className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
          <h2 className={`font-black uppercase tracking-[0.2em] text-xs ${config.color} flex items-center gap-3`}>
            {config.title}
            <span className="text-[10px] font-black text-slate-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
              {tasks.length}
            </span>
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          {status === 'pending' && (
            <button
              onClick={() => onAddTask(status)}
              className="p-2 hover:bg-white/10 rounded-xl text-slate-500 hover:text-white transition-all transform hover:rotate-90"
            >
              <Plus size={20} />
            </button>
          )}
          <button className="p-2 hover:bg-white/10 rounded-xl text-slate-500">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      <div 
        ref={setNodeRef}
        className="flex-1 overflow-y-auto px-2 custom-scrollbar space-y-4"
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence mode="popLayout">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <SortableCard key={task.id} task={task} onEdit={onEditTask} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-white/5 rounded-[2.5rem] bg-white/[0.01]"
              >
                <div className={`w-14 h-14 rounded-2xl ${config.accent} flex items-center justify-center mb-4 text-slate-600`}>
                  <Layers size={24} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700">Empty Orbit</p>
              </motion.div>
            )}
          </AnimatePresence>
        </SortableContext>
      </div>
    </div>
  );
}
