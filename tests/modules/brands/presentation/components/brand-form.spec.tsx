import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const mockCreateMutateAsync = vi.fn();
const mockUpdateMutateAsync = vi.fn();
let mockCreateIsPending = false;
let mockUpdateIsPending = false;

let mockBrandData:
  | { id: string; name: string; description: string | null }
  | undefined;

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/modules/brands/presentation/hooks/use-brands", () => ({
  useBrand: () => ({ data: mockBrandData }),
  useCreateBrand: () => ({
    isPending: mockCreateIsPending,
    mutateAsync: mockCreateMutateAsync,
  }),
  useUpdateBrand: () => ({
    isPending: mockUpdateIsPending,
    mutateAsync: mockUpdateMutateAsync,
  }),
}));

import { BrandForm } from "@/modules/brands/presentation/components/brand-form";

describe("BrandForm", () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    editId: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockBrandData = undefined;
    mockCreateIsPending = false;
    mockUpdateIsPending = false;
  });

  describe("rendering", () => {
    it("Given: create mode When: rendering Then: should show create title", () => {
      render(<BrandForm {...defaultProps} />);

      expect(screen.getByText("form.createTitle")).toBeInTheDocument();
    });

    it("Given: edit mode When: rendering Then: should show edit title", () => {
      mockBrandData = {
        id: "b-1",
        name: "Samsung",
        description: "Electronics",
      };

      render(<BrandForm {...defaultProps} editId="b-1" />);

      expect(screen.getByText("form.editTitle")).toBeInTheDocument();
    });

    it("Given: form When: rendering Then: should show name and description fields", () => {
      render(<BrandForm {...defaultProps} />);

      expect(screen.getByText("fields.name")).toBeInTheDocument();
      expect(screen.getByText("fields.description")).toBeInTheDocument();
    });

    it("Given: create mode When: rendering Then: should show create button", () => {
      render(<BrandForm {...defaultProps} />);

      expect(screen.getByText("create")).toBeInTheDocument();
    });

    it("Given: edit mode When: rendering Then: should show save button", () => {
      mockBrandData = { id: "b-1", name: "Samsung", description: null };

      render(<BrandForm {...defaultProps} editId="b-1" />);

      expect(screen.getByText("save")).toBeInTheDocument();
    });

    it("Given: form When: rendering Then: should show cancel button", () => {
      render(<BrandForm {...defaultProps} />);

      expect(screen.getByText("cancel")).toBeInTheDocument();
    });

    it("Given: closed dialog When: rendering Then: should not be visible", () => {
      render(<BrandForm {...defaultProps} open={false} />);

      expect(screen.queryByText("form.createTitle")).not.toBeInTheDocument();
    });

    it("Given: create pending When: rendering Then: should show loading label", () => {
      mockCreateIsPending = true;

      render(<BrandForm {...defaultProps} />);

      expect(screen.getByText("loading")).toBeInTheDocument();
    });

    it("Given: update pending When: rendering Then: should show loading label", () => {
      mockBrandData = { id: "b-1", name: "Samsung", description: null };
      mockUpdateIsPending = true;

      render(<BrandForm {...defaultProps} editId="b-1" />);

      expect(screen.getByText("loading")).toBeInTheDocument();
    });
  });

  describe("edit mode prefill", () => {
    it("Given: edit mode with data When: rendering Then: should prefill name field", async () => {
      mockBrandData = {
        id: "b-1",
        name: "Samsung",
        description: "Electronics",
      };

      render(<BrandForm {...defaultProps} editId="b-1" />);

      await waitFor(() => {
        const nameInput = screen.getByPlaceholderText(
          "form.namePlaceholder",
        ) as HTMLInputElement;
        expect(nameInput.value).toBe("Samsung");
      });
    });

    it("Given: edit mode with null description When: rendering Then: should prefill name without description", async () => {
      mockBrandData = { id: "b-1", name: "Samsung", description: null };

      render(<BrandForm {...defaultProps} editId="b-1" />);

      await waitFor(() => {
        const nameInput = screen.getByPlaceholderText(
          "form.namePlaceholder",
        ) as HTMLInputElement;
        expect(nameInput.value).toBe("Samsung");
      });
    });
  });

  describe("interactions", () => {
    it("Given: cancel clicked When: user clicks cancel Then: should call onOpenChange(false)", () => {
      const onOpenChange = vi.fn();

      render(<BrandForm {...defaultProps} onOpenChange={onOpenChange} />);

      fireEvent.click(screen.getByText("cancel"));

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("Given: invalid name (empty) When: submitting Then: should show validation error and not call mutate", async () => {
      render(<BrandForm {...defaultProps} />);

      fireEvent.click(screen.getByText("create"));

      await waitFor(() => {
        expect(mockCreateMutateAsync).not.toHaveBeenCalled();
      });
    });
  });
});
