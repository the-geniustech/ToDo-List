"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "./utils";

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator-root"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full shrink-0",
        className
      )}
      {...props}
    />
  );
}

export { Separator };
