"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Stars,
  Float,
  Text3D,
  Environment,
  OrbitControls,
} from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "./ThemeProvider";

// Floating Geometric Shape Component
const FloatingShape: React.FC<{
  position: [number, number, number];
  geometry: "box" | "sphere" | "octahedron" | "torus" | "cone";
  color: string;
  scale?: number;
  speed?: number;
}> = ({ position, geometry, color, scale = 1, speed = 1 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { theme } = useTheme();

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.x = Math.sin(time * speed * 0.5) * 0.3;
      meshRef.current.rotation.y = Math.cos(time * speed * 0.3) * 0.5;
      meshRef.current.position.y = position[1] + Math.sin(time * speed) * 0.5;
    }
  });

  const GeometryComponent = useMemo(() => {
    switch (geometry) {
      case "box":
        return <boxGeometry args={[1, 1, 1]} />;
      case "sphere":
        return <sphereGeometry args={[0.8, 32, 32]} />;
      case "octahedron":
        return <octahedronGeometry args={[1]} />;
      case "torus":
        return <torusGeometry args={[0.8, 0.3, 16, 100]} />;
      case "cone":
        return <coneGeometry args={[0.8, 1.5, 32]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  }, [geometry]);

  const materialProps = useMemo(() => {
    const isDark = theme === "dark";
    return {
      color: color,
      emissive: color,
      emissiveIntensity: isDark ? 0.2 : 0.1,
      transparent: true,
      opacity: isDark ? 0.8 : 0.6,
      roughness: 0.3,
      metalness: 0.7,
    };
  }, [color, theme]);

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        {GeometryComponent}
        <meshStandardMaterial {...materialProps} />
      </mesh>
    </Float>
  );
};

// Particle System Component
const ParticleSystem: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const { theme } = useTheme();

  const particleCount = 2000;
  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return positions;
  }, []);

  const colors = useMemo(() => {
    const colors = new Float32Array(particleCount * 3);
    const isDark = theme === "dark";
    for (let i = 0; i < particleCount; i++) {
      if (isDark) {
        // Dark theme - brighter particles
        colors[i * 3] = Math.random() * 0.5 + 0.5; // R
        colors[i * 3 + 1] = Math.random() * 0.5 + 0.5; // G
        colors[i * 3 + 2] = Math.random() * 0.5 + 0.5; // B
      } else {
        // Light theme - darker particles
        colors[i * 3] = Math.random() * 0.5; // R
        colors[i * 3 + 1] = Math.random() * 0.5; // G
        colors[i * 3 + 2] = Math.random() * 0.5 + 0.5; // B
      }
    }
    return colors;
  }, [theme]);

  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.getElapsedTime();
      pointsRef.current.rotation.x = time * 0.05;
      pointsRef.current.rotation.y = time * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={particleCount}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={particleCount}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        vertexColors
        transparent
        opacity={theme === "dark" ? 0.8 : 0.6}
        sizeAttenuation
      />
    </points>
  );
};

// Animated Background Grid
const BackgroundGrid: React.FC = () => {
  const gridRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (gridRef.current) {
      const time = state.clock.getElapsedTime();
      gridRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
      gridRef.current.rotation.z = Math.cos(time * 0.1) * 0.1;
    }
  });

  return (
    <group ref={gridRef} position={[0, 0, -20]}>
      <gridHelper args={[100, 100, "#3B82F6", "#6B7280"]} />
    </group>
  );
};

// Holographic 404 Text
const Holographic404: React.FC = () => {
  const textRef = useRef<THREE.Group>(null);
  const { theme } = useTheme();

  useFrame((state) => {
    if (textRef.current) {
      const time = state.clock.getElapsedTime();
      textRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
      textRef.current.position.y = Math.sin(time * 0.8) * 0.2;
    }
  });

  const materialProps = useMemo(() => {
    const isDark = theme === "dark";
    return {
      color: isDark ? "#60A5FA" : "#1D4ED8",
      emissive: isDark ? "#1E40AF" : "#3B82F6",
      emissiveIntensity: isDark ? 0.3 : 0.2,
      transparent: true,
      opacity: 0.9,
      roughness: 0.1,
      metalness: 0.8,
    };
  }, [theme]);

  return (
    <Float speed={1} rotationIntensity={0.3} floatIntensity={0.3}>
      <group ref={textRef} position={[0, 2, -5]}>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={2}
          height={0.5}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          404
          <meshStandardMaterial {...materialProps} />
        </Text3D>
      </group>
    </Float>
  );
};

