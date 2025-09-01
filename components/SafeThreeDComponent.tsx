"use client";

import * as React from "react";
import { useFrame, RootState } from "@react-three/fiber";
import { checkWebGLAvailability } from "./three-setup";

interface SafeThreeDComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  enableErrorBoundary?: boolean;
}

// Error boundary for Three.js components
class ThreeDErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    onError?: (error: Error) => void;
  },
  { hasError: boolean }
> {
  constructor(props: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    onError?: (error: Error) => void;
  }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn(
      "🎮 ThreeDErrorBoundary caught error:",
      error.message,
      errorInfo
    );
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex justify-center items-center w-full h-full">
            <div className="text-center">
              <div className="mb-2 text-4xl">🎮</div>
              <p className="text-gray-600 text-sm">3D component failed</p>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// Higher-order component to safely wrap 3D components
export const SafeThreeDComponent: React.FC<SafeThreeDComponentProps> = ({
  children,
  fallback,
  enableErrorBoundary = true,
}) => {
  const [hasError, setHasError] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setHasError(false);

    // Check if WebGL is available when component mounts
    if (!checkWebGLAvailability()) {
      console.warn("WebGL not available for SafeThreeDComponent");
      setHasError(true);
    }
  }, []);

  // Don't render until mounted (SSR safety)
  if (!mounted) {
    return null;
  }

  if (hasError) {
    return (
      fallback || (
        <div className="flex justify-center items-center w-full h-full">
          <div className="text-center">
            <div className="mb-2 text-4xl">🎮</div>
            <p className="text-gray-600 text-sm">3D component unavailable</p>
          </div>
        </div>
      )
    );
  }

  const content = enableErrorBoundary ? (
    <ThreeDErrorBoundary
      fallback={fallback}
      onError={(error) => {
        console.warn("ThreeDErrorBoundary error:", error);
        setHasError(true);
      }}
    >
      {children}
    </ThreeDErrorBoundary>
  ) : (
    children
  );

  try {
    return <>{content}</>;
  } catch (error) {
    console.warn("SafeThreeDComponent caught error:", error);
    setHasError(true);
    return fallback || null;
  }
};

// Hook to safely use R3F hooks with proper context checking
export const useSafeThreeHook = <T,>(
  hookFn: () => T,
  fallbackValue: T,
  deps: React.DependencyList = []
): T => {
  const [value, setValue] = React.useState<T>(fallbackValue);
  const [hasError, setHasError] = React.useState(false);

  // Extract complex expression to a variable for static checking
  const depsString = JSON.stringify(deps);

  React.useEffect(() => {
    try {
      // Only execute hook if we're in a valid Three.js context
      if (checkWebGLAvailability()) {
        const result = hookFn();
        setValue(result);
        setHasError(false);
      } else {
        setValue(fallbackValue);
        setHasError(true);
      }
    } catch (error) {
      console.warn("useSafeThreeHook caught error:", error);
      setHasError(true);
      setValue(fallbackValue);
    }
  }, [depsString, fallbackValue, hookFn]);

  return hasError ? fallbackValue : value;
};

// Hook for safe useFrame usage
export const useSafeFrame = (
  callback: (state: RootState, delta: number) => void
) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Hooks must run unconditionally
  useFrame((state, delta) => {
    if (!mounted || !checkWebGLAvailability()) return;
    callback(state, delta);
  });
};
