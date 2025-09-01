export interface Message {
  id: string;
  content: string;
  senderId: string;
  recipientId?: string;
  channelId?: string;
  type: 'direct' | 'channel' | 'task_comment' | 'project_update';
  priority: 'low' | 'normal' | 'high';
  isRead: boolean;
  createdAt: string;
  editedAt?: string;
  taskId?: string;
  projectId?: string;
  attachments?: MessageAttachment[];
  reactions?: MessageReaction[];
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'link' | 'file';
  url: string;
  size?: number;
}

export interface MessageReaction {
  emoji: string;
  count: number;
  userIds: string[];
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private' | 'project';
  memberIds: string[];
  projectId?: string;
  createdBy: string;
  createdAt: string;
}

export const defaultChannels: Channel[] = [
  {
    id: 'channel-1',
    name: 'General',
    description: 'General team discussions',
    type: 'public',
    memberIds: ['avatar1', 'avatar2', 'avatar3', 'avatar4', 'avatar5', 'avatar6', 'avatar7', 'avatar8'],
    createdBy: 'avatar3',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'channel-2',
    name: 'Design System Updates',
    description: 'Updates and discussions about the design system project',
    type: 'project',
    memberIds: ['avatar1', 'avatar2', 'avatar6', 'avatar8'],
    projectId: 'project-1',
    createdBy: 'avatar1',
    createdAt: '2024-02-15T10:00:00.000Z'
  },
  {
    id: 'channel-3',
    name: 'E-commerce Dev Team',
    description: 'Development coordination for e-commerce platform',
    type: 'project',
    memberIds: ['avatar2', 'avatar3', 'avatar4', 'avatar5', 'avatar8'],
    projectId: 'project-2',
    createdBy: 'avatar3',
    createdAt: '2024-03-01T09:00:00.000Z'
  },
  {
    id: 'channel-4',
    name: 'Banking App Research',
    description: 'User research and design discussions for mobile banking app',
    type: 'project',
    memberIds: ['avatar1', 'avatar3', 'avatar5', 'avatar7'],
    projectId: 'project-3',
    createdBy: 'avatar7',
    createdAt: '2024-04-10T14:30:00.000Z'
  }
];

export const defaultMessages: Message[] = [
  {
    id: 'message-1',
    content: 'Great work on the new UI components! The design system is really coming together.',
    senderId: 'avatar3',
    channelId: 'channel-2',
    type: 'channel',
    priority: 'normal',
    isRead: true,
    createdAt: '2024-08-30T10:30:00.000Z',
    projectId: 'project-1',
    reactions: [
      { emoji: '👍', count: 3, userIds: ['avatar1', 'avatar2', 'avatar6'] },
      { emoji: '🎉', count: 1, userIds: ['avatar8'] }
    ]
  },
  {
    id: 'message-2',
    content: 'Can we schedule a review session for the payment integration? I have some concerns about the security implementation.',
    senderId: 'avatar4',
    channelId: 'channel-3',
    type: 'channel',
    priority: 'high',
    isRead: false,
    createdAt: '2024-08-30T14:15:00.000Z',
    projectId: 'project-2',
    taskId: '15'
  },
  {
    id: 'message-3',
    content: 'The user research interviews are scheduled for next week. I\'ll share the discussion guide by tomorrow.',
    senderId: 'avatar7',
    channelId: 'channel-4',
    type: 'channel',
    priority: 'normal',
    isRead: true,
    createdAt: '2024-08-30T16:45:00.000Z',
    projectId: 'project-3',
    taskId: '18'
  },
  {
    id: 'message-4',
    content: 'Hey Alex, could you help me with the responsive design for the checkout flow?',
    senderId: 'avatar1',
    recipientId: 'avatar2',
    type: 'direct',
    priority: 'normal',
    isRead: true,
    createdAt: '2024-08-30T11:20:00.000Z',
    projectId: 'project-2'
  },
  {
    id: 'message-5',
    content: 'The CI/CD pipeline is now configured for the new deployment. All tests are passing.',
    senderId: 'avatar6',
    channelId: 'channel-1',
    type: 'channel',
    priority: 'normal',
    isRead: true,
    createdAt: '2024-08-30T09:00:00.000Z',
    reactions: [
      { emoji: '✅', count: 5, userIds: ['avatar2', 'avatar3', 'avatar4', 'avatar5', 'avatar8'] }
    ]
  },
  {
    id: 'message-6',
    content: 'Updated the task progress. We\'re now at 8/10 completed steps for the login screen design.',
    senderId: 'avatar1',
    type: 'task_comment',
    priority: 'normal',
    isRead: false,
    createdAt: '2024-08-30T15:30:00.000Z',
    taskId: '20',
    projectId: 'project-3'
  },
  {
    id: 'message-7',
    content: 'QA testing completed for the order management system. Found 2 minor issues, details in the attached report.',
    senderId: 'avatar5',
    channelId: 'channel-3',
    type: 'channel',
    priority: 'normal',
    isRead: true,
    createdAt: '2024-08-30T17:00:00.000Z',
    projectId: 'project-2',
    taskId: '16',
    attachments: [
      {
        id: 'attachment-1',
        name: 'QA_Report_OrderManagement.pdf',
        type: 'document',
        url: '#',
        size: 245760
      }
    ]
  },
  {
    id: 'message-8',
    content: 'Project milestone reached! 🎉 All major features for the e-commerce platform are now in testing phase.',
    senderId: 'avatar3',
    channelId: 'channel-1',
    type: 'project_update',
    priority: 'normal',
    isRead: false,
    createdAt: '2024-08-30T18:30:00.000Z',
    projectId: 'project-2',
    reactions: [
      { emoji: '🎉', count: 4, userIds: ['avatar2', 'avatar4', 'avatar5', 'avatar8'] },
      { emoji: '👏', count: 2, userIds: ['avatar1', 'avatar7'] }
    ]
  }
];