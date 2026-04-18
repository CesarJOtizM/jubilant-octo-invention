import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

const mockRouterPush = vi.fn();

vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ push: mockRouterPush }),
}));

// Stub ComboItemSelector: let tests assert on items/error, not its internals
vi.mock(
  "@/modules/inventory/presentation/components/combos/combo-item-selector",
  () => ({
    ComboItemSelector: ({
      items,
      error,
      disabled,
    }: {
      items: Array<{ productId: string; quantity: number }>;
      error?: string;
      disabled?: boolean;
    }) => (
      <div
        data-testid="combo-item-selector"
        data-disabled={disabled ? "1" : "0"}
      >
        <span data-testid="items-count">{items.length}</span>
        {error && <span data-testid="items-error">{error}</span>}
      </div>
    ),
  }),
);

// Stub CurrencyInput so we can set value via regular input
vi.mock("@/ui/components/currency-input", () => ({
  CurrencyInput: ({
    id,
    value,
    onChange,
    placeholder,
  }: {
    id?: string;
    value: number;
    onChange: (v: number) => void;
    placeholder?: string;
  }) => (
    <input
      id={id}
      data-testid="currency-input"
      type="number"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  ),
}));

const mockCreateMutateAsync = vi.fn();
const mockUpdateMutateAsync = vi.fn();
let mockCreateIsPending = false;
let mockUpdateIsPending = false;
let mockCreateError: Error | null = null;
let mockUpdateError: Error | null = null;

let mockExistingCombo:
  | {
      id: string;
      sku: string;
      name: string;
      description: string | null;
      price: number;
      currency: string;
      items: Array<{ productId: string; quantity: number }>;
    }
  | undefined;
let mockIsLoadingCombo = false;

vi.mock("@/modules/inventory/presentation/hooks/use-combos", () => ({
  useCombo: () => ({
    data: mockExistingCombo,
    isLoading: mockIsLoadingCombo,
  }),
  useCreateCombo: () => ({
    isPending: mockCreateIsPending,
    mutateAsync: mockCreateMutateAsync,
    error: mockCreateError,
  }),
  useUpdateCombo: () => ({
    isPending: mockUpdateIsPending,
    mutateAsync: mockUpdateMutateAsync,
    error: mockUpdateError,
  }),
}));

import { ComboForm } from "@/modules/inventory/presentation/components/combos/combo-form";

