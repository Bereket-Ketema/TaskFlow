import { Task, TaskStatus, Priority } from '../types';
import mockData from '../mock/data.json';

const STORAGE_KEY = 'taskflow_tasks_v1';

export class TaskService {
  private static getStoredTasks(): Task[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData.tasks));
        return mockData.tasks as Task[];
      }
      return JSON.parse(raw);
    } catch {
      return (mockData.tasks as Task[]) || [];
    }
  }

  private static saveTasks(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  static async getAllTasks(): Promise<Task[]> {
    return this.getStoredTasks();
  }

  static async createTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
    const tasks = this.getStoredTasks();
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    tasks.unshift(newTask);
    this.saveTasks(tasks);
    return newTask;
  }

  static async updateTaskStatus(id: string, status: TaskStatus): Promise<Task | null> {
    const tasks = this.getStoredTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;
    tasks[index] = { ...tasks[index], status };
    this.saveTasks(tasks);
    return tasks[index];
  }

  static async deleteTask(id: string): Promise<boolean> {
    const tasks = this.getStoredTasks();
    const filtered = tasks.filter((t) => t.id !== id);
    if (filtered.length === tasks.length) return false;
    this.saveTasks(filtered);
    return true;
  }
}