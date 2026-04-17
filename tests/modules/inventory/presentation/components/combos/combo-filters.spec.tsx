import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// Debounce — bypass timing in tests (identity)
vi.mock("@/shared/presentation/hooks", () => ({
  useDebounce: <T,>(value: T) => value,
}));

import { ComboFilters } from "@/modules/inventory/presentation/components/combos/combo-filters";

describe("ComboFilters", () => {
  const defaultFilters = { page: 1, limit: 10 };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("Given: default filters When: rendering Then: should show name search input", () => {
      const onFiltersChange = vi.fn();

      render(
        <ComboFilters
          filters={defaultFilters}
          onFiltersChange={onFiltersChange}
        />,
      );

      expect(
        screen.getByPlaceholderText("search.namePlaceholder"),
      ).toBeInTheDocument();
    });

    it("Given: default filters When: rendering Then: should show filter button", () => {
      const onFiltersChange = vi.fn();

      render(
        <ComboFilters
          filters={defaultFilters}
          onFiltersChange={onFiltersChange}
        />,
      );

      expect(screen.getByText("filter")).toBeInTheDocument();
    });

    it("Given: no active filters When: rendering Then: should NOT show clear button", () => {
      const onFiltersChange = vi.fn();

      render(
        <ComboFilters
          filters={defaultFilters}
          onFiltersChange={onFiltersChange}
        />,
      );

      // "clear" (from tCommon('inventory.common.filters')) only shows when active filters exist
      expect(screen.queryByText("clear")).not.toBeInTheDocument();
    });

    it("Given: active name filter When: rendering Then: should show clear button", () => {
      const onFiltersChange = vi.fn();

      render(
        <ComboFilters
          filters={{ ...defaultFilters, name: "Starter" }}
          onFiltersChange={onFiltersChange}
        />,
      );

      expect(screen.getByText("clear")).toBeInTheDocument();
    });

    it("Given: active isActive filter When: rendering Then: should show clear button", () => {
      const onFiltersChange = vi.fn();

      render(
        <ComboFilters
          filters={{ ...defaultFilters, isActive: true }}
          onFiltersChange={onFiltersChange}
        />,
      );

      expect(screen.getByText("clear")).toBeInTheDocument();
    });

    it("Given: active sku filter When: rendering Then: should show clear button", () => {
      const onFiltersChange = vi.fn();

      render(
        <ComboFilters
          filters={{ ...defaultFilters, sku: "COMBO" }}
          onFiltersChange={onFiltersChange}
        />,
      );

      expect(screen.getByText("clear")).toBeInTheDocument();
    });
  });

  describe("toggling advanced filters", () => {
    it("Given: filters hidden When: clicking filter button Then: should show SKU and status fields", () => {
      const onFiltersChange = vi.fn();

      render(
        <ComboFilters
          filters={defaultFilters}
          onFiltersChange={onFiltersChange}
        />,
      );

      fireEvent.click(screen.getByText("filter"));

      expect(
        screen.getByPlaceholderText("search.skuPlaceholder"),
      ).toBeInTheDocument();
      expect(screen.getByText("status")).toBeInTheDocument();
    });

    it("Given: filters visible When: clicking filter again Then: should hide SKU field", () => {
      const onFiltersChange = vi.fn();

      render(
        <ComboFilters
          filters={defaultFilters}
          onFiltersChange={onFiltersChange}
        />,
      );

      fireEvent.click(screen.getByText("filter"));
      fireEvent.click(screen.getByText("filter"));

      expect(
        screen.queryByPlaceholderText("search.skuPlaceholder"),
      ).not.toBeInTheDocument();
    });
  });

  describe("name search (debounced)", () => {
    it("Given: user types in name When: change fires Then: should call onFiltersChange with name and page=1", () => {
      const onFiltersChange = vi.fn();

      render(
        <ComboFilters
          filters={defaultFilters}
          onFiltersChange={onFiltersChange}
        />,
      );

      fireEvent.change(screen.getByPlaceholderText("search.namePlaceholder"), {
        target: { value: "Starter" },
      });

      expect(onFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Starter", page: 1 }),
      );
    });

    it("Given: user clears name When: change fires Then: should call onFiltersChange with name undefined", () => {
      const onFiltersChange = vi.fn();

      render(
        <ComboFilters
          filters={{ ...defaultFilters, name: "Starter" }}
          onFiltersChange={onFiltersChange}
        />,
      );

      fireEvent.change(screen.getByPlaceholderText("search.namePlaceholder"), {
        target: { value: "" },
      });

      expect(onFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({ name: undefined, page: 1 }),
      );
    });

    it("Given: name value unchanged When: component mounts Then: should not call onFiltersChange", () => {
      const onFiltersChange = vi.fn();

      render(
        <ComboFilters
          filters={{ ...defaultFilters, name: "Starter" }}
          onFiltersChange={onFiltersChange}
        />,
      );

      expect(onFiltersChange).not.toHaveBeenCalled();
    });
  });

  describe("sku search (debounced)", () => {
    it("Given: advanced filters shown When: user types SKU Then: should call onFiltersChange with sku", () => {
      const onFiltersChange = vi.fn();

      render(
        <ComboFilters
          filters={defaultFilters}
          onFiltersChange={onFiltersChange}
        />,
      );
      fireEvent.click(screen.getByText("filter"));

      fireEvent.change(screen.getByPlaceholderText("search.skuPlaceholder"), {
        target: { value: "COMBO" },
      });

      expect(onFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({ sku: "COMBO", page: 1 }),
      );
    });
  });

  describe("clear filters", () => {
    it("Given: active filters When: clicking clear Then: should reset filters preserving limit", () => {
      const onFiltersChange = vi.fn();

      render(
        <ComboFilters
          filters={{
            page: 3,
            limit: 25,
            isActive: true,
            name: "Starter",
            sku: "SKU",
          }}
          onFiltersChange={onFiltersChange}
        />,
      );

      fireEvent.click(screen.getByText("clear"));

      expect(onFiltersChange).toHaveBeenCalledWith({
        page: 1,
        limit: 25,
        isActive: undefined,
        name: undefined,
        sku: undefined,
      });
    });
  });
});
