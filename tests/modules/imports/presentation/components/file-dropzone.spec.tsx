import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FileDropzone } from "@/modules/imports/presentation/components/file-dropzone";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, _values?: Record<string, unknown>) =>
    key,
}));

describe("FileDropzone", () => {
  it("renders dropzone with drag-drop instructions", () => {
    render(<FileDropzone onFileSelect={vi.fn()} />);
    expect(screen.getByText("dragDrop")).toBeDefined();
  });

  it("accepts a valid file via input", () => {
    const onSelect = vi.fn();
    render(<FileDropzone onFileSelect={onSelect} />);

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = new File(["content"], "test.csv", { type: "text/csv" });

    fireEvent.change(input, { target: { files: [file] } });

    expect(onSelect).toHaveBeenCalledWith(file);
  });

  it("shows selected file info after selection", () => {
    render(<FileDropzone onFileSelect={vi.fn()} />);

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = new File(["content"], "products.csv", { type: "text/csv" });

    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText("products.csv")).toBeDefined();
  });

  it("shows the supports hint text", () => {
    render(<FileDropzone onFileSelect={vi.fn()} />);
    // The dropzone uses imports.wizardFlow.supports now.
    expect(screen.getByText("supports")).toBeDefined();
  });
});
