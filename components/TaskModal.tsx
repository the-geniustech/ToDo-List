"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Plus,
  Minus,
  Search,
  Users,
  Paperclip,
  Tag,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useTaskContext, Task } from "./TaskContext";
import { useTeamContext } from "./TeamContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { DatePicker } from "./DatePicker";
import { AttachmentManager, Attachment } from "./AttachmentManager";
import { EnhancedAvatar } from "./EnhancedAvatar";
import { getProgressBarColor } from "./task-utils";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
  templateId?: string;
  projectId?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  task,
  templateId,
  projectId,
}) => {
  const { addTask, updateTask, templates, currentProjectId } = useTaskContext();
  const { teamMembers, searchTeamMembers, getTeamMemberById } =
    useTeamContext();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    totalSteps: 10,
    completedSteps: 0,
    dueDate: undefined as Date | undefined,
    category: "",
    priority: "medium" as "low" | "medium" | "high",
    teamMembers: [] as string[],
  });

  // Attachment state
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  // UI state
  const [teamSearchQuery, setTeamSearchQuery] = useState("");
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        totalSteps: task.totalSteps,
        completedSteps: task.completedSteps,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        category: task.category,
        priority: task.priority,
        teamMembers: task.teamMembers,
      });
      // Initialize attachments (in a real app, you'd load these from storage)
      setAttachments([]);
    } else {
      // Reset for new task
      setFormData({
        title: "",
        description: "",
        totalSteps: 10,
        completedSteps: 0,
        dueDate: undefined,
        category: "",
        priority: "medium",
        teamMembers: [],
      });
      setAttachments([]);
    }
    setErrors({});
    setTeamSearchQuery("");
  }, [task, isOpen]);

  // Filtered team members based on search
  const filteredTeamMembers = teamSearchQuery
    ? searchTeamMembers(teamSearchQuery)
    : teamMembers.slice(0, 8); // Show first 8 if no search

  // Calculate progress percentage
  const progress =
    formData.totalSteps > 0
      ? Math.round((formData.completedSteps / formData.totalSteps) * 100)
      : 0;

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    if (formData.completedSteps > formData.totalSteps) {
      newErrors.completedSteps = "Completed steps cannot exceed total steps";
    }

    if (formData.totalSteps < 1) {
      newErrors.totalSteps = "Total steps must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) return;

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      templateId: task?.templateId || templateId || "",
      projectId: task?.projectId || projectId || currentProjectId,
      totalSteps: formData.totalSteps,
      completedSteps: formData.completedSteps,
      progress,
      dueDate: formData.dueDate
        ? formData.dueDate.toISOString()
        : new Date().toISOString(),
      createdAt: task?.createdAt || new Date().toISOString(),
      category: formData.category.trim() || "General",
      priority: formData.priority,
      teamMembers: formData.teamMembers,
      attachments: attachments.length,
      comments: task?.comments || 0,
      color: "blue" as const,
      status: undefined,
    };

    if (task) {
      updateTask(task.id, taskData);
    } else {
      addTask(taskData);
    }

    onClose();
  };

  // Handle team member selection
  const toggleTeamMember = (memberId: string) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.includes(memberId)
        ? prev.teamMembers.filter((id) => id !== memberId)
        : [...prev.teamMembers, memberId],
    }));
  };

  // Get current template info
  const currentTemplate = templates.find(
    (t) => t.id === (task?.templateId || templateId)
  );

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
          className="z-50 relative flex flex-col bg-card shadow-2xl border-border rounded-xl w-full max-w-4xl max-h-[90vh] text-card-foreground theme-transition"
        >
          {/* Fixed Header */}
          <div className="flex flex-shrink-0 justify-between items-center bg-muted p-6 border-b border-border rounded-t-xl theme-transition">
            <div className="flex items-center space-x-3">
              <div
                className="rounded-full w-4 h-4"
                style={{ backgroundColor: currentTemplate?.color || "#3B82F6" }}
              />
              <div>
                <h2 className="font-semibold text-foreground text-xl">
                  {task ? "Edit Task" : "Create New Task"}
                </h2>
                {currentTemplate && (
                  <p className="text-muted-foreground text-sm">
                    in {currentTemplate.name}
                  </p>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-6 p-6">
              {/* Basic Information */}
              <div className="gap-6 grid grid-cols-1 lg:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Task Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter task title..."
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className={
                        errors.title
                          ? "border-destructive focus:border-destructive"
                          : ""
                      }
                    />
                    {errors.title && (
                      <p className="flex items-center gap-1 text-destructive text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the task details..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  {/* Due Date and Priority */}
                  <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Due Date *</Label>
                      <DatePicker
                        date={formData.dueDate}
                        onDateChange={(date) =>
                          setFormData((prev) => ({ ...prev, dueDate: date }))
                        }
                        placeholder="Select due date..."
                        error={!!errors.dueDate}
                        className="z-[60]"
                      />
                      {errors.dueDate && (
                        <p className="text-destructive text-sm">
                          {errors.dueDate}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value: "low" | "medium" | "high") =>
                          setFormData((prev) => ({ ...prev, priority: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">
                            <div className="flex items-center gap-2">
                              <div className="bg-green-500 rounded-full w-2 h-2" />
                              Low Priority
                            </div>
                          </SelectItem>
                          <SelectItem value="medium">
                            <div className="flex items-center gap-2">
                              <div className="bg-yellow-500 rounded-full w-2 h-2" />
                              Medium Priority
                            </div>
                          </SelectItem>
                          <SelectItem value="high">
                            <div className="flex items-center gap-2">
                              <div className="bg-red-500 rounded-full w-2 h-2" />
                              High Priority
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <div className="relative">
                      <Tag className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2 transform" />
                      <Input
                        id="category"
                        placeholder="e.g., Design, Development, Marketing..."
                        value={formData.category}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            category: e.target.value,
                          }))
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Progress Section */}
                  <div className="space-y-4 bg-muted p-4 border border-border rounded-lg theme-transition">
                    <Label className="flex items-center gap-2 font-medium text-foreground text-base">
                      <Clock className="w-4 h-4" />
                      Progress Tracking
                    </Label>

                    <div className="gap-4 grid grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="totalSteps">Total Steps *</Label>
                        <div className="flex items-center space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                totalSteps: Math.max(1, prev.totalSteps - 1),
                                completedSteps: Math.min(
                                  prev.completedSteps,
                                  Math.max(1, prev.totalSteps - 1)
                                ),
                              }))
                            }
                            disabled={formData.totalSteps <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <Input
                            id="totalSteps"
                            type="number"
                            min="1"
                            value={formData.totalSteps}
                            onChange={(e) => {
                              const value = Math.max(
                                1,
                                parseInt(e.target.value) || 1
                              );
                              setFormData((prev) => ({
                                ...prev,
                                totalSteps: value,
                                completedSteps: Math.min(
                                  prev.completedSteps,
                                  value
                                ),
                              }));
                            }}
                            className={`text-center ${
                              errors.totalSteps ? "border-destructive" : ""
                            }`}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                totalSteps: prev.totalSteps + 1,
                              }))
                            }
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        {errors.totalSteps && (
                          <p className="text-destructive text-sm">
                            {errors.totalSteps}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="completedSteps">Completed Steps</Label>
                        <div className="flex items-center space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                completedSteps: Math.max(
                                  0,
                                  prev.completedSteps - 1
                                ),
                              }))
                            }
                            disabled={formData.completedSteps <= 0}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <Input
                            id="completedSteps"
                            type="number"
                            min="0"
                            max={formData.totalSteps}
                            value={formData.completedSteps}
                            onChange={(e) => {
                              const value = Math.min(
                                formData.totalSteps,
                                Math.max(0, parseInt(e.target.value) || 0)
                              );
                              setFormData((prev) => ({
                                ...prev,
                                completedSteps: value,
                              }));
                            }}
                            className={`text-center ${
                              errors.completedSteps ? "border-destructive" : ""
                            }`}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                completedSteps: Math.min(
                                  prev.totalSteps,
                                  prev.completedSteps + 1
                                ),
                              }))
                            }
                            disabled={
                              formData.completedSteps >= formData.totalSteps
                            }
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        {errors.completedSteps && (
                          <p className="text-destructive text-sm">
                            {errors.completedSteps}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span
                          className="font-medium"
                          style={{ color: getProgressBarColor(progress) }}
                        >
                          {progress}%
                        </span>
                      </div>
                      <div className="bg-muted rounded-full w-full h-3">
                        <div
                          className="rounded-full h-3 transition-all duration-300"
                          style={{
                            width: `${progress}%`,
                            backgroundColor: getProgressBarColor(progress),
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Team Members */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Team Members
                    </Label>

                    {/* Selected Members */}
                    {formData.teamMembers.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.teamMembers.map((memberId) => {
                          const member = getTeamMemberById(memberId);
                          if (!member) return null;

                          return (
                            <Badge
                              key={memberId}
                              variant="secondary"
                              className="flex items-center gap-2 px-3 py-2"
                            >
                              <EnhancedAvatar
                                id={member.id}
                                name={member.name}
                                size="xs"
                              />
                              <span className="text-sm">{member.name}</span>
                              <button
                                onClick={() => toggleTeamMember(memberId)}
                                className="ml-1 text-muted-foreground hover:text-destructive"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          );
                        })}
                      </div>
                    )}

                    {/* Team Search */}
                    <div className="relative">
                      <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2 transform" />
                      <Input
                        placeholder="Search team members..."
                        value={teamSearchQuery}
                        onChange={(e) => setTeamSearchQuery(e.target.value)}
                        onFocus={() => setShowTeamDropdown(true)}
                        className="pl-10"
                      />

                      {/* Team Dropdown */}
                      {showTeamDropdown && (
                        <div className="top-full right-0 left-0 z-10 absolute bg-card shadow-lg mt-1 border border-border rounded-lg max-h-48 overflow-y-auto">
                          {filteredTeamMembers.length > 0 ? (
                            filteredTeamMembers.map((member) => (
                              <button
                                key={member.id}
                                onClick={() => {
                                  toggleTeamMember(member.id);
                                  setTeamSearchQuery("");
                                  setShowTeamDropdown(false);
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-muted transition-colors ${
                                  formData.teamMembers.includes(member.id)
                                    ? "bg-accent"
                                    : ""
                                }`}
                              >
                                <EnhancedAvatar
                                  id={member.id}
                                  name={member.name}
                                  size="sm"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-foreground text-sm truncate">
                                    {member.name}
                                  </p>
                                  <p className="text-muted-foreground text-xs truncate">
                                    {member.role}
                                  </p>
                                </div>
                                {formData.teamMembers.includes(member.id) && (
                                  <div className="bg-primary rounded-full w-2 h-2" />
                                )}
                              </button>
                            ))
                          ) : (
                            <div className="px-3 py-3 text-muted-foreground text-sm">
                              No team members found
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Close dropdown when clicking outside */}
                    {showTeamDropdown && (
                      <div
                        className="z-0 fixed inset-0"
                        onClick={() => setShowTeamDropdown(false)}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Attachments */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 font-medium text-base">
                  <Paperclip className="w-4 h-4" />
                  Attachments
                </Label>
                <AttachmentManager
                  attachments={attachments}
                  onAttachmentsChange={setAttachments}
                  maxFiles={5}
                  maxFileSize={10}
                />
              </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="flex flex-shrink-0 justify-end items-center gap-3 bg-muted p-6 border-t border-border rounded-b-xl theme-transition">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {task ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
