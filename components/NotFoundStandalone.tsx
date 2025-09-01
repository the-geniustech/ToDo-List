"use client";

import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { ErrorBoundary } from "./ErrorBoundary";
import { NotFound } from "./NotFound";

/**
 * Standalone 404 page component that can be used independently
 * without the full app context
 */
interface NotFoundStandaloneProps {
  title?: string;
  subtitle?: string;
  onGoHome?: () => void;
  onGoBack?: () => void;
}

export const NotFoundStandalone: React.FC<NotFoundStandaloneProps> = (
  props
) => {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex justify-center items-center bg-background h-screen text-foreground">
          <div className="space-y-6 text-center">
            <div className="opacity-20 font-bold text-primary text-9xl select-none">
              404
            </div>
            <h1 className="font-bold text-4xl">Page Not Found</h1>
            <p className="mx-auto max-w-md text-muted-foreground">
              The page you&apos;re looking for doesn&apos;t exist in this
              dimension.
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-primary hover:opacity-90 px-6 py-3 rounded-lg text-primary-foreground transition-opacity"
            >
              Go Home
            </button>
          </div>
        </div>
      }
    >
      <ThemeProvider defaultTheme="system">
        <NotFound {...props} />
      </ThemeProvider>
    </ErrorBoundary>
  );
};
