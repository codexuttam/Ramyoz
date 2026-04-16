'use client';

import { Task } from '@/types';
import { useKanbanStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Calendar, ChevronRight, Tag, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface CardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const priorityConfig = {
  low: { color: 'text-blue-400 bg-blue-400/10', label: 'Low' },
  medium: { color: 'text-yellow-400 bg-yellow-400/10', label: 'Medium' },
  high: { color: 'text-red-400 bg-red-400/10', label: 'High' },
};

export default function Card({ task, onEdit }: CardProps) {
  const deleteTask = useKanbanStore((state) => state.deleteTask);
  const moveTask = useKanbanStore((state) => state.moveTask);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };

  const handleNextStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (task.status === 'pending') moveTask(task.id, 'in-progress');
    else if (task.status === 'in-progress') moveTask(task.id, 'completed');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={() => onEdit(task)}
      className="glass-card p-5 mb-4 rounded-2xl cursor-pointer group relative overflow-hidden"
    >
      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${priorityConfig[task.priority || 'medium'].color}`}>
              {priorityConfig[task.priority || 'medium'].label}
            </span>
          </div>
          <h3 className="font-bold text-slate-100 text-lg group-hover:text-primary transition-colors leading-tight">
            {task.title}
          </h3>
        </div>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
          <button
            onClick={handleDelete}
            className="p-2 hover:bg-red-500/10 rounded-xl text-slate-500 hover:text-red-400 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <p className="text-sm text-slate-400 line-clamp-2 mb-5 font-medium leading-relaxed">
        {task.description || "No description provided."}
      </p>

      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {task.tags.map(tag => (
            <span key={tag} className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-1 rounded-lg">
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-white/5">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
          <Calendar size={14} className="text-slate-600" />
          <span>{format(new Date(task.createdAt), 'MMM dd')}</span>
        </div>
        
        {task.status !== 'completed' && (
          <button
            onClick={handleNextStatus}
            className="flex items-center gap-1.5 px-3 py-2 bg-primary group-hover:bg-primary/90 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-primary/20"
          >
            {task.status === 'pending' ? 'Start' : 'Finish'}
            <ChevronRight size={14} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
