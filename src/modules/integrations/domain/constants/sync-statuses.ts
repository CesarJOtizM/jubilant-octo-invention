import type { IntegrationProvider } from "@/modules/integrations/domain/entities/integration-connection.entity";

export interface SyncStatusOption {
  value: string;
  safe: boolean;
}

export const VTEX_SYNC_STATUSES: SyncStatusOption[] = [
  { value: "payment-approved", safe: true },
  { value: "ready-for-handling", safe: true },
  { value: "handling", safe: true },
  { value: "invoiced", safe: false },
  { value: "payment-pending", safe: false },
  { value: "canceled", safe: false },
];

// MeLi order statuses — verified against developers.mercadolibre.com.co (MCO, 2026)
// and developers.mercadolibre.com.ar. These are the values accepted by the
// /orders/search?order.status=... filter for local sellers (not Global Selling).
//
// safe=true means "this status represents a real sale we probably want to sync".
// Only `paid` is truly safe. `confirmed` exists but doubles as either a pre-payment
// state OR a seller-cancelled order (see MeLi docs), so it is unsafe by default.
export const MELI_SYNC_STATUSES: SyncStatusOption[] = [
  // The real sale — pretty much always what you want
  { value: "paid", safe: true },
  // Pre-sale states — NOT real sales, do not sync by default
  { value: "confirmed", safe: false },
  { value: "payment_required", safe: false },
  { value: "payment_in_process", safe: false },
  { value: "partially_paid", safe: false },
  // Post-sale states — optional tracking
  { value: "partially_refunded", safe: false },
  { value: "pending_cancel", safe: false },
  { value: "cancelled", safe: false },
];

export function getSyncStatusesForProvider(
  provider: IntegrationProvider,
): SyncStatusOption[] {
  return provider === "VTEX" ? VTEX_SYNC_STATUSES : MELI_SYNC_STATUSES;
}

export function getDefaultSelectedStatuses(
  provider: IntegrationProvider,
): string[] {
  return getSyncStatusesForProvider(provider)
    .filter((s) => s.safe)
    .map((s) => s.value);
}

export function getProviderKey(provider: IntegrationProvider): "vtex" | "meli" {
  return provider === "VTEX" ? "vtex" : "meli";
}
