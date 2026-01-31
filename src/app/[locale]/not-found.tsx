"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/ui/components/button";

export default function NotFound() {
  const t = useTranslations("errors");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">{t("notFound")}</p>
      <Link href="/dashboard">
        <Button>{t("backHome")}</Button>
      </Link>
    </div>
  );
}
