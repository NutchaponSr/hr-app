import { Competency, CompetencyItem, CompetencyRecord, CultureItem, CultureRecord, Status } from "@/generated/prisma";

export type TargetPercent = "100" | "90" | "80" | "70";
export type StatusVariant = "default" | "red" | "orange" | "purple";

export type KpiTargetMap = Record<TargetPercent, string | null>;

export interface OrganizationCulture extends CultureItem {
  name: string;
  cultureCode: string;
  description: string;
  beliefs: string[];
  number: number;
  order: number;
  weight: number;
} 

export interface CultureRecordWithItem extends CultureRecord {
  cultureItems: OrganizationCulture[];
}

export interface CompetencyRecordWithItem extends CompetencyRecord {
  competencyItem: (CompetencyItem & {
    competency: Competency | null;
    order: number;
    number: number;
  })[];
}

export interface CompetencyItemWithInfo extends CompetencyItem {
  competency: Competency | null;
  order: number;
  number: number;
}

export const STATUS_RECORD: Record<Status, { label: string; variant: StatusVariant }> = {
  [Status.NOT_STARTED]: { label: "Not Started", variant: "purple" },
  [Status.IN_DRAFT]: { label: "In Draft", variant: "orange" },
  [Status.PENDING_CHECKER]: { label: "Pending Checker", variant: "default" },
  [Status.REJECTED_BY_CHECKER]: { label: "Rejected by Checker", variant: "red" },
  [Status.PENDING_APPROVER]: { label: "Pending Approver", variant: "default" },
  [Status.REJECTED_BY_APPROVER]: { label: "Rejected by Approver", variant: "red" },
  [Status.APPROVED]: { label: "Approved", variant: "default" },
  [Status.REVISION]: { label: "Revision", variant: "orange" },
};