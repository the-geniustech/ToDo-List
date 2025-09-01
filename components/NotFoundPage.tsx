"use client";

import React from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { NotFoundDemo } from "@/components/NotFoundDemo";
import { NotFoundProvider } from "@/components/NotFoundProvider";

/**
 * Standalone demo app to showcase the 404 page components
 * This can be used to demonstrate the 404 page functionality
 */
export default function NotFoundPage() {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex justify-center items-center bg-background h-screen text-foreground">
          <div className="text-center">
            <div className="mb-4 text-destructive text-6xl">⚠️</div>
            <h1 className="mb-2 font-bold text-2xl">Demo Error</h1>
            <p className="text-muted-foreground">
              Please refresh the page to try again.
            </p>
          </div>
        </div>
      }
    >
      <ThemeProvider defaultTheme="system">
        <NotFoundProvider>
          <NotFoundDemo />
        </NotFoundProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
