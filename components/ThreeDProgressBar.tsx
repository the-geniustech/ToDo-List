"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { SafeCanvas } from "./SafeCanvas";
import { useTaskContext } from "./TaskContext";
import { ThreeFiberErrorBoundary } from "./ThreeFiberErrorBoundary";
import { SafeThreeDComponent } from "./SafeThreeDComponent";
import * as THREE from "three";

// 3D Progress Orb Component
function ProgressOrb({
  progress,
  position,
  color,
}: {
  progress: number;
  position: [number, number, number];
  color: string;
}) {
  const meshRef = useRef<THREE.Group>(null);
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [components, setComponents] = useState<{
    Sphere?: React.ForwardRefExoticComponent<any>;
    Text?: React.ForwardRefExoticComponent<any>;
  }>({});
  /* eslint-enable @typescript-eslint/no-explicit-any */

  // Load dependencies
  useEffect(() => {
    import("@react-three/drei")
      .then((drei) => {
        setComponents({
          Sphere: drei.Sphere,
          Text: drei.Text,
        });
      })
      .catch((error) => {
        console.warn("Failed to load ProgressOrb dependencies:", error);
      });
  }, []);

  // Use requestAnimationFrame for animation
  useEffect(() => {
    let animationId: number;

    const animate = () => {
      if (meshRef.current) {
        const time = Date.now() * 0.001;
        meshRef.current.rotation.y = time * 0.5;
        meshRef.current.position.y = position[1] + Math.sin(time * 2) * 0.1;
      }
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [position]);

  if (!components.Sphere || !components.Text) {
    return null;
  }

  const { Sphere, Text } = components;

  return (
    <group position={position}>
      <Sphere ref={meshRef} args={[0.3, 16, 16]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          transparent
          opacity={0.8}
        />
      </Sphere>
      <Text
        position={[0, -0.6, 0]}
        fontSize={0.2}
        color="#333"
        anchorX="center"
        anchorY="middle"
      >
        {Math.round(progress)}%
      </Text>
    </group>
  );
}

// 3D Progress Ring Component
function ProgressRing({
  completionPercentage,
  totalSteps,
  completedSteps,
}: {
  completionPercentage: number;
  totalSteps: number;
  completedSteps: number;
}) {
  const ringRef = useRef<THREE.Group>(null);
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [components, setComponents] = useState<{
    RoundedBox?: React.ForwardRefExoticComponent<any>;
    Box?: React.ForwardRefExoticComponent<any>;
  }>({});
  /* eslint-enable @typescript-eslint/no-explicit-any */

  // Load dependencies
  useEffect(() => {
    import("@react-three/drei")
      .then((drei) => {
        setComponents({
          RoundedBox: drei.RoundedBox,
          Box: drei.Box,
        });
      })
      .catch((error) => {
        console.warn("Failed to load ProgressRing dependencies:", error);
      });
  }, []);

  // Use requestAnimationFrame for animation
  useEffect(() => {
    let animationId: number;

    const animate = () => {
      if (ringRef.current) {
        const time = Date.now() * 0.001;
        ringRef.current.rotation.y = time * 0.3;
      }
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  const stepPositions = useMemo(() => {
    const positions: Array<[number, number, number]> = [];
    const radius = 2;
    const maxSteps = Math.min(totalSteps, 20); // Limit for performance

    for (let i = 0; i < maxSteps; i++) {
      const angle = (i / maxSteps) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      positions.push([x, 0, z]);
    }
    return positions;
  }, [totalSteps]);

  if (!components.RoundedBox || !components.Box) {
    return null;
  }

  const { RoundedBox, Box } = components;

  return (
    <group ref={ringRef}>
      {/* Main progress ring */}
      <RoundedBox args={[5, 0.2, 5]} radius={0.1} position={[0, 0, 0]}>
        <meshStandardMaterial color="#e5e7eb" transparent opacity={0.3} />
      </RoundedBox>

      {/* Completed section */}
      <RoundedBox
        args={[5 * (completionPercentage / 100), 0.25, 0.3]}
        radius={0.1}
        position={[0, 0.1, 0]}
      >
        <meshStandardMaterial
          color={
            completionPercentage >= 80
              ? "#10b981"
              : completionPercentage >= 50
              ? "#f59e0b"
              : "#ef4444"
          }
          emissive={
            completionPercentage >= 80
              ? "#10b981"
              : completionPercentage >= 50
              ? "#f59e0b"
              : "#ef4444"
          }
          emissiveIntensity={0.1}
        />
      </RoundedBox>

      {/* Step indicators */}
      {stepPositions.map((position, i) => {
        const isCompleted =
          i < (completedSteps / totalSteps) * stepPositions.length;
        return (
          <Box key={i} args={[0.1, 0.3, 0.1]} position={position}>
            <meshStandardMaterial
              color={isCompleted ? "#10b981" : "#9ca3af"}
              emissive={isCompleted ? "#10b981" : "#000000"}
              emissiveIntensity={isCompleted ? 0.2 : 0}
            />
          </Box>
        );
      })}
    </group>
  );
}

// Main 3D Scene Component
function ThreeDScene() {
  const { tasks } = useTaskContext();
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [components, setComponents] = useState<{
    Text?: React.ForwardRefExoticComponent<any>;
    OrbitControls?: React.ForwardRefExoticComponent<any>;
  }>({});
  /* eslint-enable @typescript-eslint/no-explicit-any */

  // Load drei components
  useEffect(() => {
    import("@react-three/drei")
      .then((drei) => {
        setComponents({
          Text: drei.Text,
          OrbitControls: drei.OrbitControls,
        });
      })
      .catch((error) => {
        console.warn("Failed to load ThreeDScene dependencies:", error);
      });
  }, []);

  const {
    totalTasks,
    completedTasks,
    inProgressTasks,
    todoTasks,
    totalSteps,
    completedSteps,
  } = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.status === "done").length;
    const inProgress = tasks.filter(
      (task) => task.status === "inprogress"
    ).length;
    const todo = tasks.filter((task) => task.status === "todo").length;
    const steps = tasks.reduce((sum, task) => sum + task.totalSteps, 0);
    const completedSteps = tasks.reduce(
      (sum, task) => sum + task.completedSteps,
      0
    );

    return {
      totalTasks: total,
      completedTasks: completed,
      inProgressTasks: inProgress,
      todoTasks: todo,
      totalSteps: steps,
      completedSteps: completedSteps,
    };
  }, [tasks]);

  const completionPercentage =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const inProgressPercentage =
    totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0;
  const todoPercentage = totalTasks > 0 ? (todoTasks / totalTasks) * 100 : 0;

  if (!components.Text || !components.OrbitControls) {
    return null;
  }

  const { Text, OrbitControls } = components;

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4f46e5" />

      {/* Progress Ring */}
      <ProgressRing
        completionPercentage={completionPercentage}
        totalSteps={totalSteps}
        completedSteps={completedSteps}
      />

      {/* Status Orbs */}
      <ProgressOrb
        progress={completionPercentage}
        position={[-3, 2, 0]}
        color="#10b981"
      />
      <ProgressOrb
        progress={inProgressPercentage}
        position={[0, 2.5, -2]}
        color="#f59e0b"
      />
      <ProgressOrb
        progress={todoPercentage}
        position={[3, 2, 0]}
        color="#6b7280"
      />

      {/* Labels */}
      <Text
        position={[-3, 1.2, 0]}
        fontSize={0.3}
        color="#10b981"
        anchorX="center"
        anchorY="middle"
      >
        DONE
      </Text>
      <Text
        position={[0, 1.7, -2]}
        fontSize={0.3}
        color="#f59e0b"
        anchorX="center"
        anchorY="middle"
      >
        IN PROGRESS
      </Text>
      <Text
        position={[3, 1.2, 0]}
        fontSize={0.3}
        color="#6b7280"
        anchorX="center"
        anchorY="middle"
      >
        TO DO
      </Text>

      {/* Central completion text */}
      <Text
        position={[0, -1, 0]}
        fontSize={0.8}
        color="#1f2937"
        anchorX="center"
        anchorY="middle"
      >
        {Math.round(completionPercentage)}%
      </Text>
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.3}
        color="#6b7280"
        anchorX="center"
        anchorY="middle"
      >
        COMPLETE
      </Text>

      {/* Controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
        autoRotate={true}
        autoRotateSpeed={0.5}
      />
    </>
  );
}

interface ThreeDProgressBarProps {
  className?: string;
}

export const ThreeDProgressBar: React.FC<ThreeDProgressBarProps> = ({
  className = "",
}) => {
  const { tasks } = useTaskContext();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const { totalTasks, completedTasks, totalSteps, completedSteps } =
    useMemo(() => {
      const total = tasks.length;
      const completed = tasks.filter((task) => task.status === "done").length;
      const steps = tasks.reduce((sum, task) => sum + task.totalSteps, 0);
      const completedSteps = tasks.reduce(
        (sum, task) => sum + task.completedSteps,
        0
      );

      return {
        totalTasks: total,
        completedTasks: completed,
        totalSteps: steps,
        completedSteps: completedSteps,
      };
    }, [tasks]);

  return (
    <div
      className={`relative h-64 w-full bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg overflow-hidden ${className}`}
    >
      {mounted ? (
        <ThreeFiberErrorBoundary
          fallback={
            <div className="flex justify-center items-center w-full h-full">
              <div className="text-center">
                <div className="mb-2 text-4xl">📊</div>
                <p className="text-gray-600 text-sm">
                  3D visualization unavailable
                </p>
              </div>
            </div>
          }
        >
          <SafeCanvas
            camera={{ position: [0, 3, 8], fov: 50 }}
            style={{ width: "100%", height: "100%" }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 2]}
            fallback={
              <div className="flex justify-center items-center w-full h-full">
                <div className="text-center">
                  <div className="mb-2 text-4xl">📊</div>
                  <p className="text-gray-600 text-sm">
                    3D visualization unavailable
                  </p>
                </div>
              </div>
            }
          >
            <SafeThreeDComponent>
              <ThreeDScene />
            </SafeThreeDComponent>
          </SafeCanvas>
        </ThreeFiberErrorBoundary>
      ) : (
        <div className="flex justify-center items-center w-full h-full">
          <div className="text-center">
            <div className="mb-2 text-4xl animate-spin">🎮</div>
            <p className="text-gray-600 text-sm">Loading 3D visualization...</p>
          </div>
        </div>
      )}

      {/* Progress info overlay */}
      <div className="bottom-4 left-4 absolute bg-white/90 shadow-lg backdrop-blur-sm px-3 py-2 rounded-lg">
        <p className="font-medium text-gray-700 text-sm">
          {completedTasks}/{totalTasks} tasks completed
        </p>
        <p className="text-gray-500 text-xs">
          {completedSteps}/{totalSteps} steps total
        </p>
      </div>

      {/* 3D indicator */}
      <div className="top-4 right-4 absolute bg-blue-500 shadow-lg px-2 py-1 rounded text-white text-xs">
        🎮 3D Interactive View {mounted ? "✓" : "⏳"}
      </div>
    </div>
  );
};
