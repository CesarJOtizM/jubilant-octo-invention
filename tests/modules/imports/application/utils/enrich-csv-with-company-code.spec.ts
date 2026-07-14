import { describe, it, expect } from "vitest";
import { enrichCsvWithCompanyCode } from "@/modules/imports/application/utils/enrich-csv-with-company-code";

describe("enrichCsvWithCompanyCode", () => {
  it("Given: CSV without Company Code column When: enrich Then: appends column filled with companyCode", () => {
    const input = [
      "Product SKU,Warehouse Code,Quantity",
      "PROD-001,WH-001,10",
      "PROD-002,WH-001,20",
    ].join("\n");

    const result = enrichCsvWithCompanyCode(input, "NEG-002");

    expect(result).toBe(
      [
        "Product SKU,Warehouse Code,Quantity,Company Code",
        "PROD-001,WH-001,10,NEG-002",
        "PROD-002,WH-001,20,NEG-002",
      ].join("\n"),
    );
  });

  it("Given: CSV with empty Company Code cells When: enrich Then: fills blanks without overwriting existing codes", () => {
    const input = [
      "Product SKU,Warehouse Code,Quantity,Company Code",
      "PROD-001,WH-001,10,",
      "PROD-002,WH-001,20,OTHER-01",
      "PROD-003,WH-002,5,",
    ].join("\n");

    const result = enrichCsvWithCompanyCode(input, "NEG-002");

    expect(result).toBe(
      [
        "Product SKU,Warehouse Code,Quantity,Company Code",
        "PROD-001,WH-001,10,NEG-002",
        "PROD-002,WH-001,20,OTHER-01",
        "PROD-003,WH-002,5,NEG-002",
      ].join("\n"),
    );
  });

  it("Given: CRLF CSV When: enrich Then: preserves row data and fills missing Company Code", () => {
    const input = [
      "Product SKU,Warehouse Code,Quantity",
      "PROD-001,WH-001,10",
    ].join("\r\n");

    const result = enrichCsvWithCompanyCode(input, "GYM-001");

    expect(result.split(/\r?\n/)).toEqual([
      "Product SKU,Warehouse Code,Quantity,Company Code",
      "PROD-001,WH-001,10,GYM-001",
    ]);
  });
});
