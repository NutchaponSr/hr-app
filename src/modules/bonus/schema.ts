import { z } from "zod";

import { KpiCategory } from "@/generated/prisma";

export const kpiBonusCreateSchema = z.object({
  name: z.string().min(1, "Required"),
  weight: z.coerce.string()
    .nullable()
    .refine((val) => {
      if (!val) return false;
      const num = parseFloat(val);
      return !isNaN(num) && num >= 1 && num <= 100;
    }, {
      message: "Weight must be between 1 and 100"
    }),
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

export type KpiBonusCreateSchema = z.infer<typeof kpiBonusCreateSchema>;