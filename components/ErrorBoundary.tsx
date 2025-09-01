"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex justify-center items-center bg-gradient-to-br from-red-50 to-pink-50 rounded-lg w-full h-64">
            <div className="text-center">
              <div className="mb-2 text-red-500 text-4xl">⚠️</div>
              <p className="font-medium text-red-600">3D Visualization Error</p>
              <p className="mt-1 text-red-500 text-sm">
                Falling back to 2D view
              </p>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
