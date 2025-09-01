'use client';

import React from 'react';
import { motion } from 'motion/react';

interface ThreeFiberErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ThreeFiberErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ThreeFiberErrorBoundary extends React.Component<
  ThreeFiberErrorBoundaryProps,
  ThreeFiberErrorBoundaryState
> {
  constructor(props: ThreeFiberErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ThreeFiberErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log Three.js/R3F specific errors
    if (error.message.includes('R3F:') || error.message.includes('THREE.')) {
      console.warn('🎮 Three.js/R3F Error caught:', error.message);
      console.warn('Error Info:', errorInfo);
    } else {
      console.error('ThreeFiberErrorBoundary caught error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default 3D fallback
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="text-center p-8">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-6xl mb-4"
            >
              🎨
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              3D Visualization Unavailable
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Using enhanced 2D celebration instead
            </p>
            <div className="flex justify-center space-x-2">
              {['🌟', '✨', '🎉', '🎊', '⭐'].map((emoji, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    y: [0, -10, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                  className="text-2xl"
                >
                  {emoji}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export const useThreeFiberErrorBoundary = () => {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.error?.message?.includes('R3F:') || event.error?.message?.includes('THREE.')) {
        setError(event.error);
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const resetError = () => setError(null);

  return { error, resetError };
};