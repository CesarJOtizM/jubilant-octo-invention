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

vi.mock("@/ui/components/searchable-select", () => ({
  SearchableSelect: ({ placeholder }: { placeholder?: string }) => (
    <div data-testid="searchable-select">{placeholder}</div>
  ),
}));

let mockReportState: {
  data:
    | Array<{
        comboId: string;
        sku: string;
        name: string;
        totalComboUnitsSold: number;
        totalRevenue: number;
        salesCount: number;
      }>
    | undefined;
  isLoading: boolean;
  isError: boolean;
  error?: { message: string };
};

let mockCombosState: {
  data: { data: Array<{ id: string; name: string; sku: string }> } | undefined;
};

vi.mock("@/modules/inventory/presentation/hooks/use-combos", () => ({
  useComboSalesReport: () => mockReportState,
  useCombos: () => mockCombosState,
}));

import { ComboSalesReport } from "@/modules/inventory/presentation/components/combos/combo-sales-report";

describe("ComboSalesReport", () => {
  beforeEach(() => {
    mockCombosState = {
      data: { data: [{ id: "c-1", name: "Combo 1", sku: "C1" }] },
    };
    mockReportState = {
      data: [
        {
          comboId: "c-1",
          sku: "C1",
          name: "Combo 1",
          totalComboUnitsSold: 5,
          totalRevenue: 50000,
          salesCount: 2,
        },
      ],
      isLoading: false,
      isError: false,
    };
  });

  describe("rendering", () => {
    it("Given: report data When: rendering Then: should show title", () => {
      render(<ComboSalesReport />);
      expect(screen.getByText("reports.sales.title")).toBeInTheDocument();
    });

    it("Given: report data When: rendering Then: should show rows", () => {
      render(<ComboSalesReport />);
      expect(screen.getByText("Combo 1")).toBeInTheDocument();
      expect(screen.getByText("C1")).toBeInTheDocument();
    });

    it("Given: report with units When: rendering Then: should format numbers as locale strings", () => {
      render(<ComboSalesReport />);
      // "5" for units, "2" for salesCount, and a currency formatted for 50000
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText(/50,000/)).toBeInTheDocument();
    });

    it("Given: date range and combo filter sections When: rendering Then: should show DatePickers and SearchableSelect", () => {
      render(<ComboSalesReport />);
      expect(screen.getAllByTestId("date-picker")).toHaveLength(2);
      expect(screen.getByTestId("searchable-select")).toBeInTheDocument();
    });
  });

  describe("loading state", () => {
    it("Given: loading When: rendering Then: should show skeleton (no rows)", () => {
      mockReportState = { data: undefined, isLoading: true, isError: false };

      render(<ComboSalesReport />);

      expect(screen.queryByText("Combo 1")).not.toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("Given: empty report data When: rendering Then: should show empty message", () => {
      mockReportState = { data: [], isLoading: false, isError: false };

      render(<ComboSalesReport />);

      expect(screen.getByText("reports.sales.empty")).toBeInTheDocument();
    });
  });

  describe("error state", () => {
    it("Given: error When: rendering Then: should show error message", () => {
      mockReportState = {
        data: undefined,
        isLoading: false,
        isError: true,
        error: { message: "network down" },
      };

      render(<ComboSalesReport />);

      expect(
        screen.getByText(/error\.loading.*network down/i),
      ).toBeInTheDocument();
    });
  });
});
