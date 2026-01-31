"use client";

import type { ReactNode } from "react";
import { cn } from "@/ui/lib/utils";

interface HeaderProps {
  children?: ReactNode;
  className?: string;
}

export function Header({ children, className }: HeaderProps) {
  return (
    <header className={cn("flex h-14 items-center border-b px-4", className)}>
      {children}
    </header>
  );
}