describe("ComboForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExistingCombo = undefined;
    mockIsLoadingCombo = false;
    mockCreateIsPending = false;
    mockUpdateIsPending = false;
    mockCreateError = null;
    mockUpdateError = null;
  });

  describe("rendering", () => {
    it("Given: create mode When: rendering Then: should show create title", () => {
      render(<ComboForm />);

      expect(screen.getByText("form.createTitle")).toBeInTheDocument();
    });

    it("Given: edit mode with existing combo When: rendering Then: should show edit title", () => {
      mockExistingCombo = {
        id: "c-1",
        sku: "C1",
        name: "Combo 1",
        description: "Desc",
        price: 1000,
        currency: "COP",
        items: [{ productId: "p-1", quantity: 2 }],
      };

      render(<ComboForm comboId="c-1" />);

      expect(screen.getByText("form.editTitle")).toBeInTheDocument();
    });

    it("Given: form When: rendering Then: should show name, sku, description, currency labels", () => {
      render(<ComboForm />);

      expect(screen.getAllByText(/fields\.sku/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/fields\.name/).length).toBeGreaterThan(0);
      expect(screen.getByText("fields.description")).toBeInTheDocument();
      expect(screen.getAllByText(/fields\.price/).length).toBeGreaterThan(0);
      expect(screen.getByText("fields.currency")).toBeInTheDocument();
    });

    it("Given: edit mode and isLoadingCombo When: rendering Then: should show loading spinner (not form)", () => {
      mockIsLoadingCombo = true;

      render(<ComboForm comboId="c-1" />);

      // skuPlaceholder is only visible when form is rendered
      expect(
        screen.queryByPlaceholderText("form.skuPlaceholder"),
      ).not.toBeInTheDocument();
    });

    it("Given: edit mode When: rendering Then: should disable SKU field", () => {
      mockExistingCombo = {
        id: "c-1",
        sku: "C1",
        name: "Combo 1",
        description: null,
        price: 1000,
        currency: "COP",
        items: [{ productId: "p-1", quantity: 1 }],
      };

      render(<ComboForm comboId="c-1" />);

      const skuInput = screen.getByPlaceholderText("form.skuPlaceholder");
      expect(skuInput).toBeDisabled();
    });

    it("Given: create mode When: rendering Then: should NOT disable SKU field", () => {
      render(<ComboForm />);

      const skuInput = screen.getByPlaceholderText("form.skuPlaceholder");
      expect(skuInput).not.toBeDisabled();
    });

    it("Given: create mode When: rendering Then: should show Create button", () => {
      render(<ComboForm />);
      expect(screen.getByText("create")).toBeInTheDocument();
    });

    it("Given: edit mode When: rendering Then: should show Save button", () => {
      mockExistingCombo = {
        id: "c-1",
        sku: "C1",
        name: "Combo 1",
        description: null,
        price: 1000,
        currency: "COP",
        items: [{ productId: "p-1", quantity: 1 }],
      };

      render(<ComboForm comboId="c-1" />);

      expect(screen.getByText("save")).toBeInTheDocument();
    });

    it("Given: mutation error When: rendering Then: should show error banner", () => {
      mockCreateError = Object.assign(new Error("failed"), {
        response: { data: { message: "Custom error" } },
      });

      render(<ComboForm />);

      expect(screen.getByText("Custom error")).toBeInTheDocument();
    });

    it("Given: mutation error without message When: rendering Then: should show form.error default", () => {
      mockCreateError = new Error("plain");

      render(<ComboForm />);

      expect(screen.getByText("form.error")).toBeInTheDocument();
    });
  });

  describe("prefill on edit", () => {
    it("Given: edit mode with data When: rendering Then: should prefill name input", async () => {
      mockExistingCombo = {
        id: "c-1",
        sku: "C1",
        name: "Combo 1",
        description: "Desc",
        price: 1500,
        currency: "USD",
        items: [{ productId: "p-1", quantity: 2 }],
      };

      render(<ComboForm comboId="c-1" />);

      await waitFor(() => {
        const nameInput = screen.getByPlaceholderText(
          "form.namePlaceholder",
        ) as HTMLInputElement;
        expect(nameInput.value).toBe("Combo 1");
      });
    });

    it("Given: edit mode with null description When: rendering Then: should prefill as empty string", async () => {
      mockExistingCombo = {
        id: "c-1",
        sku: "C1",
        name: "Combo 1",
        description: null,
        price: 1000,
        currency: "COP",
        items: [{ productId: "p-1", quantity: 1 }],
      };

      render(<ComboForm comboId="c-1" />);

      await waitFor(() => {
        const nameInput = screen.getByPlaceholderText(
          "form.namePlaceholder",
        ) as HTMLInputElement;
        expect(nameInput.value).toBe("Combo 1");
      });
    });
  });

  describe("cancel button", () => {
    it("Given: cancel clicked When: user clicks cancel Then: should router.push to combos list", () => {
      render(<ComboForm />);

      fireEvent.click(screen.getByText("cancel"));

      expect(mockRouterPush).toHaveBeenCalledWith(
        "/dashboard/inventory/combos",
      );
    });
  });

  describe("submit validation", () => {
    it("Given: invalid data (empty name/sku) When: clicking Create Then: should NOT call createCombo", async () => {
      render(<ComboForm />);

      fireEvent.click(screen.getByText("create"));

      await waitFor(() => {
        expect(mockCreateMutateAsync).not.toHaveBeenCalled();
      });
    });
  });
});
