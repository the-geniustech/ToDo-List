"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2,
  Sparkles,
  Trophy as TrophyIcon,
  Target,
} from "lucide-react";
import { Button } from "./ui/button";
import { SafeCanvas } from "./SafeCanvas";
import { ThreeFiberErrorBoundary } from "./ThreeFiberErrorBoundary";
import { SafeThreeDComponent } from "./SafeThreeDComponent";
import * as THREE from "three";

// 3D Floating Stars Component
function FloatingStars({ count = 12 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  // Use requestAnimationFrame for manual animation
  useEffect(() => {
    let animationId: number;

    const animate = () => {
      if (groupRef.current) {
        const time = Date.now() * 0.001;
        groupRef.current.rotation.y = time * 0.2;
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

  const starPositions = useMemo(() => {
    const positions: Array<[number, number, number]> = [];
    for (let i = 0; i < count; i++) {
      const radius = 2 + Math.random() * 3;
      const angle = (i / count) * Math.PI * 2;
      const height = (Math.random() - 0.5) * 4;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      positions.push([x, height, z]);
    }
    return positions;
  }, [count]);

  return (
    <group ref={groupRef}>
      {starPositions.map((position, i) => (
        <StarShape
          key={i}
          position={position}
          delay={i * 0.2}
          scale={0.8 + Math.random() * 0.4}
        />
      ))}
    </group>
  );
}

// Custom Star Geometry Component
function StarShape({
  position,
  delay = 0,
  scale = 1,
}: {
  position: [number, number, number];
  delay?: number;
  scale?: number;
}) {
  const meshRef = useRef<THREE.Group>(null);

  // Use requestAnimationFrame for manual animation
  useEffect(() => {
    let animationId: number;

    const animate = () => {
      if (meshRef.current) {
        const time = Date.now() * 0.001 + delay;
        meshRef.current.position.y = position[1] + Math.sin(time * 2) * 0.5;
        meshRef.current.rotation.x = time * 0.5;
        meshRef.current.rotation.z = time * 0.3;
      }
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [position, delay]);

  // Create star shape using multiple cones
  return (
    <group ref={meshRef} position={position} scale={scale}>
      {/* Main star body - diamond shape */}
      <mesh>
        <octahedronGeometry args={[0.15, 0]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Star rays */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} rotation={[0, 0, (Math.PI / 2) * i]}>
          <coneGeometry args={[0.04, 0.2, 4]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#fbbf24"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

// 3D Trophy Component
// function Trophy() {
//   const trophyRef = useRef<any>(null);
//   const [useFrame, setUseFrame] = useState<any>(null);
//   const [components, setComponents] = useState<any>({});

//   // Load dependencies dynamically
//   useEffect(() => {
//     Promise.all([import("@react-three/fiber"), import("@react-three/drei")])
//       .then(([r3f, drei]) => {
//         setUseFrame(() => r3f.useFrame);
//         setComponents({
//           Sphere: drei.Sphere,
//           RoundedBox: drei.RoundedBox,
//         });
//       })
//       .catch((error) => {
//         console.warn("Failed to load Trophy dependencies:", error);
//       });
//   }, []);

//   // Use useFrame if available
//   useEffect(() => {
//     if (useFrame) {
//       try {
//         return useFrame((state: any) => {
//           if (trophyRef.current) {
//             trophyRef.current.rotation.y =
//               Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
//             trophyRef.current.position.y =
//               Math.sin(state.clock.elapsedTime * 2) * 0.2;
//           }
//         });
//       } catch (error) {
//         console.warn("useFrame error in Trophy:", error);
//       }
//     }
//   }, [useFrame]);

//   // Don't render until components are loaded
//   if (!components.Sphere || !components.RoundedBox) {
//     return null;
//   }

//   const { Sphere, RoundedBox } = components;

//   return (
//     <group ref={trophyRef}>
//       {/* Trophy Cup */}
//       <Sphere args={[0.6, 16, 16]} position={[0, 0.5, 0]}>
//         <meshStandardMaterial
//           color="#fbbf24"
//           emissive="#fbbf24"
//           emissiveIntensity={0.2}
//           metalness={0.7}
//           roughness={0.3}
//         />
//       </Sphere>

//       {/* Trophy Base */}
//       <RoundedBox args={[1.2, 0.3, 1.2]} radius={0.1} position={[0, -0.3, 0]}>
//         <meshStandardMaterial color="#6b7280" metalness={0.8} roughness={0.2} />
//       </RoundedBox>

//       {/* Handles */}
//       <RoundedBox
//         args={[0.1, 0.6, 0.1]}
//         radius={0.05}
//         position={[-0.8, 0.3, 0]}
//       >
//         <meshStandardMaterial color="#fbbf24" metalness={0.7} roughness={0.3} />
//       </RoundedBox>
//       <RoundedBox args={[0.1, 0.6, 0.1]} radius={0.05} position={[0.8, 0.3, 0]}>
//         <meshStandardMaterial color="#fbbf24" metalness={0.7} roughness={0.3} />
//       </RoundedBox>
//     </group>
//   );
// }

// 3D Scene Component
function CelebrationScene({ taskTitle }: { taskTitle: string }) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [components, setComponents] = useState<{
    OrbitControls?: React.ForwardRefExoticComponent<any>;
    Text?: React.ForwardRefExoticComponent<any>;
    RoundedBox?: React.ForwardRefExoticComponent<any>;
  }>({});
  /* eslint-enable @typescript-eslint/no-explicit-any */

  // Load drei components dynamically
  useEffect(() => {
    import("@react-three/drei")
      .then((drei) => {
        setComponents({
          OrbitControls: drei.OrbitControls,
          Text: drei.Text,
          RoundedBox: drei.RoundedBox,
        });
      })
      .catch((error) => {
        console.warn("Failed to load drei components:", error);
      });
  }, []);

  // Don't render until components are loaded
  if (!components.OrbitControls || !components.Text || !components.RoundedBox) {
    return null;
  }

  const { OrbitControls, Text, RoundedBox } = components;

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#fbbf24" />
      <pointLight position={[-10, 5, -10]} intensity={0.5} color="#3b82f6" />
      <pointLight position={[0, -5, 5]} intensity={0.3} color="#ec4899" />

      {/* Main Trophy */}
      <TrophyIcon />

      {/* Floating Stars */}
      <FloatingStars count={15} />

      {/* Celebration Text */}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.4}
        color="#1f2937"
        anchorX="center"
        anchorY="middle"
        maxWidth={8}
      >
        TASK COMPLETED!
      </Text>

      <Text
        position={[0, 1.8, 0]}
        fontSize={0.25}
        color="#6b7280"
        anchorX="center"
        anchorY="middle"
        maxWidth={10}
      >
        {taskTitle}
      </Text>

      {/* Progress Ring */}
      <RoundedBox args={[6, 0.2, 6]} radius={0.1} position={[0, -2, 0]}>
        <meshStandardMaterial
          color="#10b981"
          emissive="#10b981"
          emissiveIntensity={0.2}
        />
      </RoundedBox>

      {/* Controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
        autoRotate={true}
        autoRotateSpeed={1}
      />
    </>
  );
}

interface TaskCompletionCelebrationProps {
  isVisible: boolean;
  taskTitle: string;
  onClose: () => void;
}

export const TaskCompletionCelebration: React.FC<
  TaskCompletionCelebrationProps
> = ({ isVisible, taskTitle, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-close after 10 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  // Non-3D celebration fallback component
  const CelebrationFallback = () => (
    <div className="flex justify-center items-center w-full h-full">
      <div className="text-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="mb-4 text-6xl"
        >
          🏆
        </motion.div>
        <h3 className="mb-2 font-bold text-gray-800 text-xl">
          Task Completed!
        </h3>
        <p className="text-gray-600">{taskTitle}</p>
        <div className="flex justify-center space-x-4 mt-4">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            className="text-2xl"
          >
            ⭐
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            className="text-2xl"
          >
            ✨
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            className="text-2xl"
          >
            🎉
          </motion.div>
        </div>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      <div className="z-[100] fixed inset-0 flex justify-center items-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-lg"
          onClick={onClose}
        />

        {/* Celebration Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
            duration: 0.6,
          }}
          className="z-50 relative bg-white shadow-2xl border-2 border-yellow-200 rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
        >
          {/* Header with confetti background */}
          <div className="relative bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400 p-6">
            <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
            <div className="relative flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                  className="text-2xl"
                >
                  🏆
                </motion.div>
                <div>
                  <h2 className="drop-shadow-lg font-bold text-white text-2xl">
                    🎉 Congratulations!
                  </h2>
                  <p className="text-white/90 text-sm">
                    You&lsquo;ve completed a task with 100% progress!
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="hover:bg-white/20 text-white"
              >
                ✕
              </Button>
            </div>
          </div>

          {/* 3D Visualization */}
          <div className="bg-gradient-to-b from-blue-50 to-purple-50 h-96">
            {mounted ? (
              <ThreeFiberErrorBoundary fallback={<CelebrationFallback />}>
                <SafeCanvas
                  camera={{ position: [0, 3, 8], fov: 50 }}
                  style={{ width: "100%", height: "100%" }}
                  gl={{ antialias: true, alpha: true }}
                  dpr={[1, 2]}
                  fallback={<CelebrationFallback />}
                >
                  <SafeThreeDComponent fallback={null}>
                    <CelebrationScene taskTitle={taskTitle} />
                  </SafeThreeDComponent>
                </SafeCanvas>
              </ThreeFiberErrorBoundary>
            ) : (
              <div className="flex justify-center items-center w-full h-full">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="text-4xl"
                >
                  🎮
                </motion.div>
              </div>
            )}
          </div>

          {/* Achievement Details */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-800">
                    Task Completed
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-800">
                    100% Progress
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-gray-800">
                    Achievement Unlocked
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button
                  onClick={onClose}
                  className="bg-gradient-to-r from-green-500 hover:from-green-600 to-blue-500 hover:to-blue-600 text-white"
                >
                  Awesome! 🎉
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
