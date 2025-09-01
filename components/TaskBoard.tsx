"use client";

import React, { useState, useEffect } from "react";
import { useTaskContext } from "./TaskContext";
import { TaskColumn } from "./TaskColumn";
import { TaskModal } from "./TaskModal";
import { Plus, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Simple2DCelebration } from "./Simple2DCelebration";
import { FilterSortOptions } from "./FilterSortModal";

interface TaskBoardProps {
  filterSort?: FilterSortOptions;
  onFilterSortChange?: (options: FilterSortOptions) => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ filterSort }) => {
  const {
    tasks,
    currentProjectId,
    getTemplatesByProject,
    getTasksByTemplate,
    addTemplate,
  } = useTaskContext();

  const [isAddingTemplate, setIsAddingTemplate] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateDescription, setNewTemplateDescription] = useState("");
  const [newTemplateColor, setNewTemplateColor] = useState("#3B82F6");

  // Task modal state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<(typeof tasks)[0] | undefined>(
    undefined
  );

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");

  // Celebration state
  const [celebrationState, setCelebrationState] = useState<{
    isVisible: boolean;
    taskTitle: string;
  }>({
    isVisible: false,
    taskTitle: "",
  });

  // Track previous task states to detect completion
  const [previousTasks, setPreviousTasks] = useState<Map<string, number>>(
    new Map()
  );

  const currentTemplates = getTemplatesByProject(currentProjectId);

  console.log(
    "TaskBoard render - templates:",
    currentTemplates.length,
    "tasks:",
    tasks.length
  );

  // Watch for task completion and trigger celebration
  useEffect(() => {
    tasks.forEach((task) => {
      const previousProgress = previousTasks.get(task.id);
      const currentProgress = task.progress;

      // If task just reached 100% completion
      if (
        previousProgress !== undefined &&
        previousProgress < 100 &&
        currentProgress === 100
      ) {
        setCelebrationState({
          isVisible: true,
          taskTitle: task.title,
        });
      }
    });

    // Update previous tasks map
    const newPreviousTasks = new Map();
    tasks.forEach((task) => {
      newPreviousTasks.set(task.id, task.progress);
    });
    setPreviousTasks(newPreviousTasks);
  }, [tasks]);

  // Apply filters and sorting to tasks
  const getFilteredAndSortedTasks = (templateId: string) => {
    let templateTasks = getTasksByTemplate(templateId);

    if (!filterSort) return templateTasks;

    // Apply filters
    if (filterSort.priority.length > 0) {
      templateTasks = templateTasks.filter((task) =>
        filterSort.priority.includes(task.priority)
      );
    }

    if (filterSort.category.length > 0) {
      templateTasks = templateTasks.filter((task) =>
        filterSort.category.includes(task.category)
      );
    }

    if (filterSort.assignee.length > 0) {
      templateTasks = templateTasks.filter((task) =>
        task.teamMembers.some((member) => filterSort.assignee.includes(member))
      );
    }

    // Progress range filter
    templateTasks = templateTasks.filter(
      (task) =>
        task.progress >= filterSort.progress.min &&
        task.progress <= filterSort.progress.max
    );

    // Due date filter
    if (filterSort.dueDate !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      const thisMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate()
      );

      templateTasks = templateTasks.filter((task) => {
        const dueDate = new Date(task.dueDate);

        switch (filterSort.dueDate) {
          case "overdue":
            return dueDate < today;
          case "today":
            return (
              dueDate >= today &&
              dueDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)
            );
          case "thisWeek":
            return dueDate >= today && dueDate < thisWeek;
          case "thisMonth":
            return dueDate >= today && dueDate < thisMonth;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    templateTasks.sort((a, b) => {
      let comparison = 0;

      switch (filterSort.sortBy) {
        case "dueDate":
          comparison =
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
          break;
        case "progress":
          comparison = a.progress - b.progress;
          break;
        case "createdAt":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        default:
          comparison = 0;
      }

      return filterSort.sortOrder === "desc" ? -comparison : comparison;
    });

    return templateTasks;
  };

  const handleAddTemplate = () => {
    if (newTemplateName.trim()) {
      const nextOrder =
        Math.max(...currentTemplates.map((t) => t.order), -1) + 1;

      addTemplate({
        name: newTemplateName.trim(),
        description: newTemplateDescription.trim() || "",
        projectId: currentProjectId,
        color: newTemplateColor,
        order: nextOrder,
        wipLimit: undefined,
        isArchived: false,
      });

      // Reset form
      setNewTemplateName("");
      setNewTemplateDescription("");
      setNewTemplateColor("#3B82F6");
      setIsAddingTemplate(false);
    }
  };

  const handleCancelAdd = () => {
    setNewTemplateName("");
    setNewTemplateDescription("");
    setNewTemplateColor("#3B82F6");
    setIsAddingTemplate(false);
  };

  const handleCreateTask = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setEditingTask(undefined);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: {
    id: string;
    title: string;
    templateId: string;
  }) => {
    const fullTask = tasks.find((t) => t.id === task.id);
    setEditingTask(fullTask);
    setSelectedTemplateId(task.templateId);
    setIsTaskModalOpen(true);
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(undefined);
    setSelectedTemplateId("");
  };

  const colorOptions = [
    { value: "#EF4444", name: "Red" },
    { value: "#F59E0B", name: "Orange" },
    { value: "#EAB308", name: "Yellow" },
    { value: "#10B981", name: "Green" },
    { value: "#3B82F6", name: "Blue" },
    { value: "#8B5CF6", name: "Purple" },
    { value: "#EC4899", name: "Pink" },
    { value: "#6B7280", name: "Gray" },
  ];

  return (
    <div className="flex-1 bg-muted/30 p-4 md:p-8 overflow-hidden theme-transition">
      {/* Kanban Board */}
      <div className="w-full h-[calc(100vh-280px)]">
        <div
          className="flex gap-6 h-full overflow-x-auto scrollable-horizontal"
          style={{ maxWidth: "100%" }}
        >
          {currentTemplates.map((template) => {
            const templateTasks = getFilteredAndSortedTasks(template.id);
            const isOverLimit = template.wipLimit
              ? templateTasks.length > template.wipLimit
              : false;

            return (
              <TaskColumn
                key={template.id}
                templateId={template.id}
                title={template.name}
                count={templateTasks.length}
                color={template.color}
                wipLimit={template.wipLimit}
                isOverLimit={isOverLimit}
                description={template.description}
                tasks={templateTasks}
                onCreateTask={() => handleCreateTask(template.id)}
                onEditTask={handleEditTask}
              />
            );
          })}

          {/* Add Template Quick Action */}
          {currentTemplates.length < 6 && !isAddingTemplate && (
            <div className="flex flex-col flex-shrink-0 justify-center items-center bg-muted/20 p-4 border-2 border-border border-dashed rounded-lg w-80 text-center theme-transition">
              <Plus className="mb-2 w-8 h-8 text-muted-foreground" />
              <p className="mb-3 text-muted-foreground text-sm">
                Add a new template to customize your workflow
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddingTemplate(true)}
              >
                Add Template
              </Button>
            </div>
          )}

          {/* Add Template Form */}
          {isAddingTemplate && (
            <div className="flex flex-col flex-shrink-0 bg-background p-6 border-2 border-primary/50 border-dashed rounded-lg w-80 theme-transition">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-foreground">
                  Add New Template
                </h3>
                <Button variant="ghost" size="sm" onClick={handleCancelAdd}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <label className="block mb-2 font-medium text-foreground text-sm">
                    Template Name
                  </label>
                  <Input
                    placeholder="e.g., Review, Testing, Deployed..."
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-foreground text-sm">
                    Description
                  </label>
                  <Textarea
                    placeholder="Optional description for this template..."
                    value={newTemplateDescription}
                    onChange={(e) => setNewTemplateDescription(e.target.value)}
                    className="resize-none"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-foreground text-sm">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setNewTemplateColor(color.value)}
                        className={`w-8 h-8 rounded-full border-2 transition-all theme-transition ${
                          newTemplateColor === color.value
                            ? "border-foreground scale-110"
                            : "border-border hover:scale-105"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button
                  onClick={handleAddTemplate}
                  disabled={!newTemplateName.trim()}
                  className="flex-1"
                >
                  Add Template
                </Button>
                <Button variant="outline" onClick={handleCancelAdd}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseTaskModal}
        task={editingTask}
        templateId={selectedTemplateId}
        projectId={currentProjectId}
      />

      {/* 2D Completion Celebration */}
      <Simple2DCelebration
        isVisible={celebrationState.isVisible}
        taskTitle={celebrationState.taskTitle}
        onClose={() => setCelebrationState({ isVisible: false, taskTitle: "" })}
      />
    </div>
  );
};
