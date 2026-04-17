import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockFindAll = vi.fn();

vi.mock("@/config/di/container", () => ({
  getContainer: () => ({
    saleRepository: {
      findAll: mockFindAll,
    },
  }),
}));

import { useSalesSearch } from "@/modules/sales/presentation/hooks/use-sales-search";

describe("useSalesSearch", () => {
  let queryClient: QueryClient;

  const mockSale = (id: string, num: string) => ({
    id,
    saleNumber: num,
    status: "COMPLETED",
    total: 100,
  });

  const mockPage = (sales: unknown[], page: number, totalPages = 1) => ({
    data: sales,
    pagination: {
      page,
      limit: 20,
      total: sales.length,
      totalPages,
    },
  });

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    mockFindAll.mockReset();
  });

  afterEach(() => {
    queryClient.clear();
  });

  const wrapper = (props: { children: React.ReactNode }) =>
    React.createElement(
      QueryClientProvider,
      { client: queryClient },
      props.children,
    );

  it("Given: hook is enabled (default) When: rendering Then: should fetch sales", async () => {
    mockFindAll.mockResolvedValue(
      mockPage([mockSale("s1", "S-001"), mockSale("s2", "S-002")], 1),
    );

    const { result } = renderHook(() => useSalesSearch(), { wrapper });

    await waitFor(() => {
      expect(result.current.sales).toHaveLength(2);
    });

    expect(result.current.sales[0].saleNumber).toBe("S-001");
    expect(result.current.isLoading).toBe(false);
  });

  it("Given: hook is disabled When: rendering Then: should not fetch", async () => {
    mockFindAll.mockResolvedValue(mockPage([], 1));

    const { result } = renderHook(() => useSalesSearch({ enabled: false }), {
      wrapper,
    });

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(result.current.sales).toHaveLength(0);
    expect(mockFindAll).not.toHaveBeenCalled();
  });

  it("Given: companyId provided When: fetching Then: should include companyId in filters", async () => {
    mockFindAll.mockResolvedValue(mockPage([mockSale("s1", "S-001")], 1));

    renderHook(() => useSalesSearch({ companyId: "comp-1" }), { wrapper });

    await waitFor(() => expect(mockFindAll).toHaveBeenCalled());

    const callArgs = mockFindAll.mock.calls[0][0];
    expect(callArgs.companyId).toBe("comp-1");
    expect(callArgs.limit).toBe(20);
  });

  it("Given: statuses provided When: fetching Then: should include status in filters", async () => {
    mockFindAll.mockResolvedValue(mockPage([], 1));

    renderHook(() => useSalesSearch({ statuses: ["COMPLETED", "CONFIRMED"] }), {
      wrapper,
    });

    await waitFor(() => expect(mockFindAll).toHaveBeenCalled());

    const callArgs = mockFindAll.mock.calls[0][0];
    expect(callArgs.status).toEqual(["COMPLETED", "CONFIRMED"]);
  });

  it("Given: search term When: debounce expires Then: should pass search to query", async () => {
    mockFindAll.mockResolvedValue(mockPage([mockSale("s1", "S-001")], 1));

    const { rerender } = renderHook(
      ({ search }: { search: string }) => useSalesSearch({ search }),
      { wrapper, initialProps: { search: "" } },
    );

    await waitFor(() => expect(mockFindAll).toHaveBeenCalled());
    mockFindAll.mockClear();

    rerender({ search: "S-001" });

    // debounce 300ms
    await new Promise((resolve) => setTimeout(resolve, 350));

    await waitFor(() => expect(mockFindAll).toHaveBeenCalled());
    const lastCall = mockFindAll.mock.calls[mockFindAll.mock.calls.length - 1];
    expect(lastCall[0].search).toBe("S-001");
  });

  it("Given: search term cleared before debounce When: typing rapidly Then: only last value is sent", async () => {
    mockFindAll.mockResolvedValue(mockPage([], 1));

    const { rerender } = renderHook(
      ({ search }: { search: string }) => useSalesSearch({ search }),
      { wrapper, initialProps: { search: "a" } },
    );

    rerender({ search: "ab" });
    rerender({ search: "abc" });

    await new Promise((resolve) => setTimeout(resolve, 350));
    await waitFor(() => expect(mockFindAll).toHaveBeenCalled());

    const lastCall = mockFindAll.mock.calls[mockFindAll.mock.calls.length - 1];
    expect(lastCall[0].search).toBe("abc");
  });

  it("Given: single page response When: fetched Then: hasNextPage should be false", async () => {
    mockFindAll.mockResolvedValue(mockPage([mockSale("s1", "S-001")], 1, 1));

    const { result } = renderHook(() => useSalesSearch(), { wrapper });

    await waitFor(() => expect(result.current.sales).toHaveLength(1));
    expect(result.current.hasNextPage).toBe(false);
  });

  it("Given: multi-page response When: first page fetched Then: hasNextPage should be true", async () => {
    mockFindAll.mockResolvedValue(mockPage([mockSale("s1", "S-001")], 1, 2));

    const { result } = renderHook(() => useSalesSearch(), { wrapper });

    await waitFor(() => expect(result.current.sales).toHaveLength(1));
    expect(result.current.hasNextPage).toBe(true);
  });

  it("Given: multi-page response When: fetchNextPage is called Then: should append next page", async () => {
    mockFindAll
      .mockResolvedValueOnce(mockPage([mockSale("s1", "S-001")], 1, 2))
      .mockResolvedValueOnce(mockPage([mockSale("s2", "S-002")], 2, 2));

    const { result } = renderHook(() => useSalesSearch(), { wrapper });

    await waitFor(() => expect(result.current.sales).toHaveLength(1));

    await result.current.fetchNextPage();

    await waitFor(() => expect(result.current.sales).toHaveLength(2));
    expect(result.current.sales[0].saleNumber).toBe("S-001");
    expect(result.current.sales[1].saleNumber).toBe("S-002");
  });

  it("Given: server error When: fetching Then: isError should be true", async () => {
    mockFindAll.mockRejectedValue(new Error("network"));

    const { result } = renderHook(() => useSalesSearch(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("Given: no search/companyId/statuses When: fetching Then: filters should only have limit", async () => {
    mockFindAll.mockResolvedValue(mockPage([], 1));

    renderHook(() => useSalesSearch(), { wrapper });

    await waitFor(() => expect(mockFindAll).toHaveBeenCalled());
    const callArgs = mockFindAll.mock.calls[0][0];
    expect(callArgs.limit).toBe(20);
    expect(callArgs.search).toBeUndefined();
    expect(callArgs.companyId).toBeUndefined();
    expect(callArgs.status).toBeUndefined();
  });
});
