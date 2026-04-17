import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/shared/infrastructure/http", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("@/modules/inventory/application/mappers/combo.mapper", () => ({
  ComboMapper: {
    toDomain: vi.fn((dto: unknown) => dto),
  },
}));

import { apiClient } from "@/shared/infrastructure/http";
import { ComboApiAdapter } from "@/modules/inventory/infrastructure/adapters/combo-api.adapter";
import type { ComboResponseDto } from "@/modules/inventory/application/dto/combo.dto";

describe("ComboApiAdapter", () => {
  let adapter: ComboApiAdapter;

  const mockComboDto: ComboResponseDto = {
    id: "combo-001",
    sku: "COMBO-001",
    name: "Starter pack",
    description: "Nice combo",
    price: 100,
    currency: "COP",
    isActive: true,
    orgId: "org-1",
    items: [],
    createdAt: "2026-03-07T10:00:00.000Z",
    updatedAt: "2026-03-07T12:00:00.000Z",
  };

  const mockPagination = { page: 1, limit: 10, total: 1, totalPages: 1 };

  beforeEach(() => {
    vi.clearAllMocks();
    adapter = new ComboApiAdapter();
  });

  describe("findAll", () => {
    it("Given: no query When: findAll is called Then: should GET /inventory/combos with empty params", async () => {
      vi.mocked(apiClient.get).mockResolvedValue({
        data: { data: [mockComboDto], pagination: mockPagination },
      });

      const result = await adapter.findAll();

      expect(apiClient.get).toHaveBeenCalledWith("/inventory/combos", {
        params: {},
      });
      expect(result.data).toHaveLength(1);
      expect(result.pagination).toEqual(mockPagination);
    });

    it("Given: all filters When: findAll is called Then: should pass all params", async () => {
      vi.mocked(apiClient.get).mockResolvedValue({
        data: { data: [], pagination: mockPagination },
      });

      await adapter.findAll({
        page: 2,
        limit: 25,
        isActive: true,
        name: "Starter",
        sku: "COMBO",
      });

      expect(apiClient.get).toHaveBeenCalledWith("/inventory/combos", {
        params: {
          page: 2,
          limit: 25,
          isActive: true,
          name: "Starter",
          sku: "COMBO",
        },
      });
    });

    it("Given: isActive=false When: findAll is called Then: should include isActive=false", async () => {
      vi.mocked(apiClient.get).mockResolvedValue({
        data: { data: [], pagination: mockPagination },
      });

      await adapter.findAll({ isActive: false });

      expect(apiClient.get).toHaveBeenCalledWith("/inventory/combos", {
        params: { isActive: false },
      });
    });

    it("Given: undefined query fields When: findAll is called Then: should exclude them from params", async () => {
      vi.mocked(apiClient.get).mockResolvedValue({
        data: { data: [], pagination: mockPagination },
      });

      await adapter.findAll({ name: undefined, sku: undefined });

      expect(apiClient.get).toHaveBeenCalledWith("/inventory/combos", {
        params: {},
      });
    });
  });

  describe("findById", () => {
    it("Given: valid ID When: findById is called Then: should GET and return mapped combo", async () => {
      vi.mocked(apiClient.get).mockResolvedValue({
        data: { data: mockComboDto },
      });

      const result = await adapter.findById("combo-001");

      expect(apiClient.get).toHaveBeenCalledWith("/inventory/combos/combo-001");
      expect(result).toBeTruthy();
    });

    it("Given: non-existent ID (404) When: findById is called Then: should return null", async () => {
      vi.mocked(apiClient.get).mockRejectedValue({ response: { status: 404 } });

      const result = await adapter.findById("missing");

      expect(result).toBeNull();
    });

    it("Given: server error (500) When: findById is called Then: should rethrow", async () => {
      const err = { response: { status: 500 } };
      vi.mocked(apiClient.get).mockRejectedValue(err);

      await expect(adapter.findById("combo-001")).rejects.toEqual(err);
    });

    it("Given: error without response property When: findById Then: should rethrow", async () => {
      vi.mocked(apiClient.get).mockRejectedValue(new Error("Network error"));

      await expect(adapter.findById("combo-001")).rejects.toThrow(
        "Network error",
      );
    });

    it("Given: null error When: findById Then: should rethrow null", async () => {
      vi.mocked(apiClient.get).mockRejectedValue(null);

      await expect(adapter.findById("combo-001")).rejects.toBeNull();
    });
  });

  describe("create", () => {
    it("Given: valid data When: create is called Then: should POST and return mapped combo", async () => {
      vi.mocked(apiClient.post).mockResolvedValue({
        data: { data: mockComboDto },
      });

      const createDto = {
        sku: "COMBO-1",
        name: "Name",
        price: 100,
        items: [{ productId: "p-1", quantity: 1 }],
      };
      const result = await adapter.create(createDto);

      expect(apiClient.post).toHaveBeenCalledWith(
        "/inventory/combos",
        createDto,
      );
      expect(result).toBeTruthy();
    });
  });

  describe("update", () => {
    it("Given: valid data When: update is called Then: should PUT and return mapped combo", async () => {
      vi.mocked(apiClient.put).mockResolvedValue({
        data: { data: { ...mockComboDto, name: "Updated" } },
      });

      const result = await adapter.update("combo-001", { name: "Updated" });

      expect(apiClient.put).toHaveBeenCalledWith(
        "/inventory/combos/combo-001",
        { name: "Updated" },
      );
      expect(result).toBeTruthy();
    });
  });

  describe("deactivate", () => {
    it("Given: valid ID When: deactivate is called Then: should PATCH /deactivate", async () => {
      vi.mocked(apiClient.patch).mockResolvedValue({
        data: { data: { ...mockComboDto, isActive: false } },
      });

      const result = await adapter.deactivate("combo-001");

      expect(apiClient.patch).toHaveBeenCalledWith(
        "/inventory/combos/combo-001/deactivate",
      );
      expect(result).toBeTruthy();
    });
  });

  describe("getAvailability", () => {
    it("Given: no query When: getAvailability is called Then: should GET /availability with empty params", async () => {
      vi.mocked(apiClient.get).mockResolvedValue({
        data: { data: [], pagination: mockPagination },
      });

      const result = await adapter.getAvailability();

      expect(apiClient.get).toHaveBeenCalledWith(
        "/inventory/combos/availability",
        { params: {} },
      );
      expect(result.pagination).toEqual(mockPagination);
    });

    it("Given: all availability params When: getAvailability is called Then: should pass all params", async () => {
      vi.mocked(apiClient.get).mockResolvedValue({
        data: { data: [], pagination: mockPagination },
      });

      await adapter.getAvailability({
        page: 2,
        limit: 25,
        isActive: true,
        name: "Starter",
        sku: "COMBO",
        warehouseId: "wh-1",
      });

      expect(apiClient.get).toHaveBeenCalledWith(
        "/inventory/combos/availability",
        {
          params: {
            page: 2,
            limit: 25,
            isActive: true,
            name: "Starter",
            sku: "COMBO",
            warehouseId: "wh-1",
          },
        },
      );
    });

    it("Given: isActive=false in availability When: getAvailability Then: should include false", async () => {
      vi.mocked(apiClient.get).mockResolvedValue({
        data: { data: [], pagination: mockPagination },
      });

      await adapter.getAvailability({ isActive: false });

      expect(apiClient.get).toHaveBeenCalledWith(
        "/inventory/combos/availability",
        { params: { isActive: false } },
      );
    });
  });

  describe("getSalesReport", () => {
    it("Given: no query When: getSalesReport is called Then: should GET /sales-report with empty params", async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: { data: [] } });

      const result = await adapter.getSalesReport();

      expect(apiClient.get).toHaveBeenCalledWith(
        "/inventory/combos/sales-report",
        { params: {} },
      );
      expect(result).toEqual([]);
    });

    it("Given: full query When: getSalesReport is called Then: should pass all params", async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: { data: [] } });

      await adapter.getSalesReport({
        dateFrom: "2026-01-01",
        dateTo: "2026-01-31",
        comboId: "combo-001",
      });

      expect(apiClient.get).toHaveBeenCalledWith(
        "/inventory/combos/sales-report",
        {
          params: {
            dateFrom: "2026-01-01",
            dateTo: "2026-01-31",
            comboId: "combo-001",
          },
        },
      );
    });

    it("Given: report data When: getSalesReport Then: should return the array", async () => {
      const reportData = [
        {
          comboId: "c-1",
          sku: "S1",
          name: "n",
          totalComboUnitsSold: 5,
          totalRevenue: 500,
          salesCount: 2,
        },
      ];
      vi.mocked(apiClient.get).mockResolvedValue({ data: { data: reportData } });

      const result = await adapter.getSalesReport();

      expect(result).toEqual(reportData);
    });
  });

  describe("getStockImpact", () => {
    it("Given: only productId When: getStockImpact is called Then: should GET with empty params", async () => {
      vi.mocked(apiClient.get).mockResolvedValue({
        data: {
          data: {
            directSalesQty: 0,
            comboSalesQty: 0,
            totalQty: 0,
            comboBreakdown: [],
          },
        },
      });

      const result = await adapter.getStockImpact("prod-1");

      expect(apiClient.get).toHaveBeenCalledWith(
        "/inventory/combos/stock-impact/prod-1",
        { params: {} },
      );
      expect(result.totalQty).toBe(0);
    });

    it("Given: productId + date range When: getStockImpact Then: should pass date params", async () => {
      vi.mocked(apiClient.get).mockResolvedValue({
        data: {
          data: {
            directSalesQty: 0,
            comboSalesQty: 0,
            totalQty: 0,
            comboBreakdown: [],
          },
        },
      });

      await adapter.getStockImpact("prod-1", {
        dateFrom: "2026-01-01",
        dateTo: "2026-01-31",
      });

      expect(apiClient.get).toHaveBeenCalledWith(
        "/inventory/combos/stock-impact/prod-1",
        { params: { dateFrom: "2026-01-01", dateTo: "2026-01-31" } },
      );
    });

    it("Given: impact with breakdown When: getStockImpact Then: should return the impact", async () => {
      const impact = {
        directSalesQty: 10,
        comboSalesQty: 5,
        totalQty: 15,
        comboBreakdown: [
          { comboId: "c-1", sku: "C1", name: "Combo 1", qty: 3 },
        ],
      };
      vi.mocked(apiClient.get).mockResolvedValue({ data: { data: impact } });

      const result = await adapter.getStockImpact("prod-1");

      expect(result).toEqual(impact);
    });
  });
});
