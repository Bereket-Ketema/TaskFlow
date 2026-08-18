import React from 'react';
import { Task, TaskStatus } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, nextStatus: TaskStatus) => void;
  onDelete: (id: string) => void;
}

const NEXT_STATUS_MAP: Record<TaskStatus, TaskStatus | null> = {
  todo: 'in_progress',
  in_progress: 'done',
  done: null,
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange, onDelete }) => {
  const nextStatus = NEXT_STATUS_MAP[task.status];

  const priorityColor =
    task.priority === 'high'
      ? 'bg-rose-500/10 text-rose-600 border-rose-200'
      : task.priority === 'medium'
      ? 'bg-amber-500/10 text-amber-600 border-amber-200'
      : 'bg-slate-500/10 text-slate-600 border-slate-200';

  return (
    <Card className="p-4 space-y-3 shadow-sm hover:shadow transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-semibold text-sm leading-snug text-foreground">{task.title}</h4>
        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${priorityColor}`}>
          {task.priority}
        </span>
      </div>

      <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>

      <div className="flex items-center justify-between pt-2 border-t text-xs">
        <span className="text-muted-foreground">Due: {task.dueDate || 'No date'}</span>
        <div className="flex items-center gap-1">
          {nextStatus && (
            <Button
              variant="outline"
              className="text-xs h-7 px-2"
              onClick={() => onStatusChange(task.id, nextStatus)}
              aria-label={`Move ${task.title} to ${nextStatus.replace('_', ' ')}`}
            >
              Move to {nextStatus.replace('_', ' ')}
            </Button>
          )}
          <Button
            variant="ghost"
            className="text-xs h-7 px-2 text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(task.id)}
            aria-label={`Delete task ${task.title}`}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};