import { Comment, Employee, Kpi, KpiEvaluation, KpiForm, Status } from "@/generated/prisma";

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

export type KpiFormWithInfo = KpiForm & {
  kpis: (Kpi & {
    kpiEvaluations: KpiEvaluation[];
  })[];
  employee: Employee;
}


export const APPROVAL_STATUSES: Status[] = [Status.PENDING_APPROVER, Status.PENDING_CHECKER];