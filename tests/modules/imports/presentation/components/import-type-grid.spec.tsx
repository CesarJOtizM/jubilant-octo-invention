import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next-intl", () => ({
  useTranslations:
    (ns?: string) => (key: string, values?: Record<string, unknown>) => {
      const base = ns ? `${ns}.${key}` : key;
      if (values && typeof values.count === "number") {
        return `${base}:${values.count}`;
      }
      return base;
    },
}));

import { ImportTypeGrid } from "@/modules/imports/presentation/components/import-type-grid";
import type { ImportTypeSchema } from "@/modules/imports/domain/entities";

const buildSchema = (type: string, displayName: string): ImportTypeSchema => ({
  type,
  displayName,
  description: `${displayName} description`,
  columns: [],
  exampleRows: [],
});

const SCHEMAS: ImportTypeSchema[] = [
  buildSchema("PRODUCTS", "Products"),
  buildSchema("WAREHOUSES", "Warehouses"),
  buildSchema("STOCK", "Stock"),
];

describe("ImportTypeGrid", () => {
  const defaultProps = {
    schemas: SCHEMAS,
    isLoading: false,
    isError: false,
    onImport: vi.fn(),
    onDownloadTemplate: vi.fn(),
    isDownloading: false,
  };

  it("Given: schemas available When: rendering Then: should render a card per schema", () => {
    render(<ImportTypeGrid {...defaultProps} />);

    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Warehouses")).toBeInTheDocument();
    expect(screen.getByText("Stock")).toBeInTheDocument();
    expect(screen.getAllByText("imports.startImport")).toHaveLength(3);
  });

  it("Given: isLoading When: rendering Then: should show the loading state", () => {
    render(<ImportTypeGrid {...defaultProps} schemas={undefined} isLoading />);

    expect(
      screen.getByText("imports.catalog.loadingTitle"),
    ).toBeInTheDocument();
  });

  it("Given: isError When: rendering Then: should show the error state", () => {
    render(
      <ImportTypeGrid
        {...defaultProps}
        schemas={undefined}
        isLoading={false}
        isError
      />,
    );

    expect(
      screen.getByText("imports.catalog.loadFailedTitle"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("imports.catalog.loadFailedDescription"),
    ).toBeInTheDocument();
  });

  it("Given: empty schemas When: rendering Then: should show the empty state", () => {
    render(<ImportTypeGrid {...defaultProps} schemas={[]} />);

    expect(
      screen.getByText("imports.catalog.emptyTitle"),
    ).toBeInTheDocument();
  });
});
