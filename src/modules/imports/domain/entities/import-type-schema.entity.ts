/**
 * Declarative description of a single column in an import template.
 * Mirrors the backend IImportColumn shape.
 */
export interface ImportTypeColumn {
  readonly canonicalName: string;
  readonly displayName: string;
  readonly description: string;
  readonly dataType: "string" | "number" | "date" | "boolean" | "enum";
  readonly required: boolean;
  readonly enumValues?: readonly string[];
  readonly example: string | number | boolean;
  readonly multiple?: boolean;
}

/**
 * Full schema for one import type, exposed by the backend's handler
 * registry via GET /imports/types. The frontend consumes this to drive
 * the wizard dynamically instead of hardcoding each supported type.
 */
export interface ImportTypeSchema {
  readonly type: string;
  readonly displayName: string;
  readonly description: string;
  readonly columns: readonly ImportTypeColumn[];
  readonly exampleRows: ReadonlyArray<Record<string, unknown>>;
}

/**
 * Helpers to query a schema — kept as standalone functions so the
 * interface stays plain data safe to serialize or pass over RSC.
 */
export const ImportTypeSchemaUtils = {
  requiredColumnCount(schema: ImportTypeSchema): number {
    return schema.columns.filter((col) => col.required).length;
  },

  optionalColumnCount(schema: ImportTypeSchema): number {
    return schema.columns.length - this.requiredColumnCount(schema);
  },

  hasMultipleValueColumn(schema: ImportTypeSchema): boolean {
    return schema.columns.some((col) => col.multiple === true);
  },

  enumColumnCount(schema: ImportTypeSchema): number {
    return schema.columns.filter((col) => col.dataType === "enum").length;
  },
};
