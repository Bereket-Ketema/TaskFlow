export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
  createdAt: string;
  userId?: string;
  tags?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}