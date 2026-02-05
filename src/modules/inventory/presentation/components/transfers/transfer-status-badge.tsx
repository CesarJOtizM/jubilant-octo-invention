"use client";

import { useTranslations } from "next-intl";
import { Clock, Truck, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/ui/components/badge";
import type { TransferStatus } from "../../../domain/entities/transfer.entity";

interface TransferStatusBadgeProps {
  status: TransferStatus;
}

export function TransferStatusBadge({ status }: TransferStatusBadgeProps) {
  const t = useTranslations("inventory.transfers.status");

  const config = {
    PENDING: {
      label: t("pending"),
      variant: "warning" as const,
      icon: Clock,
    },
    IN_TRANSIT: {
      label: t("in_transit"),
      variant: "info" as const,
      icon: Truck,
    },
    COMPLETED: {
      label: t("completed"),
      variant: "success" as const,
      icon: CheckCircle2,
    },
    CANCELLED: {
      label: t("cancelled"),
      variant: "error" as const,
      icon: XCircle,
    },
  };

  const { label, variant, icon: Icon } = config[status];

  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}
