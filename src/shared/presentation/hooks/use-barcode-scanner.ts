"use client";

import { useEffect, useRef, useCallback } from "react";

interface UseBarcodeScannerProps {
  enabled: boolean;
  onScan: (barcode: string) => void;
}

const MAX_KEY_INTERVAL_MS = 80;
const MIN_BARCODE_LENGTH = 3;

/**
 * Detects keystrokes coming from HID barcode scanners (USB/Bluetooth).
 *
 * A hardware scanner "types" characters very quickly (sub-80ms between keys)
 * and ends with Enter. This hook buffers those keystrokes and fires `onScan`
 * with the assembled barcode. Human typing is ignored because it's too slow.
 *
 * Works on any platform (mobile or desktop) and is independent of the
 * camera-based scanner (`useCameraScanner`). Both can be active at the same
 * time.
 */
export function useBarcodeScanner({ enabled, onScan }: UseBarcodeScannerProps) {
  const bufferRef = useRef("");
  const lastKeyTimeRef = useRef(0);

  const resetBuffer = useCallback(() => {
    bufferRef.current = "";
  }, []);

  useEffect(() => {
    if (!enabled) {
      resetBuffer();
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea (except our dedicated scan input)
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT"
      ) {
        // Allow scan inputs marked with data-scan-input
        if (!target.hasAttribute("data-scan-input")) {
          return;
        }
      }

      const now = Date.now();

      if (e.key === "Enter") {
        if (bufferRef.current.length >= MIN_BARCODE_LENGTH) {
          e.preventDefault();
          e.stopImmediatePropagation();
          onScan(bufferRef.current);
        }
        resetBuffer();
        return;
      }

      // Only buffer single printable characters
      if (e.key.length !== 1) return;

      const elapsed = now - lastKeyTimeRef.current;

      if (elapsed > MAX_KEY_INTERVAL_MS && bufferRef.current.length > 0) {
        // Too slow — reset buffer (likely human typing)
        resetBuffer();
      }

      bufferRef.current += e.key;
      lastKeyTimeRef.current = now;
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      resetBuffer();
    };
  }, [enabled, onScan, resetBuffer]);
}
