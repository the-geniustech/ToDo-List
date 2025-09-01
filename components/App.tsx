"use client";

import React, { useState } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TaskProvider } from "@/components/TaskContext";
import { TeamProvider } from "@/components/TeamContext";
import { DragDropProvider } from "@/components/DragDropProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DragDropErrorBoundary } from "@/components/DragDropErrorBoundary";

import { Header } from "@/components/Header";
import { MainSidebar } from "@/components/MainSidebar";
import { ProjectSidebar } from "@/components/ProjectSidebar";
import { TaskBoard } from "@/components/TaskBoard";
import { FilterSortOptions } from "@/components/FilterSortModal";
import { ThemeDebug } from "@/components/ThemeDebug";

const defaultFilterSort: FilterSortOptions = {
  priority: [],
  category: [],
  progress: { min: 0, max: 100 },
  dueDate: "all",
  assignee: [],
  sortBy: "dueDate",
  sortOrder: "asc",
};

export default function App() {
  const [filterSort, setFilterSort] =
    useState<FilterSortOptions>(defaultFilterSort);

  return (
    <ErrorBoundary
      fallback={
        <div className="flex justify-center items-center bg-background h-screen text-foreground">
          <div className="text-center">
            <div className="mb-4 text-destructive text-6xl">⚠️</div>
            <h1 className="mb-2 font-bold text-2xl">Application Error</h1>
            <p className="text-muted-foreground">
              Please refresh the page to try again.
            </p>
          </div>
        </div>
      }
    >
      <ThemeProvider defaultTheme="system">
        <TeamProvider>
          <TaskProvider>
            <div className="flex bg-background max-w-screen h-screen overflow-hidden text-foreground">
              {/* Main Sidebar */}
              <div className="hidden md:block">
                <MainSidebar />
              </div>

              {/* Project Sidebar */}
              <div className="hidden lg:block">
                <ProjectSidebar />
              </div>

              {/* Main Content */}
              <div className="flex flex-col flex-1 overflow-hidden">
                <Header
                  onFilterSort={setFilterSort}
                  currentFilterSort={filterSort}
                />

                {/* Task Board with Drag & Drop */}
                <div className="flex-1 overflow-hidden">
                  <DragDropErrorBoundary>
                    <DragDropProvider>
                      <TaskBoard
                        filterSort={filterSort}
                        onFilterSortChange={setFilterSort}
                      />
                    </DragDropProvider>
                  </DragDropErrorBoundary>
                </div>
              </div>
            </div>

            {/* Theme Debug Component (development only) */}
            <ThemeDebug />
          </TaskProvider>
        </TeamProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
