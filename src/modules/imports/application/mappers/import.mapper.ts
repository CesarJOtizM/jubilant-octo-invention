import { ImportBatch } from "@/modules/imports/domain/entities/import-batch.entity";
import {
  ImportPreview,
  type ImportReferenceSummary,
} from "@/modules/imports/domain/entities/import-preview.entity";
import type {
  ImportBatchApiDto,
  ImportPreviewResponseDto,
  ImportReferencesDto,
  ImportStatusResponseDto,
  ImportTypeSchemaApiDto,
} from "@/modules/imports/application/dto/import.dto";
import type {
  ImportType,
  ImportStatus,
  ImportTypeSchema,
} from "@/modules/imports/domain/entities";

const EMPTY_REFERENCES: ImportReferenceSummary = {
  newBrandsToCreate: [],
  existingBrandsReferenced: [],
  newCategoriesToCreate: [],
  existingCategoriesReferenced: [],
  possibleBrandDuplicates: [],
  possibleCategoryDuplicates: [],
};

export class ImportMapper {
  static toDomain(dto: ImportBatchApiDto): ImportBatch {
    return ImportBatch.create(dto.id, {
      type: dto.type as ImportType,
      status: dto.status as ImportStatus,
      fileName: dto.fileName,
      totalRows: dto.totalRows,
      processedRows: dto.processedRows,
      validRows: dto.validRows,
      invalidRows: dto.invalidRows,
      progress: dto.progress,
      createdBy: dto.createdBy,
      createdAt: dto.createdAt,
      completedAt: dto.completedAt,
      errorMessage: dto.errorMessage,
      note: dto.note,
    });
  }

  static toDetailDomain(dto: ImportStatusResponseDto): ImportBatch {
    return ImportBatch.create(dto.data.id, {
      type: dto.data.type as ImportType,
      status: dto.data.status as ImportStatus,
      fileName: dto.data.fileName,
      totalRows: dto.data.totalRows,
      processedRows: dto.data.processedRows,
      validRows: dto.data.validRows,
      invalidRows: dto.data.invalidRows,
      progress: dto.data.progress,
      createdBy: dto.data.createdBy,
      createdAt: dto.data.createdAt,
      completedAt: dto.data.completedAt,
      errorMessage: dto.data.errorMessage,
      rows: dto.data.rows?.map((row) => ({
        rowNumber: row.rowNumber,
        data: row.data,
        isValid: row.isValid,
        errors: row.errors,
        warnings: row.warnings,
      })),
    });
  }

  static toPreview(dto: ImportPreviewResponseDto): ImportPreview {
    return new ImportPreview(
      dto.data.totalRows,
      dto.data.validRows,
      dto.data.invalidRows,
      dto.data.structureErrors.map((msg) => ({ message: msg })),
      dto.data.rowErrors,
      dto.data.warnings,
      ImportMapper.toReferences(dto.data.references),
    );
  }

  /**
   * Map the optional references block from the preview response. A
   * missing block (older backend) collapses to all-empty arrays so the
   * UI can render without null-checks everywhere.
   */
  private static toReferences(
    dto: ImportReferencesDto | undefined,
  ): ImportReferenceSummary {
    if (!dto) return EMPTY_REFERENCES;
    return {
      newBrandsToCreate: dto.newBrandsToCreate ?? [],
      existingBrandsReferenced: dto.existingBrandsReferenced ?? [],
      newCategoriesToCreate: dto.newCategoriesToCreate ?? [],
      existingCategoriesReferenced: dto.existingCategoriesReferenced ?? [],
      possibleBrandDuplicates: dto.possibleBrandDuplicates ?? [],
      possibleCategoryDuplicates: dto.possibleCategoryDuplicates ?? [],
    };
  }

  static toTypeSchema(dto: ImportTypeSchemaApiDto): ImportTypeSchema {
    return {
      type: dto.type,
      displayName: dto.displayName,
      description: dto.description,
      columns: dto.columns.map((col) => ({
        canonicalName: col.canonicalName,
        displayName: col.displayName,
        description: col.description,
        dataType: col.dataType,
        required: col.required,
        enumValues: col.enumValues,
        example: col.example,
        multiple: col.multiple,
      })),
      exampleRows: dto.exampleRows,
    };
  }
}
