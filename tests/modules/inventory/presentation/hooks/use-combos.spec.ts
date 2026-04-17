import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { createQueryWrapper } from "@tests/utils/create-query-wrapper";

const mockFindAll = vi.fn();
const mockFindById = vi.fn();
const mockGetAvailability = vi.fn();
const mockGetSalesReport = vi.fn();
const mockGetStockImpact = vi.fn();
const mockCreate = vi.fn();
const mockUpdate = vi.fn();
const mockDeactivate = vi.fn();

vi.mock("@/config/di/container", () => ({
  getContainer: vi.fn(() => ({
    comboRepository: {
      findAll: mockFindAll,
      findById: mockFindById,
      getAvailability: mockGetAvailability,
      getSalesReport: mockGetSalesReport,
      getStockImpact: mockGetStockImpact,
      create: mockCreate,
      update: mockUpdate,
      deactivate: mockDeactivate,
    },
  })),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/shared/presentation/utils/get-api-error-message", () => ({
  getApiErrorMessage: vi.fn(() => "Error message"),
}));

import {
  useCombos,
  useCombo,
  useComboAvailability,
  useComboSalesReport,
  useComboStockImpact,
  useCreateCombo,
  useUpdateCombo,
  useDeactivateCombo,
  comboKeys,
} from "@/modules/inventory/presentation/hooks/use-combos";
import { toast } from "sonner";

