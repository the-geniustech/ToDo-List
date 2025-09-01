"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

interface SafeCanvasProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  camera?: Record<string, unknown>;
  style?: React.CSSProperties;
  gl?: Record<string, unknown>;
  dpr?: number[];
  onError?: (error: Error) => void;
}

// Simple WebGL availability check
const checkWebGL = (): boolean => {
  try {
    if (typeof window === "undefined") return false;
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return !!gl;
  } catch {
    return false;
  }
};

export const SafeCanvas: React.FC<SafeCanvasProps> = ({
  children,
  fallback,
  camera = { position: [0, 0, 5], fov: 50 },
  style,
  gl,
  dpr,
  onError,
}) => {
  const [renderState, setRenderState] = useState<
    "loading" | "ready" | "error" | "unavailable"
  >("loading");
  const [CanvasComponent, setCanvasComponent] = useState<React.ComponentType<
    Record<string, unknown>
  > | null>(null);

  useEffect(() => {
    let mounted = true;

    const initCanvas = async () => {
      try {
        // First check WebGL
        if (!checkWebGL()) {
          if (mounted) setRenderState("unavailable");
          return;
        }

        // Try to import Canvas from React Three Fiber
        const r3f = await import("@react-three/fiber");

        if (mounted && r3f.Canvas) {
          setCanvasComponent(() => r3f.Canvas);
          setRenderState("ready");
        } else {
          if (mounted) setRenderState("error");
        }
      } catch (error) {
        console.warn("Failed to load Three.js Canvas:", error);
        if (mounted) {
          setRenderState("error");
          onError?.(error as Error);
        }
      }
    };

    initCanvas();

    return () => {
      mounted = false;
    };
  }, [onError]);

  // Loading state
  if (renderState === "loading") {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mb-2 text-4xl"
          >
            🎮
          </motion.div>
          <p className="text-gray-600 text-sm">Loading 3D...</p>
        </div>
      </div>
    );
  }

  // Error or unavailable states
  if (
    renderState === "error" ||
    renderState === "unavailable" ||
    !CanvasComponent
  ) {
    return (
      fallback || (
        <div className="flex justify-center items-center w-full h-full">
          <div className="text-center">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mb-2 text-4xl"
            >
              🎨
            </motion.div>
            <p className="text-gray-600 text-sm">
              {renderState === "error"
                ? "3D rendering failed"
                : "3D not available"}
            </p>
          </div>
        </div>
      )
    );
  }

  // Render the Canvas
  try {
    return (
      <CanvasComponent
        camera={camera}
        style={style}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          ...gl,
        }}
        dpr={dpr || [1, 2]}
        onCreated={() => {
          console.log("Canvas created successfully");
        }}
        onError={(error: Error) => {
          console.warn("Canvas error:", error);
          setRenderState("error");
          onError?.(error);
        }}
      >
        <React.Suspense fallback={null}>{children}</React.Suspense>
      </CanvasComponent>
    );
  } catch (error) {
    console.warn("Canvas render error:", error);
    setRenderState("error");
    return (
      fallback || (
        <div className="flex justify-center items-center w-full h-full">
          <div className="text-center">
            <div className="mb-2 text-4xl">⚠️</div>
            <p className="text-gray-600 text-sm">3D rendering failed</p>
          </div>
        </div>
      )
    );
  }
};
