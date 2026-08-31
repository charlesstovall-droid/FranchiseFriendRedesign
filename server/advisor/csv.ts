import type { AdvisorApprovedBrand } from "@shared/schema";

export const BRAND_CSV_HEADERS = [
  "brandName",
  "category",
  "investmentRange",
  "minLiquidity",
  "ownerRole",
  "employeeProfile",
  "salesModel",
  "recurringRevenueCharacteristics",
  "brickAndMortarRequirements",
  "buildoutLevel",
  "typicalDevelopmentStructure",
  "availableTerritories",
  "fddYear",
  "sbaDirectoryStatus",
  "chuckNotes",
  "approvedForAi",
  "dateLastVerified",
] as const;

function escapeCell(value: unknown): string {
  const text = value == null ? "" : String(value);
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function brandsToCsv(brands: AdvisorApprovedBrand[]): string {
  const lines = [BRAND_CSV_HEADERS.join(",")];
  for (const brand of brands) {
    lines.push(
      BRAND_CSV_HEADERS.map((key) => {
        if (key === "approvedForAi") return brand.approvedForAi ? "true" : "false";
        if (key === "dateLastVerified") return brand.dateLastVerified ? brand.dateLastVerified.toISOString() : "";
        return escapeCell((brand as Record<string, unknown>)[key]);
      }).join(","),
    );
  }
  return lines.join("\n");
}

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  const src = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"' && src[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(cell.trim());
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(cell.trim());
      if (row.some((c) => c.length)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += ch;
    }
  }
  if (cell.length || row.length) {
    row.push(cell.trim());
    if (row.some((c) => c.length)) rows.push(row);
  }
  return rows;
}

export function csvToBrandRows(text: string): Array<Record<string, string>> {
  const rows = parseCsv(text);
  if (!rows.length) return [];
  const headers = rows[0].map((h) => h.replace(/\s+/g, ""));
  return rows.slice(1).map((values) => {
    const record: Record<string, string> = {};
    headers.forEach((header, i) => {
      record[header] = values[i] || "";
    });
    return record;
  });
}
