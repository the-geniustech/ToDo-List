"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class DragDropErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: "",
  };

  public static getDerivedStateFromError(error: Error): State {
    console.error("🚨 DragDropErrorBoundary caught error:", error);

    // Check if it's a drag/drop related error
    const isDragDropError =
      error.message.includes("drag drop context") ||
      error.message.includes("DndProvider") ||
      error.message.includes("react-dnd");

    return {
      hasError: true,
      errorMessage: isDragDropError
        ? "Drag & Drop functionality is temporarily unavailable"
        : error.message,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      "🚨 DragDropErrorBoundary - Uncaught error:",
      error,
      errorInfo
    );
  }

  private handleRetry = () => {
    this.setState({ hasError: false, errorMessage: "" });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="bg-yellow-50 m-4 p-4 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <div className="mr-3 text-yellow-600 text-xl">⚠️</div>
            <div className="flex-1">
              <h3 className="font-medium text-yellow-800 text-sm">
                Feature Temporarily Unavailable
              </h3>
              <p className="mt-1 text-yellow-700 text-sm">
                {this.state.errorMessage}
              </p>
              <p className="mt-2 text-yellow-600 text-xs">
                The kanban board will still work without drag & drop
                functionality.
              </p>
              <button
                onClick={this.handleRetry}
                className="bg-yellow-200 hover:bg-yellow-300 mt-2 px-3 py-1 rounded text-yellow-800 text-xs transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
