import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { createQueryWrapper } from "@tests/utils/create-query-wrapper";

const mockFindAll = vi.fn();
const mockFindById = vi.fn();
const mockCreate = vi.fn();
const mockUpdate = vi.fn();
const mockDeleteFn = vi.fn();

vi.mock("@/config/di/container", () => ({
  getContainer: vi.fn(() => ({
    brandRepository: {
      findAll: mockFindAll,
      findById: mockFindById,
      create: mockCreate,
      update: mockUpdate,
      delete: mockDeleteFn,
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
  useBrands,
  useBrand,
  useCreateBrand,
  useUpdateBrand,
  useDeleteBrand,
  brandKeys,
} from "@/modules/brands/presentation/hooks/use-brands";
import { toast } from "sonner";

describe("use-brands hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("brandKeys", () => {
    it("Given: query keys When: accessing Then: should return the expected structure", () => {
      expect(brandKeys.all).toEqual(["brands"]);
      expect(brandKeys.lists()).toEqual(["brands", "list"]);
      expect(brandKeys.list({ search: "sam" })).toEqual([
        "brands",
        "list",
        { search: "sam" },
      ]);
      expect(brandKeys.details()).toEqual(["brands", "detail"]);
      expect(brandKeys.detail("brand-1")).toEqual([
        "brands",
        "detail",
        "brand-1",
      ]);
    });
  });

  describe("useBrands", () => {
    it("Given: brands exist When: hook fetches Then: returns the brand list", async () => {
      const mockData = {
        data: [{ id: "brand-1", name: "Samsung" }],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      };
      mockFindAll.mockResolvedValueOnce(mockData);
      const { Wrapper } = createQueryWrapper();

      const { result } = renderHook(() => useBrands(), { wrapper: Wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockFindAll).toHaveBeenCalledWith(undefined);
      expect(result.current.data).toEqual(mockData);
    });

    it("Given: filters When: hook fetches Then: passes filters to findAll", async () => {
      const filters = { search: "samsung", isActive: true };
      mockFindAll.mockResolvedValueOnce({ data: [], pagination: {} });
      const { Wrapper } = createQueryWrapper();

      renderHook(() => useBrands(filters), { wrapper: Wrapper });

      await waitFor(() => expect(mockFindAll).toHaveBeenCalledWith(filters));
    });
  });

  describe("useBrand", () => {
    it("Given: valid id When: hook fetches Then: returns the brand", async () => {
      const brand = { id: "brand-1", name: "Samsung" };
      mockFindById.mockResolvedValueOnce(brand);
      const { Wrapper } = createQueryWrapper();

      const { result } = renderHook(() => useBrand("brand-1"), {
        wrapper: Wrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockFindById).toHaveBeenCalledWith("brand-1");
      expect(result.current.data).toEqual(brand);
    });

    it("Given: empty id When: hook renders Then: does not fetch (disabled)", () => {
      const { Wrapper } = createQueryWrapper();
      const { result } = renderHook(() => useBrand(""), { wrapper: Wrapper });

      expect(result.current.fetchStatus).toBe("idle");
      expect(mockFindById).not.toHaveBeenCalled();
    });
  });

  describe("useCreateBrand", () => {
    it("Given: valid data When: mutate Then: creates and shows success toast", async () => {
      mockCreate.mockResolvedValueOnce({ id: "brand-2" });
      const { Wrapper } = createQueryWrapper();

      const { result } = renderHook(() => useCreateBrand(), {
        wrapper: Wrapper,
      });

      await act(async () => {
        await result.current.mutateAsync({ name: "New Brand" });
      });

      expect(mockCreate).toHaveBeenCalledWith({ name: "New Brand" });
      expect(toast.success).toHaveBeenCalledWith("messages.created");
    });

    it("Given: successful create When: mutate Then: invalidates the lists query", async () => {
      mockCreate.mockResolvedValueOnce({ id: "brand-2" });
      const { Wrapper, queryClient } = createQueryWrapper();
      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useCreateBrand(), {
        wrapper: Wrapper,
      });

      await act(async () => {
        await result.current.mutateAsync({ name: "New Brand" });
      });

      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["brands", "list"],
      });
    });

    it("Given: server error When: mutate Then: shows error toast", async () => {
      mockCreate.mockRejectedValueOnce(new Error("Fail"));
      const { Wrapper } = createQueryWrapper();

      const { result } = renderHook(() => useCreateBrand(), {
        wrapper: Wrapper,
      });

      await act(async () => {
        try {
          await result.current.mutateAsync({ name: "Fail Brand" });
        } catch {
          // expected
        }
      });

      expect(toast.error).toHaveBeenCalled();
    });
  });

  describe("useUpdateBrand", () => {
    it("Given: valid data When: mutate Then: updates and invalidates list and detail queries", async () => {
      mockUpdate.mockResolvedValueOnce({ id: "brand-1" });
      const { Wrapper, queryClient } = createQueryWrapper();
      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useUpdateBrand(), {
        wrapper: Wrapper,
      });

      await act(async () => {
        await result.current.mutateAsync({
          id: "brand-1",
          data: { name: "Updated Brand" },
        });
      });

      expect(mockUpdate).toHaveBeenCalledWith("brand-1", {
        name: "Updated Brand",
      });
      expect(toast.success).toHaveBeenCalledWith("messages.updated");
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["brands", "list"],
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["brands", "detail", "brand-1"],
      });
    });

    it("Given: server error When: mutate Then: shows error toast", async () => {
      mockUpdate.mockRejectedValueOnce(new Error("Fail"));
      const { Wrapper } = createQueryWrapper();

      const { result } = renderHook(() => useUpdateBrand(), {
        wrapper: Wrapper,
      });

      await act(async () => {
        try {
          await result.current.mutateAsync({
            id: "brand-1",
            data: { name: "Fail" },
          });
        } catch {
          // expected
        }
      });

      expect(toast.error).toHaveBeenCalled();
    });
  });

  describe("useDeleteBrand", () => {
    it("Given: valid id When: delete Then: deletes, shows toast, invalidates list", async () => {
      mockDeleteFn.mockResolvedValueOnce(undefined);
      const { Wrapper, queryClient } = createQueryWrapper();
      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useDeleteBrand(), {
        wrapper: Wrapper,
      });

      await act(async () => {
        await result.current.mutateAsync("brand-1");
      });

      expect(mockDeleteFn).toHaveBeenCalledWith("brand-1");
      expect(toast.success).toHaveBeenCalledWith("messages.deleted");
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["brands", "list"],
      });
    });

    it("Given: server error When: delete Then: shows error toast", async () => {
      mockDeleteFn.mockRejectedValueOnce(new Error("Fail"));
      const { Wrapper } = createQueryWrapper();

      const { result } = renderHook(() => useDeleteBrand(), {
        wrapper: Wrapper,
      });

      await act(async () => {
        try {
          await result.current.mutateAsync("brand-1");
        } catch {
          // expected
        }
      });

      expect(toast.error).toHaveBeenCalled();
    });
  });
});
