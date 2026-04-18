"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/ui/components/card";
import type { TemplateFormat } from "@/modules/imports/application/dto/import.dto";
import type { ImportTypeSchema } from "@/modules/imports/domain/entities";
import { ImportTypeCard } from "./import-type-card";

interface ImportTypeGridProps {
  schemas: ImportTypeSchema[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onImport: (type: string) => void;
  onDownloadTemplate: (type: string, format: TemplateFormat) => void;
  isDownloading?: boolean;
}

export function ImportTypeGrid({
  schemas,
  isLoading,
  isError,
  onImport,
  onDownloadTemplate,
  isDownloading,
}: ImportTypeGridProps) {
  const t = useTranslations("imports.catalog");

  if (isLoading) {
    return <CatalogState icon={Loader2} title={t("loadingTitle")} spinning />;
  }

  if (isError) {
    return (
      <CatalogState
        icon={AlertCircle}
        title={t("loadFailedTitle")}
        description={t("loadFailedDescription")}
        tone="error"
      />
    );
  }

  if (!schemas || schemas.length === 0) {
    return (
      <CatalogState
        icon={Inbox}
        title={t("emptyTitle")}
        description={t("emptyDescription")}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {schemas.map((schema, index) => (
        <motion.div
          key={schema.type}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04, duration: 0.25 }}
        >
          <ImportTypeCard
            schema={schema}
            onImport={onImport}
            onDownloadTemplate={onDownloadTemplate}
            isDownloading={isDownloading}
          />
        </motion.div>
      ))}
    </div>
  );
}

interface CatalogStateProps {
  icon: React.ElementType;
  title: string;
  description?: string;
  spinning?: boolean;
  tone?: "default" | "error";
}

function CatalogState({
  icon: Icon,
  title,
  description,
  spinning,
  tone = "default",
}: CatalogStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <div
          className={
            tone === "error"
              ? "rounded-full bg-rose-50 p-3 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300"
              : "rounded-full bg-neutral-100 p-3 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
          }
        >
          <Icon
            className={spinning ? "h-6 w-6 animate-spin" : "h-6 w-6"}
            aria-hidden
          />
        </div>
        <div>
          <p className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
            {title}
          </p>
          {description && (
            <p className="mt-1 max-w-md text-sm text-neutral-500 dark:text-neutral-400">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
