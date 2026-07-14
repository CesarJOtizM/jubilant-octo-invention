/** Display name used by BE STOCK (and PRODUCTS) import schemas. */
export const COMPANY_CODE_CSV_HEADER = "Company Code";

/**
 * Ensures every data row has a Company Code cell filled from the selected
 * company when blank. Appends the column when missing. Never overwrites a
 * non-empty existing value (per-row overrides stay intact).
 *
 * Handles simple CSV without quoted commas (stock templates are flat).
 */
export function enrichCsvWithCompanyCode(
  csvText: string,
  companyCode: string,
): string {
  const normalized = csvText.replace(/^\uFEFF/, "");
  const lineEnding = normalized.includes("\r\n") ? "\r\n" : "\n";
  const lines = normalized.split(/\r?\n/).filter((line, index, arr) => {
    // Keep internal blank rows; drop a single trailing empty line from split
    if (index === arr.length - 1 && line === "") return false;
    return true;
  });

  if (lines.length === 0) {
    return `${COMPANY_CODE_CSV_HEADER}${lineEnding}${companyCode}`;
  }

  const headerCells = splitCsvLine(lines[0]);
  const existingIndex = headerCells.findIndex(
    (h) => h.trim().toLowerCase() === COMPANY_CODE_CSV_HEADER.toLowerCase(),
  );

  if (existingIndex === -1) {
    const nextHeader = [...headerCells, COMPANY_CODE_CSV_HEADER];
    const nextRows = lines.slice(1).map((line) => {
      if (line.trim() === "") return line;
      const cells = splitCsvLine(line);
      return [...cells, companyCode].join(",");
    });
    return [nextHeader.join(","), ...nextRows].join(lineEnding);
  }

  const nextRows = lines.slice(1).map((line) => {
    if (line.trim() === "") return line;
    const cells = splitCsvLine(line);
    while (cells.length < headerCells.length) {
      cells.push("");
    }
    const current = (cells[existingIndex] ?? "").trim();
    if (current === "") {
      cells[existingIndex] = companyCode;
    }
    return cells.join(",");
  });

  return [headerCells.join(","), ...nextRows].join(lineEnding);
}

function splitCsvLine(line: string): string[] {
  return line.split(",");
}
