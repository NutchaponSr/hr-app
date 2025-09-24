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

// Per-role evaluation schemas (client-side strict validation)
export const kpiBonusEvaluationPreparerSchema = z.object({
  id: z.string(),
  actualOwner: z.string().min(1, "Required"),
  achievementOwner: z.coerce.number().min(1, "Required"),
  // optional for preparer
  actualChecker: z.string().min(1, "Required"),
  achievementChecker: z.coerce.number().min(1, "Required"),
  actualApprover: z.string().optional(),
  achievementApprover: z.coerce.number().optional(),
  fileUrl: z.string().nullable(),
});

export const kpiBonusEvaluationCheckerSchema = z.object({
  id: z.string(),
  // readonly owner fields (not required on submit)
  actualOwner: z.string().optional(),
  achievementOwner: z.coerce.number().optional(),
  // required for checker
  actualChecker: z.string().min(1, "Required"),
  achievementChecker: z.coerce.number().min(1, "Required"),
  // optional for checker
  actualApprover: z.string().optional(),
  achievementApprover: z.coerce.number().optional(),
  fileUrl: z.string().nullable().optional(),
});

export const kpiBonusEvaluationApproverSchema = z.object({
  id: z.string(),
  // readonly owner/checker fields (not required on submit)
  actualOwner: z.string().optional(),
  achievementOwner: z.coerce.number().optional(),
  actualChecker: z.string().optional(),
  achievementChecker: z.coerce.number().optional(),
  // required for approver
  actualApprover: z.string().optional(),
  achievementApprover: z.coerce.number().min(1, "Required"),
  fileUrl: z.string().nullable().optional(),
});

// Server-side permissive schema (accept any role payload)
export const kpiBonusEvaluationAnyRoleSchema = z.union([
  kpiBonusEvaluationPreparerSchema,
  kpiBonusEvaluationCheckerSchema,
  kpiBonusEvaluationApproverSchema,
]);

export const kpiBonusEvaluationsSchema = z.object({
  evaluations: z.array(kpiBonusEvaluationAnyRoleSchema),
});

export type KpiFormSchema = z.infer<typeof kpiFormSchema>
export type KpiBonusUpdateSchema = z.infer<typeof kpiBonusUpdateSchema>;
export type KpiBonusEvaluationsSchema = z.infer<typeof kpiBonusEvaluationsSchema>;