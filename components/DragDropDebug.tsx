"use client";

import React, { useEffect, useState } from "react";

export const DragDropDebug: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const addLog = (message: string) => {
      setLogs((prev) => [
        ...prev.slice(-9),
        `${new Date().toLocaleTimeString()}: ${message}`,
      ]);
    };

    // Enhanced debugging for both HTML5 and touch events
    const handleDragStart = () => {
      setDragActive(true);
      addLog("HTML5 DragStart");
    };

    const handleDragEnd = () => {
      setDragActive(false);
      addLog("HTML5 DragEnd");
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      addLog("HTML5 Drop");
    };

    // Touch events for debugging
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".task-card")) {
        addLog("Touch Start on task");
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".task-card")) {
        addLog("Touch Move");
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".task-card")) {
        addLog("Touch End");
      }
    };

    // Skip console override for now to avoid conflicts
    // const originalConsoleLog = console.log;

    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("dragend", handleDragEnd);
    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("drop", handleDrop);
    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("dragend", handleDragEnd);
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("drop", handleDrop);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isClient]);

  // Auto clear logs after 15 seconds
  useEffect(() => {
    if (logs.length > 0) {
      const timer = setTimeout(() => {
        setLogs([]);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [logs]);

  // Always show when client is ready for better debugging
  if (!isClient) return null;

  return (
    <div className="top-4 right-4 z-[9999] fixed bg-black/90 p-3 rounded-lg max-w-sm text-white text-xs">
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`w-2 h-2 rounded-full ${
            dragActive ? "bg-green-400" : "bg-gray-400"
          }`}
        />
        <div className="font-bold">Drag & Drop Debug</div>
      </div>
      <div className="space-y-1 max-h-32 overflow-y-auto">
        {logs.length === 0 ? (
          <div className="text-gray-400">Waiting for drag events...</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="font-mono text-xs">
              {log}
            </div>
          ))
        )}
      </div>
      <div className="mt-2 pt-2 border-gray-600 border-t text-gray-300">
        Status: {dragActive ? "Dragging" : "Ready"}
      </div>
    </div>
  );
};
