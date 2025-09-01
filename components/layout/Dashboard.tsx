"use client";

import React, { useState } from "react";
import { Header } from "../Header";
import { DragDropErrorBoundary } from "../DragDropErrorBoundary";
import { DragDropProvider } from "../DragDropProvider";
import { TaskBoard } from "../TaskBoard";
import { FilterSortOptions } from "../FilterSortModal";

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
  const [filterSort, setFilterSort] =
    useState<FilterSortOptions>(defaultFilterSort);
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Header onFilterSort={setFilterSort} currentFilterSort={filterSort} />

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
  );
};

export default Dashboard;
