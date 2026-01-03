'use client';

const AUTH_COOKIE_NAME = 'demo-auth';
const AUTH_STORAGE_KEY = 'demo-user-email';

export const login = (email: string): void => {
  if (typeof window === 'undefined') return;

  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(email)}; path=/; max-age=86400`;
  localStorage.setItem(AUTH_STORAGE_KEY, email);
}

export const logout = (): void => {
  if (typeof window === 'undefined') return;

  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`;
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;

  const cookieValue = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${AUTH_COOKIE_NAME}=`));

  return !!cookieValue || !!localStorage.getItem(AUTH_STORAGE_KEY);
}

export const getCurrentUser = (): string | null => {
  if (typeof window === 'undefined') return null;

  const cookieValue = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${AUTH_COOKIE_NAME}=`));

  if (cookieValue) {
    return decodeURIComponent(cookieValue.split('=')[1]);
  }

  return localStorage.getItem(AUTH_STORAGE_KEY);
}

