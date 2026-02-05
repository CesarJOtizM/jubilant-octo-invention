"use client";

import { useTranslations } from "next-intl";
import { ArrowDownCircle, ArrowUpCircle, RefreshCw } from "lucide-react";
import { Badge } from "@/ui/components/badge";
import type { MovementType } from "../../../domain/entities/stock-movement.entity";

interface MovementTypeBadgeProps {
  type: MovementType;
}

export function MovementTypeBadge({ type }: MovementTypeBadgeProps) {
  const t = useTranslations("inventory.movements.types");

  const config = {
    IN: {
      label: t("in"),
      variant: "success" as const,
      icon: ArrowDownCircle,
    },
    OUT: {
      label: t("out"),
      variant: "error" as const,
      icon: ArrowUpCircle,
    },
    ADJUSTMENT: {
      label: t("adjustment"),
      variant: "warning" as const,
      icon: RefreshCw,
    },
  };

  const { label, variant, icon: Icon } = config[type];

  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}
