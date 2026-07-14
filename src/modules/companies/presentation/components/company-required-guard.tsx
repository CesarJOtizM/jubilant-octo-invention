"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/components/card";
import { useCompanyStore } from "@/modules/companies/infrastructure/store/company.store";

interface CompanyRequiredGuardProps {
  children: ReactNode;
  /** When false, skip the guard (e.g. edit flows). Defaults to true. */
  active?: boolean;
}

/**
 * Fail-closed wrapper for create flows that require a specific company.
 * When the global selector is "All" (null), shows guidance and disables the form.
 */
export function CompanyRequiredGuard({
  children,
  active = true,
}: CompanyRequiredGuardProps) {
  const t = useTranslations("inventory.companies");
  const selectedCompanyId = useCompanyStore((s) => s.selectedCompanyId);
  const isCompanySelected = selectedCompanyId !== null;

  if (!active) {
    return <>{children}</>;
  }

  return (
    <div className="space-y-4">
      {!isCompanySelected && (
        <Card
          role="alert"
          className="border-warning/50 bg-warning/5 dark:border-warning/40"
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-warning">
              <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden />
              {t("requiredCompany.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t("requiredCompany.description")}
            </p>
          </CardContent>
        </Card>
      )}
      <fieldset
        disabled={!isCompanySelected}
        className="min-w-0 border-0 p-0 disabled:opacity-60"
      >
        {children}
      </fieldset>
    </div>
  );
}
