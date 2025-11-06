import { z } from "zod";

import { KpiCategory } from "@/generated/prisma";

const currentYear = new Date().getFullYear();

export const kpiBonusCreateSchema = z.object({
  name: z.string().min(1, "Required").trim(),
  weight: z.coerce
    .string()
    .min(1, "Required")
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= 1 && num <= 100;
      },
      {
        message: "1 to 100",
      },
    )
    .pipe(z.string()),
  category: z.enum(KpiCategory),
  objective: z.string().min(1, "Required").trim(),
  definition: z.string().min(1, "Required").trim(),
  strategy: z.string().min(1, "Required").trim(),
  method: z.string().min(1, "Required").trim(),
  type: currentYear === 2025 ? z.string().nullable() : z.string("Required"),
  target120:
    currentYear === 2025
      ? z.coerce.string().nullable()
      : z.coerce.string().trim().nullable(),
  target100: z.coerce.string().trim().nullable(),
  target90: z.coerce.string().trim().nullable(),
  target80: z.coerce.string().min(1, "Required").trim(),
  target70: z.coerce.string().min(1, "Required").trim(),
});

export const kpiBonusUpdateSchema = kpiBonusCreateSchema.extend({
  id: z.string(),
});

export const kpiFormSchema = z.object({
  kpis: z.array(kpiBonusUpdateSchema).min(1, "At least one KPI is required"),
});

export const kpiBonusEvaluationSchema = z
  .object({
    id: z.string(),
    role: z.enum(["preparer", "checker", "approver"]),
    actualOwner: z.string().nullable(),
    achievementOwner: z.coerce.number().nullable(),
    actualChecker: z.string().nullable(),
    achievementChecker: z.coerce.number().nullable(),
    actualApprover: z.string().nullable(),
    achievementApprover: z.coerce.number().nullable(),
    fileUrl: z.string().nullable(),
  })
  .superRefine((data, ctx) => {
    switch (data.role) {
      case "preparer":
        if (!data.actualOwner || data.actualOwner.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["actualOwner"],
            message: "Required",
          });
        }

        if (!data.achievementOwner) {
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

        if (!data.achievementChecker) {
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

        if (!data.achievementApprover) {
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
  evaluations: z.array(kpiBonusEvaluationSchema),
});

export type KpiFormSchema = z.infer<typeof kpiFormSchema>;
export type KpiBonusUpdateSchema = z.infer<typeof kpiBonusUpdateSchema>;
export type KpiBonusEvaluationSchema = z.infer<typeof kpiBonusEvaluationSchema>;
export type KpiBonusEvaluationsSchema = z.infer<
  typeof kpiBonusEvaluationsSchema
>;
