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

// ...existing code...
export const kpiBonusEvaluationSchema = z.object({
  id: z.string(),
  role: z.enum(["preparer", "checker", "approver"]),
  actualOwner: z.string().optional(),
  achievementOwner: z.coerce.number().optional(),
  actualChecker: z.string().optional(),
  achievementChecker: z.coerce.number().optional(),
  actualApprover: z.string().optional(),
  achievementApprover: z.coerce.number().optional(),
  fileUrl: z.string().nullable(),
}).superRefine((data, ctx) => {
  // attach field-level issues so react-hook-form can show them per-field
  switch (data.role) {
    case "preparer":
      if (!data.actualOwner || data.actualOwner.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["actualOwner"],
          message: "Required",
        });
      }
      if (data.achievementOwner === undefined || data.achievementOwner < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["achievementOwner"],
          message: "Required",
        });
      }
      break;
    case "checker":
      if (!data.actualChecker || data.actualChecker.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["actualChecker"],
          message: "Required",
        });
      }
      if (data.achievementChecker === undefined || data.achievementChecker < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["achievementChecker"],
          message: "Required",
        });
      }
      break;
    case "approver":
      if (!data.actualApprover || data.actualApprover.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["actualApprover"],
          message: "Required",
        });
      }
      if (data.achievementApprover === undefined || data.achievementApprover < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["achievementApprover"],
          message: "Required",
        });
      }
      break;
    default:
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["role"],
        message: "Invalid role",
      });
  }
});

export const kpiBonusEvaluationsSchema = z.object({
  evaluations: z.array(kpiBonusEvaluationSchema)
});

export type KpiFormSchema = z.infer<typeof kpiFormSchema>
export type KpiBonusUpdateSchema = z.infer<typeof kpiBonusUpdateSchema>;
export type KpiBonusEvaluationsSchema = z.infer<typeof kpiBonusEvaluationsSchema>;