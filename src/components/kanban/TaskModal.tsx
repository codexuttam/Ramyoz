'use client';

import { useState, useEffect } from 'react';
import { useKanbanStore } from '@/lib/store';
import { Task, Status, Priority } from '@/types';
import { motion } from 'framer-motion';
import { X, Save, AlertCircle, Tag as TagIcon, ChevronDown } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTask?: Task;
  defaultStatus: Status;
}

const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'bg-blue-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'high', label: 'High', color: 'bg-red-500' },
];

export default function TaskModal({ isOpen, onClose, editingTask, defaultStatus }: TaskModalProps) {
  const { addTask, updateTask } = useKanbanStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setPriority(editingTask.priority || 'medium');
      setTags(editingTask.tags || []);
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setTags([]);
    }
  }, [editingTask, isOpen]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    const taskData = { title, description, priority, tags, status: editingTask?.status || defaultStatus };

    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40 }}
        className="relative w-full max-w-xl glass-panel p-10 rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-accent" />
        
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              {editingTask ? 'Edit Milestone' : 'New Milestone'}
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Design your path to success</p>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-all transform hover:rotate-90 duration-300"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Title</label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="Give your task a bold name..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-slate-100 placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-bold text-lg"
            />
            {error && (
              <p className="text-red-400 text-xs font-bold flex items-center gap-1 mt-2 ml-1">
                <AlertCircle size={14} />
                {error}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Priority</label>
              <div className="flex gap-2">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPriority(p.value)}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                      priority === p.value 
                      ? `${p.color} text-white border-transparent shadow-lg shadow-${p.value}-500/20` 
                      : 'bg-white/5 text-slate-500 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Tags</label>
              <div className="relative group">
                <TagIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors" size={14} />
                <input
                  type="text"
                  value={tagInput}
                  onKeyDown={handleAddTag}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Press Enter to add..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-primary/40 transition-all"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-lg group animate-in fade-in zoom-in duration-300">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-white transition-colors">
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Flesh out the details..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-slate-100 placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium resize-none"
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] bg-white/5 text-slate-500 hover:bg-white/10 transition-all"
            >
              Discard
            </button>
            <button
              type="submit"
              className="flex-1 px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <Save size={18} />
              {editingTask ? 'Finalize Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
