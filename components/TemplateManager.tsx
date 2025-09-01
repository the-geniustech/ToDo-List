"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, Settings, GripVertical } from "lucide-react";
import { useTaskContext, Template } from "./TaskContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { toast } from "sonner";

interface TemplateManagerProps {
  projectId: string;
}

export const TemplateManager: React.FC<TemplateManagerProps> = ({
  projectId,
}) => {
  const {
    addTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplatesByProject,
    getTasksByTemplate,
  } = useTaskContext();

  const [isCreating, setIsCreating] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
    wipLimit: undefined as number | undefined,
  });

  const projectTemplates = getTemplatesByProject(projectId);

  const handleCreateTemplate = () => {
    if (!newTemplate.name.trim()) {
      toast.error("Template name is required");
      return;
    }

    const maxOrder = Math.max(...projectTemplates.map((t) => t.order), -1);

    addTemplate({
      name: newTemplate.name,
      description: newTemplate.description,
      projectId,
      color: newTemplate.color,
      order: maxOrder + 1,
      wipLimit: newTemplate.wipLimit,
      isArchived: false,
    });

    setNewTemplate({
      name: "",
      description: "",
      color: "#3B82F6",
      wipLimit: undefined,
    });
    setIsCreating(false);
    toast.success("Template created successfully");
  };

  const handleUpdateTemplate = () => {
    if (!editingTemplate || !editingTemplate.name.trim()) {
      toast.error("Template name is required");
      return;
    }

    updateTemplate(editingTemplate.id, {
      name: editingTemplate.name,
      description: editingTemplate.description,
      color: editingTemplate.color,
      wipLimit: editingTemplate.wipLimit,
    });

    setEditingTemplate(null);
    toast.success("Template updated successfully");
  };

  const handleDeleteTemplate = (template: Template) => {
    const taskCount = getTasksByTemplate(template.id).length;

    if (taskCount > 0) {
      if (
        !confirm(
          `This template contains ${taskCount} task(s). Are you sure you want to delete it? All tasks will be permanently removed.`
        )
      ) {
        return;
      }
    }

    deleteTemplate(template.id);
    toast.success("Template deleted successfully");
  };

  const getColorPreview = (color: string) => (
    <div
      className="border border-gray-300 rounded-full w-4 h-4"
      style={{ backgroundColor: color }}
    />
  );

  const predefinedColors = [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#F97316",
    "#06B6D4",
    "#84CC16",
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-lg">Templates</h3>
          <p className="text-muted-foreground text-sm">
            Manage your workflow templates
          </p>
        </div>

        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 w-4 h-4" />
              Add Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  placeholder="e.g., In Review, Testing"
                  value={newTemplate.name}
                  onChange={(e) =>
                    setNewTemplate((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="template-description">Description</Label>
                <Textarea
                  id="template-description"
                  placeholder="Describe the purpose of this template..."
                  value={newTemplate.description}
                  onChange={(e) =>
                    setNewTemplate((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <Label>Color</Label>
                <div className="flex items-center space-x-2 mt-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 ${
                        newTemplate.color === color
                          ? "border-gray-900"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() =>
                        setNewTemplate((prev) => ({ ...prev, color }))
                      }
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="wip-limit">WIP Limit (Optional)</Label>
                <Input
                  id="wip-limit"
                  type="number"
                  placeholder="Maximum tasks in this template"
                  value={newTemplate.wipLimit || ""}
                  onChange={(e) =>
                    setNewTemplate((prev) => ({
                      ...prev,
                      wipLimit: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    }))
                  }
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTemplate}>Create Template</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="gap-4 grid">
        {projectTemplates.map((template) => {
          const taskCount = getTasksByTemplate(template.id).length;
          const isOverLimit =
            template.wipLimit && taskCount > template.wipLimit;

          return (
            <Card key={template.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                    {getColorPreview(template.color)}
                    <div>
                      <CardTitle className="text-base">
                        {template.name}
                      </CardTitle>
                      {template.description && (
                        <CardDescription className="text-sm">
                          {template.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge variant={isOverLimit ? "destructive" : "secondary"}>
                      {taskCount} task{taskCount !== 1 ? "s" : ""}
                      {template.wipLimit && ` / ${template.wipLimit}`}
                    </Badge>

                    <Dialog
                      open={editingTemplate?.id === template.id}
                      onOpenChange={(open) =>
                        open
                          ? setEditingTemplate(template)
                          : setEditingTemplate(null)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Template</DialogTitle>
                        </DialogHeader>
                        {editingTemplate && (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="edit-template-name">
                                Template Name
                              </Label>
                              <Input
                                id="edit-template-name"
                                value={editingTemplate.name}
                                onChange={(e) =>
                                  setEditingTemplate((prev) =>
                                    prev
                                      ? { ...prev, name: e.target.value }
                                      : null
                                  )
                                }
                              />
                            </div>

                            <div>
                              <Label htmlFor="edit-template-description">
                                Description
                              </Label>
                              <Textarea
                                id="edit-template-description"
                                value={editingTemplate.description}
                                onChange={(e) =>
                                  setEditingTemplate((prev) =>
                                    prev
                                      ? { ...prev, description: e.target.value }
                                      : null
                                  )
                                }
                              />
                            </div>

                            <div>
                              <Label>Color</Label>
                              <div className="flex items-center space-x-2 mt-2">
                                {predefinedColors.map((color) => (
                                  <button
                                    key={color}
                                    className={`w-8 h-8 rounded-full border-2 ${
                                      editingTemplate.color === color
                                        ? "border-gray-900"
                                        : "border-gray-300"
                                    }`}
                                    style={{ backgroundColor: color }}
                                    onClick={() =>
                                      setEditingTemplate((prev) =>
                                        prev ? { ...prev, color } : null
                                      )
                                    }
                                  />
                                ))}
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="edit-wip-limit">WIP Limit</Label>
                              <Input
                                id="edit-wip-limit"
                                type="number"
                                value={editingTemplate.wipLimit || ""}
                                onChange={(e) =>
                                  setEditingTemplate((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          wipLimit: e.target.value
                                            ? parseInt(e.target.value)
                                            : undefined,
                                        }
                                      : null
                                  )
                                }
                              />
                            </div>

                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                onClick={() => setEditingTemplate(null)}
                              >
                                Cancel
                              </Button>
                              <Button onClick={handleUpdateTemplate}>
                                Update Template
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTemplate(template)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {isOverLimit && (
                  <div className="bg-destructive/10 mt-2 p-2 border border-destructive/20 rounded text-destructive text-sm">
                    ⚠️ This template has exceeded its WIP limit of{" "}
                    {template.wipLimit}
                  </div>
                )}
              </CardHeader>
            </Card>
          );
        })}

        {projectTemplates.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col justify-center items-center py-8">
              <Settings className="mb-4 w-8 h-8 text-muted-foreground" />
              <p className="text-muted-foreground text-center">
                No templates found. Create your first template to get started.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
