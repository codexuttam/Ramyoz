'use client';

import { useState } from 'react';
import { useKanbanStore } from '@/lib/store';
import { Status, Task } from '@/types';
import Column from './Column';
import TaskModal from './TaskModal';
import { Search, Plus, LayoutGrid, ListFilter, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Board() {
  const { tasks, searchTerm, setSearchTerm } = useKanbanStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [activeStatus, setActiveStatus] = useState<Status>('pending');

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTasksByStatus = (status: Status) => 
    filteredTasks.filter((task) => task.status === status);

  const handleAddTask = (status: Status) => {
    setActiveStatus(status);
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col h-screen max-w-[1400px] mx-auto px-6 py-8">
      {/* Header section */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="text-primary animate-pulse" size={18} />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary/80">Workflow Manager</span>
          </div>
          <h1 className="text-4xl font-black text-white flex items-center gap-3">
            Mini Kanban
            <span className="text-sm font-normal text-slate-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all w-full md:w-64 backdrop-blur-sm"
            />
          </div>
          
          <button
            onClick={() => handleAddTask('pending')}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={18} />
            Add Task
          </button>
        </div>
      </motion.header>

      {/* Board Layout */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 flex flex-col md:flex-row gap-6 overflow-x-auto pb-6 scrollbar-hide"
      >
        <Column
          status="pending"
          tasks={getTasksByStatus('pending')}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
        />
        <Column
          status="in-progress"
          tasks={getTasksByStatus('in-progress')}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
        />
        <Column
          status="completed"
          tasks={getTasksByStatus('completed')}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
        />
      </motion.div>

      {/* Task Modal */}
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
