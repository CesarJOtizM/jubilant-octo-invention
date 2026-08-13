import { Entity } from "@/shared/domain";

/**
 * Open string type aligned with the backend. The list of valid
 * identifiers is owned by the server's handler registry and exposed
 * via GET /imports/types, so the frontend deliberately avoids a closed
 * union here: adding a new import type on the server becomes a pure
 * runtime discovery with zero frontend code changes.
 *
 * The KNOWN_IMPORT_TYPES constant keeps the legacy identifiers around
 * for components that need icon mappings or hardcoded copy while the
 * full dynamic catalog is fetched from the backend.
 */
export type ImportType = string;

export const KNOWN_IMPORT_TYPES = [
  "PRODUCTS",
  "MOVEMENTS",
  "WAREHOUSES",
  "STOCK",
  "TRANSFERS",
  "SALES",
] as const;

export type KnownImportType = (typeof KNOWN_IMPORT_TYPES)[number];

export type ImportStatus =
  | "PENDING"
  | "VALIDATING"
  | "VALIDATED"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

export interface ImportRowData {
  rowNumber: number;
  data: Record<string, unknown>;
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

interface ImportBatchProps {
  type: ImportType;
  status: ImportStatus;
  fileName: string;
  totalRows: number;
  processedRows: number;
  validRows: number;
  invalidRows: number;
  progress: number;
  createdBy: string;
  createdAt: string;
  completedAt?: string;
  errorMessage?: string;
  note?: string;
  rows?: ImportRowData[];
}

export class ImportBatch extends Entity<string> {
  private readonly props: ImportBatchProps;

  private constructor(id: string, props: ImportBatchProps) {
    super(id);
    this.props = props;
  }

  static create(id: string, props: ImportBatchProps): ImportBatch {
    return new ImportBatch(id, props);
  }

  get type(): ImportType {
    return this.props.type;
  }

  get status(): ImportStatus {
    return this.props.status;
  }

  get fileName(): string {
    return this.props.fileName;
  }

  get totalRows(): number {
    return this.props.totalRows;
  }

  get processedRows(): number {
    return this.props.processedRows;
  }

  get validRows(): number {
    return this.props.validRows;
  }

  get invalidRows(): number {
    return this.props.invalidRows;
  }

  get progress(): number {
    return this.props.progress;
  }

  get createdBy(): string {
    return this.props.createdBy;
  }

  get createdAt(): string {
    return this.props.createdAt;
  }

  get completedAt(): string | undefined {
    return this.props.completedAt;
  }

  get errorMessage(): string | undefined {
    return this.props.errorMessage;
  }

  get note(): string | undefined {
    return this.props.note;
  }

  get rows(): ImportRowData[] {
    return this.props.rows ?? [];
  }

  toJSON() {
    return { id: this._id, ...this.props };
  }

  get isTerminal(): boolean {
    return this.props.status === "COMPLETED" || this.props.status === "FAILED";
  }

  get isProcessing(): boolean {
    return (
      this.props.status === "VALIDATING" || this.props.status === "PROCESSING"
    );
  }

  get successRate(): number {
    if (this.props.totalRows === 0) return 0;
    return Math.round((this.props.validRows / this.props.totalRows) * 100);
  }
}
