"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Building2,
  Warehouse,
  Tags,
  Layers,
  Package,
  BarChart3,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/ui/lib/utils";
import { Card } from "@/ui/components/card";

/**
 * Recommended onboarding order for a brand-new organization. Each step
 * points at a backend import type identifier (or `null` for steps that
 * are not yet implemented but documented here so the flow makes sense).
 */
interface OnboardingStep {
  readonly key:
    | "companies"
    | "warehouses"
    | "brands"
    | "categories"
    | "products"
    | "stock";
  readonly importType: string | null;
  readonly icon: React.ElementType;
  readonly dependsOn: ReadonlyArray<OnboardingStep["key"]>;
}

const ONBOARDING_STEPS: readonly OnboardingStep[] = [
  {
    key: "companies",
    importType: null,
    icon: Building2,
    dependsOn: [],
  },
  {
    key: "warehouses",
    importType: "WAREHOUSES",
    icon: Warehouse,
    dependsOn: [],
  },
  {
    key: "brands",
    importType: null,
    icon: Tags,
    dependsOn: [],
  },
  {
    key: "categories",
    importType: null,
    icon: Layers,
    dependsOn: [],
  },
  {
    key: "products",
    importType: "PRODUCTS",
    icon: Package,
    dependsOn: ["warehouses"],
  },
  {
    key: "stock",
    importType: "STOCK",
    icon: BarChart3,
    dependsOn: ["warehouses", "products"],
  },
];

interface GettingStartedGuideProps {
  /**
   * Set of import type identifiers available on the backend. Steps
   * whose importType is in this set render as "Available" and are
   * clickable; the rest render as "Coming soon".
   */
  availableTypes: ReadonlySet<string>;
  onStartImport: (importType: string) => void;
}

export function GettingStartedGuide({
  availableTypes,
  onStartImport,
}: GettingStartedGuideProps) {
  const t = useTranslations("imports.gettingStarted");
  const tSteps = useTranslations("imports.gettingStarted.steps");

  return (
    <Card className="relative overflow-hidden border-primary-100 bg-gradient-to-br from-primary-50/80 via-white to-white dark:border-primary-900/60 dark:from-primary-950/40 dark:via-neutral-950 dark:to-neutral-950">
      {/* Decorative halo — purely presentational */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary-200/40 blur-3xl dark:bg-primary-500/10"
      />

      <div className="relative p-6 md:p-8">
        <div className="mb-6 flex items-start gap-3">
          <div className="rounded-xl bg-primary-600 p-2 text-white shadow-sm dark:bg-primary-500">
            <Sparkles className="h-5 w-5" aria-hidden />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
              {t("title")}
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {t("description")}
            </p>
          </div>
        </div>

        <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ONBOARDING_STEPS.map((step, index) => {
            const isAvailable =
              step.importType !== null && availableTypes.has(step.importType);
            const dependsOnLabels = step.dependsOn
              .map((key) => tSteps(`${key}.title`))
              .join(", ");

            return (
              <motion.li
                key={step.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06, duration: 0.25 }}
              >
                <StepCard
                  index={index + 1}
                  icon={step.icon}
                  title={tSteps(`${step.key}.title`)}
                  summary={tSteps(`${step.key}.summary`)}
                  stepLabel={t("stepLabel", { step: index + 1 })}
                  badge={isAvailable ? t("available") : t("comingSoon")}
                  isAvailable={isAvailable}
                  dependsOn={
                    step.dependsOn.length > 0
                      ? t("dependsOn", { items: dependsOnLabels })
                      : t("dependsOnNone")
                  }
                  onClick={
                    isAvailable && step.importType
                      ? () => onStartImport(step.importType as string)
                      : undefined
                  }
                />
              </motion.li>
            );
          })}
        </ol>
      </div>
    </Card>
  );
}

interface StepCardProps {
  index: number;
  icon: React.ElementType;
  title: string;
  summary: string;
  stepLabel: string;
  badge: string;
  isAvailable: boolean;
  dependsOn: string;
  onClick?: () => void;
}

function StepCard({
  index,
  icon: Icon,
  title,
  summary,
  stepLabel,
  badge,
  isAvailable,
  dependsOn,
  onClick,
}: StepCardProps) {
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      aria-label={onClick ? `${title} — ${stepLabel}` : undefined}
      className={cn(
        "group relative flex h-full w-full flex-col gap-3 rounded-xl border p-4 text-left transition-all duration-200",
        isAvailable
          ? "border-neutral-200 bg-white hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-primary-700"
          : "border-dashed border-neutral-200 bg-neutral-50/60 dark:border-neutral-800 dark:bg-neutral-900/40",
        !onClick && "cursor-default",
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
            isAvailable
              ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200"
              : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              isAvailable ? "bg-green-500" : "bg-neutral-400",
            )}
          />
          {badge}
        </span>
        <span className="text-xs font-medium text-neutral-400">
          {stepLabel}
        </span>
      </div>

      <div className="flex items-start gap-3">
        <div
          className={cn(
            "shrink-0 rounded-lg p-2 transition-colors",
            isAvailable
              ? "bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white dark:bg-primary-950/60 dark:text-primary-400"
              : "bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500",
          )}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
              {index}. {title}
            </span>
            {isAvailable && (
              <ArrowRight
                className="h-4 w-4 shrink-0 translate-x-0 text-neutral-400 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary-600 group-hover:opacity-100"
                aria-hidden
              />
            )}
          </div>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
            {summary}
          </p>
        </div>
      </div>

      <p className="mt-auto text-[11px] text-neutral-400 dark:text-neutral-500">
        {dependsOn}
      </p>
    </Tag>
  );
}
