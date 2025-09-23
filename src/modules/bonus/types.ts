import { Comment, Employee, Kpi } from "@/generated/prisma";

export type KpiWithComments = Kpi & {
  comments: (Comment & {
    employee: Employee;
  })[];
}