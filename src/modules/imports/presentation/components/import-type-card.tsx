"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/ui/components/button";
import { Card, CardContent } from "@/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/components/dropdown-menu";
import {
  Package,
  ArrowRightLeft,
  Warehouse,
  BarChart3,
  Repeat,
  ShoppingCart,
  Download,
  Upload,
  ChevronDown,
  Database,
  Asterisk,
  Wand2,
} from "lucide-react";
import { cn } from "@/ui/lib/utils";
import type { TemplateFormat } from "@/modules/imports/application/dto/import.dto";
import {
  type ImportTypeSchema,
  ImportTypeSchemaUtils,
} from "@/modules/imports/domain/entities";

/**
 * Icon picked for each known type. Unknown types (new ones registered
 * on the backend) fall back to a neutral Database glyph — the wizard
 * still works, the UI just doesn't have a themed icon yet.
 */
const TYPE_ICON_MAP: Record<string, React.ElementType> = {
  PRODUCTS: Package,
  MOVEMENTS: ArrowRightLeft,
  WAREHOUSES: Warehouse,
  STOCK: BarChart3,
  TRANSFERS: Repeat,
  SALES: ShoppingCart,
};

interface ImportTypeCardProps {
  schema: ImportTypeSchema;
  onImport: (type: string) => void;
  onDownloadTemplate: (type: string, format: TemplateFormat) => void;
  isDownloading?: boolean;
}

export function ImportTypeCard({
  schema,
  onImport,
  onDownloadTemplate,
  isDownloading,
}: ImportTypeCardProps) {
  const t = useTranslations("imports");
  const tCatalog = useTranslations("imports.catalog");
  const [showSchema, setShowSchema] = useState(false);

  const Icon = TYPE_ICON_MAP[schema.type] ?? Database;
  const requiredCount = ImportTypeSchemaUtils.requiredColumnCount(schema);
  const optionalCount = ImportTypeSchemaUtils.optionalColumnCount(schema);
  const enumCount = ImportTypeSchemaUtils.enumColumnCount(schema);
  const hasMultiple = ImportTypeSchemaUtils.hasMultipleValueColumn(schema);

  return (
    <Card className="group relative flex h-full flex-col border-neutral-200 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md dark:border-neutral-800 dark:hover:border-primary-800">
      <CardContent className="flex flex-1 flex-col gap-4 p-5">
        {/* Header: icon + title + description */}
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary-50 p-2.5 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white dark:bg-primary-950/60 dark:text-primary-400">
            <Icon className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
              {schema.displayName}
            </h3>
            <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
              {schema.description}
            </p>
          </div>
        </div>

        {/* Metadata chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <MetaChip icon={Database}>
            {tCatalog("columns", { count: schema.columns.length })}
          </MetaChip>
          <MetaChip icon={Asterisk} tone="required">
            {tCatalog("required", { count: requiredCount })}
          </MetaChip>
          {enumCount > 0 && (
            <MetaChip icon={Wand2} tone="info">
              {tCatalog("enumHint", { count: enumCount })}
            </MetaChip>
          )}
          {hasMultiple && (
            <span
              title={tCatalog("multipleHint")}
              className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-800 dark:bg-amber-950/60 dark:text-amber-200"
            >
              |
            </span>
          )}
        </div>

        {/* Column details (collapsible) */}
        <button
          type="button"
          onClick={() => setShowSchema((v) => !v)}
          aria-expanded={showSchema}
          className="inline-flex w-fit items-center gap-1 text-xs font-medium text-neutral-600 transition-colors hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400"
        >
          {showSchema ? tCatalog("hideSchema") : tCatalog("viewSchema")}
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform",
              showSchema && "rotate-180",
            )}
            aria-hidden
          />
        </button>

        <AnimatePresence initial={false}>
          {showSchema && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-wrap gap-1.5 overflow-hidden"
            >
              {schema.columns.map((col) => (
                <li key={col.canonicalName}>
                  <span
                    title={col.description}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px]",
                      col.required
                        ? "border-primary-200 bg-primary-50 text-primary-800 dark:border-primary-900 dark:bg-primary-950/40 dark:text-primary-200"
                        : "border-neutral-200 bg-neutral-50 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300",
                    )}
                  >
                    {col.displayName}
                    {col.required && (
                      <span
                        aria-hidden
                        className="text-primary-600 dark:text-primary-400"
                      >
                        *
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="mt-auto flex items-stretch gap-2 pt-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isDownloading}
                className="flex-1 text-xs"
              >
                <Download className="mr-1.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                <span className="truncate">{t("template.title")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => onDownloadTemplate(schema.type, "xlsx")}
              >
                {t("template.xlsx")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDownloadTemplate(schema.type, "csv")}
              >
                {t("template.csv")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            size="sm"
            onClick={() => onImport(schema.type)}
            className="flex-1 text-xs"
          >
            <Upload className="mr-1.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            <span>{t("startImport")}</span>
          </Button>
        </div>

        <p className="sr-only">{optionalCount} optional columns</p>
      </CardContent>
    </Card>
  );
}

interface MetaChipProps {
  icon: React.ElementType;
  tone?: "default" | "required" | "info";
  children: React.ReactNode;
}

function MetaChip({ icon: Icon, tone = "default", children }: MetaChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        tone === "default" &&
          "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
        tone === "required" &&
          "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300",
        tone === "info" &&
          "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300",
      )}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {children}
    </span>
  );
}
