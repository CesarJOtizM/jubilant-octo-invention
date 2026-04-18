import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

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

import { ImportTypeCard } from "@/modules/imports/presentation/components/import-type-card";
import type { ImportTypeSchema } from "@/modules/imports/domain/entities";

const PRODUCTS_SCHEMA: ImportTypeSchema = {
  type: "PRODUCTS",
  displayName: "Products",
  description: "Import the product catalog",
  columns: [
    {
      canonicalName: "sku",
      displayName: "SKU",
      description: "Unique SKU",
      dataType: "string",
      required: true,
      example: "PROD-001",
    },
    {
      canonicalName: "name",
      displayName: "Name",
      description: "Product name",
      dataType: "string",
      required: true,
      example: "Shirt",
    },
    {
      canonicalName: "status",
      displayName: "Status",
      description: "Product status",
      dataType: "enum",
      required: false,
      enumValues: ["ACTIVE", "INACTIVE"],
      example: "ACTIVE",
    },
  ],
  exampleRows: [],
};

describe("ImportTypeCard", () => {
  const defaultProps = {
    schema: PRODUCTS_SCHEMA,
    onImport: vi.fn(),
    onDownloadTemplate: vi.fn(),
    isDownloading: false,
  };

  it("Given: a schema When: rendering Then: should show the display name and description", () => {
    render(<ImportTypeCard {...defaultProps} />);

    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Import the product catalog")).toBeInTheDocument();
  });

  it("Given: the schema has required columns When: rendering Then: should show the required chip", () => {
    render(<ImportTypeCard {...defaultProps} />);

    // 2 required columns in the fixture.
    expect(
      screen.getByText("imports.catalog.required:2"),
    ).toBeInTheDocument();
  });

  it("Given: the schema has enum columns When: rendering Then: should show the enum hint", () => {
    render(<ImportTypeCard {...defaultProps} />);

    expect(
      screen.getByText("imports.catalog.enumHint:1"),
    ).toBeInTheDocument();
  });

  it("Given: the import button When: clicking Then: should call onImport with the type identifier", () => {
    const onImport = vi.fn();
    render(<ImportTypeCard {...defaultProps} onImport={onImport} />);

    fireEvent.click(screen.getByText("imports.startImport"));

    expect(onImport).toHaveBeenCalledWith("PRODUCTS");
  });

  it("Given: isDownloading is true When: rendering Then: should disable the template button", () => {
    render(<ImportTypeCard {...defaultProps} isDownloading={true} />);

    const templateButton = screen
      .getByText("imports.template.title")
      .closest("button");
    expect(templateButton).toBeDisabled();
  });

  it("Given: the columns toggle When: clicking Then: should reveal the column chips", () => {
    render(<ImportTypeCard {...defaultProps} />);

    const toggle = screen.getByText("imports.catalog.viewSchema");
    fireEvent.click(toggle);

    expect(screen.getByText("SKU")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });
});
