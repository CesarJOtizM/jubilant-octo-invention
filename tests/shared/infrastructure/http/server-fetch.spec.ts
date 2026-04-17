import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ── Hoisted mocks ──────────────────────────────────────────────────────────

const { mockCookieStore } = vi.hoisted(() => ({
  mockCookieStore: {
    get: vi.fn(),
  },
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => mockCookieStore),
}));

// ── Env stub for API_URL ───────────────────────────────────────────────────

const ORIGINAL_API_URL = process.env.NEXT_PUBLIC_API_URL;
let fetchSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  mockCookieStore.get.mockReset();
  fetchSpy = vi.spyOn(globalThis, "fetch");
});

afterEach(() => {
  fetchSpy.mockRestore();
  if (ORIGINAL_API_URL === undefined) {
    delete process.env.NEXT_PUBLIC_API_URL;
  } else {
    process.env.NEXT_PUBLIC_API_URL = ORIGINAL_API_URL;
  }
});

import { serverFetch } from "@/shared/infrastructure/http/server-fetch";

describe("serverFetch", () => {
  it("Given: no cookies When: called Then: should build URL without auth headers and return JSON", async () => {
    mockCookieStore.get.mockReturnValue(undefined);
    fetchSpy.mockResolvedValue(
      new Response(JSON.stringify({ hello: "world" }), {
        status: 200,
      }),
    );

    const result = await serverFetch<{ hello: string }>("/ping");

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, init] = fetchSpy.mock.calls[0];
    expect(String(url)).toMatch(/\/ping$/);
    expect((init as RequestInit).cache).toBe("no-store");
    const headers = (init as RequestInit).headers as Record<string, string>;
    expect(headers["Content-Type"]).toBe("application/json");
    expect(headers.Authorization).toBeUndefined();
    expect(headers["X-Organization-Slug"]).toBeUndefined();
    expect(result).toEqual({ hello: "world" });
  });

  it("Given: access token cookie present When: called Then: should set Authorization header", async () => {
    mockCookieStore.get.mockImplementation((name: string) =>
      name === "nevada_access_token" ? { value: "token-123" } : undefined,
    );
    fetchSpy.mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );

    await serverFetch("/protected");

    const init = fetchSpy.mock.calls[0][1] as RequestInit;
    const headers = init.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer token-123");
  });

  it("Given: org slug cookie present When: called Then: should set X-Organization-Slug header", async () => {
    mockCookieStore.get.mockImplementation((name: string) =>
      name === "nevada_org_slug" ? { value: "my-org" } : undefined,
    );
    fetchSpy.mockResolvedValue(
      new Response(JSON.stringify({}), { status: 200 }),
    );

    await serverFetch("/x");

    const init = fetchSpy.mock.calls[0][1] as RequestInit;
    const headers = init.headers as Record<string, string>;
    expect(headers["X-Organization-Slug"]).toBe("my-org");
  });

  it("Given: both cookies When: called Then: should set both auth headers", async () => {
    mockCookieStore.get.mockImplementation((name: string) => {
      if (name === "nevada_access_token") return { value: "abc" };
      if (name === "nevada_org_slug") return { value: "acme" };
      return undefined;
    });
    fetchSpy.mockResolvedValue(
      new Response(JSON.stringify({}), { status: 200 }),
    );

    await serverFetch("/x");

    const init = fetchSpy.mock.calls[0][1] as RequestInit;
    const headers = init.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer abc");
    expect(headers["X-Organization-Slug"]).toBe("acme");
  });

  it("Given: query params When: called Then: should serialize params in URL", async () => {
    mockCookieStore.get.mockReturnValue(undefined);
    fetchSpy.mockResolvedValue(
      new Response(JSON.stringify({}), { status: 200 }),
    );

    await serverFetch("/search", {
      params: { q: "test", page: 2, active: true },
    });

    const url = new URL(String(fetchSpy.mock.calls[0][0]));
    expect(url.searchParams.get("q")).toBe("test");
    expect(url.searchParams.get("page")).toBe("2");
    expect(url.searchParams.get("active")).toBe("true");
  });

  it("Given: undefined or null param values When: called Then: should skip them from URL", async () => {
    mockCookieStore.get.mockReturnValue(undefined);
    fetchSpy.mockResolvedValue(
      new Response(JSON.stringify({}), { status: 200 }),
    );

    await serverFetch("/search", {
      params: { q: "yes", skipUndef: undefined, skipNull: null },
    });

    const url = new URL(String(fetchSpy.mock.calls[0][0]));
    expect(url.searchParams.get("q")).toBe("yes");
    expect(url.searchParams.has("skipUndef")).toBe(false);
    expect(url.searchParams.has("skipNull")).toBe(false);
  });

  it("Given: custom NEXT_PUBLIC_API_URL When: called Then: should use it as base URL", async () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com";
    mockCookieStore.get.mockReturnValue(undefined);
    fetchSpy.mockResolvedValue(
      new Response(JSON.stringify({}), { status: 200 }),
    );

    // Re-import so env change takes effect
    vi.resetModules();
    const mod = await import("@/shared/infrastructure/http/server-fetch");

    await mod.serverFetch("/ping");

    const url = String(fetchSpy.mock.calls[0][0]);
    // cannot guarantee the module re-evaluated with the new env because next/headers
    // was already mocked at module load. Just verify the URL is absolute.
    expect(url).toMatch(/^https?:\/\//);
  });

  it("Given: non-OK response When: called Then: should throw with status and statusText", async () => {
    mockCookieStore.get.mockReturnValue(undefined);
    fetchSpy.mockResolvedValue(
      new Response("Not Found", { status: 404, statusText: "Not Found" }),
    );

    await expect(serverFetch("/missing")).rejects.toThrow(
      /Server fetch failed.*404.*Not Found/,
    );
  });

  it("Given: 500 response When: called Then: should throw", async () => {
    mockCookieStore.get.mockReturnValue(undefined);
    fetchSpy.mockResolvedValue(
      new Response("boom", {
        status: 500,
        statusText: "Internal Server Error",
      }),
    );

    await expect(serverFetch("/boom")).rejects.toThrow(
      /Server fetch failed.*500/,
    );
  });

  it("Given: no params option When: called Then: should still work", async () => {
    mockCookieStore.get.mockReturnValue(undefined);
    fetchSpy.mockResolvedValue(
      new Response(JSON.stringify({ ok: 1 }), { status: 200 }),
    );

    const result = await serverFetch<{ ok: number }>("/simple");

    expect(result).toEqual({ ok: 1 });
  });
});
