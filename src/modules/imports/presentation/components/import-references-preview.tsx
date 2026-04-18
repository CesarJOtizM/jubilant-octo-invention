"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/ui/components/card";
import {
  Check,
  Plus,
  RefreshCcw,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/ui/lib/utils";
import type {
  ImportReferenceDuplicateGroup,
  ImportReferenceSummary,
} from "@/modules/imports/domain/entities";

const MAX_CHIPS_COLLAPSED = 8;

interface ImportReferencesPreviewProps {
  references: ImportReferenceSummary;
  /**
   * True when the file has no brand/category mentions at all.
   * Handled here to offer an explicit "no references" message so the
   * parent step stays tidy.
   */
  hasReferences: boolean;
  hasPossibleDuplicates: boolean;
}

export function ImportReferencesPreview({
  references,
  hasReferences,
  hasPossibleDuplicates,
}: ImportReferencesPreviewProps) {
  const t = useTranslations("imports.references");

  // Nothing touched — show a calm, positive confirmation.
  if (!hasReferences && !hasPossibleDuplicates) {
    return (
      <Card className="border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/60 dark:bg-emerald-950/20">
        <CardContent className="flex items-start gap-3 p-4">
          <div className="rounded-lg bg-emerald-500 p-1.5 text-white shadow-sm">
            <Sparkles className="h-4 w-4" aria-hidden />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
              {t("cleanTitle")}
            </p>
            <p className="mt-0.5 text-xs text-emerald-800/80 dark:text-emerald-200/70">
              {t("cleanDescription")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-50">
            <RefreshCcw className="h-4 w-4 text-neutral-400" aria-hidden />
            {t("title")}
          </h4>
          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
            {t("description")}
          </p>
        </div>

        {/* Brand and category creation summary */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {references.newBrandsToCreate.length > 0 && (
            <NewReferencesBlock
              tone="emerald"
              title={t("newBrandsTitle", {
                count: references.newBrandsToCreate.length,
              })}
              names={references.newBrandsToCreate}
            />
          )}
          {references.newCategoriesToCreate.length > 0 && (
            <NewReferencesBlock
              tone="sky"
              title={t("newCategoriesTitle", {
                count: references.newCategoriesToCreate.length,
              })}
              names={references.newCategoriesToCreate}
            />
          )}

          {/* Reused references are informational — render compactly. */}
          {references.existingBrandsReferenced.length > 0 && (
            <ReusedReferencesBlock
              title={t("existingBrands", {
                count: references.existingBrandsReferenced.length,
              })}
              names={references.existingBrandsReferenced}
            />
          )}
          {references.existingCategoriesReferenced.length > 0 && (
            <ReusedReferencesBlock
              title={t("existingCategories", {
                count: references.existingCategoriesReferenced.length,
              })}
              names={references.existingCategoriesReferenced}
            />
          )}
        </div>

        {/* Possible duplicates — amber, always visible, cannot be missed */}
        {references.possibleBrandDuplicates.length > 0 && (
          <DuplicatesBlock
            title={t("duplicatesBrandTitle")}
            groups={references.possibleBrandDuplicates}
            explain={t("duplicatesExplain")}
          />
        )}
        {references.possibleCategoryDuplicates.length > 0 && (
          <DuplicatesBlock
            title={t("duplicatesCategoryTitle")}
            groups={references.possibleCategoryDuplicates}
            explain={t("duplicatesExplain")}
          />
        )}
      </CardContent>
    </Card>
  );
}

interface NewReferencesBlockProps {
  tone: "emerald" | "sky";
  title: string;
  names: readonly string[];
}

function NewReferencesBlock({ tone, title, names }: NewReferencesBlockProps) {
  const t = useTranslations("imports.references");
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? names : names.slice(0, MAX_CHIPS_COLLAPSED);
  const hiddenCount = names.length - visible.length;

  return (
    <div
      className={cn(
        "rounded-lg border p-3",
        tone === "emerald" &&
          "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/20",
        tone === "sky" &&
          "border-sky-200 bg-sky-50/50 dark:border-sky-900/60 dark:bg-sky-950/20",
      )}
    >
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "rounded-md p-1",
            tone === "emerald"
              ? "bg-emerald-500 text-white"
              : "bg-sky-500 text-white",
          )}
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
        </div>
        <p
          className={cn(
            "text-xs font-semibold",
            tone === "emerald"
              ? "text-emerald-900 dark:text-emerald-200"
              : "text-sky-900 dark:text-sky-200",
          )}
        >
          {title}
        </p>
      </div>
      <motion.ul layout className="mt-2 flex flex-wrap gap-1">
        {visible.map((name) => (
          <li key={name}>
            <span
              className={cn(
                "inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-medium",
                tone === "emerald"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-100"
                  : "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-100",
              )}
            >
              {name}
            </span>
          </li>
        ))}
      </motion.ul>
      {names.length > MAX_CHIPS_COLLAPSED && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-[11px] font-medium text-neutral-600 underline-offset-2 hover:underline dark:text-neutral-400"
        >
          {expanded ? t("showLess") : t("showMore", { count: hiddenCount })}
        </button>
      )}
    </div>
  );
}

interface ReusedReferencesBlockProps {
  title: string;
  names: readonly string[];
}

function ReusedReferencesBlock({ title, names }: ReusedReferencesBlockProps) {
  const [expanded, setExpanded] = useState(false);
  const t = useTranslations("imports.references");
  const visible = expanded ? names : names.slice(0, MAX_CHIPS_COLLAPSED);
  const hiddenCount = names.length - visible.length;

  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50/40 p-3 dark:border-neutral-800 dark:bg-neutral-900/40">
      <div className="flex items-center gap-2">
        <div className="rounded-md bg-neutral-500 p-1 text-white">
          <Check className="h-3.5 w-3.5" aria-hidden />
        </div>
        <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
          {title}
        </p>
      </div>
      <ul className="mt-2 flex flex-wrap gap-1">
        {visible.map((name) => (
          <li key={name}>
            <span className="inline-flex items-center rounded-md bg-white px-1.5 py-0.5 text-[11px] font-medium text-neutral-700 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:text-neutral-200 dark:ring-neutral-700">
              {name}
            </span>
          </li>
        ))}
      </ul>
      {names.length > MAX_CHIPS_COLLAPSED && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-[11px] font-medium text-neutral-600 underline-offset-2 hover:underline dark:text-neutral-400"
        >
          {expanded ? t("showLess") : t("showMore", { count: hiddenCount })}
        </button>
      )}
    </div>
  );
}

interface DuplicatesBlockProps {
  title: string;
  explain: string;
  groups: readonly ImportReferenceDuplicateGroup[];
}

function DuplicatesBlock({ title, explain, groups }: DuplicatesBlockProps) {
  const t = useTranslations("imports.references");

  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50/60 p-3 dark:border-amber-700/60 dark:bg-amber-950/30">
      <div className="flex items-start gap-2">
        <div className="rounded-md bg-amber-500 p-1 text-white">
          <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-amber-900 dark:text-amber-100">
            {title}
          </p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-amber-800/80 dark:text-amber-200/70">
            {explain}
          </p>
        </div>
      </div>
      <ul className="mt-2 space-y-1">
        {groups.map((group) => (
          <li
            key={group.canonical}
            className="rounded-md bg-white/60 px-2 py-1 text-[11px] text-amber-900 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-100 dark:ring-amber-900/60"
          >
            {t("duplicatesVariant", {
              canonical: group.canonical,
              variants: group.variants.join(" · "),
            })}
          </li>
        ))}
      </ul>
    </div>
  );
}
