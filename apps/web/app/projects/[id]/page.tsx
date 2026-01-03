'use client';

import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { ArrowLeft, Calendar, CheckSquare2, Plus, User, X } from 'lucide-react';
import { isAuthenticated } from '../../../lib/auth';
import { store, type Project, type Task } from '../../../lib/store';
import { Navigation } from '../../../components/Navigation';
import { TaskList } from '../../../components/TaskList';

const ASSIGNEES = ['Alice', 'Bob', 'Charlie', 'Diana'];

export default function ProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  
  const foundProject = store.getProject(projectId);
  const [project] = useState<Project | null>(foundProject ?? null);
  const [tasks, setTasks] = useState<Task[]>(() => foundProject ? store.getTasks(projectId) : []);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  if (!isAuthenticated()) {
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      // router.push('/login');
    }
    return null;
  }
  
  if (!foundProject) {
    if (typeof window !== 'undefined' && window.location.pathname !== '/projects') {
      router.push('/projects');
    }
    return null;
  }

  const handleAddTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (taskName.trim() && project) {
      store.addTask(project.id, taskName.trim(), assignedTo || undefined);
      setTasks(store.getTasks(project.id));
      setTaskName('');
      setAssignedTo('');
      setShowTaskForm(false);
    }
  };

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <Link
            href="/projects"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to projects
          </Link>
          <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
            {project.name}
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400">
            <Calendar className="h-3.5 w-3.5" />
            Created {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-black dark:text-zinc-50">
              <CheckSquare2 className="h-5 w-5" />
              Tasks
            </h2>
            {!showTaskForm && (
              <button
                onClick={() => setShowTaskForm(true)}
                className="flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                <Plus className="h-4 w-4" />
                Add task
              </button>
            )}
          </div>

          {showTaskForm && (
            <form
              onSubmit={handleAddTask}
              className="mb-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="mb-4">
                <label
                  htmlFor="task-name"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Task name
                </label>
                <input
                  type="text"
                  id="task-name"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-black shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="assignee"
                  className="flex items-center gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  <User className="h-4 w-4" />
                  Assign to (optional)
                </label>
                <select
                  id="assignee"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-black shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
                >
                  <option value="">Unassigned</option>
                  {ASSIGNEES.map((assignee) => (
                    <option key={assignee} value={assignee}>
                      {assignee}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  <Plus className="h-4 w-4" />
                  Add task
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowTaskForm(false);
                    setTaskName('');
                    setAssignedTo('');
                  }}
                  className="flex items-center gap-2 rounded-md border border-zinc-300 px-4 py-2 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            </form>
          )}

          <TaskList tasks={tasks} />
        </div>
      </main>
    </div>
  );
}

