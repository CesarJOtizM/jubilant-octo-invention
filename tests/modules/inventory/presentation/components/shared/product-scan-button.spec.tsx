import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProductScanButton } from "@/modules/inventory/presentation/components/shared/product-scan-button";
import type { Product } from "@/modules/inventory/domain/entities/product.entity";

// --- i18n mock: returns the key (or key + params) ---
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, params?: Record<string, unknown>) =>
    params ? `${key}:${JSON.stringify(params)}` : key,
}));

// --- Toast mock ---
const toastSuccess = vi.fn();
const toastError = vi.fn();
vi.mock("sonner", () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccess(...args),
    error: (...args: unknown[]) => toastError(...args),
  },
}));

// --- Camera availability mock (per-test override) ---
let mockCameraStatus: "unknown" | "available" | "unavailable" = "available";
// --- Barcode (HID) scanner mock: capture the onScan so we can fire it ---
let hidOnScan: ((code: string) => void) | null = null;

vi.mock("@/shared/presentation/hooks", () => ({
  useCameraAvailable: () => mockCameraStatus,
  useBarcodeScanner: ({
    enabled,
    onScan,
  }: {
    enabled: boolean;
    onScan: (c: string) => void;
  }) => {
    hidOnScan = enabled ? onScan : null;
  },
}));

// --- CameraScannerDialog: replaced with a simple stub that we can control ---
let dialogOnScan: ((code: string) => void) | null = null;
vi.mock("@/shared/presentation/components/camera-scanner-dialog", () => ({
  CameraScannerDialog: ({
    open,
    onScan,
  }: {
    open: boolean;
    onScan: (c: string) => void;
  }) => {
    dialogOnScan = onScan;
    return open ? <div data-testid="camera-dialog" /> : null;
  },
}));

// --- Product lookup mutation mock ---
const mockLookup = vi.fn();
vi.mock("@/modules/inventory/presentation/hooks/use-products", () => ({
  useProductLookupMutation: () => ({
    mutateAsync: mockLookup,
    isPending: false,
  }),
}));

function buildProduct(overrides: Partial<{ id: string; name: string }> = {}) {
  return {
    id: overrides.id ?? "prod-1",
    name: overrides.name ?? "Widget",
  } as unknown as Product;
}

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe("ProductScanButton", () => {
  beforeEach(() => {
    mockCameraStatus = "available";
    hidOnScan = null;
    dialogOnScan = null;
    mockLookup.mockReset();
    toastSuccess.mockReset();
    toastError.mockReset();
  });

  describe("camera visibility", () => {
    it("Given: camera is available When: rendering Then: shows scan button", () => {
      mockCameraStatus = "available";
      renderWithClient(<ProductScanButton onProductScanned={vi.fn()} />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("Given: camera is unavailable When: rendering Then: renders null", () => {
      mockCameraStatus = "unavailable";
      const { container } = renderWithClient(
        <ProductScanButton onProductScanned={vi.fn()} />,
      );
      expect(container.innerHTML).toBe("");
    });

    it("Given: camera status is unknown When: rendering Then: renders null until resolved", () => {
      mockCameraStatus = "unknown";
      const { container } = renderWithClient(
        <ProductScanButton onProductScanned={vi.fn()} />,
      );
      expect(container.innerHTML).toBe("");
    });
  });

  describe("camera scan flow", () => {
    it("Given: dialog is closed When: clicking the button Then: opens the camera dialog", () => {
      renderWithClient(<ProductScanButton onProductScanned={vi.fn()} />);
      fireEvent.click(screen.getByRole("button"));
      expect(screen.getByTestId("camera-dialog")).toBeInTheDocument();
    });

    it("Given: camera scan resolves to a product When: onScan fires Then: calls onProductScanned and shows success toast", async () => {
      const product = buildProduct({ id: "p1", name: "Widget A" });
      mockLookup.mockResolvedValue(product);
      const onProductScanned = vi.fn();

      renderWithClient(<ProductScanButton onProductScanned={onProductScanned} />);
      fireEvent.click(screen.getByRole("button"));

      expect(dialogOnScan).toBeTruthy();
      dialogOnScan?.("1234567890");

      await waitFor(() => {
        expect(mockLookup).toHaveBeenCalledWith("1234567890");
      });
      await waitFor(() => {
        expect(onProductScanned).toHaveBeenCalledWith(product);
      });
      expect(toastSuccess).toHaveBeenCalled();
      expect(toastError).not.toHaveBeenCalled();
    });

    it("Given: camera scan resolves to null When: onScan fires Then: shows notFound toast and does not call onProductScanned", async () => {
      mockLookup.mockResolvedValue(null);
      const onProductScanned = vi.fn();

      renderWithClient(<ProductScanButton onProductScanned={onProductScanned} />);
      fireEvent.click(screen.getByRole("button"));
      dialogOnScan?.("NOT-A-CODE");

      await waitFor(() => {
        expect(toastError).toHaveBeenCalled();
      });
      expect(onProductScanned).not.toHaveBeenCalled();
    });

    it("Given: lookup throws When: onScan fires Then: shows lookupError toast", async () => {
      mockLookup.mockRejectedValue(new Error("network"));
      const onProductScanned = vi.fn();

      renderWithClient(<ProductScanButton onProductScanned={onProductScanned} />);
      fireEvent.click(screen.getByRole("button"));
      dialogOnScan?.("123");

      await waitFor(() => {
        expect(toastError).toHaveBeenCalled();
      });
      expect(onProductScanned).not.toHaveBeenCalled();
    });

    it("Given: scan code is empty/whitespace When: onScan fires Then: does nothing", async () => {
      const onProductScanned = vi.fn();
      renderWithClient(<ProductScanButton onProductScanned={onProductScanned} />);
      fireEvent.click(screen.getByRole("button"));
      dialogOnScan?.("   ");

      // no await needed — empty-path exits synchronously before mutateAsync
      expect(mockLookup).not.toHaveBeenCalled();
      expect(onProductScanned).not.toHaveBeenCalled();
    });
  });

  describe("HID (hardware) scanner flow", () => {
    it("Given: component is mounted and enabled When: HID scanner fires Then: resolves and calls onProductScanned", async () => {
      const product = buildProduct({ id: "p-hid", name: "Gun-scanned" });
      mockLookup.mockResolvedValue(product);
      const onProductScanned = vi.fn();

      renderWithClient(<ProductScanButton onProductScanned={onProductScanned} />);

      expect(hidOnScan).toBeTruthy();
      hidOnScan?.("7701234567890");

      await waitFor(() => {
        expect(onProductScanned).toHaveBeenCalledWith(product);
      });
    });

    it("Given: disabled prop is true When: rendering Then: HID listener is disabled", () => {
      renderWithClient(
        <ProductScanButton onProductScanned={vi.fn()} disabled />,
      );
      expect(hidOnScan).toBeNull();
    });

    it("Given: camera is unavailable When: HID fires Then: it still works (HID is camera-independent)", async () => {
      mockCameraStatus = "unavailable";
      const product = buildProduct();
      mockLookup.mockResolvedValue(product);
      const onProductScanned = vi.fn();

      renderWithClient(<ProductScanButton onProductScanned={onProductScanned} />);

      // useBarcodeScanner is called BEFORE the early return in the component,
      // so HID stays active even when the camera button is hidden.
      expect(hidOnScan).toBeTruthy();
      hidOnScan?.("CODE-X");

      await waitFor(() => {
        expect(onProductScanned).toHaveBeenCalledWith(product);
      });
    });
  });
});
