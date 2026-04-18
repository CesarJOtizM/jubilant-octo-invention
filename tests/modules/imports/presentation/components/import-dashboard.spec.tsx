import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next-intl", () => ({
  useTranslations:
    (ns?: string) => (key: string, _values?: Record<string, unknown>) =>
      ns ? `${ns}.${key}` : key,
}));

vi.mock("@/modules/imports/presentation/components/import-type-grid", () => ({
  ImportTypeGrid: (props: { isDownloading?: boolean }) => (
    <div data-testid="import-type-grid" data-downloading={props.isDownloading}>
      ImportTypeGrid
    </div>
  ),
}));

vi.mock(
  "@/modules/imports/presentation/components/getting-started-guide",
  () => ({
    GettingStartedGuide: () => (
      <div data-testid="getting-started-guide">GettingStartedGuide</div>
    ),
  }),
);

vi.mock(
  "@/modules/imports/presentation/components/import-wizard-dialog",
  () => ({
    ImportWizardDialog: ({ open }: { open: boolean }) => (
      <div data-testid="import-wizard-dialog" data-open={open}>
        ImportWizardDialog
      </div>
    ),
  }),
);

vi.mock("@/modules/imports/presentation/components/import-history", () => ({
  ImportHistory: () => <div data-testid="import-history">ImportHistory</div>,
}));

vi.mock("@/modules/imports/presentation/hooks/use-imports", () => ({
  useDownloadTemplate: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useImportTypes: () => ({
    data: [],
    isLoading: false,
    isError: false,
  }),
}));

import { ImportDashboard } from "@/modules/imports/presentation/components/import-dashboard";

describe("ImportDashboard", () => {
  it("Given: the dashboard When: rendering Then: should show page title", () => {
    render(<ImportDashboard />);

    expect(screen.getByText("imports.title")).toBeInTheDocument();
  });

  it("Given: the dashboard When: rendering Then: should show page description", () => {
    render(<ImportDashboard />);

    expect(screen.getByText("imports.description")).toBeInTheDocument();
  });

  it("Given: the dashboard When: rendering Then: should render the getting-started guide", () => {
    render(<ImportDashboard />);

    expect(screen.getByTestId("getting-started-guide")).toBeInTheDocument();
  });

  it("Given: the dashboard When: rendering Then: should render the type grid", () => {
    render(<ImportDashboard />);

    expect(screen.getByTestId("import-type-grid")).toBeInTheDocument();
  });

  it("Given: the dashboard When: rendering Then: should render the wizard dialog", () => {
    render(<ImportDashboard />);

    expect(screen.getByTestId("import-wizard-dialog")).toBeInTheDocument();
  });

  it("Given: the dashboard When: rendering Then: should render the import history", () => {
    render(<ImportDashboard />);

    expect(screen.getByTestId("import-history")).toBeInTheDocument();
  });

  it("Given: the dashboard When: rendering Then: wizard should be closed by default", () => {
    render(<ImportDashboard />);

    const wizard = screen.getByTestId("import-wizard-dialog");
    expect(wizard).toHaveAttribute("data-open", "false");
  });
});