// Energy Orbs
const EnergyOrb: React.FC<{
  position: [number, number, number];
  color: string;
}> = ({ position, color }) => {
  const orbRef = useRef<THREE.Mesh>(null);
  const { theme } = useTheme();

  useFrame((state) => {
    if (orbRef.current) {
      const time = state.clock.getElapsedTime();
      orbRef.current.rotation.x = time;
      orbRef.current.rotation.y = time * 0.5;

      // Pulsing effect
      const scale = 1 + Math.sin(time * 2) * 0.1;
      orbRef.current.scale.setScalar(scale);
    }
  });

  const materialProps = useMemo(() => {
    const isDark = theme === "dark";
    return {
      color: color,
      emissive: color,
      emissiveIntensity: isDark ? 0.5 : 0.3,
      transparent: true,
      opacity: isDark ? 0.7 : 0.5,
      roughness: 0,
      metalness: 0.9,
    };
  }, [color, theme]);

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={orbRef} position={position}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial {...materialProps} />
        {/* Inner glow */}
        <mesh scale={0.8}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.3} />
        </mesh>
      </mesh>
    </Float>
  );
};

// Main Scene Component
export const NotFoundScene: React.FC = () => {
  const { theme } = useTheme();

  const shapes = useMemo(
    () => [
      {
        position: [-6, 2, 0] as [number, number, number],
        geometry: "box" as const,
        color: "#EF4444",
        scale: 0.8,
        speed: 0.8,
      },
      {
        position: [6, -1, 2] as [number, number, number],
        geometry: "sphere" as const,
        color: "#10B981",
        scale: 1.2,
        speed: 1.2,
      },
      {
        position: [-4, -3, 1] as [number, number, number],
        geometry: "octahedron" as const,
        color: "#8B5CF6",
        scale: 1.0,
        speed: 1.0,
      },
      {
        position: [5, 3, -1] as [number, number, number],
        geometry: "torus" as const,
        color: "#F59E0B",
        scale: 0.9,
        speed: 0.9,
      },
      {
        position: [0, -4, 3] as [number, number, number],
        geometry: "cone" as const,
        color: "#EC4899",
        scale: 1.1,
        speed: 1.1,
      },
      {
        position: [-2, 4, -2] as [number, number, number],
        geometry: "box" as const,
        color: "#06B6D4",
        scale: 0.7,
        speed: 1.3,
      },
      {
        position: [3, 0, 4] as [number, number, number],
        geometry: "sphere" as const,
        color: "#84CC16",
        scale: 0.6,
        speed: 0.7,
      },
    ],
    []
  );

  const energyOrbs = useMemo(
    () => [
      { position: [-8, 1, 3] as [number, number, number], color: "#3B82F6" },
      { position: [8, -2, 1] as [number, number, number], color: "#F97316" },
      { position: [-2, 5, -3] as [number, number, number], color: "#A855F7" },
      { position: [4, -4, 2] as [number, number, number], color: "#06B6D4" },
    ],
    []
  );

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={theme === "dark" ? 0.3 : 0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={theme === "dark" ? 0.8 : 1}
        color={theme === "dark" ? "#60A5FA" : "#FFFFFF"}
      />
      <pointLight
        position={[-10, -10, -5]}
        intensity={theme === "dark" ? 0.5 : 0.3}
        color={theme === "dark" ? "#A855F7" : "#3B82F6"}
      />

      {/* Environment */}
      <Environment preset={theme === "dark" ? "night" : "dawn"} />

      {/* Background Elements */}
      <Stars
        radius={300}
        depth={60}
        count={5000}
        factor={6}
        saturation={0}
        fade
        speed={0.5}
      />

      <BackgroundGrid />
      <ParticleSystem />

      {/* Main 404 Text (fallback if font doesn't load) */}
      <Holographic404 />

      {/* Floating Shapes */}
      {shapes.map((shape, index) => (
        <FloatingShape
          key={index}
          position={shape.position}
          geometry={shape.geometry}
          color={shape.color}
          scale={shape.scale}
          speed={shape.speed}
        />
      ))}

      {/* Energy Orbs */}
      {energyOrbs.map((orb, index) => (
        <EnergyOrb key={index} position={orb.position} color={orb.color} />
      ))}

      {/* Camera Controls (subtle auto-rotation) */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        autoRotate
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
      />
    </>
  );
};
