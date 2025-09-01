"use client";

import React from "react";
import { useDrag, useDrop } from "react-dnd";

const TestItem: React.FC<{ id: string; text: string }> = ({ id, text }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "test-item",
    item: { id, text },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <>
      {drag(
        <div
          // ref={drag}
          className={`p-2 bg-blue-100 border border-blue-300 rounded cursor-move ${
            isDragging ? "opacity-50" : "opacity-100"
          }`}
        >
          {text}
        </div>
      )}
    </>
  );
};

const TestDropZone: React.FC<{
  onDrop: (item: { id: string; text: string }) => void;
  children: React.ReactNode;
}> = ({ onDrop, children }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "test-item",
    drop: onDrop,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  return (
    <>
      {drop(
        <div
          // ref={drop}
          className={`p-4 border-2 border-dashed rounded min-h-[100px] ${
            isOver && canDrop
              ? "border-green-400 bg-green-50"
              : canDrop
              ? "border-gray-400 bg-gray-50"
              : "border-gray-300"
          }`}
        >
          {children}
        </div>
      )}
    </>
  );
};

export const DragDropTest: React.FC = () => {
  const [droppedItems, setDroppedItems] = React.useState<string[]>([]);

  const handleDrop = (item: { id: string; text: string }) => {
    console.log("🧪 Test drop:", item);
    setDroppedItems((prev) => [...prev, item.text]);
  };

  return (
    <div className="bg-white mb-4 p-4 border border-gray-200 rounded-lg">
      <h3 className="mb-3 font-semibold text-gray-700 text-sm">
        🧪 Drag & Drop Test
      </h3>

      <div className="gap-4 grid grid-cols-2">
        <div>
          <p className="mb-2 text-gray-600 text-xs">Drag these items:</p>
          <div className="space-y-2">
            <TestItem id="1" text="Test Item 1" />
            <TestItem id="2" text="Test Item 2" />
          </div>
        </div>

        <div>
          <p className="mb-2 text-gray-600 text-xs">Drop zone:</p>
          <TestDropZone onDrop={handleDrop}>
            {droppedItems.length === 0 ? (
              <p className="text-gray-400 text-xs text-center">
                Drop items here
              </p>
            ) : (
              <div className="space-y-1">
                {droppedItems.map((item, index) => (
                  <div key={index} className="text-green-600 text-xs">
                    ✅ {item}
                  </div>
                ))}
              </div>
            )}
          </TestDropZone>
        </div>
      </div>

      <div className="mt-2 text-gray-500 text-xs">
        Status:{" "}
        {droppedItems.length > 0
          ? "✅ Drag & Drop Working!"
          : "⏳ Try dragging an item"}
      </div>
    </div>
  );
};
