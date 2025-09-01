'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar: string;
  status: 'active' | 'inactive' | 'away';
  joinDate: string;
  skills: string[];
  projectIds: string[];
}

interface TeamContextType {
  teamMembers: TeamMember[];
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;
  getTeamMemberById: (id: string) => TeamMember | undefined;
  searchTeamMembers: (query: string) => TeamMember[];
  getTeamMembersByProject: (projectId: string) => TeamMember[];
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const useTeamContext = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeamContext must be used within a TeamProvider');
  }
  return context;
};

// Default team members data
const defaultTeamMembers: TeamMember[] = [
  {
    id: 'avatar1',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    role: 'Senior UI/UX Designer',
    department: 'Design',
    avatar: 'SC',
    status: 'active',
    joinDate: '2022-01-15',
    skills: ['Figma', 'Sketch', 'Prototyping', 'User Research'],
    projectIds: ['project-1', 'project-3']
  },
  {
    id: 'avatar2',
    name: 'Alex Johnson',
    email: 'alex.johnson@company.com',
    role: 'Frontend Developer',
    department: 'Engineering',
    avatar: 'AJ',
    status: 'active',
    joinDate: '2021-11-03',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
    projectIds: ['project-1', 'project-2']
  },
  {
    id: 'avatar3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@company.com',
    role: 'Product Manager',
    department: 'Product',
    avatar: 'ER',
    status: 'active',
    joinDate: '2022-03-20',
    skills: ['Product Strategy', 'Agile', 'Analytics', 'User Stories'],
    projectIds: ['project-2', 'project-3']
  },
  {
    id: 'avatar4',
    name: 'Michael Kim',
    email: 'michael.kim@company.com',
    role: 'Backend Developer',
    department: 'Engineering',
    avatar: 'MK',
    status: 'active',
    joinDate: '2021-08-12',
    skills: ['Node.js', 'Python', 'PostgreSQL', 'API Design'],
    projectIds: ['project-1', 'project-2']
  },
  {
    id: 'avatar5',
    name: 'Jessica Brown',
    email: 'jessica.brown@company.com',
    role: 'QA Engineer',
    department: 'Quality Assurance',
    avatar: 'JB',
    status: 'active',
    joinDate: '2022-05-10',
    skills: ['Test Automation', 'Selenium', 'Manual Testing', 'Bug Tracking'],
    projectIds: ['project-2', 'project-3']
  },
  {
    id: 'avatar6',
    name: 'David Wilson',
    email: 'david.wilson@company.com',
    role: 'DevOps Engineer',
    department: 'Infrastructure',
    avatar: 'DW',
    status: 'away',
    joinDate: '2021-06-18',
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
    projectIds: ['project-1']
  },
  {
    id: 'avatar7',
    name: 'Lisa Garcia',
    email: 'lisa.garcia@company.com',
    role: 'UX Researcher',
    department: 'Design',
    avatar: 'LG',
    status: 'active',
    joinDate: '2022-02-08',
    skills: ['User Interviews', 'Usability Testing', 'Data Analysis', 'Persona Development'],
    projectIds: ['project-3']
  },
  {
    id: 'avatar8',
    name: 'Tom Anderson',
    email: 'tom.anderson@company.com',
    role: 'Marketing Specialist',
    department: 'Marketing',
    avatar: 'TA',
    status: 'active',
    joinDate: '2021-12-01',
    skills: ['Content Marketing', 'SEO', 'Social Media', 'Campaign Management'],
    projectIds: ['project-1', 'project-2']
  }
];

// Local storage key
const STORAGE_KEY = 'taskboard_team_members';

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

export const TeamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => 
    loadFromStorage(STORAGE_KEY, defaultTeamMembers)
  );

  // Save to localStorage when state changes
  useEffect(() => {
    saveToStorage(STORAGE_KEY, teamMembers);
  }, [teamMembers]);

  // Team member functions
  const addTeamMember = (memberData: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      ...memberData,
      id: `member-${Date.now()}`,
    };
    setTeamMembers(prev => [...prev, newMember]);
  };

  const updateTeamMember = (id: string, updates: Partial<TeamMember>) => {
    setTeamMembers(prev => prev.map(member => 
      member.id === id ? { ...member, ...updates } : member
    ));
  };

  const deleteTeamMember = (id: string) => {
    setTeamMembers(prev => prev.filter(member => member.id !== id));
  };

  const getTeamMemberById = (id: string) => {
    return teamMembers.find(member => member.id === id);
  };

  const searchTeamMembers = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return teamMembers.filter(member => 
      member.name.toLowerCase().includes(lowercaseQuery) ||
      member.email.toLowerCase().includes(lowercaseQuery) ||
      member.role.toLowerCase().includes(lowercaseQuery) ||
      member.department.toLowerCase().includes(lowercaseQuery) ||
      member.skills.some(skill => skill.toLowerCase().includes(lowercaseQuery))
    );
  };

  const getTeamMembersByProject = (projectId: string) => {
    return teamMembers.filter(member => member.projectIds.includes(projectId));
  };

  return (
    <TeamContext.Provider value={{ 
      teamMembers,
      addTeamMember,
      updateTeamMember,
      deleteTeamMember,
      getTeamMemberById,
      searchTeamMembers,
      getTeamMembersByProject
    }}>
      {children}
    </TeamContext.Provider>
  );
};