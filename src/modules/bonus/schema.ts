import { z } from "zod";

export const kpiBonusSchema = z.object({
  name: z.string().optional().nullable(),
  weight: z.coerce.string().optional().nullable(),
  objective: z.string().optional().nullable(),
  definition: z.string().optional().nullable(),
  strategy: z.string().optional().nullable(),
  type: z.enum(["PROJECT", "IMPROVEMENT"]).optional().nullable(),
  target100: z.string().optional().nullable(),
  target90: z.string().optional().nullable(),
  target80: z.string().optional().nullable(),
  target70: z.string().optional().nullable(),
});

export type KpiBonusSchema = z.infer<typeof kpiBonusSchema>;