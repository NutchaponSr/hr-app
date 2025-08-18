import { z } from "zod";

export const kpiBonusSchema = z.object({
  name: z.string().min(1, "Name is required"),
  weight: z.string().min(1, "Weight is required"),
  objective: z.string().min(1, "Objective is required"),
  strategy: z.enum(["POEPLE_CAPABILITY", "POEPLE_CONTINUITY", "POEPLE_EFFICIENCY", "OTHER"], "Link to Strategy is required"),
  type: z.enum(["PROJECT", "IMPROVEMENT"], "Type is required"),
  target100: z.string().min(1),
  target90: z.string().min(1),
  target80: z.string().min(1),
  target70: z.string().min(1),
});

export type KpiBonusSchema = z.infer<typeof kpiBonusSchema>;