"use client";

import type { ReactNode } from "react";
import { cn } from "@/ui/lib/utils";

type FormFieldState = "default" | "error" | "success" | "warning";

interface FormFieldProps {
  children: ReactNode;
  error?: string;
  success?: string;
  warning?: string;
  className?: string;
}

const stateStyles: Record<FormFieldState, string> = {
  default: "",
  error: "text-error-600 dark:text-error-400",
  success: "text-success-600 dark:text-success-400",
  warning: "text-warning-600 dark:text-warning-400",
};

export function FormField({
  children,
  error,
  success,
  warning,
  className,
}: FormFieldProps) {
  const state: FormFieldState = error
    ? "error"
    : success
      ? "success"
      : warning
        ? "warning"
        : "default";

  const message = error || success || warning;

  return (
    <div
      className={cn("space-y-2", className)}
      data-state={state !== "default" ? state : undefined}
    >
      {children}
      {message && (
        <p className={cn("text-sm", stateStyles[state])} role="alert">
          {message}
        </p>
      )}
    </div>
  );
}
