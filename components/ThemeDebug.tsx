'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';
import { useSystemTheme } from './useSystemTheme';

export function ThemeDebug() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const systemTheme = useSystemTheme();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background border border-border p-4 rounded-lg shadow-lg">
      <h3 className="font-bold mb-2">Theme Debug</h3>
      <div className="space-y-1 text-sm">
        <div>Current Theme: <span className="font-mono">{theme}</span></div>
        <div>Resolved Theme: <span className="font-mono">{resolvedTheme}</span></div>
        <div>System Theme: <span className="font-mono">{systemTheme}</span></div>
        <div>HTML Class: <span className="font-mono">{document.documentElement.className}</span></div>
      </div>
      <div className="mt-2 space-x-2">
        <button 
          onClick={() => setTheme('light')} 
          className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs"
        >
          Light
        </button>
        <button 
          onClick={() => setTheme('dark')} 
          className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs"
        >
          Dark
        </button>
        <button 
          onClick={() => setTheme('system')} 
          className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs"
        >
          System
        </button>
      </div>
    </div>
  );
}