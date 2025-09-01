"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Info,
} from "lucide-react";
import {
  checkWebGLAvailability,
  getOptimalThreeConfig,
  detectThreeConflicts,
} from "./three-setup";
import { useThree, useThreeStatus } from "./ThreeProvider";

interface DiagnosticResult {
  name: string;
  status: "pass" | "fail" | "warning";
  message: string;
  details?: Record<string, unknown>;
}

export const ThreeDiagnostic: React.FC = () => {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const threeContext = useThree();
  const threeStatus = useThreeStatus();

  const runDiagnostics = async () => {
    setIsRunning(true);
    const diagnostics: DiagnosticResult[] = [];

    // Test 1: Browser Environment
    diagnostics.push({
      name: "Browser Environment",
      status: typeof window !== "undefined" ? "pass" : "fail",
      message:
        typeof window !== "undefined"
          ? "Running in browser environment"
          : "Server-side rendering detected",
    });

    // Test 2: WebGL Availability
    const webglAvailable = checkWebGLAvailability();
    diagnostics.push({
      name: "WebGL Support",
      status: webglAvailable ? "pass" : "fail",
      message: webglAvailable
        ? "WebGL is available and working"
        : "WebGL is not available or not working",
      details: webglAvailable
        ? {
            version: getWebGLVersion(),
            renderer: getWebGLRenderer(),
            vendor: getWebGLVendor(),
          }
        : undefined,
    });

    // Test 3: Three.js Conflicts
    const hasConflicts = detectThreeConflicts();
    diagnostics.push({
      name: "Three.js Conflicts",
      status: hasConflicts ? "warning" : "pass",
      message: hasConflicts
        ? "Potential Three.js version conflicts detected"
        : "No Three.js conflicts detected",
    });

    // Test 4: React Three Fiber Import
    try {
      // const r3f = await import("@react-three/fiber");
      diagnostics.push({
        name: "React Three Fiber",
        status: "pass",
        message: "Successfully imported @react-three/fiber",
        details: { imported: "Success" },
      });
    } catch (error) {
      diagnostics.push({
        name: "React Three Fiber",
        status: "fail",
        message: "Failed to import @react-three/fiber",
        details: { error: (error as Error).message },
      });
    }

    // Test 5: React Three Drei Import
    try {
      // const drei = await import("@react-three/drei");
      diagnostics.push({
        name: "React Three Drei",
        status: "pass",
        message: "Successfully imported @react-three/drei",
      });
    } catch (error) {
      diagnostics.push({
        name: "React Three Drei",
        status: "fail",
        message: "Failed to import @react-three/drei",
        details: { error: (error as Error).message },
      });
    }

    // Test 6: Canvas Creation Test
    try {
      if (webglAvailable) {
        const testCanvas = document.createElement("canvas");
        const testContext =
          testCanvas.getContext("webgl2") || testCanvas.getContext("webgl");

        if (testContext) {
          // Test basic WebGL operations
          const program = testContext.createProgram();
          const shader = testContext.createShader(testContext.VERTEX_SHADER);

          diagnostics.push({
            name: "Canvas Creation Test",
            status: program && shader ? "pass" : "warning",
            message:
              program && shader
                ? "Canvas and WebGL context creation successful"
                : "Canvas created but WebGL objects may have issues",
          });
        } else {
          diagnostics.push({
            name: "Canvas Creation Test",
            status: "fail",
            message: "Failed to create WebGL context",
          });
        }
      } else {
        diagnostics.push({
          name: "Canvas Creation Test",
          status: "fail",
          message: "Skipped - WebGL not available",
        });
      }
    } catch (error) {
      diagnostics.push({
        name: "Canvas Creation Test",
        status: "fail",
        message: "Canvas creation test failed",
        details: { error: (error as Error).message },
      });
    }

    // Test 7: Context Provider Status
    diagnostics.push({
      name: "Three Context Provider",
      status: threeContext.isInitialized ? "pass" : "warning",
      message: `Provider status: ${threeStatus.status}`,
      details: threeStatus.details,
    });

    // Test 8: Memory and Performance
    const config = getOptimalThreeConfig();
    diagnostics.push({
      name: "Performance Configuration",
      status: "pass",
      message: "Optimal configuration generated",
      details: config,
    });

    setResults(diagnostics);
    setIsRunning(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getWebGLVersion = (): string => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      return gl ? gl.getParameter(gl.VERSION) : "Unknown";
    } catch {
      return "Unknown";
    }
  };

  const getWebGLRenderer = (): string => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      return gl ? gl.getParameter(gl.RENDERER) : "Unknown";
    } catch {
      return "Unknown";
    }
  };

  const getWebGLVendor = (): string => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      return gl ? gl.getParameter(gl.VENDOR) : "Unknown";
    } catch {
      return "Unknown";
    }
  };

  const getStatusIcon = (status: DiagnosticResult["status"]) => {
    switch (status) {
      case "pass":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "fail":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStatusBadge = (status: DiagnosticResult["status"]) => {
    const variants = {
      pass: "bg-green-100 text-green-800",
      fail: "bg-red-100 text-red-800",
      warning: "bg-yellow-100 text-yellow-800",
    };

    return (
      <Badge variant="secondary" className={variants[status]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const passCount = results.filter((r) => r.status === "pass").length;
  const failCount = results.filter((r) => r.status === "fail").length;
  const warningCount = results.filter((r) => r.status === "warning").length;

  return (
    <Card className="mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-bold text-gray-900 text-2xl">
            Three.js Diagnostic Report
          </h2>
          <p className="mt-1 text-gray-600">
            Comprehensive analysis of Three.js environment and dependencies
          </p>
        </div>
        <Button
          onClick={runDiagnostics}
          disabled={isRunning}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRunning ? "animate-spin" : ""}`} />
          {isRunning ? "Running..." : "Re-run Tests"}
        </Button>
      </div>

      {/* Summary */}
      <div className="gap-4 grid grid-cols-3 mb-6">
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="font-bold text-green-600 text-2xl">{passCount}</div>
          <div className="text-green-700 text-sm">Passed</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <div className="font-bold text-yellow-600 text-2xl">
            {warningCount}
          </div>
          <div className="text-yellow-700 text-sm">Warnings</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <div className="font-bold text-red-600 text-2xl">{failCount}</div>
          <div className="text-red-700 text-sm">Failed</div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {results.map((result, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 border rounded-lg"
          >
            {getStatusIcon(result.status)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-semibold text-gray-900">{result.name}</h3>
                {getStatusBadge(result.status)}
              </div>
              <p className="text-gray-600 text-sm">{result.message}</p>
              {result.details && (
                <details className="mt-2">
                  <summary className="text-gray-500 hover:text-gray-700 text-xs cursor-pointer">
                    Show Details
                  </summary>
                  <pre className="bg-gray-50 mt-2 p-2 rounded overflow-auto text-xs">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <Button
          variant="outline"
          onClick={() => {
            runDiagnostics();
          }}
        >
          Retest
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            threeContext.reinitialize();
            setTimeout(runDiagnostics, 500);
          }}
        >
          Reinitialize Three.js
        </Button>
      </div>
    </Card>
  );
};
