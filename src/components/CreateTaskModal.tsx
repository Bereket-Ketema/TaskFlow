import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { Priority, TaskStatus } from '../types';
import { Button } from './common/Button';
import { Input } from './common/Input';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    priority: Priority;
    status: TaskStatus;
    dueDate: string;
    userId?: string;
    tags?: string[];
  }) => void;
}

export function CreateTaskModal({ isOpen, onClose, onSubmit }: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    onSubmit({
      title,
      description,
      priority,
      status: 'todo',
      dueDate,
      userId: 'user-1',
      tags: [],
    });
    setTitle('');
    setDescription('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Create New Task</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium block mb-1 text-slate-700">Task Title *</label>
            <Input
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder="e.g. Implement OAuth Flow"
              autoFocus
            />
            {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
          </div>

          <div>
            <label className="text-xs font-medium block mb-1 text-slate-700">Description</label>
            <textarea
              className="w-full text-sm rounded-md border border-slate-300 p-2 bg-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
              rows={3}
              value={description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              placeholder="Provide context or acceptance criteria..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium block mb-1 text-slate-700">Priority</label>
              <select
                className="w-full h-9 rounded-md border border-slate-300 text-sm px-2 bg-white"
                value={priority}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setPriority(e.target.value as Priority)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium block mb-1 text-slate-700">Due Date</label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Task</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTaskModal;