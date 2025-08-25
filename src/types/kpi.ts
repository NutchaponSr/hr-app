import { Competency, CompetencyItem, CompetencyRecord, CultureItem, CultureRecord } from "@/generated/prisma";

export type TargetPercent = "100" | "90" | "80" | "70";

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