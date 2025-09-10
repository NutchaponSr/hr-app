import { z } from "zod";

import { KpiCategory } from "@/generated/prisma";

export const kpiBonusCreateSchema = z.object({
  name: z.string(),
  weight: z.coerce.string(),
  category: z.enum(KpiCategory),
  objective: z.string(),
  definition: z.string(),
  strategy: z.string(),
  type: z.enum(["PROJECT", "IMPROVEMENT"]),
  target100: z.string(),
  target90: z.string(),
  target80: z.string(),
  target70: z.string(),
});

export type KpiBonusCreateSchema = z.infer<typeof kpiBonusCreateSchema>;