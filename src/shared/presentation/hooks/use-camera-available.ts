"use client";

import { useEffect, useState } from "react";

type CameraAvailability = "unknown" | "available" | "unavailable";

/**
 * Capability-based detection of a usable camera.
 *
 * Uses `navigator.mediaDevices.enumerateDevices()` to check if any
 * `videoinput` device is present. This is the source of truth — NOT
 * viewport size — so it works correctly on tablets, on desktop Chromebooks
 * with cameras, and correctly hides scanner UI on desktops without one.
 *
 * Returns "unknown" during the initial async check so consumers can avoid
 * rendering the button in the wrong state on first paint.
 */
export function useCameraAvailable(): CameraAvailability {
  const [status, setStatus] = useState<CameraAvailability>("unknown");

  useEffect(() => {
    let cancelled = false;

    async function check() {
      // No MediaDevices API at all (old browsers, insecure contexts, SSR)
      if (
        typeof navigator === "undefined" ||
        !navigator.mediaDevices?.enumerateDevices
      ) {
        if (!cancelled) setStatus("unavailable");
        return;
      }

      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasCamera = devices.some((d) => d.kind === "videoinput");
        if (!cancelled) {
          setStatus(hasCamera ? "available" : "unavailable");
        }
      } catch {
        if (!cancelled) setStatus("unavailable");
      }
    }

    check();

    return () => {
      cancelled = true;
    };
  }, []);

  return status;
}
