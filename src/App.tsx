import { useEffect, useState, useMemo, useCallback } from 'react';
import type { ChangeEvent } from 'react';
import type { Task, TaskStatus, Priority } from './types';
import { TaskService } from './services/taskService';
import { TaskCard } from './components/TaskCard';
import { CreateTaskModal } from './components/CreateTaskModal';
import { Button } from './components/common/Button';
import { Input } from './components/common/Input';

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Completed' },
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let isSubscribed = true;
    TaskService.getAllTasks().then((data) => {
      if (isSubscribed) {
        setTasks(data);
      }
    });
    return () => {
      isSubscribed = false;
    };
  }, []);

  const handleStatusChange = useCallback(async (id: string, status: TaskStatus) => {
    await TaskService.updateTaskStatus(id, status);
    const refreshed = await TaskService.getAllTasks();
    setTasks(refreshed);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    await TaskService.deleteTask(id);
    setSelectedTaskIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    const refreshed = await TaskService.getAllTasks();
    setTasks(refreshed);
  }, []);

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleBatchAdvance = async () => {
    const selectedList = tasks.filter((t) => selectedTaskIds.has(t.id));
    for (const task of selectedList) {
      if (task.status === 'todo') {
        await TaskService.updateTaskStatus(task.id, 'in-progress');
      } else if (task.status === 'in-progress') {
        await TaskService.updateTaskStatus(task.id, 'done');
      }
    }
    const refreshed = await TaskService.getAllTasks();
    setTasks(refreshed);
  };

  const handleBatchDelete = async () => {
    for (const id of selectedTaskIds) {
      await TaskService.deleteTask(id);
    }
    setSelectedTaskIds(new Set());
    const refreshed = await TaskService.getAllTasks();
    setTasks(refreshed);
  };

  const handleClearSelection = () => {
    setSelectedTaskIds(new Set());
  };

  const handleCreate = async (data: Omit<Task, 'id' | 'createdAt'>) => {
    await TaskService.createTask(data);
    const refreshed = await TaskService.getAllTasks();
    setTasks(refreshed);
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

  const selectedCount = selectedTaskIds.size;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">TaskFlow</h1>
            <p className="text-sm text-slate-500">Agile task management and status pipelines</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>+ New Task</Button>
        </header>

        <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <select
            className="h-9 rounded-md border border-slate-300 text-sm px-3 bg-white"
            value={priorityFilter}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setPriorityFilter(e.target.value as Priority | 'all')}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          {selectedCount > 0 && (
            <div className="flex items-center gap-2 ml-auto bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-md text-xs text-blue-900">
              <span className="font-semibold">{selectedCount} selected</span>
              <Button
                variant="outline"
                className="h-7 px-2 text-xs bg-white"
                onClick={handleBatchAdvance}
              >
                Advance Status
              </Button>
              <Button
                variant="destructive"
                className="h-7 px-2 text-xs"
                onClick={handleBatchDelete}
              >
                Delete
              </Button>
              <Button variant="ghost" className="h-7 px-2 text-xs" onClick={handleClearSelection}>
                Clear
              </Button>
            </div>
          )}
        </div>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {COLUMNS.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <section key={col.id} className="bg-slate-100/70 rounded-lg p-4 border border-slate-200 space-y-3">
                <div className="flex justify-between items-center px-1">
                  <h3 className="font-semibold text-sm text-slate-800">{col.title}</h3>
                  <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-medium">
                    {colTasks.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {colTasks.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400 border-2 border-dashed border-slate-200 rounded">
                      No tasks in this lane
                    </div>
                  ) : (
                    colTasks.map((t) => (
                      <TaskCard
                        key={t.id}
                        task={t}
                        isSelected={selectedTaskIds.has(t.id)}
                        onToggleSelect={handleToggleSelect}
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