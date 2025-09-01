'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Layers, Palette, AlertCircle, Hash, Type, FileText } from 'lucide-react';
import { useTaskContext } from './TaskContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose
}) => {
  const { addTemplate, currentProjectId, getTemplatesByProject, getCurrentProject } = useTaskContext();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    wipLimit: undefined as number | undefined
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showWipLimit, setShowWipLimit] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        description: '',
        color: '#3B82F6',
        wipLimit: undefined
      });
      setErrors({});
      setShowWipLimit(false);
    }
  }, [isOpen]);

  // Color options for templates
  const colorOptions = [
    { value: '#EF4444', name: 'Red', bg: 'bg-red-500', text: 'text-red-700' },
    { value: '#F59E0B', name: 'Orange', bg: 'bg-orange-500', text: 'text-orange-700' },
    { value: '#EAB308', name: 'Yellow', bg: 'bg-yellow-500', text: 'text-yellow-700' },
    { value: '#10B981', name: 'Green', bg: 'bg-green-500', text: 'text-green-700' },
    { value: '#3B82F6', name: 'Blue', bg: 'bg-blue-500', text: 'text-blue-700' },
    { value: '#8B5CF6', name: 'Purple', bg: 'bg-purple-500', text: 'text-purple-700' },
    { value: '#EC4899', name: 'Pink', bg: 'bg-pink-500', text: 'text-pink-700' },
    { value: '#6B7280', name: 'Gray', bg: 'bg-gray-500', text: 'text-gray-700' }
  ];

  // Template suggestions based on common workflows
  const templateSuggestions = [
    { name: 'To Do', description: 'Tasks that need to be started', color: '#6B7280' },
    { name: 'In Progress', description: 'Tasks currently being worked on', color: '#F59E0B', wipLimit: 3 },
    { name: 'Review', description: 'Tasks ready for review', color: '#8B5CF6', wipLimit: 2 },
    { name: 'Done', description: 'Completed tasks', color: '#10B981' },
    { name: 'Backlog', description: 'Future tasks and ideas', color: '#6B7280' },
    { name: 'Testing', description: 'Tasks in testing phase', color: '#EC4899', wipLimit: 2 },
    { name: 'Blocked', description: 'Tasks waiting for dependencies', color: '#EF4444' },
    { name: 'Deployed', description: 'Features deployed to production', color: '#10B981' }
  ];

  // Get current project info
  const currentProject = getCurrentProject();
  const existingTemplates = getTemplatesByProject(currentProjectId);

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Template name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Template name must be at least 2 characters';
    } else if (existingTemplates.some(t => t.name.toLowerCase() === formData.name.trim().toLowerCase())) {
      newErrors.name = 'Template name already exists in this project';
    }

    if (formData.wipLimit !== undefined && (formData.wipLimit < 1 || formData.wipLimit > 20)) {
      newErrors.wipLimit = 'WIP limit must be between 1 and 20';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) return;

    const nextOrder = Math.max(...existingTemplates.map(t => t.order), -1) + 1;

    addTemplate({
      name: formData.name.trim(),
      description: formData.description.trim(),
      projectId: currentProjectId,
      color: formData.color,
      order: nextOrder,
      wipLimit: showWipLimit ? formData.wipLimit : undefined,
      isArchived: false
    });

    onClose();
  };

  // Handle suggestion selection
  const selectSuggestion = (suggestion: typeof templateSuggestions[0]) => {
    setFormData({
      name: suggestion.name,
      description: suggestion.description,
      color: suggestion.color,
      wipLimit: suggestion.wipLimit
    });
    setShowWipLimit(!!suggestion.wipLimit);
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
          className="relative w-full max-w-2xl max-h-[90vh] bg-card text-card-foreground rounded-xl shadow-2xl border-border z-50 flex flex-col theme-transition"
          onKeyDown={handleKeyDown}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border bg-muted rounded-t-xl flex-shrink-0 theme-transition">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg theme-transition">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Create New Template
                </h2>
                <p className="text-sm text-muted-foreground">
                  Add a new template to {currentProject?.name || 'your project'}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Quick Suggestions */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-foreground">
                Quick Start Templates
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {templateSuggestions
                  .filter(suggestion => !existingTemplates.some(t => t.name.toLowerCase() === suggestion.name.toLowerCase()))
                  .slice(0, 8)
                  .map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => selectSuggestion(suggestion)}
                      className="p-3 text-left rounded-lg border border-border hover:border-muted-foreground hover:bg-muted transition-all group theme-transition"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: suggestion.color }}
                        />
                        <span className="text-sm font-medium text-foreground truncate">
                          {suggestion.name}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {suggestion.description}
                      </p>
                    </button>
                  ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-6">
                {/* Template Name */}
                <div className="space-y-2">
                  <Label htmlFor="templateName" className="flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    Template Name *
                  </Label>
                  <Input
                    id="templateName"
                    placeholder="e.g., In Progress, Review, Testing..."
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
                  <Label htmlFor="templateDescription" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Description
                  </Label>
                  <Textarea
                    id="templateDescription"
                    placeholder="Brief description of what this template represents..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="resize-none"
                  />
                </div>

                {/* WIP Limit */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      Work In Progress (WIP) Limit
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowWipLimit(!showWipLimit)}
                    >
                      {showWipLimit ? 'Remove' : 'Add'} Limit
                    </Button>
                  </div>
                  
                  {showWipLimit && (
                    <div className="space-y-2">
                      <Input
                        type="number"
                        placeholder="e.g., 3"
                        value={formData.wipLimit || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          wipLimit: e.target.value ? parseInt(e.target.value) : undefined 
                        }))}
                        className={errors.wipLimit ? 'border-destructive focus:border-destructive' : ''}
                        min="1"
                        max="20"
                      />
                      {errors.wipLimit && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.wipLimit}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Limits the number of tasks that can be in this template at once
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Visual Settings */}
              <div className="space-y-6">
                {/* Color Selection */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Template Color
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
                <div className="space-y-3">
                  <Label>Preview</Label>
                  <div className="p-4 bg-muted rounded-lg border border-border theme-transition">
                    <div className="bg-card rounded-lg border border-border shadow-sm p-4 theme-transition">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: formData.color }}
                          />
                          <h4 className="font-medium text-foreground">
                            {formData.name || 'Template Name'}
                          </h4>
                          <Badge variant="secondary" className="text-xs">
                            0 tasks
                          </Badge>
                        </div>
                        {showWipLimit && formData.wipLimit && (
                          <Badge variant="outline" className="text-xs">
                            Max {formData.wipLimit}
                          </Badge>
                        )}
                      </div>
                      {formData.description && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {formData.description}
                        </p>
                      )}
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <p className="text-sm text-muted-foreground">
                          Tasks will appear here
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Existing Templates */}
                {existingTemplates.length > 0 && (
                  <div className="space-y-3">
                    <Label>Existing Templates</Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {existingTemplates.map((template) => (
                        <div key={template.id} className="flex items-center space-x-2 text-sm">
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: template.color }}
                          />
                          <span className="text-foreground font-medium flex-1 truncate">
                            {template.name}
                          </span>
                          {template.wipLimit && (
                            <Badge variant="outline" className="text-xs">
                              Max {template.wipLimit}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted rounded-b-xl flex-shrink-0 theme-transition">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!formData.name.trim()}
            >
              Create Template
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