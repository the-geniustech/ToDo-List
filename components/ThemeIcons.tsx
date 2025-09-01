'use client';

import React from 'react';
import svgPaths from "../imports/svg-duqbjpfp2y";

// Light Mode Icon (Sun)
export function LightModeIcon({ className = "", ...props }) {
  return (
    <div className={`relative size-full ${className}`} {...props}>
      <div className="absolute inset-[8.333%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
          <path d={svgPaths.p3eb95930} fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}

// Dark Mode Icon (Moon)
export function DarkModeIcon({ className = "", ...props }) {
  return (
    <div className={`relative size-full ${className}`} {...props}>
      <div className="absolute inset-[12.5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
          <path d={svgPaths.p39eaed80} fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}