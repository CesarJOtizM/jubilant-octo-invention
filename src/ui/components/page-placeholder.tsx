"use client";

import { Construction } from "lucide-react";
import { Card, CardContent } from "@/ui/components/card";

interface PagePlaceholderProps {
  title: string;
  description: string;
}

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {title}
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">{description}</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Construction className="mb-4 h-12 w-12 text-neutral-400 dark:text-neutral-500" />
          <p className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
            Coming Soon
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            This feature is currently under development.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
