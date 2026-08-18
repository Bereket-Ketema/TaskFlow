import React, { useEffect, useState, useMemo } from 'react';
import { Task, TaskStatus, Priority } from './types';
import { TaskService } from './services/taskService';
import { TaskCard } from './components/TaskCard';
import { CreateTaskModal } from './components/CreateTaskModal';
import { Button } from './components/common/Button';
import { Input } from './components/common/Input';

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'done', title: 'Completed' },
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadTasks = async () => {
    const data = await TaskService.getAllTasks();
    setTasks(data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    await TaskService.updateTaskStatus(id, status);
    loadTasks();
  };

  const handleDelete = async (id: string) => {
    await TaskService.deleteTask(id);
    loadTasks();
  };

  const handleCreate = async (data: Omit<Task, 'id' | 'createdAt'>) => {
    await TaskService.createTask(data);
    loadTasks();
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });
  }, [tasks, search, priorityFilter]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10 font-sans text-foreground">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">TaskFlow</h1>
            <p className="text-sm text-muted-foreground">Agile task management and status pipelines</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>+ New Task</Button>
        </header>

        <div className="flex flex-wrap items-center gap-3 bg-card p-3 rounded-lg border">
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <select
            className="h-9 rounded-md border text-sm px-3 bg-background"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as Priority | 'all')}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {COLUMNS.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <section key={col.id} className="bg-muted/40 rounded-lg p-4 border space-y-3">
                <div className="flex justify-between items-center px-1">
                  <h3 className="font-semibold text-sm">{col.title}</h3>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full font-medium">
                    {colTasks.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {colTasks.length === 0 ? (
                    <div className="text-center py-8 text-xs text-muted-foreground border-2 border-dashed rounded">
                      No tasks in this lane
                    </div>
                  ) : (
                    colTasks.map((t) => (
                      <TaskCard
                        key={t.id}
                        task={t}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                      />
                    ))
                  )}
                </div>
              </section>
            );
          })}
        </main>

        <CreateTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreate}
        />
      </div>
    </div>
  );
}