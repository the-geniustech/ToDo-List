"use client";

import React from "react";
import { useTheme } from "./ThemeProvider";
import { LightModeIcon, DarkModeIcon } from "./ThemeIcons";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="mb-6 px-4 w-full">
      {/* Theme Toggle Container */}
      <div
        className="relative bg-white bg-opacity-[0.04] p-1 rounded-[22px] h-[42px] overflow-hidden"
        role="radiogroup"
        aria-label="Theme selection"
      >
        {/* Background Slider */}
        <div
          className={`
            absolute top-1 bottom-1 w-[127px] bg-white bg-opacity-[0.06] rounded-[18px]
            shadow-[0px_8px_6px_0px_rgba(28,29,34,0.16)] transition-all duration-300 ease-out
            ${
              resolvedTheme === "dark" ? "translate-x-[127px]" : "translate-x-0"
            }
          `}
        />

        {/* Light Mode Option */}
        <button
          onClick={() => setTheme("light")}
          className={`
            absolute left-1 top-1 bottom-1 w-[127px] rounded-[18px] flex items-center justify-center gap-2
            transition-all duration-200 ease-out z-10
            ${
              resolvedTheme === "light"
                ? "text-white"
                : "text-white text-opacity-50"
            }
            hover:text-white hover:text-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-20
          `}
          role="radio"
          aria-checked={resolvedTheme === "light"}
          aria-label="Switch to light mode"
        >
          <div className="w-5 h-5 text-gray-500">
            <LightModeIcon />
          </div>
          <span className="font-['Exo_2:SemiBold',_sans-serif] font-semibold text-[14px] text-gray-500 leading-none">
            Light
          </span>
        </button>

        {/* Dark Mode Option */}
        <button
          onClick={() => setTheme("dark")}
          className={`
            absolute right-1 top-1 bottom-1 w-[127px] rounded-[18px] flex items-center justify-center gap-2
            transition-all duration-200 ease-out z-10
            ${
              resolvedTheme === "dark"
                ? "text-white"
                : "text-white text-opacity-50"
            }
            hover:text-white hover:text-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-20
          `}
          role="radio"
          aria-checked={resolvedTheme === "dark"}
          aria-label="Switch to dark mode"
        >
          <div className="w-5 h-5 text-gray-500">
            <DarkModeIcon />
          </div>
          <span className="font-['Exo_2:SemiBold',_sans-serif] font-semibold text-[14px] text-gray-500 leading-none">
            Dark
          </span>
        </button>
      </div>
    </div>
  );
}
