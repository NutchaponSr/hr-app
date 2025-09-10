import { z } from "zod";

import { ExcelData } from "@/types/upload";
import { validateKpiCsv } from "@/modules/kpi/validation";
import { kpiBonusCreateSchema } from "@/modules/bonus/schema";

export const validateKpiRows = (rows: ExcelData) => {
  const base = validateKpiCsv(rows);
  const rowErrors: string[] = [];
  const validRows: z.infer<typeof kpiBonusCreateSchema>[] = [];

  if (!base.ok) {
    return { ok: false, errors: base.errors, warnings: base.warnings, validRows } as const;
  }

  rows.forEach((row, idx) => {
    const parsed = kpiBonusCreateSchema.safeParse(row);
    if (!parsed.success) {
      const issues = parsed.error.issues
        .map((i) => `${i.path.join(".") || "root"}: ${i.message}`)
        .join(", ");
      rowErrors.push(`แถวที่ ${idx + 1}: ${issues}`);
    } else {
      validRows.push(parsed.data);
    }
  });

  if (rowErrors.length > 0) {
    return { ok: false, errors: [...base.errors, ...rowErrors], warnings: base.warnings, validRows } as const;
  }

  return { ok: true, errors: [], warnings: base.warnings, validRows } as const;
};


