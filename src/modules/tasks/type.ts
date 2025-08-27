import { Employee, KpiEvaluation, KpiRecord } from "@/generated/prisma";

export interface TaskWithInfo extends KpiRecord {
  KpiEvaluations: KpiEvaluation[];
  employee: Employee;
}