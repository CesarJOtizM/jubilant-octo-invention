import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

const mockBrands = [
  { id: "b-1", name: "Samsung" },
  { id: "b-2", name: "LG" },
];

let mockIsLoading = false;

vi.mock("@/modules/brands/presentation/hooks/use-brands", () => ({
  useBrands: () => ({
    data: { data: mockBrands },
    isLoading: mockIsLoading,
  }),
}));

import { BrandSelector } from "@/modules/brands/presentation/components/brand-selector";

describe("BrandSelector", () => {
  const defaultProps = {
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockIsLoading = false;
  });

  it("Given: brands data When: rendering Then: should render select trigger", () => {
    render(<BrandSelector {...defaultProps} />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("Given: loading state When: rendering Then: should disable the select", () => {
    mockIsLoading = true;

    render(<BrandSelector {...defaultProps} />);

    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("Given: disabled prop When: rendering Then: should disable the select", () => {
    render(<BrandSelector {...defaultProps} disabled />);

    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("Given: custom placeholder When: rendering Then: should show placeholder", () => {
    render(<BrandSelector {...defaultProps} placeholder="Pick a brand" />);

    expect(screen.getByText("Pick a brand")).toBeInTheDocument();
  });

  it("Given: no placeholder When: rendering Then: should show default placeholder key", () => {
    render(<BrandSelector {...defaultProps} />);

    expect(screen.getByText("selector.placeholder")).toBeInTheDocument();
  });

  it("Given: value prop When: rendering Then: should not be disabled by value alone", () => {
    render(<BrandSelector {...defaultProps} value="b-1" />);

    expect(screen.getByRole("combobox")).not.toBeDisabled();
  });

  it("Given: allowClear true When: rendering Then: should render successfully", () => {
    render(<BrandSelector {...defaultProps} allowClear />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});
