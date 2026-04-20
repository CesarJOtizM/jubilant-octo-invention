import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/ui/components/date-picker", () => ({
  DatePicker: ({ placeholder }: { placeholder?: string }) => (
    <div data-testid="date-picker">{placeholder}</div>
  ),
}));

let mockImpactState: {
  data:
    | {
        directSalesQty: number;
        comboSalesQty: number;
        totalQty: number;
        comboBreakdown: Array<{
          comboId: string;
          sku: string;
          name: string;
          qty: number;
        }>;
      }
    | undefined;
  isLoading: boolean;
  isError: boolean;
  error?: { message: string };
};

vi.mock("@/modules/inventory/presentation/hooks/use-combos", () => ({
  useComboStockImpact: () => mockImpactState,
}));

import { ComboStockImpact } from "@/modules/inventory/presentation/components/combos/combo-stock-impact";

describe("ComboStockImpact", () => {
  beforeEach(() => {
    mockImpactState = {
      data: {
        directSalesQty: 10,
        comboSalesQty: 5,
        totalQty: 15,
        comboBreakdown: [
          { comboId: "c-1", sku: "C1", name: "Combo 1", qty: 3 },
        ],
      },
      isLoading: false,
      isError: false,
    };
  });

  describe("rendering", () => {
    it("Given: data present When: rendering Then: should show title", () => {
      render(<ComboStockImpact productId="p-1" />);
      expect(screen.getByText("reports.stockImpact.title")).toBeInTheDocument();
    });

    it("Given: data present When: rendering Then: should show summary cards (direct, combo, total)", () => {
      render(<ComboStockImpact productId="p-1" />);
      expect(
        screen.getByText("reports.stockImpact.directSales"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("reports.stockImpact.comboSales"),
      ).toBeInTheDocument();
      expect(screen.getByText("reports.stockImpact.total")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("15")).toBeInTheDocument();
    });

    it("Given: breakdown with rows When: rendering Then: should show breakdown table with SKU and name", () => {
      render(<ComboStockImpact productId="p-1" />);

      expect(
        screen.getByText("reports.stockImpact.breakdown"),
      ).toBeInTheDocument();
      expect(screen.getByText("C1")).toBeInTheDocument();
      expect(screen.getByText("Combo 1")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("Given: empty breakdown When: rendering Then: should NOT show breakdown heading", () => {
      mockImpactState = {
        data: {
          directSalesQty: 0,
          comboSalesQty: 0,
          totalQty: 0,
          comboBreakdown: [],
        },
        isLoading: false,
        isError: false,
      };

      render(<ComboStockImpact productId="p-1" />);

      expect(
        screen.queryByText("reports.stockImpact.breakdown"),
      ).not.toBeInTheDocument();
    });
  });

  describe("loading state", () => {
    it("Given: isLoading When: rendering Then: should not show summary cards", () => {
      mockImpactState = { data: undefined, isLoading: true, isError: false };

      render(<ComboStockImpact productId="p-1" />);

      expect(
        screen.queryByText("reports.stockImpact.directSales"),
      ).not.toBeInTheDocument();
    });
  });

  describe("empty data", () => {
    it("Given: no data and not loading When: rendering Then: should show empty state", () => {
      mockImpactState = { data: undefined, isLoading: false, isError: false };

      render(<ComboStockImpact productId="p-1" />);

      expect(screen.getByText("reports.stockImpact.empty")).toBeInTheDocument();
    });
  });

  describe("error state", () => {
    it("Given: error When: rendering Then: should show error message", () => {
      mockImpactState = {
        data: undefined,
        isLoading: false,
        isError: true,
        error: { message: "boom" },
      };

      render(<ComboStockImpact productId="p-1" />);

      expect(screen.getByText(/error\.loading.*boom/i)).toBeInTheDocument();
    });
  });

  describe("filters", () => {
    it("Given: always When: rendering Then: should show two DatePickers (from + to)", () => {
      render(<ComboStockImpact productId="p-1" />);

      expect(screen.getAllByTestId("date-picker")).toHaveLength(2);
    });
  });
});
