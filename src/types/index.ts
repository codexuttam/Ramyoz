export type Status = 'pending' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  createdAt: string;
}

export type NewTask = Omit<Task, 'id' | 'createdAt'>;
