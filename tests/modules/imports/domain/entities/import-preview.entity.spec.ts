import { describe, it, expect } from "vitest";
import { ImportPreview } from "@/modules/imports/domain/entities/import-preview.entity";

describe("ImportPreview", () => {
  it("should indicate canBeProcessed when no errors", () => {
    const preview = new ImportPreview(10, 10, 0, [], [], []);
    expect(preview.canBeProcessed).toBe(true);
  });

  it("should not be processable with structure errors", () => {
    const preview = new ImportPreview(
      10,
      10,
      0,
      [{ message: "Missing column" }],
      [],
      [],
    );
    expect(preview.canBeProcessed).toBe(false);
  });

  it("should not be processable with invalid rows", () => {
    const preview = new ImportPreview(10, 8, 2, [], [], []);
    expect(preview.canBeProcessed).toBe(false);
  });

  it("should detect warnings", () => {
    const preview = new ImportPreview(10, 10, 0, [], [], ["Unknown column"]);
    expect(preview.hasWarnings).toBe(true);
  });

  it("should return false for hasWarnings when none", () => {
    const preview = new ImportPreview(10, 10, 0, [], [], []);
    expect(preview.hasWarnings).toBe(false);
  });

  it("Given: no references argument When: constructed Then: hasReferences and hasPossibleDuplicates should be false", () => {
    const preview = new ImportPreview(10, 10, 0, [], [], []);

    expect(preview.hasReferences).toBe(false);
    expect(preview.hasPossibleDuplicates).toBe(false);
    expect(preview.references.newBrandsToCreate).toEqual([]);
  });

  it("Given: new brands to create When: accessing Then: hasReferences should be true", () => {
    const preview = new ImportPreview(2, 2, 0, [], [], [], {
      newBrandsToCreate: ["Adidas"],
      existingBrandsReferenced: [],
      newCategoriesToCreate: [],
      existingCategoriesReferenced: [],
      possibleBrandDuplicates: [],
      possibleCategoryDuplicates: [],
    });

    expect(preview.hasReferences).toBe(true);
  });

  it("Given: possible brand duplicates When: accessing Then: hasPossibleDuplicates should be true", () => {
    const preview = new ImportPreview(2, 2, 0, [], [], [], {
      newBrandsToCreate: [],
      existingBrandsReferenced: [],
      newCategoriesToCreate: [],
      existingCategoriesReferenced: [],
      possibleBrandDuplicates: [
        { canonical: "Nike", variants: ["Nike", "NIKE"] },
      ],
      possibleCategoryDuplicates: [],
    });

    expect(preview.hasPossibleDuplicates).toBe(true);
  });
});
