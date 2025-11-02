import { Comment, Employee, Kpi, KpiForm, Status } from "@/generated/prisma";

export type KpiWithComments = Kpi & {
  comments: (Comment & {
    employee: Employee;
  })[];
};

export type KpiWithEvaluation = Kpi & {
  comments: (Comment & {
    employee: Employee;
  })[];
};

export type KpiFormWithInfo = KpiForm & {
  kpis: Kpi[];
  employee: Employee;
};

export type KpiFormWithKpi = KpiForm & {
  kpis: Kpi[];
};

export const APPROVAL_STATUSES: Status[] = [
  Status.PENDING_APPROVER,
  Status.PENDING_CHECKER,
];
