"use client";

import React, { useState } from "react";
import svgPaths from "../imports/svg-v4vk5tlnq6";
import { usePathname, useRouter } from "next/navigation";

// Logout Icon
function LogoutIcon() {
  return (
    <div className="relative size-full" data-name="Icon">
      <div
        className="absolute inset-[12.5%_8.33%_12.5%_12.5%]"
        data-name="Icon"
      >
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 18 17"
        >
          <g id="Icon">
            <path
              clipRule="evenodd"
              d={svgPaths.p1a473f00}
              fill="currentColor"
              fillRule="evenodd"
            />
            <path d={svgPaths.p1dad1c80} fill="currentColor" />
          </g>
        </svg>
      </div>
    </div>
  );
}

// Navigation Icons
function SettingsIcon() {
  return (
    <div className="relative size-full" data-name="Icon">
      <div className="absolute inset-[12.5%_16.67%]" data-name="Icon">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 15 17"
        >
          <path d={svgPaths.p1989d100} fill="currentColor" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function MapIcon() {
  return (
    <div className="relative size-full" data-name="Icon">
      <div className="absolute inset-[12.5%_8.33%]" data-name="Icon">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 19 17"
        >
          <path d={svgPaths.p3162aa00} fill="currentColor" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

// Cloud Icon
function CloudIcon() {
  return (
    <div className="relative size-full" data-name="Icon">
      <div
        className="absolute inset-[8.33%_8.33%_12.5%_8.33%]"
        data-name="Icon"
      >
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 19 18"
        >
          <path d={svgPaths.p38e6dd00} fill="currentColor" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

// Analytics Icon
function AnalyticsIcon() {
  return (
    <div className="relative size-full" data-name="Icon">
      <div className="absolute inset-[12.5%]" data-name="Icon">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 17 17"
        >
          <path d={svgPaths.p16f64900} fill="currentColor" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

// Calendar Icon
function CalendarIcon() {
  return (
    <div className="relative size-full" data-name="Icon">
      <div
        className="absolute inset-[8.33%_12.5%_12.5%_12.5%]"
        data-name="Icon"
      >
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 17 18"
        >
          <path d={svgPaths.p250e6800} fill="currentColor" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

// Profile Icon
function ProfileIcon() {
  return (
    <div className="relative size-full" data-name="Icon">
      <div className="absolute inset-[8.33%_12.5%]" data-name="Icon">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 17 19"
        >
          <path d={svgPaths.p233fc380} fill="currentColor" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

// Dashboard Icon (Active by default)
function DashboardIcon() {
  return (
    <div className="relative size-full" data-name="Icon">
      <div className="absolute inset-[12.5%]" data-name="Icon">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 17 17"
        >
          <path d={svgPaths.p2bbf1f10} fill="currentColor" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

// Logo Component
function Logo() {
  return (
    <div className="flex justify-center items-center w-full h-[60px]">
      <div className="w-6 h-7">
        <svg
          className="block size-full text-gray-500"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 24 26"
        >
          <g id="Logo">
            <path d={svgPaths.p299f5d00} fill="white" id="Vector" />
            <path d={svgPaths.p551ac00} fill="white" id="Vector_2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

// Traffic Light Dots
function TrafficLights() {
  return (
    <div className="flex justify-center items-center w-full h-[40px]">
      <div className="flex space-x-2">
        <div className="bg-white rounded-full w-1.5 h-1.5"></div>
        <div className="bg-white opacity-40 rounded-full w-1.5 h-1.5"></div>
        <div className="bg-white opacity-20 rounded-full w-1.5 h-1.5"></div>
      </div>
    </div>
  );
}

// Navigation Item Component
interface NavItemProps {
  icon: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
  tooltip?: string;
}

function NavItem({ icon, isActive = false, onClick, tooltip }: NavItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`
        relative flex items-center justify-center w-full h-12 cursor-pointer
        transition-all duration-200 ease-in-out
        ${isActive ? "bg-white bg-opacity-10 rounded-xl" : ""}
        ${isHovered && !isActive ? "bg-white bg-opacity-5 rounded-xl" : ""}
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={tooltip}
    >
      <div
        className={`
        w-[22px] h-[22px] transition-all duration-200 hover:text-gray-500
        ${isActive ? "text-gray-500" : "text-gray-500 opacity-50"}
        ${isHovered && !isActive ? "text-gray-500 opacity-70" : ""}
      `}
      >
        {icon}
      </div>
    </div>
  );
}

const navigationItems = [
  {
    id: "dashboard",
    icon: <DashboardIcon />,
    tooltip: "Dashboard",
    link: "/",
  },
  {
    id: "profile",
    icon: <ProfileIcon />,
    tooltip: "Profile",
    link: "/profile",
  },
  {
    id: "calendar",
    icon: <CalendarIcon />,
    tooltip: "Calendar",
    link: "/calendar",
  },
  {
    id: "analytics",
    icon: <AnalyticsIcon />,
    tooltip: "Analytics",
    link: "/analytics",
  },
  {
    id: "cloud",
    icon: <CloudIcon />,
    tooltip: "Cloud Storage",
    link: "/cloud",
  },
  { id: "map", icon: <MapIcon />, tooltip: "Map", link: "/map" },
  {
    id: "settings",
    icon: <SettingsIcon />,
    tooltip: "Settings",
    link: "/settings",
  },
];

export function MainSidebar() {
  // const [activeItem, setActiveItem] = useState("dashboard");
  const pathName = usePathname();
  const route = useRouter();

  return (
    <div className="relative flex flex-col bg-[#1c1d22] w-[90px] h-screen">
      {/* Traffic Light Dots */}
      <div className="pt-6">
        <TrafficLights />
      </div>

      {/* Logo */}
      <div className="mt-2">
        <Logo />
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col flex-1 justify-start space-y-2 px-4 pt-8">
        {navigationItems.map((item) => {
          console.log(
            "pathName.includes(item.id) || pathName === '/'",
            pathName.includes(item.id) || pathName === "/"
          );

          console.log("pathName === '/'", pathName === "/");
          console.log("pathName.includes(item.id)", pathName.includes(item.id));
          console.log("pathName", pathName);
          console.log("item.id", item.id);

          return (
            <NavItem
              key={item.id}
              icon={item.icon}
              isActive={
                pathName.startsWith(`/${item.id}`) ||
                (pathName === "/" && item.id === "dashboard")
              }
              // isActive={activeItem === item.id}
              onClick={() => route.push(item.link)}
              tooltip={item.tooltip}
            />
          );
        })}
      </div>

      {/* Logout Button */}
      <div className="px-4 pb-6">
        <NavItem
          icon={<LogoutIcon />}
          onClick={() => console.log("Logout clicked")}
          tooltip="Logout"
        />
      </div>
    </div>
  );
}
