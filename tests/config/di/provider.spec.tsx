import { describe, it, expect, vi } from "vitest";
import { render, screen, renderHook } from "@testing-library/react";
import {
  ContainerProvider,
  useContainer,
} from "@/config/di/provider";

describe("ContainerProvider", () => {
  it("Given: no provider When: useContainer is called Then: should throw an error", () => {
    // Suppress React's error boundary console noise
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      renderHook(() => useContainer());
    }).toThrow(/useContainer must be used within a ContainerProvider/);

    errorSpy.mockRestore();
  });

  it("Given: children inside provider When: rendering Then: should render the children", () => {
    render(
      <ContainerProvider>
        <div data-testid="child">hello</div>
      </ContainerProvider>,
    );

    expect(screen.getByTestId("child")).toHaveTextContent("hello");
  });

  it("Given: a component using useContainer inside provider When: rendering Then: should receive the container with repositories", () => {
    function Consumer() {
      const container = useContainer();
      return (
        <div>
          <span data-testid="has-auth">
            {container.authRepository ? "yes" : "no"}
          </span>
          <span data-testid="has-product">
            {container.productRepository ? "yes" : "no"}
          </span>
          <span data-testid="has-combo">
            {container.comboRepository ? "yes" : "no"}
          </span>
          <span data-testid="has-brand">
            {container.brandRepository ? "yes" : "no"}
          </span>
        </div>
      );
    }

    render(
      <ContainerProvider>
        <Consumer />
      </ContainerProvider>,
    );

    expect(screen.getByTestId("has-auth")).toHaveTextContent("yes");
    expect(screen.getByTestId("has-product")).toHaveTextContent("yes");
    expect(screen.getByTestId("has-combo")).toHaveTextContent("yes");
    expect(screen.getByTestId("has-brand")).toHaveTextContent("yes");
  });

  it("Given: renderHook with provider wrapper When: using useContainer Then: should return container instance", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ContainerProvider>{children}</ContainerProvider>
    );

    const { result } = renderHook(() => useContainer(), { wrapper });

    expect(result.current).toBeTruthy();
    expect(result.current.authRepository).toBeDefined();
  });
});
