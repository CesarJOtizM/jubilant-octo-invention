import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Company } from "@/modules/companies/domain/entities/company.entity";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, values?: Record<string, unknown>) => {
    if (values && "step" in values && "total" in values) {
      return `${values.step}/${values.total}`;
    }
    if (values && "type" in values) {
      return `wizard.title:${values.type}`;
    }
    return key;
  },
}));

vi.mock("@/ui/components/dialog", () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-content">{children}</div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-header">{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="dialog-title">{children}</h2>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p data-testid="dialog-description">{children}</p>
  ),
}));

vi.mock("@/modules/imports/presentation/components/file-dropzone", () => ({
  FileDropzone: ({
    onFileSelect,
  }: {
    onFileSelect: (file: File | null) => void;
  }) => (
    <div data-testid="file-dropzone">
      <button
        type="button"
        data-testid="select-file"
        onClick={() =>
          onFileSelect(
            new File(["sku,wh,qty"], "stock.csv", { type: "text/csv" }),
          )
        }
      >
        select-file
      </button>
    </div>
  ),
}));

vi.mock(
  "@/modules/imports/presentation/components/import-preview-results",
  () => ({
    ImportPreviewResults: () => (
      <div data-testid="preview-results">PreviewResults</div>
    ),
  }),
);

vi.mock("@/modules/imports/presentation/components/import-progress", () => ({
  ImportProgress: () => <div data-testid="import-progress">ImportProgress</div>,
}));

vi.mock("@/ui/components/card", () => ({
  Card: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    role?: string;
  }) => <div {...props}>{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <h3>{children}</h3>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const mockPreviewMutation = {
  mutateAsync: vi.fn(),
  isPending: false,
};

const mockExecuteMutation = {
  mutateAsync: vi.fn(),
  isPending: false,
};

vi.mock("@/modules/imports/presentation/hooks/use-imports", () => ({
  usePreviewImport: () => mockPreviewMutation,
  useExecuteImport: () => mockExecuteMutation,
}));

let mockSelectedCompanyId: string | null = null;

vi.mock("@/modules/companies/infrastructure/store/company.store", () => ({
  useCompanyStore: (
    selector: (state: {
      selectedCompanyId: string | null;
      setSelectedCompany: (id: string | null) => void;
    }) => unknown,
  ) =>
    selector({
      selectedCompanyId: mockSelectedCompanyId,
      setSelectedCompany: vi.fn(),
    }),
}));

const mockCompany = Company.create({
  id: "company-42",
  name: "Tekshop",
  code: "NEG-002",
  description: null,
  isActive: true,
  productCount: 0,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
});

vi.mock("@/modules/companies/presentation/hooks/use-companies", () => ({
  useCompany: (id: string) => ({
    data: id === "company-42" ? mockCompany : undefined,
    isLoading: false,
  }),
  useCompanies: () => ({ data: undefined }),
}));

import { ImportWizardDialog } from "@/modules/imports/presentation/components/import-wizard-dialog";
import type { ImportTypeSchema } from "@/modules/imports/domain/entities";

const PRODUCTS_SCHEMA: ImportTypeSchema = {
  type: "PRODUCTS",
  displayName: "Products",
  description: "Import the product catalog",
  columns: [],
  exampleRows: [],
};

const STOCK_SCHEMA: ImportTypeSchema = {
  type: "STOCK",
  displayName: "Stock",
  description: "Import stock levels",
  columns: [],
  exampleRows: [],
};

const SALES_SCHEMA: ImportTypeSchema = {
  type: "SALES",
  displayName: "Sales",
  description: "Import sales",
  columns: [],
  exampleRows: [],
};

describe("ImportWizardDialog", () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    schema: PRODUCTS_SCHEMA,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSelectedCompanyId = null;
    mockPreviewMutation.mutateAsync.mockResolvedValue({
      totalRows: 1,
      validRows: 1,
      invalidRows: 0,
      structureErrors: [],
      rowErrors: [],
      warnings: [],
      canBeProcessed: true,
    });
    mockExecuteMutation.mutateAsync.mockResolvedValue({ id: "batch-1" });
  });

  it("Given: open is true with a schema When: rendering Then: should show the dialog", () => {
    render(<ImportWizardDialog {...defaultProps} />);

    expect(screen.getByTestId("dialog")).toBeInTheDocument();
  });

  it("Given: a schema When: rendering Then: should pass its displayName to the title", () => {
    render(<ImportWizardDialog {...defaultProps} />);

    expect(screen.getByTestId("dialog-title")).toHaveTextContent("Products");
  });

  it("Given: schema is null When: rendering Then: should not render the dialog", () => {
    render(<ImportWizardDialog {...defaultProps} schema={null} />);

    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
  });

  it("Given: open is false When: rendering Then: should not render the dialog", () => {
    render(<ImportWizardDialog {...defaultProps} open={false} />);

    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
  });

  it("Given: the wizard on upload step When: rendering Then: should show the file dropzone", () => {
    render(<ImportWizardDialog {...defaultProps} />);

    expect(screen.getByTestId("file-dropzone")).toBeInTheDocument();
  });

  it("Given: the wizard When: rendering Then: should show all three step labels", () => {
    render(<ImportWizardDialog {...defaultProps} />);

    expect(screen.getByText("wizard.step1")).toBeInTheDocument();
    expect(screen.getByText("wizard.step2")).toBeInTheDocument();
    expect(screen.getByText("wizard.step3")).toBeInTheDocument();
  });

  it("Given: STOCK import and selectedCompanyId null When: rendering Then: blocks preview and shows required-company copy", () => {
    mockSelectedCompanyId = null;

    render(
      <ImportWizardDialog
        {...defaultProps}
        schema={STOCK_SCHEMA}
      />,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("requiredCompany.title")).toBeInTheDocument();
    expect(screen.getByText("requiredCompany.description")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /runDryRun/i }),
    ).toBeDisabled();
  });

  it("Given: STOCK import and specific company When: validating Then: preview receives company bind", async () => {
    mockSelectedCompanyId = "company-42";

    render(
      <ImportWizardDialog
        {...defaultProps}
        schema={STOCK_SCHEMA}
      />,
    );

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("select-file"));
    fireEvent.click(screen.getByRole("button", { name: /runDryRun/i }));

    await waitFor(() => {
      expect(mockPreviewMutation.mutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "STOCK",
          company: {
            companyId: "company-42",
            companyCode: "NEG-002",
          },
        }),
      );
    });
  });

  it("Given: PRODUCTS import and null company When: rendering Then: does not show company guard", () => {
    mockSelectedCompanyId = null;

    render(<ImportWizardDialog {...defaultProps} schema={PRODUCTS_SCHEMA} />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /runDryRun/i }),
    ).toBeDisabled(); // still disabled: no file yet
  });

  it("Given: SALES import and selectedCompanyId null When: rendering Then: blocks preview and shows required-company copy", () => {
    mockSelectedCompanyId = null;

    render(
      <ImportWizardDialog {...defaultProps} schema={SALES_SCHEMA} />,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("requiredCompany.title")).toBeInTheDocument();
  });
});
