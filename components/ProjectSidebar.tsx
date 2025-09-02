"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  FolderOpen,
  CheckSquare,
  Bell,
  MessageSquare,
  ChevronRight,
  Plus,
  Calendar,
  Target,
} from "lucide-react";
import { useTaskContext } from "./TaskContext";
import { ThemeToggle } from "./ThemeToggle";

interface NavigationState {
  team: boolean;
  projects: boolean;
  tasks: boolean;
  reminders: boolean;
  messengers: boolean;
}

interface NavItem {
  key: keyof NavigationState;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  count?: number;
  hasSubmenu: boolean;
}

export function ProjectSidebar({
  onOpenCreateEditProjectModal,
}: {
  onOpenCreateEditProjectModal: () => void;
}) {
  const {
    projects,
    currentProjectId,
    setCurrentProject,
    getTemplatesByProject,
    getTasksByTemplate,
  } = useTaskContext();

  const [expandedSections, setExpandedSections] = useState<NavigationState>({
    team: false,
    projects: true,
    tasks: true,
    reminders: false,
    messengers: false,
  });
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");

  const currentTemplates = getTemplatesByProject(currentProjectId);

  const projectTemplatesCount = currentTemplates.length;

  const toggleSection = (section: keyof NavigationState) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleProjectChange = (projectId: string) => {
    setCurrentProject(projectId);
    // Reset template selection when switching projects
    setSelectedTemplateId("");
  };

  // Reset template selection when project changes externally
  useEffect(() => {
    setSelectedTemplateId("");
  }, [currentProjectId]);

  const navigationItems: NavItem[] = [
    {
      key: "team",
      label: "Team",
      icon: Users,
      count: 12,
      hasSubmenu: true,
    },
    {
      key: "projects",
      label: "Projects",
      icon: FolderOpen,
      count: projects.length,
      hasSubmenu: true,
    },
    {
      key: "tasks",
      label: "Templates",
      icon: CheckSquare,
      count: projectTemplatesCount,
      hasSubmenu: true,
    },
    {
      key: "reminders",
      label: "Reminders",
      icon: Bell,
      count: 3,
      hasSubmenu: true,
    },
    {
      key: "messengers",
      label: "Messages",
      icon: MessageSquare,
      count: 8,
      hasSubmenu: true,
    },
  ];

  const teamMembers = [
    {
      id: "1",
      name: "Sarah Johnson",
      role: "Product Designer",
      avatar: "👩‍💼",
      online: true,
    },
    {
      id: "2",
      name: "Alex Chen",
      role: "Frontend Dev",
      avatar: "👨‍💻",
      online: true,
    },
    {
      id: "3",
      name: "Maria Garcia",
      role: "UX Researcher",
      avatar: "👩‍🎨",
      online: false,
    },
    {
      id: "4",
      name: "David Kim",
      role: "Backend Dev",
      avatar: "👨‍💻",
      online: true,
    },
  ];

  const reminders = [
    { id: "1", title: "Team standup", time: "9:00 AM", type: "meeting" },
    {
      id: "2",
      title: "Design review deadline",
      time: "5:00 PM",
      type: "deadline",
    },
    { id: "3", title: "Client presentation", time: "Tomorrow", type: "event" },
  ];

  const messages = [
    {
      id: "1",
      from: "Sarah Johnson",
      message: "Updated the wireframes",
      time: "2m ago",
      unread: true,
    },
    {
      id: "2",
      from: "Design Team",
      message: "New design system components",
      time: "1h ago",
      unread: true,
    },
    {
      id: "3",
      from: "Alex Chen",
      message: "API integration complete",
      time: "3h ago",
      unread: false,
    },
  ];

  return (
    <div className="relative flex flex-col bg-sidebar border-sidebar-border border-r w-[340px] h-screen overflow-hidden theme-transition">
      {/* Header */}
      <div className="px-7 py-8 border-sidebar-border border-b">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-bold text-sidebar-foreground text-2xl">
              Projects
            </h1>
            <p className="mt-1 text-muted-foreground text-sm">
              Workspace Overview
            </p>
          </div>
          <button
            onClick={onOpenCreateEditProjectModal}
            className="hover:bg-sidebar-accent p-2 rounded-lg transition-colors"
          >
            <Plus size={20} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 space-y-2 px-6 py-6 overflow-y-auto nav-scrollable">
        {navigationItems.map((item) => (
          <div key={item.key} className="relative">
            {/* Main Navigation Item */}
            <motion.div
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              <button
                onClick={() => toggleSection(item.key)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group theme-transition ${
                  expandedSections[item.key]
                    ? "bg-sidebar-accent border border-sidebar-border shadow-sm nav-gradient-hover"
                    : "hover:bg-sidebar-accent/50 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg transition-colors theme-transition ${
                      expandedSections[item.key]
                        ? "bg-background shadow-sm"
                        : "bg-muted group-hover:bg-muted/80"
                    }`}
                  >
                    <item.icon
                      size={18}
                      className={
                        expandedSections[item.key]
                          ? "text-sidebar-primary"
                          : "text-muted-foreground"
                      }
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <span
                      className={`font-semibold transition-colors theme-transition ${
                        expandedSections[item.key]
                          ? "text-sidebar-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.label}
                    </span>
                    {item.count !== undefined && (
                      <span className="text-muted-foreground text-xs">
                        {item.count} {item.count === 1 ? "item" : "items"}
                      </span>
                    )}
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: expandedSections[item.key] ? 90 : 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className={`p-1 rounded-md transition-colors theme-transition ${
                    expandedSections[item.key]
                      ? "bg-background"
                      : "group-hover:bg-muted/80"
                  }`}
                >
                  <ChevronRight size={14} className="text-muted-foreground" />
                </motion.div>
              </button>

              {/* Connection Line */}
              {expandedSections[item.key] && (
                <motion.div
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  exit={{ opacity: 0, scaleY: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
                  className="top-[60px] left-[26px] z-10 absolute origin-top"
                >
                  <div
                    className="bg-gradient-to-b from-sidebar-primary/40 via-sidebar-primary/20 to-transparent shadow-sm rounded-full w-0.5"
                    style={{
                      height: `${
                        item.key === "team"
                          ? "280px"
                          : item.key === "projects"
                          ? `${120 + projects.length * 48}px`
                          : item.key === "tasks"
                          ? `${80 + (currentTemplates.length + 1) * 52}px`
                          : item.key === "reminders"
                          ? "160px"
                          : "200px"
                      }`,
                    }}
                  />
                </motion.div>
              )}
            </motion.div>

            {/* Expandable Content */}
            <AnimatePresence>
              {expandedSections[item.key] && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 mt-3 ml-12 nav-item-indicator">
                    {/* Team Submenu */}
                    {item.key === "team" && (
                      <div className="space-y-2">
                        {teamMembers.map((member, memberIndex) => (
                          <motion.div
                            key={member.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: memberIndex * 0.1 }}
                            className="group flex items-center hover:bg-sidebar-accent/50 p-3 rounded-lg theme-transition transition-colors cursor-pointer"
                          >
                            <div className="relative">
                              <div className="flex justify-center items-center bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full w-8 h-8 text-white text-sm">
                                {member.avatar}
                              </div>
                              <div
                                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${
                                  member.online ? "bg-green-400" : "bg-muted"
                                }`}
                              />
                            </div>
                            <div className="flex-1 ml-3">
                              <p className="font-medium text-sidebar-foreground text-sm">
                                {member.name}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                {member.role}
                              </p>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <MessageSquare
                                size={16}
                                className="text-muted-foreground"
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Projects Submenu */}
                    {item.key === "projects" && (
                      <div className="space-y-1">
                        <motion.button
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="hover:bg-sidebar-accent/50 p-3 rounded-lg w-full text-left theme-transition transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="bg-muted-foreground rounded-full w-2 h-2" />
                            <span className="text-muted-foreground text-sm">
                              All Projects ({projects.length})
                            </span>
                          </div>
                        </motion.button>

                        {projects.map((project, projectIndex) => (
                          <motion.button
                            key={project.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (projectIndex + 1) * 0.1 }}
                            onClick={() => handleProjectChange(project.id)}
                            className={`w-full text-left p-3 rounded-lg transition-all duration-200 group theme-transition ${
                              project.id === currentProjectId
                                ? "bg-sidebar-accent border border-sidebar-border"
                                : "hover:bg-sidebar-accent/50"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className="rounded-full w-2 h-2"
                                style={{ backgroundColor: project.color }}
                              />
                              <span
                                className={`text-sm font-medium ${
                                  project.id === currentProjectId
                                    ? "text-sidebar-foreground"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {project.name}
                              </span>
                              {project.id === currentProjectId && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="ml-auto nav-active-indicator"
                                >
                                  <div className="bg-sidebar-primary rounded-full w-2 h-2" />
                                </motion.div>
                              )}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    )}

                    {/* Tasks Submenu - Now showing Templates */}
                    {item.key === "tasks" && (
                      <div className="space-y-1">
                        <motion.button
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          onClick={() => setSelectedTemplateId("")}
                          className={`w-full text-left p-3 rounded-lg transition-all duration-200 group theme-transition ${
                            selectedTemplateId === ""
                              ? "bg-sidebar-accent border border-sidebar-border"
                              : "hover:bg-sidebar-accent/50"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Target
                              size={14}
                              className={
                                selectedTemplateId === ""
                                  ? "text-sidebar-primary"
                                  : "text-muted-foreground"
                              }
                            />
                            <span
                              className={`text-sm font-medium ${
                                selectedTemplateId === ""
                                  ? "text-sidebar-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              All Templates
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ml-auto ${
                                selectedTemplateId === ""
                                  ? "bg-sidebar-primary/20 text-sidebar-primary"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {projectTemplatesCount}
                            </span>
                            {selectedTemplateId === "" && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-blue-500 rounded-full w-2 h-2 nav-active-indicator"
                              />
                            )}
                          </div>
                        </motion.button>

                        {currentTemplates.map((template, templateIndex) => {
                          const templateTaskCount = getTasksByTemplate(
                            template.id
                          ).length;
                          return (
                            <motion.button
                              key={template.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: (templateIndex + 1) * 0.1 }}
                              onClick={() => setSelectedTemplateId(template.id)}
                              className={`w-full text-left p-3 rounded-lg transition-all duration-200 group theme-transition ${
                                selectedTemplateId === template.id
                                  ? "bg-sidebar-accent border border-sidebar-border"
                                  : "hover:bg-sidebar-accent/50"
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div
                                  className="flex-shrink-0 rounded-full w-3 h-3"
                                  style={{ backgroundColor: template.color }}
                                />
                                <div className="flex-1 min-w-0">
                                  <span
                                    className={`text-sm font-medium block truncate ${
                                      selectedTemplateId === template.id
                                        ? "text-sidebar-foreground"
                                        : "text-muted-foreground"
                                    }`}
                                  >
                                    {template.name}
                                  </span>
                                  {template.description && (
                                    <span className="block text-muted-foreground text-xs truncate">
                                      {template.description}
                                    </span>
                                  )}
                                </div>
                                <div className="flex flex-shrink-0 items-center space-x-2">
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      selectedTemplateId === template.id
                                        ? "bg-sidebar-primary/20 text-sidebar-primary"
                                        : "bg-muted text-muted-foreground"
                                    }`}
                                  >
                                    {templateTaskCount}
                                  </span>
                                  {selectedTemplateId === template.id && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="bg-sidebar-primary rounded-full w-2 h-2 nav-active-indicator"
                                    />
                                  )}
                                </div>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    )}

                    {/* Reminders Submenu */}
                    {item.key === "reminders" && (
                      <div className="space-y-2">
                        {reminders.map((reminder, reminderIndex) => (
                          <motion.div
                            key={reminder.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: reminderIndex * 0.1 }}
                            className="group flex items-center hover:bg-sidebar-accent/50 p-3 rounded-lg theme-transition transition-colors cursor-pointer"
                          >
                            <div
                              className={`p-2 rounded-lg ${
                                reminder.type === "meeting"
                                  ? "bg-blue-100"
                                  : reminder.type === "deadline"
                                  ? "bg-red-100"
                                  : "bg-green-100"
                              }`}
                            >
                              <Calendar
                                size={14}
                                className={
                                  reminder.type === "meeting"
                                    ? "text-blue-600"
                                    : reminder.type === "deadline"
                                    ? "text-red-600"
                                    : "text-green-600"
                                }
                              />
                            </div>
                            <div className="flex-1 ml-3">
                              <p className="font-medium text-sidebar-foreground text-sm">
                                {reminder.title}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                {reminder.time}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Messages Submenu */}
                    {item.key === "messengers" && (
                      <div className="space-y-2">
                        {messages.map((message, messageIndex) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: messageIndex * 0.1 }}
                            className="group flex items-start hover:bg-sidebar-accent/50 p-3 rounded-lg theme-transition transition-colors cursor-pointer"
                          >
                            <div className="flex justify-center items-center bg-gradient-to-br from-purple-400 to-pink-500 rounded-full w-8 h-8 font-medium text-white text-xs">
                              {message.from
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div className="flex-1 ml-3">
                              <div className="flex items-center space-x-2">
                                <p className="font-medium text-sidebar-foreground text-sm">
                                  {message.from}
                                </p>
                                {message.unread && (
                                  <div className="bg-sidebar-primary rounded-full w-2 h-2" />
                                )}
                              </div>
                              <p className="text-muted-foreground text-xs truncate">
                                {message.message}
                              </p>
                              <p className="mt-1 text-muted-foreground text-xs">
                                {message.time}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Theme Toggle */}
      <div className="px-6 py-6 border-sidebar-border border-t">
        <ThemeToggle />
      </div>
    </div>
  );
}
