import { 
  Comment,
  Competency, 
  CompetencyRecord, 
  Culture, 
  CultureRecord, 
  Employee, 
  Status, 
  Task
} from "@/generated/prisma";

export type TargetPercent = "100" | "90" | "80" | "70";
export type StatusVariant = "default" | "red" | "orange" | "purple" | "green";

export type KpiTargetMap = Record<TargetPercent, string | null>;


export interface CultureRecordWithInfo extends CultureRecord {
  culture: Culture;
  weight: number;
  number: number;
  order: number;
}

export interface CompetencyRecordWithInfo extends CompetencyRecord {
  competency: Competency | null;
  number: number;
  order: number;
}

export interface KpiBonusWithInfo extends Task {
  preparer: Employee;
  checker: Employee | null;
  approver: Employee;
}

export interface CommentWithOwner extends Comment {
  employee: Employee;
}

export const STATUS_RECORD: Record<Status | "DONE" | "EVALUATION_1ST" | "EVALUATION_2ND", { label: string; variant: StatusVariant }> = {
  [Status.NOT_STARTED]: { label: "Not Started", variant: "purple" },
  [Status.IN_DRAFT]: { label: "In Draft", variant: "orange" },
  [Status.PENDING_CHECKER]: { label: "Pending Checker", variant: "default" },
  [Status.REJECTED_BY_CHECKER]: { label: "Rejected by Checker", variant: "red" },
  [Status.PENDING_APPROVER]: { label: "Pending Approver", variant: "default" },
  [Status.REJECTED_BY_APPROVER]: { label: "Rejected by Approver", variant: "red" },
  [Status.APPROVED]: { label: "Approved", variant: "green" },
  DONE: { label: "Done", variant: "green" },
  EVALUATION_1ST: { label: "Evaluation 1st", variant: "default" },
  EVALUATION_2ND: { label: "Evaluation 2nd", variant: "default" },
};