describe("use-combos hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("comboKeys re-export", () => {
    it("Given: re-exported keys When: accessing Then: should match structure", () => {
      expect(comboKeys.all).toEqual(["combos"]);
      expect(comboKeys.lists()).toEqual(["combos", "list"]);
      expect(comboKeys.detail("c-1")).toEqual(["combos", "detail", "c-1"]);
    });
  });

  describe("useCombos", () => {
    it("Given: combos exist When: hook fetches Then: returns the combo list", async () => {
      const mockData = {
        data: [{ id: "c-1", name: "Combo 1" }],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      };
      mockFindAll.mockResolvedValueOnce(mockData);
      const { Wrapper } = createQueryWrapper();

      const { result } = renderHook(() => useCombos(), { wrapper: Wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockFindAll).toHaveBeenCalledWith(undefined);
      expect(result.current.data).toEqual(mockData);
    });

    it("Given: filters When: hook fetches Then: passes filters to findAll", async () => {
      const filters = { search: "combo", isActive: true };
      mockFindAll.mockResolvedValueOnce({ data: [], pagination: {} });
      const { Wrapper } = createQueryWrapper();

      renderHook(() => useCombos(filters), { wrapper: Wrapper });

      await waitFor(() => expect(mockFindAll).toHaveBeenCalledWith(filters));
    });
  });

  describe("useCombo", () => {
    it("Given: valid id When: hook fetches Then: returns the combo", async () => {
      const combo = { id: "c-1", name: "Combo 1" };
      mockFindById.mockResolvedValueOnce(combo);
      const { Wrapper } = createQueryWrapper();

      const { result } = renderHook(() => useCombo("c-1"), {
        wrapper: Wrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockFindById).toHaveBeenCalledWith("c-1");
      expect(result.current.data).toEqual(combo);
    });

    it("Given: empty id When: hook renders Then: does not fetch (disabled)", () => {
      const { Wrapper } = createQueryWrapper();
      const { result } = renderHook(() => useCombo(""), { wrapper: Wrapper });

      expect(result.current.fetchStatus).toBe("idle");
      expect(mockFindById).not.toHaveBeenCalled();
    });
  });

  describe("useComboAvailability", () => {
    it("Given: availability exists When: hook fetches Then: returns the data", async () => {
      mockGetAvailability.mockResolvedValueOnce([{ comboId: "c-1" }]);
      const { Wrapper } = createQueryWrapper();

      const { result } = renderHook(() => useComboAvailability(), {
        wrapper: Wrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockGetAvailability).toHaveBeenCalledWith(undefined);
    });

    it("Given: filters When: hook fetches Then: passes filters", async () => {
      const filters = { productId: "p-1" };
      mockGetAvailability.mockResolvedValueOnce([]);
      const { Wrapper } = createQueryWrapper();

      renderHook(() => useComboAvailability(filters), { wrapper: Wrapper });

      await waitFor(() =>
        expect(mockGetAvailability).toHaveBeenCalledWith(filters),
      );
    });
  });

  describe("useComboSalesReport", () => {
    it("Given: sales report When: hook fetches Then: returns the data", async () => {
      mockGetSalesReport.mockResolvedValueOnce({ totals: {} });
      const { Wrapper } = createQueryWrapper();

      const { result } = renderHook(() => useComboSalesReport(), {
        wrapper: Wrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockGetSalesReport).toHaveBeenCalledWith(undefined);
    });
  });

  describe("useComboStockImpact", () => {
    it("Given: productId When: hook fetches Then: returns the data", async () => {
      mockGetStockImpact.mockResolvedValueOnce({ impact: [] });
      const { Wrapper } = createQueryWrapper();

      const { result } = renderHook(() => useComboStockImpact("p-1"), {
        wrapper: Wrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockGetStockImpact).toHaveBeenCalledWith("p-1", undefined);
    });

    it("Given: empty productId When: hook renders Then: does not fetch (disabled)", () => {
      const { Wrapper } = createQueryWrapper();
      const { result } = renderHook(() => useComboStockImpact(""), {
        wrapper: Wrapper,
      });

      expect(result.current.fetchStatus).toBe("idle");
      expect(mockGetStockImpact).not.toHaveBeenCalled();
    });

    it("Given: productId and filters When: hook fetches Then: passes both", async () => {
      mockGetStockImpact.mockResolvedValueOnce({ impact: [] });
      const filters = { from: "2026-01-01" };
      const { Wrapper } = createQueryWrapper();

      renderHook(() => useComboStockImpact("p-1", filters), {
        wrapper: Wrapper,
      });

      await waitFor(() =>
        expect(mockGetStockImpact).toHaveBeenCalledWith("p-1", filters),
      );
    });
  });

  describe("useCreateCombo", () => {
    it("Given: valid data When: mutate Then: creates and shows success toast", async () => {
      mockCreate.mockResolvedValueOnce({ id: "c-new" });
      const { Wrapper, queryClient } = createQueryWrapper();
      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useCreateCombo(), {
        wrapper: Wrapper,
      });

      await act(async () => {
        await result.current.mutateAsync({
          sku: "COMBO-1",
          name: "New combo",
          price: 100,
          items: [{ productId: "p-1", quantity: 1 }],
        });
      });

      expect(mockCreate).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("messages.created");
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["combos", "list"],
      });
    });

    it("Given: server error When: mutate Then: shows error toast", async () => {
      mockCreate.mockRejectedValueOnce(new Error("Fail"));
      const { Wrapper } = createQueryWrapper();

      const { result } = renderHook(() => useCreateCombo(), {
        wrapper: Wrapper,
      });

      await act(async () => {
        try {
          await result.current.mutateAsync({
            sku: "COMBO-1",
            name: "New combo",
            price: 100,
            items: [{ productId: "p-1", quantity: 1 }],
          });
        } catch {
          // expected
        }
      });

      expect(toast.error).toHaveBeenCalled();
    });
  });

  describe("useUpdateCombo", () => {
    it("Given: valid data When: mutate Then: updates and invalidates list+detail", async () => {
      mockUpdate.mockResolvedValueOnce({ id: "c-1" });
      const { Wrapper, queryClient } = createQueryWrapper();
      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useUpdateCombo(), {
        wrapper: Wrapper,
      });

      await act(async () => {
        await result.current.mutateAsync({
          id: "c-1",
          data: { name: "Updated" },
        });
      });

      expect(mockUpdate).toHaveBeenCalledWith("c-1", { name: "Updated" });
      expect(toast.success).toHaveBeenCalledWith("messages.updated");
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["combos", "list"],
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["combos", "detail", "c-1"],
      });
    });

    it("Given: server error When: mutate Then: shows error toast", async () => {
      mockUpdate.mockRejectedValueOnce(new Error("Fail"));
      const { Wrapper } = createQueryWrapper();

      const { result } = renderHook(() => useUpdateCombo(), {
        wrapper: Wrapper,
      });

      await act(async () => {
        try {
          await result.current.mutateAsync({
            id: "c-1",
            data: { name: "Fail" },
          });
        } catch {
          // expected
        }
      });

      expect(toast.error).toHaveBeenCalled();
    });
  });

  describe("useDeactivateCombo", () => {
    it("Given: valid id When: deactivate Then: succeeds, shows toast, invalidates queries", async () => {
      mockDeactivate.mockResolvedValueOnce(undefined);
      const { Wrapper, queryClient } = createQueryWrapper();
      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useDeactivateCombo(), {
        wrapper: Wrapper,
      });

      await act(async () => {
        await result.current.mutateAsync("c-1");
      });

      expect(mockDeactivate).toHaveBeenCalledWith("c-1");
      expect(toast.success).toHaveBeenCalledWith("messages.deactivated");
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["combos", "list"],
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["combos", "detail", "c-1"],
      });
    });

    it("Given: server error When: deactivate Then: shows error toast", async () => {
      mockDeactivate.mockRejectedValueOnce(new Error("Fail"));
      const { Wrapper } = createQueryWrapper();

      const { result } = renderHook(() => useDeactivateCombo(), {
        wrapper: Wrapper,
      });

      await act(async () => {
        try {
          await result.current.mutateAsync("c-1");
        } catch {
          // expected
        }
      });

      expect(toast.error).toHaveBeenCalled();
    });
  });
});
