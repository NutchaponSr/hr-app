import { Comment, Competency, CompetencyRecord, CompetencyType, MeritForm, Position, Task } from "@/generated/prisma";

export interface CompetencyWithInfo extends CompetencyRecord {
  competency: Competency | null;
  comments: Comment[];
  label: string;
  type: CompetencyType[];
}

export interface MeritFormWithInfo extends Task {
  meritForm: MeritForm & {
    competencyRecords: CompetencyWithInfo[];
  }
}

export const MANAGER_UP: Position[] = [
  Position.President, 
  Position.MD, 
  Position.VP,
  Position.GM,
  Position.AGM,
  Position.MGR,
  Position.SMGR
];

export const CHIEF_DOWN: Position[] = [
  Position.Chief,
  Position.Foreman,
  Position.Staff,
  Position.Worker,
  Position.Officer,
];