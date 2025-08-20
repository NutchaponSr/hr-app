import { Competency, CompetencyItem, CompetencyRecord, CultureItem, CultureRecord } from "@/generated/prisma";

export type TargetPercent = "100" | "90" | "80" | "70";

export type KpiTargetMap = Record<TargetPercent, string | null>;

export interface OrganizationCulture extends CultureItem {
  order: number;
  cultureCode: string;
  cultureName: string;
  description: string;
  beliefs: string[];
} 

export interface CultureRecordWithItem extends CultureRecord {
  cultureItems: CultureItem[]
}

export interface CompetencyRecordWithItem extends CompetencyRecord {
  competencyItem: (CompetencyItem & {
    competency: Competency | null;
  })[];
}

export interface CompetencyItemWithInfo extends CompetencyItem {
  competency: Competency | null;
}