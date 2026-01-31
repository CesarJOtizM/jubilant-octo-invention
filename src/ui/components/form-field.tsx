'use client';

import type { ReactNode } from 'react';
import { cn } from '@/ui/lib/utils';

interface FormFieldProps {
  children: ReactNode;
  error?: string;
  className?: string;
}

export function FormField({ children, error, className }: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {children}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
