"use client";

import React from "react";
import {
  Users,
  MessageCircle,
  Clock,
  ChevronRight,
  Plus,
  Sun,
  Moon,
} from "lucide-react";
import { useTaskContext } from "./TaskContext";

export const Sidebar: React.FC = () => {
  const { tasks } = useTaskContext();

  const todoCount = tasks.filter((t) => t.status === "todo").length;
  const inProgressCount = tasks.filter((t) => t.status === "inprogress").length;
  const doneCount = tasks.filter((t) => t.status === "done").length;
  const totalCount = tasks.length;

  return (
    <div className="flex flex-col bg-white border-gray-100 border-r w-80 h-full">
      {/* Top section */}
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex justify-center items-center bg-gray-900 rounded-lg w-8 h-8">
            <div className="bg-white rounded-sm w-4 h-4"></div>
          </div>
          <h2 className="font-bold text-gray-900 text-2xl">Projects</h2>
          <button className="hover:bg-gray-100 ml-auto p-1 rounded">
            <Plus className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          <button className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-lg w-full text-gray-600 transition-colors">
            <Users className="w-5 h-5" />
            <span className="font-medium">Team</span>
            <ChevronRight className="ml-auto w-4 h-4 text-gray-400" />
          </button>
        </nav>
      </div>

      {/* Projects section */}
      <div className="px-6 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <button className="flex items-center gap-2 font-bold text-gray-900">
            <ChevronRight className="w-4 h-4 rotate-90" />
            Projects
          </button>
        </div>

        <div className="space-y-1 ml-4">
          <button className="flex justify-between items-center hover:bg-gray-50 px-3 py-2 rounded-lg w-full text-gray-500 transition-colors">
            <span>All projects (3)</span>
          </button>
          <button className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-lg w-full text-gray-900">
            <span>Design system</span>
          </button>
          <button className="flex justify-between items-center hover:bg-gray-50 px-3 py-2 rounded-lg w-full text-gray-500 transition-colors">
            <span>User flow</span>
          </button>
          <button className="flex justify-between items-center hover:bg-gray-50 px-3 py-2 rounded-lg w-full text-gray-500 transition-colors">
            <span>Ux research</span>
          </button>
        </div>
      </div>

      {/* Tasks section */}
      <div className="px-6 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <button className="flex items-center gap-2 font-bold text-gray-900">
            <ChevronRight className="w-4 h-4 rotate-90" />
            Tasks
          </button>
        </div>

        <div className="space-y-1 ml-4">
          <button className="flex justify-between items-center hover:bg-gray-50 px-3 py-2 rounded-lg w-full text-gray-500 transition-colors">
            <span>All tasks ({totalCount})</span>
          </button>
          <button className="flex justify-between items-center hover:bg-gray-50 px-3 py-2 rounded-lg w-full text-gray-500 transition-colors">
            <span>To do ({todoCount})</span>
          </button>
          <button className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-lg w-full text-gray-900">
            <span>In progress ({inProgressCount})</span>
          </button>
          <button className="flex justify-between items-center hover:bg-gray-50 px-3 py-2 rounded-lg w-full text-gray-500 transition-colors">
            <span>Done ({doneCount})</span>
          </button>
        </div>
      </div>

      {/* Bottom section */}
      <div className="mt-auto px-6 pb-6">
        <div className="space-y-1 mb-6">
          <button className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-lg w-full text-gray-600 transition-colors">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Reminders</span>
            <ChevronRight className="ml-auto w-4 h-4 text-gray-400" />
          </button>
          <button className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-lg w-full text-gray-600 transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">Messengers</span>
            <ChevronRight className="ml-auto w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Theme toggle */}
        <div className="flex bg-gray-100 p-1 rounded-2xl">
          <button className="flex flex-1 justify-center items-center gap-2 bg-white shadow-sm px-3 py-2 rounded-xl text-gray-900">
            <Sun className="w-4 h-4" />
            <span className="font-medium text-sm">Light</span>
          </button>
          <button className="flex flex-1 justify-center items-center gap-2 px-3 py-2 text-gray-500">
            <Moon className="w-4 h-4" />
            <span className="font-medium text-sm">Dark</span>
          </button>
        </div>
      </div>
    </div>
  );
};
