'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Calendar, Folder, FolderKanban, Plus } from 'lucide-react';
import { isAuthenticated } from '../../lib/auth';
import { store, type Project } from '../../lib/store';
import { Navigation } from '../../components/Navigation';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects] = useState<Project[]>(() => store.getProjects());

  if (!isAuthenticated()) {
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      router.push('/login');
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-black dark:text-zinc-50">
            <FolderKanban className="h-6 w-6" />
            Projects
          </h1>
          <Link
            href="/projects/new"
            className="flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <Plus className="h-4 w-4" />
            New project
          </Link>
        </div>
        {projects.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">
            No projects yet. Create your first project to get started.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {project.name}
                </h2>
                <h3 className="text-sm text-zinc-600 dark:text-zinc-400 flex gap-1.5">
                  <Folder className="h-3.5 w-3.5" />
                  {store.getTasks(project.id).length} tasks
                </h3>  
                <p className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                  <Calendar className="h-3.5 w-3.5" />
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </Link>
              ))}
          </div>
        )}
      </main>
    </div>
  );
}

