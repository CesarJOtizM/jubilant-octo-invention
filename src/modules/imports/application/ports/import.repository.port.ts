import type { PaginatedResult } from "@/shared/application/dto/pagination.dto";
import type {
  ImportBatch,
  ImportType,
  ImportTypeSchema,
} from "@/modules/imports/domain/entities";
import type { ImportPreview } from "@/modules/imports/domain/entities/import-preview.entity";
import type {
  ImportFilters,
  TemplateFormat,
} from "@/modules/imports/application/dto/import.dto";

export type { PaginatedResult };

/** Optional company bind for STOCK, SALES, MOVEMENTS (and future typed) imports. */
export interface ImportCompanyBind {
  companyId: string;
  companyCode?: string;
}

export interface ImportRepositoryPort {
  findAll(filters: ImportFilters): Promise<PaginatedResult<ImportBatch>>;
  getStatus(id: string): Promise<ImportBatch | null>;
  preview(
    file: File,
    type: ImportType,
    company?: ImportCompanyBind,
  ): Promise<ImportPreview>;
  execute(
    file: File,
    type: ImportType,
    note?: string,
    company?: ImportCompanyBind,
  ): Promise<ImportBatch>;
  downloadTemplate(type: ImportType, format: TemplateFormat): Promise<Blob>;
  downloadErrors(id: string, format: TemplateFormat): Promise<Blob>;
  /**
   * Fetch the full catalog of import types registered on the backend,
   * including column schemas used to drive the wizard dynamically.
   */
  findTypes(): Promise<ImportTypeSchema[]>;
}
