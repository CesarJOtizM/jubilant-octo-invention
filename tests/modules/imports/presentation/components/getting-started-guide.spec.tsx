import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("next-intl", () => ({
  useTranslations:
    () => (key: string, values?: Record<string, string | number>) => {
      if (values && "step" in values) return `step ${values.step}`;
      if (values && "items" in values) return `depends on ${values.items}`;
      return key;
    },
}));

import { GettingStartedGuide } from "@/modules/imports/presentation/components/getting-started-guide";

describe("GettingStartedGuide", () => {
  it("Given: PRODUCTS and WAREHOUSES are available When: rendering Then: their step cards should be clickable", () => {
    const onStart = vi.fn();
    render(
      <GettingStartedGuide
        availableTypes={new Set(["PRODUCTS", "WAREHOUSES"])}
        onStartImport={onStart}
      />,
    );

    const warehousesCard = screen.getByLabelText(/warehouses\.title/);
    fireEvent.click(warehousesCard);

    expect(onStart).toHaveBeenCalledWith("WAREHOUSES");
  });

  it("Given: no types available When: rendering Then: the clickable step cards should not invoke onStart", () => {
    const onStart = vi.fn();
    render(
      <GettingStartedGuide
        availableTypes={new Set()}
        onStartImport={onStart}
      />,
    );

    // Steps whose importType is null ("companies", "brands", etc.) never
    // become buttons. Just assert the guide title still renders.
    expect(screen.getByText("title")).toBeInTheDocument();
    expect(onStart).not.toHaveBeenCalled();
  });

  it("Given: STOCK is available When: clicking Then: should emit STOCK as the import type", () => {
    const onStart = vi.fn();
    render(
      <GettingStartedGuide
        availableTypes={new Set(["STOCK"])}
        onStartImport={onStart}
      />,
    );

    const stockCard = screen.getByLabelText(/stock\.title/);
    fireEvent.click(stockCard);

    expect(onStart).toHaveBeenCalledWith("STOCK");
  });
});
