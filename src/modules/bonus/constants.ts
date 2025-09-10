import { KpiCategory, Project } from "@/generated/prisma";

export const projectTypes: Record<Project, string> = {
  [Project.IMPROVEMENT]: "Improvement",
  [Project.PROJECT]: "Project",
}

export const kpiCategoies: Record<KpiCategory, string> = {
  [KpiCategory.CP]: "Customer Perspective",
  [KpiCategory.FP]: "Financial Perspective",
  [KpiCategory.IP]: "Internal Perspective",
  [KpiCategory.L_G]: "Learning & Growth",
}