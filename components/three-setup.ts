"use client";

// Simple Three.js configuration to prevent multiple instances
let _webglChecked = false;
let _webglAvailable = false;

// Basic WebGL availability check
export const checkWebGLAvailability = (): boolean => {
  if (_webglChecked) return _webglAvailable;

  try {
    if (typeof window === "undefined") {
      _webglAvailable = false;
      _webglChecked = true;
      return false;
    }

    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    _webglAvailable = !!gl;
    _webglChecked = true;

    if (_webglAvailable) {
      console.log("✅ WebGL is available");
    } else {
      console.warn("⚠️ WebGL is not available");
    }

    return _webglAvailable;
  } catch (error) {
    console.warn("WebGL check failed:", error);
    _webglAvailable = false;
    _webglChecked = true;
    return false;
  }
};

// Three.js conflict detection
export const detectThreeConflicts = (): boolean => {
  if (typeof window === "undefined") return false;

  try {
    // Check for global THREE.js
    const hasGlobalThree = (window as unknown as Record<string, unknown>).THREE;
    if (hasGlobalThree) {
      console.warn("⚠️ Global THREE.js detected - potential conflicts");
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

// Simple optimal configuration
export const getOptimalThreeConfig = () => ({
  antialias: true,
  alpha: true,
  powerPreference: "high-performance" as const,
  stencil: false,
  depth: true,
});

// Initialize Three.js environment
export const initializeThreeEnvironment = (): boolean => {
  const webglAvailable = checkWebGLAvailability();
  const hasConflicts = detectThreeConflicts();

  if (hasConflicts) {
    console.warn("⚠️ Three.js conflicts detected but proceeding");
  }

  return webglAvailable;
};

// Legacy compatibility
export const checkThreeAvailability = checkWebGLAvailability;
export const initializeThree = initializeThreeEnvironment;
