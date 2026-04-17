import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, params?: Record<string, unknown>) =>
    params ? `${key}:${JSON.stringify(params)}` : key,
}));

vi.mock("@/ui/components/table-pagination", () => ({
  TablePagination: ({
    onPageChange,
    onPageSizeChange,
  }: {
    onPageChange: (p: number) => void;
    onPageSizeChange: (s: number) => void;
  }) => (
    <div data-testid="table-pagination">
      <button onClick={() => onPageChange(2)}>next-page</button>
      <button onClick={() => onPageSizeChange(25)}>change-size</button>
    </div>
  ),
}));

vi.mock("@/ui/components/searchable-select", () => ({
  SearchableSelect: ({ placeholder }: { placeholder?: string }) => (
    <div data-testid="searchable-select">{placeholder}</div>
  ),
}));

let mockAvailability: {
  data:
    | {
        data: Array<{
          id: string;
          sku: string;
          name: string;
          price: number;
          isActive: boolean;
          availability: Array<{
            warehouseId: string;
            warehouseName: string;
            available: number;
          }>;
        }>;
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }
    | undefined;
  isLoading: boolean;
  isError: boolean;
  error?: { message: string };
};

vi.mock("@/modules/inventory/presentation/hooks/use-combos", () => ({
  useComboAvailability: () => mockAvailability,
}));

vi.mock("@/modules/inventory/presentation/hooks/use-warehouses", () => ({
  useWarehouses: () => ({ data: { data: [{ id: "w-1", name: "Main" }] } }),
}));

import { ComboAvailabilityTable } from "@/modules/inventory/presentation/components/combos/combo-availability-table";

describe("ComboAvailabilityTable", () => {
  beforeEach(() => {
    mockAvailability = {
      data: {
        data: [
          {
            id: "c-1",
            sku: "C1",
            name: "Combo 1",
            price: 1000,
            isActive: true,
            availability: [
              {
                warehouseId: "w-1",
                warehouseName: "Main",
                available: 5,
              },
              {
                warehouseId: "w-2",
                warehouseName: "Secondary",
                available: 0,
              },
            ],
          },
          {
            id: "c-2",
            sku: "C2",
            name: "Combo 2",
            price: 2000,
            isActive: false,
            availability: [
              {
                warehouseId: "w-1",
                warehouseName: "Main",
                available: 3,
              },
            ],
          },
        ],
        pagination: { page: 1, limit: 10, total: 3, totalPages: 1 },
      },
      isLoading: false,
      isError: false,
    };
  });

  describe("rendering", () => {
    it("Given: availability data When: rendering Then: should show title", () => {
      render(<ComboAvailabilityTable />);
      expect(screen.getByText("availability.title")).toBeInTheDocument();
    });

    it("Given: availability data When: rendering Then: should flatten one row per combo+warehouse", () => {
      render(<ComboAvailabilityTable />);

      // Combo 1 has 2 warehouse rows, Combo 2 has 1 row → 3 rows total
      expect(screen.getAllByText("Combo 1")).toHaveLength(2);
      expect(screen.getAllByText("Combo 2")).toHaveLength(1);
    });

    it("Given: available > 0 When: rendering Then: should show value with green color class", () => {
      render(<ComboAvailabilityTable />);

      const five = screen.getByText("5");
      expect(five.className).toContain("text-success");
    });

    it("Given: available === 0 When: rendering Then: should show value with destructive color class", () => {
      render(<ComboAvailabilityTable />);

      const zero = screen.getByText("0");
      expect(zero.className).toContain("text-destructive");
    });

    it("Given: active combo When: rendering Then: should show active badge", () => {
      render(<ComboAvailabilityTable />);
      expect(screen.getAllByText("status.active").length).toBeGreaterThan(0);
    });

    it("Given: inactive combo When: rendering Then: should show inactive badge", () => {
      render(<ComboAvailabilityTable />);
      expect(screen.getByText("status.inactive")).toBeInTheDocument();
    });
  });

  describe("loading state", () => {
    it("Given: loading When: rendering Then: should NOT show combo rows", () => {
      mockAvailability = {
        data: undefined,
        isLoading: true,
        isError: false,
      };

      render(<ComboAvailabilityTable />);

      expect(screen.queryByText("Combo 1")).not.toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("Given: empty data When: rendering Then: should show empty message", () => {
      mockAvailability = {
        data: {
          data: [],
          pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        },
        isLoading: false,
        isError: false,
      };

      render(<ComboAvailabilityTable />);

      expect(screen.getByText("availability.empty")).toBeInTheDocument();
    });
  });

  describe("error state", () => {
    it("Given: error When: rendering Then: should show error message", () => {
      mockAvailability = {
        data: undefined,
        isLoading: false,
        isError: true,
        error: { message: "network failure" },
      };

      render(<ComboAvailabilityTable />);

      expect(
        screen.getByText(/error\.loading.*network failure/i),
      ).toBeInTheDocument();
    });
  });

  describe("filters", () => {
    it("Given: search inputs present When: typing name Then: should update the input value", () => {
      render(<ComboAvailabilityTable />);

      const nameInput = screen.getByPlaceholderText("search.namePlaceholder");
      fireEvent.change(nameInput, { target: { value: "Combo 1" } });

      expect((nameInput as HTMLInputElement).value).toBe("Combo 1");
    });

    it("Given: sku input present When: typing sku Then: should update the input value", () => {
      render(<ComboAvailabilityTable />);

      const skuInput = screen.getByPlaceholderText("search.skuPlaceholder");
      fireEvent.change(skuInput, { target: { value: "C1" } });

      expect((skuInput as HTMLInputElement).value).toBe("C1");
    });

    it("Given: searchable-select for warehouse When: rendering Then: should be present", () => {
      render(<ComboAvailabilityTable />);

      expect(screen.getByTestId("searchable-select")).toBeInTheDocument();
    });
  });

  describe("pagination", () => {
    it("Given: pagination buttons When: clicking next Then: should not crash (integration)", () => {
      render(<ComboAvailabilityTable />);

      fireEvent.click(screen.getByText("next-page"));

      expect(screen.getByTestId("table-pagination")).toBeInTheDocument();
    });

    it("Given: pagination buttons When: changing page size Then: should not crash", () => {
      render(<ComboAvailabilityTable />);

      fireEvent.click(screen.getByText("change-size"));

      expect(screen.getByTestId("table-pagination")).toBeInTheDocument();
    });
  });
});
