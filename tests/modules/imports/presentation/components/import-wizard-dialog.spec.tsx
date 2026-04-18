import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

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
  FileDropzone: () => <div data-testid="file-dropzone">FileDropzone</div>,
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

import { ImportWizardDialog } from "@/modules/imports/presentation/components/import-wizard-dialog";
import type { ImportTypeSchema } from "@/modules/imports/domain/entities";

const PRODUCTS_SCHEMA: ImportTypeSchema = {
  type: "PRODUCTS",
  displayName: "Products",
  description: "Import the product catalog",
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
});
