import type { Task, TaskStatus } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, nextStatus: TaskStatus) => void;
  onDelete: (id: string) => void;
}

const NEXT_STATUS_MAP: Record<TaskStatus, TaskStatus | null> = {
  todo: 'in-progress',
  'in-progress': 'done',
  done: null,
};

export function TaskCard({ task, onStatusChange, onDelete }: TaskCardProps) {
  const nextStatus = NEXT_STATUS_MAP[task.status];

  const priorityColor =
    task.priority === 'high'
      ? 'bg-red-50 text-red-700 border-red-200'
      : task.priority === 'medium'
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <Card className="p-4 space-y-3 shadow-sm hover:shadow transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-semibold text-sm leading-snug text-slate-900">{task.title}</h4>
        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${priorityColor}`}>
          {task.priority}
        </span>
      </div>

      <p className="text-xs text-slate-600 line-clamp-2">{task.description}</p>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        <span className="text-slate-500">Due: {task.dueDate || 'No date'}</span>
        <div className="flex items-center gap-1">
          {nextStatus && (
            <Button
              variant="outline"
              className="text-xs h-7 px-2"
              onClick={() => onStatusChange(task.id, nextStatus)}
              aria-label={`Move ${task.title} to ${nextStatus.replace('-', ' ')}`}
            >
              Move to {nextStatus.replace('-', ' ')}
            </Button>
          )}
          <Button
            variant="ghost"
            className="text-xs h-7 px-2 text-red-600 hover:bg-red-50"
            onClick={() => onDelete(task.id)}
            aria-label={`Delete task ${task.title}`}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default TaskCard;