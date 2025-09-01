"use client";

import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import {
  MoreHorizontal,
  MessageCircle,
  Paperclip,
  Trash2,
  Edit,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { DragHandle } from "./DragHandle";
import { useTaskContext, Task } from "./TaskContext";
import { useTeamContext } from "./TeamContext";
import { EnhancedAvatar } from "./EnhancedAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  getProgressBarColor,
  getProgressTextColor,
  formatDueDate,
  getDueDateBadgeStyle,
} from "./task-utils";

interface TaskCardProps {
  task: Task;
  index: number;
  moveTaskInColumn: (dragIndex: number, hoverIndex: number) => void;
  onEditTask?: (task: Task) => void;
}

interface DragItem {
  id: string;
  index: number;
  templateId: string;
  type: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  index,
  moveTaskInColumn,
  onEditTask,
}) => {
  const { updateTask, deleteTask, moveTask, templates } = useTaskContext();
  const { getTeamMemberById } = useTeamContext();

  const ref = useRef<HTMLDivElement>(null);

  // Drag functionality
  const [{ isDragging }, drag] = useDrag({
    type: "task",
    item: (): DragItem => ({
      id: task.id,
      index,
      templateId: task.templateId,
      type: "task",
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Drop functionality for reordering within column
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    unknown,
    { handlerId: string | symbol | null }
  >({
    accept: "task",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;
      const dragTemplateId = item.templateId;
      const hoverTemplateId = task.templateId;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex && dragTemplateId === hoverTemplateId) {
        return;
      }

      // Only handle reordering within the same column
      if (dragTemplateId === hoverTemplateId) {
        // Determine rectangle on screen
        const hoverBoundingRect = ref.current?.getBoundingClientRect();

        // Get vertical middle
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // Determine mouse position
        const clientOffset = monitor.getClientOffset();

        // Get pixels to the top
        const hoverClientY = (clientOffset?.y ?? 0) - hoverBoundingRect.top;

        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%

        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }

        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }

        // Time to actually perform the action
        moveTaskInColumn(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        item.index = hoverIndex;
      }
    },
  });

  // Combine drag and drop refs
  drag(drop(ref));

  const handleProgressUpdate = (delta: number) => {
    const newCompletedSteps = Math.max(
      0,
      Math.min(task.totalSteps, task.completedSteps + delta)
    );
    const newProgress = Math.round((newCompletedSteps / task.totalSteps) * 100);

    updateTask(task.id, {
      completedSteps: newCompletedSteps,
      progress: newProgress,
    });
  };

  // Calculate current progress percentage
  const currentProgress = Math.round(
    (task.completedSteps / task.totalSteps) * 100
  );

  // Get current template and project templates for navigation
  const projectTemplates = templates
    .filter((t) => t.projectId === task.projectId && !t.isArchived)
    .sort((a, b) => a.order - b.order);

  const currentIndex = projectTemplates.findIndex(
    (t) => t.id === task.templateId
  );
  const canMoveLeft = currentIndex > 0;
  const canMoveRight = currentIndex < projectTemplates.length - 1;

  const moveLeft = () => {
    if (canMoveLeft) {
      const targetTemplate = projectTemplates[currentIndex - 1];
      moveTask(task.id, targetTemplate.id);
    }
  };

  const moveRight = () => {
    if (canMoveRight) {
      const targetTemplate = projectTemplates[currentIndex + 1];
      moveTask(task.id, targetTemplate.id);
    }
  };

  // Get due date styling
  const dueDateStyle = getDueDateBadgeStyle(task.dueDate);

  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      className={`task-card bg-card rounded-xl border border-border p-5 cursor-move select-none theme-transition ${
        isDragging
          ? "opacity-50 rotate-3 scale-98 shadow-2xl z-50"
          : "hover:border-border/50 hover:shadow-md hover:-translate-y-1"
      }`}
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-1 items-start gap-2">
          {/* Drag Handle */}
          <DragHandle isDragging={isDragging} />

          <div className="flex-1">
            <h3 className="font-bold text-card-foreground leading-tight">
              {task.title}
            </h3>
            <p className="mt-1 text-muted-foreground text-sm line-clamp-2">
              {task.description}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hover:bg-accent p-1 rounded theme-transition">
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onEditTask?.(task)}>
              <Edit className="mr-2 w-4 h-4" />
              Edit Task
            </DropdownMenuItem>
            {canMoveLeft && (
              <DropdownMenuItem onClick={moveLeft}>
                <ChevronLeft className="mr-2 w-4 h-4" />
                Move Left
              </DropdownMenuItem>
            )}
            {canMoveRight && (
              <DropdownMenuItem onClick={moveRight}>
                <ChevronRight className="mr-2 w-4 h-4" />
                Move Right
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => deleteTask(task.id)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 w-4 h-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-muted-foreground text-sm">
            Progress
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium ${getProgressTextColor(
                currentProgress
              )}`}
            >
              {currentProgress}% ({task.completedSteps}/{task.totalSteps})
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => handleProgressUpdate(-1)}
                className="flex justify-center items-center hover:bg-accent disabled:hover:bg-transparent disabled:opacity-40 rounded w-5 h-5 text-muted-foreground hover:text-foreground disabled:hover:text-muted-foreground theme-transition disabled:cursor-not-allowed"
                disabled={task.completedSteps === 0}
              >
                -
              </button>
              <button
                onClick={() => handleProgressUpdate(1)}
                className="flex justify-center items-center hover:bg-accent disabled:hover:bg-transparent disabled:opacity-40 rounded w-5 h-5 text-muted-foreground hover:text-foreground disabled:hover:text-muted-foreground theme-transition disabled:cursor-not-allowed"
                disabled={task.completedSteps === task.totalSteps}
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div className="bg-muted rounded-full w-full h-2 progress-bar-track">
          <div
            className="rounded-full h-2 progress-bar-fill"
            style={{
              width: `${currentProgress}%`,
              backgroundColor: getProgressBarColor(currentProgress),
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center">
        <div
          className={`px-3 py-1.5 rounded-full text-xs font-medium border ${dueDateStyle.bg} ${dueDateStyle.text} ${dueDateStyle.border}`}
        >
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDueDate(task.dueDate)}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Comments */}
          {task.comments > 0 && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <MessageCircle className="w-4 h-4" />
              <span className="font-medium text-xs">{task.comments}</span>
            </div>
          )}

          {/* Attachments */}
          {task.attachments > 0 && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Paperclip className="w-4 h-4" />
              <span className="font-medium text-xs">{task.attachments}</span>
            </div>
          )}

          {/* Team members */}
          <div className="flex -space-x-1.5">
            {task.teamMembers.slice(0, 3).map((memberId) => {
              const member = getTeamMemberById(memberId);
              if (!member) return null;

              return (
                <EnhancedAvatar
                  key={memberId}
                  id={member.id}
                  name={member.name}
                  size="sm"
                  className="ring-2 ring-card"
                />
              );
            })}
            {task.teamMembers.length > 3 && (
              <div className="flex justify-center items-center bg-muted border-2 border-card rounded-full ring-2 ring-card w-6 h-6">
                <span className="font-bold text-muted-foreground text-xs">
                  +{task.teamMembers.length - 3}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
