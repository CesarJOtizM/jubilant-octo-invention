"use client";

import { useTranslations } from "next-intl";
import { Shield, Settings } from "lucide-react";
import { Badge } from "@/ui/components/badge";

interface RoleTypeBadgeProps {
  isSystem: boolean;
}

export function RoleTypeBadge({ isSystem }: RoleTypeBadgeProps) {
  const t = useTranslations("roles.type");

  if (isSystem) {
    return (
      <Badge variant="info" className="gap-1">
        <Shield className="h-3 w-3" />
        {t("system")}
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="gap-1">
      <Settings className="h-3 w-3" />
      {t("custom")}
    </Badge>
  );
}
