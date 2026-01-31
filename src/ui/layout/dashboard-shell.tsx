"use client";

import type { ReactNode } from "react";
import { cn } from "@/ui/lib/utils";

interface DashboardShellProps {
  children: ReactNode;
  className?: string;
}

export function DashboardShell({ children, className }: DashboardShellProps) {
  return <div className={cn("flex min-h-screen", className)}>{children}</div>;
}
