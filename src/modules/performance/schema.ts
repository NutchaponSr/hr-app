import { z } from "zod";

export const kpiBonusSchema = z.object({
  name: z.string().min(1),
  weight: z.number().min(1),
  target: z.object({
    "100": z.string().min(1),
    "90": z.string().min(1),
    "80": z.string().min(1),
    "70": z.string().min(1),
  }),
  definition: z.string().nullable().optional(),
});

export type KpiBonusSchema = z.infer<typeof kpiBonusSchema>;