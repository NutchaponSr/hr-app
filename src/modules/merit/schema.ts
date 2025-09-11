import { z } from "zod";

export const competencyRecordSchema = z.object({
  competencyId: z.string().min(1, "Required"),
  input: z.string().min(1, "Required"),
  output: z.string().min(1, "Required"),
  weight: z.string()
    .nullable()
    .refine((val) => {
      if (!val) return false;
      const num = parseFloat(val);
      return !isNaN(num) && num >= 1 && num <= 100;
    }, {
      message: "Weight must be between 1 and 100"
    }),
});

export type CompetencyRecordSchema = z.infer<typeof competencyRecordSchema>;