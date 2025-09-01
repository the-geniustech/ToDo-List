"use client";

import React, { Suspense, useRef, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Float, Environment } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "motion/react";
import { useTheme } from "./ThemeProvider";
import { Button } from "./ui/button";
import { Home, ArrowLeft, RotateCcw } from "lucide-react";

/* ------------------ InteractiveObject ------------------ */
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
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          handleClick();
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <dodecahedronGeometry args={[1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.35 : 0.12}
          transparent
          opacity={hovered ? 0.95 : 0.8}
          roughness={0.2}
          metalness={0.85}
        />
      </mesh>
    </Float>
  );
};

/* ------------------ MouseParticles ------------------ */
const MouseParticles: React.FC = () => {
  const { mouse, viewport } = useThree();
  const pointsRef = useRef<THREE.Points>(null);

  useFrame(() => {
    if (pointsRef.current) {
      const x = (mouse.x * viewport.width) / 2;
      const y = (mouse.y * viewport.height) / 2;
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
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={particleCount}
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

/* ------------------ DynamicBackground ------------------ */
const DynamicBackground: React.FC = () => {
  const { mouse } = useThree();
  const backgroundRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (backgroundRef.current) {
      const hue = (mouse.x + 1) * 0.45;
      const saturation = (mouse.y + 1) * 0.25 + 0.3;
      const lightness = 0.07;
      (backgroundRef.current.material as THREE.MeshBasicMaterial).color.setHSL(
        hue,
        saturation,
        lightness
      );
    }
  });

  return (
    <mesh ref={backgroundRef} position={[0, 0, -50]}>
      <planeGeometry args={[200, 200]} />
      <meshBasicMaterial transparent opacity={0.15} />
    </mesh>
  );
};

/* ------------------ InteractiveScene ------------------ */
const InteractiveScene: React.FC<{
  onObjectClick: (message: string) => void;
}> = ({ onObjectClick }) => {
  const { theme } = useTheme();

  const objects = [
    {
      position: [-4, 2, 0],
      color: "#EF4444",
      message: "Lost page clue unlocked!",
    },
    {
      position: [4, -1, 2],
      color: "#10B981",
      message: "You discovered a hidden fragment!",
    },
    {
      position: [-2, -3, 1],
      color: "#8B5CF6",
      message: "A secret pathway reveals itself...",
    },
    {
      position: [3, 3, -1],
      color: "#F59E0B",
      message: "Golden portal piece acquired!",
    },
  ] as const;

  return (
    <>
      <ambientLight intensity={theme === "dark" ? 0.4 : 0.6} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={theme === "dark" ? 1 : 1.2}
        color={theme === "dark" ? "#60A5FA" : "#FFFFFF"}
      />
      <pointLight position={[-10, -10, -5]} intensity={0.6} color="#A855F7" />
      <Environment preset={theme === "dark" ? "night" : "dawn"} />
      <Stars
        radius={300}
        depth={60}
        count={1200}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      <DynamicBackground />
      <MouseParticles />
      {objects.map((obj, index) => (
        <InteractiveObject
          key={index}
          position={obj.position.slice() as [number, number, number]}
          color={obj.color}
          onClick={() => onObjectClick(obj.message)}
        />
      ))}
    </>
  );
};

/* ------------------ Main Component ------------------ */
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
    if (onGoHome) onGoHome();
    else window.location.href = "/";
  };

  const handleGoBack = () => {
    if (onGoBack) onGoBack();
    else window.history.back();
  };

  // Guard: keep canvas below overlays
  // (z-0 for canvas, z-40 for text, z-50 for buttons)
  return (
    <div className="relative flex flex-col bg-background w-full h-screen overflow-hidden text-foreground">
      {/* 3D Scene (base layer) */}
      <div className="z-0 absolute inset-0">
        <Canvas
          className="w-full h-full"
          camera={{ position: [0, 0, 10], fov: 60 }}
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
          onPointerMissed={() => console.log("pointer missed canvas")}
        >
          <Suspense fallback={null}>
            <InteractiveScene onObjectClick={handleObjectClick} />
          </Suspense>
        </Canvas>
      </div>

      {/* Non-interactive content overlay (text + message) */}
      <div className="z-40 absolute inset-0 flex flex-col justify-center items-center p-6 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8 text-center pointer-events-none"
        >
          <h1 className="font-black text-8xl md:text-9xl pointer-events-none select-none holographic-text">
            404
          </h1>
          <h2 className="mt-4 mb-2 font-bold text-2xl md:text-3xl pointer-events-none">
            Page Not Found
          </h2>
          <p className="mx-auto max-w-md text-muted-foreground text-lg pointer-events-none">
            Looks like you drifted into the void. Click the floating shards to
            gather clues back home.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: showMessage ? 1 : 0,
            scale: showMessage ? 1 : 0.8,
          }}
          transition={{ duration: 0.3 }}
          className="flex items-center mb-8 h-16 pointer-events-none"
        >
          {showMessage && (
            <div className="bg-primary/10 backdrop-blur-sm px-6 py-3 border border-primary/20 rounded-lg pointer-events-auto">
              <p className="font-medium text-primary">{message}</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* ACTION BUTTONS — isolated interactive layer (always clickable) */}
      <div className="bottom-10 z-50 absolute inset-x-0 flex justify-center px-6">
        <div className="flex sm:flex-row flex-col gap-4">
          <Button
            type="button"
            onClick={handleGoHome}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className="group px-8 py-3 text-lg not-found-button"
            style={{ pointerEvents: "auto" }} // hard override
          >
            <Home className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
            Return Home
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoBack}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className="group px-8 py-3 text-lg not-found-button"
            style={{ pointerEvents: "auto" }}
          >
            <ArrowLeft className="mr-2 w-5 h-5 transition-transform group-hover:-translate-x-1" />
            Go Back
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => window.location.reload()}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className="group px-6 py-3 not-found-button"
            style={{ pointerEvents: "auto" }}
          >
            <RotateCcw className="mr-2 w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Cyber Grid Background (non-interactive) */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
    </div>
  );
};
