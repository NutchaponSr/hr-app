import { z } from "zod";

import { CompetencyType, Division, Position } from "@/generated/prisma";

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

export type MeritSchema = z.infer<typeof meritSchema>;