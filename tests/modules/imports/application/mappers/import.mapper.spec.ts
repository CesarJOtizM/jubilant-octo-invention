import { describe, it, expect } from "vitest";
import { ImportMapper } from "@/modules/imports/application/mappers/import.mapper";
import type {
  ImportBatchApiDto,
  ImportPreviewResponseDto,
  ImportTypeSchemaApiDto,
} from "@/modules/imports/application/dto/import.dto";

describe("ImportMapper", () => {
  describe("toDomain", () => {
    it("should map API DTO to domain entity", () => {
      const dto: ImportBatchApiDto = {
        id: "batch-1",
        type: "PRODUCTS",
        status: "COMPLETED",
        fileName: "products.csv",
        totalRows: 100,
        processedRows: 100,
        validRows: 95,
        invalidRows: 5,
        progress: 100,
        createdBy: "user-1",
        createdAt: "2024-01-01T00:00:00Z",
        completedAt: "2024-01-01T00:05:00Z",
      };

      const batch = ImportMapper.toDomain(dto);

      expect(batch.id).toBe("batch-1");
      expect(batch.type).toBe("PRODUCTS");
      expect(batch.status).toBe("COMPLETED");
      expect(batch.isTerminal).toBe(true);
      expect(batch.successRate).toBe(95);
    });
  });

  describe("toPreview", () => {
    it("should map preview response to domain", () => {
      const dto: ImportPreviewResponseDto = {
        success: true,
        message: "ok",
        data: {
          totalRows: 10,
          validRows: 8,
          invalidRows: 2,
          structureErrors: ["Missing column: SKU"],
          rowErrors: [
            { rowNumber: 3, error: "Missing name", severity: "error" },
          ],
          warnings: ["Unknown column ignored"],
        },
        timestamp: "2024-01-01",
      };

      const preview = ImportMapper.toPreview(dto);

      expect(preview.totalRows).toBe(10);
      expect(preview.validRows).toBe(8);
      expect(preview.invalidRows).toBe(2);
      expect(preview.canBeProcessed).toBe(false);
      expect(preview.structureErrors).toHaveLength(1);
      expect(preview.rowErrors).toHaveLength(1);
      expect(preview.hasWarnings).toBe(true);
    });

    it("Given: response without references block When: mapping Then: should fall back to empty references", () => {
      const dto: ImportPreviewResponseDto = {
        success: true,
        message: "ok",
        data: {
          totalRows: 1,
          validRows: 1,
          invalidRows: 0,
          structureErrors: [],
          rowErrors: [],
          warnings: [],
        },
        timestamp: "2024-01-01",
      };

      const preview = ImportMapper.toPreview(dto);

      expect(preview.hasReferences).toBe(false);
      expect(preview.hasPossibleDuplicates).toBe(false);
      expect(preview.references.newBrandsToCreate).toEqual([]);
    });

    it("Given: references with new brands and duplicates When: mapping Then: should expose them on the preview", () => {
      const dto: ImportPreviewResponseDto = {
        success: true,
        message: "ok",
        data: {
          totalRows: 2,
          validRows: 2,
          invalidRows: 0,
          structureErrors: [],
          rowErrors: [],
          warnings: [],
          references: {
            newBrandsToCreate: ["Adidas", "Puma"],
            existingBrandsReferenced: ["Nike"],
            newCategoriesToCreate: [],
            existingCategoriesReferenced: ["Clothing"],
            possibleBrandDuplicates: [
              { canonical: "Nike", variants: ["Nike", "NIKE"] },
            ],
            possibleCategoryDuplicates: [],
          },
        },
        timestamp: "2024-01-01",
      };

      const preview = ImportMapper.toPreview(dto);

      expect(preview.hasReferences).toBe(true);
      expect(preview.hasPossibleDuplicates).toBe(true);
      expect(preview.references.newBrandsToCreate).toEqual(["Adidas", "Puma"]);
      expect(preview.references.possibleBrandDuplicates[0].variants).toEqual([
        "Nike",
        "NIKE",
      ]);
    });
  });

  describe("toTypeSchema", () => {
    it("Given: a type schema API DTO When: mapping Then: should preserve column metadata", () => {
      const dto: ImportTypeSchemaApiDto = {
        type: "PRODUCTS",
        displayName: "Products",
        description: "Import the product catalog",
        columns: [
          {
            canonicalName: "sku",
            displayName: "SKU",
            description: "Unique product SKU",
            dataType: "string",
            required: true,
            example: "PROD-001",
          },
          {
            canonicalName: "categories",
            displayName: "Categories",
            description: "Pipe-separated",
            dataType: "string",
            required: false,
            multiple: true,
            example: "Clothing|Men",
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
        exampleRows: [{ SKU: "PROD-001" }],
      };

      const schema = ImportMapper.toTypeSchema(dto);

      expect(schema.type).toBe("PRODUCTS");
      expect(schema.displayName).toBe("Products");
      expect(schema.columns).toHaveLength(3);
      expect(schema.columns[1].multiple).toBe(true);
      expect(schema.columns[2].enumValues).toEqual(["ACTIVE", "INACTIVE"]);
      expect(schema.exampleRows).toEqual([{ SKU: "PROD-001" }]);
    });
  });
});
