'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Task {
  id: string;
  title: string;
  description: string;
  templateId: string; // Which template this task belongs to
  projectId: string;  // Which project this task belongs to
  progress: number;
  totalSteps: number;
  completedSteps: number;
  createdAt: string;
  dueDate: string;
  comments: number;
  attachments: number;
  teamMembers: string[];
  category: string;
  priority: 'low' | 'medium' | 'high';
  color: 'red' | 'orange' | 'green' | 'blue';
  // Keep status for backward compatibility but derive from templateId
  status?: 'todo' | 'inprogress' | 'done';
}

export interface Template {
  id: string;
  name: string;
  description: string;
  projectId: string;
  color: string;
  order: number;
  wipLimit?: number; // Work in progress limit
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TaskContextType {
  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newTemplateId: string) => void;
  reorderTasksInTemplate: (templateId: string, dragIndex: number, hoverIndex: number) => void;

  // Templates
  templates: Template[];
  addTemplate: (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTemplate: (id: string, updates: Partial<Template>) => void;
  deleteTemplate: (id: string) => void;
  reorderTemplates: (projectId: string, templateIds: string[]) => void;

  // Projects
  projects: Project[];
  currentProjectId: string;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (projectId: string) => void;

  // Helper functions
  getTasksByTemplate: (templateId: string) => Task[];
  getTemplatesByProject: (projectId: string) => Template[];
  getCurrentProject: () => Project | undefined;

  // Backward compatibility
  moveTaskLegacy: (id: string, newStatus: Task['status']) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

// Default projects
const defaultProjects: Project[] = [
  {
    id: 'project-1',
    name: 'Design System Project',
    description: 'Main design system and UI components project',
    color: '#3B82F6',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'project-2',
    name: 'E-commerce Platform',
    description: 'Modern e-commerce platform with advanced features',
    color: '#8B5CF6',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'project-3',
    name: 'Mobile Banking App',
    description: 'Secure and user-friendly mobile banking application',
    color: '#10B981',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const defaultTemplates: Template[] = [
  // Project 1 Templates (Design System)
  {
    id: 'template-todo',
    name: 'To Do',
    description: 'Tasks that need to be started',
    projectId: 'project-1',
    color: '#EF4444',
    order: 0,
    wipLimit: undefined,
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'template-inprogress',
    name: 'In Progress',
    description: 'Tasks currently being worked on',
    projectId: 'project-1',
    color: '#F59E0B',
    order: 1,
    wipLimit: 3,
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'template-done',
    name: 'Done',
    description: 'Completed tasks',
    projectId: 'project-1',
    color: '#10B981',
    order: 2,
    wipLimit: undefined,
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Project 2 Templates (E-commerce Platform)
  {
    id: 'template-backlog-p2',
    name: 'Backlog',
    description: 'Product backlog items',
    projectId: 'project-2',
    color: '#6B7280',
    order: 0,
    wipLimit: undefined,
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'template-development-p2',
    name: 'Development',
    description: 'Features in active development',
    projectId: 'project-2',
    color: '#3B82F6',
    order: 1,
    wipLimit: 5,
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'template-testing-p2',
    name: 'Testing',
    description: 'Features ready for testing',
    projectId: 'project-2',
    color: '#F59E0B',
    order: 2,
    wipLimit: 3,
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'template-deployed-p2',
    name: 'Deployed',
    description: 'Features deployed to production',
    projectId: 'project-2',
    color: '#10B981',
    order: 3,
    wipLimit: undefined,
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Project 3 Templates (Mobile Banking App)
  {
    id: 'template-research-p3',
    name: 'Research',
    description: 'User research and discovery',
    projectId: 'project-3',
    color: '#8B5CF6',
    order: 0,
    wipLimit: undefined,
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'template-design-p3',
    name: 'Design',
    description: 'UI/UX design phase',
    projectId: 'project-3',
    color: '#EC4899',
    order: 1,
    wipLimit: 4,
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'template-review-p3',
    name: 'Review',
    description: 'Stakeholder review and approval',
    projectId: 'project-3',
    color: '#F59E0B',
    order: 2,
    wipLimit: 2,
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'template-approved-p3',
    name: 'Approved',
    description: 'Approved and ready for development',
    projectId: 'project-3',
    color: '#10B981',
    order: 3,
    wipLimit: undefined,
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const initialTasks: Task[] = [
  // Project 1 Tasks (Design System Project)
  {
    id: '1',
    title: 'Design new ui presentation',
    description: 'Dribbble marketing',
    templateId: 'template-todo',
    projectId: 'project-1',
    status: 'todo',
    progress: 70,
    totalSteps: 10,
    completedSteps: 7,
    createdAt: '2024-08-24T09:00:00.000Z',
    dueDate: '2024-09-05T17:00:00.000Z',
    comments: 7,
    attachments: 2,
    teamMembers: ['avatar1', 'avatar2'],
    category: 'Design',
    priority: 'high',
    color: 'orange'
  },
  {
    id: '2',
    title: 'Add more ui/ux mockups',
    description: 'Pinterest promotion',
    templateId: 'template-todo',
    projectId: 'project-1',
    status: 'todo',
    progress: 40,
    totalSteps: 10,
    completedSteps: 4,
    createdAt: '2024-08-25T10:00:00.000Z',
    dueDate: '2024-09-08T16:00:00.000Z',
    comments: 0,
    attachments: 0,
    teamMembers: ['avatar1', 'avatar2'],
    category: 'Design',
    priority: 'medium',
    color: 'orange'
  },
  {
    id: '3',
    title: 'Design few mobile screens',
    description: 'Dropbox mobile app',
    templateId: 'template-todo',
    projectId: 'project-1',
    status: 'todo',
    progress: 30,
    totalSteps: 10,
    completedSteps: 3,
    createdAt: '2024-08-26T11:00:00.000Z',
    dueDate: '2024-09-10T18:00:00.000Z',
    comments: 6,
    attachments: 4,
    teamMembers: ['avatar1'],
    category: 'Design',
    priority: 'low',
    color: 'red'
  },
  {
    id: '4',
    title: 'Create a tweet and promote',
    description: 'Twitter marketing',
    templateId: 'template-todo',
    projectId: 'project-1',
    status: 'todo',
    progress: 14,
    totalSteps: 14,
    completedSteps: 2,
    createdAt: '2024-08-27T08:30:00.000Z',
    dueDate: '2024-09-02T12:00:00.000Z',
    comments: 23,
    attachments: 12,
    teamMembers: ['avatar1', 'avatar2'],
    category: 'Marketing',
    priority: 'medium',
    color: 'red'
  },
  {
    id: '5',
    title: 'Design system update',
    description: 'Oreo website project',
    templateId: 'template-inprogress',
    projectId: 'project-1',
    status: 'inprogress',
    progress: 30,
    totalSteps: 10,
    completedSteps: 3,
    createdAt: '2024-08-12T09:00:00.000Z',
    dueDate: '2024-09-15T17:00:00.000Z',
    comments: 0,
    attachments: 0,
    teamMembers: ['avatar1', 'avatar2'],
    category: 'Design',
    priority: 'high',
    color: 'orange'
  },
  {
    id: '6',
    title: 'Create brand guideline',
    description: 'Oreo branding project',
    templateId: 'template-inprogress',
    projectId: 'project-1',
    status: 'inprogress',
    progress: 70,
    totalSteps: 10,
    completedSteps: 7,
    createdAt: '2024-08-13T10:00:00.000Z',
    dueDate: '2024-09-12T16:00:00.000Z',
    comments: 2,
    attachments: 13,
    teamMembers: ['avatar1', 'avatar2'],
    category: 'Design',
    priority: 'medium',
    color: 'orange'
  },
  {
    id: '7',
    title: 'Create wireframe for ios app',
    description: 'Oreo ios app project',
    templateId: 'template-inprogress',
    projectId: 'project-1',
    status: 'inprogress',
    progress: 40,
    totalSteps: 10,
    completedSteps: 4,
    createdAt: '2024-08-14T14:00:00.000Z',
    dueDate: '2024-09-20T15:00:00.000Z',
    comments: 0,
    attachments: 0,
    teamMembers: ['avatar1', 'avatar2'],
    category: 'Design',
    priority: 'low',
    color: 'red'
  },
  {
    id: '8',
    title: 'Create ui kit for layout',
    description: 'Crypto mobile app',
    templateId: 'template-inprogress',
    projectId: 'project-1',
    status: 'inprogress',
    progress: 30,
    totalSteps: 10,
    completedSteps: 3,
    createdAt: '2024-08-15T13:00:00.000Z',
    dueDate: '2024-09-18T14:00:00.000Z',
    comments: 23,
    attachments: 12,
    teamMembers: ['avatar1'],
    category: 'Design',
    priority: 'high',
    color: 'red'
  },
  {
    id: '9',
    title: 'Add product to the market',
    description: 'Ui8 marketplace',
    templateId: 'template-done',
    projectId: 'project-1',
    status: 'done',
    progress: 100,
    totalSteps: 10,
    completedSteps: 10,
    createdAt: '2024-01-06T10:00:00.000Z',
    dueDate: '2024-01-20T17:00:00.000Z',
    comments: 1,
    attachments: 5,
    teamMembers: ['avatar1', 'avatar2'],
    category: 'Business',
    priority: 'high',
    color: 'green'
  },
  {
    id: '10',
    title: 'Launch product promotion',
    description: 'Kickstarter campaign',
    templateId: 'template-done',
    projectId: 'project-1',
    status: 'done',
    progress: 100,
    totalSteps: 10,
    completedSteps: 10,
    createdAt: '2024-01-07T11:00:00.000Z',
    dueDate: '2024-01-25T16:00:00.000Z',
    comments: 17,
    attachments: 3,
    teamMembers: ['avatar1'],
    category: 'Marketing',
    priority: 'medium',
    color: 'green'
  },
  {
    id: '11',
    title: 'Make twitter banner',
    description: 'Twitter marketing',
    templateId: 'template-done',
    projectId: 'project-1',
    status: 'done',
    progress: 100,
    totalSteps: 10,
    completedSteps: 10,
    createdAt: '2024-01-08T09:30:00.000Z',
    dueDate: '2024-01-22T15:00:00.000Z',
    comments: 0,
    attachments: 0,
    teamMembers: ['avatar1', 'avatar2'],
    category: 'Design',
    priority: 'low',
    color: 'green'
  },

  // Project 2 Tasks (E-commerce Platform)
  {
    id: '12',
    title: 'User authentication system',
    description: 'OAuth and JWT implementation',
    templateId: 'template-backlog-p2',
    projectId: 'project-2',
    progress: 0,
    totalSteps: 12,
    completedSteps: 0,
    createdAt: '2024-08-01T10:00:00.000Z',
    dueDate: '2024-09-15T17:00:00.000Z',
    comments: 3,
    attachments: 1,
    teamMembers: ['avatar4'],
    category: 'Backend',
    priority: 'high',
    color: 'blue'
  },
  {
    id: '13',
    title: 'Product catalog API',
    description: 'RESTful API for product management',
    templateId: 'template-backlog-p2',
    projectId: 'project-2',
    progress: 12,
    totalSteps: 8,
    completedSteps: 1,
    createdAt: '2024-08-02T11:00:00.000Z',
    dueDate: '2024-09-10T16:00:00.000Z',
    comments: 0,
    attachments: 2,
    teamMembers: ['avatar2'],
    category: 'Backend',
    priority: 'high',
    color: 'blue'
  },
  {
    id: '14',
    title: 'Shopping cart functionality',
    description: 'Add to cart and checkout flow',
    templateId: 'template-development-p2',
    projectId: 'project-2',
    progress: 50,
    totalSteps: 10,
    completedSteps: 5,
    createdAt: '2024-08-03T09:00:00.000Z',
    dueDate: '2024-09-05T18:00:00.000Z',
    comments: 8,
    attachments: 3,
    teamMembers: ['avatar2', 'avatar4'],
    category: 'Frontend',
    priority: 'high',
    color: 'orange'
  },
  {
    id: '15',
    title: 'Payment integration',
    description: 'Stripe payment processing',
    templateId: 'template-development-p2',
    projectId: 'project-2',
    progress: 20,
    totalSteps: 15,
    completedSteps: 3,
    createdAt: '2024-08-04T08:30:00.000Z',
    dueDate: '2024-09-20T17:00:00.000Z',
    comments: 12,
    attachments: 5,
    teamMembers: ['avatar4'],
    category: 'Integration',
    priority: 'medium',
    color: 'red'
  },
  {
    id: '16',
    title: 'Order management system',
    description: 'Admin dashboard for orders',
    templateId: 'template-testing-p2',
    projectId: 'project-2',
    progress: 80,
    totalSteps: 10,
    completedSteps: 8,
    createdAt: '2024-08-05T12:00:00.000Z',
    dueDate: '2024-09-08T16:30:00.000Z',
    comments: 4,
    attachments: 1,
    teamMembers: ['avatar5'],
    category: 'Admin',
    priority: 'medium',
    color: 'orange'
  },
  {
    id: '17',
    title: 'Customer reviews system',
    description: 'Product rating and reviews',
    templateId: 'template-deployed-p2',
    projectId: 'project-2',
    progress: 100,
    totalSteps: 10,
    completedSteps: 10,
    createdAt: '2024-08-06T14:00:00.000Z',
    dueDate: '2024-08-25T17:00:00.000Z',
    comments: 15,
    attachments: 4,
    teamMembers: ['avatar2', 'avatar8'],
    category: 'Feature',
    priority: 'low',
    color: 'green'
  },

  // Project 3 Tasks (Mobile Banking App)
  {
    id: '18',
    title: 'User research interviews',
    description: 'Conduct 20 user interviews',
    templateId: 'template-research-p3',
    projectId: 'project-3',
    progress: 30,
    totalSteps: 20,
    completedSteps: 6,
    createdAt: '2024-08-10T09:00:00.000Z',
    dueDate: '2024-09-12T17:00:00.000Z',
    comments: 2,
    attachments: 8,
    teamMembers: ['avatar7'],
    category: 'Research',
    priority: 'high',
    color: 'blue'
  },
  {
    id: '19',
    title: 'Competitor analysis',
    description: 'Analyze 5 leading banking apps',
    templateId: 'template-research-p3',
    projectId: 'project-3',
    progress: 60,
    totalSteps: 5,
    completedSteps: 3,
    createdAt: '2024-08-11T10:30:00.000Z',
    dueDate: '2024-09-01T15:00:00.000Z',
    comments: 0,
    attachments: 12,
    teamMembers: ['avatar7'],
    category: 'Research',
    priority: 'medium',
    color: 'blue'
  },
  {
    id: '20',
    title: 'Login screen design',
    description: 'Biometric and PIN authentication',
    templateId: 'template-design-p3',
    projectId: 'project-3',
    progress: 80,
    totalSteps: 10,
    completedSteps: 8,
    createdAt: '2024-08-12T11:00:00.000Z',
    dueDate: '2024-09-15T16:00:00.000Z',
    comments: 6,
    attachments: 3,
    teamMembers: ['avatar1', 'avatar7'],
    category: 'UI Design',
    priority: 'high',
    color: 'orange'
  },
  {
    id: '21',
    title: 'Dashboard wireframes',
    description: 'Account overview and quick actions',
    templateId: 'template-design-p3',
    projectId: 'project-3',
    progress: 50,
    totalSteps: 8,
    completedSteps: 4,
    createdAt: '2024-08-13T13:30:00.000Z',
    dueDate: '2024-09-18T17:30:00.000Z',
    comments: 3,
    attachments: 2,
    teamMembers: ['avatar1'],
    category: 'UX Design',
    priority: 'high',
    color: 'orange'
  },
  {
    id: '22',
    title: 'Transaction flow design',
    description: 'Money transfer and payment flows',
    templateId: 'template-review-p3',
    projectId: 'project-3',
    progress: 90,
    totalSteps: 10,
    completedSteps: 9,
    createdAt: '2024-08-14T15:00:00.000Z',
    dueDate: '2024-09-10T14:00:00.000Z',
    comments: 8,
    attachments: 5,
    teamMembers: ['avatar1'],
    category: 'UX Design',
    priority: 'medium',
    color: 'orange'
  },
  {
    id: '23',
    title: 'Security features design',
    description: 'Two-factor auth and fraud detection',
    templateId: 'template-approved-p3',
    projectId: 'project-3',
    progress: 100,
    totalSteps: 10,
    completedSteps: 10,
    createdAt: '2024-08-15T16:00:00.000Z',
    dueDate: '2024-08-30T17:00:00.000Z',
    comments: 12,
    attachments: 7,
    teamMembers: ['avatar1', 'avatar7'],
    category: 'Security',
    priority: 'high',
    color: 'green'
  }
];

// Local storage keys
const STORAGE_KEYS = {
  tasks: 'taskboard_tasks',
  templates: 'taskboard_templates',
  projects: 'taskboard_projects',
  currentProjectId: 'taskboard_current_project'
};

// Helper functions for localStorage
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.warn(`Failed to load ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const saveToStorage = <T,>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to save ${key} to localStorage:`, error);
  }
};

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() =>
    loadFromStorage(STORAGE_KEYS.tasks, initialTasks)
  );
  const [templates, setTemplates] = useState<Template[]>(() =>
    loadFromStorage(STORAGE_KEYS.templates, defaultTemplates)
  );
  const [projects, setProjects] = useState<Project[]>(() =>
    loadFromStorage(STORAGE_KEYS.projects, defaultProjects)
  );
  const [currentProjectId, setCurrentProjectId] = useState<string>(() =>
    loadFromStorage(STORAGE_KEYS.currentProjectId, 'project-1')
  );

  // Save to localStorage when state changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.tasks, tasks);
  }, [tasks]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.templates, templates);
  }, [templates]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.projects, projects);
  }, [projects]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.currentProjectId, currentProjectId);
  }, [currentProjectId]);

  // Task functions
  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const moveTask = (taskId: string, newTemplateId: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, templateId: newTemplateId } : task
    ));
  };

  const reorderTasksInTemplate = (templateId: string, dragIndex: number, hoverIndex: number) => {
    setTasks(prev => {
      const templateTasks = prev.filter(task => task.templateId === templateId);
      const otherTasks = prev.filter(task => task.templateId !== templateId);

      // Reorder the tasks within the template
      const dragTask = templateTasks[dragIndex];
      const newTemplateTasksOrder = [...templateTasks];
      newTemplateTasksOrder.splice(dragIndex, 1);
      newTemplateTasksOrder.splice(hoverIndex, 0, dragTask);

      // Combine reordered template tasks with other tasks
      return [...otherTasks, ...newTemplateTasksOrder];
    });
  };

  // Template functions
  const addTemplate = (templateData: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTemplate: Template = {
      ...templateData,
      id: `template-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTemplates(prev => [...prev, newTemplate]);
  };

  const updateTemplate = (id: string, updates: Partial<Template>) => {
    setTemplates(prev => prev.map(template =>
      template.id === id ? { ...template, ...updates, updatedAt: new Date().toISOString() } : template
    ));
  };

  const deleteTemplate = (id: string) => {
    // Also delete all tasks in this template
    setTasks(prev => prev.filter(task => task.templateId !== id));
    setTemplates(prev => prev.filter(template => template.id !== id));
  };

  const reorderTemplates = (projectId: string, templateIds: string[]) => {
    setTemplates(prev => prev.map(template => {
      if (template.projectId === projectId) {
        const newOrder = templateIds.indexOf(template.id);
        return newOrder >= 0 ? { ...template, order: newOrder, updatedAt: new Date().toISOString() } : template;
      }
      return template;
    }));
  };

  // Project functions
  const addProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: `project-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(project =>
      project.id === id ? { ...project, ...updates, updatedAt: new Date().toISOString() } : project
    ));
  };

  const deleteProject = (id: string) => {
    // Delete all templates and tasks for this project
    setTasks(prev => prev.filter(task => task.projectId !== id));
    setTemplates(prev => prev.filter(template => template.projectId !== id));
    setProjects(prev => prev.filter(project => project.id !== id));

    // If current project is deleted, switch to first available
    if (currentProjectId === id) {
      const remainingProjects = projects.filter(p => p.id !== id);
      setCurrentProjectId(remainingProjects[0]?.id || '');
    }
  };

  const setCurrentProject = (projectId: string) => {
    setCurrentProjectId(projectId);
  };

  // Helper functions
  const getTasksByTemplate = (templateId: string) => {
    return tasks.filter(task => task.templateId === templateId);
  };

  const getTemplatesByProject = (projectId: string) => {
    return templates
      .filter(template => template.projectId === projectId && !template.isArchived)
      .sort((a, b) => a.order - b.order);
  };

  const getCurrentProject = () => {
    return projects.find(project => project.id === currentProjectId);
  };

  // Backward compatibility function
  const moveTaskLegacy = (id: string, newStatus: Task['status']) => {
    // Map legacy status to template IDs
    const statusToTemplateMap: Record<NonNullable<Task['status']>, string> = {
      'todo': 'template-todo',
      'inprogress': 'template-inprogress',
      'done': 'template-done'
    };

    const newTemplateId = newStatus ? statusToTemplateMap[newStatus] : undefined;
    if (newTemplateId) {
      moveTask(id, newTemplateId);

      // Also update the status field for backward compatibility
      setTasks(prev => prev.map(task =>
        task.id === id ? { ...task, status: newStatus } : task
      ));
    }
  };

  return (
    <TaskContext.Provider value={{
      // Tasks
      tasks,
      addTask,
      updateTask,
      deleteTask,
      moveTask,
      reorderTasksInTemplate,

      // Templates
      templates,
      addTemplate,
      updateTemplate,
      deleteTemplate,
      reorderTemplates,

      // Projects
      projects,
      currentProjectId,
      addProject,
      updateProject,
      deleteProject,
      setCurrentProject,

      // Helper functions
      getTasksByTemplate,
      getTemplatesByProject,
      getCurrentProject,

      // Backward compatibility
      moveTaskLegacy
    }}>
      {children}
    </TaskContext.Provider>
  );
};