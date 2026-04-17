"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ScanLine, Loader2 } from "lucide-react";
import { Button } from "@/ui/components/button";
import { CameraScannerDialog } from "@/shared/presentation/components/camera-scanner-dialog";
import {
  useCameraAvailable,
  useBarcodeScanner,
} from "@/shared/presentation/hooks";
import { useProductLookupMutation } from "@/modules/inventory/presentation/hooks/use-products";
import type { Product } from "@/modules/inventory/domain/entities/product.entity";

interface ProductScanButtonProps {
  /**
   * Called when a barcode is successfully resolved to a product.
   * The parent decides what to do with it (append line, bump quantity,
   * open detail, etc.) — this component is flow-agnostic.
   */
  onProductScanned: (product: Product) => void;
  /** Disable the whole scanner (e.g. while a form is submitting). */
  disabled?: boolean;
}

/**
 * Generic "scan barcode → resolve product" button for any flow that needs
 * to identify a product by its barcode (sales, movements, returns, etc.).
 *
 * Responsibilities:
 * - Camera-based scanning via a modal dialog, but ONLY when a camera is
 *   actually available (capability-based detection, not viewport-based).
 *   On desktops without a camera, the button is hidden entirely.
 * - HID/physical scanner support (USB/Bluetooth gun) — ALWAYS active
 *   while mounted and not disabled, independent of camera availability.
 * - Product resolution via `useProductLookupMutation` (backend endpoint
 *   that matches by SKU OR barcode).
 * - Delegates side effects (adding to a form, opening detail, etc.) to
 *   the parent via `onProductScanned`. Never mutates external state
 *   directly.
 *
 * Lives in `inventory/presentation/components/shared` because the concept
 * of "lookup a product by code" belongs to the inventory bounded context.
 */
export function ProductScanButton({
  onProductScanned,
  disabled = false,
}: ProductScanButtonProps) {
  const t = useTranslations("inventory.scanner");
  const tScanner = useTranslations("scanner");

  const [cameraOpen, setCameraOpen] = useState(false);
  const cameraStatus = useCameraAvailable();
  const lookup = useProductLookupMutation();

  const resolveAndApply = useCallback(
    async (code: string) => {
      const trimmed = code.trim();
      if (!trimmed) return;

      try {
        const product = await lookup.mutateAsync(trimmed);
        if (!product) {
          toast.error(t("notFound", { code: trimmed }));
          return;
        }
        onProductScanned(product);
        toast.success(t("added", { name: product.name }));
      } catch {
        toast.error(t("lookupError"));
      }
    },
    [lookup, onProductScanned, t],
  );

  // HID/physical scanner: always active while mounted, works on any
  // platform. Must be called BEFORE the early return so it's
  // unconditional (rules of hooks) AND so desktops without a camera
  // still get hardware-gun support.
  useBarcodeScanner({
    enabled: !disabled,
    onScan: resolveAndApply,
  });

  const handleCameraScan = useCallback(
    (barcode: string) => {
      void resolveAndApply(barcode);
    },
    [resolveAndApply],
  );

  // Hide the camera button entirely when no camera is available.
  // HID scanner listener above still works — no UI needed for that.
  if (cameraStatus !== "available") {
    return null;
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled || lookup.isPending}
        onClick={() => setCameraOpen(true)}
        aria-label={tScanner("scanWithCamera")}
      >
        {lookup.isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <ScanLine className="mr-2 h-4 w-4" />
        )}
        {tScanner("scanWithCamera")}
      </Button>

      <CameraScannerDialog
        open={cameraOpen}
        onOpenChange={setCameraOpen}
        onScan={handleCameraScan}
      />
    </>
  );
}
