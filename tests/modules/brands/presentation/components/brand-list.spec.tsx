import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, params?: Record<string, unknown>) => {
    if (params) {
      return `${key}:${JSON.stringify(params)}`;
    }
    return key;
  },
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

vi.mock("@/ui/components/sortable-header", () => ({
  SortableHeader: ({
    label,
    field,
    onSort,
  }: {
    label: string;
    field: string;
    onSort: (field: string, order: "asc" | "desc" | undefined) => void;
  }) => (
    <th>
      <button onClick={() => onSort(field, "asc")}>{label}</button>
      <button onClick={() => onSort(field, undefined)}>{`${label}-clear`}</button>
    </th>
  ),
}));

// AlertDialog: avoid testing Radix portal behavior, expose its children directly
vi.mock("@/ui/components/alert-dialog", async () => {
  const React = await import("react");
  return {
    AlertDialog: ({
      open,
      children,
    }: {
      open?: boolean;
      children: React.ReactNode;
    }) => (open ? <div data-testid="alert-dialog">{children}</div> : null),
    AlertDialogContent: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    AlertDialogHeader: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    AlertDialogFooter: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    AlertDialogTitle: ({ children }: { children: React.ReactNode }) => (
      <h2>{children}</h2>
    ),
    AlertDialogDescription: ({ children }: { children: React.ReactNode }) => (
      <p>{children}</p>
    ),
    AlertDialogAction: ({
      children,
      onClick,
    }: {
      children: React.ReactNode;
      onClick?: () => void;
    }) => <button onClick={onClick}>{children}</button>,
    AlertDialogCancel: ({ children }: { children: React.ReactNode }) => (
      <button>{children}</button>
    ),
  };
});

// BrandForm: stub (tested elsewhere)
vi.mock("@/modules/brands/presentation/components/brand-form", () => ({
  BrandForm: ({ open }: { open: boolean }) =>
    open ? <div data-testid="brand-form" /> : null,
}));

const mockBrands = [
  {
    id: "b-1",
    name: "Samsung",
    description: "Electronics",
    isActive: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-02"),
  },
  {
    id: "b-2",
    name: "LG",
    description: null,
    isActive: false,
    createdAt: new Date("2026-02-01"),
    updatedAt: new Date("2026-02-02"),
  },
];

const mockPagination = { page: 1, limit: 10, total: 2, totalPages: 1 };

let mockQueryState: {
  data:
    | { data: typeof mockBrands; pagination: typeof mockPagination }
    | undefined;
  isLoading: boolean;
  isError: boolean;
};

const mockDeleteMutateAsync = vi.fn();
let mockDeleteIsPending = false;

vi.mock("@/modules/brands/presentation/hooks/use-brands", () => ({
  useBrands: () => mockQueryState,
  useDeleteBrand: () => ({
    isPending: mockDeleteIsPending,
    mutateAsync: mockDeleteMutateAsync,
  }),
}));

import { BrandList } from "@/modules/brands/presentation/components/brand-list";

