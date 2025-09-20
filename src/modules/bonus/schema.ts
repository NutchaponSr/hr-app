import { z } from "zod";

import { KpiCategory } from "@/generated/prisma";

export const kpiBonusCreateSchema = z.object({
  name: z.string().min(1, "Required"),
  weight: z.coerce.string()
    .min(1, "Required")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 1 && num <= 100;
    }, {
      message: "1 to 100"
    })
    .pipe(z.string()),
  category: z.enum(KpiCategory),
  objective: z.string().min(1, "Required"),
  definition: z.string().min(1, "Required"),
  strategy: z.string().min(1, "Required"),
  type: z.enum(["PROJECT", "IMPROVEMENT"]),
  target100: z.string().min(1, "Required"),
  target90: z.string().min(1, "Required"),
  target80: z.string().min(1, "Required"),
  target70: z.string().min(1, "Required"),
});

export const kpiBonusUpdateSchema = kpiBonusCreateSchema.extend({
  id: z.string(),
});

export const kpiFormSchema = z.object({
  kpis: z.array(kpiBonusUpdateSchema).min(1, "At least one KPI is required"),
});

export type KpiBonusUpdateSchema = z.infer<typeof kpiBonusUpdateSchema>;
export type KpiFormSchema = z.infer<typeof kpiFormSchema>