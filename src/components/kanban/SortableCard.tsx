'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/types';
import Card from './Card';

interface SortableCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export default function SortableCard({ task, onEdit }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 h-[100px] border-2 border-dashed border-primary/30 rounded-2xl mb-4 bg-primary/5"
      />
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card task={task} onEdit={onEdit} />
    </div>
  );
}