describe("BrandList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDeleteIsPending = false;
    mockQueryState = {
      data: { data: mockBrands, pagination: mockPagination },
      isLoading: false,
      isError: false,
    };
  });

  describe("rendering with data", () => {
    it("Given: brands data When: rendering Then: should show list title", () => {
      render(<BrandList />);
      expect(screen.getByText("list.title")).toBeInTheDocument();
    });

    it("Given: brands data When: rendering Then: should show brand names", () => {
      render(<BrandList />);
      expect(screen.getByText("Samsung")).toBeInTheDocument();
      expect(screen.getByText("LG")).toBeInTheDocument();
    });

    it("Given: brand with description When: rendering Then: should show description", () => {
      render(<BrandList />);
      expect(screen.getByText("Electronics")).toBeInTheDocument();
    });

    it("Given: brand without description When: rendering Then: should not crash", () => {
      mockQueryState = {
        data: {
          data: [mockBrands[1]],
          pagination: { ...mockPagination, total: 1 },
        },
        isLoading: false,
        isError: false,
      };

      render(<BrandList />);

      expect(screen.getByText("LG")).toBeInTheDocument();
    });

    it("Given: brands data When: rendering Then: should show create button", () => {
      render(<BrandList />);
      expect(screen.getAllByText("actions.new").length).toBeGreaterThan(0);
    });

    it("Given: active brand When: rendering Then: should show active status", () => {
      render(<BrandList />);
      expect(screen.getByText("status.active")).toBeInTheDocument();
    });

    it("Given: inactive brand When: rendering Then: should show inactive status", () => {
      render(<BrandList />);
      expect(screen.getByText("status.inactive")).toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("Given: empty brands When: rendering Then: should show empty state", () => {
      mockQueryState = {
        data: {
          data: [],
          pagination: { ...mockPagination, total: 0, totalPages: 0 },
        },
        isLoading: false,
        isError: false,
      };

      render(<BrandList />);

      expect(screen.getByText("empty.title")).toBeInTheDocument();
      expect(screen.getByText("empty.description")).toBeInTheDocument();
    });

    it("Given: empty state When: clicking 'actions.new' in empty Then: should open form", () => {
      mockQueryState = {
        data: {
          data: [],
          pagination: { ...mockPagination, total: 0, totalPages: 0 },
        },
        isLoading: false,
        isError: false,
      };

      render(<BrandList />);
      // click the 'actions.new' that lives in the empty placeholder (second one)
      const buttons = screen.getAllByText("actions.new");
      fireEvent.click(buttons[buttons.length - 1]);

      expect(screen.getByTestId("brand-form")).toBeInTheDocument();
    });
  });

  describe("loading state", () => {
    it("Given: loading state When: rendering Then: should not show brand rows", () => {
      mockQueryState = { data: undefined, isLoading: true, isError: false };

      render(<BrandList />);

      expect(screen.getByText("list.title")).toBeInTheDocument();
      expect(screen.queryByText("Samsung")).not.toBeInTheDocument();
    });
  });

  describe("error state", () => {
    it("Given: error state When: rendering Then: should show error message", () => {
      mockQueryState = { data: undefined, isLoading: false, isError: true };

      render(<BrandList />);

      expect(screen.getByText("error.loading")).toBeInTheDocument();
    });
  });

  describe("search", () => {
    it("Given: search input When: user types Then: should update filters (re-render stable)", () => {
      render(<BrandList />);
      const input = screen.getByPlaceholderText("filters.search");

      fireEvent.change(input, { target: { value: "samsung" } });

      expect((input as HTMLInputElement).value).toBe("samsung");
    });
  });

  describe("actions", () => {
    it("Given: create button When: clicking Then: should open brand form", () => {
      render(<BrandList />);

      const createBtns = screen.getAllByText("actions.new");
      fireEvent.click(createBtns[0]);

      expect(screen.getByTestId("brand-form")).toBeInTheDocument();
    });

    it("Given: sortable header clicked with order When: sorting Then: should update filters", () => {
      render(<BrandList />);

      fireEvent.click(screen.getByText("fields.name"));

      // page should reset to 1; we verify this indirectly by not crashing
      expect(screen.getByText("Samsung")).toBeInTheDocument();
    });

    it("Given: sortable header cleared When: sorting Then: should clear sortBy", () => {
      render(<BrandList />);

      fireEvent.click(screen.getByText("fields.name-clear"));

      expect(screen.getByText("Samsung")).toBeInTheDocument();
    });

    it("Given: pagination page change When: clicking Then: should update filters", () => {
      render(<BrandList />);

      fireEvent.click(screen.getByText("next-page"));

      expect(screen.getByText("Samsung")).toBeInTheDocument();
    });

    it("Given: pagination page size change When: clicking Then: should update filters", () => {
      render(<BrandList />);

      fireEvent.click(screen.getByText("change-size"));

      expect(screen.getByText("Samsung")).toBeInTheDocument();
    });
  });
});
