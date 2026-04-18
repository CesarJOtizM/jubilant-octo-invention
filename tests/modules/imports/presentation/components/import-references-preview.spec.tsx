import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("next-intl", () => ({
  useTranslations:
    () => (key: string, values?: Record<string, string | number>) => {
      if (values && "count" in values) return `${key}:${values.count}`;
      if (values && "canonical" in values && "variants" in values) {
        return `${values.canonical} → ${values.variants}`;
      }
      return key;
    },
}));

import { ImportReferencesPreview } from "@/modules/imports/presentation/components/import-references-preview";
import type { ImportReferenceSummary } from "@/modules/imports/domain/entities";

const EMPTY: ImportReferenceSummary = {
  newBrandsToCreate: [],
  existingBrandsReferenced: [],
  newCategoriesToCreate: [],
  existingCategoriesReferenced: [],
  possibleBrandDuplicates: [],
  possibleCategoryDuplicates: [],
};

describe("ImportReferencesPreview", () => {
  it("Given: no references and no duplicates When: rendering Then: should show the clean confirmation", () => {
    render(
      <ImportReferencesPreview
        references={EMPTY}
        hasReferences={false}
        hasPossibleDuplicates={false}
      />,
    );

    expect(screen.getByText("cleanTitle")).toBeInTheDocument();
    expect(screen.getByText("cleanDescription")).toBeInTheDocument();
  });

  it("Given: new brands to create When: rendering Then: should show them as chips", () => {
    const references: ImportReferenceSummary = {
      ...EMPTY,
      newBrandsToCreate: ["Nike", "Adidas", "Puma"],
    };

    render(
      <ImportReferencesPreview
        references={references}
        hasReferences
        hasPossibleDuplicates={false}
      />,
    );

    expect(screen.getByText("Nike")).toBeInTheDocument();
    expect(screen.getByText("Adidas")).toBeInTheDocument();
    expect(screen.getByText("Puma")).toBeInTheDocument();
    expect(screen.getByText("newBrandsTitle:3")).toBeInTheDocument();
  });

  it("Given: more brands than the collapsed limit When: rendering Then: should show a 'show more' toggle", () => {
    const references: ImportReferenceSummary = {
      ...EMPTY,
      newBrandsToCreate: Array.from({ length: 12 }, (_, i) => `Brand${i + 1}`),
    };

    render(
      <ImportReferencesPreview
        references={references}
        hasReferences
        hasPossibleDuplicates={false}
      />,
    );

    // Collapsed: 8 chips visible, the rest hidden behind a "showMore:4"
    // label in our stubbed translation format.
    expect(screen.getByText("showMore:4")).toBeInTheDocument();

    fireEvent.click(screen.getByText("showMore:4"));

    expect(screen.getByText("Brand12")).toBeInTheDocument();
  });

  it("Given: possible brand duplicates When: rendering Then: should surface the warning block", () => {
    const references: ImportReferenceSummary = {
      ...EMPTY,
      possibleBrandDuplicates: [
        { canonical: "Nike", variants: ["Nike", "NIKE", "nike"] },
      ],
    };

    render(
      <ImportReferencesPreview
        references={references}
        hasReferences={false}
        hasPossibleDuplicates
      />,
    );

    expect(screen.getByText("duplicatesBrandTitle")).toBeInTheDocument();
    expect(screen.getByText(/Nike.*Nike · NIKE · nike/)).toBeInTheDocument();
  });
});
