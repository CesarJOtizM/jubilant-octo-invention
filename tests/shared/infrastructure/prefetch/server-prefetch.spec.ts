import { describe, it, expect } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import {
  createServerQueryClient,
  dehydrateState,
} from "@/shared/infrastructure/prefetch/server-prefetch";

describe("createServerQueryClient", () => {
  it("Given: no args When: called Then: should return a QueryClient instance", () => {
    const client = createServerQueryClient();

    expect(client).toBeInstanceOf(QueryClient);
  });

  it("Given: default options When: created Then: should apply staleTime 60s to queries", () => {
    const client = createServerQueryClient();

    const defaults = client.getDefaultOptions().queries;
    expect(defaults?.staleTime).toBe(60 * 1000);
  });

  it("Given: two calls When: created Then: should return independent clients", () => {
    const a = createServerQueryClient();
    const b = createServerQueryClient();

    expect(a).not.toBe(b);
  });
});

describe("dehydrateState", () => {
  it("Given: an empty QueryClient When: dehydrating Then: should return a serializable object with mutations and queries arrays", () => {
    const client = createServerQueryClient();

    const state = dehydrateState(client);

    expect(state).toBeTypeOf("object");
    expect(state).toHaveProperty("mutations");
    expect(state).toHaveProperty("queries");
    expect(Array.isArray(state.queries)).toBe(true);
  });

  it("Given: a QueryClient with cached data When: dehydrating Then: should include the query in the dehydrated state", async () => {
    const client = createServerQueryClient();
    await client.prefetchQuery({
      queryKey: ["sample"],
      queryFn: async () => ({ value: 42 }),
    });

    const state = dehydrateState(client);

    expect(state.queries.length).toBeGreaterThan(0);
    const sample = state.queries.find(
      (q: { queryKey: unknown[] }) =>
        Array.isArray(q.queryKey) && q.queryKey[0] === "sample",
    );
    expect(sample).toBeTruthy();
    expect(sample.state.data).toEqual({ value: 42 });
  });

  it("Given: any QueryClient When: dehydrating Then: the result should be JSON-serializable (no functions)", async () => {
    const client = createServerQueryClient();
    await client.prefetchQuery({
      queryKey: ["json-safe"],
      queryFn: async () => ({ hello: "world" }),
    });

    const state = dehydrateState(client);

    // The whole point of JSON.parse(JSON.stringify(...)) in the impl is to
    // strip non-serializable values. So a second round-trip must succeed.
    expect(() => JSON.stringify(state)).not.toThrow();
  });
});
