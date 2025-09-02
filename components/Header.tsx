"use client";

import React, { useState } from "react";
import {
  Search,
  Bell,
  Calendar,
  MoreHorizontal,
  Filter,
  Plus,
  Menu,
} from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { FilterSortModal, FilterSortOptions } from "./FilterSortModal";
import { TemplateModal } from "./TemplateModal";
import { useTaskContext } from "./TaskContext";
import { useTeamContext } from "./TeamContext";

interface HeaderProps {
  onFilterSort?: (options: FilterSortOptions) => void;
  currentFilterSort?: FilterSortOptions;
  onOpenCreateEditProjectModal: () => void;
}

const defaultFilterSort: FilterSortOptions = {
  priority: [],
  category: [],
  progress: { min: 0, max: 100 },
  dueDate: "all",
  assignee: [],
  sortBy: "dueDate",
  sortOrder: "asc",
};

export const Header: React.FC<HeaderProps> = ({
  onFilterSort,
  currentFilterSort = defaultFilterSort,
  onOpenCreateEditProjectModal,
}) => {
  const { tasks } = useTaskContext();
  const { teamMembers } = useTeamContext();

  // Modal states
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  const currentDate = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // const currentProject = getCurrentProject();

  // Get available categories and assignees for filtering
  const availableCategories = Array.from(
    new Set(tasks.map((task) => task.category).filter(Boolean))
  );
  const availableAssignees = teamMembers.map((member) => ({
    id: member.id,
    name: member.name,
  }));

  // Check if filters are active
  const hasActiveFilters = () => {
    return (
      currentFilterSort.priority.length > 0 ||
      currentFilterSort.category.length > 0 ||
      currentFilterSort.assignee.length > 0 ||
      currentFilterSort.dueDate !== "all" ||
      currentFilterSort.progress.min > 0 ||
      currentFilterSort.progress.max < 100
    );
  };

  return (
    <div className="bg-background border-b border-border theme-transition">
      {/* Top section */}
      <div className="flex justify-between items-center px-4 md:px-8 py-6">
        <div className="flex items-center gap-3">
          <button className="lg:hidden hover:bg-muted p-2 rounded-lg theme-transition transition-colors">
            <Menu className="w-5 h-5 text-muted-foreground" />
          </button>
          <h1 className="font-bold text-foreground text-lg md:text-xl">
            Welcome back, Vincent 👋
          </h1>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Search */}
          <button className="hover:bg-muted p-2 rounded-lg theme-transition transition-colors">
            <Search className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Notifications */}
          <button className="relative hover:bg-muted p-2 rounded-lg theme-transition transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="-top-1 -right-1 absolute bg-orange-400 border-2 border-background rounded-full w-3 h-3"></span>
          </button>

          {/* Calendar */}
          <div className="hidden md:flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-5 h-5" />
            <span className="font-medium text-sm">{currentDate}</span>
          </div>

          {/* Profile */}
          <div className="bg-muted rounded-full w-9 h-9 overflow-hidden">
            <ImageWithFallback
              src="/img/user-1.png"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Bottom section - Controls */}
      <div className="px-4 md:px-8 py-4 border-t border-border">
        <div className="flex justify-between items-center">
          {/* View toggle */}
          <div className="flex items-center">
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 pb-2 border-foreground border-b-2 font-medium text-foreground">
                <div className="gap-1 grid grid-cols-2">
                  <div className="bg-current rounded-sm w-2 h-2"></div>
                  <div className="bg-current rounded-sm w-2 h-2"></div>
                  <div className="bg-current rounded-sm w-2 h-2"></div>
                  <div className="bg-current rounded-sm w-2 h-2"></div>
                </div>
                Board view
              </button>

              <button
                className="flex items-center gap-2 pb-2 font-medium text-muted-foreground hover:text-foreground theme-transition"
                onClick={onOpenCreateEditProjectModal}
              >
                <Plus className="w-4 h-4" />
                Add view
              </button>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 md:gap-4">
            <button
              className={`font-medium hover:text-foreground flex items-center gap-1 theme-transition ${
                hasActiveFilters() ? "text-primary" : "text-foreground"
              }`}
              onClick={() => setIsFilterModalOpen(true)}
            >
              <Filter className="w-4 h-4" />
              Filter
              {hasActiveFilters() && (
                <span className="bg-primary rounded-full w-2 h-2"></span>
              )}
            </button>
            <button
              className="hidden md:inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground theme-transition"
              onClick={() => setIsFilterModalOpen(true)}
            >
              Sort
            </button>
            <button className="hover:bg-muted p-2 rounded-lg theme-transition transition-colors">
              <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
            </button>
            <Button
              className="bg-primary hover:bg-primary/90 px-6 text-primary-foreground"
              onClick={() => setIsTemplateModalOpen(true)}
            >
              New template
            </Button>
          </div>
        </div>
      </div>

      <FilterSortModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        currentOptions={currentFilterSort}
        onApply={onFilterSort || (() => {})}
        availableCategories={availableCategories}
        availableAssignees={availableAssignees}
      />

      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
      />
    </div>
  );
};
