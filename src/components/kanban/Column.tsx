'use client';

import { Status, Task } from '@/types';
import Card from './Card';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreVertical } from 'lucide-react';

interface ColumnProps {
  status: Status;
  tasks: Task[];
  onAddTask: (status: Status) => void;
  onEditTask: (task: Task) => void;
}

const statusConfig = {
  pending: {
    title: 'Pending',
    color: 'border-slate-800/50',
    dot: 'bg-slate-400',
    headerBg: 'bg-slate-500/10'
  },
  'in-progress': {
    title: 'In Progress',
    color: 'border-primary/50',
    dot: 'bg-primary shadow-[0_0_8px_rgba(139,92,246,0.5)]',
    headerBg: 'bg-primary/10'
  },
  completed: {
    title: 'Completed',
    color: 'border-green-500/50',
    dot: 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]',
    headerBg: 'bg-green-500/10'
  }
};

export default function Column({ status, tasks, onAddTask, onEditTask }: ColumnProps) {
  const config = statusConfig[status];

  return (
    <div className={`flex flex-col w-full md:w-80 h-[calc(100vh-12rem)] flex-shrink-0`}>
      <div className={`flex items-center justify-between p-4 mb-3 rounded-2xl ${config.headerBg} border border-white/5`}>
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${config.dot}`} />
          <h2 className="font-bold text-slate-100 tracking-tight flex items-center gap-2">
            {config.title}
            <span className="text-xs font-medium text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">
              {tasks.length}
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-1">
          {status === 'pending' && (
            <button
              onClick={() => onAddTask(status)}
              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all"
            >
              <Plus size={18} />
            </button>
          )}
          <button className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-1 custom-scrollbar">
        <div className="flex flex-col gap-1 min-h-[100px]">
          <AnimatePresence mode="popLayout">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <Card key={task.id} task={task} onEdit={onEditTask} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-white/5 rounded-2xl"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-2">
                  <Plus className="text-slate-600" size={20} />
                </div>
                <p className="text-xs font-medium text-slate-600">No tasks here</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
