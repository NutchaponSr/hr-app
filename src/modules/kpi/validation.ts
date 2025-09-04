import { Project } from "@/generated/prisma";
import { ExcelData } from "@/types/upload";

const kpiAllowedColumns = [
  "id",
  "name",
  "weight",
  "objective",
  "strategy",
  "target100",
  "target90",
  "target80",
  "target70",
  "type",
  "definition",
  "method",
  "kpiFormId",
] as const;

const kpiRequiredColumns: ReadonlyArray<(typeof kpiAllowedColumns)[number]> = [
  "name",
  "strategy",
  "objective",
  "type",
  "weight",
  "definition",
  "target70",
  "target80",
  "target90",
  "target100"
];

export type KpiCsvValidationResult = {
  ok: boolean;
  errors: string[];
  warnings: string[];
};

export const validateKpiCsv = (data: ExcelData): KpiCsvValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!Array.isArray(data) || data.length === 0) {
    return { ok: false, errors: ["ไม่มีข้อมูลในไฟล์"], warnings };
  }

  const header = Object.keys(data[0] || {}).filter((k) => k !== "_rowIndex");

  // Missing required columns
  const missing = kpiRequiredColumns.filter((c) => !header.includes(c));
  if (missing.length > 0) {
    errors.push(`คอลัมน์ที่จำเป็นหายไป: ${missing.join(", ")}`);
  }

  // Unknown columns
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const unknown = header.filter((c) => !kpiAllowedColumns.includes(c as any));
  if (unknown.length > 0) {
    warnings.push(`พบคอลัมน์ที่ไม่รู้จักและจะถูกข้าม: ${unknown.join(", ")}`);
  }

  // Validate enum values for `type`
  const enumArray = Object.values(Project);
  const enumValues = new Set(enumArray);
  for (const [rowIndex, row] of data.entries()) {
    const value = row["type"];
    if (value == null || value === "") continue;
    if (!enumValues.has(String(value) as Project)) {
      errors.push(
        `แถวที่ ${rowIndex + 1}: ค่า 'type' ไม่ถูกต้อง (${String(value)}). ต้องเป็นหนึ่งใน: ${enumArray.join(", ")}`,
      );
      // do not break to collect more errors
    }
  }

  return { ok: errors.length === 0, errors, warnings };
};


