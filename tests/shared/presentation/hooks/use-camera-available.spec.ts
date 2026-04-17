import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useCameraAvailable } from "@/shared/presentation/hooks/use-camera-available";

describe("useCameraAvailable", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("Given: no mediaDevices API When: checking Then: returns 'unavailable'", async () => {
    Object.defineProperty(globalThis, "navigator", {
      value: {},
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useCameraAvailable());

    await waitFor(() => {
      expect(result.current).toBe("unavailable");
    });
  });

  it("Given: enumerateDevices returns videoinput When: checking Then: returns 'available'", async () => {
    const enumerateDevices = vi
      .fn()
      .mockResolvedValue([
        { kind: "audioinput" } as MediaDeviceInfo,
        { kind: "videoinput" } as MediaDeviceInfo,
      ]);

    Object.defineProperty(globalThis, "navigator", {
      value: { mediaDevices: { enumerateDevices } },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useCameraAvailable());

    await waitFor(() => {
      expect(result.current).toBe("available");
    });
  });

  it("Given: enumerateDevices returns no videoinput When: checking Then: returns 'unavailable'", async () => {
    const enumerateDevices = vi
      .fn()
      .mockResolvedValue([{ kind: "audioinput" } as MediaDeviceInfo]);

    Object.defineProperty(globalThis, "navigator", {
      value: { mediaDevices: { enumerateDevices } },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useCameraAvailable());

    await waitFor(() => {
      expect(result.current).toBe("unavailable");
    });
  });

  it("Given: enumerateDevices throws When: checking Then: returns 'unavailable'", async () => {
    const enumerateDevices = vi
      .fn()
      .mockRejectedValue(new Error("Permissions policy"));

    Object.defineProperty(globalThis, "navigator", {
      value: { mediaDevices: { enumerateDevices } },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useCameraAvailable());

    await waitFor(() => {
      expect(result.current).toBe("unavailable");
    });
  });

  it("Given: initial render When: before check resolves Then: returns 'unknown'", () => {
    const enumerateDevices = vi.fn().mockImplementation(
      () => new Promise(() => {}), // never resolves
    );

    Object.defineProperty(globalThis, "navigator", {
      value: { mediaDevices: { enumerateDevices } },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useCameraAvailable());

    expect(result.current).toBe("unknown");
  });
});
