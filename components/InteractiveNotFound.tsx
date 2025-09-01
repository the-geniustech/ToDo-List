"use client";

import React, { Suspense, useRef, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Float, Environment, Html } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "motion/react";
import { useTheme } from "./ThemeProvider";
import { Button } from "./ui/button";
import { Home, ArrowLeft, RotateCcw } from "lucide-react";

// Interactive 3D Objects that respond to mouse
const InteractiveObject: React.FC<{
  position: [number, number, number];
  color: string;
  onClick?: () => void;
}> = ({ position, color, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.x = Math.sin(time) * 0.3;
      meshRef.current.rotation.y = Math.cos(time) * 0.5;

      // Scale based on hover state
      const targetScale = hovered ? 1.2 : clicked ? 0.8 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  const handleClick = useCallback(() => {
    setClicked(true);
    setTimeout(() => setClicked(false), 200);
    onClick?.();
  }, [onClick]);

  return (
    <Float speed={2} rotationIntensity={0.5}>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        <dodecahedronGeometry args={[1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.3 : 0.1}
          transparent
          opacity={hovered ? 0.9 : 0.7}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
};

// Mouse-following particle system
const MouseParticles: React.FC = () => {
  const { mouse, viewport } = useThree();
  const pointsRef = useRef<THREE.Points>(null);
  // const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useFrame(() => {
    if (pointsRef.current) {
      const x = (mouse.x * viewport.width) / 2;
      const y = (mouse.y * viewport.height) / 2;

      // setMousePosition({ x, y });

      // Update particle positions to follow mouse
      const positions = pointsRef.current.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        const dx = x - positions[i];
        const dy = y - positions[i + 1];
        positions[i] += dx * 0.02;
        positions[i + 1] += dy * 0.02;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const particleCount = 100;
  const positions = React.useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#60A5FA"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

// Dynamic background that changes with mouse movement
const DynamicBackground: React.FC = () => {
  const { mouse } = useThree();
  const backgroundRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (backgroundRef.current) {
      // Change background color based on mouse position
      const hue = (mouse.x + 1) * 180; // Map mouse.x from [-1,1] to [0,360]
      const saturation = (mouse.y + 1) * 30 + 20; // Map mouse.y to [20,80]
      const lightness = 10; // Keep it dark

      (backgroundRef.current.material as THREE.MeshBasicMaterial).color.setHSL(
        hue / 360,
        saturation / 100,
        lightness / 100
      );
    }
  });

  return (
    <mesh ref={backgroundRef} position={[0, 0, -50]}>
      <planeGeometry args={[200, 200]} />
      <meshBasicMaterial transparent opacity={0.1} />
    </mesh>
  );
};

// Interactive 3D Scene
const InteractiveScene: React.FC<{
  onObjectClick: (message: string) => void;
}> = ({ onObjectClick }) => {
  const { theme } = useTheme();

  const objects = [
    { position: [-4, 2, 0], color: "#EF4444", message: "Red energy detected!" },
    {
      position: [4, -1, 2],
      color: "#10B981",
      message: "Green power activated!",
    },
    {
      position: [-2, -3, 1],
      color: "#8B5CF6",
      message: "Purple magic unleashed!",
    },
    { position: [3, 3, -1], color: "#F59E0B", message: "Golden light shines!" },
  ] as const;

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={theme === "dark" ? 0.4 : 0.6} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={theme === "dark" ? 1 : 1.2}
        color={theme === "dark" ? "#60A5FA" : "#FFFFFF"}
      />
      <pointLight position={[-10, -10, -5]} intensity={0.6} color="#A855F7" />

      {/* Environment */}
      <Environment preset={theme === "dark" ? "night" : "dawn"} />

      {/* Background Elements */}
      <Stars
        radius={300}
        depth={60}
        count={3000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      <DynamicBackground />
      <MouseParticles />

      {/* Interactive Objects */}
      {objects.map((obj, index) => (
        <InteractiveObject
          key={index}
          position={obj.position.slice() as [number, number, number]}
          color={obj.color}
          onClick={() => onObjectClick(obj.message)}
        />
      ))}

      {/* Floating HTML Elements */}
      <Html position={[0, 4, 0]} center>
        <div className="text-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg font-medium text-white text-lg"
          >
            Click the floating objects!
          </motion.div>
        </div>
      </Html>
    </>
  );
};

// Main Interactive 404 Component
interface InteractiveNotFoundProps {
  onGoHome?: () => void;
  onGoBack?: () => void;
}

export const InteractiveNotFound: React.FC<InteractiveNotFoundProps> = ({
  onGoHome,
  onGoBack,
}) => {
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const handleObjectClick = useCallback((msg: string) => {
    setMessage(msg);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  }, []);

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = "/";
    }
  };

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="relative flex flex-col bg-background w-full h-screen overflow-hidden text-foreground">
      {/* 3D Scene */}
      <div className="absolute inset-0 scene-container">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 60 }}
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
        >
          <Suspense fallback={null}>
            <InteractiveScene onObjectClick={handleObjectClick} />
          </Suspense>
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="z-10 relative flex flex-col flex-1 justify-center items-center p-6">
        {/* Animated 404 Text */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8 text-center"
        >
          <h1 className="font-black text-8xl md:text-9xl select-none holographic-text">
            404
          </h1>
          <h2 className="mt-4 mb-2 font-bold text-2xl md:text-3xl">
            Interactive Void
          </h2>
          <p className="mx-auto max-w-md text-muted-foreground text-lg">
            You&lsquo;ve entered an interactive dimension. Explore the floating
            objects while you&lsquo;re here!
          </p>
        </motion.div>

        {/* Interactive Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: showMessage ? 1 : 0,
            scale: showMessage ? 1 : 0.8,
          }}
          transition={{ duration: 0.3 }}
          className="flex items-center mb-8 h-16"
        >
          {showMessage && (
            <div className="bg-primary/10 backdrop-blur-sm px-6 py-3 border border-primary/20 rounded-lg">
              <p className="font-medium text-primary">{message}</p>
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex sm:flex-row flex-col gap-4"
        >
          <Button
            onClick={handleGoHome}
            className="group px-8 py-3 text-lg not-found-button"
          >
            <Home className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
            Return Home
          </Button>

          <Button
            variant="outline"
            onClick={handleGoBack}
            className="group px-8 py-3 text-lg not-found-button"
          >
            <ArrowLeft className="mr-2 w-5 h-5 transition-transform group-hover:-translate-x-1" />
            Go Back
          </Button>

          <Button
            variant="ghost"
            onClick={() => window.location.reload()}
            className="group px-6 py-3 not-found-button"
          >
            <RotateCcw className="mr-2 w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            Refresh
          </Button>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-8 text-muted-foreground text-sm text-center"
        >
          <p>
            Move your mouse around and click the floating objects to interact!
          </p>
        </motion.div>
      </div>

      {/* Cyber Grid Background */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
    </div>
  );
};
