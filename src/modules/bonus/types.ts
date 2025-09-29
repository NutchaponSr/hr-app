import { Comment, Employee, Kpi, KpiEvaluation } from "@/generated/prisma";

export type KpiWithComments = Kpi & {
  comments: (Comment & {
    employee: Employee;
  })[];
}

export type KpiWithEvaluation = Kpi & {
  kpiEvaluations: KpiEvaluation[];
  comments: (Comment & {
    employee: Employee;
  })[];
}

export type KpiWithInfo = Kpi & {
  kpiEvaluations: KpiEvaluation[];
}