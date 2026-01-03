import { Calendar, CheckSquare2, User } from 'lucide-react';
import { type Task } from '../lib/store';

type TaskListProps = {
  tasks: Task[];
};

export function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className="text-zinc-600 dark:text-zinc-400">
        No tasks yet. Add your first task to get started.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="flex items-center gap-2 font-medium text-zinc-900 dark:text-zinc-50">
                <CheckSquare2 className="h-4 w-4 text-zinc-400" />
                {task.name}
              </p>
              {task.assignedTo && (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                  <User className="h-3.5 w-3.5" />
                  Assigned to: {task.assignedTo}
                </p>
              )}
            </div>
            <span className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-500">
              <Calendar className="h-3 w-3" />
              {new Date(task.createdAt).toLocaleDateString()}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

