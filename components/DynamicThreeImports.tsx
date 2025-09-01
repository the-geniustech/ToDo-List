"use client";

import React from "react";
import { useFrame, RootState } from "@react-three/fiber";

// Dynamic import cache to prevent multiple loads
const importCache = new Map<string, Promise<unknown>>();

// Safe dynamic import with error handling
export const safeDynamicImport = async <T,>(
  importFn: () => Promise<unknown>,
  cacheKey: string
): Promise<T | null> => {
  try {
    if (!importCache.has(cacheKey)) {
      importCache.set(
        cacheKey,
        importFn().catch(() => null)
      );
    }
    const mod = await importCache.get(cacheKey);
    // Cast to T | null
    return (mod as T) ?? null;
  } catch {
    return null;
  }
};

// React Three Fiber hooks
// export const useFrameSafe = (
//   callback: (state: RootState, delta: number) => void
// ) => {
//   const [useFrame, setUseFrame] = React.useState<
//     ((cb: (state: RootState, delta: number) => void) => void) | null
//   >(null);

//   React.useEffect(() => {
//     safeDynamicImport<typeof import("@react-three/fiber")>(
//       () => import("@react-three/fiber"),
//       "react-three-fiber"
//     ).then((r3f) => {
//       if (r3f?.useFrame) {
//         setUseFrame(() => r3f.useFrame);
//       }
//     });
//   }, []);

//   React.useEffect(() => {
//     if (useFrame && typeof callback === "function") {
//       try {
//         return useFrame(callback);
//       } catch (error) {
//         console.warn("useFrame error:", error);
//       }
//     }
//   }, [useFrame, callback]);
// };

export const useFrameSafe = (
  callback: (state: RootState, delta: number) => void
) => {
  useFrame(callback);
};

// React Three Drei components

/* eslint-disable @typescript-eslint/no-explicit-any */
type DreiComponents = {
  OrbitControls?: React.ForwardRefExoticComponent<any>;
  Text?: React.ForwardRefExoticComponent<any>;
  Sphere?: React.ForwardRefExoticComponent<any>;
  RoundedBox?: React.ForwardRefExoticComponent<any>;
  Box?: React.ForwardRefExoticComponent<any>;
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export const useDreiComponents = () => {
  const [components, setComponents] = React.useState<DreiComponents>({});

  React.useEffect(() => {
    safeDynamicImport<typeof import("@react-three/drei")>(
      () => import("@react-three/drei"),
      "react-three-drei"
    ).then((drei) => {
      if (drei) {
        setComponents({
          OrbitControls: drei.OrbitControls,
          Text: drei.Text,
          Sphere: drei.Sphere,
          RoundedBox: drei.RoundedBox,
          Box: drei.Box,
        });
      }
    });
  }, []);

  return components;
};

// Canvas component loader
export const useCanvasComponent = () => {
  const [Canvas, setCanvas] = React.useState<React.ComponentType<
    Record<string, unknown>
  > | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    safeDynamicImport<typeof import("@react-three/fiber")>(
      () => import("@react-three/fiber"),
      "react-three-fiber-canvas"
    )
      .then((r3f) => {
        if (r3f?.Canvas) {
          setCanvas(() => r3f.Canvas);
          setError(null);
        } else {
          setError("Canvas component not found");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      });
  }, []);

  return { Canvas, loading, error };
};

// Higher-order component for safe Three.js component loading

export function withSafeThreeJs<P extends object, R = unknown>(
  Component: React.ComponentType<P & React.RefAttributes<R>>,
  fallback?: React.ReactNode
) {
  const Wrapped = React.forwardRef<R, P>((props) => {
    const [isReady, setIsReady] = React.useState(false);
    const [hasError, setHasError] = React.useState(false);

    React.useEffect(() => {
      Promise.all([
        safeDynamicImport(() => import("@react-three/fiber"), "r3f-check"),
        safeDynamicImport(() => import("@react-three/drei"), "drei-check"),
      ])
        .then(([r3f, drei]) => {
          if (r3f && drei) {
            setIsReady(true);
          } else {
            setHasError(true);
          }
        })
        .catch(() => {
          setHasError(true);
        });
    }, []);

    if (hasError) {
      return (
        fallback || (
          <div className="flex justify-center items-center w-full h-full">
            <div className="text-center">
              <div className="mb-2 text-4xl">⚠️</div>
              <p className="text-gray-600 text-sm">3D components unavailable</p>
            </div>
          </div>
        )
      );
    }

    if (!isReady) {
      return (
        <div className="flex justify-center items-center w-full h-full">
          <div className="text-center">
            <div className="mb-2 text-4xl animate-spin">🎮</div>
            <p className="text-gray-600 text-sm">Loading 3D components...</p>
          </div>
        </div>
      );
    }

    return <Component {...(props as P)} />;
  });

  Wrapped.displayName = `withSafeThreeJs(${
    Component.displayName || Component.name || "Component"
  })`;

  return Wrapped;
}

// Preload Three.js dependencies
export const preloadThreeDependencies = async () => {
  console.log("🚀 Preloading Three.js dependencies...");

  const results = await Promise.allSettled([
    safeDynamicImport(() => import("@react-three/fiber"), "preload-r3f"),
    safeDynamicImport(() => import("@react-three/drei"), "preload-drei"),
  ]);

  const loadedCount = results.filter((r) => r.status === "fulfilled").length;
  console.log(`✅ Preloaded ${loadedCount}/2 Three.js dependencies`);

  return loadedCount === 2;
};

// Clear import cache (useful for development)
export const clearImportCache = () => {
  importCache.clear();
  console.log("🧹 Cleared Three.js import cache");
};
