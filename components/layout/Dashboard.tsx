"use client";

import React, { useState } from "react";
import { Header } from "../Header";
import { DragDropErrorBoundary } from "../DragDropErrorBoundary";
import { DragDropProvider } from "../DragDropProvider";
import { TaskBoard } from "../TaskBoard";
import { FilterSortOptions } from "../FilterSortModal";
import { ProjectModal } from "../ProjectModal";
import { ProjectSidebar } from "../ProjectSidebar";

const defaultFilterSort: FilterSortOptions = {
  priority: [],
  category: [],
  progress: { min: 0, max: 100 },
  dueDate: "all",
  assignee: [],
  sortBy: "dueDate",
  sortOrder: "asc",
};

const Dashboard: React.FC = ({}) => {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const [filterSort, setFilterSort] =
    useState<FilterSortOptions>(defaultFilterSort);
  return (
    <>
      <div className="hidden lg:block">
        <ProjectSidebar
          onOpenCreateEditProjectModal={() => setIsProjectModalOpen(true)}
        />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          onOpenCreateEditProjectModal={() => setIsProjectModalOpen(true)}
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

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />
    </>
  );
};

export default Dashboard;
