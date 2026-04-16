'use client';

import { Task } from '@/types';
import { useKanbanStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Calendar, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface CardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export default function Card({ task, onEdit }: CardProps) {
  const deleteTask = useKanbanStore((state) => state.deleteTask);
  const moveTask = useKanbanStore((state) => state.moveTask);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };

  const handleNextStatus = () => {
    if (task.status === 'pending') moveTask(task.id, 'in-progress');
    else if (task.status === 'in-progress') moveTask(task.id, 'completed');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="glass-card p-4 mb-4 rounded-xl cursor-grab active:cursor-grabbing group"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-slate-100 group-hover:text-primary transition-colors line-clamp-1">
          {task.title}
        </h3>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 hover:bg-red-500/20 rounded text-slate-400 hover:text-red-400 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      
      <p className="text-sm text-slate-400 line-clamp-2 mb-4">
        {task.description}
      </p>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Calendar size={12} />
          <span>{new Date(task.createdAt).toLocaleDateString()}</span>
        </div>
        
        {task.status !== 'completed' && (
          <button
            onClick={handleNextStatus}
            className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all"
          >
            Move Next
            <ChevronRight size={12} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
