import { z } from "zod";

import { CompetencyType, Division, Position } from "@/generated/prisma";
import { kpiBonusEvaluationSchema } from "../bonus/schema";

export const commentSchema = z.object({
  employee: z.object({
    id: z.string(),
    email: z.string().nullable(),
    fullName: z.string(),
    position: z.string(),
    division: z.enum(Division),
    level: z.enum(Position),
    rank: z.enum(Position),
    department: z.string(),
  }),
  id: z.string(),
  connectId: z.string(),
  content: z.string().min(1, "Comment cannot be empty"),
  createdBy: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const competencySchema = z.object({
  id: z.string(),
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
  types: z.array(z.enum(CompetencyType)),
  label: z.string(),
  t1: z.string().nullable().optional(),
  t2: z.string().nullable().optional(),
  t3: z.string().nullable().optional(),
  t4: z.string().nullable().optional(),
  t5: z.string().nullable().optional(),
  comments: z.array(commentSchema),
});

export const cultureSchema = z.object({
  id: z.string(),
  evidence: z.string().min(1, "Required"),
  name: z.string(),
  description: z.string(),
  code: z.string(),
  weight: z.string(),
  cultureId: z.number(),
  comments: z.array(commentSchema),
});

export const meritSchema = z.object({
  competencies: z.array(competencySchema),
  cultures: z.array(cultureSchema),
});

export const competencyEvaluationSchema = z.object({
  id: z.string(),
  role: z.enum(["preparer", "checker", "approver"]),
  inputEvidenceOwner: z.string().nullable(),
  outputEvidenceOwner: z.string().nullable(),
  levelOwner: z.coerce.number().nullable(),

  inputEvidenceChecker: z.string().nullable(),
  outputEvidenceChecker: z.string().nullable(),
  levelChecker: z.coerce.number().nullable(),

  inputEvidenceApprover: z.string().nullable(),
  outputEvidenceApprover : z.string().nullable(),
  levelApprover: z.coerce.number().nullable(),
}).superRefine((data, ctx) => {
  switch (data.role) {
    case "preparer": 
      if (!data.inputEvidenceOwner || data.inputEvidenceOwner.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["inputEvidenceOwner"],
          message: "Required",
        })
      }

      if (!data.outputEvidenceOwner || data.outputEvidenceOwner.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["outputEvidenceOwner"],
          message: "Required",
        })
      }
      
      if (!data.levelOwner || data.levelOwner < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["levelOwner"],
          message: "Required",
        })
      }

      break;
    case "checker":
      if (!data.inputEvidenceChecker || data.inputEvidenceChecker.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["inputEvidenceChecker"],
          message: "Required",
        })
      }

      if (!data.outputEvidenceChecker || data.outputEvidenceChecker.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["outputEvidenceChecker"],
          message: "Required",
        })
      }
      
      if (!data.levelChecker || data.levelChecker < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["levelChecker"],
          message: "Required",
        })
      }

      break;
    case "approver":
      if (!data.inputEvidenceApprover || data.inputEvidenceApprover.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["inputEvidenceApprover"],
          message: "Required",
        })
      }

      if (!data.outputEvidenceApprover || data.outputEvidenceApprover.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["outputEvidenceApprover"],
          message: "Required",
        })
      }
      
      if (!data.levelApprover || data.levelApprover < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["levelApprover"],
          message: "Required",
        })
      }

      break;
  }
});

export const cultureEvaluationSchema = z.object({
  id: z.string(),
  role: z.enum(["preparer", "checker", "approver"]),
  levelBehaviorOwner: z.coerce.number().nullable(),
  levelBehaviorChecker: z.coerce.number().nullable(),
  levelBehaviorApprover: z.coerce.number().nullable(),
  actualOwner: z.string().nullable(),
  actualChecker: z.string().nullable(),
  actualApprover: z.string().nullable(),
}).superRefine((data, ctx) => {
  switch (data.role) {
    case "preparer":
      if (!data.levelBehaviorOwner) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["levelBehaviorOwner"],
          message: "Required",
        });
      }

      if (!data.actualOwner || data.actualOwner.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["actualOwner"],
          message: "Required",
        });
      }

      break;
    case "checker":
      if (!data.levelBehaviorChecker) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["levelBehaviorChecker"],
          message: "Required",
        });
      }

      if (!data.actualChecker || data.actualChecker.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["actualChecker"],
          message: "Required",
        });
      }
      
      break;
    case "approver":
      if (!data.levelBehaviorApprover) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["levelBehaviorApprover"],
          message: "Required",
        });
      }

      if (!data.actualApprover || data.actualApprover.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["actualApprover"],
          message: "Required",
        });
      }
      
      break;
  }
});


export const meritEvaluationSchema = z.object({
  competencies: z.array(competencyEvaluationSchema),
  cultures: z.array(cultureEvaluationSchema),
  kpis: z.array(kpiBonusEvaluationSchema),
});

export type MeritEvaluationSchema = z.infer<typeof meritEvaluationSchema>;
export type MeritSchema = z.infer<typeof meritSchema>;
export type ComptencySchema = z.infer<typeof competencySchema>;