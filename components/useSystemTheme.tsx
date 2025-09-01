'use client';

import { useEffect, useState } from 'react';

export function useSystemTheme() {
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Get initial system theme
    const getSystemTheme = () => {
      if (typeof window === 'undefined') return 'light';
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    setSystemTheme(getSystemTheme());

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return systemTheme;
}

export function usePreferredTheme() {
  const systemTheme = useSystemTheme();
  const [preferredTheme, setPreferredTheme] = useState<'light' | 'dark'>(systemTheme);

  useEffect(() => {
    // Check if user has a saved preference
    try {
      const saved = localStorage.getItem('todo-app-theme');
      if (saved === 'light' || saved === 'dark') {
        setPreferredTheme(saved);
      } else {
        setPreferredTheme(systemTheme);
      }
    } catch {
      setPreferredTheme(systemTheme);
    }
  }, [systemTheme]);

  return preferredTheme;
}