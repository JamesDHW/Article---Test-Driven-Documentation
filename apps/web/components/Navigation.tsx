'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BookOpen, LogOut, Mail } from 'lucide-react';
import { getCurrentUser, logout } from '../lib/auth';

export function Navigation() {
  const router = useRouter();
  const email = getCurrentUser()

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link
          href="/projects"
          className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50"
        >
          <Image
            src="/icon.svg"
            alt=""
            width={24}
            height={24}
            className="h-6 w-6"
          />
          Projects
        </Link>
        <div className="flex items-center gap-4">
          {email && (
            <span className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400">
              <Mail className="h-4 w-4" />
              {email}
            </span>
          )}
          <Link
            href="https://test-driven-documentation-docs.vercel.app/"
            className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <BookOpen className="h-4 w-4" />
            Documentation
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-red-100 dark:text-zinc-300 dark:hover:bg-red-800"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

