'use client';

import React from 'react';
import { GripVertical } from 'lucide-react';

interface DragHandleProps {
  isDragging?: boolean;
  className?: string;
}

export const DragHandle: React.FC<DragHandleProps> = ({ 
  isDragging = false, 
  className = '' 
}) => {
  return (
    <div 
      className={`
        mt-1 p-1 rounded theme-transition drag-handle
        ${isDragging 
          ? 'bg-primary/10 cursor-grabbing' 
          : 'hover:bg-accent cursor-grab'
        }
        ${className}
      `}
      title="Drag to move task"
      style={{
        touchAction: 'none'
      }}
    >
      <GripVertical 
        className={`w-4 h-4 theme-transition ${
          isDragging ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
        }`} 
      />
    </div>
  );
};