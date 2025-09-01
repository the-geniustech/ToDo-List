export interface Reminder {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'task' | 'meeting' | 'deadline' | 'review' | 'personal';
  isCompleted: boolean;
  projectId?: string;
  taskId?: string;
  createdBy: string;
  createdAt: string;
  completedAt?: string;
}

export const defaultReminders: Reminder[] = [
  {
    id: 'reminder-1',
    title: 'Team standup meeting',
    description: 'Daily standup with the design team',
    dueDate: '2024-08-31T09:00:00.000Z',
    priority: 'medium',
    type: 'meeting',
    isCompleted: false,
    projectId: 'project-1',
    createdBy: 'avatar1',
    createdAt: '2024-08-30T08:00:00.000Z'
  },
  {
    id: 'reminder-2',
    title: 'Review API documentation',
    description: 'Go through the new API endpoints documentation',
    dueDate: '2024-09-01T14:00:00.000Z',
    priority: 'high',
    type: 'review',
    isCompleted: false,
    projectId: 'project-2',
    taskId: '13',
    createdBy: 'avatar2',
    createdAt: '2024-08-30T10:30:00.000Z'
  },
  {
    id: 'reminder-3',
    title: 'Submit timesheet',
    description: 'Weekly timesheet submission deadline',
    dueDate: '2024-09-02T17:00:00.000Z',
    priority: 'medium',
    type: 'deadline',
    isCompleted: true,
    createdBy: 'avatar1',
    createdAt: '2024-08-26T09:00:00.000Z',
    completedAt: '2024-08-30T16:45:00.000Z'
  },
  {
    id: 'reminder-4',
    title: 'User research session',
    description: 'Conduct user interviews for mobile banking app',
    dueDate: '2024-09-03T11:00:00.000Z',
    priority: 'high',
    type: 'task',
    isCompleted: false,
    projectId: 'project-3',
    taskId: '18',
    createdBy: 'avatar7',
    createdAt: '2024-08-29T15:20:00.000Z'
  },
  {
    id: 'reminder-5',
    title: 'Code review for payment integration',
    description: 'Review pull request for Stripe payment implementation',
    dueDate: '2024-09-01T16:30:00.000Z',
    priority: 'urgent',
    type: 'review',
    isCompleted: false,
    projectId: 'project-2',
    taskId: '15',
    createdBy: 'avatar4',
    createdAt: '2024-08-30T11:15:00.000Z'
  },
  {
    id: 'reminder-6',
    title: 'Prepare quarterly report',
    description: 'Compile project progress for Q3 review',
    dueDate: '2024-09-05T12:00:00.000Z',
    priority: 'medium',
    type: 'deadline',
    isCompleted: false,
    createdBy: 'avatar3',
    createdAt: '2024-08-28T14:00:00.000Z'
  },
  {
    id: 'reminder-7',
    title: 'Design system workshop',
    description: 'Attend company-wide design system training',
    dueDate: '2024-09-04T10:00:00.000Z',
    priority: 'low',
    type: 'meeting',
    isCompleted: false,
    createdBy: 'avatar1',
    createdAt: '2024-08-27T13:30:00.000Z'
  },
  {
    id: 'reminder-8',
    title: 'Update portfolio',
    description: 'Add latest project screenshots to personal portfolio',
    dueDate: '2024-09-06T18:00:00.000Z',
    priority: 'low',
    type: 'personal',
    isCompleted: false,
    createdBy: 'avatar1',
    createdAt: '2024-08-29T17:45:00.000Z'
  }
];