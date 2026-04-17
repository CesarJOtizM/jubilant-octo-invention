import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockFetchNextPage = vi.fn();

const mockSales = [
  {
    id: "s1",
    saleNumber: "S-001",
    status: "COMPLETED",
    warehouseName: "Main",
    currency: "COP",
    totalAmount: 1000,
  },
  {
    id: "s2",
    saleNumber: "S-002",
    status: "DRAFT",
    warehouseName: "Main",
    currency: "COP",
    totalAmount: 500,
  },
  {
    id: "s3",
    saleNumber: "S-003",
    status: "COMPLETED",
    warehouseName: "Secondary",
    currency: "COP",
    totalAmount: 2000,
  },
];

let mockHookState: {
  sales: typeof mockSales;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: typeof mockFetchNextPage;
  isError: boolean;
};

vi.mock("@/modules/sales/presentation/hooks/use-sales-search", () => ({
  useSalesSearch: () => mockHookState,
}));

import { SalesSearchSelect } from "@/modules/returns/presentation/components/shared/sales-search-select";

describe("SalesSearchSelect", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    mockFetchNextPage.mockReset();
    mockHookState = {
      sales: mockSales,
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: mockFetchNextPage,
      isError: false,
    };
  });

  const renderWithProviders = (ui: React.ReactElement) =>
    render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
    );

  describe("rendering", () => {
    it("Given: no selection When: rendering Then: should show default placeholder", () => {
      renderWithProviders(<SalesSearchSelect />);

      expect(screen.getByText("Seleccionar venta...")).toBeInTheDocument();
    });

    it("Given: custom placeholder When: rendering Then: should show custom placeholder", () => {
      renderWithProviders(<SalesSearchSelect placeholder="Pick a sale" />);

      expect(screen.getByText("Pick a sale")).toBeInTheDocument();
    });

    it("Given: disabled prop When: rendering Then: should disable trigger", () => {
      renderWithProviders(<SalesSearchSelect disabled />);

      expect(screen.getByRole("combobox")).toBeDisabled();
    });

    it("Given: custom className When: rendering Then: should apply className to trigger", () => {
      renderWithProviders(<SalesSearchSelect className="my-custom-class" />);

      expect(screen.getByRole("combobox")).toHaveClass("my-custom-class");
    });
  });

  describe("opening the dropdown", () => {
    it("Given: trigger clicked When: opening Then: should show allowed sales", async () => {
      renderWithProviders(<SalesSearchSelect />);

      fireEvent.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(screen.getByText("S-001")).toBeInTheDocument();
        expect(screen.getByText("S-003")).toBeInTheDocument();
      });
    });

    it("Given: default excludeStatuses (DRAFT, CANCELLED) When: opening Then: should filter out DRAFT sales", async () => {
      renderWithProviders(<SalesSearchSelect />);

      fireEvent.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(screen.getByText("S-001")).toBeInTheDocument();
      });
      expect(screen.queryByText("S-002")).not.toBeInTheDocument();
    });

    it("Given: custom excludeStatuses When: opening Then: should only filter those statuses", async () => {
      renderWithProviders(<SalesSearchSelect excludeStatuses={["CANCELLED"]} />);

      fireEvent.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(screen.getByText("S-001")).toBeInTheDocument();
        // DRAFT is NOT excluded now, so S-002 appears
        expect(screen.getByText("S-002")).toBeInTheDocument();
      });
    });

    it("Given: no excludeStatuses When: opening Then: should show all sales", async () => {
      renderWithProviders(<SalesSearchSelect excludeStatuses={[]} />);

      fireEvent.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(screen.getByText("S-001")).toBeInTheDocument();
        expect(screen.getByText("S-002")).toBeInTheDocument();
        expect(screen.getByText("S-003")).toBeInTheDocument();
      });
    });

    it("Given: dropdown open When: rendering Then: should show search input with default placeholder", async () => {
      renderWithProviders(<SalesSearchSelect />);

      fireEvent.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(
            /buscar por número, cliente o referencia/i,
          ),
        ).toBeInTheDocument();
      });
    });

    it("Given: custom searchPlaceholder When: opening Then: should use it", async () => {
      renderWithProviders(<SalesSearchSelect searchPlaceholder="Buscar algo" />);

      fireEvent.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Buscar algo")).toBeInTheDocument();
      });
    });
  });

  describe("selection", () => {
    it("Given: dropdown open When: clicking a sale Then: should call onValueChange with id", async () => {
      const onValueChange = vi.fn();
      renderWithProviders(<SalesSearchSelect onValueChange={onValueChange} />);

      fireEvent.click(screen.getByRole("combobox"));

      await waitFor(() => expect(screen.getByText("S-001")).toBeInTheDocument());

      fireEvent.click(screen.getByText("S-001"));

      expect(onValueChange).toHaveBeenCalledWith("s1");
    });

    it("Given: value is set When: opening Then: should mark selected row with aria-selected", async () => {
      renderWithProviders(<SalesSearchSelect value="s1" />);

      fireEvent.click(screen.getByRole("combobox"));

      await waitFor(() => {
        const options = screen.getAllByRole("option");
        const selected = options.find(
          (o) => o.getAttribute("aria-selected") === "true",
        );
        expect(selected).toBeTruthy();
        expect(selected?.textContent).toContain("S-001");
      });
    });

    it("Given: sale selected When: closed Then: trigger shows label with number and total", () => {
      renderWithProviders(<SalesSearchSelect value="s1" />);

      expect(screen.getByText(/S-001/)).toBeInTheDocument();
      expect(screen.getByText(/1,000/)).toBeInTheDocument();
    });
  });

  describe("closing", () => {
    it("Given: dropdown open When: pressing Escape Then: should close dropdown", async () => {
      renderWithProviders(<SalesSearchSelect />);

      fireEvent.click(screen.getByRole("combobox"));
      await waitFor(() => expect(screen.getByText("S-001")).toBeInTheDocument());

      fireEvent.keyDown(document, { key: "Escape" });

      await waitFor(() => {
        expect(screen.queryByText("S-001")).not.toBeInTheDocument();
      });
    });

    it("Given: dropdown open When: clicking outside Then: should close", async () => {
      renderWithProviders(
        <div>
          <div data-testid="outside" />
          <SalesSearchSelect />
        </div>,
      );

      fireEvent.click(screen.getByRole("combobox"));
      await waitFor(() => expect(screen.getByText("S-001")).toBeInTheDocument());

      fireEvent.mouseDown(screen.getByTestId("outside"));

      await waitFor(() => {
        expect(screen.queryByText("S-001")).not.toBeInTheDocument();
      });
    });
  });

  describe("states", () => {
    it("Given: loading state and no data When: opening Then: should show loading message", async () => {
      mockHookState = {
        sales: [],
        isLoading: true,
        isFetchingNextPage: false,
        hasNextPage: false,
        fetchNextPage: mockFetchNextPage,
        isError: false,
      };
      renderWithProviders(<SalesSearchSelect />);

      fireEvent.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(screen.getByText(/cargando\.\.\./i)).toBeInTheDocument();
      });
    });

    it("Given: no sales and not loading When: opening Then: should show empty message", async () => {
      mockHookState = {
        sales: [],
        isLoading: false,
        isFetchingNextPage: false,
        hasNextPage: false,
        fetchNextPage: mockFetchNextPage,
        isError: false,
      };
      renderWithProviders(<SalesSearchSelect />);

      fireEvent.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(screen.getByText("Sin resultados")).toBeInTheDocument();
      });
    });

    it("Given: custom emptyMessage When: opening with no sales Then: should show it", async () => {
      mockHookState = {
        sales: [],
        isLoading: false,
        isFetchingNextPage: false,
        hasNextPage: false,
        fetchNextPage: mockFetchNextPage,
        isError: false,
      };
      renderWithProviders(<SalesSearchSelect emptyMessage="Nothing here" />);

      fireEvent.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(screen.getByText("Nothing here")).toBeInTheDocument();
      });
    });

    it("Given: fetching next page When: opening Then: should show 'Cargando más'", async () => {
      mockHookState = {
        sales: mockSales,
        isLoading: false,
        isFetchingNextPage: true,
        hasNextPage: true,
        fetchNextPage: mockFetchNextPage,
        isError: false,
      };
      renderWithProviders(<SalesSearchSelect />);

      fireEvent.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(screen.getByText(/cargando más/i)).toBeInTheDocument();
      });
    });
  });

  describe("search input", () => {
    it("Given: dropdown open When: typing in search Then: should update input value", async () => {
      renderWithProviders(<SalesSearchSelect />);

      fireEvent.click(screen.getByRole("combobox"));
      const input = await screen.findByPlaceholderText(
        /buscar por número/i,
      );

      fireEvent.change(input, { target: { value: "S-001" } });

      expect((input as HTMLInputElement).value).toBe("S-001");
    });
  });

  describe("disabled state", () => {
    it("Given: disabled true When: clicking trigger Then: should not open dropdown", async () => {
      renderWithProviders(<SalesSearchSelect disabled />);

      fireEvent.click(screen.getByRole("combobox"));

      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(screen.queryByText("S-001")).not.toBeInTheDocument();
    });
  });
});
