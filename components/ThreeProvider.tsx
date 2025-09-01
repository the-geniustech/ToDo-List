"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  initializeThreeEnvironment,
  checkWebGLAvailability,
  detectThreeConflicts,
} from "./three-setup";

interface ThreeContextType {
  isAvailable: boolean;
  isInitialized: boolean;
  hasConflicts: boolean;
  error: string | null;
  reinitialize: () => Promise<void>;
}

const ThreeContext = createContext<ThreeContextType | undefined>(undefined);

export const useThree = () => {
  const context = useContext(ThreeContext);
  if (context === undefined) {
    // Provide a safe fallback instead of throwing
    console.warn(
      "useThree called outside ThreeProvider - returning fallback values"
    );
    return {
      isAvailable: false,
      isInitialized: false,
      hasConflicts: false,
      error: "No provider",
      reinitialize: async () => {},
    };
  }
  return context;
};

interface ThreeProviderProps {
  children: React.ReactNode;
}

export const ThreeProvider: React.FC<ThreeProviderProps> = ({ children }) => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasConflicts, setHasConflicts] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialize = useCallback(async () => {
    try {
      setError(null);

      // Check for conflicts first
      const conflicts = detectThreeConflicts();
      setHasConflicts(conflicts);

      if (conflicts) {
        console.warn("⚠️ Three.js conflicts detected but proceeding anyway");
      }

      // Initialize the Three.js environment
      const available = initializeThreeEnvironment();
      setIsAvailable(available);
      setIsInitialized(true);

      console.log("✅ ThreeProvider initialized:", {
        available,
        conflicts,
        webgl: checkWebGLAvailability(),
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.warn("❌ Three.js initialization failed:", errorMessage);
      setError(errorMessage);
      setIsAvailable(false);
      setIsInitialized(false);
    }
  }, []);

  const reinitialize = useCallback(async () => {
    console.log("🔄 Reinitializing Three.js...");
    setIsInitialized(false);
    setIsAvailable(false);
    setError(null);

    // Small delay to ensure cleanup
    await new Promise((resolve) => setTimeout(resolve, 100));
    await initialize();
  }, [initialize]);

  useEffect(() => {
    initialize();

    // Cleanup on unmount
    return () => {
      // Cleanup handled by component unmounting
    };
  }, [initialize]);

  // Handle visibility change to reinitialize if needed
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && !isAvailable && isInitialized) {
        console.log("👁️ Page visible - checking Three.js availability");
        const stillAvailable = checkWebGLAvailability();
        if (stillAvailable !== isAvailable) {
          setIsAvailable(stillAvailable);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isAvailable, isInitialized]);

  const value: ThreeContextType = {
    isAvailable,
    isInitialized,
    hasConflicts,
    error,
    reinitialize,
  };

  return (
    <ThreeContext.Provider value={value}>{children}</ThreeContext.Provider>
  );
};

// Hook to safely check if Three.js is available
export const useThreeAvailable = (): boolean => {
  const context = useThree();
  // If context is undefined (no provider), fallback to direct check
  if (context === undefined) {
    return checkWebGLAvailability();
  }
  return context.isAvailable;
};

// Hook to get Three.js status information
export const useThreeStatus = () => {
  const context = useThree();
  return {
    status: context.isAvailable
      ? "available"
      : context.error
      ? "error"
      : "unavailable",
    details: {
      initialized: context.isInitialized,
      conflicts: context.hasConflicts,
      error: context.error,
    },
  };
};
