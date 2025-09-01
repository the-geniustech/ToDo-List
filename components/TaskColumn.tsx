"use client";

import React, { useState, useCallback } from "react";
import { useDrop } from "react-dnd";
import { Plus } from "lucide-react";
import { useTaskContext, Task } from "./TaskContext";
import { TaskCard } from "./TaskCard";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface TaskColumnProps {
  templateId?: string;
  title: string;
  count: number;
  color?: string;
  wipLimit?: number;
  isOverLimit?: boolean;
  description?: string;
  onCreateTask?: () => void;
  onEditTask?: (task: Task) => void;
  tasks?: Task[]; // Pre-filtered tasks to display
  // Legacy props for backward compatibility
  status?: Task["status"];
}

interface DragItem {
  id: string;
  index: number;
  templateId: string;
  type: string;
}

export const TaskColumn: React.FC<TaskColumnProps> = ({
  templateId,
  title,
  count,
  color = "#3B82F6",
  wipLimit,
  isOverLimit = false,
  description,
  onCreateTask,
  onEditTask,
  tasks: propTasks, // Pre-filtered tasks
  status, // Legacy prop
}) => {
  const {
    tasks,
    addTask,
    moveTask,
    moveTaskLegacy,
    getTasksByTemplate,
    reorderTasksInTemplate,
    currentProjectId,
  } = useTaskContext();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

  // Get tasks for this column (use prop tasks if provided, otherwise get from context)
  const columnTasks =
    propTasks ||
    (templateId
      ? getTasksByTemplate(templateId)
      : tasks.filter((task) => task.status === status));

  // Handle dropping tasks from other columns
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "task",
    drop: (item: DragItem) => {
      const sourceTemplateId = item.templateId;
      const targetTemplateId = templateId || status;

      // Only move if dropping from different column
      if (sourceTemplateId !== targetTemplateId) {
        if (templateId) {
          moveTask(item.id, templateId);
        } else if (status) {
          moveTaskLegacy(item.id, status);
        }
      }

      return { moved: true };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  // Handle reordering within this column
  const moveTaskInColumn = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      if (templateId && reorderTasksInTemplate) {
        reorderTasksInTemplate(templateId, dragIndex, hoverIndex);
      }
    },
    [templateId, reorderTasksInTemplate]
  );

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask({
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim() || "New task",
        templateId: templateId || "template-todo",
        projectId: currentProjectId,
        status,
        progress: 0,
        totalSteps: 10,
        completedSteps: 0,
        dueDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        comments: 0,
        attachments: 0,
        teamMembers: ["new-user"],
        category: "General",
        priority: "medium",
        color: "blue",
      });

      setNewTaskTitle("");
      setNewTaskDescription("");
      setIsAddingTask(false);
    }
  };

  const handleCancelAdd = () => {
    setNewTaskTitle("");
    setNewTaskDescription("");
    setIsAddingTask(false);
  };

  // Dynamic styling based on drop state
  const getColumnStyling = () => {
    const baseClasses =
      "flex-shrink-0 w-md bg-background rounded-xl border-2 border-dashed p-6 transition-all duration-300 flex flex-col min-h-[500px] theme-transition";

    if (isOver && canDrop) {
      return `${baseClasses} border-primary/60 bg-primary/10 shadow-lg scale-[1.02] transform`;
    } else if (canDrop) {
      return `${baseClasses} border-primary/40 bg-primary/5`;
    } else {
      return `${baseClasses} border-border hover:border-border/80`;
    }
  };

  return (
    <>
      {drop(
        <div className={getColumnStyling()}>
          {/* Column Header */}
          <div className="flex flex-shrink-0 justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              {/* Template color indicator */}
              <div
                className="rounded-full w-3 h-3"
                style={{ backgroundColor: color }}
              />
              <div>
                <h2 className="font-semibold text-gray-500">
                  {title} ({count}
                  {wipLimit ? `/${wipLimit}` : ""})
                </h2>
                {description && (
                  <p className="mt-1 text-gray-400 text-xs">{description}</p>
                )}
              </div>
              {isOverLimit && (
                <div className="bg-red-100 px-2 py-1 rounded text-red-600 text-xs">
                  Over Limit
                </div>
              )}
            </div>

            <button
              onClick={
                onCreateTask ? onCreateTask : () => setIsAddingTask(true)
              }
              className="flex items-center gap-2 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-gray-900 transition-colors"
            >
              <div className="flex justify-center items-center bg-gray-100 rounded-full w-4 h-4">
                <Plus className="w-3 h-3 text-gray-400" />
              </div>
              <span className="font-medium text-sm">Add new task</span>
            </button>
          </div>

          {/* Add Task Form */}
          {isAddingTask && (
            <div className="flex-shrink-0 bg-gray-50 mb-4 p-4 border border-gray-200 rounded-lg">
              <div className="space-y-3">
                <Input
                  placeholder="Task title..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="font-medium"
                  autoFocus
                />
                <Textarea
                  placeholder="Task description..."
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  className="text-sm resize-none"
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleAddTask}
                    disabled={!newTaskTitle.trim()}
                  >
                    Add Task
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelAdd}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Scrollable Tasks Container */}
          <div className="flex-1 overflow-hidden">
            <div className="space-y-4 pr-2 h-full overflow-y-auto scrollable-column">
              {columnTasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  moveTaskInColumn={moveTaskInColumn}
                  onEditTask={onEditTask}
                />
              ))}

              {/* Empty state for drop zone */}
              {columnTasks.length === 0 && !isAddingTask && (
                <div
                  className={`h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-all duration-200 ${
                    isOver && canDrop
                      ? "border-blue-400 bg-blue-50 text-blue-600 animate-pulse"
                      : "border-gray-200 text-gray-400 hover:border-gray-300"
                  }`}
                >
                  {isOver && canDrop ? (
                    <>
                      <div className="mb-2 text-2xl">📋</div>
                      <p className="px-4 font-medium text-sm text-center">
                        Drop task here!
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="opacity-50 mb-2 text-2xl">📋</div>
                      <p className="px-4 font-medium text-sm text-center">
                        Drop tasks here or click &quot;Add new task&quot;
                      </p>
                    </>
                  )}
                </div>
              )}

              {/* Drop indicator at bottom */}
              {isOver && canDrop && columnTasks.length > 0 && (
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 opacity-75 mx-2 rounded-full h-2 animate-pulse" />
              )}

              {/* Minimum height for drop zone when tasks exist */}
              {columnTasks.length > 0 && (
                <div
                  className={`h-16 transition-all duration-200 ${
                    isOver && canDrop
                      ? "bg-blue-50/50 border-2 border-dashed border-blue-300 rounded-lg"
                      : ""
                  }`}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
