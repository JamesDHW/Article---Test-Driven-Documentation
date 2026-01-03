'use client';

import { useRouter } from 'next/navigation';
import { FC, FormEvent, useState } from 'react';
import { LogIn, Mail } from 'lucide-react';
import { login } from '../../lib/auth';

const LoginPage: FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim()) {
      login(email.trim());
      router.push('/projects'); 
      return;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="mx-auto w-full max-w-7xl px-4">
        <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-zinc-900">
        <h1 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-black dark:text-zinc-50">
          <LogIn className="h-6 w-6" />
          Sign in
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="flex items-center gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              <Mail className="h-4 w-4" />
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-black shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
            />
          </div>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <LogIn className="h-4 w-4" />
            Sign in
          </button>
        </form>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
