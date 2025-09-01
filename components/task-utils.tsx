// Utility functions for task progress and date badge colors

export const getProgressBarColor = (progress: number): string => {
  // Check if dark mode is active
  const isDarkMode = typeof window !== 'undefined' && 
    (document.documentElement.classList.contains('dark') || 
     document.documentElement.getAttribute('data-theme') === 'dark');
  
  if (progress === 100) {
    return isDarkMode ? 'rgb(74 222 128)' : 'rgb(34 197 94)'; // Green (green-400 : green-500)
  } else if (progress >= 50) {
    return isDarkMode ? 'rgb(251 146 60)' : 'rgb(249 115 22)'; // Orange (orange-400 : orange-500)
  } else {
    return isDarkMode ? 'rgb(248 113 113)' : 'rgb(239 68 68)'; // Red (red-400 : red-500)
  }
};

export const getDateBadgeColor = (progress: number): { bg: string; text: string; border?: string } => {
  if (progress === 100) {
    return {
      bg: 'bg-green-50 dark:bg-green-950/30',
      text: 'text-green-700 dark:text-green-400',
      border: 'border-green-200 dark:border-green-800'
    };
  } else if (progress >= 50) {
    return {
      bg: 'bg-orange-50 dark:bg-orange-950/30',
      text: 'text-orange-700 dark:text-orange-400',
      border: 'border-orange-200 dark:border-orange-800'
    };
  } else {
    return {
      bg: 'bg-red-50 dark:bg-red-950/30',
      text: 'text-red-700 dark:text-red-400',
      border: 'border-red-200 dark:border-red-800'
    };
  }
};

export const getProgressTextColor = (progress: number): string => {
  if (progress === 100) {
    return 'text-green-600 dark:text-green-400';
  } else if (progress >= 50) {
    return 'text-orange-600 dark:text-orange-400';
  } else {
    return 'text-red-600 dark:text-red-400';
  }
};

export const formatDate = (dateString: string, format: 'short' | 'long' = 'short'): string => {
  const date = new Date(dateString);
  
  if (format === 'long') {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatDueDate = (dueDate: string): string => {
  const now = new Date();
  const due = new Date(dueDate);
  const diffInDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays < 0) {
    return `Overdue by ${Math.abs(diffInDays)} day${Math.abs(diffInDays) !== 1 ? 's' : ''}`;
  } else if (diffInDays === 0) {
    return 'Due today';
  } else if (diffInDays === 1) {
    return 'Due tomorrow';
  } else if (diffInDays <= 7) {
    return `Due in ${diffInDays} days`;
  } else {
    return formatDate(dueDate);
  }
};

export const getDueDateUrgency = (dueDate: string): 'overdue' | 'urgent' | 'warning' | 'normal' => {
  const now = new Date();
  const due = new Date(dueDate);
  const diffInDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays < 0) return 'overdue';
  if (diffInDays <= 1) return 'urgent';
  if (diffInDays <= 3) return 'warning';
  return 'normal';
};

export const getDueDateBadgeStyle = (dueDate: string) => {
  const urgency = getDueDateUrgency(dueDate);
  
  switch (urgency) {
    case 'overdue':
      return {
        bg: 'bg-red-100 dark:bg-red-950/30',
        text: 'text-red-800 dark:text-red-400',
        border: 'border-red-200 dark:border-red-800'
      };
    case 'urgent':
      return {
        bg: 'bg-orange-100 dark:bg-orange-950/30',
        text: 'text-orange-800 dark:text-orange-400',
        border: 'border-orange-200 dark:border-orange-800'
      };
    case 'warning':
      return {
        bg: 'bg-yellow-100 dark:bg-yellow-950/30',
        text: 'text-yellow-800 dark:text-yellow-400',
        border: 'border-yellow-200 dark:border-yellow-800'
      };
    default:
      return {
        bg: 'bg-muted',
        text: 'text-muted-foreground',
        border: 'border-border'
      };
  }
};