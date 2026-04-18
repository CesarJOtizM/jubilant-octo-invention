export interface ImportRowError {
  rowNumber: number;
  column?: string;
  value?: string;
  error: string;
  severity: "error" | "warning";
}

export interface ImportStructureError {
  message: string;
}

/**
 * A group of spellings that collapse to the same case-insensitive key
 * ("Nike" / "NIKE" / "nike"). The backend surfaces these so the UI can
 * warn the user about probable typos before they import.
 */
export interface ImportReferenceDuplicateGroup {
  readonly canonical: string;
  readonly variants: readonly string[];
}

/**
 * Read-only snapshot of the references a file would create or reuse on
 * execute. Built by the backend's reference analysis service and
 * rendered in the wizard's preview step as actionable warnings.
 */
export interface ImportReferenceSummary {
  readonly newBrandsToCreate: readonly string[];
  readonly existingBrandsReferenced: readonly string[];
  readonly newCategoriesToCreate: readonly string[];
  readonly existingCategoriesReferenced: readonly string[];
  readonly possibleBrandDuplicates: readonly ImportReferenceDuplicateGroup[];
  readonly possibleCategoryDuplicates: readonly ImportReferenceDuplicateGroup[];
}

export class ImportPreview {
  constructor(
    public readonly totalRows: number,
    public readonly validRows: number,
    public readonly invalidRows: number,
    public readonly structureErrors: ImportStructureError[],
    public readonly rowErrors: ImportRowError[],
    public readonly warnings: string[],
    public readonly references: ImportReferenceSummary = {
      newBrandsToCreate: [],
      existingBrandsReferenced: [],
      newCategoriesToCreate: [],
      existingCategoriesReferenced: [],
      possibleBrandDuplicates: [],
      possibleCategoryDuplicates: [],
    },
  ) {}

  get canBeProcessed(): boolean {
    return this.structureErrors.length === 0 && this.invalidRows === 0;
  }

  get hasWarnings(): boolean {
    return this.warnings.length > 0;
  }

  /**
   * True when the file references any brand or category that would be
   * created (new) or reused (existing) on execute.
   */
  get hasReferences(): boolean {
    return (
      this.references.newBrandsToCreate.length > 0 ||
      this.references.existingBrandsReferenced.length > 0 ||
      this.references.newCategoriesToCreate.length > 0 ||
      this.references.existingCategoriesReferenced.length > 0
    );
  }

  get hasPossibleDuplicates(): boolean {
    return (
      this.references.possibleBrandDuplicates.length > 0 ||
      this.references.possibleCategoryDuplicates.length > 0
    );
  }
}
