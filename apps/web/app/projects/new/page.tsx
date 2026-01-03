'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { FolderKanban, Plus, X } from 'lucide-react';
import { isAuthenticated } from '../../../lib/auth';
import { store } from '../../../lib/store';
import { Navigation } from '../../../components/Navigation';

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name.trim() && isAuthenticated()) {
      const project = store.createProject(name.trim());
      router.push(`/projects/${project.id}`);
    }
  };

  if (!isAuthenticated()) {
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      // router.push('/login');
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-black dark:text-zinc-50">
          <FolderKanban className="h-6 w-6" />
          Create new project
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Project name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-black shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <Plus className="h-4 w-4" />
              Create project
            </button>
            <Link
              href="/projects"
              className="flex items-center gap-2 rounded-md border border-zinc-300 px-4 py-2 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <X className="h-4 w-4" />
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}

