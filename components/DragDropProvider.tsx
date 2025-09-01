'use client';

import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

interface DragDropProviderProps {
  children: React.ReactNode;
}

export const DragDropProvider: React.FC<DragDropProviderProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if it's a touch device
    const checkMobile = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isMobileWidth = window.innerWidth <= 768;
      setIsMobile(hasTouch && isMobileWidth);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Always provide DndProvider to avoid context errors
  // Default to HTML5Backend on server, switch on client if needed
  const backend = mounted && isMobile ? TouchBackend : HTML5Backend;
  
  // TouchBackend options for better mobile experience
  const backendOptions = mounted && isMobile ? {
    enableMouseEvents: true,
    enableTouchEvents: true,
    delayTouchStart: 150,
    delayMouseStart: 0,
    touchSlop: 8,
    scrollAngleRanges: [
      { start: 30, end: 150 },
      { start: 210, end: 330 }
    ]
  } : {
    enableMouseEvents: true
  };

  if (mounted) {
    console.log('🎮 DragDropProvider: Using backend:', isMobile ? 'TouchBackend' : 'HTML5Backend');
  }
  
  return (
    <DndProvider backend={backend} options={backendOptions}>
      {children}
    </DndProvider>
  );
};