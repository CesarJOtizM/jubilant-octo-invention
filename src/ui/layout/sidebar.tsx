"use client";

import type { ReactNode } from "react";
import { cn } from "@/ui/lib/utils";

interface SidebarProps {
  children?: ReactNode;
  className?: string;
}

export function Sidebar({ children, className }: SidebarProps) {
  return (
    <aside className={cn("hidden w-64 border-r bg-card lg:block", className)}>
      {children}
    </aside>
  );
}
