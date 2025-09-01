'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Folder, Palette, AlertCircle } from 'lucide-react';
import { useTaskContext } from './TaskContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose
}) => {
  const { addProject } = useTaskContext();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        description: '',
        color: '#3B82F6'
      });
      setErrors({});
    }
  }, [isOpen]);

  // Color options for projects
  const colorOptions = [
    { value: '#EF4444', name: 'Red', bg: 'bg-red-500' },
    { value: '#F59E0B', name: 'Orange', bg: 'bg-orange-500' },
    { value: '#EAB308', name: 'Yellow', bg: 'bg-yellow-500' },
    { value: '#10B981', name: 'Green', bg: 'bg-green-500' },
    { value: '#3B82F6', name: 'Blue', bg: 'bg-blue-500' },
    { value: '#8B5CF6', name: 'Purple', bg: 'bg-purple-500' },
    { value: '#EC4899', name: 'Pink', bg: 'bg-pink-500' },
    { value: '#6B7280', name: 'Gray', bg: 'bg-gray-500' }
  ];

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Project name must be at least 3 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) return;

    addProject({
      name: formData.name.trim(),
      description: formData.description.trim(),
      color: formData.color,
      isActive: true
    });

    onClose();
  };

  // Handle Enter key submission
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
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
          className="relative w-full max-w-md bg-card text-card-foreground rounded-xl shadow-2xl border-border z-50 theme-transition"
          onKeyDown={handleKeyDown}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border bg-muted rounded-t-xl theme-transition">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg theme-transition">
                <Folder className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Create New Project
                </h2>
                <p className="text-sm text-muted-foreground">
                  Add a new project to organize your tasks
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name *</Label>
              <Input
                id="projectName"
                placeholder="e.g., Mobile Banking App, E-commerce Platform..."
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={errors.name ? 'border-destructive focus:border-destructive' : ''}
                autoFocus
              />
              {errors.name && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="projectDescription">Description</Label>
              <Textarea
                id="projectDescription"
                placeholder="Brief description of the project goals and scope..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Color Selection */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Project Color
              </Label>
              <div className="grid grid-cols-4 gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                    className={`relative p-3 rounded-lg border-2 transition-all hover:scale-105 theme-transition ${
                      formData.color === color.value 
                        ? 'border-foreground shadow-lg' 
                        : 'border-border hover:border-muted-foreground'
                    }`}
                    title={color.name}
                  >
                    <div 
                      className={`w-full h-8 rounded-md ${color.bg}`}
                    />
                    {formData.color === color.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-foreground text-background rounded-full flex items-center justify-center text-xs"
                      >
                        ✓
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="p-4 bg-muted rounded-lg border border-border theme-transition">
              <p className="text-sm text-muted-foreground mb-2">Preview:</p>
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: formData.color }}
                />
                <div>
                  <p className="font-medium text-foreground">
                    {formData.name || 'Project Name'}
                  </p>
                  {formData.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {formData.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted rounded-b-xl theme-transition">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!formData.name.trim()}
            >
              Create Project
            </Button>
          </div>

          {/* Keyboard shortcut hint */}
          <div className="absolute bottom-2 left-6 text-xs text-muted-foreground">
            Press Cmd+Enter to create
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};