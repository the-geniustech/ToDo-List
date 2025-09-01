'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ErrorBoundary } from './ErrorBoundary';
import { Button } from './ui/button';
import { Home, ArrowLeft, RefreshCw } from 'lucide-react';
import { NotFoundScene } from './NotFoundScene';
import { motion } from 'motion/react';

interface NotFoundProps {
  onGoHome?: () => void;
  onGoBack?: () => void;
  title?: string;
  subtitle?: string;
}

export const NotFound: React.FC<NotFoundProps> = ({
  onGoHome,
  onGoBack,
  title = "Page Not Found",
  subtitle = "The page you're looking for doesn't exist in this dimension."
}) => {
  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = '/';
    }
  };

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      window.history.back();
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="h-screen w-full bg-background text-foreground flex flex-col items-center justify-center relative overflow-hidden">
      {/* 3D Background Scene */}
      <div className="absolute inset-0 z-0">
        <ErrorBoundary
          fallback={
            <div className="h-full w-full bg-gradient-to-br from-background via-muted to-accent flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="text-9xl font-bold text-primary opacity-20 select-none">
                  404
                </div>
                <div className="text-muted-foreground">
                  3D visualization unavailable
                </div>
              </div>
            </div>
          }
        >
          <Suspense fallback={
            <div className="h-full w-full bg-gradient-to-br from-background via-muted to-accent animate-pulse" />
          }>
            <Canvas
              camera={{ 
                position: [0, 0, 8], 
                fov: 60,
                near: 0.1,
                far: 1000
              }}
              dpr={[1, 2]}
              performance={{ min: 0.5 }}
              className="h-full w-full"
            >
              <NotFoundScene />
            </Canvas>
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 text-center space-y-8 px-6 max-w-4xl mx-auto">
        {/* Animated 404 Text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotateX: -90 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ 
            duration: 1.2, 
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.3
          }}
          className="relative"
        >
          <div className="text-8xl md:text-9xl lg:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary bg-size-200 animate-gradient-x select-none">
            404
          </div>
          {/* Glitch Effect Overlay */}
          <div className="absolute inset-0 text-8xl md:text-9xl lg:text-[12rem] font-black text-destructive opacity-20 animate-pulse select-none">
            404
          </div>
        </motion.div>

        {/* Title and Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.8
          }}
          className="space-y-4"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 1.2
          }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            onClick={handleGoHome}
            className="group relative overflow-hidden px-8 py-3 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg theme-transition"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Home className="w-5 h-5 transition-transform group-hover:scale-110" />
              Go Home
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </Button>

          <Button
            variant="outline"
            onClick={handleGoBack}
            className="group relative overflow-hidden px-8 py-3 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg theme-transition"
          >
            <span className="relative z-10 flex items-center gap-2">
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              Go Back
            </span>
          </Button>

          <Button
            variant="ghost"
            onClick={handleRefresh}
            className="group relative overflow-hidden px-6 py-3 transition-all duration-300 hover:scale-105 theme-transition"
          >
            <span className="relative z-10 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" />
              Refresh
            </span>
          </Button>
        </motion.div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            duration: 0.8, 
            delay: 1.6
          }}
          className="pt-8 text-sm text-muted-foreground"
        >
          <p>
            Error Code: 404 • Lost in the digital void
          </p>
        </motion.div>
      </div>

      {/* Ambient Lighting Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none z-5" />
      
      {/* Floating Particles Overlay */}
      <div className="absolute inset-0 pointer-events-none z-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};