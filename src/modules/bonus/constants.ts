import { KpiCategory, Period, Project } from "@/generated/prisma";
import { ExportColumn } from "@/types/upload";

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

export const periods: Record<Period, string> = {
  [Period.IN_DRAFT]: "In draft",
  [Period.EVALUATION_1ST]: "Evaluation 1 st",
  [Period.EVALUATION_2ND]: "Evaluation 2 nd",
}

export const columns: ExportColumn[] = [
  {
    key: "employeeId",
    header: "รหัสพนักงาน",
  },
  {
    key: "employeeName",
    header: "ชื่อพนักงาน",
  },
  {
    key: "year",
    header: "Year",
  },
  {
    key: "period",
    header: "Period",
  },
  {
    key: "performer",
    header: "Performer",
  },
  {
    key: "name",
    header: "ชื่อ KPI",
  },
  {
    key: "percentage",
    header: "Percentage (%)",
  },
]