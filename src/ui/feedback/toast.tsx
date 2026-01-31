"use client";

import { cn } from "@/ui/lib/utils";

interface ToastProps {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
  className?: string;
}

export function Toast({
  title,
  description,
  variant = "default",
  className,
}: ToastProps) {
  return (
    <div
      className={cn(
        "pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5",
        variant === "destructive"
          ? "bg-destructive text-destructive-foreground"
          : "bg-background",
        className,
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium">{title}</p>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
