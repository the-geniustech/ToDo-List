"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Filter,
  SortAsc,
  Calendar,
  User,
  Tag,
  Flag,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  RotateCcw,
} from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";

export interface FilterSortOptions {
  // Filter options
  priority: ("low" | "medium" | "high")[];
  category: string[];
  progress: {
    min: number;
    max: number;
  };
  dueDate: "overdue" | "today" | "thisWeek" | "thisMonth" | "all";
  assignee: string[];

  // Sort options
  sortBy: "dueDate" | "priority" | "progress" | "createdAt" | "title";
  sortOrder: "asc" | "desc";
}

interface FilterSortModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentOptions: FilterSortOptions;
  onApply: (options: FilterSortOptions) => void;
  availableCategories: string[];
  availableAssignees: { id: string; name: string }[];
}

const defaultOptions: FilterSortOptions = {
  priority: [],
  category: [],
  progress: { min: 0, max: 100 },
  dueDate: "all",
  assignee: [],
  sortBy: "dueDate",
  sortOrder: "asc",
};

export const FilterSortModal: React.FC<FilterSortModalProps> = ({
  isOpen,
  onClose,
  currentOptions,
  onApply,
  availableCategories,
  availableAssignees,
}) => {
  const [options, setOptions] = useState<FilterSortOptions>(currentOptions);

  // Reset to current options when modal opens
  useEffect(() => {
    if (isOpen) {
      setOptions(currentOptions);
    }
  }, [isOpen, currentOptions]);

  // Priority options
  const priorityOptions = [
    {
      value: "high",
      label: "High Priority",
      color: "bg-red-500",
      icon: AlertCircle,
    },
    {
      value: "medium",
      label: "Medium Priority",
      color: "bg-yellow-500",
      icon: Circle,
    },
    {
      value: "low",
      label: "Low Priority",
      color: "bg-green-500",
      icon: CheckCircle2,
    },
  ] as const;

  // Due date options
  const dueDateOptions = [
    { value: "all", label: "All Tasks" },
    { value: "overdue", label: "Overdue" },
    { value: "today", label: "Due Today" },
    { value: "thisWeek", label: "Due This Week" },
    { value: "thisMonth", label: "Due This Month" },
  ] as const;

  // Sort options
  const sortByOptions = [
    { value: "dueDate", label: "Due Date", icon: Calendar },
    { value: "priority", label: "Priority", icon: Flag },
    { value: "progress", label: "Progress", icon: Clock },
    { value: "createdAt", label: "Created Date", icon: Calendar },
    { value: "title", label: "Title", icon: Tag },
  ] as const;

  // Handle priority toggle
  const togglePriority = (priority: "low" | "medium" | "high") => {
    setOptions((prev) => ({
      ...prev,
      priority: prev.priority.includes(priority)
        ? prev.priority.filter((p) => p !== priority)
        : [...prev.priority, priority],
    }));
  };

  // Handle category toggle
  const toggleCategory = (category: string) => {
    setOptions((prev) => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter((c) => c !== category)
        : [...prev.category, category],
    }));
  };

  // Handle assignee toggle
  const toggleAssignee = (assigneeId: string) => {
    setOptions((prev) => ({
      ...prev,
      assignee: prev.assignee.includes(assigneeId)
        ? prev.assignee.filter((a) => a !== assigneeId)
        : [...prev.assignee, assigneeId],
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setOptions(defaultOptions);
  };

  // Apply filters
  const handleApply = () => {
    onApply(options);
    onClose();
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      options.priority.length > 0 ||
      options.category.length > 0 ||
      options.assignee.length > 0 ||
      options.dueDate !== "all" ||
      options.progress.min > 0 ||
      options.progress.max < 100
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="z-50 fixed inset-0 flex justify-center items-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="z-50 relative flex flex-col bg-card shadow-2xl border-border rounded-xl w-full max-w-2xl max-h-[90vh] text-card-foreground theme-transition"
        >
          {/* Header */}
          <div className="flex flex-shrink-0 justify-between items-center bg-muted p-6 border-b border-border rounded-t-xl theme-transition">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-lg theme-transition">
                <Filter className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground text-lg">
                  Filter & Sort Tasks
                </h2>
                <p className="text-muted-foreground text-sm">
                  Customize how tasks are displayed
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-6 p-6 overflow-y-auto">
            {/* Active Filters Summary */}
            {hasActiveFilters() && (
              <div className="bg-accent p-4 border border-border rounded-lg theme-transition">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-accent-foreground">
                    Active Filters
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="text-primary hover:text-primary/80"
                  >
                    <RotateCcw className="mr-1 w-4 h-4" />
                    Reset All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {options.priority.map((priority) => (
                    <Badge
                      key={priority}
                      variant="secondary"
                      className="capitalize"
                    >
                      {priority} Priority
                    </Badge>
                  ))}
                  {options.category.map((category) => (
                    <Badge key={category} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                  {options.dueDate !== "all" && (
                    <Badge variant="secondary">
                      {
                        dueDateOptions.find((d) => d.value === options.dueDate)
                          ?.label
                      }
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <div className="gap-6 grid grid-cols-1 lg:grid-cols-2">
              {/* Filter Section */}
              <div className="space-y-6">
                <h3 className="flex items-center gap-2 font-semibold text-foreground text-base">
                  <Filter className="w-4 h-4" />
                  Filters
                </h3>

                {/* Priority Filter */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Flag className="w-4 h-4" />
                    Priority
                  </Label>
                  <div className="space-y-2">
                    {priorityOptions.map((priority) => {
                      const Icon = priority.icon;
                      return (
                        <div
                          key={priority.value}
                          className="flex items-center space-x-3"
                        >
                          <Checkbox
                            id={`priority-${priority.value}`}
                            checked={options.priority.includes(priority.value)}
                            onCheckedChange={() =>
                              togglePriority(priority.value)
                            }
                          />
                          <label
                            htmlFor={`priority-${priority.value}`}
                            className="flex items-center gap-2 font-medium text-foreground text-sm cursor-pointer"
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${priority.color}`}
                            />
                            <Icon className="w-4 h-4" />
                            {priority.label}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Category Filter */}
                {availableCategories.length > 0 && (
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Category
                    </Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {availableCategories.map((category) => (
                        <div
                          key={category}
                          className="flex items-center space-x-3"
                        >
                          <Checkbox
                            id={`category-${category}`}
                            checked={options.category.includes(category)}
                            onCheckedChange={() => toggleCategory(category)}
                          />
                          <label
                            htmlFor={`category-${category}`}
                            className="font-medium text-foreground text-sm cursor-pointer"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Due Date Filter */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Due Date
                  </Label>
                  <Select
                    value={options.dueDate}
                    onValueChange={(value) =>
                      setOptions((prev) => ({
                        ...prev,
                        dueDate: value as FilterSortOptions["dueDate"],
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dueDateOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Assignee Filter */}
                {availableAssignees.length > 0 && (
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Assigned To
                    </Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {availableAssignees.map((assignee) => (
                        <div
                          key={assignee.id}
                          className="flex items-center space-x-3"
                        >
                          <Checkbox
                            id={`assignee-${assignee.id}`}
                            checked={options.assignee.includes(assignee.id)}
                            onCheckedChange={() => toggleAssignee(assignee.id)}
                          />
                          <label
                            htmlFor={`assignee-${assignee.id}`}
                            className="font-medium text-foreground text-sm cursor-pointer"
                          >
                            {assignee.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sort Section */}
              <div className="space-y-6">
                <h3 className="flex items-center gap-2 font-semibold text-foreground text-base">
                  <SortAsc className="w-4 h-4" />
                  Sort
                </h3>

                {/* Sort By */}
                <div className="space-y-3">
                  <Label>Sort By</Label>
                  <Select
                    value={options.sortBy}
                    onValueChange={(value) =>
                      setOptions((prev) => ({
                        ...prev,
                        sortBy: value as FilterSortOptions["sortBy"],
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortByOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort Order */}
                <div className="space-y-3">
                  <Label>Sort Order</Label>
                  <div className="gap-2 grid grid-cols-2">
                    <Button
                      variant={
                        options.sortOrder === "asc" ? "default" : "outline"
                      }
                      onClick={() =>
                        setOptions((prev) => ({ ...prev, sortOrder: "asc" }))
                      }
                      className="justify-start"
                    >
                      <ArrowUp className="mr-2 w-4 h-4" />
                      Ascending
                    </Button>
                    <Button
                      variant={
                        options.sortOrder === "desc" ? "default" : "outline"
                      }
                      onClick={() =>
                        setOptions((prev) => ({ ...prev, sortOrder: "desc" }))
                      }
                      className="justify-start"
                    >
                      <ArrowDown className="mr-2 w-4 h-4" />
                      Descending
                    </Button>
                  </div>
                </div>

                {/* Progress Range */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Progress Range
                  </Label>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-muted-foreground text-sm">
                        <span>Min: {options.progress.min}%</span>
                        <span>Max: {options.progress.max}%</span>
                      </div>
                      <div className="gap-4 grid grid-cols-2">
                        <div>
                          <Label className="text-xs">Min %</Label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={options.progress.min}
                            onChange={(e) =>
                              setOptions((prev) => ({
                                ...prev,
                                progress: {
                                  ...prev.progress,
                                  min: Math.min(
                                    parseInt(e.target.value),
                                    prev.progress.max
                                  ),
                                },
                              }))
                            }
                            className="bg-muted rounded-lg w-full h-2 appearance-none cursor-pointer range-slider"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Max %</Label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={options.progress.max}
                            onChange={(e) =>
                              setOptions((prev) => ({
                                ...prev,
                                progress: {
                                  ...prev.progress,
                                  max: Math.max(
                                    parseInt(e.target.value),
                                    prev.progress.min
                                  ),
                                },
                              }))
                            }
                            className="bg-muted rounded-lg w-full h-2 appearance-none cursor-pointer range-slider"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-shrink-0 justify-between items-center bg-muted p-6 border-t border-border rounded-b-xl theme-transition">
            <Button
              variant="outline"
              onClick={resetFilters}
              disabled={!hasActiveFilters()}
            >
              <RotateCcw className="mr-2 w-4 h-4" />
              Reset All
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleApply}>Apply Filters</Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
