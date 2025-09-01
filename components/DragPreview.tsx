"use client";

import React from "react";
import { Task } from "./TaskContext";
import { formatRelativeDate } from "@/utils";

interface DragPreviewProps {
  task: Task;
}

export const DragPreview: React.FC<DragPreviewProps> = ({ task }) => {
  return (
    <div className="bg-white opacity-90 shadow-2xl p-5 border border-blue-300 rounded-xl rotate-3 scale-105 task-card drag-preview transform">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 leading-tight">
            {task.title}
          </h3>
          <p className="mt-1 text-gray-500 text-sm">{task.description}</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-gray-500 text-sm">Progress</span>
          <span className="font-medium text-gray-900 text-sm">
            {task.completedSteps}/{task.totalSteps}
          </span>
        </div>
        <div className="bg-gray-100 rounded-full w-full h-1">
          <div
            className="bg-blue-500 rounded-full h-1 transition-all duration-300"
            style={{
              width: `${(task.completedSteps / task.totalSteps) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="bg-blue-50 px-3 py-1 rounded-full font-medium text-blue-600 text-xs">
          {formatRelativeDate(task.dueDate)}
        </div>
        <div className="font-medium text-gray-400 text-xs">Dragging...</div>
      </div>
    </div>
  );
};
